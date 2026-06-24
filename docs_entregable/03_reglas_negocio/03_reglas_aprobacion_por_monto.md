# 03_reglas_aprobacion_desembolso.md

# Reglas de Aprobación y Desembolso — BBVA Perú Simulado

> [!IMPORTANT]
> **Aclaración obligatoria:** Estas reglas son una simulación académica basada en información pública de BBVA Perú y criterios SBS. No representan políticas internas oficiales de BBVA Perú.

## Introducción

El presente documento define las reglas aplicadas en el Core Bancario para aprobar, rechazar y desembolsar solicitudes de préstamo generadas desde Homebanking.

El objetivo es demostrar que el Homebanking y el Core Bancario no funcionan como sistemas aislados, sino como componentes integrados de un mismo flujo financiero.

---

## 1. Flujo general

El flujo de crédito se compone de las siguientes etapas:

```txt
Solicitud en Homebanking
        ↓
Registro en solicitudes_prestamo
        ↓
Revisión en Core Bancario
        ↓
Aprobación o rechazo
        ↓
Desembolso, si fue aprobada
        ↓
Actualización de saldo y movimientos
        ↓
Visualización en Homebanking
```

---

## 2. Estados de la solicitud

| Estado         | Descripción                                           |
| -------------- | ----------------------------------------------------- |
| `pendiente`    | Solicitud registrada por el cliente desde Homebanking |
| `aprobado`     | Solicitud aprobada por usuario autorizado del Core    |
| `rechazado`    | Solicitud no aprobada                                 |
| `desembolsado` | Solicitud aprobada y abonada en la cuenta del cliente |

---

## 3. Reglas de aprobación por monto

|                   Monto solicitado | Nivel de aprobación | Rol responsable |
| ---------------------------------: | ------------------- | --------------- |
|                    Hasta S/ 30,000 | Asesor              | Asesor          |
|  Más de S/ 30,000 hasta S/ 100,000 | Administrador       | Administrador   |
| Más de S/ 100,000 hasta S/ 300,000 | Jefe Regional       | Jefe Regional   |
|                  Más de S/ 300,000 | Riesgos             | Riesgos         |

---

## 4. Reglas por rol

### Cliente

El cliente puede:

* Solicitar un préstamo.
* Consultar su estado.
* Ver el desembolso si fue aprobado.

El cliente no puede:

* Aprobar.
* Rechazar.
* Desembolsar.
* Ver información interna de riesgo.

### Asesor

El asesor puede:

* Ver solicitudes.
* Revisar RDS, score y semáforo.
* Aprobar solicitudes de nivel asesor.
* Rechazar solicitudes.
* Registrar gestión inicial.

### Administrador

El administrador puede:

* Revisar solicitudes de mayor monto.
* Aprobar solicitudes de nivel administrador.
* Rechazar solicitudes.
* Ejecutar desembolsos si la solicitud está aprobada.
* Derivar casos según corresponda.

### Jefe Regional

El jefe regional puede:

* Revisar solicitudes de mayor nivel.
* Aprobar solicitudes asignadas a su nivel.
* Rechazar solicitudes.
* Ejecutar desembolsos autorizados.

### Riesgos

El rol de riesgos puede:

* Revisar solicitudes de mayor exposición.
* Revisar solicitudes con alto riesgo.
* Aprobar solicitudes de nivel riesgos.
* Rechazar solicitudes.
* Autorizar acciones críticas.

---

## 5. Regla de aprobación

Una solicitud puede aprobarse si:

* Existe en la tabla `solicitudes_prestamo`.
* Está en estado `pendiente`.
* El usuario interno tiene rol autorizado.
* La solicitud cumple con las reglas mínimas de evaluación.
* El nivel de aprobación corresponde al rol del usuario.

Cuando se aprueba, el sistema actualiza:

```sql
UPDATE solicitudes_prestamo
SET estado = 'aprobado'
WHERE id = :id;
```

---

## 6. Regla de rechazo

Una solicitud puede rechazarse si:

* Existe en la tabla `solicitudes_prestamo`.
* Fue revisada por un usuario interno autorizado.
* Presenta riesgo alto, falta de capacidad de pago o no cumple las reglas de negocio.

Cuando se rechaza, el sistema actualiza:

```sql
UPDATE solicitudes_prestamo
SET estado = 'rechazado'
WHERE id = :id;
```

---

## 7. Regla de desembolso

Una solicitud solo puede desembolsarse si se encuentra en estado:

```txt
aprobado
```

No se debe permitir desembolso de solicitudes:

* Pendientes.
* Rechazadas.
* Ya desembolsadas.

---

## 8. Proceso de desembolso

Al ejecutar el desembolso, el Core Bancario debe realizar tres operaciones principales:

### 1. Actualizar saldo de cuenta

```sql
UPDATE cuentas
SET saldo = saldo + monto
WHERE user_id = :user_id
AND estado = 'activa';
```

### 2. Registrar movimiento

```sql
INSERT INTO transacciones (
    user_id,
    cuenta_id,
    tipo,
    descripcion,
    monto,
    fecha
)
VALUES (
    :user_id,
    :cuenta_id,
    'credito',
    'Desembolso de préstamo BBVA',
    :monto,
    NOW()
);
```

### 3. Cambiar estado de solicitud

```sql
UPDATE solicitudes_prestamo
SET estado = 'desembolsado'
WHERE id = :id;
```

---

## 9. Validaciones del desembolso

Antes de desembolsar, el sistema debe validar:

* La solicitud existe.
* La solicitud está aprobada.
* El cliente tiene una cuenta activa.
* El monto es mayor a cero.
* El usuario tiene permiso para ejecutar la acción.

---

## 10. Resultado esperado

Después del desembolso:

| Elemento                      | Resultado                             |
| ----------------------------- | ------------------------------------- |
| `solicitudes_prestamo.estado` | `desembolsado`                        |
| `cuentas.saldo`               | Aumenta por el monto desembolsado     |
| `transacciones`               | Registra movimiento de tipo `credito` |
| Homebanking                   | Muestra saldo actualizado             |
| Core Bancario                 | Muestra solicitud desembolsada        |

---

## 11. Evidencia del flujo

Para demostrar el flujo, se deben presentar:

* Captura de solicitud creada desde Homebanking.
* Captura de solicitud en Core Bancario.
* Captura de aprobación.
* Captura de desembolso.
* Captura de saldo actualizado en Homebanking.
* Consulta SQL de `solicitudes_prestamo`.
* Consulta SQL de `cuentas`.
* Consulta SQL de `transacciones`.
