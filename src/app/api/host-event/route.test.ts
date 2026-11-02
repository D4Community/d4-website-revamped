import assert from "node:assert/strict";
import test from "node:test";
import type Mail from "nodemailer/lib/mailer";
import {
  createEmailHtml,
  createEmailText,
} from "../../../features/host-event/email";
import { createHostEventPostHandler } from "../../../features/host-event/handler";
import { hostEventSchema, type HostEventInputValues } from "../../../features/host-event/schema";

const validInput: HostEventInputValues = {
  fullName: "Alex <script>alert(1)</script>",
  email: "alex@example.org",
  phone: "+1 555 555 0123",
  role: "company-representative",
  organizationType: "company-office",
  organizationName: "Example & Co",
  organizationCity: "Austin",
  organizationState: "Texas",
  organizationCountry: "United States",
  campusName: "",
  institutionType: "",
  officeName: "Downtown office",
  industry: "Technology",
  communityFocus: "",
  communityWebsite: "",
  organizationTypeOther: "",
  organizationWebsite: "",
  venueType: "office-space",
  venueName: "Example HQ",
  venueLocation: "100 Congress Avenue",
  venueCity: "Austin",
  venueState: "Texas",
  venueAvailability: "yes",
  eventType: "tech-talk",
  participants: 120,
  preferredDate: "2027-05-12",
  alternativeDate: "",
  eventDuration: "half-day",
  eventFormat: "hybrid",
  collaborationWhy: "We would like to connect local engineers and share practical knowledge.",
  eventPlan: "A half-day of engineering talks followed by an open networking session.",
  targetAudience: "Local engineers and students",
  expectedSupport: "Speaker coordination and event promotion",
  availableResources: "Venue, Wi-Fi, and refreshments",
  hasOrganizedEvents: "yes",
  previousEventDetails: "We hosted a local engineering meetup last summer.",
  additionalRequirements: "Please coordinate the date with our office manager.",
};

const validApplication = () => hostEventSchema.parse(validInput);
const originalEmailConfig = {
  user: process.env.GMAIL_USER,
  pass: process.env.GMAIL_PASS,
};

function setTestEmailConfig() {
  process.env.GMAIL_USER = "d4-test@example.org";
  process.env.GMAIL_PASS = "test-only-not-a-real-secret";
}

function restoreEmailConfig() {
  if (originalEmailConfig.user === undefined) delete process.env.GMAIL_USER;
  else process.env.GMAIL_USER = originalEmailConfig.user;
  if (originalEmailConfig.pass === undefined) delete process.env.GMAIL_PASS;
  else process.env.GMAIL_PASS = originalEmailConfig.pass;
}

function createRequest(body: string, headers: Record<string, string> = {}) {
  return new Request(new URL("https://host-event.test/api/host-event"), {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body,
  });
}

test("builds text and escaped HTML emails with all collaboration sections", () => {
  const application = validApplication();
  const text = createEmailText(application);
  const html = createEmailHtml(application);

  assert.match(text, /1\. Applicant Details/);
  assert.match(text, /2\. Organization Details/);
  assert.match(text, /3\. Venue & Event Details/);
  assert.match(text, /4\. Collaboration Proposal/);
  assert.match(text, /5\. Additional Information/);
  assert.match(html, /Example &amp; Co/);
  assert.match(html, /Alex &lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/);
  assert.match(html, /Previous event details/);
});

test("rejects invalid payloads without invoking the mocked mail sender", async () => {
  let senderCreated = false;
  const post = createHostEventPostHandler(() => {
    senderCreated = true;
    return async () => ({ accepted: [] });
  });

  const response = await post(createRequest(JSON.stringify({ ...validInput, eventType: "unknown" })));
  assert.equal(response.status, 400);
  assert.equal(senderCreated, false);
});

test("sends to the configured fixed TO and CC recipients and reports accepted delivery", async () => {
  setTestEmailConfig();
  try {
    let captured: Mail.Options | undefined;
    const post = createHostEventPostHandler(() => async (message) => {
      captured = message;
      return {
        accepted: ["help.d4community@gmail.com", { address: "management.d4community@gmail.com" }],
      };
    });

    const response = await post(createRequest(JSON.stringify(validInput)));
    const result = await response.json();
    assert.equal(response.status, 200);
    assert.equal(captured?.to, "help.d4community@gmail.com");
    assert.equal(captured?.cc, "management.d4community@gmail.com");
    assert.equal(captured?.subject, "New D4 Event Collaboration Application");
    assert.equal(result.success, true);
  } finally {
    restoreEmailConfig();
  }
});

test("reports partial recipient acceptance as a delivery failure", async () => {
  setTestEmailConfig();
  try {
    const post = createHostEventPostHandler(() => async () => ({
      accepted: ["help.d4community@gmail.com"],
    }));
    const response = await post(createRequest(JSON.stringify(validInput)));
    assert.equal(response.status, 502);
    assert.match((await response.json()).error, /all recipients/);
  } finally {
    restoreEmailConfig();
  }
});

test("reports transport failures without exposing provider details", async () => {
  setTestEmailConfig();
  try {
    const post = createHostEventPostHandler(() => async () => {
      throw new Error("private SMTP diagnostic");
    });
    const response = await post(createRequest(JSON.stringify(validInput)));
    const result = await response.json();
    assert.equal(response.status, 502);
    assert.doesNotMatch(JSON.stringify(result), /private SMTP diagnostic/);
  } finally {
    restoreEmailConfig();
  }
});

test("handles malformed JSON, unsupported content types, and oversized bodies", async () => {
  const post = createHostEventPostHandler();
  assert.equal((await post(createRequest("{"))).status, 400);
  assert.equal((await post(createRequest("{}", { "content-type": "text/plain" }))).status, 415);
  assert.equal((await post(createRequest("x".repeat(33 * 1024)))).status, 413);
});
