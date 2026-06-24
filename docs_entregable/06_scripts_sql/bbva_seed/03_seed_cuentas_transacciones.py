import os
import sys
import uuid
import random
from datetime import datetime, timedelta
from sqlalchemy import text

sys.path.append(r'c:\Proyectos\BBVA\core-backend')
from app.core.cfg_database import SessionLocal

def generar_nro_cuenta():
    return f"0011-0{random.randint(100,999)}-0{random.randint(100000000,999999999)}"

def generar_cci():
    return f"011-{random.randint(100,999)}-000{random.randint(100000000,999999999)}-12"

def main():
    db = SessionLocal()
    print("=== Iniciando Seed de Cuentas y Transacciones BBVA ===")
    
    # Obtener usuarios
    usuarios = db.execute(text("SELECT id, pkcliente, nombres FROM app_usuarios")).fetchall()
    if not usuarios:
        print("Error: No hay usuarios en app_usuarios. Ejecuta el script 02 primero.")
        return

    insertados_cta = 0
    insertados_trx = 0

    for user in usuarios:
        user_id = user[0]
        pkcliente = user[1]
        
        # 1 a 2 cuentas por usuario
        num_cuentas = random.randint(1, 2)
        
        for i in range(num_cuentas):
            cuenta_id = str(uuid.uuid4())
            moneda = "PEN" if i == 0 else "USD"
            saldo = round(random.uniform(100.0, 15000.0), 2)
            
            # 1. Crear Cuenta
            sql_cta = text("""
                INSERT INTO cuentas (
                    id, user_id, pkcliente, tipo, tipo_cuenta,
                    numero_cuenta, cci, saldo, moneda, alias, estado
                ) VALUES (
                    :id, :user_id, :pkcliente, 'ahorro', :tipo_cta,
                    :num_cta, :cci, :saldo, :moneda, :alias, 'activa'
                )
            """)
            db.execute(sql_cta, {
                "id": cuenta_id, "user_id": user_id, "pkcliente": pkcliente,
                "tipo_cta": "independencia" if moneda == "PEN" else "digital",
                "num_cta": generar_nro_cuenta(), "cci": generar_cci(),
                "saldo": saldo, "moneda": moneda,
                "alias": "Mi Ahorro" if i == 0 else "Ahorros USD"
            })
            insertados_cta += 1

            # 2. Crear Transacciones Históricas (3 a 5 por cuenta)
            num_trx = random.randint(3, 5)
            saldo_historico = saldo
            
            desc_ingresos = ["Transferencia recibida", "Depósito en cajero", "Pago de haberes"]
            desc_gastos = ["Pago de servicios", "Compra POS", "Transferencia enviada", "Retiro cajero"]
            
            for _ in range(num_trx):
                trx_id = str(uuid.uuid4())
                es_ingreso = random.choice([True, False])
                tipo_trx = "credito" if es_ingreso else "debito"
                desc = random.choice(desc_ingresos if es_ingreso else desc_gastos)
                monto = round(random.uniform(10, 500), 2)
                
                # Ajustamos saldo histórico lógicamente
                if not es_ingreso:
                    saldo_historico += monto  # Si fue gasto, antes tenía más
                else:
                    saldo_historico -= monto
                
                tipo_trx = "credito" if es_ingreso else "debito"
                desc = random.choice(desc_ingresos if es_ingreso else desc_gastos)
                
                # Fechas aleatorias en los últimos 30 días
                dias_atras = random.randint(1, 30)
                fecha_trx = datetime.now() - timedelta(days=dias_atras)

                sql_trx = text("""
                    INSERT INTO transacciones (
                        id, user_id, cuenta_id, tipo,
                        descripcion, monto, fecha
                    ) VALUES (
                        :id, :uid, :cid, :tipo,
                        :desc, :monto, :fecha
                    )
                """)
                db.execute(sql_trx, {
                    "id": trx_id, "uid": user_id, "cid": cuenta_id,
                    "tipo": tipo_trx, "desc": desc, "monto": monto,
                    "fecha": fecha_trx
                })
                insertados_trx += 1

    db.commit()
    print(f"Se insertaron {insertados_cta} cuentas y {insertados_trx} transacciones.")
    print("=====================================================")

if __name__ == "__main__":
    main()
