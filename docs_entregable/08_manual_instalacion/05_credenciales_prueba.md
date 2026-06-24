# 05. Credenciales de Prueba (Sistema Seguro)

El sistema cuenta con niveles de seguridad por **Roles** (RBAC). Las contraseñas en la base de datos están encriptadas con el estándar de la industria **Bcrypt**, por lo que son irreconocibles si alguien vulnera la base de datos. 

Para fines de prueba y demostración, se configuraron usuarios de prueba predeterminados en el Core Bancario. La contraseña para todos ellos es su mismo número de DNI.

## Accesos al Core Bancario (http://localhost:5174)

| Rol | DNI (Usuario) | Contraseña | Cargo Asignado |
|---|---|---|---|
| **Asesor de Negocios** | `11111111` | `11111111` | Asesor de Negocios |
| **Administrador** | `11111112` | `11111112` | Administrador de Agencia |
| **Jefe Regional** | `11111113` | `11111113` | Jefe de Negocios Regional |
| **Riesgos** | `11111114` | `11111114` | Jefe de Riesgos |

> **Nota Técnica de Seguridad:** Al ejecutar el script de configuración `01_encriptar_passwords.py`, el sistema toma los DNIs y los convierte a hashes seguros. Al momento de iniciar sesión, el backend aplica `passlib/bcrypt` para validar la contraseña de texto plano contra el hash de la BD. No existen accesos "backdoor" en texto plano.

## Accesos al Homebanking (http://localhost:5173)

El nuevo módulo de Homebanking ha sido reconstruido y los clientes reales se registran y validan usando la tabla **`app_usuarios`**. 
Cualquier cliente nuevo que se registre mediante la pantalla "Registrarse" aparecerá aquí.

Para ingresar a una cuenta de prueba:
1. Revisa tu tabla `app_usuarios` en la base de datos (por ejemplo, el usuario con correo `alexa@gmail.com`).
2. Usa el DNI registrado como "Usuario".
3. Usa la contraseña en texto plano con la que creaste la cuenta (guardada en la columna `password_hash`).
