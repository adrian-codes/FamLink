from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Family, User
from ..schemas import FamilyCreate, FamilyOut, UserOut
from ..utils import get_current_user

router = APIRouter(prefix="/families", tags=["families"])

@router.post("/", response_model=FamilyOut, status_code=status.HTTP_201_CREATED)
def create_family(family: FamilyCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_family = Family(**family.dict())
    db.add(db_family)
    db.commit()
    db.refresh(db_family)
    current_user.family_id = db_family.id
    db.commit()
    return db_family

@router.get("/my-family", response_model=FamilyOut)
def get_my_family(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.family_id:
        raise HTTPException(status_code=404, detail="You are not part of a family")
    family = db.query(Family).filter(Family.id == current_user.family_id).first()
    if not family:
        raise HTTPException(status_code=404, detail="Family not found")
    return family