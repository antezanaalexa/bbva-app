# 📝 Requisitos del Crédito y Proformas Referenciales

Este documento detalla el cumplimiento de la **sección 2** de las exigencias del docente, especificando los requisitos referenciales tomados de proformas y folletos públicos de la institución financiera para sustentar la viabilidad del otorgamiento.

---

## 🗂️ 1. Requisitos para Acceder al Préstamo de Consumo BBVA

Para simular de manera real el análisis crediticio, el sistema evalúa y solicita los siguientes requisitos referenciales del cliente:

1. **Documento Nacional de Identidad (DNI):** DNI vigente del solicitante. (En el Core se almacena en la tabla `dpersonal` y `dcliente` con restricción `UNIQUE` para evitar duplicaciones).
2. **Evaluación de Historial Crediticio (Scoring):** El cliente no debe figurar con calificaciones negativas en centrales de riesgo. El sistema simula este score (ej. asignando un puntaje de `0 a 1000` basado en el comportamiento).
3. **Capacidad de Pago - Ratio de Sobreendeudamiento (RDS):** 
   * Los ingresos mínimos declarados deben superar la remuneración mínima vital (S/ 1,025.00 en la simulación académica para ser elegible).
   * La cuota del crédito solicitada no debe superar el **35%** de los ingresos declarados netos del cliente. Si supera el 35%, el semáforo de riesgo del Core cambia a Amarillo o Rojo, escalando el nivel de aprobación.
4. **Cuenta de Depósito:** Tener una cuenta activa de ahorros en la misma moneda (Soles o Dólares) dentro del BBVA para realizar el desembolso automático una vez aprobado el préstamo.
5. **Aceptación de Documentos Contractuales:** Firma de la hoja de resumen y el cronograma de cuotas en el portal de Homebanking.

---

## 📸 2. Evidencias y Proformas de Referencia

A continuación se indican los marcadores para colocar las capturas y fotos obtenidas de la institución financiera para la entrega formal del Drive:

### A. Tarifario de Créditos de Consumo BBVA
*(Insertar aquí la imagen de la proforma o folleto oficial que detalla la TEA del producto).*

`[INSERTAR CAPTURA DEL TARIFARIO OFICIAL O PROFORMA DEL BANCO]`

### B. Requisitos en el Portal Web
*(Insertar aquí la captura del simulador local de Homebanking donde se muestran los requisitos y la tasa aplicada al cliente).*

`[INSERTAR CAPTURA DE REQUISITOS EN EL SIMULADOR DEL HOMEBANKING]`

### C. Proforma de Simulación del Préstamo
*(Insertar aquí la captura del cronograma de cuotas calculado por el sistema coincidiendo con el modelo francés a la tasa de 41.20%).*

`[INSERTAR CAPTURA DE LA PROFORMA DEL CRONOGRAMA GENERADO]`

---

## ⚠️ Aclaración para la Sustentación
Las capturas y evidencias correspondientes a las fotos tomadas en oficina o proformas descargadas del portal público oficial del BBVA se adjuntarán directamente en la presentación de diapositivas y en el Drive de entrega mediante formato JPG/PNG. El sistema emula exactamente dichos parámetros para validar el flujo funcional.
