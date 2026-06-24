-- ============================================================================
-- CONSULTA DE CREDENCIALES DE LOGIN  (bd_core_financiero) - BBVA PERÚ
-- ============================================================================
--
-- IMPORTANTE SOBRE LA SEGURIDAD Y CONTRASEÑAS:
--
-- Tanto el personal interno (Core Bancario) como los clientes (Homebanking)
-- cuentan con un nivel de seguridad alto. Las contraseñas NO se guardan en
-- texto plano, sino que están encriptadas con el algoritmo Bcrypt ($2b$).
-- 
-- El sistema usa la librería passlib de Python para validar el login.
--
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1) PERSONAL DEL BANCO (Core Bancario)
--    Usuario: El número de DNI
--    Contraseña para ingresar: El mismo número de DNI
--    Contraseña en Base de Datos: Hash Bcrypt (irreversible)
-- ----------------------------------------------------------------------------
SELECT
    p.codpersonal,
    p.numerodni                  AS usuario_login,
    p.numerodni                  AS contrasena_para_ingresar,
    p.password_hash              AS hash_guardado_en_bd,
    cp.codcargopersonal          AS cod_cargo,
    cp.descargopersonal          AS cargo,
    p.nombre
FROM dpersonal p
LEFT JOIN dpersonalcargo pc ON pc.pkpersonal     = p.pkpersonal
LEFT JOIN dcargopersonal cp ON cp.pkcargopersonal = pc.pkcargopersonal
ORDER BY p.numerodni;


-- ----------------------------------------------------------------------------
-- 2) CLIENTES HOMEBANKING (Módulo Nuevo BBVA)
--    Usuario: El DNI con el que se registraron
--    Contraseña: La que colocaron en el registro (en texto plano)
--    Tabla: app_usuarios
-- ----------------------------------------------------------------------------
SELECT
    dni                          AS usuario_login,
    password_hash                AS contrasena_para_ingresar,
    nombres                      AS nombres,
    apellidos                    AS apellidos,
    correo                       AS correo,
    estado                       AS estado_cuenta
FROM app_usuarios
WHERE rol = 'cliente'
ORDER BY fecha_registro DESC;
