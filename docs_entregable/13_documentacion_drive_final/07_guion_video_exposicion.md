# 🎬 Guion de Exposición y Video Demostrativo — BBVA Perú Simulado

Este documento contiene la estructura y diálogos sugeridos para realizar una exposición y video demostrativo ejecutivo (tiempo sugerido: **8 a 12 minutos**) dirigido al comité evaluador.

---

## ⏱️ Línea de Tiempo del Video

| Bloque | Tiempo | Tema | Canal / Sistema |
|---|---|---|---|
| 01 | 0:00 - 1:00 | Introducción y Presentación del Proyecto | Diapositivas |
| 02 | 1:00 - 2:30 | Arquitectura e Integración End-to-End | Diapositivas / Diagrama |
| 03 | 2:30 - 3:30 | Producto Financiero y Tarifario (TEA 41.20%) | Portal Homebanking |
| 04 | 3:30 - 5:00 | Flujo de Cliente (Simulación y Solicitud) | Portal Homebanking |
| 05 | 5:00 - 6:30 | Flujo de Evaluación Interna (Core Bancario) | Core Bancario Asesor |
| 06 | 6:30 - 8:00 | Decisión y Desembolso Automático | Core Bancario Admin |
| 07 | 8:00 - 9:30 | Reportería Analítica e Inteligencia de Negocio | Power BI Desktop |
| 08 | 9:30 - 11:00| Hardening y Ciberseguridad (JWT, IDOR, Bcrypt) | Consola / Swagger |
| 09 | 11:00 - 11:30| Conclusión y Cierre | Diapositivas |

---

## 🎙️ Guion Paso a Paso (Diálogos del Presentador)

### 1. Presentación del Proyecto (0:00 - 1:00)
> *"Buenos días, estimado jurado y profesor. Mi nombre es [Nombre] y hoy les presentaré el proyecto integrado **BBVA Perú Simulado**. Este sistema representa una solución bancaria de extremo a extremo que integra dos plataformas principales: un portal digital de cara al cliente (Homebanking) y un sistema interno de operaciones (Core Bancario), compartiendo una base de datos centralizada bajo normativas reales."*

### 2. Arquitectura e Integración (1:00 - 2:30)
> *"Nuestra arquitectura está diseñada para separar responsabilidades. El cliente interactúa con una interfaz SPA en React, la cual realiza peticiones seguras mediante Axios al backend de Homebanking en FastAPI. Por otro lado, los colaboradores del banco utilizan el Core Bancario Web para evaluar los indicadores de riesgo. La integración es en línea: cualquier solicitud o transacción en el Homebanking impacta al instante en las bandejas del Core Bancario."*

### 3. Producto Financiero y Tarifario (2:30 - 3:30)
> *(Mostrar la pantalla de Homebanking).*
> *"Hemos simulado un producto financiero real: el **Préstamo de Consumo de Libre Disponibilidad**. El tarifario oficial aplica una **TEA referencial de 41.20%**. Para cumplir con la regulación financiera, esta tasa se centraliza en el backend y se convierte algorítmicamente a una **TEM de 2.927%** aplicando capitalización compuesta. Esta TEM es la base matemática para calcular las cuotas constantes del simulador bajo el **sistema francés**."*

### 4. Flujo del Cliente: Simulación y Solicitud (3:30 - 5:00)
> *(Simular un préstamo de S/ 8,000 en pantalla).*
> *"Como vemos en pantalla, registramos los ingresos mensuales de S/ 3,500 y solicitamos S/ 8,000 a 12 meses. El sistema calcula la cuota fija mensual de S/ 1,003.21 y realiza una pre-evaluación del ratio de sobreendeudamiento. Como la cuota no supera el 35% de los ingresos, el indicador se muestra verde. Confirmamos la solicitud de préstamo."*

### 5. Flujo de Evaluación Interna: Asesor Core (5:00 - 6:30)
> *(Iniciar sesión en el Core con el DNI 11111111 de Asesor).*
> *"Ahora nos colocamos el sombrero del **Asesor de Negocios** en el Core Bancario. En la bandeja de 'Mis Solicitudes' vemos ingresar en tiempo real la solicitud del cliente. El motor de scoring ha asignado el nivel de aprobación 'asesor' porque el monto es menor a S/ 10,000 y el riesgo es bajo. Procedemos a verificar el scoring y damos clic en **Aprobar**."*

### 6. Decisión y Desembolso: Admin Core (6:30 - 8:00)
> *(Iniciar sesión en el Core con el DNI 11111112 de Administrador).*
> *"Para simular el control de segregación de funciones, el desembolso requiere el rol del **Administrador de Agencia**. Iniciamos sesión, buscamos la solicitud aprobada y procedemos a dar clic en **Desembolsar**. Automáticamente, los fondos son transferidos a la cuenta de ahorros del cliente y el crédito pasa a la cartera activa."*
> *(Mostrar el Homebanking del cliente de nuevo para evidenciar que el saldo subió en S/ 8,000 y se registró la transacción en el historial).*

### 7. Reportería Analítica (8:00 - 9:30)
> *(Mostrar Power BI Desktop).*
> *"Para la alta gerencia, implementamos dashboards analíticos en **Power BI** conectados por DirectQuery. En el panel de **Solicitudes** observamos el embudo de estados. En el panel de **Desembolsos** vemos la colocación mensual, y el panel de **Cartera y Mora** clasifica automáticamente los créditos con atraso en bandas preventivas y judiciales para gestionar las cobranzas en tiempo real."*

### 8. Hardening y Ciberseguridad (9:30 - 11:00)
> *(Mostrar Swagger del Homebanking o consola).*
> *"Finalmente, abordamos el Reto de Ciberseguridad. Hemos mitigado los ataques de **SQL Injection** usando consultas parametrizadas puras. La suplantación se mitiga mediante tokens firmados **JWT** con expiración de 120 minutos. Implementamos protección contra **IDOR**: si intentamos consultar movimientos de otra cuenta sin pertenencia, el backend rechaza la petición con un código **403 Forbidden**. Además, todas las contraseñas de los usuarios en base de datos están cifradas con **Bcrypt**, impidiendo ataques de fuerza bruta."*

### 9. Cierre (11:00 - 11:30)
> *"En resumen, BBVA Perú Simulado demuestra cómo la ingeniería de software y la ciberseguridad pueden unirse para crear un sistema integrado, seguro, auditable y listo para operar en entornos reales. Muchas gracias. Quedo atento a sus preguntas."*
