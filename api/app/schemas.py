from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

class FamilyBase(BaseModel):
    name: str

class FamilyCreate(FamilyBase):
    pass

class FamilyOut(FamilyBase):
    id: int

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    family_id: Optional[int] = None

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    family_id: Optional[int]

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class Login(BaseModel):
    username: str
    password: str

class ChoreBase(BaseModel):
    title: str
    description: str | None = None
    family_id: int
    assigned_to_id: int

class ChoreCreate(ChoreBase):
    pass

class ChoreOut(ChoreBase):
    id: int
    status: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    class Config:
        from_attributes = True