# Scripts SQL adaptados para Proyecto BBVA Local

Base local recomendada: `bd_core_financiero`

## Orden de ejecución en pgAdmin / DBeaver / psql

1. Crear la base de datos manualmente:

```sql
CREATE DATABASE bd_core_financiero;
```

2. Conectarse a `bd_core_financiero`.

3. Ejecutar en este orden:

```txt
00_DDL_drop_tables_bbva.sql
01_DDL_create_tables_bbva.sql
02_DML_catalogos_bbva.sql
03_DML_clientes_personal_bbva.sql
04_DML_creditos_2025_bbva.sql
05_DML_ahorros_2025_bbva.sql
06_DML_metas_kpis_bbva.sql
07_DDL_DML_mejoras_proyecto.sql
08_DDL_DML_homebanking_bbva_local.sql
```

## Qué hace el script 08

Crea una capa compatible con tu Homebanking BBVA actual para dejar Supabase:

- `app_usuarios`
- `cuentas`
- `transacciones`
- `pagos`
- `solicitudes_prestamo`
- reglas BBVA simuladas de aprobación, RDS y mora
- funciones:
  - `bbva_crear_cuenta_app(...)`
  - `bbva_transferir_app(...)`
  - `bbva_nivel_aprobacion(...)`
  - `bbva_semaforo_rds(...)`

## Idea de arquitectura

Frontend BBVA React → Backend FastAPI Homebanking → `bd_core_financiero`

Core Bancario FastAPI → misma `bd_core_financiero`

Así se cumple la rúbrica: Core y Homebanking comparten una sola base de datos.

