# Scripts SQL y Seeds — BBVA Core Financiero

## Estructura de esta carpeta

```
06_scripts_sql/
├── 00_DDL_drop_tables_bbva.sql          ← Limpieza: elimina todas las tablas
├── 01_DDL_create_tables_bbva.sql        ← Creación del modelo dimensional completo
├── 02_DML_catalogos_bbva.sql            ← Catálogos base (agencias, productos, etc.)
├── 03_DML_clientes_personal_bbva.sql    ← Clientes y personal de la institución
├── 04_DML_creditos_2025_bbva.sql        ← Cartera de créditos histórica 2025
├── 05_DML_ahorros_2025_bbva.sql         ← Cuentas de ahorros histórico 2025
├── 06_DML_metas_kpis_bbva.sql           ← Metas por asesor y KPIs
├── 07_DDL_DML_mejoras_proyecto.sql      ← Mejoras y correcciones al modelo
├── 08_DDL_DML_homebanking_bbva_local.sql← Tablas app (usuarios, cuentas, solicitudes)
├── consulta_credenciales_login.sql      ← Consulta para verificar usuarios de prueba
│
└── bbva_seed/                           ← Seeds Python para datos de demo
    ├── 00_backup_previo.txt             ← Instrucciones de backup previo
    ├── 01_limpieza_controlada.sql       ← Limpia solo tablas de demo (sin borrar catálogos)
    ├── 02_seed_clientes_bbva.py         ← Genera clientes y usuarios en app_usuarios
    ├── 03_seed_cuentas_transacciones.py ← Genera cuentas bancarias y transacciones
    ├── 04_seed_solicitudes.py           ← Genera solicitudes de préstamo con scoring
    └── 05_seed_cartera_powerbi.py       ← Genera cartera histórica para Power BI
```

---

## ▶️ Paso 1 — Ejecutar los scripts SQL en pgAdmin

> Conectarse primero a la base de datos `bd_core_financiero`.

Ejecutar **en este orden exacto** (copiar y pegar en pgAdmin → Query Tool):

```
00_DDL_drop_tables_bbva.sql        (solo si quieres reiniciar desde cero)
01_DDL_create_tables_bbva.sql
02_DML_catalogos_bbva.sql
03_DML_clientes_personal_bbva.sql
04_DML_creditos_2025_bbva.sql
05_DML_ahorros_2025_bbva.sql
06_DML_metas_kpis_bbva.sql
07_DDL_DML_mejoras_proyecto.sql
08_DDL_DML_homebanking_bbva_local.sql
```

> ⚠️ Si solo quieres recrear los datos de demo sin tocar las tablas maestras,
> usa primero `bbva_seed/01_limpieza_controlada.sql`.

---

## ▶️ Paso 2 — Ejecutar los seeds Python (datos de demo)

Los seeds Python generan datos realistas en las tablas de la aplicación (`app_usuarios`, `cuentas`, `solicitudes_prestamo`, `fagcuentacredito`).

**Requisito:** Tener el backend Core corriendo o el entorno virtual activado.

```bash
# Desde la raíz del proyecto, activar el entorno del core-backend
cd c:\Proyectos\BBVA\core-backend
.\venv\Scripts\activate

# Ejecutar en orden:
python ..\docs_entregable\06_scripts_sql\bbva_seed\02_seed_clientes_bbva.py
python ..\docs_entregable\06_scripts_sql\bbva_seed\03_seed_cuentas_transacciones.py
python ..\docs_entregable\06_scripts_sql\bbva_seed\04_seed_solicitudes.py
python ..\docs_entregable\06_scripts_sql\bbva_seed\05_seed_cartera_powerbi.py
```

### ¿Qué genera cada seed?

| Script | Qué genera |
|---|---|
| `02_seed_clientes_bbva.py` | Usuarios demo en `app_usuarios` con DNIs y contraseñas |
| `03_seed_cuentas_transacciones.py` | Cuentas de ahorro y transacciones simuladas |
| `04_seed_solicitudes.py` | Solicitudes de préstamo con scoring automático BBVA |
| `05_seed_cartera_powerbi.py` | 12 meses (2025) de datos en `fagcuentacredito` para Power BI |

---

## 🔍 Verificar credenciales de login

Después de ejecutar los seeds, usa esta consulta para ver los usuarios disponibles:

```sql
-- Ver: 06_scripts_sql/consulta_credenciales_login.sql
SELECT id, dni, nombres, apellidos, rol, estado
FROM app_usuarios
ORDER BY rol, dni;
```

---

## 📊 Vistas para Power BI

Las vistas semánticas (`vw_bbva_*`) están en:
```
10_powerbi_reporteria/02_vistas_powerbi_bbva.sql
```

Ver la guía completa de conexión en:
```
10_powerbi_reporteria/01_guia_powerbi_paso_a_paso.md
```
