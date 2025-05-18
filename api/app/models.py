from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Table
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base

event_assignees = Table(
    'event_assignees',
    Base.metadata,
    Column('event_id', Integer, ForeignKey('events.id'), primary_key=True),
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True)
)

class Family(Base):
    __tablename__ = "families"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    admin_id = Column(Integer, nullable=True)
    members = relationship("User", back_populates="family", foreign_keys="User.family_id")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    family_id = Column(Integer, ForeignKey("families.id"), nullable=True)
    family = relationship("Family", back_populates="members", foreign_keys=[family_id])
    events = relationship("Event", secondary=event_assignees, back_populates="assignees")

class Chore(Base):
    __tablename__ = "chores"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    family_id = Column(Integer, ForeignKey("families.id"))
    assigned_to_id = Column(Integer, ForeignKey("users.id"))
    status = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    family_id = Column(Integer, ForeignKey("families.id"))
    start_time = Column(DateTime(timezone=True))
    end_time = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    assignees = relationship("User", secondary=event_assignees, back_populates="events")