# Flujo de Demostración — Exposición BBVA
## Guía para presentar el sistema en 10-15 minutos

---

## Preparación previa (5 min antes)

1. Levantar todos los servicios con `start_all.bat`
2. Abrir 4 pestañas en el navegador:
   - http://localhost:5173 (Homebanking)
   - http://localhost:5174 (Core — login como asesor)
   - http://localhost:5174 (Core — segunda ventana privada como admin)
   - Power BI Desktop con el reporte `.pbix` abierto
3. Tener pgAdmin abierto con `bd_core_financiero`

---

## Bloque 1 — Homebanking del cliente (3 min)

**Contexto:** "Un cliente del BBVA quiere solicitar un préstamo desde casa."

1. Abrir http://localhost:5173
2. Mostrar la página de inicio (Hero, productos, diseño)
3. Registrar un cliente nuevo:
   - DNI: `55555555`
   - Nombres, correo, contraseña
4. Hacer login
5. Mostrar el dashboard del cliente:
   - Saldo en cuentas
   - Últimas transacciones
6. Ir a **"Solicitar Préstamo"**:
   - Monto: S/ 8,000 (nivel asesor)
   - Plazo: 12 meses
   - Ingresos: S/ 3,500
7. Ver el resultado del scoring (semáforo verde/amarillo)
8. Confirmar la solicitud → "La solicitud fue registrada exitosamente"

**Punto clave:** "La solicitud llega instantáneamente al Core Bancario."

---

## Bloque 2 — Core Bancario: Asesor (4 min)

**Contexto:** "El asesor de negocios recibe la solicitud en su bandeja."

1. Abrir http://localhost:5174
2. Login como **Asesor** (DNI: `11111111`)
3. Mostrar el Dashboard → KPIs del asesor
4. Ir a **"Mis Solicitudes"** (bandeja propia)
5. Mostrar la solicitud que acaba de entrar del Homebanking
6. Señalar:
   - Nivel de aprobación: `asesor` (porque el monto es bajo)
   - Semáforo RDS: verde
   - Botones ✓ y ✗ en la columna "Acciones"
7. Hacer clic en ✓ **Aprobar** → confirmar → "Solicitud aprobada"
8. La solicitud cambia a estado `aprobado`

---

## Bloque 2B — Solicitud de monto alto (para mostrar escalado)

1. En el Homebanking, crear otra solicitud con monto S/ 80,000
2. Volver al Core → Mis Solicitudes del asesor
3. Mostrar que el nivel es `administrador` y el botón de acción dice "requiere nivel superior"
4. **"El asesor no puede aprobar esto — debe pasar al Administrador"**

---

## Bloque 3 — Core Bancario: Administrador (3 min)

**Contexto:** "El administrador gestiona la bandeja completa."

1. Abrir ventana privada → http://localhost:5174
2. Login como **Administrador** (DNI: `11111112`)
3. Ir a **"Bandeja de Solicitudes"**
4. Mostrar que ve TODAS las solicitudes (incluyendo la de S/ 80,000)
5. Seleccionar la solicitud de S/ 80,000 → **"Ver Detalle"**
6. Mostrar el detalle: datos del cliente, scoring, RDS, flujo de aprobación
7. **Aprobar** → estado cambia a `aprobado`
8. Aparece el botón **"Desembolsar Ahora"** → desembolsar
9. El crédito pasa a la cartera activa

---

## Bloque 4 — Recuperaciones de Mora (2 min)

**Contexto:** "El sistema gestiona automáticamente los créditos en mora."

1. Ir a **"Bandeja de Mora"** (menú lateral)
2. Mostrar el filtro por bandas (preventiva, temprana, tardía...)
3. Seleccionar un crédito → mostrar días de atraso y saldo
4. Registrar un compromiso de pago
5. Mostrar el historial de gestiones

---

## Bloque 5 — Power BI (2 min)

**Contexto:** "La gerencia monitorea todo en tiempo real con Power BI."

1. Abrir Power BI Desktop
2. Página 1: **Cartera de Créditos**
   - Mostrar evolución mensual de mora en el 2025
   - Filtrar por agencia
3. Página 2: **Productividad de Asesores**
   - Mostrar semáforos de cumplimiento de metas
   - "El asesor Juan cumplió el 87% de su meta"
4. Página 3: **Solicitudes**
   - Gráfico de anillo con estados
   - "Tenemos X solicitudes aprobadas este mes"

---

## Puntos de evaluación a destacar

| Criterio de rúbrica | Dónde mostrarlo |
|---|---|
| Autenticación JWT con roles | Login y menú diferenciado por rol |
| Motor de scoring crediticio | Pre-solicitud → resultado automático |
| Flujo de aprobación multinivel | Asesor vs Admin vs Jefe Regional |
| CRUD de solicitudes | Homebanking → Core |
| Recuperaciones de mora | Bandeja de mora + bandas |
| Captaciones (ahorros) | Login como admin → módulo Ahorros |
| Power BI | Reportes con datos históricos 2025 |
| Base de datos dimensional | Modelo estrella en `bd_core_financiero` |
| Seguridad (bcrypt + JWT) | Mostrar en Swagger: `/auth/login` |
