from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from services.jwt_service import decode_token

bearer_scheme = HTTPBearer(auto_error=True)

def obtener_usuario_actual(
    cred: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    """Dependency for securing endpoints by extracting and validating the JWT bearer token."""
    payload = decode_token(cred.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload
