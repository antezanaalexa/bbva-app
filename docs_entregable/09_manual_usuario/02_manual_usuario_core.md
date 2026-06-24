# Manual de Usuario — Core Bancario BBVA
## Guía por Rol — Sistema de Créditos y Recuperaciones

---

## Acceso al sistema

**URL:** http://localhost:5174  
**Credenciales:** DNI como usuario y contraseña (para usuarios de prueba)

---

## 👤 ROL: ASESOR DE NEGOCIOS (E01)

El asesor es el primer eslabón del flujo crediticio. Registra solicitudes, gestiona su propia cartera y puede tomar decisiones sobre las solicitudes que él mismo creó.

### ¿Qué puede hacer?

| Módulo | Acción | Detalle |
|---|---|---|
| Pre-solicitud | ✅ Evaluar | Scoring crediticio del cliente antes de registrar |
| Nueva Solicitud | ✅ Crear | Registrar solicitud con datos del cliente |
| **Mis Solicitudes** | ✅ Ver | Solo ve sus propias solicitudes |
| **Mis Solicitudes** | ✅ **Aprobar** | Solo las que él creó y están pendientes |
| **Mis Solicitudes** | ✅ **Rechazar** | Solo las que él creó y están pendientes |
| Cartera | ✅ Ver | Su cartera de créditos activos |
| Recuperaciones | ✅ Gestionar | Seguimiento de mora y compromisos de pago |
| Ahorros | ❌ Sin acceso | Solo roles administrativos |
| Dashboard institucional | ❌ Sin acceso | Solo jefaturas |

### Flujo típico del Asesor

```
1. Dashboard → Ver sus KPIs del día
2. Pre-solicitud → Evaluar capacidad del cliente (scoring)
3. Nueva Solicitud → Registrar si el score es positivo
4. Mis Solicitudes → Revisar el resultado del motor BBVA
   ├── Si nivel = "asesor" y estado = "pendiente" → APROBAR o RECHAZAR
   └── Si nivel superior → Informar al administrador para que decida
5. Cartera → Ver créditos desembolsados en su cartera
6. Recuperaciones → Gestionar clientes con mora
```

### Cómo aprobar/rechazar desde la bandeja

1. Ir a **"Mis Solicitudes"** (menú lateral)
2. La tabla muestra solo TUS solicitudes
3. En la columna **"Acciones"** de la derecha:
   - Botón **verde ✓** → Aprobar
   - Botón **rojo ✗** → Rechazar
4. Solo aparecen los botones si:
   - La solicitud es tuya (tú la creaste)
   - El nivel de aprobación es **"asesor"** (monto bajo)
   - El estado es **"pendiente"**

> **Nota:** Si el nivel de aprobación es "administrador" o superior, el asesor no puede decidir y debe derivar al administrador.

---

## 👤 ROL: ADMINISTRADOR DE AGENCIA (F02)

### ¿Qué puede hacer?

| Módulo | Acción |
|---|---|
| Dashboard | ✅ Institucional (toda la cartera) |
| Bandeja de Solicitudes | ✅ **Todas las solicitudes** |
| Aprobar/Rechazar | ✅ **Todas las solicitudes** (cualquier nivel) |
| Desembolsar | ✅ Ejecutar desembolso a la cuenta del cliente |
| Cartera | ✅ Cartera completa de la agencia |
| Ahorros | ✅ Ver cuentas de ahorro |
| Recuperaciones | ✅ Gestionar mora + derivar a judicial |

### Flujo típico del Administrador

```
1. Dashboard → KPIs de la agencia
2. Bandeja de Solicitudes → Ver todas las pendientes
3. Seleccionar solicitud → "Ver Detalle"
4. Revisar scoring, RDS y semáforo
5. APROBAR → el estado pasa a "aprobado"
6. Desembolsar → ejecutar el desembolso a la cuenta del cliente
7. Ahorros → verificar saldos captados
8. Recuperaciones → gestionar mora y compromisos
```

---

## 👤 ROL: JEFE DE NEGOCIOS REGIONAL (F01)

### ¿Qué puede hacer?

| Módulo | Acción |
|---|---|
| Dashboard | ✅ Institucional completo |
| Bandeja de Solicitudes | ✅ Todas las solicitudes |
| Aprobar/Rechazar | ✅ Todas (incluso nivel jefe_regional) |
| Desembolsar | ❌ Solo asesores/admins |
| Cartera | ✅ Regional completa |
| Ahorros | ❌ Sin acceso directo |

---

## 👤 ROL: JEFE DE RIESGOS (F04)

### ¿Qué puede hacer?

| Módulo | Acción |
|---|---|
| Dashboard | ✅ Con foco en mora |
| Bandeja de Solicitudes | ✅ Todas las solicitudes |
| Opinión de Riesgos | ✅ Emitir opinión técnica |
| Aprobar/Rechazar | ✅ Cuando el nivel lo requiere |
| Recuperaciones | ✅ Análisis de mora avanzado |

---

## 🔄 Flujo de Aprobación por Monto

El motor de scoring BBVA asigna automáticamente el nivel de aprobación según el monto solicitado y el RDS del cliente:

| Monto Solicitado | Nivel de Aprobación | ¿Quién decide? |
|---|---|---|
| Hasta S/ 10,000 | `asesor` | Asesor propietario de la solicitud |
| S/ 10,001 – S/ 50,000 | `administrador` | Administrador de Agencia |
| S/ 50,001 – S/ 200,000 | `jefe_regional` | Jefe de Negocios Regional |
| Más de S/ 200,000 | `gerencia` | Gerencia / Comité |

> Nota: El RDS alto (semáforo rojo) puede escalar el nivel requerido.

---

## 📊 Estados de una Solicitud

```
pendiente ──→ aprobado ──→ desembolsado
    │
    └──→ rechazado
```

| Estado | Color | Descripción |
|---|---|---|
| `pendiente` | 🟡 Amarillo | Registrada, esperando decisión |
| `aprobado` | 🟢 Verde | Aprobada, lista para desembolso |
| `rechazado` | 🔴 Rojo | Rechazada, sin acciones disponibles |
| `desembolsado` | 🔵 Azul | Fondos enviados a la cuenta del cliente |

---

## 🚨 Módulo de Recuperaciones (Mora)

Disponible para: **asesor, administrador, riesgos, gerencia, analista**

### Bandas de mora

| Banda | Días | Acción recomendada |
|---|---|---|
| Preventiva | 1-6 días | Recordatorio automático (SMS) |
| Temprana | 7-30 días | Llamada telefónica |
| Tardía | 31-120 días | Visita al cliente |
| Judicial | 121-180 días | Derivar a cobranza judicial (solo admin/gerencia) |
| Castigo | >180 días | Castigo contable (solo comité/gerencia) |

### Cómo registrar un compromiso de pago

1. Ir a **"Bandeja de Mora"**
2. Filtrar por banda o asesor
3. Seleccionar el crédito
4. Clic en **"Registrar Compromiso"**
5. Ingresar fecha prometida de pago y monto
6. Guardar

---

## 💡 Tips de uso

- Usa el **doble clic** en cualquier fila de la bandeja para ir directo al detalle
- El **semáforo de riesgo** en la bandeja indica la salud crediticia del cliente:
  - 🟢 Verde: RDS < 30% (bajo riesgo)
  - 🟡 Amarillo: RDS 30-50% (riesgo moderado)
  - 🔴 Rojo: RDS > 50% (alto riesgo)
- El botón **"Actualizar"** recarga la bandeja sin recargar la página completa
