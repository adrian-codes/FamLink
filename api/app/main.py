from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth
from .database import Base, engine

app = FastAPI(title="FamLink")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)