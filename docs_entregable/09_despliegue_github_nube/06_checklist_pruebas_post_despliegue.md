# Checklist de Pruebas Post-Despliegue — BBVA Perú Simulado

Este documento contiene el plan de pruebas exhaustivo que debe ejecutarse inmediatamente después de finalizar el despliegue en la nube para garantizar el correcto funcionamiento e integración de todos los componentes.

---

## Fase 1: Pruebas en Homebanking Público (`[URL_FRONTEND_HOMEBANKING]`)

- [ ] **Acceso Inicial**: Abrir `[URL_FRONTEND_HOMEBANKING]` y verificar que el portal cargue rápidamente, mostrando la tipografía institucional y estética BBVA.
- [ ] **Inicio de Sesión (Cliente)**: Iniciar sesión usando las credenciales del usuario semilla (DNI `11111111`, contraseña provista en privado).
- [ ] **Visualización de Cuentas**: Comprobar que en la pantalla de inicio del Homebanking se listen las cuentas de ahorro en soles y dólares del cliente, y que muestren los saldos correspondientes de la base de datos Neon.
- [ ] **Consulta de Movimientos**: Hacer clic en una cuenta de ahorros y comprobar que se listen las transacciones históricas sin retraso.
- [ ] **Simulación de Transferencia**:
  - Ir a la sección de transferencias.
  - Realizar una transferencia a otra cuenta del mismo cliente o de terceros (ej. del mismo banco) por un monto de `100.00 PEN`.
  - Confirmar que se descuente del saldo de origen, se sume en el destino y se cree el registro en movimientos.
- [ ] **Solicitud de Crédito**:
  - Ir a la sección de solicitud de préstamo.
  - Ingresar los datos de solicitud (Monto: `25000`, Plazo: `24 meses`, Ingresos: `6000`).
  - Confirmar el envío de la solicitud. Debe quedar en estado `PENDIENTE` en Homebanking.

---

## Fase 2: Pruebas en Core Público (`[URL_FRONTEND_CORE]`)

- [ ] **Acceso y Login (Administrador)**:
  - Abrir `[URL_FRONTEND_CORE]`.
  - Iniciar sesión con un rol de administrador o riesgos del Core.
- [ ] **Dashboard Financiero**: Confirmar que los gráficos de colocación y metas del dashboard carguen con la información de las tablas agregadas.
- [ ] **Bandeja de Solicitudes**: 
  - Ingresar a la sección de aprobación de solicitudes de crédito.
  - Verificar que la solicitud enviada en la Fase 1 aparezca en la bandeja como `PENDIENTE`.
- [ ] **Evaluación Automática**:
  - Abrir el detalle de la solicitud.
  - Comprobar que el sistema muestre correctamente:
    - **Score Crediticio**.
    - **Relación Deuda/Ingreso (RDS)**.
    - **Semáforo RDS** (Verde/Amarillo/Rojo).
    - **Nivel de Aprobación** requerido (ej: RIESGOS, COMITE, etc.).
- [ ] **Proceso de Aprobación**:
  - Cambiar el estado de la solicitud a `APROBADA`.
- [ ] **Desembolso**:
  - Ejecutar el desembolso desde el panel del Core. Confirmar que cambie a estado `DESEMBOLSADO` en el Core.

---

## Fase 3: Validación Cruzada (Integración Completa)

- [ ] **Actualización de Saldo en Homebanking**:
  - Regresar a `[URL_FRONTEND_HOMEBANKING]`.
  - Iniciar sesión o recargar el portal.
  - Confirmar que el saldo de la cuenta de ahorros destino seleccionada haya recibido el abono del monto del crédito desembolsado.
  - Confirmar que en los movimientos de la cuenta aparezca un registro tipo "CRÉDITO" con el concepto del préstamo desembolsado.

---

## Fase 4: Pruebas de Seguridad y Restricciones

- [ ] **Acceso sin Token (401 Unauthorized)**:
  - Intentar acceder directamente a un endpoint protegido de los backends desde una herramienta REST (ej: Postman) o desde el navegador sin cabecera de autorización (ej: `[URL_BACKEND_HOMEBANKING]/api/cuentas`).
  - Confirmar que devuelve código de estado HTTP `401 Unauthorized`.
- [ ] **Acceso a Recurso Ajeno (403 Forbidden)**:
  - Generar un token con el usuario A (ej: DNI `11111111`).
  - Intentar consultar información de una cuenta perteneciente al usuario B (ej: hacer GET al ID de cuenta de otro cliente).
  - Confirmar que el backend bloquea la petición y devuelve HTTP `403 Forbidden`.
- [ ] **Saldo Insuficiente (400 Bad Request)**:
  - Intentar realizar una transferencia por un monto mayor al saldo disponible.
  - Confirmar que la petición es rechazada por el backend devolviendo HTTP `400 Bad Request` con mensaje de saldo insuficiente.
- [ ] **Validación de CORS en Producción**:
  - Intentar hacer fetch a los backends públicos desde un dominio no listado en la variable `CORS_ALLOWED_ORIGINS` (por ejemplo, ejecutando un script fetch en la consola de `google.com`).
  - Confirmar que el navegador bloquea la petición por violación de la política de CORS.
- [ ] **Protección de Datos Privados**:
  - Revisar el repositorio público en GitHub para asegurar que ningún archivo `.env` o credenciales del archivo `05_credenciales_prueba_PRIVADO.md` hayan sido agregados o subidos accidentalmente.
