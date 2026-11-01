"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CircleAlert } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  useWatch,
  type FieldPath,
  type SubmitHandler,
  type UseFormRegister,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  createHostEventPayload,
  HOST_EVENT_AVAILABILITY_LABELS,
  HOST_EVENT_DURATION_LABELS,
  HOST_EVENT_FORMAT_LABELS,
  HOST_EVENT_ORGANIZATION_LABELS,
  HOST_EVENT_ROLE_LABELS,
  HOST_EVENT_TYPE_LABELS,
  HOST_EVENT_VENUE_LABELS,
  hostEventSchema,
  type HostEventInputValues,
  type HostEventValues,
} from "./schema";

const inputClassName =
  "h-11 w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-[#88CC8B] focus-visible:ring-2 focus-visible:ring-[#88CC8B]/40 disabled:cursor-not-allowed disabled:opacity-50";
const textareaClassName =
  "min-h-28 w-full min-w-0 resize-y rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-[#88CC8B] focus-visible:ring-2 focus-visible:ring-[#88CC8B]/40 disabled:cursor-not-allowed disabled:opacity-50";

const STEPS = [
  {
    number: "01",
    label: "About You",
    heading: "Tell us about yourself",
    description: "Share your contact details and your role in the community.",
  },
  {
    number: "02",
    label: "Organization",
    heading: "Who are you representing?",
    description:
      "Tell us about the organization or community that would collaborate with D4.",
  },
  {
    number: "03",
    label: "Venue & Event",
    heading: "Where will we meet?",
    description:
      "Share the venue, event format, and timing you have in mind. Plans can change later.",
  },
  {
    number: "04",
    label: "Collaboration",
    heading: "Let’s shape the idea",
    description:
      "Help us understand the event, audience, and how both sides can contribute.",
  },
  {
    number: "05",
    label: "Review",
    heading: "Review your application",
    description:
      "Check the details and confirm the statements before sending your proposal.",
  },
] as const;

const STEP_FIELDS: FieldPath<HostEventInputValues>[][] = [
  ["fullName", "email", "phone", "role"],
  [
    "organizationType",
    "organizationName",
    "organizationCity",
    "organizationState",
    "organizationCountry",
    "campusName",
    "institutionType",
    "officeName",
    "industry",
    "communityFocus",
    "communityWebsite",
    "organizationTypeOther",
    "organizationWebsite",
  ],
  [
    "venueType",
    "venueName",
    "venueLocation",
    "venueCity",
    "venueState",
    "venueAvailability",
    "eventType",
    "participants",
    "preferredDate",
    "alternativeDate",
    "eventDuration",
    "eventFormat",
  ],
  [
    "collaborationWhy",
    "eventPlan",
    "targetAudience",
    "expectedSupport",
    "availableResources",
    "hasOrganizedEvents",
    "previousEventDetails",
    "additionalRequirements",
  ],
  [],
];

const ROLE_OPTIONS = Object.entries(HOST_EVENT_ROLE_LABELS).map(([value, label]) => ({
  value,
  label,
}));
const ORGANIZATION_OPTIONS = Object.entries(HOST_EVENT_ORGANIZATION_LABELS).map(
  ([value, label]) => ({ value, label }),
);
const VENUE_OPTIONS = Object.entries(HOST_EVENT_VENUE_LABELS).map(([value, label]) => ({
  value,
  label,
}));
const AVAILABILITY_OPTIONS = Object.entries(HOST_EVENT_AVAILABILITY_LABELS).map(
  ([value, label]) => ({ value, label }),
);
const EVENT_DURATION_OPTIONS = Object.entries(HOST_EVENT_DURATION_LABELS).map(
  ([value, label]) => ({ value, label }),
);
const EVENT_FORMAT_OPTIONS = Object.entries(HOST_EVENT_FORMAT_LABELS).map(
  ([value, label]) => ({ value, label }),
);
const EVENT_OPTIONS = Object.entries(HOST_EVENT_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const CONFIRMATIONS = [
  {
    id: "accurate",
    label: "I confirm that the information provided is accurate.",
  },
  {
    id: "contact",
    label:
      "I agree that D4 Community may contact me regarding this collaboration application.",
  },
  {
    id: "noApproval",
    label:
      "I understand that submitting this application does not automatically confirm or approve the proposed event.",
  },
] as const;

const LONG_REVIEW_FIELDS = new Set([
  "Why D4",
  "Event plan",
  "Additional requirements",
  "Previous event details",
]);

type ConfirmationId = (typeof CONFIRMATIONS)[number]["id"];
type FormStatus = { kind: "success" | "error"; message: string } | null;

const DEFAULT_VALUES: HostEventValues = {
  fullName: "",
  email: "",
  phone: "",
  role: "student",
  organizationType: "college-university",
  organizationName: "",
  organizationCity: "",
  organizationState: "",
  organizationCountry: "",
  campusName: "",
  institutionType: "",
  officeName: "",
  industry: "",
  communityFocus: "",
  communityWebsite: "",
  organizationTypeOther: "",
  organizationWebsite: "",
  venueType: "campus",
  venueName: "",
  venueLocation: "",
  venueCity: "",
  venueState: "",
  venueAvailability: "not-sure",
  eventType: "workshop",
  participants: 0,
  preferredDate: "",
  alternativeDate: "",
  eventDuration: "2-4-hours",
  eventFormat: "offline",
  collaborationWhy: "",
  eventPlan: "",
  targetAudience: "",
  expectedSupport: "",
  availableResources: "",
  hasOrganizedEvents: "no",
  previousEventDetails: "",
  additionalRequirements: "",
};

export default function HostEventForm() {
  const reduceMotion = useReducedMotion();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCheckingStep, setIsCheckingStep] = useState(false);
  const [confirmationAttempted, setConfirmationAttempted] = useState(false);
  const [confirmations, setConfirmations] = useState<Record<ConfirmationId, boolean>>({
    accurate: false,
    contact: false,
    noApproval: false,
  });
  const [status, setStatus] = useState<FormStatus>(null);
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    control,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<HostEventInputValues, unknown, HostEventValues>({
    resolver: zodResolver(hostEventSchema),
    mode: "onTouched",
    shouldUnregister: false,
    defaultValues: DEFAULT_VALUES,
  });

  const organizationType = useWatch({ control, name: "organizationType" });
  const venueType = useWatch({ control, name: "venueType" });
  const hasOrganizedEvents = useWatch({ control, name: "hasOrganizedEvents" });
  const serverErrorFields = useRef(new Set<string>());
  const fieldError = (name: FieldPath<HostEventInputValues>) => errors[name]?.message;

  const clearServerFieldError = (name: string) => {
    if (!serverErrorFields.current.has(name)) return;
    serverErrorFields.current.delete(name);
    clearErrors(name as FieldPath<HostEventInputValues>);
  };

  const clearServerFieldErrors = (names: readonly string[]) => {
    names.forEach(clearServerFieldError);
  };

  const isApplicableServerField = (name: string) => {
    if (name === "campusName" || name === "institutionType") {
      return organizationType === "college-university";
    }
    if (name === "officeName" || name === "industry") {
      return organizationType === "company-office";
    }
    if (name === "communityFocus" || name === "communityWebsite") {
      return organizationType === "developer-community";
    }
    if (name === "organizationTypeOther" || name === "organizationWebsite") {
      return organizationType === "student-club" || organizationType === "other";
    }
    if (["venueLocation", "venueCity", "venueState"].includes(name)) {
      return venueType !== "online";
    }
    if (name === "previousEventDetails") return hasOrganizedEvents === "yes";
    return true;
  };

  const goToNextStep = async () => {
    if (isCheckingStep || isSubmitting) return;
    setIsCheckingStep(true);
    setStatus(null);
    try {
      const isStepValid = await trigger(STEP_FIELDS[currentStep]);
      if (isStepValid) setCurrentStep((step) => Math.min(step + 1, STEPS.length - 1));
    } finally {
      setIsCheckingStep(false);
    }
  };

  const onValid: SubmitHandler<HostEventValues> = async (values) => {
    setStatus(null);
    clearServerFieldErrors([...serverErrorFields.current]);

    try {
      const response = await fetch("/api/host-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createHostEventPayload(values)),
      });
      const result: unknown = await response.json().catch(() => null);
      const responseBody =
        typeof result === "object" && result !== null
          ? (result as Record<string, unknown>)
          : {};

      if (!response.ok || responseBody.success !== true) {
        const returnedFieldErrors = response.ok
          ? undefined
          : responseBody.fieldErrors;
        let mappedFieldError = false;
        const mappedStepIndexes: number[] = [];
        if (
          typeof returnedFieldErrors === "object" &&
          returnedFieldErrors !== null &&
          !Array.isArray(returnedFieldErrors)
        ) {
          const knownFields = new Set<string>(STEP_FIELDS.flat());
          for (const [name, message] of Object.entries(returnedFieldErrors)) {
            if (
              !knownFields.has(name) ||
              !isApplicableServerField(name) ||
              typeof message !== "string" ||
              !message.trim()
            ) {
              continue;
            }
            setError(name as FieldPath<HostEventInputValues>, {
              type: "server",
              message: message.slice(0, 300),
            });
            serverErrorFields.current.add(name);
            mappedFieldError = true;
            const stepIndex = STEP_FIELDS.findIndex((fields) =>
              fields.some((field) => field === name),
            );
            if (stepIndex >= 0) mappedStepIndexes.push(stepIndex);
          }
        }

        if (mappedFieldError) {
          setCurrentStep(Math.min(...mappedStepIndexes));
          return;
        }

        throw new Error("Your application could not be sent. Please try again.");
      }

      setStatus({
        kind: "success",
        message:
          (typeof responseBody.message === "string" && responseBody.message) ||
          "Your collaboration application was accepted for delivery.",
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    }
  };

  const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConfirmationAttempted(true);

    if (!Object.values(confirmations).every(Boolean)) {
      setStatus(null);
      return;
    }

    await handleSubmit(onValid)(event);
  };

  const isBusy = isSubmitting || isCheckingStep;
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const hasMissingConfirmation = Object.values(confirmations).some(
    (checked) => !checked,
  );

  return (
    <form
      noValidate
      onSubmit={onFormSubmit}
      onChange={(event) => {
        setStatus(null);
        const target = event.target;
        if (
          !(target instanceof HTMLInputElement) &&
          !(target instanceof HTMLSelectElement) &&
          !(target instanceof HTMLTextAreaElement)
        ) {
          return;
        }
        clearServerFieldError(target.name);

        if (target.name === "organizationType") {
          clearServerFieldErrors([
            "campusName",
            "institutionType",
            "officeName",
            "industry",
            "communityFocus",
            "communityWebsite",
            "organizationTypeOther",
            "organizationWebsite",
          ]);
        } else if (target.name === "venueType" && target.value === "online") {
          clearServerFieldErrors(["venueLocation", "venueCity", "venueState"]);
        } else if (
          target.name === "hasOrganizedEvents" &&
          target.value === "no"
        ) {
          clearServerFieldError("previousEventDetails");
        }
      }}
      className="min-w-0 border-y border-border/80 text-card-foreground"
      aria-describedby="host-event-submit-note"
    >
      <div className="sticky top-24 z-20 border-y border-border/80 bg-background/95 py-3 backdrop-blur">
        <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 sm:gap-5">
          <span className="font-mono text-xs font-medium tabular-nums text-muted-foreground sm:text-sm">
            {STEPS[currentStep].number} <span aria-hidden="true">/</span>{" "}
            {String(STEPS.length).padStart(2, "0")}
          </span>
          <div
            role="progressbar"
            aria-label="Application progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="h-1 w-full overflow-hidden bg-muted"
          >
            <div
              className="h-full bg-[#88CC8B] transition-[width] duration-500 ease-out motion-reduce:transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="max-w-28 truncate text-right font-mono text-[10px] uppercase tracking-wide text-muted-foreground sm:max-w-none sm:text-xs">
            {STEPS[currentStep].label}
          </span>
        </div>
      </div>

      <div className="min-w-0 py-8 sm:py-12">
        <div className="mb-8 max-w-3xl border-b border-border/80 pb-7 sm:mb-10 sm:pb-9">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <span aria-hidden="true" className="mr-2 inline-block size-1.5 bg-[#88CC8B] align-middle" />
            {STEPS[currentStep].number} — {STEPS[currentStep].label}
          </p>
          <h3 className="mt-4 text-3xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-4xl lg:text-6xl">
            {STEPS[currentStep].heading}
          </h3>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {STEPS[currentStep].description}
          </p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentStep}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
            className="grid min-w-0 grid-cols-1 gap-x-6 gap-y-7 lg:grid-cols-2 lg:gap-y-8"
          >
            {currentStep === 0 && (
              <>
                <Field label="Full Name" name="fullName" error={fieldError("fullName")} required>
                  <input
                    id="fullName"
                    required
                    autoComplete="name"
                    className={inputClassName}
                    placeholder="Your full name"
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={errors.fullName ? "fullName-error" : undefined}
                    {...register("fullName")}
                  />
                </Field>
                <Field label="Email Address" name="email" error={fieldError("email")} required>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    className={inputClassName}
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    {...register("email")}
                  />
                </Field>
                <Field label="Phone Number" name="phone" error={fieldError("phone")} required>
                  <input
                    id="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    className={inputClassName}
                    placeholder="Include your country code if needed"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    {...register("phone")}
                  />
                </Field>
                <ChoiceGroup
                  label="Your Role / Designation"
                  name="role"
                  options={ROLE_OPTIONS}
                  register={register}
                  error={fieldError("role")}
                />
              </>
            )}

            {currentStep === 1 && (
              <>
                <div className="min-w-0 lg:col-span-2">
                  <ChoiceGroup
                    label="What best describes your organization?"
                    name="organizationType"
                    options={ORGANIZATION_OPTIONS}
                    register={register}
                    error={fieldError("organizationType")}
                  />
                </div>
                <Field
                  label="Organization / Institution Name"
                  name="organizationName"
                  error={fieldError("organizationName")}
                  required
                >
                  <input
                    id="organizationName"
                    required
                    autoComplete="organization"
                    className={inputClassName}
                    placeholder="Organization or institution name"
                    aria-invalid={Boolean(errors.organizationName)}
                    aria-describedby={errors.organizationName ? "organizationName-error" : undefined}
                    {...register("organizationName")}
                  />
                </Field>
                <Field label="City" name="organizationCity" error={fieldError("organizationCity")} required>
                  <input
                    id="organizationCity"
                    required
                    autoComplete="address-level2"
                    className={inputClassName}
                    placeholder="City"
                    aria-invalid={Boolean(errors.organizationCity)}
                    aria-describedby={errors.organizationCity ? "organizationCity-error" : undefined}
                    {...register("organizationCity")}
                  />
                </Field>
                <Field label="State / Region" name="organizationState" error={fieldError("organizationState")} required>
                  <input
                    id="organizationState"
                    required
                    autoComplete="address-level1"
                    className={inputClassName}
                    placeholder="State or region"
                    aria-invalid={Boolean(errors.organizationState)}
                    aria-describedby={errors.organizationState ? "organizationState-error" : undefined}
                    {...register("organizationState")}
                  />
                </Field>
                <Field label="Country" name="organizationCountry" error={fieldError("organizationCountry")} required>
                  <input
                    id="organizationCountry"
                    required
                    autoComplete="country-name"
                    className={inputClassName}
                    placeholder="Country"
                    aria-invalid={Boolean(errors.organizationCountry)}
                    aria-describedby={errors.organizationCountry ? "organizationCountry-error" : undefined}
                    {...register("organizationCountry")}
                  />
                </Field>
                {organizationType === "college-university" && (
                  <>
                    <OptionalTextField label="Campus Name" name="campusName" register={register} />
                    <OptionalTextField label="Department / Institution Type" name="institutionType" register={register} />
                  </>
                )}
                {organizationType === "company-office" && (
                  <>
                    <OptionalTextField label="Office / Workspace Name" name="officeName" register={register} />
                    <OptionalTextField label="Industry" name="industry" register={register} />
                  </>
                )}
                {organizationType === "developer-community" && (
                  <>
                    <OptionalTextField label="Community Focus / Domain" name="communityFocus" register={register} />
                    <OptionalTextField label="Community Website / Social Link" name="communityWebsite" register={register} type="url" error={fieldError("communityWebsite")} />
                  </>
                )}
                {(organizationType === "student-club" || organizationType === "other") && (
                  <>
                    <OptionalTextField label="Organization Type" name="organizationTypeOther" register={register} />
                    <OptionalTextField label="Website / Social Link" name="organizationWebsite" register={register} type="url" error={fieldError("organizationWebsite")} />
                  </>
                )}
              </>
            )}

            {currentStep === 2 && (
              <>
                <ChoiceGroup label="Venue Type" name="venueType" options={VENUE_OPTIONS} register={register} error={fieldError("venueType")} />
                <OptionalTextField label="Venue Name (optional)" name="venueName" register={register} />
                <Field label="Venue Address / Location" name="venueLocation" error={fieldError("venueLocation")} required={venueType !== "online"}>
                  <input
                    id="venueLocation"
                    required={venueType !== "online"}
                    autoComplete="street-address"
                    className={inputClassName}
                    placeholder={venueType === "online" ? "Optional meeting platform or link" : "Address or location details"}
                    aria-invalid={Boolean(errors.venueLocation)}
                    aria-describedby={errors.venueLocation ? "venueLocation-error" : undefined}
                    {...register("venueLocation")}
                  />
                </Field>
                <Field label="Venue City" name="venueCity" error={fieldError("venueCity")} required={venueType !== "online"}>
                  <input id="venueCity" required={venueType !== "online"} className={inputClassName} placeholder="City" aria-invalid={Boolean(errors.venueCity)} aria-describedby={errors.venueCity ? "venueCity-error" : undefined} {...register("venueCity")} />
                </Field>
                <Field label="Venue State / Region" name="venueState" error={fieldError("venueState")} required={venueType !== "online"}>
                  <input id="venueState" required={venueType !== "online"} className={inputClassName} placeholder="State or region" aria-invalid={Boolean(errors.venueState)} aria-describedby={errors.venueState ? "venueState-error" : undefined} {...register("venueState")} />
                </Field>
                <ChoiceGroup label="Is the venue already available?" name="venueAvailability" options={AVAILABILITY_OPTIONS} register={register} error={fieldError("venueAvailability")} />
                <ChoiceGroup label="Expected Event Type" name="eventType" options={EVENT_OPTIONS} register={register} error={fieldError("eventType")} />
                <Field label="Expected Number of Participants" name="participants" error={fieldError("participants")} required>
                  <input id="participants" type="number" required min={1} max={100000} step={1} inputMode="numeric" className={inputClassName} placeholder="For example, 100" aria-invalid={Boolean(errors.participants)} aria-describedby={errors.participants ? "participants-error" : undefined} {...register("participants", { valueAsNumber: true })} />
                </Field>
                <Field label="Preferred Event Date (optional)" name="preferredDate" error={fieldError("preferredDate")}>
                  <input id="preferredDate" type="date" className={inputClassName} aria-label="Preferred event date, optional" aria-invalid={Boolean(errors.preferredDate)} aria-describedby={errors.preferredDate ? "preferredDate-error" : undefined} {...register("preferredDate")} />
                </Field>
                <Field label="Alternative Event Date (optional)" name="alternativeDate" error={fieldError("alternativeDate")}>
                  <input id="alternativeDate" type="date" className={inputClassName} aria-label="Alternative event date, optional" aria-invalid={Boolean(errors.alternativeDate)} aria-describedby={errors.alternativeDate ? "alternativeDate-error" : undefined} {...register("alternativeDate")} />
                </Field>
                <ChoiceGroup label="Expected Event Duration" name="eventDuration" options={EVENT_DURATION_OPTIONS} register={register} error={fieldError("eventDuration")} />
                <ChoiceGroup label="Event Format" name="eventFormat" options={EVENT_FORMAT_OPTIONS} register={register} error={fieldError("eventFormat")} />
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="min-w-0 lg:col-span-2">
                  <Field label="Why do you want to collaborate with D4?" name="collaborationWhy" error={fieldError("collaborationWhy")} required hint="Please share at least 20 characters.">
                    <textarea id="collaborationWhy" required className={textareaClassName} placeholder="What brings your organization and D4 together?" aria-invalid={Boolean(errors.collaborationWhy)} aria-describedby={errors.collaborationWhy ? "collaborationWhy-error" : "collaborationWhy-hint"} {...register("collaborationWhy")} />
                  </Field>
                </div>
                <div className="min-w-0 lg:col-span-2">
                  <Field label="What kind of event are you planning?" name="eventPlan" error={fieldError("eventPlan")} required>
                    <textarea id="eventPlan" required className={textareaClassName} placeholder="Describe the event you have in mind." aria-invalid={Boolean(errors.eventPlan)} aria-describedby={errors.eventPlan ? "eventPlan-error" : undefined} {...register("eventPlan")} />
                  </Field>
                </div>
                <OptionalTextArea label="What audience do you want to bring together?" name="targetAudience" register={register} />
                <OptionalTextArea label="What support would you expect from D4?" name="expectedSupport" register={register} />
                <OptionalTextArea label="What resources or arrangements can your organization provide?" name="availableResources" register={register} />
                <ChoiceGroup label="Have you organized events before?" name="hasOrganizedEvents" options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]} register={register} error={fieldError("hasOrganizedEvents")} />
                {hasOrganizedEvents === "yes" && <OptionalTextArea label="Previous event details or portfolio link" name="previousEventDetails" register={register} />}
                <div className="min-w-0 lg:col-span-2">
                  <OptionalTextArea label="Additional requirements or information" name="additionalRequirements" register={register} />
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <ApplicationReview values={hostEventSchema.parse(getValues())} />
                <section aria-labelledby="host-event-confirmation-title" className="min-w-0 border-t border-border pt-6 lg:col-span-2">
                  <div className="border border-border/80 bg-muted/20 p-4 sm:p-6">
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Final confirmation</p>
                    <h4 id="host-event-confirmation-title" className="mt-2 text-xl font-bold tracking-tight text-foreground">Before you submit</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">All three statements are required to send your application.</p>
                    {confirmationAttempted && hasMissingConfirmation && (
                      <p id="host-event-confirmation-error" role="alert" className="mt-4 flex items-start gap-2 border border-[#88CC8B]/40 bg-[#88CC8B]/5 px-3 py-2.5 text-sm text-foreground">
                        <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-foreground dark:text-[#88CC8B]" />
                        <span>Check each statement to continue.</span>
                      </p>
                    )}
                    <div className="mt-5 space-y-2.5">
                      {CONFIRMATIONS.map((confirmation) => {
                        const checked = confirmations[confirmation.id];
                        const isMissing = confirmationAttempted && !checked;
                        return (
                          <label key={confirmation.id} className={`flex min-w-0 cursor-pointer items-start gap-3 border px-4 py-3.5 text-sm leading-relaxed text-foreground transition-colors hover:border-foreground/60 hover:bg-[#88CC8B]/5 dark:hover:border-[#88CC8B]/60 has-[:checked]:border-foreground dark:has-[:checked]:border-[#88CC8B] has-[:checked]:bg-[#88CC8B]/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/60 motion-reduce:transition-none ${isMissing ? "border-foreground/40 bg-[#88CC8B]/[0.03] dark:border-[#88CC8B]/50" : "border-border/80 bg-background/50"}`}>
                            <input type="checkbox" checked={checked} onChange={(event) => {
                              const isChecked = event.currentTarget.checked;
                              setConfirmations((previous) => ({ ...previous, [confirmation.id]: isChecked }));
                            }} className="mt-0.5 size-4 shrink-0 accent-[#88CC8B]" aria-invalid={isMissing} aria-describedby={isMissing ? "host-event-confirmation-error" : undefined} />
                            <span className="min-w-0 break-words">{confirmation.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </section>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-border/80 py-5 sm:flex-row sm:items-center sm:justify-between sm:py-6">
        <Button type="button" variant="outline" size="lg" disabled={currentStep === 0 || isBusy} onClick={() => { setStatus(null); setCurrentStep((step) => Math.max(step - 1, 0)); }} className="w-full sm:w-auto">
          Previous
        </Button>
        {currentStep < STEPS.length - 1 ? (
          <Button type="button" size="lg" disabled={isBusy} onClick={goToNextStep} className="w-full sm:w-auto">
            {isCheckingStep ? "Checking details…" : "Continue"}
          </Button>
        ) : (
          <Button type="submit" size="lg" disabled={isBusy} aria-busy={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? "Sending application…" : "Submit application"}
          </Button>
        )}
      </div>

      <div className="pb-5 sm:pb-6">
        <p id="host-event-submit-note" className="text-sm leading-relaxed text-muted-foreground">
          Submitting this form emails your collaboration application to the D4 Community team.
        </p>
        {status && (
          <div role={status.kind === "error" ? "alert" : "status"} className={`mt-4 break-words border px-4 py-3 text-sm ${status.kind === "error" ? "border-destructive/50 bg-destructive/5 text-destructive" : "border-border bg-background text-foreground"}`}>
            {status.message}
          </div>
        )}
      </div>
    </form>
  );
}

function OptionalTextField({
  label,
  name,
  register,
  type = "text",
  error,
}: {
  label: string;
  name: "campusName" | "institutionType" | "officeName" | "industry" | "communityFocus" | "communityWebsite" | "organizationTypeOther" | "organizationWebsite" | "venueName";
  register: UseFormRegister<HostEventInputValues>;
  type?: string;
  error?: string;
}) {
  return (
    <Field label={label} name={name} error={error}>
      <input id={name} type={type} className={inputClassName} placeholder="Optional" aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} {...register(name)} />
    </Field>
  );
}

function OptionalTextArea({
  label,
  name,
  register,
}: {
  label: string;
  name: "targetAudience" | "expectedSupport" | "availableResources" | "previousEventDetails" | "additionalRequirements";
  register: UseFormRegister<HostEventInputValues>;
}) {
  return (
    <div className="min-w-0 lg:col-span-2">
      <Field label={label} name={name}>
        <textarea id={name} className={textareaClassName} placeholder="Optional" {...register(name)} />
      </Field>
    </div>
  );
}

function ChoiceGroup({
  label,
  name,
  options,
  register,
  error,
}: {
  label: string;
  name: "role" | "organizationType" | "venueType" | "venueAvailability" | "eventType" | "eventDuration" | "eventFormat" | "hasOrganizedEvents";
  options: ReadonlyArray<{ value: string; label: string }>;
  register: UseFormRegister<HostEventInputValues>;
  error?: string;
}) {
  const errorId = `${name}-error`;

  return (
    <fieldset className="min-w-0" aria-describedby={error ? errorId : undefined} aria-invalid={Boolean(error)}>
      <legend className="mb-2 block text-sm font-medium text-foreground">
        {label}<span aria-hidden="true" className="ml-1 text-muted-foreground">*</span>
      </legend>
      <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((option, index) => (
          <label key={option.value} className="flex min-h-12 min-w-0 cursor-pointer items-center gap-2.5 border border-border px-3 py-2.5 text-sm text-foreground transition-colors hover:border-foreground/60 hover:bg-[#88CC8B]/5 dark:hover:border-[#88CC8B]/60 has-[:checked]:border-foreground dark:has-[:checked]:border-[#88CC8B] has-[:checked]:bg-[#88CC8B]/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/60 motion-reduce:transition-none">
            <input type="radio" required value={option.value} className="size-4 shrink-0 accent-[#88CC8B]" aria-describedby={error ? errorId : undefined} {...register(name)} />
            <span className="w-6 shrink-0 font-mono text-[10px] text-foreground dark:text-[#88CC8B]" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <span className="min-w-0 break-words font-medium">{option.label}</span>
          </label>
        ))}
      </div>
      {error && <p id={errorId} role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
    </fieldset>
  );
}

function ApplicationReview({ values }: { values: HostEventValues }) {
  const organizationSpecificRows = (() => {
    switch (values.organizationType) {
      case "college-university":
        return [
          ["Campus name", values.campusName],
          ["Department / institution type", values.institutionType],
        ];
      case "company-office":
        return [
          ["Office / workspace", values.officeName],
          ["Industry", values.industry],
        ];
      case "developer-community":
        return [
          ["Community focus", values.communityFocus],
          ["Website / social link", values.communityWebsite],
        ];
      case "student-club":
      case "other":
        return [
          ["Organization type", values.organizationTypeOther],
          ["Website / social link", values.organizationWebsite],
        ];
    }
  })();

  const groups = [
    {
      title: "Applicant",
      fields: [
        ["Full name", values.fullName],
        ["Email", values.email],
        ["Phone", values.phone],
        ["Role", HOST_EVENT_ROLE_LABELS[values.role]],
      ],
    },
    {
      title: "Organization",
      fields: [
        ["Organization type", HOST_EVENT_ORGANIZATION_LABELS[values.organizationType]],
        ["Organization name", values.organizationName],
        ["Location", [values.organizationCity, values.organizationState, values.organizationCountry].filter(Boolean).join(", ")],
        ...organizationSpecificRows,
      ],
    },
    {
      title: "Venue & event",
      fields: [
        ["Venue type", HOST_EVENT_VENUE_LABELS[values.venueType]],
        ["Venue name", values.venueName],
        ["Venue location", [values.venueLocation, values.venueCity, values.venueState].filter(Boolean).join(", ")],
        ["Venue available", HOST_EVENT_AVAILABILITY_LABELS[values.venueAvailability]],
        ["Event type", HOST_EVENT_TYPE_LABELS[values.eventType]],
        ["Participants", String(values.participants)],
        ["Preferred date", values.preferredDate || "Not provided"],
        ["Alternative date", values.alternativeDate || "Not provided"],
        ["Duration", HOST_EVENT_DURATION_LABELS[values.eventDuration]],
        ["Format", HOST_EVENT_FORMAT_LABELS[values.eventFormat]],
      ],
    },
    {
      title: "Collaboration",
      fields: [
        ["Why D4", values.collaborationWhy],
        ["Event plan", values.eventPlan],
        ["Audience", values.targetAudience || "Not provided"],
        ["Expected D4 support", values.expectedSupport || "Not provided"],
        ["Available resources", values.availableResources || "Not provided"],
        ["Organized events before", values.hasOrganizedEvents === "yes" ? "Yes" : "No"],
        ...(values.hasOrganizedEvents === "yes" ? [["Previous event details", values.previousEventDetails || "Not provided"]] : []),
        ["Additional requirements", values.additionalRequirements || "Not provided"],
      ],
    },
  ];

  return (
    <section aria-label="Application summary" className="min-w-0 lg:col-span-2">
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        Review the details D4 will receive. Use Previous to make any changes.
      </p>
      <div className="divide-y divide-border border-y border-border/80">
        {groups.map((group, index) => (
          <section key={group.title} aria-labelledby={`application-review-${index}`} className="py-5 first:pt-0 last:pb-0 sm:py-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-xs font-semibold text-foreground dark:text-[#88CC8B]">{String(index + 1).padStart(2, "0")}</span>
              <h4 id={`application-review-${index}`} className="text-sm font-semibold uppercase tracking-[0.12em] text-foreground">{group.title}</h4>
            </div>
            <dl className="grid min-w-0 grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.fields.map(([label, value]) => (
                <div key={label} className={`min-w-0 ${LONG_REVIEW_FIELDS.has(label) ? "sm:col-span-2 lg:col-span-3" : ""}`}>
                  <dt className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">{label}</dt>
                  <dd className={`mt-1.5 min-w-0 break-words text-sm leading-relaxed text-foreground ${LONG_REVIEW_FIELDS.has(label) ? "whitespace-pre-wrap border-l-2 border-[#88CC8B]/60 pl-3" : ""}`}>
                    {value || "Not provided"}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  error,
  required = false,
  hint,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;

  return (
    <div className="min-w-0 space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span aria-hidden="true" className="ml-1 text-muted-foreground">*</span>}
      </label>
      {children}
      {hint && !error && <p id={hintId} className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p id={errorId} role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
