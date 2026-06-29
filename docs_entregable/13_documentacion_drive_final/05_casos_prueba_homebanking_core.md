# 🧪 Casos de Prueba del Flujo Integrado — Homebanking ↔ Core Bancario

Este documento detalla el cumplimiento de la **sección 4** de las exigencias del docente, estructurando los casos de prueba (CP) en tablas estructuradas con datos de entrada, pasos, y resultados esperados para evidenciar el flujo de extremo a extremo y la ciberseguridad.

---

## 📋 Casos de Prueba (CP)

| ID | Módulo / Funcionalidad | Usuario Demo | Datos de Entrada | Pasos de Ejecución | Resultado Esperado | Evidencia Sugerida | Estado |
|---|---|---|---|---|---|---|---|
| **CP01** | **Login Cliente Homebanking** | DNI: `75915758`<br>Clave: `************` | JSON:<br>`{"username":"75915758", "password":"..."}` | 1. Ir a portal Homebanking.<br>2. Digitar DNI e ingresar clave.<br>3. Clic en "Ingresar". | Sesión iniciada correctamente, token JWT emitido y guardado en LocalStorage. Redirección al Dashboard. | Captura de pantalla del Dashboard del cliente. | Exitoso |
| **CP02** | **Visualizar Cuentas y Saldos** | DNI: `75915758` | Headers:<br>`Authorization: Bearer <token>` | 1. Cargar página de inicio de Homebanking.<br>2. El frontend realiza petición GET a `/api/cuentas/{user_id}`. | Se listan las cuentas corrientes y de ahorros propias del cliente con saldos correctos. | Captura de tarjetas visuales de cuenta. | Exitoso |
| **CP03** | **Simulación de Crédito** | DNI: `75915758` | Monto: `S/ 8,000`<br>Plazo: `12 meses`<br>Ingresos: `S/ 3,500` | 1. Ir a sección "Simular Crédito".<br>2. Completar ingresos, monto y plazo.<br>3. Clic en "Simular". | Cálculo instantáneo de cuota mensual fija (S/ 1,003.21) a TEA 41.20% (TEM 2.92%). Semáforo de RDS en verde. | Captura de tabla del cronograma de cuotas en pantalla. | Exitoso |
| **CP04** | **Solicitar Crédito** | DNI: `75915758` | Cuenta Destino ID y datos de simulación aprobada. | 1. Clic en "Solicitar Préstamo".<br>2. Seleccionar cuenta de desembolso.<br>3. Confirmar solicitud. | Solicitud guardada en BD en estado `pendiente`. Se redirige a historial de solicitudes. | Captura del mensaje "Solicitud enviada exitosamente". | Exitoso |
| **CP05** | **Recepción de Solicitud en Core** | Asesor DNI: `11111111`<br>Clave: `************` | Headers:<br>`Authorization: Bearer <token>` | 1. Entrar al Core Bancario.<br>2. Ir a "Mis Solicitudes". | La solicitud generada por el cliente figura en la bandeja con estado `pendiente` y nivel `asesor`. | Captura de bandeja de solicitudes del Asesor. | Exitoso |
| **CP06** | **Evaluación de RDS y Score** | Asesor DNI: `11111111` | ID de Solicitud creada. | 1. Hacer doble clic en la solicitud.<br>2. Ver detalle. | El Core calcula RDS (Ingresos vs Cuota), score y muestra semáforo (Verde, Amarillo o Rojo) según reglas de riesgo. | Captura de la sección de Scoring y Riesgo. | Exitoso |
| **CP07** | **Aprobación en Core** | Asesor DNI: `11111111` | ID de Solicitud. | 1. Clic en el botón verde "✓" en la bandeja. | Estado de la solicitud pasa de `pendiente` a `aprobado` en base de datos. Se deshabilitan botones de acción. | Captura de solicitud en estado aprobado. | Exitoso |
| **CP08** | **Desembolso en Core** | Admin DNI: `11111112`<br>Clave: `************` | ID de Solicitud aprobada. | 1. Iniciar sesión como Administrador en Core.<br>2. Buscar la solicitud aprobada.<br>3. Clic en "Desembolsar". | Estado pasa a `desembolsado`. El dinero se suma al saldo de la cuenta de ahorros del cliente en BD. | Captura de confirmación de desembolso exitoso. | Exitoso |
| **CP09** | **Reflejo de Desembolso (Cliente)** | DNI: `75915758` | Headers:<br>`Authorization: Bearer <token>` | 1. Iniciar sesión en Homebanking.<br>2. Ver saldo de cuenta receptora. | El saldo se incrementó en S/ 8,000 y figura un nuevo movimiento de tipo "Préstamo Desembolsado" en el historial. | Captura del extracto de movimientos en Homebanking. | Exitoso |
| **CP10** | **Validación de Transferencia** | DNI: `75915758` | Cuenta destino de Johnny, monto S/ 50.00. | 1. Ir a transferir en Homebanking.<br>2. Digitar cuenta destino y monto.<br>3. Clic en transferir. | Se descuenta S/ 50 de la cuenta origen y se suma a la cuenta destino. Transacción queda registrada. | Captura de pantalla de la constancia de transferencia. | Exitoso |

---

## 🔒 Reglas Aplicadas a las Credenciales en Pruebas
1. **Contraseñas Censuradas:** Por ciberseguridad, ninguna clave real en texto plano está escrita en este documento o diapositivas públicas.
2. **Origen de Datos:** Las claves reales se encuentran en el archivo gitignored `05_credenciales_prueba_PRIVADO.md` de tu máquina local.
3. **Mantenimiento:** Las contraseñas se almacenan cifradas en la base de datos local usando la función criptográfica `bcrypt` con factor de trabajo adaptativo lento.
