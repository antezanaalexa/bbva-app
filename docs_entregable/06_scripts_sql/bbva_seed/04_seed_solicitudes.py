import os
import sys
import uuid
import random
from sqlalchemy import text

sys.path.append(r'c:\Proyectos\BBVA\core-backend')
from app.core.cfg_database import SessionLocal

def main():
    db = SessionLocal()
    print("=== Iniciando Seed de Solicitudes BBVA ===")
    
    usuarios = db.execute(text("SELECT id, pkcliente, dni FROM app_usuarios")).fetchall()
    if not usuarios:
        print("Error: No hay usuarios.")
        return

    insertadas = 0

    for user in usuarios:
        user_id = user[0]
        pkcliente = user[1]
        
        # 30% de clientes pedirán un préstamo
        if random.random() > 0.3:
            continue
            
        monto = round(random.uniform(5000.0, 350000.0), 2)
        plazo_meses = random.choice([12, 24, 36, 48, 60])
        tasa_anual = 15.5
        
        # Reglas de aprobación
        if monto <= 30000:
            nivel = 'asesor'
        elif monto <= 100000:
            nivel = 'administrador'
        elif monto <= 300000:
            nivel = 'jefe_regional'
        else:
            nivel = 'riesgos'
            
        ingresos_mensuales = round(random.uniform(1500.0, 15000.0), 2)
        cuotas_actuales = round(random.uniform(0.0, ingresos_mensuales * 0.4), 2)
        
        # Fórmula cuota (simplificada para seed)
        tasa_mensual = tasa_anual / 100 / 12
        cuota = (monto * tasa_mensual) / (1 - (1 + tasa_mensual) ** -plazo_meses)
        
        # RDS = (cuota + cuotas_actuales) / ingresos
        rds = ((cuota + cuotas_actuales) / ingresos_mensuales) * 100
        
        if rds <= 35:
            semaforo = 'verde'
            estado = random.choice(['aprobado', 'desembolsado', 'pendiente'])
        elif rds <= 50:
            semaforo = 'amarillo'
            estado = random.choice(['pendiente', 'rechazado'])
        else:
            semaforo = 'rojo'
            estado = 'rechazado'

        solicitud_id = str(uuid.uuid4())
        
        # 2. Insertar en dsolicitud (Core)
        cod_solicitud = f"SOL{random.randint(100000, 999999)}"
        sql_dsolicitud = text("""
            INSERT INTO dsolicitud (
                codsolicitud, pkcliente, pkagencia, pkasesor, 
                montoaprobadocredito, montosolicitudcredito, 
                nrocuotasolicitud, plazosolicitudcredito, pksolicitudestado, pkmoneda, pkproducto, fechasolicitudcredito, fecultactualizacion
            ) VALUES (
                :codsolicitud, :pkcli, 1, 31, :monto, :monto, 
                :cuotas, :cuotas, (CASE WHEN :est='aprobado' OR :est='desembolsado' THEN 2 ELSE 1 END),
                1, 1, NOW(), NOW()
            ) RETURNING pksolicitud
        """)
        
        try:
            res_dsol = db.execute(sql_dsolicitud, {
                "codsolicitud": cod_solicitud,
                "pkcli": pkcliente,
                "monto": monto,
                "cuotas": plazo_meses,
                "est": estado
            })
            pksolicitud_core = res_dsol.scalar()
            
            # Insertar en solicitudes_prestamo (BBVA Flow)
            sql_app = text("""
                INSERT INTO solicitudes_prestamo (
                    id, user_id, pkcliente, pksolicitud_core, monto,
                    plazo_meses, tasa_anual, cuota_mensual, proposito,
                    ingresos_mensuales, cuotas_actuales, rds, semaforo_rds,
                    score, nivel_aprobacion, estado, created_at
                ) VALUES (
                    :id, :uid, :pkcli, :pkcore, :monto,
                    :plazo, :tasa, :cuota, 'Préstamo Personal',
                    :ingresos, :cuotas_act, :rds, :sem,
                    :score, :nivel, :estado, NOW()
                )
            """)
            
            db.execute(sql_app, {
                "id": solicitud_id, "uid": user_id, "pkcli": pkcliente, "pkcore": pksolicitud_core,
                "monto": monto, "plazo": plazo_meses, "tasa": tasa_anual, "cuota": cuota,
                "ingresos": ingresos_mensuales, "cuotas_act": cuotas_actuales, "rds": rds,
                "sem": semaforo, "score": random.randint(500, 850), "nivel": nivel, "estado": estado
            })
            
            insertadas += 1
            
        except Exception as e:
            print(f"Error insertando solicitud: {e}")
            db.rollback()
            continue

    db.commit()
    print(f"Se insertaron {insertadas} solicitudes de prestamo.")
    print("==========================================")

if __name__ == "__main__":
    main()
