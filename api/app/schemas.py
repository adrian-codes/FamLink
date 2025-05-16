from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

class FamilyBase(BaseModel):
    name: str

class FamilyCreate(FamilyBase):
    pass

class FamilyOut(FamilyBase):
    id: int
    admin_id: Optional[int]

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

class AddFamilyMember(BaseModel):
    username: str
    email: EmailStr
    temporary_password: str

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

class EventBase(BaseModel):
    title: str
    description: str | None = None
    family_id: int
    start_time: datetime
    end_time: datetime

class EventCreate(EventBase):
    pass

class EventOut(EventBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True