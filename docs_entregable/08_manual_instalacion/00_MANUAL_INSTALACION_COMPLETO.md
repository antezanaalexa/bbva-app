# Manual de Instalación — BBVA Perú Simulado

## Índice

1. [Requisitos del sistema](#1-requisitos-del-sistema)
2. [Instalar la base de datos](#2-instalar-la-base-de-datos)
3. [Configurar variables de entorno](#3-configurar-variables-de-entorno)
4. [Levantar el Core Bancario](#4-levantar-el-core-bancario-puerto-8001--5174)
5. [Levantar el Homebanking](#5-levantar-el-homebanking-puerto-8000--5173)
6. [Ejecutar los seeds de demo](#6-ejecutar-los-seeds-de-demo)
7. [Verificar que todo funciona](#7-verificar-que-todo-funciona)
8. [Credenciales de prueba](#8-credenciales-de-prueba)

---

## 1. Requisitos del sistema

| Herramienta | Versión mínima | Instalador |
|---|---|---|
| Python | 3.10+ | https://python.org/downloads |
| Node.js + NPM | 18.x+ | https://nodejs.org |
| PostgreSQL | 14+ | https://postgresql.org/download |
| pgAdmin 4 | Cualquiera | (incluido con PostgreSQL) |
| Git | Cualquiera | https://git-scm.com |

> **Windows:** Se recomienda usar **Git Bash** o **PowerShell** como terminal.

---

## 2. Instalar la base de datos

### 2.1 Crear la base de datos

Abre pgAdmin → clic derecho en "Databases" → "Create" → "Database":

```
Name: bd_core_financiero
Owner: postgres (o tu usuario)
```

O desde `psql`:
```sql
CREATE DATABASE bd_core_financiero;
```

### 2.2 Ejecutar los scripts SQL

Conéctate a `bd_core_financiero` en pgAdmin y ejecuta **en orden** (Query Tool → cargar cada archivo):

```
06_scripts_sql/01_DDL_create_tables_bbva.sql
06_scripts_sql/02_DML_catalogos_bbva.sql
06_scripts_sql/03_DML_clientes_personal_bbva.sql
06_scripts_sql/04_DML_creditos_2025_bbva.sql
06_scripts_sql/05_DML_ahorros_2025_bbva.sql
06_scripts_sql/06_DML_metas_kpis_bbva.sql
06_scripts_sql/07_DDL_DML_mejoras_proyecto.sql
06_scripts_sql/08_DDL_DML_homebanking_bbva_local.sql
```

### 2.3 Crear las vistas para Power BI

```
10_powerbi_reporteria/02_vistas_powerbi_bbva.sql
```

---

## 3. Configurar variables de entorno

### Core Backend (`core-backend/.env`)

```env
DATABASE_URL=postgresql://postgres:TU_PASSWORD@localhost:5432/bd_core_financiero
SECRET_KEY=bbva_super_secret_key_2025
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480
```

### Homebanking Backend (`bbva-backend/.env`)

```env
DATABASE_URL=postgresql://postgres:TU_PASSWORD@localhost:5432/bd_core_financiero
SECRET_KEY=homebanking_secret_key_2025
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

> Reemplaza `TU_PASSWORD` por la contraseña de tu usuario PostgreSQL.

---

## 4. Levantar el Core Bancario (puerto 8001 + 5174)

### Backend

```bash
cd c:\Proyectos\BBVA\core-backend

# Primera vez — crear entorno virtual e instalar dependencias
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# Levantar el servidor
uvicorn main:app --reload --port 8001
```

### Frontend

```bash
cd c:\Proyectos\BBVA\core-fronted

# Primera vez — instalar dependencias
npm install

# Levantar
npm run dev
```

✅ El Core Bancario estará disponible en: **http://localhost:5174**

---

## 5. Levantar el Homebanking (puerto 8000 + 5173)

### Backend

```bash
cd c:\Proyectos\BBVA\bbva-backend
.\venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd c:\Proyectos\BBVA\bbva-fronted
npm install   # solo primera vez
npm run dev
```

✅ El Homebanking estará disponible en: **http://localhost:5173**

---

## 6. Ejecutar los seeds de demo

Los seeds generan datos de prueba para la aplicación (usuarios, cuentas, solicitudes, cartera Power BI).

```bash
cd c:\Proyectos\BBVA\core-backend
.\venv\Scripts\activate

python ..\docs_entregable\06_scripts_sql\bbva_seed\02_seed_clientes_bbva.py
python ..\docs_entregable\06_scripts_sql\bbva_seed\03_seed_cuentas_transacciones.py
python ..\docs_entregable\06_scripts_sql\bbva_seed\04_seed_solicitudes.py
python ..\docs_entregable\06_scripts_sql\bbva_seed\05_seed_cartera_powerbi.py
```

> ⚠️ Si ves errores de "duplicate key", ejecuta primero:
> `06_scripts_sql/bbva_seed/01_limpieza_controlada.sql` en pgAdmin.

---

## 7. Verificar que todo funciona

| Verificación | URL |
|---|---|
| API Core (Swagger) | http://localhost:8001/docs |
| API Homebanking (Swagger) | http://localhost:8000/docs |
| Core Frontend | http://localhost:5174 |
| Homebanking Frontend | http://localhost:5173 |

En el Swagger del Core, prueba:
- `GET /api/core/dashboard/kpis` → debe retornar JSON con KPIs
- `POST /api/auth/login` → con `{"dni": "11111111", "password": "************"}`

---

## 8. Credenciales de prueba

### Core Bancario — http://localhost:5174

| Rol | DNI | Contraseña | Acceso |
|---|---|---|---|
| **Asesor de Negocios** | `11111111` | `************` | Su propia bandeja, aprobar/rechazar propias solicitudes, nueva solicitud, cartera, recuperaciones |
| **Administrador de Agencia** | `11111112` | `************` | Bandeja completa, aprobar/rechazar todas, desembolsar, ahorros |
| **Jefe Regional** | `11111113` | `************` | Bandeja completa, aprobar/rechazar todas, dashboard institucional |
| **Jefe de Riesgos** | `11111114` | `************` | Bandeja completa, opinión de riesgos, recuperaciones |

### Homebanking — http://localhost:5173

* **Cliente Regular (Angela Aguilar):** DNI/Usuario: `75915758` / Contraseña: `************`
* **Cliente Digital (Johnny Rodriguez):** DNI/Usuario: `22222222` / Contraseña: `************`

*(Las contraseñas reales e individuales de exposición para la demo en local se encuentran registradas de forma segura en el archivo local privado `docs_entregable/08_manual_instalacion/05_credenciales_prueba_PRIVADO.md`, el cual está excluido de GitHub por seguridad).*

---

## Troubleshooting común

| Error | Solución |
|---|---|
| `could not connect to server` | Verificar que PostgreSQL esté corriendo (puerto 5432) |
| `ModuleNotFoundError` | Activar el entorno virtual (`.\venv\Scripts\activate`) |
| `relation does not exist` | Ejecutar los scripts SQL en el orden indicado |
| Puerto ya en uso | Cambiar el puerto: `uvicorn main:app --reload --port 8002` |
| Token inválido | Limpiar localStorage del navegador y volver a iniciar sesión |
