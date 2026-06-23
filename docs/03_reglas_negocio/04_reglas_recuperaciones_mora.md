# 04_reglas_recuperaciones_mora.md

# Reglas de Recuperaciones y Mora — BBVA Perú Simulado

## Introducción

El presente documento describe las reglas de negocio aplicadas al módulo de **Recuperaciones y Mora** del sistema integrado **BBVA Perú Simulado**.

Este módulo permite consultar créditos con atraso, clasificarlos por bandas de mora, registrar gestiones de cobranza y ejecutar transiciones operativas como derivación a cobranza judicial o castigo contable.

Las reglas implementadas corresponden a una **simulación académica** alineada a criterios generales del sistema financiero peruano y a la clasificación por días de atraso utilizada como referencia regulatoria. No representan una política interna oficial de BBVA Perú.

---

## 1. Objetivo del módulo

El módulo de Recuperaciones/Mora tiene como objetivo permitir el seguimiento de créditos con atraso y la gestión ordenada de cobranza.

Permite cubrir tres funciones principales:

| Código | Función              | Descripción                                                            |
| ------ | -------------------- | ---------------------------------------------------------------------- |
| R1     | Consulta de mora     | Visualizar créditos clasificados por bandas de atraso.                 |
| R2     | Gestión de cobranza  | Registrar llamadas, mensajes, visitas o compromisos de pago.           |
| R3     | Transición de estado | Derivar créditos a judicial o castigo según días de atraso y permisos. |

---

## 2. Bandas de mora

Para el proyecto se utilizan las siguientes bandas de mora:

| Banda      |  Días de atraso | Descripción                                            |
| ---------- | --------------: | ------------------------------------------------------ |
| Al día     |          0 días | Crédito sin atraso.                                    |
| Preventiva |      1 a 6 días | Atraso inicial. Se recomienda contacto preventivo.     |
| Temprana   |     7 a 30 días | Mora inicial que requiere seguimiento.                 |
| Tardía     |   31 a 120 días | Mora avanzada con mayor riesgo de incumplimiento.      |
| Judicial   |  121 a 180 días | Caso derivable a cobranza judicial.                    |
| Castigo    | Más de 180 días | Crédito candidato a castigo contable en la simulación. |

---

## 3. Regla R1 — Consulta de cartera en mora

El Core Bancario debe permitir consultar la cartera morosa agrupada por bandas.

La consulta debe mostrar como mínimo:

* Cliente.
* Documento de identidad.
* Número de crédito o cuenta.
* Monto vencido.
* Días de atraso.
* Banda de mora.
* Estado actual.
* Última gestión realizada.
* Responsable de gestión.

### Resultado esperado

El usuario del Core debe poder identificar rápidamente qué créditos requieren cobranza preventiva, cobranza temprana, cobranza tardía, derivación judicial o castigo.

---

## 4. Regla R2 — Registro de gestión de cobranza

El sistema debe permitir registrar gestiones de cobranza sobre un crédito o cliente moroso.

Tipos de gestión permitidos:

| Tipo de gestión    | Descripción                                             |
| ------------------ | ------------------------------------------------------- |
| Llamada            | Contacto telefónico con el cliente.                     |
| Mensaje            | Envío de recordatorio o comunicación digital.           |
| Visita             | Contacto presencial o visita de campo.                  |
| Compromiso de pago | Cliente se compromete a pagar en una fecha determinada. |
| Sin contacto       | No se logró ubicar al cliente.                          |

Cada gestión debe registrar:

* Crédito o cliente asociado.
* Usuario responsable.
* Tipo de gestión.
* Comentario.
* Resultado.
* Fecha de gestión.
* Fecha de compromiso de pago, si corresponde.

---

## 5. Regla R3 — Transición a judicial

Un crédito puede ser derivado a cobranza judicial si cumple la siguiente condición:

```txt
días_atraso >= 121
```

Además, debe validarse que:

* El crédito no esté ya en estado judicial.
* El usuario tenga rol autorizado.
* Exista una justificación o comentario de derivación.
* La acción quede registrada en la base de datos.

Roles autorizados:

| Rol                | Puede derivar a judicial |
| ------------------ | ------------------------ |
| Asesor             | No                       |
| Administrador      | Sí                       |
| Jefe Regional      | Sí                       |
| Riesgos            | Sí                       |
| Gestor de Cobranza | No                       |

---

## 6. Regla R4 — Castigo contable

Un crédito puede pasar a castigo contable si cumple la siguiente condición:

```txt
días_atraso > 180
```

Además, debe validarse que:

* El crédito tenga mora severa.
* El crédito no esté previamente castigado.
* El usuario tenga rol autorizado.
* La operación quede registrada con fecha y responsable.

Roles autorizados:

| Rol                | Puede ejecutar castigo |
| ------------------ | ---------------------- |
| Asesor             | No                     |
| Administrador      | No                     |
| Jefe Regional      | No                     |
| Riesgos            | Sí                     |
| Gestor de Cobranza | No                     |

---

## 7. Estados del proceso de recuperación

Los estados principales del proceso de recuperación son:

| Estado             | Descripción                                          |
| ------------------ | ---------------------------------------------------- |
| Al día             | Crédito sin atraso.                                  |
| En mora preventiva | Atraso menor, seguimiento preventivo.                |
| En mora temprana   | Atraso inicial que requiere contacto con el cliente. |
| En mora tardía     | Atraso importante que requiere acciones intensivas.  |
| Judicial           | Crédito derivado a cobranza judicial.                |
| Castigado          | Crédito castigado contablemente en la simulación.    |
| Regularizado       | Cliente pagó o regularizó la deuda.                  |

---

## 8. Flujo de recuperación

El flujo del módulo puede resumirse así:

```txt
Crédito al día
      ↓
Atraso inicial
      ↓
Mora preventiva
      ↓
Mora temprana
      ↓
Mora tardía
      ↓
Judicial, si atraso >= 121 días
      ↓
Castigo, si atraso > 180 días
```

El crédito puede volver a estado regularizado si el cliente realiza el pago correspondiente o si se registra una refinanciación.

---

## 9. Validaciones obligatorias

Antes de registrar una gestión o transición de mora, el sistema debe validar:

* Que el crédito exista.
* Que el cliente exista.
* Que el usuario tenga permiso.
* Que los días de atraso correspondan a la acción.
* Que el estado actual permita la transición.
* Que la operación quede registrada.

---

## 10. Evidencias esperadas

Para demostrar el funcionamiento del módulo de mora, se deben presentar:

| Evidencia           | Descripción                                                         |
| ------------------- | ------------------------------------------------------------------- |
| Captura R1          | Bandeja de cartera morosa con bandas.                               |
| Captura R2          | Registro de una gestión de cobranza.                                |
| Captura R3          | Derivación de un crédito a judicial.                                |
| Captura R4          | Castigo contable de un crédito con más de 180 días.                 |
| Consulta SQL        | Registros de mora y gestiones en base de datos.                     |
| Diagrama de estados | Flujo Al día → Preventiva → Temprana → Tardía → Judicial → Castigo. |

---

## 11. Relación con la rúbrica

Este módulo responde al criterio de **Recuperaciones / Mora**, que evalúa:

* Consulta por bandas de mora.
* Registro e historial de gestiones.
* Transición a judicial.
* Castigo contable.
* Validación de umbrales y permisos.

---

## 12. Aclaración académica

Las reglas de mora del presente proyecto se utilizan con fines académicos. Están inspiradas en criterios generales del sistema financiero peruano y en la clasificación por días de atraso usada como referencia en la normativa SBS. No deben interpretarse como políticas internas oficiales de BBVA Perú.
