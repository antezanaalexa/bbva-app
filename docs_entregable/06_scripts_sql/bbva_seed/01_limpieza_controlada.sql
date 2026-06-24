-- ============================================================================
-- 01. LIMPIEZA CONTROLADA DE DATOS BBVA SIMULADO
-- ============================================================================
-- PRECAUCIÓN: Este script vacía las tablas operativas para inyectar datos frescos.
-- NO elimina catálogos (agencias, asesores, productos, monedas).

BEGIN;

-- 1. Limpieza de tablas operativas BBVA
TRUNCATE TABLE transacciones RESTART IDENTITY CASCADE;
TRUNCATE TABLE cuentas RESTART IDENTITY CASCADE;
TRUNCATE TABLE solicitudes_prestamo RESTART IDENTITY CASCADE;
TRUNCATE TABLE app_usuarios RESTART IDENTITY CASCADE;

-- 2. Limpieza de tablas de Core Históricas
-- Vaciamos clientes y créditos para generar un Power BI limpio con 100 clientes realistas
TRUNCATE TABLE fagcuentacredito RESTART IDENTITY CASCADE;
TRUNCATE TABLE fmetasasesor RESTART IDENTITY CASCADE;
TRUNCATE TABLE dcuentacredito RESTART IDENTITY CASCADE;
TRUNCATE TABLE dcliente RESTART IDENTITY CASCADE;
TRUNCATE TABLE foperaciones RESTART IDENTITY CASCADE;
TRUNCATE TABLE dsolicitud RESTART IDENTITY CASCADE;
TRUNCATE TABLE devaluacion RESTART IDENTITY CASCADE;

-- Nota: No truncamos dpersonal, dagencia, dasesor, dproducto, etc.
-- Queremos mantener los 4 asesores de prueba y la estructura del banco.

COMMIT;
