# services/tasas_bbva.py
# Tasas referenciales basadas en información pública y simulación académica.
# Estas tasas no representan políticas internas oficiales de BBVA Perú.

# Referencias públicas reales de BBVA Perú:
PRESTAMO_PERSONAL_BPI_TEA = 41.20    # TEA referencial pública de préstamo personal por Banca por Internet
PRESTAMO_AL_TOQUE_TCEA_MAX = 42.15   # TCEA máxima referencial pública del Préstamo al Toque

# Tasas de cuentas de ahorros:
TREA_CUENTA_VIP_SOLES = 4.50         # TREA referencial de hasta 4.5% en soles
TREA_CUENTA_VIP_DOLARES = 1.50       # TREA referencial de hasta 1.5% en dólares

# Tasas simuladas académicas por propósito (Regla D):
TASAS_SIMULADAS_POR_PROPOSITO = {
    "consumo": PRESTAMO_PERSONAL_BPI_TEA,
    "libre_disponibilidad": PRESTAMO_PERSONAL_BPI_TEA,
    "educacion": 28.00,
    "salud": 30.00,
    "vivienda": 11.50,
    "negocio": 35.00
}
