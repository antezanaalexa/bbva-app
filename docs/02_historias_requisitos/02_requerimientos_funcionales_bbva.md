# 02_requerimientos_funcionales_bbva.md

# Requerimientos Funcionales — Sistema Integrado BBVA Perú Simulado

## Introducción

El presente documento define los requerimientos funcionales del sistema integrado **BBVA Perú Simulado**, conformado por el Homebanking y el Core Bancario. Estos requerimientos describen las funciones que el sistema debe cumplir para permitir el flujo completo de registro de clientes, gestión de cuentas, transferencias, solicitudes de crédito, evaluación, aprobación, desembolso y recuperación de cartera morosa.

---

## Requerimientos funcionales del Homebanking

| Código | Requerimiento funcional                                                                                                                    | Módulo         |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| RF-01  | El sistema debe permitir registrar clientes desde el Homebanking con nombres, apellidos, DNI, correo, contraseña, tipo de cuenta y moneda. | Registro       |
| RF-02  | El sistema debe crear automáticamente una cuenta inicial al registrar un cliente.                                                          | Cuentas        |
| RF-03  | El sistema debe permitir iniciar sesión al cliente usando DNI y contraseña.                                                                | Autenticación  |
| RF-04  | El sistema debe mostrar al cliente sus cuentas activas, saldo, moneda, tipo de cuenta, número de cuenta y CCI.                             | Cuentas        |
| RF-05  | El sistema debe permitir crear cuentas adicionales según los productos disponibles.                                                        | Cuentas        |
| RF-06  | El sistema debe permitir realizar transferencias internas entre cuentas existentes.                                                        | Transferencias |
| RF-07  | El sistema debe validar saldo suficiente antes de realizar una transferencia.                                                              | Transferencias |
| RF-08  | El sistema debe impedir transferencias a la misma cuenta.                                                                                  | Transferencias |
| RF-09  | El sistema debe impedir transferencias entre monedas distintas en la versión actual.                                                       | Transferencias |
| RF-10  | El sistema debe registrar movimientos de débito y crédito por cada transferencia.                                                          | Movimientos    |
| RF-11  | El sistema debe permitir simular un préstamo personal ingresando monto y plazo.                                                            | Créditos       |
| RF-12  | El sistema debe calcular la cuota mensual del préstamo.                                                                                    | Créditos       |
| RF-13  | El sistema debe permitir enviar una solicitud de préstamo desde Homebanking.                                                               | Créditos       |
| RF-14  | El sistema debe guardar la solicitud de préstamo con estado `pendiente`.                                                                   | Créditos       |
| RF-15  | El sistema debe permitir al cliente visualizar el estado de sus solicitudes.                                                               | Créditos       |
| RF-16  | El sistema debe permitir visualizar movimientos recientes asociados a las cuentas.                                                         | Movimientos    |

---

## Requerimientos funcionales del Core Bancario

| Código | Requerimiento funcional                                                                                  | Módulo             |
| ------ | -------------------------------------------------------------------------------------------------------- | ------------------ |
| RF-17  | El sistema debe permitir iniciar sesión al personal interno del banco.                                   | Autenticación Core |
| RF-18  | El sistema debe identificar el rol del usuario interno: asesor, administrador, jefe regional o riesgos.  | Seguridad          |
| RF-19  | El sistema debe mostrar un dashboard con KPIs de solicitudes, aprobaciones, rechazos y desembolsos.      | Dashboard          |
| RF-20  | El sistema debe listar en el Core las solicitudes generadas desde Homebanking.                           | Solicitudes        |
| RF-21  | El sistema debe mostrar el detalle de una solicitud con datos del cliente y evaluación crediticia.       | Solicitudes        |
| RF-22  | El sistema debe calcular o consultar el RDS de una solicitud.                                            | Evaluación         |
| RF-23  | El sistema debe mostrar el score crediticio de la solicitud.                                             | Evaluación         |
| RF-24  | El sistema debe mostrar el semáforo de riesgo: verde, amarillo o rojo.                                   | Evaluación         |
| RF-25  | El sistema debe mostrar el nivel de aprobación asignado: asesor, administrador, jefe regional o riesgos. | Evaluación         |
| RF-26  | El sistema debe permitir aprobar solicitudes según el rol correspondiente.                               | Otorgamiento       |
| RF-27  | El sistema debe permitir rechazar solicitudes registrando el motivo.                                     | Otorgamiento       |
| RF-28  | El sistema debe permitir desembolsar solicitudes aprobadas.                                              | Desembolso         |
| RF-29  | El sistema debe actualizar el saldo de la cuenta del cliente al desembolsar.                             | Desembolso         |
| RF-30  | El sistema debe registrar una transacción de tipo crédito por el desembolso.                             | Desembolso         |
| RF-31  | El sistema debe cambiar el estado de la solicitud a `desembolsado`.                                      | Desembolso         |
| RF-32  | El sistema debe permitir consultar cartera morosa por bandas.                                            | Recuperaciones     |
| RF-33  | El sistema debe permitir registrar gestiones de cobranza.                                                | Recuperaciones     |
| RF-34  | El sistema debe permitir derivar créditos a judicial si cumplen el umbral de atraso.                     | Recuperaciones     |
| RF-35  | El sistema debe permitir castigar créditos con más de 180 días de atraso.                                | Recuperaciones     |

---

## Reglas funcionales de crédito

| Código | Regla funcional                                                                                  |
| ------ | ------------------------------------------------------------------------------------------------ |
| RFC-01 | Si los ingresos mensuales son menores a S/ 700, la solicitud no debe ser viable.                 |
| RFC-02 | El RDS se calcula como cuota mensual dividida entre ingresos mensuales, multiplicado por 100.    |
| RFC-03 | Si el RDS es menor o igual a 35%, el semáforo debe ser verde.                                    |
| RFC-04 | Si el RDS es mayor a 35% y menor o igual a 50%, el semáforo debe ser amarillo.                   |
| RFC-05 | Si el RDS es mayor a 50%, el semáforo debe ser rojo.                                             |
| RFC-06 | Si el monto es menor o igual a S/ 30,000, el nivel de aprobación debe ser asesor.                |
| RFC-07 | Si el monto es mayor a S/ 30,000 y menor o igual a S/ 100,000, el nivel debe ser administrador.  |
| RFC-08 | Si el monto es mayor a S/ 100,000 y menor o igual a S/ 300,000, el nivel debe ser jefe regional. |
| RFC-09 | Si el monto es mayor a S/ 300,000, el nivel debe ser riesgos.                                    |
| RFC-10 | El Homebanking no debe aprobar créditos; solo registra la solicitud.                             |
| RFC-11 | El Core Bancario es el responsable de aprobar, rechazar y desembolsar créditos.                  |
| RFC-12 | El desembolso debe reflejarse en saldo y movimientos del Homebanking.                            |
