import bcrypt


def get_password_hash(password: str) -> str:
    # bcrypt requires bytes, so we encode
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_bytes = bcrypt.hashpw(pwd_bytes, salt)
    return hashed_bytes.decode('utf-8') # Return string for DB storage