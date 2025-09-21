import resend
from dotenv import load_dotenv
import os

load_dotenv()
resend.api_key = os.getenv("RESEND_API_KEY")


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

if __name__ == "__main__":
    send_email()