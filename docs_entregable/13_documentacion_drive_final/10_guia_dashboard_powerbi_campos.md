# 📊 Guía de Construcción de Dashboards en Power BI Desktop

Esta guía técnica describe de forma detallada paso a paso cómo estructurar, relacionar y diseñar los reportes de **Power BI** para la sustentación del proyecto **BBVA Perú Simulado**.

---

## 🔌 1. Conexión de Datos a PostgreSQL

1. Abre **Power BI Desktop**.
2. Clic en **Obtener datos (Get Data)** ➔ **Base de datos de PostgreSQL**.
3. En la ventana de configuración:
   * **Servidor (Server):** `localhost:5432`
   * **Base de datos (Database):** `bd_core_financiero`
   * **Modo de conectividad:** Selecciona **Importar (Import)** para almacenar los datos en caché, o **DirectQuery** para consultas en tiempo real.
4. Digita tus credenciales de base de datos (Usuario: `postgres` / Contraseña: `12345678`).
5. En el navegador, selecciona las siguientes tablas/vistas del esquema `public` y haz clic en **Cargar (Load)**:
   * `solicitudes_prestamo` (datos de créditos y scores)
   * `cuentas` (cuentas de clientes)
   * `transacciones` (movimientos de saldo)
   * `dcliente` (dimensión clientes)
   * `dpersonal` (dimensión asesores/personal)
   * `fmetasasesor` (metas de colocación)

---

## 🔗 2. Relaciones del Modelo de Datos (Vista de Modelo)

Una vez cargadas las tablas, ve a la pestaña **Vista de Modelo** en Power BI y establece las siguientes relaciones (arrastrando los campos indicados):

1. **`dcliente` ➔ `solicitudes_prestamo`**
   * Relación: `dcliente.pkcliente` (1) a `solicitudes_prestamo.pkcliente` (Many) o usando `dcliente.numerodocumentoidentidad` a `solicitudes_prestamo.user_id` (a través de la tabla `app_usuarios` si existe relación directa de IDs).
2. **`dpersonal` (Asesores) ➔ `solicitudes_prestamo`**
   * Relación: `dpersonal.pkpersonal` (1) a `solicitudes_prestamo.pkpersonal` (Many) (si aplica en tu base de datos) o a través de la asignación del cliente.
3. **`cuentas` ➔ `transacciones`**
   * Relación: `cuentas.id` (1) a `transacciones.cuenta_origen_id` (Many).
4. **`dpersonal` (Asesores) ➔ `fmetasasesor`**
   * Relación: `dpersonal.pkpersonal` (1) a `fmetasasesor.pkasesor` (Many).

---

## 🧮 3. Creación de Medidas DAX Recomendadas

Para enriquecer el dashboard con KPIs gerenciales, haz clic derecho sobre la tabla `solicitudes_prestamo` ➔ **Nueva Medida (New Measure)** y escribe las siguientes fórmulas en lenguaje DAX:

### A. Total Colocado (Desembolsos)
```dax
Total_Desembolsado = CALCULATE(SUM(solicitudes_prestamo[monto]), solicitudes_prestamo[estado] = "desembolsado")
```

### B. Cantidad de Solicitudes Pendientes
```dax
Solicitudes_Pendientes = CALCULATE(COUNT(solicitudes_prestamo[id]), solicitudes_prestamo[estado] = "pendiente")
```

### C. Calificación Promedio de Scoring
```dax
Score_Promedio = AVERAGE(solicitudes_prestamo[score])
```

### D. Cumplimiento de Metas por Asesor
```dax
Cumplimiento_Meta_Porcentaje = DIVIDE([Total_Desembolsado], SUM(fmetasasesor[meta_monto]), 0)
```

---

## 🎨 4. Diseño de los 4 Paneles en Power BI

### Panel 1: Solicitudes y Embudo (Originación)
* **Visual 1 (Tarjeta):** `Solicitudes_Pendientes` (Muestra la cantidad actual por procesar).
* **Visual 2 (Gráfico de Embudo):** Eje ➔ `estado`, Valores ➔ Recuento de `id` de solicitudes. (Muestra la conversión de pendientes a aprobadas y desembolsadas).
* **Visual 3 (Gráfico de Anillo):** Eje ➔ `proposito`, Valores ➔ Suma de `monto`. (Muestra para qué se solicita más dinero: consumo, estudios, consolidación).

### Panel 2: Desembolsos y Plazos
* **Visual 1 (Tarjeta):** `Total_Desembolsado` (Muestra el capital total en soles colocado en el mercado).
* **Visual 2 (Gráfico de Columnas Clúster):** Eje X ➔ `plazo_meses`, Eje Y ➔ Suma de `monto`. (Permite ver si los clientes prefieren plazos cortos de 12 meses o largos de 36/48 meses).
* **Visual 3 (Tabla):** Columnas ➔ `nombres` (del cliente), `monto`, `tasa_anual`, `cuota_mensual`.

### Panel 3: Cartera Morosa (Recuperaciones)
* **Visual 1 (KPI / Tarjeta de datos):** Tasa de Mora. (Medida: `Monto_en_Mora / Total_Desembolsado`).
* **Visual 2 (Gráfico de Barras Horizontales):** Eje ➔ `banda_mora` (Preventiva, Temprana, Tardía, Judicial), Valores ➔ Suma de saldo moroso.
* **Visual 3 (Matriz):** Filas ➔ `nombre_asesor`, Columnas ➔ `estado_mora`, Valores ➔ Suma de saldo pendiente.

### Panel 4: Productividad y Metas
* **Visual 1 (Velocímetro / Gauge):** Valor ➔ `Total_Desembolsado`, Valor de destino ➔ Suma de `meta_monto`. (Muestra visualmente qué tan cerca está la agencia de cumplir la meta mensual).
* **Visual 2 (Gráfico de Barras Agrupadas):** Eje Y ➔ `nombre_asesor`, Eje X ➔ Suma de `monto` colocado (filtrado por desembolsado).

---

## 📐 5. Filtros Recomendados (Segmentadores de datos)
Agrega controles de filtrado visual (Slicers) en las partes superiores de los reportes:
* **Filtro 1:** Por **Moneda** (`PEN` / `USD`).
* **Filtro 2:** Por **Agencia** (si tienes varias agencias registradas).
* **Filtro 3:** Rango de Fechas de registro (`created_at`).
