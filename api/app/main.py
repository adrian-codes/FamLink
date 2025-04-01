from fastapi import FastAPI
from .routes import auth
from .database import Base, engine

app = FastAPI(title="FamLink")

Base.metadata.create_all(bind=engine)
app.include_router(auth.router)