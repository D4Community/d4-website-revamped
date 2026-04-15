export const faqRegistry = {
  general: [
    {
      question: "What exactly is the D4 Community?",
      answer:
        "D4 is an inclusive, open-source community built around the four pillars of modern software development: Discite (Learn), Develop, Debug, and Deploy. Our goal is to create a continuous learning and building ecosystem for developers of all skill levels.",
    },
    {
      question: "What is the core concept behind D4?",
      answer:
        "D4 represents an infinite development loop - Discite → Develop → Debug → Deploy. This cycle mirrors real-world software development, where learning, building, fixing, and deploying never truly stop.",
    },
    {
      question: "What does the D4 Community do?",
      answer:
        "We organize meetups, workshops, hackathons, and expert talks. Our focus is on collaboration, hands-on learning, and promoting free knowledge sharing through community-driven and open initiatives.",
    },
    {
      question: "How can I contribute to D4 projects?",
      answer:
        "D4 is fully open-source. You can contribute by collaborating with the community, participating in events, sharing knowledge, or proposing new ideas and initiatives that align with our mission.",
    },
    {
      question: "Are there any membership fees?",
      answer:
        "No. D4 Community is completely free. We strongly believe that access to learning, collaboration, and growth opportunities should never be restricted by cost.",
    },
    {
      question: "Do you host physical or virtual events?",
      answer:
        "We mainly organize physical, in-person events to encourage real-world collaboration and networking. Alongside this, we also host virtual events to keep the community globally accessible.",
    },
    {
      question: "What kind of help can I expect from the community?",
      answer:
        "If you need specific help, guidance, or direction, the community can help connect you with the right people. Whether it's technical, conceptual, or collaborative support, we focus on finding the right person rather than limiting help to a specific domain.",
    },
    {
      question: "How can you help us?",
      answer:
        "As a non-profit, community-driven initiative, there are several ways you can help D4 grow and thrive:\n\n1. Venue Support: If you have access to physical spaces suitable for workshops, meetups, or hackathons, your venue can become a hub for our community events.\n\n2. Mentor or Volunteer Support: Experienced developers, educators, or enthusiasts can volunteer as mentors, guides, or event volunteers.\n\n3. Team Collaboration: You can join our organizing team to help plan, coordinate, and manage events, projects, and community initiatives.\n\n4. Promoting Events: Share our events with your network, on social media, or in professional groups to help us reach a wider audience.\n\n5. Monetary Support: Financial contributions help us cover essential costs like hosting events, buying resources, or providing minimal stipends for volunteers.",
    },
    {
      question: "Can I start my own project under the D4 umbrella?",
      answer:
        "Yes. If your idea aligns with D4's vision of learning, collaboration, and free knowledge sharing, you can propose it to the community. Approved ideas receive visibility, collaboration opportunities, and community support.",
    },
  ],

  events: [
    // Add event-specific FAQs here as your events page grows
  ],

  about: [
    // Add about-page-specific FAQs here
  ],

  join: [
    {
      question: "Who can join the D4 Community?",
      answer:
        "Anyone passionate about learning, building, collaboration, and growth can join D4. Students, beginners, professionals, founders, and creators are all welcome.",
    },
    {
      question: "Is joining D4 free?",
      answer:
        "Yes. Joining the D4 Community is completely free, and we always aim to keep our events and opportunities accessible for everyone.",
    },
    {
      question: "What happens after I join?",
      answer:
        "After joining, you'll receive updates about community activities, upcoming events, collaboration opportunities, and ways to get involved in D4 initiatives.",
    },
    {
      question: "Do I need coding experience to join?",
      answer:
        "No prior coding experience is required. Whether you're just starting or already experienced, D4 is built for learners and builders at every stage.",
    },
    {
      question: "Can non-tech members join D4?",
      answer:
        "Absolutely. Designers, marketers, writers, organizers, founders, and anyone interested in innovation and collaboration can be part of the community.",
    },
    {
      question: "Can I volunteer after joining?",
      answer:
        "Yes. Members can volunteer in events, help organize activities, mentor others, contribute ideas, and support community growth.",
    },
    {
      question: "How will I know about upcoming events?",
      answer:
        "We share all updates about events, meetups, hackathons, and opportunities through our official communication channels.",
    },
    {
      question: "Can I leave the community anytime?",
      answer:
        "Yes. Participation in D4 is always voluntary, and you are free to step back or rejoin community activities anytime.",
    },
  ],
} as const;

export type FAQPageType = keyof typeof faqRegistry;