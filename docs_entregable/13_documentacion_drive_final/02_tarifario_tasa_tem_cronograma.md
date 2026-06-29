# 📊 Tarifario, Tasa, Conversión a TEM y Generación de Cronogramas de Pago

Este documento detalla el cumplimiento de la **sección 1** de las exigencias del docente, detallando la tasa utilizada, las fórmulas de conversión financiera y la ubicación en el código fuente.

---

## 💵 1. Producto y Tarifario
* **Producto Financiero Simulado:** Préstamo de Consumo / Préstamo Personal de Libre Disponibilidad.
* **Tasa Nominal Anual / Tasa Efectiva Anual (TEA) de Referencia:** **41.20%**
  *(Esta tasa ha sido tomada del tarifario público referencial de créditos de consumo de libre disponibilidad del BBVA Perú).*

---

## 🧮 2. Glosario y Fórmulas Financieras

### Tasa Efectiva Anual (TEA)
La TEA mide el costo financiero efectivo de un crédito en un periodo de un año. Es la tasa estándar de comercialización y comparación en el sistema financiero peruano.

### Tasa Efectiva Mensual (TEM)
Dado que los pagos de las cuotas son de carácter mensual, la TEA debe convertirse a una tasa mensual equivalente (TEM). No se puede dividir entre 12 de forma directa (eso sería una tasa nominal); se debe aplicar la fórmula de capitalización compuesta exponencial para mantener el rendimiento real:

$$\text{TEM} = (1 + \text{TEA})^{\frac{1}{12}} - 1$$

Reemplazando la TEA de 41.20% (0.4120):

$$\text{TEM} = (1 + 0.4120)^{\frac{1}{12}} - 1 \approx 0.029272 \text{ (o } 2.927\% \text{ mensual)}$$

### Sistema de Amortización Francés (Cuota Fija)
El cronograma de pagos del proyecto se calcula bajo el **sistema francés**, donde el monto total de la cuota mensual es constante (fijo) a lo largo de todo el préstamo, variando internamente la proporción de amortización del capital y el interés pagado en cada cuota:

$$\text{Cuota} = \text{Monto} \times \frac{\text{TEM} \times (1 + \text{TEM})^N}{(1 + \text{TEM})^N - 1}$$

Donde:
* **Monto:** Saldo de capital solicitado.
* **TEM:** Tasa Efectiva Mensual (calculada anteriormente).
* **N:** Número total de cuotas (plazo en meses).

---

## 📝 3. Ejemplo Corto de Cálculo
* **Capital solicitado:** S/ 10,000.00
* **Plazo (N):** 12 meses
* **TEA:** 41.20% ➔ **TEM:** 2.927209% (0.02927209)

Aplicando la fórmula de la cuota fija:

$$\text{Cuota} = 10,000 \times \frac{0.02927209 \times (1.02927209)^{12}}{(1.02927209)^{12} - 1}$$
$$\text{Cuota} = 10,000 \times \frac{0.02927209 \times 1.4120}{1.4120 - 1}$$
$$\text{Cuota} = 10,000 \times \frac{0.041332}{0.4120} \approx \text{S/ 1,003.21 mensual}$$

**Estructura interna de la cuota 1:**
* **Interés de la cuota 1:** $10,000 \times 2.927209\% = \text{S/ 292.72}$
* **Amortización de capital 1:** $\text{Cuota} - \text{Interés} = 1,003.21 - 292.72 = \text{S/ 710.49}$
* **Saldo restante de capital:** $10,000 - 710.49 = \text{S/ 9,289.51}$

*(Este cálculo recursivo se ejecuta mes a mes hasta amortizar el capital a cero en la cuota 12).*

---

## 💻 4. Centralización en el Código Fuente

Para evitar que el cliente altere los cálculos desde el navegador, la tasa y la fórmula están centralizadas e implementadas estrictamente en el Backend.

* **Fórmula de Conversión y Cuota en el Backend de Créditos:**
  * **Archivo:** [credito_service.py](file:///c:/Proyectos/BBVA/bbva-backend/services/credito_service.py) (Homebanking)
  * **Ubicación:** Método `simular_credito(self, monto, plazo, ingresos)` donde se aplica:
    ```python
    tea = 0.4120  # TEA fija del tarifario (41.20%)
    tem = (1 + tea) ** (1/12) - 1
    cuota = (monto * tem * ((1 + tem) ** plazo)) / (((1 + tem) ** plazo) - 1)
    ```
  * El **Core Bancario** valida esta misma cuota al recibir la solicitud en [ctl_creditos.py](file:///c:/Proyectos/BBVA/core-backend/app/controllers/ctl_creditos.py) (o equivalente de evaluación del core) para comprobar que el cronograma recibido coincide al céntimo antes de aprobar el crédito.

---

## 📢 Diapositiva de Exposición Sugerida

> **"La tasa del tarifario oficial del BBVA (TEA 41.20%) se centralizó en el backend y se convirtió algorítmicamente a TEM para generar y validar el cronograma de pagos bajo el sistema de amortización francés, evitando manipulaciones en el frontend del cliente."**
