from datetime import datetime
import json
from typing import Any, Dict
from pydantic import BaseModel
import requests
import os
import resend
from db import supabase
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
MAINTENANCE_EMAIL = os.getenv("MAINTENANCE_EMAIL")
resend.api_key = os.getenv("RESEND_API_KEY")
langfuse = get_client()
LlamaIndexInstrumentor().instrument()


class OnboardingAgentRequest(BaseModel):
    email: str
    school: str

class Email(BaseModel):
    subject: str
    body: str

class SuccessEvent(Event):
    pass

class FailureEvent(Event):
    error: str


class ScrapeLinkedInEvent(Event):
    url: str


class WriteEmailEvent(Event):
    profile: Dict[str, Any]


class SendEmailEvent(Event):
    first_name: str
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
    ) -> WriteEmailEvent | FailureEvent:
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
        return WriteEmailEvent(profile=result["output"]["linkedin_profile"])

    @step
    @observe(as_type="generation")
    async def write_email(self, ev: WriteEmailEvent) -> SendEmailEvent | FailureEvent:
        first_name = ev.profile["first_name"]
        email: Email = self.llm.structured_predict(
            output_cls=Email,
            prompt=ChatPromptTemplate([
                ChatMessage(role="system", content="""
You are Amber, a personal opportunity scout.
Your task is to write a first email to {first_name}, a student at {school}.
I have already scraped their LinkedIn profile, which will be provided to you.

Make clever references to the LinkedIn profile so that the recipient feels like you know them personally. But don't copy-paste phrases directly - they shouldn't know that you took it from the LinkedIn profile.
Use an informal tone. Be nonchalant and assertive but not overly pushy nor disrespectful.
Always use lowercase for everything. Never use uppercase.
Never use the em dash, use a normal dash instead.
Write the subject and the <EMAIL BODY> section for the email (described below), so that can be sent immediately afterwards. Do not leave any placeholders.

Your subject must be a single line (all lowercase) following this format: `[amber] <subject>`
The subject should be a catchy single line or question that shows you know a specific core fact of the recipient, e.g. `[amber] suffering in stats courses?`, `[amber] that research on the world bank going good?`

The email body must be 3 brief lines talking about what the recipient seems to be interested in.
The purpose of this is just to inject a sense of familiarity and personalization for the recipient.
The email body that you write will be placed in the <EMAIL BODY> section of this skeleton, then sent to the recipient. So for the body, just return whatever will go in the <EMAIL BODY> section.
It should feel like a cool human wrote it.

Skeleton:
```
hey {first_name},

i'm amber, your ai opportunity scout.
i'm subscribed to the mailing lists & calendars for all 548 clubs and 386 institutes at harvard + events all across boston.

<EMAIL BODY>

i look forward to scouting out the best opportunities just for you :)

live without fomo - be omniscient,
amber
```

Example body:
```
wow, looks like you got a big passion for ai and startups.
you know what paul graham says: "live in the future and build what's missing" - seems you're already doing that.
i can see that you're into biotech too, doing research at the harvard wyss institute - that's awesome!
```

DO NOT PROMISE, ASK, OR SUGGEST TO DO ANYTHING.
Bad example #1: "i'll be sure to let you know of club events that you might be interested in"
Bad example #2: "want curated jobs or research opportunities while you're here?"

Make it sound engaging, natural and human (not just rattling off facts).
DO NOT WRITE THE ENTIRE BODY. ONLY WRITE THE <EMAIL BODY> SECTION. I WILL TAKE CARE OF PLACING IT IN THE CORRECT PLACE.
"""),
                ChatMessage(role="user", content="""
Here is information about the recipient's LinkedIn profile:
```
{profile}
```
"""),
            ]),
            first_name=first_name.lower(),
            school=self.request.school.lower(),
            profile=ev.profile,
        )
        return SendEmailEvent(first_name=first_name, subject=email.subject, body=email.body)

    @step
    @observe
    async def send_email(self, ev: SendEmailEvent) -> SuccessEvent:
        body = f"""
hey {ev.first_name.lower()},

i'm amber, your ai opportunity scout.
i'm subscribed to the mailing lists & calendars of <b>548 clubs and 386 institutes at harvard</b> + events all across boston.

<i>{ev.body.lower()}</i>

look forward to scouting out the best opportunities just for you.

live without fomo - be omniscient,
amber
"""
        body = body.replace('\n', '<br>').replace('—', '-')
        
        params: resend.Emails.SendParams = {
            "from": "amber <amber@omniscient.fyi>",
            "to": [self.request.email],
            "subject": "[amber] your first step to omniscience", # hard-coded subject for now [DO NOT CHANGE THIS LINE]
            "html": body
        }
        email = resend.Emails.send(params)
        langfuse.update_current_span(metadata={"email_id": email["id"]})
        return SuccessEvent()

    @step
    @observe
    async def handle_success(self, ev: SuccessEvent) -> StopEvent:
        supabase.table("signups").update({"onboarded_at": datetime.now().isoformat()}).eq("email", self.request.email).execute()
        return StopEvent()

    @step
    @observe
    async def handle_failure(self, ev: FailureEvent) -> StopEvent:
        params: resend.Emails.SendParams = {
            "from": "amber <amber@omniscient.fyi>",
            "to": [MAINTENANCE_EMAIL],
            "subject": f"[amber] failed signup for {self.request.email} @ {self.request.school}",
            "html": ev.error,
        }
        resend.Emails.send(params)
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
