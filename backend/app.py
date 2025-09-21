from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from db import supabase
from pydantic import BaseModel
from onboarding import run_onboarding_agent, OnboardingAgentRequest

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping")
async def ping() -> str:
    return "pong"

class SignupRequest(BaseModel):
    email: str
    school: str

class SignupResponse(BaseModel):
    pass

@app.post("/signup")
async def signup(request: SignupRequest, background_tasks: BackgroundTasks) -> SignupResponse:
    existing = supabase.table("signups").select("email").eq("email", request.email).execute()
    if existing.data and len(existing.data) > 0:
        raise HTTPException(status_code=400, detail="email already exists")

    try:
        supabase.table("signups").insert({"email": request.email}).execute()
        background_tasks.add_task(run_onboarding_agent, OnboardingAgentRequest(email=request.email, school=request.school))
    except Exception as e:
        print("failed to sign up", e)
        raise HTTPException(status_code=500, detail="failed to sign up")

    return SignupResponse()
