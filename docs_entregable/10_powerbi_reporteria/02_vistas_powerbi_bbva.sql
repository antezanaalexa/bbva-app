-- ============================================================================
-- 06. CAPA SEMÁNTICA DE VISTAS PARA POWER BI (BBVA)
-- ============================================================================
-- Estas vistas abstraen la complejidad de las tablas subyacentes y ofrecen
-- un modelo de datos limpio y listo para conectar a Power BI.

-- 1. Vista de Clientes Unificados
CREATE OR REPLACE VIEW vw_bbva_clientes AS
SELECT 
    au.id AS usuario_uuid,
    dc.pkcliente AS cliente_id,
    dc.codcliente AS codigo_cliente,
    au.dni,
    au.nombres,
    au.apellidos,
    au.correo,
    au.estado,
    au.fecha_registro
FROM app_usuarios au
JOIN dcliente dc ON au.pkcliente = dc.pkcliente;

-- 2. Vista de Cuentas y Saldos Captados
CREATE OR REPLACE VIEW vw_bbva_cuentas AS
SELECT 
    c.id AS cuenta_uuid,
    vc.nombres || ' ' || vc.apellidos AS cliente_nombre,
    c.tipo_cuenta,
    c.numero_cuenta,
    c.moneda,
    c.saldo,
    c.estado,
    c.created_at AS fecha_apertura
FROM cuentas c
JOIN vw_bbva_clientes vc ON c.user_id = vc.usuario_uuid;

-- 3. Vista de Solicitudes de Préstamo (Embudo de originación)
CREATE OR REPLACE VIEW vw_bbva_solicitudes AS
SELECT 
    s.id AS solicitud_uuid,
    vc.nombres || ' ' || vc.apellidos AS solicitante,
    s.monto,
    s.plazo_meses,
    s.tasa_anual,
    s.cuota_mensual,
    s.ingresos_mensuales,
    s.rds AS ratio_deuda_ingreso,
    s.semaforo_rds,
    s.nivel_aprobacion,
    s.estado,
    s.created_at AS fecha_solicitud
FROM solicitudes_prestamo s
JOIN vw_bbva_clientes vc ON s.user_id = vc.usuario_uuid;

-- 4. Vista de Cartera y Mora Histórica (El Core Analítico)
CREATE OR REPLACE VIEW vw_bbva_cartera AS
SELECT 
    f.periodomes,
    a.codagencia,
    a.desagencia,
    p.desproducto AS producto,
    f.montosaldocapital AS cartera_total,
    f.car_vig_capital AS cartera_vigente,
    f.car_ven_capital AS cartera_vencida,
    f.diasatrasocredito AS dias_atraso,
    CASE 
        WHEN f.montosaldocapital > 0 
        THEN ROUND((f.car_ven_capital / f.montosaldocapital) * 100, 2)
        ELSE 0 
    END AS ratio_mora_porcentaje,
    -- Bandas de Mora Académicas
    CASE
        WHEN f.diasatrasocredito = 0 THEN '01. Al día (0)'
        WHEN f.diasatrasocredito BETWEEN 1 AND 6 THEN '02. Preventiva (1-6)'
        WHEN f.diasatrasocredito BETWEEN 7 AND 30 THEN '03. Temprana (7-30)'
        WHEN f.diasatrasocredito BETWEEN 31 AND 120 THEN '04. Tardía (31-120)'
        WHEN f.diasatrasocredito BETWEEN 121 AND 180 THEN '05. Judicial (121-180)'
        ELSE '06. Castigo (>180)'
    END AS banda_mora
FROM public.fagcuentacredito f
JOIN public.dagencia a ON f.pkagencia = a.pkagencia
JOIN public.dproducto p ON f.pkproducto = p.pkproducto;

-- 5. Vista de Cumplimiento de Metas por Asesor
CREATE OR REPLACE VIEW vw_bbva_metas_asesor AS
SELECT 
    m.periodomes,
    ase.nomasesor AS asesor,
    m.saldocolocaciones_meta AS meta_colocaciones,
    m.saldocolocaciones_real AS real_colocaciones,
    ROUND((m.saldocolocaciones_real / m.saldocolocaciones_meta) * 100, 2) AS cumplimiento_porcentaje,
    m.carteraatrasada_real AS mora_real,
    m.ratiomora_real AS ratio_mora_asesor
FROM public.fmetasasesor m
JOIN public.dasesor ase ON m.pkasesor = ase.pkasesor;
