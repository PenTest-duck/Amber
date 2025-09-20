from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
from pydantic import BaseModel
from dotenv import load_dotenv
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class SignupRequest(BaseModel):
    email: str

class SignupResponse(BaseModel):
    pass

@app.post("/signup")
async def signup(request: SignupRequest) -> SignupResponse:
    existing = supabase.table("signups").select("email").eq("email", request.email).execute()
    if existing.data and len(existing.data) > 0:
        raise HTTPException(status_code=400, detail="email already exists")

    response = supabase.table("signups").insert({"email": request.email}).execute()
    if response.error:
        raise HTTPException(status_code=500, detail="failed to sign up")

    return SignupResponse()
