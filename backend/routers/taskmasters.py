from fastapi import APIRouter, HTTPException, Depends, status
from typing import Union
from utility import get_db_conn, oauth2_scheme
from datetime import datetime, timedelta, date
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel


router = APIRouter()

#-------------------REGO-----------------
class RegisterProfile(BaseModel):
    email: str
    first_name: str
    last_name: str
    password: str
    dob: str

@router.post("/register")
async def register(user: RegisterProfile):
    conn = get_db_conn()
    cur = conn.cursor()

    cur.execute("SELECT * FROM profiles WHERE email_address=%s", (user.email,))
    if cur.fetchone() is not None:
        raise HTTPException(status_code=400, detail="Email already in use")

    password_hash = get_password_hash(user.password)

    cur.execute("INSERT INTO profiles (email_address, first_name, last_name, date_of_birth, password_hash) \
                VALUES (%s, %s, %s, %s, %s)", (user.email, user.first_name, user.last_name, user.dob, password_hash))
    conn.commit()
    cur.close()
    conn.close()

    return {"detail": "User registered"}

#------------------AUTH-----------------

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "6b4f6ee73021eef5a7ec638de18f83461b91fb0a778033f19111364113bcdfb8"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 45


def verify_password(password, password_hash):
    return pwd_context.verify(password, password_hash)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_profile_password_hash(email):
    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute("SELECT password_hash from PROFILES where email_address=%s", (email,))
    password_hash = cur.fetchone()
    if password_hash is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Profile not found")
    return password_hash[0]

def authenticate_profile(email: str, password: str):
    password_hash = get_profile_password_hash(email)
    if not verify_password(password, password_hash):
        return False
    return email

class Token(BaseModel):
    access_token: str
    token_type: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        profile_id: str = payload.get("sub")
        if profile_id is None:
            raise HTTPException(status_code=401)
        return profile_id
    except JWTError:
        raise HTTPException(status_code=401)

class LoginData(BaseModel):
    email: str
    password: str

@router.post("/token", response_model=Token)
def login_for_access_token(login_data: LoginData):
    email = authenticate_profile(login_data.email, login_data.password)
    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute("SELECT id FROM PROFILES WHERE email_address=%s", (email,))
    profile_id = cur.fetchone()
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    cur.close()
    conn.close()

    access_token = create_access_token(
        data={"sub": str(profile_id[0])}
    )
    return {"access_token": access_token, "token_type": "bearer"}


# ---------- Logout



# ---------- PROFILE


def get_profile(profile_id: str):
    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute("SELECT first_name, last_name, email_address, date_of_birth FROM PROFILES WHERE id=%s", (profile_id,))
    profile = cur.fetchone()
    cur.close()
    conn.close()

    if profile is None:
        raise HTTPException(status_code=405)
    
    first_name, last_name, email_address, date_of_birth = profile

    profile_dict = {
        'profile_id': profile_id,
        'first_name': first_name,
        'last_name': last_name,
        'email': email_address,
        'date_of_birth': date_of_birth
    }

    return profile_dict

class UserProfile(BaseModel):
    profile_id: int
    first_name: str
    last_name: str
    email: str
    date_of_birth: Union[date, None]

@router.get("/profile", response_model=UserProfile)
async def read_profile(token: str = Depends(oauth2_scheme)):
    profile_id = verify_token(token)
    # conn = get_db_conn()
    # cur = conn.cursor()
    # cur.execute("SELECT email_address from profiles WHERE id=%s", (profile_id,))
    # email = cur.fetchone()[0]
    # cur.close()
    # conn.close()

    # TODO CHECK IF CONNECTED OR SELF
    return get_profile(profile_id)