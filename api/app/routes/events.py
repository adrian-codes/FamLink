from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Event, User
from ..schemas import EventCreate, EventOut
from ..utils import get_current_user

router = APIRouter(prefix="/events", tags=["events"])

@router.post("/", response_model=EventOut, status_code=status.HTTP_201_CREATED)
def create_event(event: EventCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.family_id:
        raise HTTPException(status_code=400, detail="You must be part of a family to create an event")
    if event.family_id != current_user.family_id:
        raise HTTPException(status_code=403, detail="You can only create events for your family")
    
    family_members = db.query(User).filter(User.family_id == current_user.family_id).all()
    family_member_ids = {member.id for member in family_members}
    invalid_assignees = [assignee_id for assignee_id in event.assignee_ids if assignee_id not in family_member_ids]
    if invalid_assignees:
        raise HTTPException(status_code=400, detail=f"Invalid assignee IDs: {invalid_assignees}. They must be family members.")

    db_event = Event(
        title=event.title,
        description=event.description,
        family_id=event.family_id,
        start_time=event.start_time,
        end_time=event.end_time
    )
    db_event.assignees = db.query(User).filter(User.id.in_(event.assignee_ids)).all()
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.get("/", response_model=list[EventOut])
def get_events(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.family_id:
        raise HTTPException(status_code=400, detail="You must be part of a family to view events")
    events = db.query(Event).filter(Event.family_id == current_user.family_id).all()

    for event in events:
        if event.assignees is None:
            event.assignees = []
    return events

@router.delete("/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.family_id:
        raise HTTPException(status_code=400, detail="You must be part of a family to delete events")
    db_event = db.query(Event).filter(Event.id == event_id, Event.family_id == current_user.family_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found or not authorized")
    db.delete(db_event)
    db.commit()
    return {"message": "Event deleted successfully"}