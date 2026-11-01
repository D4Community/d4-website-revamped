import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { Button } from "@/components/ui/button";
import HostEventForm from "./HostEventForm";

export default function HostEventPage() {
  return (
    <main className="min-h-screen">
      <section className="relative -mt-18 w-full overflow-hidden px-4 pt-12 sm:px-6">
        <BackgroundRippleEffect />
        <div className="relative z-10 mx-auto w-full max-w-5xl">
          <div className="flex min-h-[31rem] flex-col justify-center py-20 sm:min-h-[34rem] sm:py-24 lg:min-h-[37rem] lg:py-28">
            <div className="w-full">
              <p className="mb-6 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
                D4 Community / Event Collaboration
              </p>
              <h1 className="max-w-4xl text-[clamp(2rem,6.5vw,6.5rem)] font-extrabold leading-[0.94] tracking-[-0.055em] text-foreground">
                BRING D4
                <br />
                TO YOUR SPACE.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground sm:mt-7 sm:text-lg lg:text-xl">
                Colleges, companies, office spaces, communities, and
                organizations can collaborate with D4 to bring people together
                for events. Tell us about your space and the experience you
                want to create.
              </p>
            </div>

            <Button asChild size="lg" variant="outline" className="mt-7 w-fit gap-3 sm:mt-8">
              <Link href="/events">
                Explore D4 events <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>

            <div className="mt-10 grid w-full grid-cols-1 border-y border-border/70 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground sm:mt-12 sm:grid-cols-3">
              {[
                "Colleges + companies",
                "Communities + organizations",
                "One D4 community",
              ].map((item) => (
                <p key={item} className="border-b border-border/70 py-3 last:border-0 sm:border-b-0 sm:py-4 sm:first:text-left sm:text-center sm:last:text-right">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="host-event-application"
        aria-labelledby="host-event-form-title"
        className="scroll-mt-28 px-4 pb-12 pt-0 sm:px-6 md:pb-16 md:pt-0"
      >
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-8 max-w-4xl sm:mb-10">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Your organization / Your event
            </p>
            <h2 id="host-event-form-title" className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Let’s bring people together.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              Share a few details about your organization, venue, and collaboration idea. Fields marked required must be completed.
            </p>
          </div>
          <HostEventForm />
        </div>
      </section>
    </main>
  );
}
