import json
from typing import Any
from pydantic import BaseModel
import requests
import os
import resend
from langfuse import get_client, observe
from llama_index.core.prompts import ChatPromptTemplate, ChatMessage
from llama_index.llms.openai import OpenAI
from llama_index.core.workflow import Workflow, step, StartEvent, StopEvent, Event
from openinference.instrumentation.llama_index import LlamaIndexInstrumentor
from dotenv import load_dotenv

load_dotenv()

SERPER_API_KEY = os.getenv("SERPER_API_KEY")
RAI_API_KEY = os.getenv("RAI_API_KEY")
RAI_REGION = os.getenv("RAI_REGION")
RAI_PROJECT = os.getenv("RAI_PROJECT")
RAI_LINKEDIN_TOOL_ID = "2563f44e-fbd6-40f2-8761-dfefe874abba"
langfuse = get_client()
LlamaIndexInstrumentor().instrument()


class OnboardingAgentRequest(BaseModel):
    email: str
    school: str

class Email(BaseModel):
    subject: str
    body: str

class FailureEvent(Event):
    error: str


class ScrapeLinkedInEvent(Event):
    url: str


class ComposeEmailEvent(Event):
    profile: str


class SendEmailEvent(Event):
    subject: str
    body: str


class OnboardingAgent(Workflow):
    def __init__(self, request: OnboardingAgentRequest, **kwargs: Any):
        self.llm = OpenAI(model="gpt-5-mini")
        self.request = request
        super().__init__(**kwargs)

    @step
    @observe
    async def search_person(self, ev: StartEvent) -> ScrapeLinkedInEvent | FailureEvent:
        # Strip username from email
        username = self.request.email.split("@")[0]
        if not self.request.email or not username:
            return FailureEvent(error="Invalid username or school")

        # Search Serper for linkedin profile
        search_query = f"{username} {self.request.school} linkedin"
        response = requests.post(
            url="https://google.serper.dev/search",
            headers={"X-API-KEY": SERPER_API_KEY},
            json={"q": search_query},
        )
        if response.status_code != 200:
            return FailureEvent(error="Failed to search Serper")
        for result in response.json().get("organic", []):
            url = result.get("link", "")
            if "https://www.linkedin.com/in/" in url:
                return ScrapeLinkedInEvent(url=url)
        return FailureEvent(
            error=f"No linkedin profile found for {username} in {self.request.school}"
        )

    @step
    @observe
    async def scrape_linkedin_profile(
        self, ev: ScrapeLinkedInEvent
    ) -> ComposeEmailEvent | FailureEvent:
        url = f"https://api-{RAI_REGION}.stack.tryrelevance.com/latest/studios/{RAI_LINKEDIN_TOOL_ID}/trigger_limited"
        headers = {
            "Authorization": f"{RAI_PROJECT}:{RAI_API_KEY}"
        }
        body = {
            "params": {
                "url": ev.url,
            },
            "project": RAI_PROJECT,
        }
        response = requests.post(url=url, headers=headers, json=body)
        if response.status_code != 200:
            return FailureEvent(error=f"Failed to scrape LinkedIn profile: status code {response.status_code}")
        result = response.json()
        if len(result.get("errors", [])) > 0:
            return FailureEvent(error=f"Failed to scrape LinkedIn profile: {result.get("errors")}")
        return ComposeEmailEvent(profile=json.dumps(result["output"]["linkedin_profile"]))

    @step
    @observe(as_type="generation")
    async def write_email(self, ev: ComposeEmailEvent) -> SendEmailEvent | FailureEvent:
        email: Email = self.llm.structured_predict(
            output_cls=Email,
            prompt=ChatPromptTemplate([
                ChatMessage(role="system", content="You are a helpful assistant that writes emails."),
                ChatMessage(role="user", content="Here information about the LinkedIn profile: {profile}"),
            ]),
            profile=ev.profile,
        )
        return SendEmailEvent(subject=email.subject, body=email.body)

    @step
    @observe
    async def send_email(self, ev: SendEmailEvent) -> StopEvent:
        params: resend.Emails.SendParams = {
            "from": "amber <amber@omniscient.fyi>",
            "to": [self.request.email],
            "subject": ev.subject,
            "html": ev.body,
        }
        email = resend.Emails.send(params)
        langfuse.update_current_span(metadata={"email_id": email.id})
        return StopEvent()

    @step
    @observe
    async def handle_failure(self, ev: FailureEvent) -> StopEvent:
        return StopEvent()


@observe(as_type="agent")
async def run_onboarding_agent(request: OnboardingAgentRequest):
    agent = OnboardingAgent(request=request, timeout=60, verbose=True)
    result = await agent.run(email="chrisyoo@college.harvard.edu")
    print(result)


if __name__ == "__main__":
    import asyncio
    asyncio.run(run_onboarding_agent(
        request=OnboardingAgentRequest(email="chrisyoo@college.harvard.edu", school="Harvard")
    ))
