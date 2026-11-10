"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Copy, ArrowLeft, ArrowRight } from "lucide-react";
import { useForm, useWatch, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  eventHostingRequestSchema,
  AUDIENCES,
  COUNTRIES,
  EVENT_TYPES,
  FACILITY_STATUSES,
  INDIAN_STATES,
  INSTITUTION_TYPES,
  PHONE_CODES,
  ROLES,
  TIMELINES,
  VENUE_SPACES,
} from "@/lib/validations/event-hosting-request";
import type { EventHostingRequest } from "@/types/event-hosting";

const steps = [
  "About you",
  "Your institution",
  "Event proposal",
  "Venue and infrastructure",
  "Experience and extras",
  "Review",
];
const descriptions = [
  "Share your contact details so the D4 team can follow up if there is a fit.",
  "Tell us about the campus or organization where you would like to host.",
  "Give us a clear picture of the event you have in mind.",
  "Let us know what space and equipment may be available.",
  "Share any relevant experience and anything else we should know.",
  "Check your answers and send your expression of interest.",
];
const paths: string[][] = [
  [
    "about.fullName",
    "about.email",
    "about.phoneCountryCode",
    "about.phoneNumber",
    "about.role",
    "about.roleOther",
  ],
  [
    "institution.institutionType",
    "institution.institutionTypeOther",
    "institution.institutionName",
    "institution.department",
    "institution.city",
    "institution.state",
    "institution.country",
    "institution.website",
  ],
  [
    "event.eventTypes",
    "event.eventTypeOther",
    "event.eventTitle",
    "event.expectedAudience",
    "event.expectedCapacity",
    "event.preferredDate",
    "event.timeline",
    "event.description",
  ],
  [
    "venue.venueNotFinalised",
    "venue.preferredVenue",
    "venue.spaces",
    "venue.seatingCapacity",
    "venue.facilities.projector",
    "venue.facilities.audio",
    "venue.facilities.wifi",
    "venue.facilities.power",
    "venue.otherInfrastructure",
    "venue.venueNotes",
    "venue.needsFromD4",
  ],
  [
    "experience.hostedBefore",
    "experience.pastEventTypes",
    "experience.pastAttendance",
    "experience.pastDetails",
    "experience.collaboratedBefore",
    "experience.collaboratedWith",
    "additional.additionalRequirements",
    "additional.specialRequests",
    "additional.anythingElse",
  ],
  ["consent"],
];
const labels: Record<string, string> = {
  "about.fullName": "Full name",
  "about.email": "Email address",
  "about.phoneNumber": "Phone number",
  "about.role": "Your role",
  "about.roleOther": "Please specify your role",
  "institution.institutionType": "Institution type",
  "institution.institutionTypeOther": "Please specify the institution type",
  "institution.institutionName": "Institution name",
  "institution.department": "Department / Branch",
  "institution.city": "City",
  "institution.state": "State / region",
  "institution.country": "Country",
  "institution.website": "Website",
  "event.eventTypes": "Event types",
  "event.eventTypeOther": "Please specify the event type",
  "event.eventTitle": "Event title",
  "event.expectedAudience": "Expected audience",
  "event.expectedCapacity": "Expected audience size",
  "event.preferredDate": "Preferred date",
  "event.timeline": "Ideal timeline",
  "event.description": "Tell us about your proposal",
  "venue.venueNotFinalised": "Venue is not finalised yet",
  "venue.preferredVenue": "Preferred venue",
  "venue.spaces": "Available spaces",
  "venue.seatingCapacity": "Seating capacity",
  "venue.otherInfrastructure": "Other infrastructure",
  "venue.venueNotes": "Venue notes and limitations",
  "venue.needsFromD4": "What support would you need from D4?",
  "experience.pastEventTypes": "What kinds of events have you organised?",
  "experience.pastAttendance": "Approximate past attendance",
  "experience.pastDetails": "Tell us about your experience",
  "experience.collaboratedWith":
    "Which communities have you collaborated with?",
  "additional.additionalRequirements": "Additional requirements",
  "additional.specialRequests": "Special requests",
  "additional.anythingElse": "Anything else to share?",
};
const required = new Set([
  "about.fullName",
  "about.email",
  "about.phoneNumber",
  "about.role",
  "institution.institutionType",
  "institution.institutionName",
  "institution.city",
  "institution.state",
  "institution.country",
  "event.eventTypes",
  "event.expectedAudience",
  "event.expectedCapacity",
  "event.timeline",
  "event.description",
  "consent",
]);
const inputClass =
  "h-12 w-full border-2 border-border bg-background px-3 text-foreground hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const hardButton =
  "h-12 rounded-none border-2 border-foreground shadow-[4px_4px_0_var(--border)] transition-[transform,box-shadow] duration-[120ms] hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none motion-reduce:transition-none";
const keyFor = () => crypto.randomUUID();
const prettyFacility: Record<string, string> = {
  available: "Available",
  partial: "Partial",
  unavailable: "Not available",
  unsure: "Not sure",
};

function newFormValues(): EventHostingRequest {
  return {
    about: {
      fullName: "",
      email: "",
      phoneCountryCode: "+91",
      phoneNumber: "",
      role: "",
      roleOther: "",
    },
    institution: {
      institutionType: "",
      institutionTypeOther: "",
      institutionName: "",
      city: "",
      state: "",
      country: "",
      website: "",
      department: "",
    },
    event: {
      eventTypes: [],
      eventTypeOther: "",
      expectedAudience: [],
      expectedCapacity: undefined as unknown as number,
      preferredDate: "",
      timeline: "",
      eventTitle: "",
      description: "",
    },
    venue: {
      venueNotFinalised: false,
      preferredVenue: "",
      spaces: [],
      seatingCapacity: undefined,
      facilities: {},
      otherInfrastructure: "",
      venueNotes: "",
      needsFromD4: "",
    },
    experience: {
      hostedBefore: undefined,
      pastEventTypes: "",
      pastAttendance: undefined,
      pastDetails: "",
      collaboratedBefore: undefined,
      collaboratedWith: "",
    },
    additional: {
      additionalRequirements: "",
      specialRequests: "",
      anythingElse: "",
    },
    consent: false as true,
    idempotencyKey: "",
    startedAt: 0,
    honeypot: "",
  };
}

type Notice = {
  kind: "network" | "server" | "rate" | "duplicate";
  message: string;
} | null;

export function HostEventForm() {
  const {
    control,
    setValue,
    getValues,
    trigger,
    handleSubmit,
    setError,
    getFieldState,
    register,
    formState: { errors },
  } = useForm<EventHostingRequest>({
    resolver: zodResolver(eventHostingRequestSchema) as never,
    mode: "onTouched",
    defaultValues: newFormValues(),
  });
  const [step, setStep] = useState(0);
  const [referenceId, setReferenceId] = useState("");
  const [succeeded, setSucceeded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const watched = useWatch({ control });
  const values = getValues();
  const anyFacilityNeed = ["projector", "audio", "wifi", "power"].some((key) =>
    ["partial", "unavailable"].includes(
      String(
        watched.venue?.facilities?.[
          key as keyof NonNullable<typeof watched.venue.facilities>
        ],
      ),
    ),
  );
  const customCountry = String(watched.institution?.country || "");
  const isCustomCountry =
    customCountry === "Other" ||
    (!!customCountry &&
      !COUNTRIES.includes(customCountry as (typeof COUNTRIES)[number]));
  const flatErrors = useMemo(() => {
    const found: { path: string; message: string }[] = [];
    const walk = (object: Record<string, unknown>, prefix = "") => {
      for (const [key, value] of Object.entries(object)) {
        const path = prefix ? `${prefix}.${key}` : key;
        if (
          value &&
          typeof value === "object" &&
          "message" in value &&
          typeof value.message === "string"
        )
          found.push({ path, message: value.message });
        else if (value && typeof value === "object")
          walk(value as Record<string, unknown>, path);
      }
    };
    walk(errors as Record<string, unknown>);
    return found;
  }, [errors]);

  useEffect(() => {
    if (!getValues("idempotencyKey")) setValue("idempotencyKey", keyFor());
    if (!getValues("startedAt")) setValue("startedAt", Date.now());
  }, [getValues, setValue]);
  useEffect(() => {
    heading.current?.focus();
  }, [step]);
  useEffect(() => {
    const country = watched.institution?.country || "";
    const state = watched.institution?.state || "";
    const isIndianState = INDIAN_STATES.includes(
      state as (typeof INDIAN_STATES)[number],
    );
    if (
      state &&
      ((country === "India" && !isIndianState) ||
        (country !== "India" && isIndianState))
    ) {
      setValue("institution.state", "");
    }
  }, [watched.institution?.country, watched.institution?.state, setValue]);
  const venueNotFinalised = watched.venue?.venueNotFinalised ?? false;
  const facilityStatuses = watched.venue?.facilities;
  const needsSupport = [
    facilityStatuses?.projector,
    facilityStatuses?.audio,
    facilityStatuses?.wifi,
    facilityStatuses?.power,
  ].some((status) => status === "partial" || status === "unavailable");
  useEffect(() => {
    if (venueNotFinalised) setValue("venue.preferredVenue", "");
    if (!needsSupport) setValue("venue.needsFromD4", "");
  }, [
    venueNotFinalised,
    facilityStatuses?.projector,
    facilityStatuses?.audio,
    facilityStatuses?.wifi,
    facilityStatuses?.power,
    needsSupport,
    setValue,
  ]);
  useEffect(() => {
    if (watched.about?.role !== "Other") setValue("about.roleOther", "");
  }, [watched.about?.role, setValue]);
  useEffect(() => {
    if (watched.institution?.institutionType !== "Other")
      setValue("institution.institutionTypeOther", "");
  }, [watched.institution?.institutionType, setValue]);
  useEffect(() => {
    if (!watched.event?.eventTypes?.includes("Other"))
      setValue("event.eventTypeOther", "");
  }, [watched.event?.eventTypes, setValue]);
  useEffect(() => {
    if (watched.experience?.hostedBefore !== true) {
      setValue("experience.pastEventTypes", "");
      setValue("experience.pastAttendance", undefined);
      setValue("experience.pastDetails", "");
    }
    if (watched.experience?.collaboratedBefore !== true)
      setValue("experience.collaboratedWith", "");
  }, [
    watched.experience?.hostedBefore,
    watched.experience?.collaboratedBefore,
    setValue,
  ]);

  const setStepAndClear = (target: number) => {
    setNotice(null);
    setSummaryVisible(false);
    setStep(target);
  };
  const next = async () => {
    const valid = await trigger(
      paths[step] as FieldPath<EventHostingRequest>[],
      { shouldFocus: true },
    );
    if (valid) setStepAndClear(Math.min(5, step + 1));
    else setSummaryVisible(true);
  };
  const back = () => setStepAndClear(Math.max(0, step - 1));
  const firstError = (
    items: Record<string, unknown>,
    prefix = "",
  ): string | undefined => {
    for (const [key, value] of Object.entries(items)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === "object" && "message" in value) return path;
      if (value && typeof value === "object") {
        const nested = firstError(value as Record<string, unknown>, path);
        if (nested) return nested;
      }
    }
  };
  const send = handleSubmit(
    async (data) => {
      setSubmitting(true);
      setNotice(null);
      setSummaryVisible(false);
      const payload = structuredClone(data) as EventHostingRequest;
      if (payload.about.role !== "Other") delete payload.about.roleOther;
      if (payload.institution.institutionType !== "Other")
        delete payload.institution.institutionTypeOther;
      if (!payload.event.eventTypes.includes("Other"))
        delete payload.event.eventTypeOther;
      if (payload.venue.venueNotFinalised) delete payload.venue.preferredVenue;
      if (!anyFacilityNeed) delete payload.venue.needsFromD4;
      if (payload.experience.hostedBefore !== true) {
        delete payload.experience.pastEventTypes;
        delete payload.experience.pastAttendance;
        delete payload.experience.pastDetails;
      }
      if (payload.experience.collaboratedBefore !== true)
        delete payload.experience.collaboratedWith;
      try {
        const response = await fetch("/api/host-an-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const body = await response.json();
        if (body.ok === true) {
          setValue("idempotencyKey", keyFor());
          setReferenceId(body.referenceId || "");
          setSucceeded(true);
        } else if (body.code === "VALIDATION") {
          const serverErrors = Object.entries(body.fieldErrors || {}) as [
            string,
            string[],
          ][];
          for (const [path, messages] of serverErrors)
            setError(path as FieldPath<EventHostingRequest>, {
              message: messages[0],
            });
          setSummaryVisible(true);
          const path = serverErrors[0]?.[0];
          if (path) {
            const pathStep = paths.findIndex((group) =>
              group.some(
                (item) => item === path || path.startsWith(`${item}.`),
              ),
            );
            if (pathStep >= 0) {
              setStep(pathStep);
              window.setTimeout(() => focusField(path), 0);
            }
          }
        } else if (body.code === "RATE_LIMIT")
          setNotice({
            kind: "rate",
            message:
              "You have reached the request limit. Please wait about an hour, then try sending again.",
          });
        else if (body.code === "DUPLICATE")
          setNotice({
            kind: "duplicate",
            message: `We already received this request${body.referenceId ? ` (reference ${body.referenceId})` : ""}. If you have changed your proposal, edit your answers and try again.`,
          });
        else if (body.code === "TOO_FAST")
          setNotice({
            kind: "server",
            message:
              "Please take a moment to review your answers, then try again.",
          });
        else
          setNotice({
            kind: "server",
            message:
              "We could not send your request right now. Your answers are saved in this form; try again shortly.",
          });
      } catch {
        setNotice({
          kind: "network",
          message:
            "We could not reach the server. Check your connection, then try again. Your answers are still here.",
        });
      } finally {
        setSubmitting(false);
      }
    },
    (invalidErrors) => {
      setSummaryVisible(true);
      const path = firstError(invalidErrors as Record<string, unknown>);
      if (path) {
        const pathStep = paths.findIndex((group) =>
          group.some((item) => item === path || path.startsWith(`${item}.`)),
        );
        if (pathStep >= 0 && pathStep !== step) setStep(pathStep);
        window.setTimeout(
          () => document.getElementById(path.replaceAll(".", "-"))?.focus(),
          0,
        );
      }
    },
  );
  const getWatchedValue = (path: string): unknown => {
    let value: unknown = watched;
    for (const segment of path.split(".")) {
      if (value === null || typeof value !== "object") return undefined;
      value = (value as Record<string, unknown>)[segment];
    }
    return value;
  };

  const fieldError = (path: string) =>
    getFieldState(path as FieldPath<EventHostingRequest>).error?.message;
  const focusField = (path: string) => {
    const target = document.getElementById(path.replaceAll(".", "-"));
    target?.focus();
  };

  const field = (
    path: string,
    options: {
      type?: string;
      options?: readonly string[];
      optional?: boolean;
      hint?: string;
      placeholder?: string;
      textarea?: boolean;
      maxLength?: number;
    } = {},
  ) => {
    const id = path.replaceAll(".", "-"),
      error = fieldError(path),
      registration = register(path as FieldPath<EventHostingRequest>);
    const helpId = error
      ? `${id}-error`
      : options.hint
        ? `${id}-hint`
        : undefined;
    const countValue = String(getWatchedValue(path) || "").length;
    const label =
      path === "institution.department"
        ? ["College", "University", "School"].includes(
            String(watched.institution?.institutionType),
          )
          ? "Department / Branch"
          : "Team / Office / Unit"
        : labels[path] || path;
    return (
      <div className="space-y-2" key={path}>
        <label htmlFor={id} className="block text-sm font-semibold">
          {label}
          {path !== "about.phoneNumber" && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {options.optional || !required.has(path)
                ? "Optional"
                : "Required"}
            </span>
          )}
        </label>
        {options.options ? (
          <select
            id={id}
            aria-describedby={helpId}
            aria-invalid={!!error}
            className={cn(
              inputClass,
              "focus-visible:shadow-[3px_3px_0_var(--ring)]",
              error && "border-destructive",
            )}
            {...registration}
          >
            <option value="">
              {options.placeholder || "Choose an option"}
            </option>
            {options.options.map((option) => (
              <option key={option} value={option}>
                {path.startsWith("venue.facilities")
                  ? prettyFacility[option]
                  : option}
              </option>
            ))}
          </select>
        ) : options.textarea ? (
          <>
            <textarea
              id={id}
              maxLength={options.maxLength}
              aria-describedby={helpId}
              aria-invalid={!!error}
              className={cn(
                inputClass,
                "h-auto min-h-[120px] resize-y py-3 focus-visible:shadow-[3px_3px_0_var(--ring)]",
                error && "border-destructive",
              )}
              {...registration}
            />
            <div className="flex justify-between gap-3 text-xs text-muted-foreground">
              <span
                id={helpId}
                className={error ? "text-destructive" : undefined}
                role={error ? "alert" : undefined}
              >
                {error || options.hint || ""}
              </span>
              <span className="shrink-0 tabular-nums">
                {countValue} /{" "}
                {options.maxLength ||
                  (path === "event.description" ? 2000 : 1000)}
              </span>
            </div>
          </>
        ) : (
          <input
            id={id}
            type={options.type || "text"}
            placeholder={options.placeholder}
            aria-describedby={helpId}
            aria-invalid={!!error}
            className={cn(
              inputClass,
              "focus-visible:shadow-[3px_3px_0_var(--ring)]",
              error && "border-destructive",
            )}
            {...registration}
          />
        )}
        {!options.textarea && options.hint && (
          <p id={`${id}-hint`} className="text-sm text-muted-foreground">
            {options.hint}
          </p>
        )}
        {error && !options.textarea && (
          <p
            id={`${id}-error`}
            className="text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  };
  const chips = (path: string, options: readonly string[]) => {
    const selected = (getWatchedValue(path) as string[] | undefined) || [];
    return (
      <fieldset
        id={path.replaceAll(".", "-")}
        tabIndex={-1}
        className="space-y-2"
      >
        <legend className="mb-2 text-sm font-semibold">
          {labels[path]}{" "}
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            {required.has(path) ? "Required" : "Optional"}
          </span>
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {options.map((option) => (
            <label
              key={option}
              className={cn(
                "flex min-h-11 cursor-pointer items-center gap-2 border-2 p-2.5 text-sm focus-within:outline focus-within:outline-2 focus-within:outline-ring",
                selected.includes(option)
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background hover:border-foreground",
              )}
            >
              <input
                type="checkbox"
                className="peer sr-only"
                checked={selected.includes(option)}
                onChange={(event) =>
                  setValue(
                    path as FieldPath<EventHostingRequest>,
                    (event.target.checked
                      ? [...selected, option]
                      : selected.filter((item) => item !== option)) as never,
                    { shouldValidate: true, shouldDirty: true },
                  )
                }
              />
              <span
                className="inline-flex size-4 shrink-0 items-center justify-center border border-current"
                aria-hidden="true"
              >
                {selected.includes(option) && <Check className="size-3" />}
              </span>
              {option}
            </label>
          ))}
        </div>
        {fieldError(path) && (
          <p className="text-sm text-destructive" role="alert">
            {fieldError(path)}
          </p>
        )}
      </fieldset>
    );
  };
  const yesNo = (path: string, label: string) => (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold">
        {label}{" "}
        <span className="ml-2 text-xs font-normal text-muted-foreground">
          Optional
        </span>
      </legend>
      <div className="grid grid-cols-2 gap-2">
        {[true, false].map((value) => (
          <label
            key={String(value)}
            className={cn(
              "flex min-h-11 items-center gap-2 border-2 px-3",
              getWatchedValue(path) === value
                ? "border-foreground bg-foreground text-background"
                : "border-border",
            )}
          >
            <input
              type="radio"
              name={path}
              checked={getWatchedValue(path) === value}
              onChange={() =>
                setValue(
                  path as FieldPath<EventHostingRequest>,
                  value as never,
                  { shouldDirty: true },
                )
              }
            />
            {value ? "Yes" : "No"}
          </label>
        ))}
      </div>
    </fieldset>
  );
  const facility = (
    key: "projector" | "audio" | "wifi" | "power",
    label: string,
  ) => (
    <fieldset
      key={key}
      className="grid gap-2 border-b border-dashed border-border py-3 sm:grid-cols-[minmax(8rem,1fr)_2fr] sm:items-center"
    >
      <legend className="sr-only">{label} availability</legend>
      <p className="text-sm font-semibold">
        {label}{" "}
        <span className="text-xs font-normal text-muted-foreground">
          Optional
        </span>
      </p>
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
        {FACILITY_STATUSES.map((value) => (
          <label
            key={value}
            className={cn(
              "flex min-h-11 cursor-pointer items-center justify-center border-2 px-2 text-center text-xs",
              getWatchedValue(`venue.facilities.${key}`) === value
                ? "border-foreground bg-foreground text-background"
                : "border-border hover:border-foreground",
            )}
          >
            <input
              type="radio"
              className="sr-only"
              name={`venue.facilities.${key}`}
              checked={getWatchedValue(`venue.facilities.${key}`) === value}
              onChange={() =>
                setValue(`venue.facilities.${key}`, value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
            {prettyFacility[value]}
          </label>
        ))}
      </div>
    </fieldset>
  );
  const reviewSection = (
    title: string,
    entries: [string, unknown][],
    target: number,
  ) => (
    <section className="border-2 border-border p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-bold">{title}</h3>
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-none border-2"
          onClick={() => setStepAndClear(target)}
        >
          Edit
        </Button>
      </div>
      <dl className="mt-3 grid gap-x-5 gap-y-3 text-sm sm:grid-cols-2">
        {entries.map(([label, value]) => (
          <div key={label}>
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="whitespace-pre-wrap break-words">
              {Array.isArray(value)
                ? value.join(", ") || "—"
                : value && typeof value === "object"
                  ? Object.entries(value)
                      .map(
                        ([key, item]) =>
                          `${key}: ${prettyFacility[String(item)] || item}`,
                      )
                      .join(", ")
                  : value === undefined || value === ""
                    ? "—"
                    : String(value)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );

  if (succeeded)
    return (
      <section className="border-2 border-foreground bg-card p-6 shadow-[6px_6px_0_var(--border)] sm:p-9">
        <h2 className="text-3xl font-extrabold tracking-tight">
          Request received.
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Thank you for your interest in bringing D4 Community to your
          institution. Our team will review your proposal and get in touch if
          further discussion is required.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-2 border-border p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Reference ID
            </p>
            <p className="mt-1 font-mono text-lg font-bold tabular-nums">
              {referenceId || "—"}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-none border-2"
            onClick={async () => {
              await navigator.clipboard.writeText(referenceId);
              setCopied(true);
            }}
          >
            <Copy className="size-4" />
            Copy
          </Button>
        </div>
        <p className="sr-only" aria-live="polite">
          {copied ? "Copied" : ""}
        </p>
        <div className="mt-7 border-t border-dashed border-border pt-5">
          <h3 className="font-bold">What happens next</h3>
          <ol className="mt-3 space-y-2 text-sm">
            <li>
              <span className="mr-2 font-bold tabular-nums">01</span>We review
              your proposal.
            </li>
            <li>
              <span className="mr-2 font-bold tabular-nums">02</span>We may
              email you to discuss it further.
            </li>
            <li>
              <span className="mr-2 font-bold tabular-nums">03</span>Nothing is
              confirmed until the D4 team confirms it with you.
            </li>
          </ol>
        </div>
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline" }),
            hardButton,
            "mt-7 inline-flex px-5",
          )}
        >
          Back to home
        </Link>
      </section>
    );

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
      <nav
        aria-label="Form steps"
        className="sticky top-24 hidden h-fit lg:block"
      >
        <ol className="space-y-2">
          {steps.map((title, index) => {
            const current = index === step,
              complete = index < step;
            const content = (
              <span
                className={cn(
                  "flex min-h-[58px] items-center gap-3 border-2 px-3 text-left",
                  current && "border-foreground bg-foreground text-background",
                  complete && "border-border bg-card text-foreground",
                  !current &&
                    !complete &&
                    "border-border text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center border-2 font-mono text-sm font-bold tabular-nums",
                    current
                      ? "border-background bg-background text-foreground"
                      : "border-current",
                  )}
                >
                  {complete ? (
                    <Check className="size-4" aria-label="Complete" />
                  ) : (
                    String(index + 1).padStart(2, "0")
                  )}
                </span>
                <span className="text-sm font-semibold">{title}</span>
              </span>
            );
            return (
              <li key={title}>
                {complete ? (
                  <button
                    type="button"
                    className="w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
                    onClick={() => setStepAndClear(index)}
                  >
                    {content}
                  </button>
                ) : (
                  <div aria-current={current ? "step" : undefined}>
                    {content}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <form
        id="host-event-form"
        noValidate
        onSubmit={
          step === 5
            ? send
            : (event) => {
                event.preventDefault();
                void next();
              }
        }
        className="min-w-0 border-2 border-foreground bg-card p-5 pb-24 shadow-[6px_6px_0_var(--border)] sm:p-8 sm:pb-24 lg:pb-8"
      >
        <div className="mb-6 lg:hidden">
          <div className="grid grid-cols-6 gap-1" aria-hidden="true">
            {steps.map((title, index) => (
              <span
                key={title}
                className={cn(
                  "h-2 border border-border",
                  index <= step ? "bg-foreground" : "bg-background",
                )}
              />
            ))}
          </div>
          <p className="mt-2 text-sm font-semibold" aria-live="polite">
            Step {step + 1} of 6 · {steps[step]}
          </p>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
          >
            <header className="mb-6 border-b border-dashed border-border pb-5">
              <div className="flex items-start gap-4">
                <span
                  className="font-mono text-4xl font-extrabold tabular-nums"
                  aria-hidden="true"
                >
                  {String(step + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2
                    ref={heading}
                    tabIndex={-1}
                    className="text-2xl font-extrabold tracking-tight"
                  >
                    {steps[step]}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {descriptions[step]}
                  </p>
                </div>
              </div>
            </header>
            {summaryVisible && flatErrors.length > 0 && (
              <div
                className="mb-6 border-2 border-destructive p-4"
                role="alert"
              >
                <p className="font-bold">
                  Please fix these fields before continuing:
                </p>
                <ul className="mt-2 list-inside list-disc">
                  {flatErrors.map(({ path, message }) => (
                    <li key={path}>
                      <button
                        type="button"
                        className="underline underline-offset-2"
                        onClick={() => focusField(path)}
                      >
                        {labels[path] || path}: {message}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {notice && (
              <div
                className="mb-6 border-2 border-destructive p-4"
                role="alert"
              >
                <p>{notice.message}</p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3 h-11 rounded-none border-2"
                  onClick={() => {
                    setNotice(null);
                    void send();
                  }}
                >
                  Try again
                </Button>
              </div>
            )}
            <div className="space-y-6">
              {step === 0 && (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {field("about.fullName", {
                      hint: "Use the name you would like our team to address you by.",
                    })}
                    {field("about.email", {
                      type: "email",
                      hint: "Enter an email like name@college.edu.",
                    })}
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="about-phoneNumber"
                      className="block text-sm font-semibold"
                    >
                      Phone number{" "}
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        Required
                      </span>
                    </label>
                    <div className="grid grid-cols-[7rem_minmax(0,1fr)] border-2 border-border focus-within:outline focus-within:outline-2 focus-within:outline-ring focus-within:outline-offset-2">
                      <select
                        id="about-phoneCountryCode"
                        aria-label="Phone country code"
                        aria-describedby={
                          fieldError("about.phoneCountryCode")
                            ? "phone-code-error"
                            : undefined
                        }
                        className={cn(
                          "h-12 border-r-2 border-border bg-background px-2 text-foreground",
                          fieldError("about.phoneCountryCode") &&
                            "border-destructive",
                        )}
                        {...register("about.phoneCountryCode")}
                      >
                        <option value="">Code</option>
                        {PHONE_CODES.map((code) => (
                          <option key={code}>{code}</option>
                        ))}
                      </select>
                      <input
                        id="about-phoneNumber"
                        type="tel"
                        inputMode="tel"
                        aria-describedby={
                          fieldError("about.phoneNumber")
                            ? "about-phoneNumber-error"
                            : "phone-hint"
                        }
                        className="h-12 min-w-0 bg-background px-3 text-foreground outline-none"
                        {...register("about.phoneNumber")}
                      />
                    </div>
                    <p
                      id="phone-hint"
                      className="text-sm text-muted-foreground"
                    >
                      Include your number without the country code.
                    </p>
                    {fieldError("about.phoneCountryCode") && (
                      <p
                        id="phone-code-error"
                        className="text-sm text-destructive"
                        role="alert"
                      >
                        Choose a country code.
                      </p>
                    )}
                    {fieldError("about.phoneNumber") && (
                      <p
                        id="about-phoneNumber-error"
                        className="text-sm text-destructive"
                        role="alert"
                      >
                        {fieldError("about.phoneNumber")}
                      </p>
                    )}
                  </div>
                  <div className="border-t border-dashed border-border pt-5">
                    {field("about.role", {
                      options: ROLES,
                      placeholder: "Select your role",
                    })}
                  </div>
                  {watched.about?.role === "Other" && (
                    <div className="border-t border-dashed border-border pt-5">
                      {field("about.roleOther", {
                        hint: "Tell us your role in a few words.",
                      })}
                    </div>
                  )}
                </>
              )}
              {step === 1 && (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {field("institution.institutionType", {
                      options: INSTITUTION_TYPES,
                    })}
                    {watched.institution?.institutionType === "Other" &&
                      field("institution.institutionTypeOther")}
                    {field("institution.institutionName")}
                    {field("institution.department", {
                      optional: true,
                      hint: "Optional for every institution type.",
                    })}
                  </div>
                  <div className="grid gap-5 border-t border-dashed border-border pt-5 sm:grid-cols-2">
                    {field("institution.city")}
                    {isCustomCountry
                      ? field("institution.country", {
                          hint: "Enter your country name.",
                        })
                      : field("institution.country", { options: COUNTRIES })}
                    {watched.institution?.country === "India"
                      ? field("institution.state", { options: INDIAN_STATES })
                      : field("institution.state")}
                    {field("institution.website", {
                      type: "url",
                      optional: true,
                      hint: "Optional. You may enter a domain; https:// will be added.",
                    })}
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  {chips("event.eventTypes", EVENT_TYPES)}
                  {watched.event?.eventTypes?.includes("Other") &&
                    field("event.eventTypeOther")}
                  <div className="grid gap-5 border-t border-dashed border-border pt-5 sm:grid-cols-2">
                    {field("event.eventTitle", { optional: true })}
                    {field("event.expectedCapacity", {
                      type: "number",
                      hint: "Between 10 and 10,000 people.",
                    })}
                    {field("event.preferredDate", {
                      type: "date",
                      optional: true,
                    })}
                    {field("event.timeline", { options: TIMELINES })}
                  </div>
                  <div className="border-t border-dashed border-border pt-5">
                    {chips("event.expectedAudience", AUDIENCES)}
                  </div>
                  <div className="border-t border-dashed border-border pt-5">
                    {field("event.description", {
                      textarea: true,
                      maxLength: 2000,
                      hint: "Share the goals, format, and any topics you have in mind.",
                    })}
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  <label className="flex min-h-11 items-center gap-3 border-b border-dashed border-border pb-4 text-sm font-semibold">
                    <input
                      type="checkbox"
                      className="size-5 accent-foreground"
                      {...register("venue.venueNotFinalised")}
                    />
                    Venue is not finalised yet{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      Optional
                    </span>
                  </label>
                  {!watched.venue?.venueNotFinalised && (
                    <div className="border-b border-dashed border-border pb-5">
                      {field("venue.preferredVenue", { optional: true })}
                    </div>
                  )}
                  <div className="border-b border-dashed border-border pb-5">
                    {chips("venue.spaces", VENUE_SPACES)}
                  </div>
                  <div className="space-y-1">
                    {facility("projector", "Projector / display")}
                    {facility("audio", "Audio")}
                    {facility("wifi", "Wi-Fi")}
                    {facility("power", "Power / charging")}
                  </div>
                  <div className="grid gap-5 border-t border-dashed border-border pt-5 sm:grid-cols-2">
                    {field("venue.seatingCapacity", {
                      type: "number",
                      optional: true,
                    })}
                    {field("venue.otherInfrastructure", {
                      optional: true,
                      hint: "Other equipment, furniture, or access needs.",
                    })}
                  </div>
                  {field("venue.venueNotes", {
                    textarea: true,
                    optional: true,
                    maxLength: 1000,
                    hint: "Share any venue limits or useful details.",
                  })}
                  {anyFacilityNeed &&
                    field("venue.needsFromD4", {
                      textarea: true,
                      optional: true,
                      maxLength: 1000,
                      hint: "Tell us what help might be useful.",
                    })}
                </>
              )}
              {step === 4 && (
                <>
                  {yesNo(
                    "experience.hostedBefore",
                    "Have you organised an event before?",
                  )}
                  {watched.experience?.hostedBefore && (
                    <div className="space-y-5 border-t border-dashed border-border pt-5">
                      {field("experience.pastEventTypes", {
                        optional: true,
                        hint: "For example, workshops, talks, or hackathons.",
                      })}
                      {field("experience.pastAttendance", {
                        type: "number",
                        optional: true,
                      })}
                      {field("experience.pastDetails", {
                        textarea: true,
                        optional: true,
                        maxLength: 1000,
                      })}
                    </div>
                  )}
                  <div className="border-t border-dashed border-border pt-5">
                    {yesNo(
                      "experience.collaboratedBefore",
                      "Have you collaborated with developer communities before?",
                    )}
                  </div>
                  {watched.experience?.collaboratedBefore &&
                    field("experience.collaboratedWith", { optional: true })}
                  <div className="space-y-5 border-t border-dashed border-border pt-5">
                    {field("additional.additionalRequirements", {
                      textarea: true,
                      optional: true,
                      maxLength: 1000,
                    })}
                    {field("additional.specialRequests", {
                      textarea: true,
                      optional: true,
                      maxLength: 1000,
                    })}
                    {field("additional.anythingElse", {
                      textarea: true,
                      optional: true,
                      maxLength: 1000,
                    })}
                  </div>
                </>
              )}
              {step === 5 && (
                <>
                  <div className="space-y-4">
                    {reviewSection(
                      "About you",
                      [
                        ["Name", values.about.fullName],
                        ["Email", values.about.email],
                        [
                          "Phone",
                          `${values.about.phoneCountryCode} ${values.about.phoneNumber}`,
                        ],
                        ["Role", values.about.role],
                        ["Other role", values.about.roleOther],
                      ],
                      0,
                    )}
                    {reviewSection(
                      "Your institution",
                      [
                        ["Type", values.institution.institutionType],
                        ["Other type", values.institution.institutionTypeOther],
                        ["Institution", values.institution.institutionName],
                        ["Department / team", values.institution.department],
                        ["City", values.institution.city],
                        ["State / region", values.institution.state],
                        ["Country", values.institution.country],
                        ["Website", values.institution.website],
                      ],
                      1,
                    )}
                    {reviewSection(
                      "Event proposal",
                      [
                        ["Event types", values.event.eventTypes],
                        ["Other event type", values.event.eventTypeOther],
                        ["Title", values.event.eventTitle],
                        ["Audience", values.event.expectedAudience],
                        ["Expected capacity", values.event.expectedCapacity],
                        ["Preferred date", values.event.preferredDate],
                        ["Timeline", values.event.timeline],
                        ["Description", values.event.description],
                      ],
                      2,
                    )}
                    {reviewSection(
                      "Venue and infrastructure",
                      [
                        [
                          "Venue",
                          values.venue.venueNotFinalised
                            ? "Not finalised"
                            : values.venue.preferredVenue,
                        ],
                        ["Spaces", values.venue.spaces],
                        ["Seating capacity", values.venue.seatingCapacity],
                        ["Facilities", values.venue.facilities],
                        [
                          "Other infrastructure",
                          values.venue.otherInfrastructure,
                        ],
                        ["Venue notes", values.venue.venueNotes],
                        ["Support from D4", values.venue.needsFromD4],
                      ],
                      3,
                    )}
                    {reviewSection(
                      "Experience and extras",
                      [
                        [
                          "Organised events before",
                          values.experience.hostedBefore === undefined
                            ? "—"
                            : values.experience.hostedBefore
                              ? "Yes"
                              : "No",
                        ],
                        ["Past event types", values.experience.pastEventTypes],
                        [
                          "Approximate attendance",
                          values.experience.pastAttendance,
                        ],
                        ["Experience details", values.experience.pastDetails],
                        [
                          "Collaborated with communities",
                          values.experience.collaboratedBefore === undefined
                            ? "—"
                            : values.experience.collaboratedBefore
                              ? "Yes"
                              : "No",
                        ],
                        ["Communities", values.experience.collaboratedWith],
                        [
                          "Additional requirements",
                          values.additional.additionalRequirements,
                        ],
                        ["Special requests", values.additional.specialRequests],
                        ["Anything else", values.additional.anythingElse],
                      ],
                      4,
                    )}
                  </div>
                  <p className="border-2 border-dashed border-border p-4 text-sm">
                    This is an expression of interest. Sending it doesn&apos;t
                    confirm or approve an event.
                  </p>
                  <label className="flex min-h-12 cursor-pointer items-start gap-3 border-2 border-border p-4 text-sm">
                    <input
                      id="consent"
                      type="checkbox"
                      className="mt-1 size-5 accent-foreground"
                      {...register("consent")}
                    />
                    <span>
                      I have read and agree to the{" "}
                      <Link
                        href="/privacy-policy"
                        className="font-semibold underline underline-offset-2"
                      >
                        Privacy Policy
                      </Link>
                      .{" "}
                      <span className="text-xs text-muted-foreground">
                        Required
                      </span>
                      {fieldError("consent") && (
                        <span className="block text-destructive" role="alert">
                          Please agree to the Privacy Policy before sending.
                        </span>
                      )}
                    </span>
                  </label>
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute -left-[9999px]"
                    {...register("honeypot")}
                  />
                </>
              )}
            </div>
            <div className="mt-8 hidden justify-between border-t border-dashed border-border pt-5 lg:flex">
              <Button
                type="button"
                variant="outline"
                disabled={!step || submitting}
                onClick={back}
                className={cn(hardButton, "px-5")}
              >
                <ArrowLeft className="size-4" />
                Back
              </Button>
              {step < 5 ? (
                <Button type="submit" className={cn(hardButton, "px-6")}>
                  Next
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={submitting}
                  aria-busy={submitting}
                  className={cn(hardButton, "px-6")}
                >
                  {submitting ? "Sending…" : "Send request"}
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </form>
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t-2 border-border bg-background p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
        <Button
          type="button"
          variant="outline"
          disabled={!step || submitting}
          onClick={back}
          className={cn(hardButton, "flex-1 px-4")}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        {step < 5 ? (
          <Button
            type="button"
            onClick={() => void next()}
            className={cn(hardButton, "flex-1 px-4")}
          >
            Next
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button
            type="button"
            disabled={submitting}
            aria-busy={submitting}
            onClick={() => void send()}
            className={cn(hardButton, "flex-1 px-4")}
          >
            {submitting ? "Sending…" : "Send request"}
          </Button>
        )}
      </div>
    </div>
  );
}
