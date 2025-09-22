from llama_index.core.prompts import ChatMessage, ChatPromptTemplate
from llama_index.llms.openai import OpenAI
from pydantic import BaseModel
import resend
from dotenv import load_dotenv
import os
import requests

load_dotenv()
resend.api_key = os.getenv("RESEND_API_KEY")

RAI_API_KEY = os.getenv("RAI_API_KEY")
RAI_REGION = os.getenv("RAI_REGION")
RAI_PROJECT = os.getenv("RAI_PROJECT")
RAI_LINKEDIN_TOOL_ID = "2563f44e-fbd6-40f2-8761-dfefe874abba"

class Email(BaseModel):
    subject: str
    body: str

def send_email():
    params: resend.Emails.SendParams = {
        "from": "amber <amber@omniscient.fyi>",
        "to": ["chrisyoo@college.harvard.edu"],
        "subject": "[amber] your first step to omniscience",
        "html": f"""
hey chris,
<br>
<br>
i'm amber, your ai opportunity scout.
<br>
i'm subscribed to the mailing lists & calendars for <b>548 clubs and 386 institutes at harvard</b> + events all across boston.
<br>
<br>
<i>blahblah<br>blahblah<br>blahblah</i>
<br>
<br>
look forward to bring you the best opportunities based on your interests.
<br>
<br>
live without fomo - be omniscient,
<br>
amber
<br>
""",
    }
    resend.Emails.send(params)

def compose_email():
    llm = OpenAI(model="gpt-5-mini")
    linkedin_url = input("LinkedIn URL: ")
    
    # scrape linkedin
    if linkedin_url:
        print("Scraping LinkedIn profile...")
        url = f"https://api-{RAI_REGION}.stack.tryrelevance.com/latest/studios/{RAI_LINKEDIN_TOOL_ID}/trigger_limited"
        headers = {
            "Authorization": f"{RAI_PROJECT}:{RAI_API_KEY}"
        }
        body = {
            "params": {
                "url": linkedin_url,
            },
            "project": RAI_PROJECT,
        }
        response = requests.post(url, headers=headers, json=body)
        if response.status_code != 200:
            raise Exception(f"Failed to scrape LinkedIn profile: status code {response.status_code}")
        result = response.json()
        if len(result.get("errors", [])) > 0:
            raise Exception(f"Failed to scrape LinkedIn profile: {result.get("errors")}")
        profile = result["output"]["linkedin_profile"]
    else:
        first_name = input("First name: ")
        about = input("About: ")
        profile = {
            "first_name": first_name,
            "about": about,
        }

    if linkedin_url or about:
        print("Composing email...")
        first_name = profile["first_name"]
        email: Email = llm.structured_predict(
            output_cls=Email,
            prompt=ChatPromptTemplate([
                ChatMessage(role="system", content="""
You are Amber, a personal opportunity scout.
Your task is to write a subject and 3-line body for a first email to {first_name}, a student at {school}.
I have already scraped their LinkedIn profile, which will be provided to you.

Make clever references to the LinkedIn profile so that the recipient feels like you know them personally. But don't copy-paste phrases directly - they shouldn't know that you took it from the LinkedIn profile.
Use an informal tone. Be nonchalant and assertive but not overly pushy nor disrespectful.
Always use lowercase for everything. Never use uppercase.
Never use the em dash, use a normal dash instead.
Write the subject and the 3-line body for the email. Do not leave any placeholders.

Your subject must be a single line (all lowercase) following this format: `[amber] <subject>`
The subject should be a catchy single line or question that shows you know a specific core fact of the recipient, e.g. `[amber] suffering in stats courses?`, `[amber] that research on the world bank going good?`

The body must be 3 brief lines talking about what the recipient seems to be interested in.
The purpose of this is just to inject a sense of familiarity and personalization for the recipient.
Make it sound engaging, natural and human (not just rattling off facts).
DO NOT include any address (e.g. "dear xxx"), salutation or closing. I just need 3 short lines.

Example body:
```
wow, looks like you got a big passion for ai and startups.
you know what paul graham says: "live in the future and build what's missing" - seems you're already doing that.
i can see that you're into biotech too, doing research at the harvard wyss institute - that's awesome!
```

DO NOT PROMISE, ASK, OR SUGGEST TO DO ANYTHING.
Bad example #1: "i'll be sure to let you know of club events that you might be interested in"
Bad example #2: "want curated jobs or research opportunities while you're here?"
    """),
                    ChatMessage(role="user", content="""
Here is information about the recipient's LinkedIn profile:
```
{profile}
```
"""),
            ]),
            first_name=first_name.lower(),
            school="harvard",
            profile=profile,
        )

        body = f"""
hey {first_name.lower()},

i'm amber, your ai opportunity scout.
i'm subscribed to the mailing lists & calendars of <b>548 clubs and 386 institutes at harvard</b> + events all across boston.

<i>{email.body.lower()}</i>

look forward to scouting out the best opportunities just for you.

live without fomo - be omniscient,
amber

p.s. you can reply to this email and tell me what you're interested in.
"""
    else:
        body = f"""
hey {first_name.lower()},

i'm amber, your ai opportunity scout.
i'm subscribed to the mailing lists & calendars of <b>548 clubs and 386 institutes at harvard</b> + events all across boston.

look forward to scouting out the best opportunities just for you.

live without fomo - be omniscient,
amber

p.s. you can reply to this email and tell me what you're interested in.
"""
    body = body.replace('\n', '<br>').replace('—', '-')
    print(body)

    address = input("Email address to send to: ")
    looks_good = input("Should I send this email? (y/n) ")
    if looks_good != "y":
        return
    
    params: resend.Emails.SendParams = {
        "from": "amber <amber@omniscient.fyi>",
        "to": [address],
        "subject": "[amber] your first step to omniscience", # hard-coded subject for now [DO NOT CHANGE THIS LINE]
        "html": body
    }
    resend.Emails.send(params)
    print("Email sent!")

if __name__ == "__main__":
    # send_email()
    compose_email()