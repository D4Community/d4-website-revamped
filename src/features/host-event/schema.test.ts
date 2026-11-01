import assert from "node:assert/strict";
import test from "node:test";
import {
  createHostEventPayload,
  hostEventSchema,
  type HostEventInputValues,
} from "./schema";

const validInput: HostEventInputValues = {
  fullName: "Alex Example",
  email: "alex@example.org",
  phone: "+1 555 555 0123",
  role: "community-organizer",
  organizationType: "developer-community",
  organizationName: "Example Devs",
  organizationCity: "Toronto",
  organizationState: "Ontario",
  organizationCountry: "Canada",
  campusName: "Old campus value",
  institutionType: "Old department value",
  officeName: "Old office value",
  industry: "Old industry value",
  communityFocus: "Open source",
  communityWebsite: "example.org/community",
  organizationTypeOther: "Old organization type",
  organizationWebsite: "javascript:alert(1)",
  venueType: "community-venue",
  venueName: "Community Hall",
  venueLocation: "10 Main Street",
  venueCity: "Toronto",
  venueState: "Ontario",
  venueAvailability: "yes",
  eventType: "hackathon",
  participants: 80,
  preferredDate: "2027-04-15",
  alternativeDate: "",
  eventDuration: "full-day",
  eventFormat: "hybrid",
  collaborationWhy: "We want to build a stronger local developer community together.",
  eventPlan: "A day of talks, workshops, and a collaborative project sprint.",
  targetAudience: "Local developers and students",
  expectedSupport: "Speakers and event promotion",
  availableResources: "Venue, internet, and volunteer support",
  hasOrganizedEvents: "yes",
  previousEventDetails: "We hosted two community meetups last year.",
  additionalRequirements: "Please contact us before publishing the date.",
};

test("accepts a complete cross-organization application and keeps existing event types", () => {
  const result = hostEventSchema.safeParse(validInput);
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.eventType, "hackathon");
    assert.equal(result.data.organizationType, "developer-community");
  }
});

test("rejects unknown organization and event types", () => {
  assert.equal(hostEventSchema.safeParse({ ...validInput, organizationType: "agency" }).success, false);
  assert.equal(hostEventSchema.safeParse({ ...validInput, eventType: "conference" }).success, false);
});

test("requires a physical venue location only for in-person venues", () => {
  const physicalVenue = {
    ...validInput,
    venueType: "office-space",
    venueLocation: "",
    venueCity: "",
    venueState: "",
  };
  const errors = hostEventSchema.safeParse(physicalVenue);
  assert.equal(errors.success, false);
  if (!errors.success) {
    assert.ok(errors.error.issues.some((issue) => issue.path[0] === "venueLocation"));
    assert.ok(errors.error.issues.some((issue) => issue.path[0] === "venueCity"));
    assert.ok(errors.error.issues.some((issue) => issue.path[0] === "venueState"));
  }

  const online = hostEventSchema.safeParse({
    ...validInput,
    venueType: "online",
    venueLocation: "",
    venueCity: "",
    venueState: "",
  });
  assert.equal(online.success, true);
});

test("validates only active organization-specific fields", () => {
  const activeInvalidLink = hostEventSchema.safeParse({
    ...validInput,
    organizationType: "developer-community",
    communityWebsite: "javascript:alert(1)",
  });
  assert.equal(activeInvalidLink.success, false);

  const inactiveInvalidLink = hostEventSchema.safeParse({
    ...validInput,
    organizationType: "college-university",
    organizationWebsite: "javascript:alert(1)",
  });
  assert.equal(inactiveInvalidLink.success, true);

  const inactiveLongField = hostEventSchema.safeParse({
    ...validInput,
    organizationType: "college-university",
    officeName: "x".repeat(500),
  });
  assert.equal(inactiveLongField.success, true);

  const activeLongField = hostEventSchema.safeParse({
    ...validInput,
    organizationType: "college-university",
    campusName: "x".repeat(161),
  });
  assert.equal(activeLongField.success, false);
});

test("omits values that become inapplicable without mutating the form values", () => {
  const values = hostEventSchema.parse({
    ...validInput,
    organizationType: "company-office",
    venueType: "online",
    venueCity: "Toronto",
    venueState: "Ontario",
    hasOrganizedEvents: "no",
    campusName: "Keep this in form state",
    previousEventDetails: "Keep this in form state too",
  });
  const payload = createHostEventPayload(values);

  assert.equal(payload.campusName, "");
  assert.equal(payload.venueCity, "Toronto");
  assert.equal(payload.venueState, "Ontario");
  assert.equal(payload.previousEventDetails, "");
  assert.equal(values.campusName, "Keep this in form state");
  assert.equal(values.previousEventDetails, "Keep this in form state too");
});

test("rejects malformed calendar dates, invalid emails, and unreasonable participant counts", () => {
  assert.equal(hostEventSchema.safeParse({ ...validInput, preferredDate: "2027-02-30" }).success, false);
  assert.equal(hostEventSchema.safeParse({ ...validInput, email: "not-an-email" }).success, false);
  assert.equal(hostEventSchema.safeParse({ ...validInput, participants: 100001 }).success, false);
});
