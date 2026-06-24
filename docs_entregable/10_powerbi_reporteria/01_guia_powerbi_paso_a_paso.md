# Guía Power BI — BBVA Core Financiero
## Instrucciones paso a paso para conectar y crear reportes

---

## ¿Qué vas a construir?

Un reporte Power BI con **3 páginas**:

| Página | Nombre | Contenido |
|---|---|---|
| 1 | **Cartera de Créditos** | Evolución mensual de cartera vigente vs vencida, ratio de mora |
| 2 | **Productividad de Asesores** | Cumplimiento de metas por asesor, semáforo de desempeño |
| 3 | **Solicitudes y Originación** | Embudo de solicitudes, estados, aprobaciones por nivel |

---

## Requisitos previos

- [ ] Power BI Desktop instalado (gratuito en https://powerbi.microsoft.com/desktop)
- [ ] PostgreSQL corriendo localmente (puerto 5432)
- [ ] Base de datos `bd_core_financiero` restaurada con datos
- [ ] Seeds Python ejecutados (especialmente `05_seed_cartera_powerbi.py`)
- [ ] Vistas creadas (`10_powerbi_reporteria/02_vistas_powerbi_bbva.sql` ejecutado en pgAdmin)

---

## PASO 1 — Instalar el conector PostgreSQL para Power BI

Power BI necesita un driver ODBC para conectarse a PostgreSQL.

1. Descargar **Npgsql** desde: https://github.com/npgsql/npgsql/releases
   - Buscar el instalador `.msi` más reciente (ej: `Npgsql-8.x.x.msi`)
2. Instalar con todas las opciones por defecto
3. **Reiniciar Power BI Desktop** después de instalar

> Alternativa: descargar el driver ODBC de PostgreSQL desde https://www.postgresql.org/ftp/odbc/versions/msi/

---

## PASO 2 — Conectar Power BI a PostgreSQL

1. Abrir **Power BI Desktop**
2. Clic en **"Obtener datos"** (barra superior) → **"Más..."**
3. Buscar **"PostgreSQL"** → seleccionar → clic **"Conectar"**
4. Completar los datos de conexión:

```
Servidor:   localhost
Base de datos: bd_core_financiero
```

5. Clic en **"Aceptar"**
6. Cuando pida credenciales:
   - Seleccionar **"Base de datos"**
   - Usuario: `postgres` (o tu usuario de PostgreSQL)
   - Contraseña: tu contraseña de PostgreSQL
7. Clic en **"Conectar"**

---

## PASO 3 — Importar las vistas

En el **Navegador** que aparece, buscar y seleccionar estas vistas (ya están creadas por el script SQL):

- [x] `vw_bbva_cartera`
- [x] `vw_bbva_metas_asesor`
- [x] `vw_bbva_solicitudes`
- [x] `vw_bbva_clientes`
- [x] `vw_bbva_cuentas`

> Usar **"Importar"** (no DirectQuery) para mejor rendimiento en demo.

Clic en **"Cargar"** para importar todas las vistas seleccionadas.

---

## PASO 4 — Configurar el modelo de datos

Ir a la vista **"Modelo"** (ícono de diagrama en la barra izquierda).

### Relaciones a crear

| Tabla origen | Campo | → | Tabla destino | Campo |
|---|---|---|---|---|
| `vw_bbva_solicitudes` | `cliente_id` | → | `vw_bbva_clientes` | `cliente_id` |
| `vw_bbva_cuentas` | `usuario_uuid` | → | `vw_bbva_clientes` | `usuario_uuid` |

Para crear una relación:
1. Arrastrar el campo de una tabla al campo de la otra
2. Verificar cardinalidad: `Muchos a uno (*:1)`
3. Clic en **"Aceptar"**

---

## PASO 5 — Crear las visualizaciones

### 📄 Página 1: Cartera de Créditos

#### Gráfico de líneas — Evolución de cartera (fuente: `vw_bbva_cartera`)
- **Eje X:** `periodomes`
- **Valores:** `SUM(cartera_vigente)` y `SUM(cartera_vencida)`
- **Leyenda:** tipo de línea

> Cómo crear: "Insertar" → "Gráfico de líneas" → arrastrar campos desde el panel derecho

#### Gráfico de barras apiladas — Por agencia
- **Eje Y:** `desagencia`
- **Valores:** `SUM(cartera_total)`
- **Leyenda:** `banda_mora`

#### Tarjetas KPI (Cards)
- **Cartera Total:** `SUM(vw_bbva_cartera[cartera_total])`
- **Ratio de Mora %:** `AVERAGE(vw_bbva_cartera[ratio_mora_porcentaje])`

---

### 📄 Página 2: Productividad de Asesores

#### Gráfico de barras — Cumplimiento por asesor (fuente: `vw_bbva_metas_asesor`)
- **Eje Y:** `asesor`
- **Valores:** `SUM(cumplimiento_porcentaje)`
- **Colores condicionales:**
  - Verde ≥ 90%
  - Amarillo ≥ 70%
  - Rojo < 70%

Para agregar colores condicionales:
1. Seleccionar la visualización
2. Panel "Formato" → "Colores de datos" → "Formato condicional"
3. Reglas basadas en valor de `cumplimiento_porcentaje`

#### Medidor (Gauge) — Meta vs Real
- **Valor:** `SUM(real_colocaciones)`
- **Objetivo:** `SUM(meta_colocaciones)`
- **Mínimo:** 0

#### Segmentador de período
- Campo: `periodomes` (como lista desplegable)
- Permite filtrar todos los gráficos por mes

---

### 📄 Página 3: Solicitudes y Originación

#### Gráfico de anillo — Distribución por estado (fuente: `vw_bbva_solicitudes`)
- **Leyenda:** `estado`
- **Valores:** `COUNT(solicitud_uuid)`

#### Gráfico de barras — Solicitudes por nivel de aprobación
- **Eje X:** `nivel_aprobacion`
- **Valores:** `COUNT(solicitud_uuid)`

#### Tabla detallada
- Columnas: `solicitante`, `monto`, `estado`, `nivel_aprobacion`, `semaforo_rds`, `fecha_solicitud`
- Ordenar por `fecha_solicitud` descendente

---

## PASO 6 — Medidas DAX útiles

En la vista **"Datos"**, crear nuevas medidas (clic derecho en una tabla → "Nueva medida"):

```dax
-- Ratio de mora general
Ratio Mora % = 
DIVIDE(
    SUM(vw_bbva_cartera[cartera_vencida]),
    SUM(vw_bbva_cartera[cartera_total]),
    0
) * 100

-- Monto promedio de solicitudes aprobadas
Monto Promedio Aprobado = 
CALCULATE(
    AVERAGE(vw_bbva_solicitudes[monto]),
    vw_bbva_solicitudes[estado] = "aprobado"
)

-- % Cumplimiento promedio de asesores
Cumplimiento Promedio = 
AVERAGE(vw_bbva_metas_asesor[cumplimiento_porcentaje])

-- Solicitudes pendientes
Solicitudes Pendientes = 
CALCULATE(
    COUNTROWS(vw_bbva_solicitudes),
    vw_bbva_solicitudes[estado] = "pendiente"
)
```

---

## PASO 7 — Aplicar tema BBVA

Para darle el estilo visual del banco:

1. **"Ver"** → **"Temas"** → **"Personalizar tema actual"**
2. Configurar colores:

| Elemento | Color Hex |
|---|---|
| Color 1 (primario) | `#004481` (Azul BBVA oscuro) |
| Color 2 | `#1464A5` (Azul BBVA medio) |
| Color 3 | `#5BC2E7` (Turquesa BBVA) |
| Color 4 | `#48A23F` (Verde éxito) |
| Color 5 | `#F5A623` (Amarillo alerta) |
| Color 6 | `#D0021B` (Rojo peligro) |
| Fondo | `#F5F5F5` |

3. Fuente: **Segoe UI** o **Calibri**

---

## PASO 8 — Publicar (opcional)

Para compartir el reporte:

1. Crear cuenta gratuita en https://app.powerbi.com
2. En Power BI Desktop: **"Inicio"** → **"Publicar"**
3. Seleccionar el workspace destino

> Para la demo del proyecto, no es necesario publicar — basta con el archivo `.pbix` local.

---

## Datos disponibles en la BD para Power BI

| Vista | Filas aprox. | Descripción |
|---|---|---|
| `vw_bbva_cartera` | ~1,000+ | Cartera mensual por agencia y producto (2025) |
| `vw_bbva_metas_asesor` | ~48 | Metas y cumplimiento por asesor por mes |
| `vw_bbva_solicitudes` | Variable | Solicitudes de préstamo con scoring |
| `vw_bbva_clientes` | Variable | Clientes unificados (core + homebanking) |
| `vw_bbva_cuentas` | Variable | Cuentas de ahorro y saldos |

---

## Troubleshooting Power BI

| Error | Solución |
|---|---|
| "No se puede conectar al origen de datos" | Verificar que PostgreSQL esté corriendo. Reiniciar Npgsql. |
| "No se encontró el proveedor" | Reinstalar el driver Npgsql y reiniciar Power BI |
| Las vistas están vacías | Ejecutar `05_seed_cartera_powerbi.py` primero |
| Error de SSL | En la cadena de conexión agregar `?sslmode=disable` |
