# 📦 BBVA Perú Simulado — Portal de Banca por Internet & Core Bancario

Este proyecto es un sistema simulado completo del banco **BBVA Perú**, desarrollado para fines estrictamente académicos. Contempla la simulación del portal de clientes (Homebanking) y del sistema de gestión interno (Core Bancario), integrando seguridad criptográfica, validación de propiedad y reportes analíticos.

---

## 🚀 Módulos del Sistema

1. **Homebanking BBVA (Portal del Cliente):**
   * Consulta de saldos, cuentas de ahorro, y movimientos.
   * Transferencias inmediatas en tiempo real (Soles / Dólares).
   * Simulación y solicitud de préstamos de consumo.
2. **Core Bancario (Colaboradores del Banco):**
   * Bandeja de solicitudes de créditos ruteadas por montos.
   * Evaluación de Ratios de Sobreendeudamiento (RDS) y scoring crediticio.
   * Aprobación multinivel y desembolso de fondos directo a cuentas.
   * Bandeja de cobranzas y compromisos de pago para créditos en mora.

---

## 🛠️ Tecnologías Utilizadas

* **Backend:** FastAPI (Python 3.10+), PostgreSQL (Psycopg2), SQLAlchemy, Uvicorn, Python-Jose (JWT), Bcrypt.
* **Frontend:** React.js, Vite, Axios, Tailwind CSS / Vanilla CSS, Lucide React.
* **Base de Datos:** PostgreSQL (Modelo relacional y estrella).
* **Reportería:** Capa semántica de vistas conectada a Power BI.

---

## 🗂️ Estructura del Proyecto

```
BBVA/
├── bbva-backend/          # API Backend de Homebanking (Puerto 8000)
├── bbva-fronted/          # Frontend de Homebanking (Puerto 5173)
├── core-backend/          # API Backend de Core Bancario (Puerto 8001)
├── core-fronted/          # Frontend de Core Bancario (Puerto 5174)
├── docs_entregable/       # Manuales, Diagramas UML, Reportes y Backups de BD
│   ├── 07_backups/        # Backup portable (backup_bbva_sin_owner.sql)
│   ├── 08_manual_instalacion/
│   │   ├── 05_credenciales_prueba_EJEMPLO.md  # Público (Censurado)
│   │   └── 05_credenciales_prueba_PRIVADO.md  # Local Privado (Gitignored)
│   └── ...
├── start_all.bat          # Arrancador rápido para Windows
└── README.md              # Este archivo
```

---

## 🔑 Credenciales Demo de Prueba (Censurado)

Por motivos de ciberseguridad, las credenciales se listan aquí de forma **censurada**:

### A. Core Bancario (Personal Interno)
| Rol | DNI (Usuario) | Contraseña Demo |
|---|---|---|
| Asesor de Negocios | `11111111` | `************` |
| Administrador de Agencia | `11111112` | `************` |
| Jefe Regional | `11111113` | `************` |
| Jefe de Riesgos | `11111114` | `************` |

### B. Homebanking (Clientes)
| Caso | DNI (Usuario) | Correo | Contraseña Demo |
|---|---|---|---|
| Cliente Regular | `75915758` | `ange@gmail.com` | `************` |
| Cliente Digital | `22222222` | `johnny@gmail.com` | `************` |
| Cliente Profesor | `33333333` | `profesor@bbva.pe` | `************` |

> 🔑 **Nota de Seguridad:** Las contraseñas en texto plano reales para pruebas locales se encuentran registradas exclusivamente en el archivo local privado `docs_entregable/08_manual_instalacion/05_credenciales_prueba_PRIVADO.md`, el cual está excluido de este repositorio mediante `.gitignore` para cumplir con las directivas de ciberseguridad.

---

## 🔒 Seguridad Implementada (Reto de Ciberseguridad)

* **IDOR (Insecure Direct Object Reference) Mitigado:** Los endpoints de transacciones, créditos, ahorros y pagos en el backend validan que el `user_id` del recurso coincida exactamente con el parámetro `sub` decodificado del token JWT firmado.
* **Autenticación JWT:** Sesión protegida con firmas `HS256` y expiración automática de token (120 min).
* **Almacenamiento de Contraseñas:** Encriptación irreversible **Bcrypt** con generación de salt individual.
* **Inyección SQL Mitigada:** Parámetros aislados mediante consultas parametrizadas puras y placeholders `:param` / `%s`.
* **Configuraciones Inseguras Evitadas:** Exclusión estricta de credenciales de base de datos y llaves JWT en GitHub a través del uso de variables `.env` y `.gitignore`.

---

## ⚙️ Guía de Arranque Local

### Requisitos Previos
* Python 3.10+ y Node.js 18+.
* PostgreSQL corriendo localmente con base de datos `bd_core_financiero`.

### Paso 1: Levantar todo con un solo comando (Windows)
En el directorio raíz del proyecto, ejecuta:
```bat
start_all.bat
```
*(Este script iniciará de forma paralela los dos backends FastAPI en los puertos 8000 y 8001, y los dos frontends React en los puertos 5173 y 5174).*

### Paso 2: Ejecución Manual (Alternativo)
* **API Homebanking:** `cd bbva-backend && uvicorn main:app --port 8000 --reload`
* **Homebanking Web:** `cd bbva-fronted && npm run dev` (abre http://localhost:5173)
* **API Core Bancario:** `cd core-backend && uvicorn main:app --port 8001 --reload`
* **Core Bancario Web:** `cd core-fronted && npm run dev` (abre http://localhost:5174)

---

## ☁️ Preparación para Despliegue en la Nube (Fase 4)

El proyecto está preparado estructuralmente para despliegues independientes:
* **Base de Datos:** Migración portable con `backup_bbva_sin_owner.sql` para restaurar en Neon PostgreSQL o AWS RDS.
* **API Backends:** Preparados para desplegar en Render / Railway / Heroku. Se debe configurar la variable de entorno `DATABASE_URL` y `SECRET_KEY` en cada panel de administración.
* **Web Frontends:** Listos para compilar con `npm run build` y desplegar en Vercel / Netlify. Se debe apuntar la variable de entorno `VITE_API_URL` al dominio de la API de producción.

---

> ⚠️ **Aclaración Académica:** Este es un proyecto académico de simulación desarrollado para la asignatura de Ingeniería de Software. No realiza transacciones con dinero real ni pertenece a BBVA Perú oficial.
