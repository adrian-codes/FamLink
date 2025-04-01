from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register(username: str, email: str, password: str, db: Session = Depends(get_db)):
    return {"message": "User registered"}