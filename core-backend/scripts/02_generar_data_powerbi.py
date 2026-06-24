import os
import sys
import random
from datetime import date
from sqlalchemy import text

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.core.cfg_database import SessionLocal

def generar_datos_powerbi():
    db = SessionLocal()
    print("Iniciando generación de datos para Power BI...")

    # 1. Limpiar datos antiguos
    print("Limpiando fagcuentacredito y fmetasasesor...")
    db.execute(text("TRUNCATE TABLE fagcuentacredito RESTART IDENTITY CASCADE"))
    db.execute(text("TRUNCATE TABLE fmetasasesor RESTART IDENTITY CASCADE"))
    db.commit()

    # 2. Configuración de la generación
    meses_2025 = [202501, 202502, 202503, 202504, 202505, 202506, 202507, 202508, 202509, 202510, 202511, 202512]
    asesores_prueba = [31, 36, 12, 18]
    agencias = [1, 2] # Lima y Provincias
    tipos_credito = [1, 2] # Empresarial y Consumo

    # Extraer clientes reales para usar sus IDs
    clientes = [r[0] for r in db.execute(text("SELECT pkcliente FROM dcliente LIMIT 200")).fetchall()]
    if not clientes:
        print("Error: No hay clientes en dcliente.")
        return

    total_insertados = 0

    # 3. Generar Cartera (fagcuentacredito)
    print("Generando cartera mes a mes (evolución histórica)...")
    for mes in meses_2025:
        # Hacia fin de año, simulamos que la mora sube ligeramente y la cartera crece
        factor_crecimiento = 1.0 + (mes % 100) * 0.05
        probabilidad_mora = 0.05 + (mes % 100) * 0.005 

        for asesor in asesores_prueba:
            agencia = random.choice(agencias)
            
            # Generar entre 20 y 30 créditos por asesor por mes
            num_creditos = random.randint(20, 30)
            
            colocacion_real_mes = 0
            atraso_real_mes = 0

            for _ in range(num_creditos):
                cliente = random.choice(clientes)
                tipo = random.choice(tipos_credito)
                
                # Montos base
                capital_aprobado = round(random.uniform(5000, 50000) * factor_crecimiento, 2)
                saldo_capital = round(capital_aprobado * random.uniform(0.3, 0.9), 2)
                
                # Determinar si está vigente o vencido
                es_moroso = random.random() < probabilidad_mora
                
                if es_moroso:
                    cartera_vigente = 0
                    cartera_vencida = saldo_capital
                    dias_atraso = random.randint(15, 120)
                    atraso_real_mes += saldo_capital
                else:
                    cartera_vigente = saldo_capital
                    cartera_vencida = 0
                    dias_atraso = 0

                colocacion_real_mes += saldo_capital

                pk_cuenta = random.randint(10000, 999999)

                sql_fag = text("""
                    INSERT INTO fagcuentacredito (
                        periodomes, pkcuentacredito, pkcliente, pkasesor, pkagencia, pkproducto,
                        montoaprobadocredito, montosaldocapital,
                        car_vig_capital, car_ven_capital, diasatrasocredito
                    ) VALUES (
                        :periodo, :pkcuenta, :cli, :ase, :age, :tipo,
                        :aprobado, :saldo, :vig, :ven, :dias
                    )
                """)
                db.execute(sql_fag, {
                    "periodo": mes, "pkcuenta": pk_cuenta, "cli": cliente, "ase": asesor, "age": agencia, "tipo": tipo,
                    "aprobado": capital_aprobado, "saldo": saldo_capital,
                    "vig": cartera_vigente, "ven": cartera_vencida, "dias": dias_atraso
                })
                total_insertados += 1

            # 4. Generar Metas del Asesor para este mes (fmetasasesor)
            meta_colocaciones = colocacion_real_mes * random.uniform(0.8, 1.2) # A veces llegan, a veces no
            
            sql_metas = text("""
                INSERT INTO fmetasasesor (
                    periodomes, pkasesor, pkagencia, 
                    saldocolocaciones_meta, saldocolocaciones_real,
                    carteraatrasada_meta, carteraatrasada_real
                ) VALUES (
                    :periodo, :ase, :age,
                    :meta_col, :real_col,
                    :meta_atr, :real_atr
                )
            """)
            db.execute(sql_metas, {
                "periodo": mes, "ase": asesor, "age": agencia,
                "meta_col": meta_colocaciones, "real_col": colocacion_real_mes,
                "meta_atr": meta_colocaciones * 0.05, "real_atr": atraso_real_mes
            })

    db.commit()
    print(f"¡Éxito! Se insertaron {total_insertados} créditos estratégicos para el Power BI.")
    print("Datos generados para los meses: 202501 al 202512.")
    print("Asesores utilizados: 31, 36, 12, 18.")

if __name__ == "__main__":
    generar_datos_powerbi()
