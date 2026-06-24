# Core Financiero — Banco BBVA Per�
## Documento Técnico y Funcional

| Campo | Valor |
|---|---|
| **Proyecto** | Core Financiero — Banco BBVA Per� |
| **Descripción** | Motor de scoring, cartera crediticia y KPIs institucionales |
| **Versión** | 1.0.0 |
| **Backend** | FastAPI (Python) |
| **Base de datos** | PostgreSQL (`bd_core_financiero`) |
| **Frontend previsto** | React + Vite (`http://localhost:5173`) |
| **Fecha del documento** | 2026-05-28 |

> Este documento describe **lo que el código implementa actualmente**. Las secciones marcadas como *Pendiente* indican funcionalidad prevista pero aún no desarrollada.

---

## 1. Introducción

El sistema es un **núcleo financiero (core bancario)** para una entidad microfinanciera. Expone una API REST que da soporte a tres frentes:

1. **Originación de crédito** — evaluación automática de solicitudes mediante un motor de *scoring*.
2. **Gestión de cartera** — consulta de créditos, cronogramas y saldos de ahorro.
3. **Inteligencia de negocio** — KPIs institucionales, productividad de asesores y evolución histórica.

La autenticación se realiza con **JWT** y el acceso a datos se hace mayoritariamente vía **SQL parametrizado** sobre un modelo dimensional (tablas `d*` de dimensión y `f*`/`fag*` de hechos).

---

## 2. Alcance

### Incluido en esta versión
- Autenticación de personal (login con DNI + emisión de JWT).
- Motor de scoring crediticio con decisión automática y TEA sugerida.
- Consulta de cartera por asesor, detalle de crédito y cronograma de pagos.
- Consulta de clientes.
- Dashboard: KPIs de cartera, productividad de asesores e histórico.
- Ahorros: resumen por agencia, cuentas por cliente y detalle de cuenta.

### Fuera de alcance / Pendiente
- Registro/persistencia de solicitudes de crédito (solo se evalúa, no se guarda).
- Captaciones en KPIs (devuelven `0` como *placeholder*).
- Campos de plazo fijo (PF) en ahorros.
- Módulos ORM completos (agencias, asesores, metas, fag) — hoy se usa SQL crudo.
- Gestión de contraseñas real (en desarrollo `password = DNI`).

---

## 3. Arquitectura técnica

### 3.1 Patrón de capas

```
Cliente (React/Vite)
        │  HTTP/JSON
        ▼
┌──────────────────────────────────────────────┐
│  main.py  (FastAPI + CORS + routers)           │
├──────────────────────────────────────────────┤
│  routes/      → Endpoints (rtr_*)              │
│  controllers/ → Lógica de negocio (ctl_*)      │
│  repositories/→ Acceso a datos (rep_*)         │
│  schemas/     → Validación I/O Pydantic (sch_*)│
│  models/      → ORM SQLAlchemy (mdl_*)         │
│  core/        → Config, BD, seguridad (cfg_*)  │
└──────────────────────────────────────────────┘
        │
        ▼
   PostgreSQL  (bd_core_financiero)
```

El flujo típico es: **ruta → controlador → repositorio → BD**. Algunos módulos de solo lectura (créditos, ahorros) llaman al repositorio directamente desde la ruta.

### 3.2 Stack tecnológico

| Componente | Tecnología |
|---|---|
| Framework web | FastAPI 0.136 / Starlette 1.1 |
| Servidor ASGI | Uvicorn 0.48 |
| ORM / SQL | SQLAlchemy 2.0 |
| Driver BD | psycopg2-binary 2.9 |
| Validación | Pydantic 2.13 + pydantic-settings |
| Autenticación | python-jose (JWT, HS256) |
| Hash de contraseñas | passlib + bcrypt |
| Análisis numérico | pandas / numpy *(disponibles, sin uso activo)* |

### 3.3 Estructura de carpetas

```
backend_core_banco_BBVA Per�/
├── main.py                 # Punto de entrada, registra routers y CORS
├── .env                    # Variables de entorno
├── requirements.txt
├── app/
│   ├── core/
│   │   ├── cfg_config.py    # Settings desde .env
│   │   ├── cfg_database.py  # Engine, SessionLocal, get_db()
│   │   └── cfg_security.py  # Hash + JWT
│   ├── routes/             # rtr_auth, rtr_scoring, rtr_creditos,
│   │                       # rtr_ahorros, rtr_clientes, rtr_dashboard
│   ├── controllers/        # ctl_auth, ctl_scoring, ctl_dashboard
│   ├── repositories/       # rep_clientes, rep_creditos, rep_metas,
│   │                       # rep_fag, rep_ahorros
│   ├── schemas/            # sch_auth, sch_scoring, sch_creditos,
│   │                       # sch_clientes, sch_dashboard, sch_ahorros
│   └── models/             # mdl_clientes (ORM activo)
└── tests/
```

### 3.4 Configuración (`.env`)

| Variable | Propósito |
|---|---|
| `DATABASE_URL` | Cadena de conexión PostgreSQL |
| `SECRET_KEY` | Llave para firmar JWT |
| `ALGORITHM` | Algoritmo JWT (HS256) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Vigencia del token (60) |
| `PORTAL_BACKEND_URL` | URL del portal externo (integración futura) |
| `PORT` | Puerto de despliegue (8001) |

---

## 4. Modelo de datos (tablas consultadas)

El sistema lee de un modelo dimensional. Tablas referenciadas por el código:

| Tabla | Tipo | Uso |
|---|---|---|
| `dcliente` | Dimensión | Datos del cliente (ORM `DCliente`) |
| `dpersonal`, `dcargopersonal` | Dimensión | Personal y su cargo (login) |
| `dagencia` | Dimensión | Agencias |
| `dasesor` | Dimensión | Asesores |
| `dcuentacredito` | Dimensión | Cuentas de crédito |
| `dsolicitud` | Dimensión | Solicitudes de crédito |
| `dcalificacioncrediticia` | Dimensión | Calificación de riesgo |
| `dtipocredito` | Dimensión | Tipos de crédito |
| `dcuentaahorro`, `dtipocuentaahorro` | Dimensión | Cuentas y tipos de ahorro |
| `fagcuentacredito` | Hecho | Saldos/mora de cartera por período |
| `fcuentaahorro` | Hecho | Saldos de ahorro por período |
| `fplanpagomes` | Hecho | Cronograma de cuotas |
| `fmetasasesor` | Hecho | Metas vs. real por asesor |
| `fmetatipocredito` | Hecho | Metas vs. real por tipo de crédito |

---

## 5. Módulos funcionales

### 5.1 Autenticación (`/auth`)

**Descripción:** valida al personal por número de DNI y emite un JWT con su identidad, rol y agencia.

**Endpoint**

| Método | Ruta | Entrada | Salida |
|---|---|---|---|
| POST | `/auth/login` | `{ numerodni, password }` | `{ access_token, token_type, codpersonal, nombre, rol, codagencia }` |

**Reglas implementadas**
- Busca el personal en `dpersonal` (join a cargo y agencia).
- En desarrollo: `password` debe ser igual al `numerodni`. *(En producción se reemplaza por `verify_password`.)*
- El token incluye: `sub` (codpersonal), `nombre`, `rol`, `codagencia`. Vigencia 60 min.
- Credenciales inválidas → **HTTP 401**.

**Historias de usuario**
- **HU-01** — Como **asesor**, quiero iniciar sesión con mi DNI para obtener un token y acceder al sistema.
- **HU-02** — Como **sistema**, quiero incluir el rol y la agencia en el token para personalizar el acceso del usuario.

**Requisitos funcionales**
- **RF-01** El sistema debe autenticar al personal por su número de DNI.
- **RF-02** El sistema debe emitir un JWT firmado (HS256) con vigencia configurable.
- **RF-03** El token debe transportar identidad, rol y agencia del usuario.
- **RF-04** El sistema debe rechazar credenciales inválidas con código 401.

---

### 5.2 Scoring crediticio (`/scoring`)

**Descripción:** evalúa una solicitud de crédito y devuelve un puntaje (0–100), una decisión automática, la TEA sugerida y la cuota estimada.

**Endpoint**

| Método | Ruta | Entrada | Salida |
|---|---|---|---|
| POST | `/scoring/evaluar` | `ScoringIn` | `ScoringOut` |

**Entrada (`ScoringIn`):** `codcliente`, `montosolicitud`, `plazo` (meses), `codtipocredito` (ME/PE/CO/HI/GE), `montoingresoneto`, `codactividadeconomica`, `codasesor`.

**Salida (`ScoringOut`):** `codcliente`, `score`, `decision`, `tea_sugerida`, `cuota_estimada`, `observaciones[]`, `detalle_score{}`.

**Modelo de puntaje (100 pts)**

| Factor | Peso | Lógica |
|---|---|---|
| Capacidad de pago | 40 | Ratio cuota/ingreso: ≤30%→40 · ≤40%→30 · ≤50%→18 · >50%→5 |
| Historial en BD | 30 | Cliente no registrado→10 · con crédito vencido→5 · sin mora→30 |
| Sector económico | 20 | Según tabla de riesgo por CIIU (`codactividadeconomica`), default 10 |
| Plazo | 10 | ≤24m→10 · ≤48m→7 · ≤120m→4 · >120m→2 |

**Cálculo de cuota:** se deriva la tasa efectiva mensual desde la TEA del tipo de crédito y se aplica la fórmula de cuota fija (sistema francés).

**Decisión automática**

| Score | Decisión | TEA sugerida |
|---|---|---|
| ≥ 70 | **APROBADO** | TEA mínima del tipo |
| 50–69 | **OBSERVADO** | TEA media (requiere visto bueno del jefe) |
| < 50 | **RECHAZADO** | TEA máxima |

**Detección de mora (`tiene_credito_vencido`):** existe crédito con calificación interna en `('2','3','4')` (Deficiente / Dudoso / Pérdida) en el período `202512`.

**Historias de usuario**
- **HU-03** — Como **asesor**, quiero evaluar una solicitud para conocer si es aprobable antes de tramitarla.
- **HU-04** — Como **asesor**, quiero ver el desglose del puntaje (`detalle_score`) para explicar la decisión al cliente.
- **HU-05** — Como **jefe de agencia**, quiero que las solicitudes “OBSERVADO” se marquen como pendientes de mi aprobación.
- **HU-06** — Como **analista de riesgo**, quiero que el historial de mora del cliente penalice el puntaje.

**Requisitos funcionales**
- **RF-05** El sistema debe calcular un score de 0 a 100 a partir de 4 factores ponderados.
- **RF-06** El sistema debe estimar la cuota mensual según monto, plazo y TEA del tipo de crédito.
- **RF-07** El sistema debe emitir una decisión (APROBADO/OBSERVADO/RECHAZADO) según umbrales.
- **RF-08** El sistema debe sugerir la TEA según el nivel de riesgo resultante.
- **RF-09** El sistema debe registrar observaciones que justifiquen la decisión.
- **RF-10** El sistema debe penalizar al cliente con créditos en calificación Deficiente/Dudoso/Pérdida.

---

### 5.3 Créditos (`/creditos`)

**Descripción:** consulta de la cartera de un asesor, detalle de un crédito y su cronograma de pagos.

**Endpoints**

| Método | Ruta | Entrada | Salida |
|---|---|---|---|
| GET | `/creditos/cartera` | `pkasesor`, `periodomes` (query) | Lista de créditos del asesor |
| GET | `/creditos/{codcuentacredito}` | path | Detalle del crédito |
| GET | `/creditos/{codcuentacredito}/cronograma` | path | Plan de pagos (cuotas) |

**Reglas implementadas**
- La cartera se ordena por días de atraso descendente e incluye saldo, mora y calificación.
- Detalle inexistente → **HTTP 404**.
- El cronograma proviene de `fplanpagomes`, ordenado por número de cuota.

**Historias de usuario**
- **HU-07** — Como **asesor**, quiero ver mi cartera priorizada por morosidad para gestionar cobranzas.
- **HU-08** — Como **asesor**, quiero consultar el detalle de un crédito (saldos, tasa, fechas).
- **HU-09** — Como **cliente/asesor**, quiero ver el cronograma de cuotas de un crédito.

**Requisitos funcionales**
- **RF-11** El sistema debe listar la cartera activa de un asesor para un período dado.
- **RF-12** El sistema debe ordenar la cartera por días de atraso descendente.
- **RF-13** El sistema debe exponer el detalle de un crédito por su código.
- **RF-14** El sistema debe devolver el cronograma de pagos de un crédito.
- **RF-15** El sistema debe responder 404 ante un crédito inexistente.

---

### 5.4 Clientes (`/clientes`)

**Descripción:** consulta de la ficha de un cliente.

**Endpoint**

| Método | Ruta | Entrada | Salida |
|---|---|---|---|
| GET | `/clientes/{codcliente}` | path | `ClienteOut` |

**Reglas implementadas**
- Devuelve datos personales y de ingreso del cliente.
- Cliente inexistente → **HTTP 404**.

**Historias de usuario**
- **HU-10** — Como **asesor**, quiero consultar la ficha de un cliente por su código.

**Requisitos funcionales**
- **RF-16** El sistema debe devolver los datos de un cliente por su código.
- **RF-17** El sistema debe responder 404 ante un cliente inexistente.

---

### 5.5 Dashboard (`/dashboard`)

**Descripción:** indicadores institucionales de cartera, productividad de asesores y evolución histórica.

**Endpoints**

| Método | Ruta | Entrada | Salida |
|---|---|---|---|
| GET | `/dashboard/kpis` | `periodomes` (query) | KPIs de cartera |
| GET | `/dashboard/productividad-asesores` | `periodomes`, `codagencia` (query) | Productividad por asesor |
| GET | `/dashboard/evolucion-historica` | — | Serie por tipo de crédito |

**KPIs de cartera** (desde `fagcuentacredito`): cartera total, vigente, vencida, **ratio de mora** (vencida/total × 100), n.º de créditos activos y n.º de clientes deudores. *Las captaciones devuelven 0 (placeholder).*

**Productividad** (desde `fmetasasesor`): compara saldo real vs. meta y calcula un **semáforo**:

| Cumplimiento | Semáforo |
|---|---|
| ≥ 90% | VERDE |
| 70–89% | AMARILLO |
| < 70% | ROJO |

**Evolución histórica:** saldo real, meta y ratio de mora por período y tipo de crédito.

**Historias de usuario**
- **HU-11** — Como **gerente**, quiero ver KPIs de cartera y mora del período para tomar decisiones.
- **HU-12** — Como **jefe de agencia**, quiero medir el cumplimiento de metas de mis asesores con un semáforo.
- **HU-13** — Como **gerente**, quiero ver la evolución histórica por tipo de crédito.

**Requisitos funcionales**
- **RF-18** El sistema debe calcular KPIs de cartera (total, vigente, vencida, ratio de mora) por período.
- **RF-19** El sistema debe reportar el cumplimiento de metas por asesor con indicador de semáforo.
- **RF-20** El sistema debe permitir filtrar la productividad por agencia.
- **RF-21** El sistema debe exponer la evolución histórica por tipo de crédito.

---

### 5.6 Ahorros (`/ahorros`)

**Descripción:** consulta de captaciones por agencia, cuentas de un cliente y detalle de cuenta.

**Endpoints**

| Método | Ruta | Entrada | Salida |
|---|---|---|---|
| GET | `/ahorros/resumen-agencia/{codagencia}` | `periodomes` (query) | Saldo por tipo de cuenta |
| GET | `/ahorros/cliente/{codcliente}` | `periodomes` (query) | Cuentas del cliente |
| GET | `/ahorros/{codcuentaahorro}` | `periodomes` (query) | Detalle de la cuenta |

**Reglas implementadas**
- El resumen agrupa por tipo de cuenta y suma el saldo de capital.
- El detalle de cuenta inexistente → **HTTP 404**.
- Los campos de plazo fijo (PF) están previstos en el esquema pero aún no poblados.

**Historias de usuario**
- **HU-14** — Como **jefe de agencia**, quiero ver el saldo de ahorros por tipo de cuenta en mi agencia.
- **HU-15** — Como **asesor**, quiero listar las cuentas de ahorro de un cliente.
- **HU-16** — Como **asesor**, quiero ver el detalle de una cuenta de ahorro.

**Requisitos funcionales**
- **RF-22** El sistema debe resumir el saldo de ahorros por tipo de cuenta y agencia.
- **RF-23** El sistema debe listar las cuentas de ahorro de un cliente.
- **RF-24** El sistema debe exponer el detalle de una cuenta de ahorro.
- **RF-25** El sistema debe responder 404 ante una cuenta inexistente.

---

## 6. Reglas de negocio clave

### 6.1 Tabla de TEA por tipo de crédito

| Código | Tipo | TEA mín | TEA media | TEA máx |
|---|---|---|---|---|
| ME | Microempresa | 28.0 | 40.0 | 55.0 |
| PE | Pequeña empresa | 18.0 | 25.0 | 32.0 |
| CO | Consumo | 22.0 | 33.0 | 45.0 |
| HI | Hipotecario | 9.0 | 11.5 | 14.0 |
| GE | Genérico | 12.0 | 15.0 | 18.0 |

> Si el tipo no existe en la tabla, se usa un perfil por defecto (mín 30 / media 40 / máx 55).

### 6.2 Riesgo por sector económico (CIIU)

| Nivel | Códigos | Puntaje |
|---|---|---|
| Bajo | 4711, 4721, 4731, 5610, 6810, 8511 | 15–20 |
| Medio | 4921, 4923, 0111, 0112 | 10–12 |
| Alto | 6201, 5510 | 8 |
| No catalogado | — | 10 (default) |

---

## 7. Requisitos no funcionales

- **RNF-01 Seguridad:** autenticación basada en JWT (HS256) con expiración configurable.
- **RNF-02 Seguridad SQL:** todas las consultas usan parámetros enlazados (`text()` + binds), evitando inyección.
- **RNF-03 CORS:** habilitado para el origen del frontend (`http://localhost:5173`) con credenciales.
- **RNF-04 Configurabilidad:** parámetros sensibles externalizados en `.env`.
- **RNF-05 Resiliencia BD:** pool con `pool_pre_ping`, `pool_size=5`, `max_overflow=10`.
- **RNF-06 Documentación:** API autodocumentada vía OpenAPI/Swagger en `/docs`.
- **RNF-07 Mantenibilidad:** arquitectura por capas con responsabilidades separadas.

---

## 8. Estado actual y pendientes

### Implementado y operativo
- Login, scoring, créditos, clientes, dashboard y ahorros (lectura).
- Cadena de imports validada — la aplicación arranca correctamente.

### Pendiente / mejoras sugeridas
- **Persistir solicitudes** evaluadas por scoring (hoy no se guardan).
- **Captaciones reales** en los KPIs (hoy `0`).
- **Campos de plazo fijo (PF)** en ahorros.
- **Gestión de contraseñas** real (sustituir `password = DNI`).
- **Modelos ORM** de los demás dominios (agencias, asesores, metas, fag) — opcionales mientras se use SQL crudo.
- **Pruebas automatizadas** (la carpeta `tests/` está vacía).
- **Validación de salida**: usar los `response_model` (schemas ya definidos) en los endpoints que hoy devuelven `dict` crudo.

---

## 9. Despliegue local

```powershell
# 1. Activar entorno virtual
.\venv\Scripts\Activate.ps1

# 2. Instalar dependencias (si aplica)
pip install -r requirements.txt

# 3. Levantar el servidor
uvicorn main:app --reload --port 8001
```

**Verificación rápida (no requiere BD):**
- `http://localhost:8001/` → estado del sistema.
- `http://localhost:8001/docs` → documentación interactiva (Swagger).

> Los endpoints de negocio requieren PostgreSQL activo con la base `bd_core_financiero` y sus tablas pobladas.

---

## 10. Trazabilidad Historias ↔ Requisitos

| Módulo | Historias | Requisitos |
|---|---|---|
| Autenticación | HU-01, HU-02 | RF-01 … RF-04 |
| Scoring | HU-03 … HU-06 | RF-05 … RF-10 |
| Créditos | HU-07 … HU-09 | RF-11 … RF-15 |
| Clientes | HU-10 | RF-16, RF-17 |
| Dashboard | HU-11 … HU-13 | RF-18 … RF-21 |
| Ahorros | HU-14 … HU-16 | RF-22 … RF-25 |
