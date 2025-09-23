from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from db import supabase
from pydantic import BaseModel
import uuid
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
    schoolId: str

class SignupResponse(BaseModel):
    id: str

class OnboardRequest(BaseModel):
    userId: str
    firstName: str
    lastName: str
    area_of_study: str
    interests: list[str]

class OnboardResponse(BaseModel):
    pass

@app.post("/signup")
async def signup(request: SignupRequest, background_tasks: BackgroundTasks) -> SignupResponse:
    existing = supabase.table("signups").select("email").eq("email", request.email).execute()
    if existing.data and len(existing.data) > 0:
        raise HTTPException(status_code=400, detail="email already exists")

    try:
        school = supabase.table("schools").select("name").eq("id", request.schoolId).single().execute()
        user_id = str(uuid.uuid4())
        supabase.table("signups").insert({
            "id": user_id,
            "email": request.email,
            "school_id": request.schoolId,
        }).execute()
        background_tasks.add_task(run_onboarding_agent, OnboardingAgentRequest(email=request.email, school=school.data["name"]))
    except Exception as e:
        print("failed to sign up", e)
        raise HTTPException(status_code=500, detail="failed to sign up")

    return SignupResponse(id=user_id)

@app.post("/onboard")
async def onboard(request: OnboardRequest) -> OnboardResponse:
    try:
        # Update the signups row with onboarding data
        update_payload = {
            "first_name": request.firstName,
            "last_name": request.lastName,
            "area_of_study": request.area_of_study,
            "interests": request.interests,
        }
        supabase.table("signups").update(update_payload).eq("id", request.userId).execute()
        
    except Exception as e:
        print("failed to process onboarding", e)
        raise HTTPException(status_code=500, detail="failed to process onboarding")

    return OnboardResponse()

from llama_index.core.workflow import Workflow, step, StartEvent, StopEvent
from typing import Any
import asyncio

class TestWorkflow(Workflow):
    def __init__(self, **kwargs: Any):
        super().__init__(**kwargs)

    @step
    async def test_step(self, ev: StartEvent) -> StopEvent:
        await asyncio.sleep(10)
        print("test step done")
        return StopEvent()

@app.get("/test")
async def test(background_tasks: BackgroundTasks) -> str:
    async def test_task():
        await TestWorkflow().run()
    background_tasks.add_task(test_task)
    return "ok"