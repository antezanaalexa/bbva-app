"""
Mapeo de cargos (dcargopersonal) a roles funcionales del flujo MPR-003-CRE
y helpers de autorización por rol (decisión §7.2 / §7.3 del PLAN).
"""

# codcargopersonal -> rol funcional usado en el token y en los permisos
CARGO_A_ROL = {
    "G01": "gerencia",        # Gerente Central
    "G02": "gerencia",        # Gerente de Área
    "F01": "jefe_regional",   # Jefe de Negocios Regional
    "F02": "administrador",   # Administrador de Agencia
    "F03": "operaciones",     # Jefe de Operaciones
    "F04": "riesgos",         # Jefe de Riesgos
    "F05": "comite",          # Funcionario de Créditos
    "E01": "asesor",          # Asesor de Negocios
    "E02": "operaciones",     # Asistente de Operaciones
    "E03": "analista",        # Analista de Créditos
    "E04": "operaciones",     # Auxiliar de Operaciones
}

ROL_POR_DEFECTO = "asesor"


def rol_desde_cargo(codcargopersonal: str | None) -> str:
    if not codcargopersonal:
        return ROL_POR_DEFECTO
    return CARGO_A_ROL.get(codcargopersonal.strip(), ROL_POR_DEFECTO)


# Matriz de permisos por acción del flujo de otorgamiento (§7) + recuperaciones
PERMISOS = {
    "crear_solicitud":   {"asesor", "administrador"},
    "registrar_propuesta": {"asesor", "administrador"},
    "opinion_admin":     {"administrador"},
    "opinion_jefe_reg":  {"jefe_regional"},
    "opinion_riesgos":   {"riesgos", "analista"},
    "enviar_comite":     {"asesor", "administrador"},
    "resolver_comite":   {"comite", "administrador", "gerencia"},
    # Recuperaciones / Mora
    "consultar_mora":    {"asesor", "administrador", "riesgos", "gerencia", "analista"},
    "gestionar_cobranza": {"asesor", "administrador"},  # SMS/llamada/visita/compromiso
    "derivar_judicial":  {"administrador", "gerencia"},  # pasar a cobranza judicial
    "castigar_credito":  {"comite", "gerencia"},         # castigo contable (>180 días)
    # Nuevos permisos para rechazo y aprobación
    "rechazar_propia":   {"asesor"},
    "rechazar_todas":    {"administrador", "jefe_regional", "gerencia"},
    "aprobar_propia":    {"asesor"},
    "aprobar_todas":     {"administrador", "jefe_regional", "gerencia"}
}


def puede(rol: str, accion: str) -> bool:
    """True si el rol tiene permiso para la acción dada."""
    return rol in PERMISOS.get(accion, set())

# Helper para validar rechazo según rol y nivel de aprobación de la solicitud.
def puede_rechazar(rol: str, nivel_solicitud: str) -> bool:
    """Retorna True si el rol puede rechazar la solicitud según su nivel."""
    return puede_aprobar(rol, nivel_solicitud)

# Helper para validar aprobación según rol y nivel de aprobación de la solicitud.
def puede_aprobar(rol: str, nivel_solicitud: str) -> bool:
    """Retorna True si el rol puede aprobar la solicitud según su nivel de aprobación.
    - Asesor: puede aprobar solicitudes de nivel 'asesor'.
    - Administrador: puede aprobar solicitudes de nivel 'asesor' o 'administrador'.
    - Jefe Regional: puede aprobar solicitudes de nivel 'asesor', 'administrador' o 'jefe_regional'.
    - Riesgos / Gerencia / Comite: pueden aprobar cualquier solicitud.
    """
    rol = (rol or "").strip().lower()
    nivel_solicitud = (nivel_solicitud or "asesor").strip().lower()

    if rol in {"riesgos", "gerencia", "comite"}:
        return True
    if rol == "jefe_regional":
        return nivel_solicitud in {"asesor", "administrador", "jefe_regional"}
    if rol == "administrador":
        return nivel_solicitud in {"asesor", "administrador"}
    if rol == "asesor":
        return nivel_solicitud == "asesor"
    return False
