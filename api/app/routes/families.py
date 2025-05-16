from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Family, User
from ..schemas import FamilyCreate, FamilyOut, UserOut, AddFamilyMember
from ..utils import get_current_user, hash_password  # Import hash_password

router = APIRouter(prefix="/families", tags=["families"])

@router.post("/", response_model=FamilyOut, status_code=status.HTTP_201_CREATED)
def create_family(family: FamilyCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_family = Family(name=family.name, admin_id=current_user.id)
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
    return FamilyOut(id=family.id, name=family.name, admin_id=family.admin_id)

@router.get("/{family_id}/members", response_model=list[UserOut])
def get_family_members(family_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.family_id or current_user.family_id != family_id:
        raise HTTPException(status_code=403, detail="You are not authorized to view this family's members")
    members = db.query(User).filter(User.family_id == family_id).all()
    return members

@router.post("/{family_id}/members", response_model=UserOut)
def add_family_member(family_id: int, member: AddFamilyMember, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    family = db.query(Family).filter(Family.id == family_id).first()
    if not family:
        raise HTTPException(status_code=404, detail="Family not found")
    if not family.admin_id or family.admin_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the family admin can add members")
    
    user_to_add = db.query(User).filter(User.username == member.username).first()
    if user_to_add:
        if user_to_add.family_id:
            raise HTTPException(status_code=400, detail="User is already part of a family")
    else:
        hashed_password = hash_password(member.temporary_password)
        user_to_add = User(
            username=member.username,
            email=member.email,
            password_hash=hashed_password
        )
        db.add(user_to_add)
        db.commit()
        db.refresh(user_to_add)

    user_to_add.family_id = family_id
    db.commit()
    db.refresh(user_to_add)
    return user_to_add

@router.delete("/{family_id}/members/{user_id}")
def remove_family_member(family_id: int, user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    family = db.query(Family).filter(Family.id == family_id).first()
    if not family:
        raise HTTPException(status_code=404, detail="Family not found")
    if not family.admin_id or family.admin_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the family admin can remove members")
    
    user_to_remove = db.query(User).filter(User.id == user_id, User.family_id == family_id).first()
    if not user_to_remove:
        raise HTTPException(status_code=404, detail="User not found in this family")
    if user_to_remove.id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot remove yourself as the admin")

    user_to_remove.family_id = None
    db.commit()
    return {"message": "User removed from family successfully"}