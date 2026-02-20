import time
from typing import Any, Dict

import httpx
from fastapi import Depends, Header, HTTPException, status
from jose import JWTError, jwk, jwt
from jose.utils import base64url_decode

from .config import settings
from .supabase_client import supabase_admin

_jwks_cache: dict[str, Any] = {"keys": [], "expires_at": 0}


async def _get_jwks() -> list[dict[str, Any]]:
    now = int(time.time())
    if _jwks_cache["keys"] and now < _jwks_cache["expires_at"]:
        return _jwks_cache["keys"]

    async with httpx.AsyncClient(timeout=5.0) as client:
        response = await client.get(f"{settings.supabase_url}/auth/v1/.well-known/jwks.json")
        response.raise_for_status()
        keys = response.json().get("keys", [])

    _jwks_cache["keys"] = keys
    _jwks_cache["expires_at"] = now + settings.jwt_cache_ttl_seconds
    return keys


async def verify_supabase_token(authorization: str | None = Header(default=None)) -> Dict[str, Any]:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")

    token = authorization.split(" ", 1)[1].strip()

    try:
        unverified_header = jwt.get_unverified_header(token)
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token header") from exc

    kid = unverified_header.get("kid")
    jwks = await _get_jwks()
    key_data = next((k for k in jwks if k.get("kid") == kid), None)

    if not key_data:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Signing key not found")

    public_key = jwk.construct(key_data)
    message, encoded_sig = token.rsplit(".", 1)
    decoded_sig = base64url_decode(encoded_sig.encode())

    if not public_key.verify(message.encode(), decoded_sig):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token signature")

    try:
        claims = jwt.get_unverified_claims(token)
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token claims") from exc

    if claims.get("aud") != settings.supabase_jwt_audience:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid audience")

    if claims.get("exp", 0) < time.time():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")

    return claims


async def get_current_profile(token_claims: dict[str, Any] = Depends(verify_supabase_token)) -> Dict[str, Any]:
    user_id = token_claims.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing subject")

    profile_res = (
        supabase_admin.table("users")
        .select("id, full_name, email, role, church_id")
        .eq("id", user_id)
        .single()
        .execute()
    )

    if not profile_res.data:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Profile not provisioned")

    return profile_res.data


def require_role(*allowed_roles: str):
    async def _validator(profile: Dict[str, Any] = Depends(get_current_profile)) -> Dict[str, Any]:
        if profile["role"] not in allowed_roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        return profile

    return _validator
