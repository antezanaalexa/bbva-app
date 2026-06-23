# 01_historias_usuario_bbva.md

# Historias de Usuario — Sistema Integrado BBVA Perú Simulado

## Introducción

El presente documento describe las historias de usuario principales del proyecto académico **Sistema Integrado BBVA Perú Simulado**, compuesto por dos aplicaciones conectadas a una misma base de datos PostgreSQL: el **Homebanking BBVA**, utilizado por los clientes, y el **Core Bancario BBVA**, utilizado por el personal interno del banco.

El objetivo es evidenciar el flujo completo de negocio: el cliente solicita un crédito desde Homebanking, la solicitud aparece en el Core Bancario, el personal autorizado la evalúa, aprueba o rechaza y, en caso de aprobación, ejecuta el desembolso. Finalmente, el cliente visualiza el saldo actualizado y el movimiento correspondiente en Homebanking.

---

## HU-01 — Registro de cliente en Homebanking

**Como** cliente nuevo,
**quiero** registrarme en el Homebanking BBVA,
**para** poder acceder a mis cuentas y servicios digitales.

### Criterios de aceptación

* El sistema debe permitir registrar nombres, apellidos, DNI, correo, contraseña, tipo de cuenta y moneda.
* Al registrarse, debe crearse un usuario en la base de datos local.
* Al registrarse, debe crearse automáticamente una cuenta bancaria inicial.
* La cuenta debe quedar activa y con saldo inicial cero.
* El cliente debe poder iniciar sesión después del registro.

---

## HU-02 — Login de cliente

**Como** cliente registrado,
**quiero** iniciar sesión con mi DNI y contraseña,
**para** ingresar a mi Banca por Internet.

### Criterios de aceptación

* El sistema debe validar las credenciales contra la base de datos local.
* Si las credenciales son correctas, el cliente accede al dashboard.
* Si las credenciales son incorrectas, el sistema muestra un mensaje de error.
* La sesión debe mantenerse mientras el usuario navega por el sistema.

---

## HU-03 — Consulta de cuentas

**Como** cliente,
**quiero** visualizar mis cuentas bancarias,
**para** conocer mi saldo, moneda, tipo de cuenta y número de cuenta.

### Criterios de aceptación

* El sistema debe listar solo las cuentas asociadas al cliente autenticado.
* Debe mostrar número de cuenta, CCI, tipo de cuenta, moneda, saldo y estado.
* Solo deben mostrarse cuentas activas.
* El saldo debe actualizarse luego de transferencias o desembolsos.

---

## HU-04 — Transferencia entre cuentas

**Como** cliente,
**quiero** transferir dinero desde una cuenta propia hacia otra cuenta BBVA,
**para** realizar operaciones digitales.

### Criterios de aceptación

* El sistema debe validar que la cuenta origen exista.
* El sistema debe validar que la cuenta destino exista.
* El sistema debe validar saldo suficiente.
* El sistema debe validar que la cuenta origen esté activa.
* El sistema no debe permitir transferir a la misma cuenta.
* En la versión actual, el sistema no debe permitir transferencias entre monedas distintas.
* La transferencia debe descontar saldo de la cuenta origen.
* La transferencia debe aumentar saldo de la cuenta destino.
* Debe registrarse un movimiento de débito y un movimiento de crédito.

---

## HU-05 — Solicitud de préstamo desde Homebanking

**Como** cliente,
**quiero** solicitar un préstamo personal desde Homebanking,
**para** recibir una evaluación crediticia preliminar.

### Criterios de aceptación

* El cliente debe ingresar monto, plazo, ingresos mensuales y propósito.
* El sistema debe calcular la cuota mensual.
* El sistema debe calcular el RDS.
* El sistema debe asignar score, semáforo y nivel de aprobación.
* La solicitud debe guardarse con estado `pendiente`.
* El cliente solo debe visualizar monto, plazo, cuota estimada, estado y fecha.
* El cliente no debe visualizar información interna como score, RDS o nivel de aprobación.

---

## HU-06 — Login del personal del Core

**Como** colaborador del banco,
**quiero** iniciar sesión en el Core Bancario,
**para** revisar solicitudes y operaciones internas.

### Criterios de aceptación

* El sistema debe permitir login con DNI y contraseña.
* El sistema debe identificar el rol del colaborador.
* Los roles disponibles son asesor, administrador, jefe regional y riesgos.
* El sistema debe generar una sesión segura para el usuario interno.
* Cada rol debe tener acceso solo a las acciones permitidas.

---

## HU-07 — Bandeja de solicitudes en Core

**Como** asesor o usuario interno del banco,
**quiero** visualizar las solicitudes generadas desde Homebanking,
**para** iniciar su evaluación.

### Criterios de aceptación

* El Core debe listar las solicitudes registradas en la tabla `solicitudes_prestamo`.
* Debe mostrar datos del cliente, monto, plazo, cuota, ingresos, RDS, score, semáforo, nivel y estado.
* Las solicitudes pendientes deben diferenciarse visualmente.
* El sistema debe permitir acceder al detalle de cada solicitud.

---

## HU-08 — Evaluación crediticia

**Como** usuario interno del banco,
**quiero** revisar la evaluación crediticia de una solicitud,
**para** decidir si corresponde aprobar, rechazar o derivar.

### Criterios de aceptación

* El sistema debe mostrar ingresos mensuales.
* El sistema debe mostrar cuota mensual.
* El sistema debe mostrar RDS.
* El sistema debe mostrar score.
* El sistema debe mostrar semáforo de riesgo.
* El sistema debe mostrar nivel de aprobación.
* El sistema debe mostrar estado actual de la solicitud.

---

## HU-09 — Aprobación o rechazo de solicitud

**Como** usuario autorizado del Core,
**quiero** aprobar o rechazar solicitudes de crédito,
**para** completar la evaluación bancaria.

### Criterios de aceptación

* Solo los roles permitidos deben poder aprobar o rechazar.
* Una solicitud pendiente puede pasar a aprobada o rechazada.
* Una solicitud rechazada debe registrar el motivo.
* Una solicitud aprobada queda lista para desembolso.
* El cambio de estado debe reflejarse en la base de datos compartida.

---

## HU-10 — Desembolso de crédito

**Como** usuario autorizado del Core,
**quiero** desembolsar una solicitud aprobada,
**para** entregar el monto del préstamo al cliente.

### Criterios de aceptación

* Solo se puede desembolsar una solicitud aprobada.
* El sistema debe buscar una cuenta activa del cliente.
* El sistema debe aumentar el saldo de la cuenta.
* El sistema debe registrar una transacción de tipo crédito.
* El estado de la solicitud debe cambiar a `desembolsado`.
* El cliente debe ver el nuevo saldo en Homebanking.

---

## HU-11 — Visualización del desembolso en Homebanking

**Como** cliente,
**quiero** ver el dinero desembolsado en mi cuenta,
**para** confirmar que mi préstamo fue aprobado y abonado.

### Criterios de aceptación

* El saldo debe aumentar después del desembolso.
* El movimiento debe aparecer como crédito o desembolso de préstamo.
* La solicitud debe figurar como desembolsada.
* La información debe coincidir con lo registrado por el Core Bancario.

---

## HU-12 — Consulta de cartera morosa

**Como** usuario del Core,
**quiero** consultar créditos por bandas de mora,
**para** identificar clientes que requieren gestión de cobranza.

### Criterios de aceptación

* El sistema debe mostrar bandas de mora: preventiva, temprana, tardía, judicial y castigo.
* Debe mostrar KPIs de cartera y mora.
* Debe permitir filtrar por estado o banda.
* La información debe provenir de la base de datos local.

---

## HU-13 — Registro de gestión de cobranza

**Como** asesor o gestor de cobranza,
**quiero** registrar acciones de cobranza,
**para** mantener historial de seguimiento del cliente.

### Criterios de aceptación

* El sistema debe permitir registrar llamada, mensaje, visita o compromiso de pago.
* Cada gestión debe guardar fecha, usuario, comentario y resultado.
* El historial debe poder consultarse posteriormente.
* La gestión debe estar asociada al cliente o crédito correspondiente.

---

## HU-14 — Transición a judicial o castigo

**Como** usuario autorizado del Core,
**quiero** cambiar créditos morosos a judicial o castigo,
**para** cumplir la política de recuperaciones.

### Criterios de aceptación

* Solo roles autorizados pueden realizar la transición.
* Créditos con 121 días o más pueden pasar a judicial.
* Créditos con más de 180 días pueden pasar a castigo.
* El sistema debe validar los días de atraso antes del cambio.
* El cambio debe quedar registrado en la base de datos.
