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
    school_id: str

class SignupResponse(BaseModel):
    pass

@app.post("/signup")
async def signup(request: SignupRequest, background_tasks: BackgroundTasks) -> SignupResponse:
    existing = supabase.table("signups").select("email").eq("email", request.email).execute()
    if existing.data and len(existing.data) > 0:
        raise HTTPException(status_code=400, detail="email already exists")

    try:
        school = supabase.table("schools").select("name").eq("id", request.school_id).single().execute()
        supabase.table("signups").insert({"email": request.email, "school_id": request.school_id}).execute()
        background_tasks.add_task(run_onboarding_agent, OnboardingAgentRequest(email=request.email, school=school.data["name"]))
    except Exception as e:
        print("failed to sign up", e)
        raise HTTPException(status_code=500, detail="failed to sign up")

    return SignupResponse()

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