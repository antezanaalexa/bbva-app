# 🛡️ Reporte de Mitigación de Riesgos y Reto de Ciberseguridad

Este documento describe el análisis y las defensas activas aplicadas en el proyecto **BBVA Perú Simulado** para mitigar los 5 vectores de ataque exigidos en el **Reto de Ciberseguridad (Semana 14)**.

---

## 🔒 Vectores de Ataque y Defensas Implementadas

### 1. Inyección SQL (SQL Injection)
* **Descripción:** Ocurre cuando un atacante altera sentencias de base de datos inyectando fragmentos de código malicioso a través de campos de entrada (ej: inputs de login).
* **Riesgo Bancario:** Robo de bases de datos de clientes, suplantación de identidad y borrado total de saldos.
* **Defensa Aplicada:** Se eliminó cualquier construcción dinámica de sentencias SQL mediante concatenación de cadenas (`string + variable`). En su lugar:
  * El backend del Core usa **consultas parametrizadas puras** de SQLAlchemy con bind parameters (`:param`).
  * El backend de Homebanking usa placeholders nativos de `psycopg2` (`%s`). Los valores del usuario se tratan puramente como literales, anulando cualquier ejecución de código SQL inyectado.
* **Evidencia Técnica:** Archivos [auth.py](file:///c:/Proyectos/BBVA/bbva-backend/routers/auth.py) y [credito_repository.py](file:///c:/Proyectos/BBVA/bbva-backend/repositories/credito_repository.py) donde las sentencias usan placeholders paramétricos estructurados.

### 2. Cross-Site Scripting (XSS)
* **Descripción:** Inyección de scripts maliciosos (JavaScript) que se ejecutan en el navegador de otros usuarios al visualizar contenido web infectado.
* **Riesgo Bancario:** Secuestro de la sesión activa (`sessionStorage` o `localStorage`) y redirecciones a páginas falsas (phishing).
* **Defensa Aplicada:** 
  * En el frontend de React.js, todas las variables renderizadas dentro de plantillas JSX son automáticamente **escapadas y saneadas** por el compilador para evitar que etiquetas como `<script>` sean ejecutadas como código por el navegador.
  * En el backend, las clases de validación de esquemas de **Pydantic** (`LoginRequest`, `TransferenciaRequest`) validan y restringen de forma estricta los tipos de datos de entrada (strings, floats, UUIDs), rechazando caracteres o formatos inesperados.

### 3. IDOR (Insecure Direct Object Reference)
* **Descripción:** El atacante modifica un parámetro (como el ID de un recurso en la URL) para acceder no autorizado a datos de otros usuarios sin pasar por verificaciones de propiedad.
* **Riesgo Bancario:** Un cliente altera la URL y visualiza saldos, movimientos o cancela créditos de otros clientes.
* **Defensa Aplicada (Fase 2 de Seguridad):**
  * Los endpoints sensibles ya no confían en el `user_id` enviado por el frontend. El backend intercepta el token JWT del header de autorización y extrae el `user_id` oficial decodificado del servidor (`current_user.get("sub")`).
  * En transferencias, créditos, ahorros y pagos se valida directamente en la base de datos que la cuenta de origen o la solicitud pertenezcan al usuario dueño del token. Si no coincide, el servidor interrumpe la ejecución respondiendo con un código **`403 Forbidden`**.
* **Evidencia Técnica:** Routers en [transacciones.py](file:///c:/Proyectos/BBVA/bbva-backend/routers/transacciones.py), [creditos.py](file:///c:/Proyectos/BBVA/bbva-backend/routers/creditos.py) y [ahorros.py](file:///c:/Proyectos/BBVA/bbva-backend/routers/ahorros.py).

### 4. Fuerza Bruta (Brute Force)
* **Descripción:** Pruebas sistemáticas y masivas de combinaciones de contraseñas sobre una cuenta de usuario hasta dar con la clave correcta.
* **Riesgo Bancario:** Acceso ilícito y desfalco de cuentas de clientes con contraseñas débiles o predecibles.
* **Defensa Aplicada:**
  * Se eliminaron las contraseñas basadas en patrones deducibles como `password = DNI` o contraseñas compartidas.
  * Todas las claves de los 134 colaboradores y 113 clientes de la base de datos se actualizaron a valores complejos individuales autogenerados de 12 caracteres (incluyendo mayúsculas, minúsculas, números y caracteres especiales).
  * El hash y almacenamiento se realiza con el estándar **Bcrypt** con factor de costo adaptativo alto. Al ser un algoritmo lento por diseño, incrementa exponencialmente el tiempo y poder computacional requerido por el atacante, haciendo inviable un ataque de fuerza bruta.
  * Respuestas de error genéricas (`"Credenciales incorrectas"`) para evitar dar pistas de si el DNI o el password eran los incorrectos.

### 5. Configuración Insegura (Insecure Configuration)
* **Descripción:** Dejar expuestas configuraciones por defecto, credenciales de desarrollo en código fuente abierto o secretos en texto plano en repositorios públicos.
* **Riesgo Bancario:** Filtración de claves secretas de firma de tokens JWT o contraseñas de base de datos en repositorios públicos de GitHub, permitiendo a terceros vulnerar la base de datos o firmar tokens falsos válidos.
* **Defensa Aplicada:**
  * Centralización de llaves en archivos `.env` (locales).
  * Inclusión estricta de los archivos `.env`, `.env.local` y los archivos privados de contraseñas (`05_credenciales_prueba_PRIVADO.md`) en el archivo `.gitignore`.
  * Generación de plantillas seguras `.env.example` y manuales de credenciales censurados (`05_credenciales_prueba_EJEMPLO.md`) para subidas públicas sin fugas de secretos reales.

---

## 🧪 Pruebas de Evidencias Controladas (Hardening Defensivo)

El funcionamiento de estas defensas se valida y comprueba localmente obteniendo las siguientes respuestas HTTP del servidor:

1. **Prueba `401 Unauthorized`:** Intentar llamar a una ruta protegida (ej: `/api/ahorros/cfbdd5a6...`) sin token de autenticación en la cabecera. El servidor responde `401 Unauthorized` (`{"detail": "Not authenticated"}`).
2. **Prueba `403 Forbidden`:** Intentar llamar a una ruta de ahorros de un Usuario B usando el token firmado del Usuario A. El servidor responde inmediatamente `403 Forbidden` (`{"detail": "No autorizado para acceder a este recurso"}`).
3. **Prueba `400 Bad Request`:** Intentar transferir fondos por un monto que excede el saldo de la cuenta de origen. El backend captura la regla de negocio y responde `400 Bad Request` (`{"detail": "Saldo insuficiente"}`).
4. **Prueba `200 OK`:** Realizar peticiones legítimas con tokens JWT y credenciales del propio usuario firmadas y vigentes.
