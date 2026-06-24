import os
import sys
import random
from datetime import datetime
from sqlalchemy import text

sys.path.append(r'c:\Proyectos\BBVA\core-backend')
from app.core.cfg_database import SessionLocal

def main():
    db = SessionLocal()
    print("=== Iniciando Seed de Cartera Power BI BBVA ===")
    
    # Usuarios reales de nuestra demo BBVA
    usuarios = db.execute(text("SELECT pkcliente, id FROM app_usuarios")).fetchall()
    if not usuarios:
        print("Error: Ejecuta el seed de clientes primero.")
        return
        
    clientes = [u[0] for u in usuarios]
    
    # Constantes
    meses_2025 = [202501, 202502, 202503, 202504, 202505, 202506, 202507, 202508, 202509, 202510, 202511, 202512]
    asesores = [31, 36, 12, 18]
    agencias = [1, 2]
    productos = [1, 2] # 1: Consumo, 2: Empresarial
    
    insertados = 0
    
    # Generar creditos de antemano para respetar FK
    creditos = []
    for asesor in asesores:
        agencia = random.choice(agencias)
        num_creditos = random.randint(15, 25)
        for _ in range(num_creditos):
            cli = random.choice(clientes)
            producto = random.choice(productos)
            aprobado = round(random.uniform(5000, 50000), 2)
            
            # Insertar en dcuentacredito para cumplir con FK
            codcuenta = f"CTA{random.randint(100000, 999999)}"
            sql_dcuenta = text("""
                INSERT INTO dcuentacredito (
                    codcuentacredito, codlineacredito, pkcliente, nrocronograma, fecultactualizacion
                ) VALUES (
                    :codcuenta, 'LIN', :cli, 1, NOW()
                ) RETURNING pkcuentacredito
            """)
            res = db.execute(sql_dcuenta, {
                "codcuenta": codcuenta, "cli": cli
            })
            pk_cuenta = res.scalar()
            
            creditos.append({
                "asesor": asesor,
                "agencia": agencia,
                "cli": cli,
                "pk_cuenta": pk_cuenta,
                "producto": producto,
                "aprobado": aprobado
            })
            
    for mes in meses_2025:
        factor_mora = 1.0 + (mes % 100) * 0.05
        probabilidad_mora = 0.05 + (mes % 100) * 0.005
        
        for asesor in asesores:
            creditos_asesor = [c for c in creditos if c['asesor'] == asesor]
            agencia = creditos_asesor[0]['agencia'] if creditos_asesor else random.choice(agencias)
            num_creditos = len(creditos_asesor)
            
            meta_colocaciones = num_creditos * 20000
            real_colocaciones = 0
            real_mora = 0
            
            for cred in creditos_asesor:
                cli = cred['cli']
                pk_cuenta = cred['pk_cuenta']
                producto = cred['producto']
                aprobado = cred['aprobado']
                
                saldo = round(aprobado * random.uniform(0.3, 0.9), 2)
                
                es_moroso = random.random() < probabilidad_mora
                vigente = 0 if es_moroso else saldo
                vencido = saldo if es_moroso else 0
                dias = random.randint(15, 120) if es_moroso else 0
                
                real_colocaciones += saldo
                real_mora += vencido
                
                # INSERCIÓN GIGANTE CON TODAS LAS COLUMNAS NOT NULL (Valores por defecto seguros)
                sql_fag = text("""
                    INSERT INTO fagcuentacredito (
                        periodomes, pkcuentacredito, pkestadocredito, nrocuotas, nrodias, nrodiasgracias,
                        flaglibreamortizacion, montoaprobadocredito, montocapitaldesembolsado, montocapitalpagado,
                        montointeresprogramado, montointeresalafecha, montointerespagado, montomoraprogramada,
                        montomorapagada, montogastoprogramado, montogastopagado, pkproducto, pkmoneda,
                        tasainterescompensatoria, tasainteresmoratoria, diasatrasocredito, fechadesembolsocredito,
                        tipocambiodesembolso, flagrefinanciado, flagreestructurado, flagreprogramado,
                        flagjudicial, flagcastigado, montosaldonormal, montosaldovencido, pkcliente,
                        nrocronograma, flagclientenuevobancoandino, flagclientenuevo, flagclientecartera,
                        montocapitalinicio, montointeresinicio, montomorainicio, montogastoinicio,
                        nrodiasatrasoinicio, montosaldocapital, montosaldointeres, montosaldomoratorio,
                        montosaldogasto, car_vig_capital, car_vig_int_compensatorio, car_vig_int_moratorio,
                        car_vig_gastos, car_ven_capital, car_ven_int_compensatorio, car_ven_int_moratorio,
                        car_ven_gastos, car_ref_capital, car_ref_int_compensatorio, car_ref_int_moratorio,
                        car_ref_gastos, car_rep_capital, car_rep_int_compensatorio, car_rep_int_moratorio,
                        car_rep_gastos, car_jud_capital, car_jud_int_compensatorio, car_jud_int_moratorio,
                        car_jud_gastos, car_cas_capital, car_cas_int_compensatorio, car_cas_int_moratorio,
                        car_cas_gastos, car_con_capital, car_con_int_compensatorio, car_con_int_moratorio,
                        car_con_gastos, saldodiferido, saldodevengado, saldoprovisiones, montosaldocliente,
                        pkagencia, pkasesor, fecultactualizacion
                    ) VALUES (
                        :mes, :pkcta, 1, 12, 360, 0,
                        'N', :aprobado, :aprobado, 0,
                        0, 0, 0, 0,
                        0, 0, 0, :prod, 1,
                        15.5, 5.0, :dias, NOW(),
                        1.0, 'N', 'N', 'N',
                        'N', 'N', :vigente, :vencido, :cli,
                        1, 'N', 'N', 'N',
                        0, 0, 0, 0,
                        0, :saldo, 0, 0,
                        0, :vigente, 0, 0,
                        0, :vencido, 0, 0,
                        0, 0, 0, 0,
                        0, 0, 0, 0,
                        0, 0, 0, 0,
                        0, 0, 0, 0,
                        0, 0, 0, 0,
                        0, 0, 0, 0, :saldo,
                        :agencia, :asesor, NOW()
                    )
                """)
                db.execute(sql_fag, {
                    "mes": mes, "pkcta": pk_cuenta, "aprobado": aprobado,
                    "prod": producto, "dias": dias, "vigente": vigente,
                    "vencido": vencido, "cli": cli, "saldo": saldo,
                    "agencia": agencia, "asesor": asesor
                })
                insertados += 1
                
            # Metas por asesor
            sql_metas = text("""
                INSERT INTO fmetasasesor (
                    periodomes, pkasesor,
                    saldocolocaciones_meta, saldocolocaciones_real,
                    nroclientes_meta, nroclientes_real,
                    carteraatrasada_meta, carteraatrasada_real,
                    clientesnuevos_meta, clientesnuevos_real,
                    ratiomora_meta, ratiomora_real,
                    fecultactualizacion
                ) VALUES (
                    :mes, :asesor,
                    :meta_col, :real_col,
                    20, :real_cli,
                    :meta_mora, :real_mora,
                    5, 5,
                    5.0, :real_ratio,
                    NOW()
                )
            """)
            db.execute(sql_metas, {
                "mes": mes, "asesor": asesor,
                "meta_col": meta_colocaciones, "real_col": real_colocaciones,
                "real_cli": num_creditos,
                "meta_mora": meta_colocaciones * 0.05, "real_mora": real_mora,
                "real_ratio": (real_mora/real_colocaciones*100) if real_colocaciones>0 else 0
            })

    db.commit()
    print(f"Se insertaron {insertados} registros historicos en fagcuentacredito.")
    print("El Power BI ahora mostrara una tendencia realista del 2025.")

if __name__ == "__main__":
    main()
