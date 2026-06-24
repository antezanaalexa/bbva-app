-- =========================================================
-- CONSULTAS OPTIMIZADAS PARA POWER BI (MODELO ESTRELLA)
-- Proyecto: BBVA Core Financiero
-- =========================================================

-- 1. VISTA DE KPI DE CARTERA (Vigente vs Vencida vs Mora)
-- Power BI puede conectar esta consulta como su tabla de hechos principal
SELECT 
    f.periodomes,
    a.codagencia,
    a.desagencia,
    tc.destipocredito,
    SUM(f.montosaldocapital) AS cartera_total,
    SUM(f.car_vig_capital) AS cartera_vigente,
    SUM(f.car_ven_capital) AS cartera_atrasada,
    -- Ratio de mora = (Cartera Atrasada / Cartera Total) * 100
    CASE 
        WHEN SUM(f.montosaldocapital) > 0 
        THEN ROUND((SUM(f.car_ven_capital) / SUM(f.montosaldocapital)) * 100, 2)
        ELSE 0 
    END AS ratio_mora_porcentaje
FROM public.fagcuentacredito f
JOIN public.dagencia a ON f.pkagencia = a.pkagencia
JOIN public.dproducto tc ON f.pkproducto = tc.pkproducto
GROUP BY f.periodomes, a.codagencia, a.desagencia, tc.destipocredito
ORDER BY f.periodomes DESC;


-- 2. PRODUCTIVIDAD Y CUMPLIMIENTO DE METAS POR ASESOR
-- Ideal para un gráfico de medidor (Gauge) en Power BI
SELECT 
    m.periodomes,
    a.codagencia,
    ase.nombre AS asesor,
    m.saldocolocaciones_meta AS meta_colocaciones,
    m.saldocolocaciones_real AS colocaciones_reales,
    -- Cumplimiento %
    ROUND((m.saldocolocaciones_real / m.saldocolocaciones_meta) * 100, 2) AS porcentaje_cumplimiento,
    -- Lógica de Semáforo
    CASE 
        WHEN (m.saldocolocaciones_real / m.saldocolocaciones_meta) >= 0.90 THEN 'VERDE'
        WHEN (m.saldocolocaciones_real / m.saldocolocaciones_meta) >= 0.70 THEN 'AMARILLO'
        ELSE 'ROJO'
    END AS indicador_semaforo
FROM public.fmetasasesor m
JOIN public.dasesor ase ON m.pkasesor = ase.pkasesor
JOIN public.dagencia a ON m.pkagencia = a.pkagencia
WHERE m.saldocolocaciones_meta > 0
ORDER BY m.periodomes DESC, porcentaje_cumplimiento DESC;

-- Nota: Importar estas tablas directamente usando "DirectQuery" en Power BI Desktop 
-- apuntando a bd_core_financiero en localhost:5432.
