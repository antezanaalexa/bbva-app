# 📦 BBVA Perú Simulado — Entregable del Proyecto

## Descripción General

Sistema de **Core Bancario + Homebanking** desarrollado con FastAPI (Python) y React (Vite), conectado a PostgreSQL. Simula los módulos de originación crediticia, gestión de cartera, captaciones (ahorros) y recuperaciones de mora del Banco BBVA Perú.

---

## 🗂️ Estructura del Entregable

| Carpeta | Contenido |
|---|---|
| `01_rubrica_detallada/` | Rúbrica oficial del proyecto y guía de Power BI del docente |
| `02_historias_requisitos/` | Historias de usuario, requerimientos funcionales/no funcionales, matriz de roles |
| `03_reglas_negocio/` | Reglas del motor de scoring BBVA, lógica de RDS, semáforos y bandas de mora |
| `04_arquitectura_uml/` | Diagramas UML (casos de uso, secuencia, clases, despliegue) |
| `05_pruebas_evidencias/` | Evidencias de pruebas funcionales y capturas del sistema |
| `06_scripts_sql/` | Scripts DDL/DML de la base de datos + seeds Python para datos de demo |
| `07_backups/` | Backups `.sql` listos para restaurar con `pg_restore` o pgAdmin |
| `08_manual_instalacion/` | Guía paso a paso para instalar y levantar el sistema |
| `09_manual_usuario/` | Manual de uso para cada rol (cliente, asesor, administrador, jefe) |
| `10_powerbi_reporteria/` | Guía Power BI + consultas SQL + modelo de datos |
| `11_documento_final/` | Documento técnico-funcional completo del proyecto |
| `12_referencias_proyecto_base/` | Código base del proyecto Andino referenciado |

---

## 🚀 Inicio Rápido

### Opción A — Un solo comando (Windows)
```bat
cd c:\Proyectos\BBVA
start_all.bat
```

### Opción B — Manual (4 terminales separadas)

**Backend Core** (puerto 8001):
```bash
cd c:\Proyectos\BBVA\core-backend
.\venv\Scripts\activate
uvicorn main:app --reload --port 8001
```

**Backend Homebanking** (puerto 8000):
```bash
cd c:\Proyectos\BBVA\bbva-backend
.\venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

**Frontend Core** (puerto 5174):
```bash
cd c:\Proyectos\BBVA\core-fronted
npm run dev
```

**Frontend Homebanking** (puerto 5173):
```bash
cd c:\Proyectos\BBVA\bbva-fronted
npm run dev
```

---

## 🌐 URLs del Sistema

| Sistema | URL |
|---|---|
| **Homebanking BBVA** (clientes) | http://localhost:5173 |
| **Core Bancario** (colaboradores) | http://localhost:5174 |
| **API Core** (Swagger) | http://localhost:8001/docs |
| **API Homebanking** (Swagger) | http://localhost:8000/docs |

---

## 🔑 Credenciales de Prueba

### Core Bancario (colaboradores)
| Rol | DNI | Contraseña | Permisos clave |
|---|---|---|---|
| Asesor de Negocios | `11111111` | `11111111` | Crear solicitudes, ver su propia bandeja, aprobar/rechazar las propias |
| Administrador | `11111112` | `11111112` | Bandeja completa, aprobar/rechazar todas, desembolsar |
| Jefe Regional | `11111113` | `11111113` | Bandeja completa, aprobar/rechazar todas |
| Jefe de Riesgos | `11111114` | `11111114` | Bandeja completa, opinión de riesgos |

### Homebanking (clientes)
Registrarse en http://localhost:5173 con cualquier DNI y correo electrónico.

---

## 📊 Power BI

Ver guía completa en: `10_powerbi_reporteria/01_guia_powerbi_paso_a_paso.md`

**Resumen:** Conectar Power BI Desktop a PostgreSQL local (`bd_core_financiero`, puerto 5432) e importar las vistas `vw_bbva_*`.

---

## 🗃️ Base de Datos

**Nombre:** `bd_core_financiero`  
**Motor:** PostgreSQL 14+  
**Puerto:** 5432

Ver orden de ejecución de scripts en: `06_scripts_sql/README_EJECUCION_BBVA_LOCAL.md`
