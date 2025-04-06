from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth, chores, families
from .database import Base, engine

app = FastAPI(title="FamLink")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Include routes
app.include_router(auth.router)
app.include_router(chores.router)
app.include_router(families.router)