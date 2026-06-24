# 01. Requisitos de Instalación — BBVA Perú Simulado

Para poder ejecutar el entorno completo del sistema BBVA (Core y Homebanking), es necesario contar con las siguientes herramientas instaladas en la computadora local.

## Herramientas Principales

| Herramienta | Versión Mínima | Uso en el Proyecto |
|---|---|---|
| **Python** | 3.10 o superior | Necesario para ejecutar FastAPI (Backend del Core y Homebanking). |
| **Node.js** | 18.x o superior | Necesario para ejecutar React con Vite (Frontends). |
| **NPM** | 8.x o superior | Gestor de paquetes de Node.js (viene instalado con Node). |
| **PostgreSQL** | 14 o superior | Base de datos principal (`bd_core_financiero`). |

## Instalación de PostgreSQL y Base de Datos

1. Instalar PostgreSQL y pgAdmin 4.
2. Crear una base de datos local vacía llamada `bd_core_financiero`.
3. Restaurar los backups de la carpeta `07_backups` usando el comando `psql` o mediante la interfaz de pgAdmin.
4. Asegurarse de que el usuario de base de datos coincida con el configurado en los `.env`.

## Recomendaciones Adicionales

- **Git Bash:** Se recomienda instalar Git for Windows y usar la terminal Bash (`Git Bash`) para la ejecución de scripts.
- **VS Code:** Como editor de código principal, con las extensiones de Python y PlantUML.
