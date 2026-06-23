# 02_reglas_rds_score_semaforo.md

# Reglas de RDS, Score y Semáforo — BBVA Perú Simulado

## Introducción

Este documento describe las reglas utilizadas para evaluar preliminarmente una solicitud de préstamo en el sistema **BBVA Perú Simulado**. La evaluación se basa en tres elementos principales:

* RDS.
* Score.
* Semáforo de riesgo.

Estos indicadores se calculan al momento de registrar la solicitud y son utilizados por el Core Bancario para apoyar la decisión de aprobación, rechazo o derivación.

---

## 1. RDS — Ratio Deuda sobre Ingreso

El RDS mide qué porcentaje de los ingresos mensuales del cliente sería utilizado para pagar la cuota mensual del crédito solicitado.

### Fórmula

```txt
RDS = (cuota_mensual / ingresos_mensuales) * 100
```

### Ejemplo

```txt
Monto solicitado: S/ 10,000
Plazo: 24 meses
Cuota mensual: S/ 501.66
Ingresos mensuales: S/ 3,000

RDS = (501.66 / 3000) * 100
RDS = 16.72%
```

Interpretación:

```txt
El cliente destinaría aproximadamente el 16.72% de sus ingresos mensuales al pago del crédito.
```

---

## 2. Reglas del RDS

|          Rango de RDS | Clasificación | Resultado                     |
| --------------------: | ------------- | ----------------------------- |
|              0% a 35% | Bajo riesgo   | Viable                        |
| Mayor a 35% hasta 50% | Riesgo medio  | Requiere evaluación adicional |
|           Mayor a 50% | Alto riesgo   | No recomendable o rechazable  |

---

## 3. Semáforo de riesgo

El semáforo permite visualizar rápidamente la situación de la solicitud.

| Semáforo | Condición          | Interpretación                                           |
| -------- | ------------------ | -------------------------------------------------------- |
| Verde    | RDS <= 35%         | La cuota es razonable respecto al ingreso                |
| Amarillo | RDS > 35% y <= 50% | La cuota compromete una parte importante del ingreso     |
| Rojo     | RDS > 50%          | La cuota representa un riesgo alto de sobreendeudamiento |

---

## 4. Score preliminar

El score es un puntaje de referencia utilizado para apoyar la evaluación crediticia. En el proyecto, se emplea como indicador interno del Core Bancario.

### Criterios considerados

| Criterio         | Descripción                                   |
| ---------------- | --------------------------------------------- |
| Ingresos         | Valida si el cliente supera el ingreso mínimo |
| RDS              | Evalúa la capacidad de pago                   |
| Monto solicitado | Clasifica el nivel de exposición del banco    |
| Plazo            | Permite estimar el comportamiento del crédito |
| Riesgo simulado  | Apoya la decisión del usuario interno         |

---

## 5. Reglas de score referenciales

| Condición                                            | Puntaje sugerido |
| ---------------------------------------------------- | ---------------: |
| Ingresos mayores o iguales a S/ 700                  |              +30 |
| RDS menor o igual a 35%                              |              +40 |
| RDS mayor a 35% y menor o igual a 50%                |              +20 |
| Monto menor o igual a S/ 30,000                      |              +20 |
| Monto mayor a S/ 30,000 y menor o igual a S/ 100,000 |              +10 |
| Información completa de la solicitud                 |              +10 |

---

## 6. Interpretación del score

|      Score | Interpretación      |
| ---------: | ------------------- |
|   80 a 100 | Solicitud viable    |
|    50 a 79 | Solicitud observada |
| Menor a 50 | Solicitud riesgosa  |

---

## 7. Uso en Homebanking

En Homebanking, el cliente no visualiza el detalle interno de evaluación. El cliente solo observa información general:

* Monto solicitado.
* Plazo.
* Cuota mensual estimada.
* Estado de la solicitud.

Esto evita mostrar información interna como score, RDS o nivel de aprobación.

---

## 8. Uso en Core Bancario

En el Core Bancario, el usuario interno sí puede visualizar:

* RDS.
* Score.
* Semáforo.
* Nivel de aprobación.
* Estado.
* Ingresos mensuales.
* Cuota mensual.

Estos datos permiten tomar una decisión más informada al aprobar, rechazar o desembolsar la solicitud.

---

## 9. Ejemplo completo

| Campo               |     Valor |
| ------------------- | --------: |
| Monto               | S/ 10,000 |
| Plazo               |  24 meses |
| Tasa anual          |     18.5% |
| Cuota mensual       | S/ 501.66 |
| Ingresos mensuales  |  S/ 3,000 |
| RDS                 |    16.72% |
| Semáforo            |     Verde |
| Score               |       100 |
| Nivel de aprobación |    Asesor |
| Estado inicial      | Pendiente |

Conclusión:

```txt
La solicitud es viable porque el RDS es menor a 35%, el semáforo es verde y el monto corresponde al nivel de aprobación de asesor.
```
