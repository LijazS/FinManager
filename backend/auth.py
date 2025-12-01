import os
import bcrypt
import jwt



def get_password_hash(password: str) -> str:
    # bcrypt requires bytes, so we encode
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_bytes = bcrypt.hashpw(pwd_bytes, salt)
    return hashed_bytes.decode('utf-8') # Return string for DB storage

def get_user_id(token: str, secret_key: str, algorithms: list = ["HS256"]) -> str | None:
    payload = verify_access_token(token, secret_key, algorithms)
    if payload:
        return payload.get("sub")
    return None


def verify_password(plain_password: str, hashed_password: str) -> bool:
    plain_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_bytes, hashed_bytes)

def create_access_token(data: dict, secret_key: str, algorithm: str = "HS256") -> str:
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, secret_key, algorithm=algorithm)
    return encoded_jwt

def verify_access_token(token: str, secret_key: str, algorithms: list = ["HS256"]) -> dict:
    try:
        decoded_payload = jwt.decode(token, secret_key, algorithms=algorithms)
        return decoded_payload
    except jwt.PyJWTError:
        return None