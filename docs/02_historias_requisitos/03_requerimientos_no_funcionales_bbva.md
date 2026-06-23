# 03_requerimientos_no_funcionales_bbva.md

# Requerimientos No Funcionales — Sistema Integrado BBVA Perú Simulado

## Introducción

Este documento define los requerimientos no funcionales del sistema integrado BBVA Perú Simulado. Estos requerimientos describen las características de calidad, arquitectura, seguridad, usabilidad, documentación y mantenimiento que debe cumplir el proyecto.

---

## Requerimientos no funcionales

| Código | Requerimiento no funcional                                                                               | Categoría     |
| ------ | -------------------------------------------------------------------------------------------------------- | ------------- |
| RNF-01 | El sistema debe utilizar PostgreSQL local como base de datos principal.                                  | Base de datos |
| RNF-02 | El Homebanking y el Core Bancario deben compartir la misma base de datos `bd_core_financiero`.           | Integración   |
| RNF-03 | El backend debe desarrollarse con FastAPI.                                                               | Tecnología    |
| RNF-04 | Los frontends deben desarrollarse con React y Vite.                                                      | Tecnología    |
| RNF-05 | El sistema debe organizarse bajo arquitectura en capas.                                                  | Arquitectura  |
| RNF-06 | El backend debe separar rutas, controladores, servicios, repositorios y modelos.                         | Arquitectura  |
| RNF-07 | El Core Bancario debe aplicar autenticación para usuarios internos.                                      | Seguridad     |
| RNF-08 | El Core Bancario debe manejar control de acceso basado en roles.                                         | Seguridad     |
| RNF-09 | Las operaciones críticas deben validarse en backend, no solo en frontend.                                | Seguridad     |
| RNF-10 | El sistema debe proteger las contraseñas de clientes mediante hash o mecanismo equivalente.              | Seguridad     |
| RNF-11 | El sistema debe mostrar mensajes claros de error, éxito y validación.                                    | Usabilidad    |
| RNF-12 | La interfaz debe usar identidad visual inspirada en BBVA Perú.                                           | Diseño        |
| RNF-13 | La interfaz debe ser clara, ordenada y responsive.                                                       | Diseño        |
| RNF-14 | Las operaciones de transferencia y desembolso deben mantener consistencia entre cuentas y transacciones. | Integridad    |
| RNF-15 | Las acciones importantes deben registrar fecha de creación o actualización.                              | Trazabilidad  |
| RNF-16 | El sistema debe permitir demostrar el flujo completo de extremo a extremo.                               | Pruebas       |
| RNF-17 | El proyecto debe incluir scripts SQL versionados.                                                        | Documentación |
| RNF-18 | El proyecto debe incluir historias de usuario, RF, RNF, matriz de roles y diagramas UML.                 | Documentación |
| RNF-19 | El proyecto debe incluir evidencias de pruebas funcionales.                                              | Documentación |
| RNF-20 | El proyecto debe incluir backup o dump de la base de datos.                                              | Respaldo      |

---

## Arquitectura esperada

El sistema se organiza en dos aplicaciones principales:

| Aplicación         | Frontend     | Backend | Puerto      |
| ------------------ | ------------ | ------- | ----------- |
| Homebanking BBVA   | React + Vite | FastAPI | 5173 / 8000 |
| Core Bancario BBVA | React + Vite | FastAPI | 5174 / 8001 |

Ambas aplicaciones se conectan a una única base de datos:

| Base de datos        | Motor      | Uso                                     |
| -------------------- | ---------- | --------------------------------------- |
| `bd_core_financiero` | PostgreSQL | Base compartida para Core y Homebanking |

---

## Tablas principales utilizadas

| Tabla                  | Uso principal                                                          |
| ---------------------- | ---------------------------------------------------------------------- |
| `app_usuarios`         | Clientes registrados desde Homebanking                                 |
| `cuentas`              | Cuentas bancarias de los clientes                                      |
| `transacciones`        | Movimientos de débito, crédito, transferencias y desembolsos           |
| `solicitudes_prestamo` | Solicitudes de crédito creadas desde Homebanking y gestionadas en Core |
| `pagos`                | Pagos de servicios                                                     |
| `dpersonal`            | Personal interno del banco                                             |
| `dpersonalcargo`       | Relación entre personal y cargo                                        |
| `dcargopersonal`       | Cargos y roles internos del Core                                       |

---

## Criterios de calidad

El sistema se considera correcto si cumple con los siguientes criterios:

* El cliente puede registrarse e iniciar sesión en Homebanking.
* El cliente puede visualizar sus cuentas.
* El cliente puede realizar transferencias.
* El cliente puede solicitar un préstamo.
* La solicitud aparece en el Core Bancario.
* El usuario interno puede aprobar, rechazar o desembolsar.
* El desembolso actualiza saldo y transacciones.
* El cliente visualiza el desembolso en Homebanking.
* Las operaciones críticas están restringidas por rol.
* La documentación contiene historias de usuario, RF, RNF, UML, scripts y evidencias.
