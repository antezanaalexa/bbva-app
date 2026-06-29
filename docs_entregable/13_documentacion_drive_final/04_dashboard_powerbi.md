# 📊 Estructura de Reportes y Dashboards de Power BI

Este documento detalla la estructura y objetivos de los dashboards que se presentarán para cumplir con la **sección 3** de las exigencias del docente, destinados al monitoreo gerencial del sistema.

---

## 📈 1. Dashboards Mínimos a Presentar

El sistema de reportería se conecta directamente a la base de datos PostgreSQL (`bd_core_financiero`) mediante la importación de las vistas del esquema público. Se estructurarán 4 paneles clave:

### A. Dashboard de Solicitudes de Crédito
* **Objetivo:** Monitorear el embudo de captación de préstamos que ingresan desde el Homebanking.
* **Indicadores Clave (KPIs):**
  * Total de solicitudes registradas.
  * Solicitudes por estado (`pendiente`, `aprobado`, `rechazado`, `desembolsado`).
  * Monto total solicitado (Soles vs Dólares).
* **Gráficos recomendados:**
  * Gráfico de embudo o barras horizontales para solicitudes por estado.
  * Gráfico de anillo para montos solicitados por propósito de préstamo (Consumo, Vehicular, Estudios, etc.).
* **Marcador:** `[INSERTAR CAPTURA DASHBOARD DE SOLICITUDES]`

### B. Dashboard de Desembolsos
* **Objetivo:** Ver el capital colocado en cuentas de clientes activos.
* **Indicadores Clave (KPIs):**
  * Capital total efectivamente desembolsado.
  * Número de clientes con préstamos activos.
  * Distribución de préstamos por plazo (meses).
* **Gráficos recomendados:**
  * Tarjeta visual con la suma de capital desembolsado.
  * Histograma de frecuencia por rangos de plazo (ej. 12, 24, 36 meses).
* **Marcador:** `[INSERTAR CAPTURA DASHBOARD DE DESEMBOLSOS]`

### C. Dashboard de Cartera y Mora (Recuperaciones)
* **Objetivo:** Analizar la salud crediticia y el estado de la morosidad de la agencia.
* **Indicadores Clave (KPIs):**
  * Índice de morosidad (Monto en Mora / Cartera Total).
  * Distribución por bandas de atraso (Preventiva, Temprana, Tardía, Judicial, Castigo).
  * Compromisos de pago recuperados.
* **Gráficos recomendados:**
  * Gráfico de columnas apiladas por bandas de mora y días de atraso.
  * Gráfico de líneas temporal con la evolución mensual del índice de mora.
* **Marcador:** `[INSERTAR CAPTURA DASHBOARD DE CARTERA Y MORA]`

### D. Dashboard de Productividad de Asesores (Metas)
* **Objetivo:** Evaluar el cumplimiento de las metas de colocación del personal del Core.
* **Indicadores Clave (KPIs):**
  * Porcentaje de cumplimiento de metas por asesor.
  * Monto colocado por asesor.
  * Cantidad de solicitudes procesadas (aprobadas/rechazadas) por cada colaborador.
* **Gráficos recomendados:**
  * Gráfico de velocímetro (Gauge) para porcentaje de cumplimiento individual.
  * Gráfico de barras agrupadas comparando meta de colocación vs colocación real de cada asesor.
* **Marcador:** `[INSERTAR CAPTURA DASHBOARD DE PRODUCTIVIDAD]`

---

## 🔗 2. Tablas y Relaciones de la Capa de Reportería

Para conectar Power BI a la base de datos se consumen las siguientes tablas y vistas:
* **`dsolicitud` / `solicitudes_prestamo`:** Almacena los montos, tasas, cuotas, scores y estados.
* **`dcuenta` / `cuentas`:** Cuentas de ahorros que captan saldos y reciben los desembolsos.
* **`dmovimiento` / `transacciones`:** Historial de transferencias e ingresos.
* **`fagcuentacredito`:** Tabla de hechos para saldos de cartera histórica.
* **`fmetasasesor`:** Tabla de metas de colocación por asesor de negocios.

*(Para ver la guía técnica de campos y fórmulas DAX exactas, abre el archivo [10_guia_dashboard_powerbi_campos.md](file:///c:/Proyectos/BBVA/docs_entregable/13_documentacion_drive_final/10_guia_dashboard_powerbi_campos.md)).*
