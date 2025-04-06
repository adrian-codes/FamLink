from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Chore, User
from ..schemas import ChoreCreate, ChoreOut
from ..utils import get_current_user

router = APIRouter(prefix="/chores", tags=["chores"])

@router.post("/", response_model=ChoreOut, status_code=status.HTTP_201_CREATED)
def create_chore(chore: ChoreCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.family_id:
        raise HTTPException(status_code=400, detail="You must be part of a family to create a chore")
    if chore.family_id != current_user.family_id:
        raise HTTPException(status_code=403, detail="You can only create chores for your family")
    if current_user.id != chore.assigned_to_id:
        raise HTTPException(status_code=403, detail="You can only assign chores to yourself or family members")
    db_chore = Chore(**chore.dict())
    db.add(db_chore)
    db.commit()
    db.refresh(db_chore)
    return db_chore

@router.get("/", response_model=list[ChoreOut])
def get_chores(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.family_id:
        raise HTTPException(status_code=400, detail="You must be part of a family to view chores")
    chores = db.query(Chore).filter(Chore.family_id == current_user.family_id).all()
    return chores

@router.put("/{chore_id}", response_model=ChoreOut)
def update_chore(chore_id: int, chore: ChoreCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.family_id:
        raise HTTPException(status_code=400, detail="You must be part of a family to update chores")
    if chore.family_id != current_user.family_id:
        raise HTTPException(status_code=403, detail="You can only update chores for your family")
    db_chore = db.query(Chore).filter(Chore.id == chore_id, Chore.family_id == current_user.family_id).first()
    if not db_chore:
        raise HTTPException(status_code=404, detail="Chore not found or not authorized")
    for key, value in chore.dict().items():
        setattr(db_chore, key, value)
    db.commit()
    db.refresh(db_chore)
    return db_chore

@router.delete("/{chore_id}")
def delete_chore(chore_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.family_id:
        raise HTTPException(status_code=400, detail="You must be part of a family to delete chores")
    db_chore = db.query(Chore).filter(Chore.id == chore_id, Chore.family_id == current_user.family_id).first()
    if not db_chore:
        raise HTTPException(status_code=404, detail="Chore not found or not authorized")
    db.delete(db_chore)
    db.commit()
    return {"message": "Chore deleted successfully"}