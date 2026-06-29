# Restauración de Base de Datos en Neon — BBVA Perú Simulado

Este documento explica paso a paso cómo aprovisionar la base de datos PostgreSQL en la plataforma serverless **Neon** y restaurar el backup portable del sistema.

---

## 1. Creación del Proyecto en Neon

1. Regístrese o inicie sesión en [Neon.tech](https://neon.tech/).
2. Presione **Create Project**.
3. Configure los parámetros:
   - **Name**: `bbva-simulado` (o el nombre de su preferencia).
   - **PostgreSQL Version**: `16` o superior (el backup soporta PostgreSQL 18+ local y es retrocompatible).
   - **Region**: Seleccione la más cercana a su público (ej: `us-east-1` o `us-east-2`).
4. Presione **Create Project**.
5. Copie inmediatamente la cadena de conexión provista. Asegúrese de seleccionar la pestaña **Connection string** en formato completo de URI (ejemplo):
   `postgresql://neondb_owner:[PASSWORD]@[HOST]/neondb?sslmode=require`

---

## 2. Restauración del Backup usando `psql`

El archivo de backup está ubicado localmente en:
`docs_entregable/07_backups/backup_bbva_sin_owner.sql`

Este archivo está preparado para ser portable:
- No incluye sentencias de creación de bases de datos (`CREATE DATABASE`), por lo que se restaurará en la base de datos por defecto de Neon (`neondb`).
- No contiene sentencias `OWNER TO`, previniendo errores de permisos en Neon.
- Solo contiene sentencias DDL de tablas/funciones y DML (`COPY`) con hashes en bcrypt (sin claves en texto plano).

### Comando de Restauración:
Abra una terminal local en la raíz del proyecto y ejecute el comando `psql` apuntando a Neon:

```bash
# Reemplace [CONNECTION_STRING_NEON] con la URL completa que copió de Neon
psql "[CONNECTION_STRING_NEON]" -f docs_entregable/07_backups/backup_bbva_sin_owner.sql
```

> [!NOTE]
> La restauración creará todas las tablas, índices, triggers, funciones personalizadas (como `bbva_transferir_app`) y poblará los datos iniciales requeridos.

---

## 3. Consultas SQL de Verificación de Datos

Una vez completada la restauración sin errores, ingrese a la consola SQL en la interfaz web de Neon o ejecute los siguientes comandos en `psql` para verificar la integridad del esquema:

### A. Verificar que las tablas principales existan
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### B. Verificar número de registros de usuarios semilla
```sql
-- Debe retornar los usuarios registrados en el backend
SELECT rol, COUNT(*) 
FROM public.app_usuarios 
GROUP BY rol;
```

### C. Buscar a los usuarios principales de prueba
```sql
-- Confirma la presencia del usuario demo "Alexandra Antezana"
SELECT id, nombres, apellidos, correo, rol, estado 
FROM public.app_usuarios 
WHERE dni = '11111111';
```

### D. Confirmar Cuentas de Ahorro y Saldos
```sql
-- Verifica que las cuentas estén asignadas a los usuarios
SELECT u.nombres, c.numero_cuenta, c.saldo, c.moneda, c.tipo_cuenta 
FROM public.cuentas c
JOIN public.app_usuarios u ON c.user_id = u.id
LIMIT 5;
```

### E. Verificar funciones PL/pgSQL restauradas
```sql
-- Comprobar si la función de transferencia se restauró correctamente
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' AND routine_name LIKE 'bbva_%';
```
