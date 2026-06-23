# 04_matriz_roles_permisos_bbva.md

# Matriz de Roles y Permisos — Sistema Integrado BBVA Perú Simulado

## Introducción

El presente documento define los roles y permisos del sistema integrado **BBVA Perú Simulado**, compuesto por el **Homebanking BBVA** y el **Core Bancario BBVA**.

El objetivo es evidenciar que las funcionalidades se encuentran separadas según el tipo de usuario. El cliente utiliza el Homebanking para consultar cuentas, transferir y solicitar créditos. En cambio, el personal interno del banco utiliza el Core Bancario para evaluar, aprobar, rechazar, desembolsar y gestionar recuperaciones.

---

## Roles del sistema

| Rol           | Sistema       | Descripción                                                                                                |
| ------------- | ------------- | ---------------------------------------------------------------------------------------------------------- |
| Cliente       | Homebanking   | Usuario final que registra cuentas, consulta saldos, realiza transferencias y solicita créditos.           |
| Asesor        | Core Bancario | Personal encargado de revisar solicitudes básicas, consultar evaluaciones y registrar gestiones iniciales. |
| Administrador | Core Bancario | Usuario interno con permisos para revisar solicitudes de mayor monto y ejecutar acciones administrativas.  |
| Jefe Regional | Core Bancario | Usuario encargado de revisar créditos de mayor nivel de aprobación o casos derivados por monto.            |
| Riesgos       | Core Bancario | Usuario responsable de revisar solicitudes de alto riesgo, créditos de monto elevado y acciones críticas.  |

---

## Usuarios de prueba

| Sistema          | Rol           | Usuario        | Contraseña            |
| ---------------- | ------------- | -------------- | --------------------- |
| Core Bancario    | Asesor        | 11111111       | 11111111              |
| Core Bancario    | Administrador | 11111112       | 11111112              |
| Core Bancario    | Jefe Regional | 11111113       | 11111113              |
| Core Bancario    | Riesgos       | 11111114       | 11111114              |
| Homebanking      | Cliente       | DNI registrado | Contraseña registrada |
| Homebanking demo | Cliente       | cli000001      | demo1234              |

> Nota: En modo desarrollo, el personal del banco puede autenticarse usando el DNI como usuario y contraseña. Si el entorno fue configurado con contraseña general, también puede utilizarse `bbva123`, según la configuración final del backend Core.

---

## Permisos por rol

| Funcionalidad                           | Cliente | Asesor | Administrador | Jefe Regional | Riesgos |
| --------------------------------------- | ------: | -----: | ------------: | ------------: | ------: |
| Registrarse en Homebanking              |      Sí |     No |            No |            No |      No |
| Iniciar sesión en Homebanking           |      Sí |     No |            No |            No |      No |
| Consultar cuentas                       |      Sí |     No |            No |            No |      No |
| Consultar saldo                         |      Sí |     No |            No |            No |      No |
| Realizar transferencias                 |      Sí |     No |            No |            No |      No |
| Solicitar préstamo                      |      Sí |     No |            No |            No |      No |
| Ver estado de préstamo propio           |      Sí |     No |            No |            No |      No |
| Iniciar sesión en Core                  |      No |     Sí |            Sí |            Sí |      Sí |
| Ver dashboard Core                      |      No |     Sí |            Sí |            Sí |      Sí |
| Ver bandeja de solicitudes              |      No |     Sí |            Sí |            Sí |      Sí |
| Ver detalle de solicitud                |      No |     Sí |            Sí |            Sí |      Sí |
| Ver RDS, score y semáforo               |      No |     Sí |            Sí |            Sí |      Sí |
| Aprobar solicitudes nivel asesor        |      No |     Sí |            Sí |            Sí |      Sí |
| Aprobar solicitudes nivel administrador |      No |     No |            Sí |            Sí |      Sí |
| Aprobar solicitudes nivel jefe regional |      No |     No |            No |            Sí |      Sí |
| Aprobar solicitudes nivel riesgos       |      No |     No |            No |            No |      Sí |
| Rechazar solicitudes                    |      No |     Sí |            Sí |            Sí |      Sí |
| Desembolsar créditos aprobados          |      No |     Sí |            Sí |            Sí |      Sí |
| Consultar cartera morosa                |      No |     Sí |            Sí |            Sí |      Sí |
| Registrar gestión de cobranza           |      No |     Sí |            Sí |            No |      No |
| Derivar crédito a judicial              |      No |     No |            Sí |            Sí |      Sí |
| Ejecutar castigo contable               |      No |     No |            No |            No |      Sí |

---

## Reglas de aprobación por monto

|                   Monto solicitado | Nivel de aprobación | Rol responsable |
| ---------------------------------: | ------------------- | --------------- |
|                    Hasta S/ 30,000 | Asesor              | Asesor          |
|  Más de S/ 30,000 hasta S/ 100,000 | Administrador       | Administrador   |
| Más de S/ 100,000 hasta S/ 300,000 | Jefe Regional       | Jefe Regional   |
|                  Más de S/ 300,000 | Riesgos             | Riesgos         |

---

## Reglas de riesgo crediticio

| Condición                             | Resultado                             |
| ------------------------------------- | ------------------------------------- |
| Ingresos menores a S/ 700             | Solicitud no viable o rechazada       |
| RDS menor o igual a 35%               | Semáforo verde                        |
| RDS mayor a 35% y menor o igual a 50% | Semáforo amarillo                     |
| RDS mayor a 50%                       | Semáforo rojo                         |
| Solicitud pendiente                   | Requiere revisión en Core             |
| Solicitud aprobada                    | Queda lista para desembolso           |
| Solicitud rechazada                   | Finaliza el flujo de otorgamiento     |
| Solicitud desembolsada                | Actualiza saldo y registra movimiento |

---

## Separación entre Homebanking y Core Bancario

El **Homebanking BBVA** permite al cliente realizar operaciones digitales, consultar cuentas, realizar transferencias y registrar solicitudes de crédito. Sin embargo, el Homebanking no aprueba créditos ni ejecuta desembolsos.

El **Core Bancario BBVA** es utilizado por el personal interno del banco. Desde este sistema se revisan las solicitudes generadas por los clientes, se evalúan los indicadores de riesgo, se aprueban o rechazan solicitudes y se ejecuta el desembolso cuando corresponde.

Esta separación permite simular el comportamiento de un banco real, donde el canal digital del cliente está integrado con el sistema interno de evaluación y operación bancaria.

---

## Validación de seguridad

Las acciones críticas deben validarse en el backend mediante control de roles. No basta con ocultar botones en el frontend. Por ejemplo:

* Un cliente no puede aprobar ni desembolsar créditos.
* Un asesor no puede aprobar solicitudes que correspondan al nivel de riesgos.
* Un administrador no debe ejecutar castigo contable.
* Solo el rol de riesgos puede ejecutar acciones de mayor criticidad.
* El desembolso solo puede ejecutarse si la solicitud está previamente aprobada.

---

## Evidencia esperada

Para demostrar el cumplimiento de esta matriz se deben presentar:

* Captura del login del Core Bancario.
* Captura del usuario autenticado con su rol.
* Captura de la bandeja de solicitudes.
* Captura de una acción permitida.
* Captura o respuesta de error 403 cuando un rol no autorizado intenta ejecutar una acción crítica.
* Consulta SQL de usuarios internos y cargos.
* Consulta SQL de solicitudes con nivel de aprobación y estado.
