# Modelo de Datos Power BI — BBVA Core Financiero

## Arquitectura: Modelo Estrella

El modelo de datos para Power BI sigue un **esquema estrella** con las siguientes capas:

```
                    ┌─────────────────────┐
                    │  vw_bbva_clientes   │  ← DIMENSIÓN
                    │  (dim_cliente)      │
                    └──────────┬──────────┘
                               │
           ┌───────────────────┼───────────────────┐
           │                   │                   │
┌──────────▼──────────┐ ┌──────▼───────┐ ┌────────▼────────┐
│  vw_bbva_solicitudes│ │vw_bbva_cuentas│ │ vw_bbva_cartera │
│  (hechos originación)│ │(hechos ahorro)│ │(hechos cartera) │
└─────────────────────┘ └──────────────┘ └─────────────────┘
                                                   │
                                          ┌────────▼────────┐
                                          │vw_bbva_metas    │
                                          │_asesor          │
                                          │(hechos metas)   │
                                          └─────────────────┘
```

---

## Descripción de cada vista

### `vw_bbva_clientes` (Dimensión central)

| Campo | Tipo | Descripción |
|---|---|---|
| `usuario_uuid` | UUID | ID único del usuario (PK para relaciones) |
| `cliente_id` | INT | ID en el core financiero |
| `codigo_cliente` | VARCHAR | Código de cliente BBVA |
| `dni` | VARCHAR | Documento de identidad |
| `nombres` | VARCHAR | Nombres del cliente |
| `apellidos` | VARCHAR | Apellidos |
| `correo` | VARCHAR | Email |
| `estado` | VARCHAR | activo / inactivo |
| `fecha_registro` | TIMESTAMP | Fecha de alta |

---

### `vw_bbva_solicitudes` (Hechos — Originación)

| Campo | Tipo | Descripción |
|---|---|---|
| `solicitud_uuid` | UUID | ID de la solicitud (PK) |
| `solicitante` | VARCHAR | Nombre completo del cliente |
| `monto` | DECIMAL | Monto solicitado en PEN |
| `plazo_meses` | INT | Plazo en meses |
| `tasa_anual` | DECIMAL | TEA sugerida por el motor |
| `cuota_mensual` | DECIMAL | Cuota calculada |
| `ingresos_mensuales` | DECIMAL | Ingresos declarados |
| `ratio_deuda_ingreso` | DECIMAL | RDS: cuota/ingreso × 100 |
| `semaforo_rds` | VARCHAR | verde / amarillo / rojo |
| `nivel_aprobacion` | VARCHAR | asesor / administrador / jefe_regional |
| `estado` | VARCHAR | pendiente / aprobado / rechazado / desembolsado |
| `fecha_solicitud` | TIMESTAMP | Fecha de registro |

**Útil para:** Embudo de originación, estados, aprobaciones por nivel.

---

### `vw_bbva_cartera` (Hechos — Cartera Histórica)

| Campo | Tipo | Descripción |
|---|---|---|
| `periodomes` | INT | Período YYYYMM (ej: 202506) |
| `codagencia` | VARCHAR | Código de agencia |
| `desagencia` | VARCHAR | Nombre de la agencia |
| `producto` | VARCHAR | Tipo de crédito (consumo / empresarial) |
| `cartera_total` | DECIMAL | Saldo de capital total |
| `cartera_vigente` | DECIMAL | Cartera al día |
| `cartera_vencida` | DECIMAL | Cartera en mora |
| `dias_atraso` | INT | Días de atraso del crédito |
| `ratio_mora_porcentaje` | DECIMAL | % mora calculado |
| `banda_mora` | VARCHAR | Clasificación: Preventiva / Temprana / Tardía / Judicial / Castigo |

**Útil para:** Gráficos de tendencia de mora, análisis por agencia.

---

### `vw_bbva_metas_asesor` (Hechos — Productividad)

| Campo | Tipo | Descripción |
|---|---|---|
| `periodomes` | INT | Período YYYYMM |
| `asesor` | VARCHAR | Nombre del asesor |
| `meta_colocaciones` | DECIMAL | Meta de saldo en PEN |
| `real_colocaciones` | DECIMAL | Saldo real colocado |
| `cumplimiento_porcentaje` | DECIMAL | % de cumplimiento |
| `mora_real` | DECIMAL | Cartera atrasada real |
| `ratio_mora_asesor` | DECIMAL | % mora del asesor |

**Útil para:** Ranking de asesores, semáforos de desempeño.

---

### `vw_bbva_cuentas` (Hechos — Ahorros)

| Campo | Tipo | Descripción |
|---|---|---|
| `cuenta_uuid` | UUID | ID de la cuenta |
| `cliente_nombre` | VARCHAR | Nombre del titular |
| `tipo_cuenta` | VARCHAR | ahorros / corriente / plazo_fijo |
| `numero_cuenta` | VARCHAR | Número de cuenta |
| `moneda` | VARCHAR | PEN / USD |
| `saldo` | DECIMAL | Saldo actual |
| `estado` | VARCHAR | activa / inactiva / bloqueada |
| `fecha_apertura` | TIMESTAMP | Fecha de apertura |

---

## Semáforo de Mora — Lógica de bandas

| Banda | Días de atraso | Color recomendado |
|---|---|---|
| Al día (0) | 0 días | 🟢 Verde `#16a34a` |
| Preventiva (1-6) | 1 a 6 días | 🟡 Amarillo claro `#facc15` |
| Temprana (7-30) | 7 a 30 días | 🟡 Amarillo `#eab308` |
| Tardía (31-120) | 31 a 120 días | 🟠 Naranja `#ea580c` |
| Judicial (121-180) | 121 a 180 días | 🔴 Rojo `#dc2626` |
| Castigo (>180) | Más de 180 días | ⚫ Negro `#334155` |

---

## Métricas clave del negocio

| KPI | Fórmula | Fuente |
|---|---|---|
| **Cartera Total** | SUM(cartera_total) | vw_bbva_cartera |
| **Ratio de Mora** | SUM(vencida) / SUM(total) × 100 | vw_bbva_cartera |
| **Cumplimiento de Meta** | SUM(real) / SUM(meta) × 100 | vw_bbva_metas_asesor |
| **Tasa de Aprobación** | COUNT(aprobado) / COUNT(*) × 100 | vw_bbva_solicitudes |
| **Monto Promedio Solicitado** | AVG(monto) | vw_bbva_solicitudes |
| **Saldo Total en Ahorros** | SUM(saldo) | vw_bbva_cuentas |
