# 01_reglas_credito_bbva.md

# Reglas de Negocio de Crédito — BBVA Perú Simulado

## Introducción

El presente documento describe las reglas de negocio aplicadas en el módulo de créditos del sistema integrado **BBVA Perú Simulado**. Estas reglas permiten que el Homebanking y el Core Bancario trabajen de forma integrada sobre la base de datos `bd_core_financiero`.

El objetivo del flujo crediticio es simular el proceso bancario donde el cliente solicita un préstamo desde Homebanking y el personal interno del banco evalúa, aprueba, rechaza o desembolsa la solicitud desde el Core Bancario.

---

## Separación de responsabilidades

El proyecto divide responsabilidades entre dos sistemas:

| Sistema            | Responsabilidad                                                                    |
| ------------------ | ---------------------------------------------------------------------------------- |
| Homebanking BBVA   | Permite al cliente simular y registrar una solicitud de préstamo.                  |
| Core Bancario BBVA | Permite al personal interno evaluar, aprobar, rechazar y desembolsar la solicitud. |
| Base de datos      | Centraliza solicitudes, clientes, cuentas, transacciones y estados.                |

---

## Regla 1 — El Homebanking no aprueba créditos

El Homebanking solo permite al cliente:

* Simular un préstamo.
* Registrar una solicitud.
* Visualizar el estado de su solicitud.
* Ver el desembolso cuando el Core lo procesa.

El Homebanking no puede aprobar, rechazar ni desembolsar créditos. Estas acciones pertenecen únicamente al Core Bancario.

---

## Regla 2 — Registro de solicitud

Cuando el cliente solicita un crédito desde Homebanking, el sistema debe registrar la información en la tabla `solicitudes_prestamo`.

Campos principales:

| Campo                | Descripción                      |
| -------------------- | -------------------------------- |
| `user_id`            | Identificador del cliente        |
| `monto`              | Monto solicitado                 |
| `plazo_meses`        | Plazo del crédito                |
| `tasa_anual`         | Tasa anual referencial           |
| `cuota_mensual`      | Cuota calculada                  |
| `proposito`          | Motivo del préstamo              |
| `ingresos_mensuales` | Ingreso declarado por el cliente |
| `rds`                | Ratio deuda sobre ingreso        |
| `semaforo_rds`       | Verde, amarillo o rojo           |
| `score`              | Puntaje preliminar               |
| `nivel_aprobacion`   | Rol responsable                  |
| `estado`             | Estado de la solicitud           |

---

## Regla 3 — Estado inicial

Toda solicitud creada desde Homebanking debe iniciar con estado:

```txt
pendiente
```

Este estado indica que la solicitud fue registrada correctamente y queda lista para ser revisada desde el Core Bancario.

---

## Regla 4 — Ingresos mínimos

Para que una solicitud sea considerada viable, el cliente debe declarar ingresos mensuales iguales o mayores a:

```txt
S/ 700
```

Si los ingresos son menores a S/ 700, la solicitud debe considerarse no viable o rechazable.

---

## Regla 5 — Cálculo de cuota mensual

La cuota mensual se calcula a partir de:

* Monto solicitado.
* Plazo en meses.
* Tasa anual referencial.

La fórmula usada corresponde al sistema de cuota fija, donde el cliente paga una cuota mensual estimada durante todo el plazo.

---

## Regla 6 — Cálculo de RDS

El RDS representa el porcentaje de los ingresos mensuales que se destinaría al pago de la cuota del préstamo.

Fórmula:

```txt
RDS = (cuota_mensual / ingresos_mensuales) * 100
```

Ejemplo:

```txt
cuota_mensual = S/ 501.66
ingresos_mensuales = S/ 3000

RDS = (501.66 / 3000) * 100
RDS = 16.72%
```

---

## Regla 7 — Semáforo de riesgo

El semáforo se asigna según el RDS:

| Condición          | Semáforo | Interpretación                                |
| ------------------ | -------- | --------------------------------------------- |
| RDS <= 35%         | Verde    | Cliente con capacidad de pago viable          |
| RDS > 35% y <= 50% | Amarillo | Cliente requiere evaluación adicional         |
| RDS > 50%          | Rojo     | Cliente con riesgo alto de sobreendeudamiento |

---

## Regla 8 — Score preliminar

El score es un puntaje referencial que permite clasificar la solicitud según su nivel de riesgo.

El score puede considerar:

* Ingresos mensuales.
* RDS.
* Monto solicitado.
* Plazo del crédito.
* Historial o comportamiento simulado.

En el sistema, el score se muestra principalmente en el Core Bancario, ya que es información de evaluación interna.

---

## Regla 9 — Nivel de aprobación

El nivel de aprobación se asigna según el monto solicitado:

|                   Monto solicitado | Nivel de aprobación |
| ---------------------------------: | ------------------- |
|                    Hasta S/ 30,000 | Asesor              |
|  Más de S/ 30,000 hasta S/ 100,000 | Administrador       |
| Más de S/ 100,000 hasta S/ 300,000 | Jefe Regional       |
|                  Más de S/ 300,000 | Riesgos             |

---

## Regla 10 — Estados del crédito

Los estados principales de una solicitud son:

| Estado         | Descripción                            |
| -------------- | -------------------------------------- |
| `pendiente`    | Solicitud registrada desde Homebanking |
| `aprobado`     | Solicitud aprobada desde Core          |
| `rechazado`    | Solicitud no aprobada                  |
| `desembolsado` | Crédito abonado en cuenta del cliente  |

---

## Regla 11 — Desembolso

Una solicitud solo puede desembolsarse si su estado es:

```txt
aprobado
```

Al desembolsar, el Core debe:

1. Buscar una cuenta activa del cliente.
2. Aumentar el saldo de la cuenta.
3. Registrar una transacción de tipo crédito.
4. Cambiar el estado de la solicitud a `desembolsado`.

---

## Regla 12 — Reflejo en Homebanking

Después del desembolso, el cliente debe poder ver en Homebanking:

* Saldo actualizado.
* Movimiento de desembolso.
* Estado de solicitud actualizado.

Esto evidencia la integración entre el Core Bancario y el Homebanking.
