-- ============================================================================
-- 08_DDL_DML_homebanking_bbva_local.sql
-- ----------------------------------------------------------------------------
-- Adaptación BBVA para migrar Homebanking desde Supabase a PostgreSQL local.
-- Ejecutar DESPUÉS de 00-07 sobre la BD local bd_core_financiero.
--
-- Objetivo:
--   1) Mantener una sola BD local compartida por Core + Homebanking.
--   2) Crear tablas simples compatibles con el backend BBVA actual.
--   3) Vincular dichas tablas con el modelo Core cuando exista PKCLIENTE.
--   4) Agregar catálogos/reglas BBVA para cuentas, créditos, aprobación y mora.
-- ============================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- A. CATÁLOGO BBVA DE CUENTAS DE AHORRO
-- ============================================================================

INSERT INTO DPRODUCTOAHORRO
(CODTIPOPRODUCTO, CODTIPOSUBPRODUCTO, CODCARACTERISTICA, DESTIPOPRODUCTO, DESTIPOSUBPRODUCTO, DESCARACTERISTICA)
VALUES
('AC','10','01','Cuenta de Ahorro BBVA','Cuenta Digital','Sin mantenimiento; operaciones digitales'),
('AC','11','01','Cuenta de Ahorro BBVA','Cuenta Independencia','Sin mantenimiento desde saldo promedio mínimo'),
('AC','12','01','Cuenta de Ahorro BBVA','Cuenta Ganadora','Premia el ahorro y participa por beneficios'),
('AC','13','01','Cuenta de Ahorro BBVA','Cuenta Sueldo','Recepción de haberes con beneficios')
ON CONFLICT (CODTIPOPRODUCTO, CODTIPOSUBPRODUCTO, CODCARACTERISTICA) DO UPDATE SET
    DESTIPOPRODUCTO = EXCLUDED.DESTIPOPRODUCTO,
    DESTIPOSUBPRODUCTO = EXCLUDED.DESTIPOSUBPRODUCTO,
    DESCARACTERISTICA = EXCLUDED.DESCARACTERISTICA,
    FECULTACTUALIZACION = NOW();

-- ============================================================================
-- B. USUARIOS DE HOMEBANKING LOCAL
--    Reemplaza el uso de auth.users de Supabase para tu proyecto BBVA local.
-- ============================================================================

CREATE TABLE IF NOT EXISTS app_usuarios (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pkcliente       INT NULL REFERENCES DCLIENTE(PKCLIENTE),
    dni             VARCHAR(12) NOT NULL UNIQUE,
    nombres         VARCHAR(100) NOT NULL,
    apellidos       VARCHAR(100) NOT NULL,
    correo          VARCHAR(120) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    rol             VARCHAR(30) NOT NULL DEFAULT 'cliente',
    estado          VARCHAR(20) NOT NULL DEFAULT 'activo',
    fecha_registro  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_app_usuarios_rol CHECK (rol IN ('cliente','asesor','administrador','jefe_regional','riesgos','comite','analista')),
    CONSTRAINT chk_app_usuarios_estado CHECK (estado IN ('activo','bloqueado','inactivo'))
);

CREATE INDEX IF NOT EXISTS ix_app_usuarios_pkcliente ON app_usuarios(pkcliente);
CREATE INDEX IF NOT EXISTS ix_app_usuarios_dni ON app_usuarios(dni);

-- ============================================================================
-- C. CUENTAS SIMPLES PARA HOMEBANKING BBVA
--    Compatibles con tu frontend/backend actual: cuentas, transacciones, pagos.
--    Además enlazan con DCUENTAAHORRO/FCUENTAAHORRO cuando sea posible.
-- ============================================================================

CREATE TABLE IF NOT EXISTS cuentas (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES app_usuarios(id) ON DELETE CASCADE,
    pkcliente       INT NULL REFERENCES DCLIENTE(PKCLIENTE),
    pkcuentaahorro  INT NULL REFERENCES DCUENTAAHORRO(PKCUENTAAHORRO),
    tipo            VARCHAR(20) NOT NULL DEFAULT 'ahorro',
    tipo_cuenta     VARCHAR(30) NOT NULL,
    numero_cuenta   VARCHAR(30) NOT NULL UNIQUE,
    cci             VARCHAR(30) NOT NULL UNIQUE,
    saldo           NUMERIC(14,2) NOT NULL DEFAULT 0,
    moneda          VARCHAR(3) NOT NULL DEFAULT 'PEN',
    alias           VARCHAR(80),
    estado          VARCHAR(20) NOT NULL DEFAULT 'activa',
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_cuentas_tipo CHECK (tipo IN ('ahorro','corriente')),
    CONSTRAINT chk_cuentas_tipo_cuenta CHECK (tipo_cuenta IN ('digital','independencia','ganadora','sueldo','vip')),
    CONSTRAINT chk_cuentas_moneda CHECK (moneda IN ('PEN','USD')),
    CONSTRAINT chk_cuentas_estado CHECK (estado IN ('activa','inactiva','bloqueada','cerrada')),
    CONSTRAINT uq_cuentas_user_producto_moneda UNIQUE (user_id, tipo_cuenta, moneda)
);

CREATE INDEX IF NOT EXISTS ix_cuentas_user_id ON cuentas(user_id);
CREATE INDEX IF NOT EXISTS ix_cuentas_pkcliente ON cuentas(pkcliente);
CREATE INDEX IF NOT EXISTS ix_cuentas_numero ON cuentas(numero_cuenta);

CREATE TABLE IF NOT EXISTS transacciones (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES app_usuarios(id) ON DELETE CASCADE,
    cuenta_id       UUID NULL REFERENCES cuentas(id) ON DELETE SET NULL,
    tipo            VARCHAR(20) NOT NULL,
    descripcion     VARCHAR(200) NOT NULL,
    monto           NUMERIC(14,2) NOT NULL,
    fecha           TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_transacciones_tipo CHECK (tipo IN ('debito','credito')),
    CONSTRAINT chk_transacciones_monto CHECK (monto > 0)
);

CREATE INDEX IF NOT EXISTS ix_transacciones_user_fecha ON transacciones(user_id, fecha DESC);
CREATE INDEX IF NOT EXISTS ix_transacciones_cuenta_fecha ON transacciones(cuenta_id, fecha DESC);

CREATE TABLE IF NOT EXISTS pagos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES app_usuarios(id) ON DELETE CASCADE,
    cuenta_id       UUID NULL REFERENCES cuentas(id) ON DELETE SET NULL,
    servicio        VARCHAR(80) NOT NULL,
    numero_contrato VARCHAR(40) NOT NULL,
    monto           NUMERIC(14,2) NOT NULL,
    estado          VARCHAR(20) NOT NULL DEFAULT 'completado',
    fecha           TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_pagos_monto CHECK (monto > 0),
    CONSTRAINT chk_pagos_estado CHECK (estado IN ('pendiente','completado','fallido'))
);

-- ============================================================================
-- D. SOLICITUDES DE CRÉDITO PARA HOMEBANKING
--    Esta tabla es compatible con tu backend actual y guarda reglas clave:
--    scoring, RDS y ruta de aprobación.
-- ============================================================================

CREATE TABLE IF NOT EXISTS solicitudes_prestamo (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES app_usuarios(id) ON DELETE CASCADE,
    pkcliente           INT NULL REFERENCES DCLIENTE(PKCLIENTE),
    pksolicitud_core    INT NULL REFERENCES DSOLICITUD(PKSOLICITUD),
    monto               NUMERIC(14,2) NOT NULL,
    plazo_meses         INT NOT NULL,
    tasa_anual          NUMERIC(8,4) NOT NULL DEFAULT 18.5,
    cuota_mensual       NUMERIC(14,2) NOT NULL,
    proposito           VARCHAR(100),
    ingresos_mensuales  NUMERIC(14,2),
    cuotas_actuales     NUMERIC(14,2) NOT NULL DEFAULT 0,
    rds                 NUMERIC(8,4),
    semaforo_rds        VARCHAR(20),
    score               INT,
    nivel_aprobacion    VARCHAR(40),
    estado              VARCHAR(30) NOT NULL DEFAULT 'pendiente',
    cuenta_destino_id   UUID REFERENCES cuentas(id) ON DELETE SET NULL,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_solicitudes_estado CHECK (estado IN ('pendiente','en_evaluacion','observado','aprobado','rechazado','desembolsado','cancelado')),
    CONSTRAINT chk_solicitudes_monto CHECK (monto > 0),
    CONSTRAINT chk_solicitudes_plazo CHECK (plazo_meses BETWEEN 1 AND 84)
);

CREATE INDEX IF NOT EXISTS ix_solicitudes_user_fecha ON solicitudes_prestamo(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS ix_solicitudes_core ON solicitudes_prestamo(pksolicitud_core);

-- ============================================================================
-- E. PARÁMETROS BBVA SIMULADOS PARA CUMPLIR RÚBRICA
-- ============================================================================

CREATE TABLE IF NOT EXISTS bbva_parametros_credito (
    parametro       VARCHAR(60) PRIMARY KEY,
    valor_numerico  NUMERIC(14,4),
    valor_texto     VARCHAR(120),
    descripcion     VARCHAR(250),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO bbva_parametros_credito (parametro, valor_numerico, valor_texto, descripcion) VALUES
('INGRESO_MINIMO_CONSUMO', 700, NULL, 'Ingreso mínimo referencial para ser sujeto de crédito'),
('ANTIGUEDAD_LABORAL_MIN_MESES', 6, NULL, 'Antigüedad laboral mínima referencial'),
('RDS_VERDE_MAX', 35, NULL, 'RDS hasta 35%: aprobación operativa'),
('RDS_AMARILLO_MAX', 50, NULL, 'RDS de 35% a 50%: requiere revisión'),
('TEA_CONSUMO_REFERENCIAL', 18.5, NULL, 'TEA usada en simulador académico')
ON CONFLICT (parametro) DO UPDATE SET
    valor_numerico = EXCLUDED.valor_numerico,
    valor_texto = EXCLUDED.valor_texto,
    descripcion = EXCLUDED.descripcion,
    updated_at = NOW();

CREATE TABLE IF NOT EXISTS bbva_reglas_aprobacion (
    id              SERIAL PRIMARY KEY,
    monto_min       NUMERIC(14,2) NOT NULL,
    monto_max       NUMERIC(14,2),
    nivel           VARCHAR(40) NOT NULL,
    rol_responsable VARCHAR(40) NOT NULL,
    descripcion     VARCHAR(200)
);

TRUNCATE TABLE bbva_reglas_aprobacion RESTART IDENTITY;
INSERT INTO bbva_reglas_aprobacion (monto_min, monto_max, nivel, rol_responsable, descripcion) VALUES
(0,       30000,  'ASESOR',        'asesor',        'Crédito menor o igual a S/ 30,000'),
(30000.01,100000, 'ADMINISTRADOR', 'administrador', 'Crédito hasta S/ 100,000'),
(100000.01,300000,'JEFE_REGIONAL', 'jefe_regional', 'Crédito hasta S/ 300,000'),
(300000.01,500000,'RIESGOS',       'riesgos',       'Crédito hasta S/ 500,000'),
(500000.01,NULL,  'COMITE',        'comite',        'Crédito mayor a S/ 500,000');

CREATE TABLE IF NOT EXISTS bbva_bandas_mora (
    id          SERIAL PRIMARY KEY,
    dias_min    INT NOT NULL,
    dias_max    INT,
    banda       VARCHAR(30) NOT NULL,
    descripcion VARCHAR(200)
);

TRUNCATE TABLE bbva_bandas_mora RESTART IDENTITY;
INSERT INTO bbva_bandas_mora (dias_min, dias_max, banda, descripcion) VALUES
(0,   8,   'PREVENTIVA', 'Normal / Alerta temprana (Hasta 8 días)'),
(9,   30,  'TEMPRANA',   'Con Problemas Potenciales (CPP) (9 a 30 días)'),
(31,  120, 'TARDIA',     'Deficiente / Dudoso (31 a 120 días)'),
(121, 180, 'JUDICIAL',   'Cobranza judicial / Pérdida (121 a 180 días)'),
(181, NULL,'CASTIGO',    'Castigo contable (> 180 días)');

-- ============================================================================
-- F. FUNCIONES ÚTILES PARA BACKEND LOCAL
-- ============================================================================

CREATE OR REPLACE FUNCTION bbva_generar_numero_cuenta()
RETURNS VARCHAR AS $$
DECLARE
    n VARCHAR;
BEGIN
    LOOP
        n := '0011-0814-' || LPAD(FLOOR(RANDOM() * 10000000000)::BIGINT::TEXT, 10, '0');
        EXIT WHEN NOT EXISTS (SELECT 1 FROM cuentas WHERE numero_cuenta = n);
    END LOOP;
    RETURN n;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION bbva_generar_cci(p_numero_cuenta VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
    limpio VARCHAR;
BEGIN
    limpio := REGEXP_REPLACE(p_numero_cuenta, '\\D', '', 'g');
    RETURN LEFT(limpio || LPAD(FLOOR(RANDOM() * 100)::INT::TEXT, 2, '0'), 20);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION bbva_nivel_aprobacion(p_monto NUMERIC)
RETURNS VARCHAR AS $$
DECLARE
    v_nivel VARCHAR;
BEGIN
    SELECT nivel INTO v_nivel
    FROM bbva_reglas_aprobacion
    WHERE p_monto >= monto_min AND (monto_max IS NULL OR p_monto <= monto_max)
    ORDER BY monto_min
    LIMIT 1;
    RETURN COALESCE(v_nivel, 'COMITE');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION bbva_semaforo_rds(p_rds NUMERIC)
RETURNS VARCHAR AS $$
BEGIN
    IF p_rds <= 35 THEN
        RETURN 'VERDE';
    ELSIF p_rds <= 50 THEN
        RETURN 'AMARILLO';
    ELSE
        RETURN 'ROJO';
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION bbva_crear_cuenta_app(
    p_user_id UUID,
    p_tipo_cuenta VARCHAR,
    p_moneda VARCHAR DEFAULT 'PEN',
    p_saldo_inicial NUMERIC DEFAULT 0
)
RETURNS cuentas AS $$
DECLARE
    v_usuario app_usuarios%ROWTYPE;
    v_numero VARCHAR;
    v_cci VARCHAR;
    v_cuenta cuentas%ROWTYPE;
    v_pkcuentaahorro INT;
    v_periododia INT;
    v_pkproductoahorro INT;
    v_pkmoneda INT;
    v_pktipocuenta INT;
    v_pktipotasa INT;
    v_pkagencia INT;
    v_pkestado INT;
BEGIN
    SELECT * INTO v_usuario FROM app_usuarios WHERE id = p_user_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;

    IF EXISTS (SELECT 1 FROM cuentas WHERE user_id = p_user_id AND tipo_cuenta = p_tipo_cuenta AND moneda = p_moneda) THEN
        RAISE EXCEPTION 'El usuario ya tiene una cuenta de este tipo y moneda';
    END IF;

    v_numero := bbva_generar_numero_cuenta();
    v_cci := bbva_generar_cci(v_numero);

    IF v_usuario.pkcliente IS NOT NULL THEN
        INSERT INTO DCUENTAAHORRO (CODCUENTAAHORRO, PKCLIENTE)
        VALUES (REPLACE(v_numero, '-', ''), v_usuario.pkcliente)
        RETURNING PKCUENTAAHORRO INTO v_pkcuentaahorro;

        SELECT CAST(TO_CHAR(CURRENT_DATE, 'YYYYMMDD') AS INT) INTO v_periododia;
        SELECT PKPRODUCTOAHORRO INTO v_pkproductoahorro
        FROM DPRODUCTOAHORRO
        WHERE LOWER(DESTIPOSUBPRODUCTO) = CASE p_tipo_cuenta
            WHEN 'digital' THEN 'cuenta digital'
            WHEN 'independencia' THEN 'cuenta independencia'
            WHEN 'ganadora' THEN 'cuenta ganadora'
            WHEN 'sueldo' THEN 'cuenta sueldo'
        END
        LIMIT 1;
        SELECT PKMONEDA INTO v_pkmoneda FROM DMONEDA WHERE CODMONEDA = CASE WHEN p_moneda='USD' THEN 'DO' ELSE 'SO' END LIMIT 1;
        SELECT PKTIPOCUENTAAHORRO INTO v_pktipocuenta FROM DTIPOCUENTAAHORRO WHERE CODTIPOCUENTAAHORRO='AC' LIMIT 1;
        SELECT PKTIPOTASAAHORRO INTO v_pktipotasa FROM DTIPOTASAAHORRO WHERE CODTIPOTASAAHORRO='TF' LIMIT 1;
        SELECT PKAGENCIA INTO v_pkagencia FROM DAGENCIA ORDER BY PKAGENCIA LIMIT 1;
        SELECT PKESTADOCUENTA INTO v_pkestado FROM DESTADOCUENTA WHERE CODESTADOCUENTA='01' LIMIT 1;

        INSERT INTO FCUENTAAHORRO (
            PERIODODIA, PKCUENTAAHORRO, PKPRODUCTOAHORRO, PKMONEDA, PKTIPOCUENTAAHORRO,
            PKTIPOTASAAHORRO, PKCLIENTE, PKAGENCIA, PKESTADOCUENTA, MONTOSALDOCAPITALTOTAL,
            MONTOSALDODISPONIBLE_AC, MONTOSALDOCONTABLE_AC, FECHAAPERTURACUENTA, MONTODEPOSITOAPERTURA
        ) VALUES (
            v_periododia, v_pkcuentaahorro, v_pkproductoahorro, v_pkmoneda, v_pktipocuenta,
            v_pktipotasa, v_usuario.pkcliente, v_pkagencia, v_pkestado, p_saldo_inicial,
            p_saldo_inicial, p_saldo_inicial, CURRENT_DATE, p_saldo_inicial
        ) ON CONFLICT (PERIODODIA, PKCUENTAAHORRO) DO NOTHING;
    END IF;

    INSERT INTO cuentas (user_id, pkcliente, pkcuentaahorro, tipo_cuenta, numero_cuenta, cci, saldo, moneda, alias)
    VALUES (p_user_id, v_usuario.pkcliente, v_pkcuentaahorro, p_tipo_cuenta, v_numero, v_cci, p_saldo_inicial, p_moneda,
            INITCAP(REPLACE(p_tipo_cuenta, '_', ' ')))
    RETURNING * INTO v_cuenta;

    RETURN v_cuenta;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION bbva_transferir_app(
    p_user_id UUID,
    p_cuenta_origen_id UUID,
    p_numero_destino VARCHAR,
    p_monto NUMERIC,
    p_concepto VARCHAR DEFAULT 'Transferencia enviada'
)
RETURNS JSON AS $$
DECLARE
    v_origen cuentas%ROWTYPE;
    v_destino cuentas%ROWTYPE;
BEGIN
    SELECT * INTO v_origen FROM cuentas WHERE id = p_cuenta_origen_id AND user_id = p_user_id AND estado='activa';
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cuenta origen no encontrada';
    END IF;

    IF v_origen.saldo < p_monto THEN
        RAISE EXCEPTION 'Saldo insuficiente';
    END IF;

    SELECT * INTO v_destino FROM cuentas WHERE numero_cuenta = p_numero_destino AND estado='activa';
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cuenta destino no encontrada';
    END IF;

    IF v_origen.moneda <> v_destino.moneda THEN
        RAISE EXCEPTION 'La moneda de origen y destino debe coincidir en esta simulación';
    END IF;

    UPDATE cuentas SET saldo = saldo - p_monto, updated_at = NOW() WHERE id = v_origen.id;
    UPDATE cuentas SET saldo = saldo + p_monto, updated_at = NOW() WHERE id = v_destino.id;

    INSERT INTO transacciones (user_id, cuenta_id, tipo, descripcion, monto)
    VALUES (v_origen.user_id, v_origen.id, 'debito', 'Transferencia a ' || p_numero_destino || ' - ' || p_concepto, p_monto);

    INSERT INTO transacciones (user_id, cuenta_id, tipo, descripcion, monto)
    VALUES (v_destino.user_id, v_destino.id, 'credito', 'Transferencia recibida - ' || p_concepto, p_monto);

    RETURN json_build_object('mensaje','Transferencia realizada correctamente','monto',p_monto);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- G. VISTAS DE APOYO PARA CORE Y HOMEBANKING
-- ============================================================================

CREATE OR REPLACE VIEW vw_bbva_homebanking_cuentas AS
SELECT
    c.id,
    c.user_id,
    u.dni,
    u.nombres,
    u.apellidos,
    c.tipo_cuenta,
    CASE c.tipo_cuenta
        WHEN 'digital' THEN 'Cuenta Digital'
        WHEN 'independencia' THEN 'Cuenta Independencia'
        WHEN 'ganadora' THEN 'Cuenta Ganadora'
        WHEN 'sueldo' THEN 'Cuenta Sueldo'
        ELSE c.tipo_cuenta
    END AS nombre_producto,
    c.numero_cuenta,
    c.cci,
    c.saldo,
    c.moneda,
    c.estado,
    c.created_at
FROM cuentas c
JOIN app_usuarios u ON u.id = c.user_id;

CREATE OR REPLACE VIEW vw_bbva_solicitudes_credito_homebanking AS
SELECT
    s.*,
    u.dni,
    u.nombres,
    u.apellidos,
    bbva_nivel_aprobacion(s.monto) AS nivel_aprobacion_calculado
FROM solicitudes_prestamo s
JOIN app_usuarios u ON u.id = s.user_id;

COMMIT;
