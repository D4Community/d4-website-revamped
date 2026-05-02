# D4 Community: Website Revamped

The official digital gateway for the **D4 Community**. This platform is a high-performance, visually immersive web application designed to unite developers, designers, and tech leaders. It combines high-end 3D visuals with a robust headless CMS to deliver a world-class community experience.

**[Live Website](https://d4community.com)** | **[X (Twitter)](https://x.com/d4community)** | **[LinkedIn](https://www.linkedin.com/company/d4community)**

---

## Tech Stack & Architecture

This project pushes the boundaries of the modern web using **Next.js 16** and **React 19**.

### Visuals & UI
* **3D Elements**: Powered by `Three.js`, `@react-three/fiber`, and `@react-three/drei` for interactive scenes and immersive backgrounds.
* **Interactive Globe**: Utilizing `Cobe`, `d3-geo`, and `react-simple-maps` for lightweight, high-performance geographic visualizations.
* **Styling**: Built with **Tailwind CSS v4** and `class-variance-authority` (CVA) for scalable, atomic design.
* **Motion**: Orchestrated by **Framer Motion** for UI transitions and **Lenis** for smooth momentum scrolling.

### Core Engine
* **Headless CMS**: **Sanity v5** manages all dynamic content (Events, Blogs, Team members), allowing real-time updates.
* **State Management**: Optimized React 19 hooks and `react-use-measure` for responsive, layout-aware components.
* **Form Logic**: `React Hook Form` paired with `Zod` for type-safe schema validation.

### Backend & Utilities
* **Document Generation**: `@react-pdf/renderer` and `pdfkit` for generating dynamic event certificates or invoices.
* **Mailing**: `Nodemailer` for transactional emails and community notifications.
* **Integrations**: `googleapis` for calendar/drive sync and `react-tweet` for embedding community feedback.

---

## File Structure

The project follows a modular, feature-based directory structure:

```text
├── app/                  # Next.js App Router (Routing, Layouts, API Endpoints)
├── components/           # UI Components
│   ├── ui/               # Base primitive components (Shadcn/Radix)
│   ├── canvas/           # Three.js / React Three Fiber components
│   ├── shared/           # Reusable site-wide components (Nav, Footer)
│   └── sections/         # Page-specific sections (Hero, Wall of Love)
├── lib/                  # Core Business Logic
│   ├── sanity/           # Sanity client and fetch queries
│   ├── utils/            # Tailwind-merge and clsx helpers
│   └── actions/          # Server Actions (Forms, Emailing)
├── hooks/                # Custom React hooks (Marquee, Scroll logic)
├── public/               # Static Assets (Logos, 3D Models, Optimized Images)
├── styles/               # Global CSS & Tailwind configuration
├── types/                # TypeScript interfaces and Sanity schemas
└── .env.example          # Template for required environment variables
```

---

## Getting Started

### Prerequisites
* **Node.js**: 20.x or higher
* **Package Manager**: `npm`

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/D4-Community/d4community.git
    cd d4community
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env.local` file and fill in the following:
    ```env
    NEXT_PUBLIC_SANITY_PROJECT_ID=your_id
    NEXT_PUBLIC_SANITY_DATASET=production
    EMAIL_SERVER_USER=your_email
    EMAIL_SERVER_PASSWORD=your_password
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The site will be live at `http://localhost:3000`.

---

## Contribution Guidelines

We believe in the power of open source. To contribute:

1.  **Fork** the repo and create your branch from `dev`.
2.  **Linting**: Ensure your code passes `npm run lint` before pushing.
3.  **Components**: Follow the atomic design pattern. Place reusable primitives in `components/ui`.
4.  **Type Safety**: Always define TypeScript interfaces for new data structures in `types/`.
5.  **Commit Messages**: Use conventional commits (e.g., `feat: add marquee to reviews`).

---

## License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

**[Say Hello D4👋](https://www.d4community.com/connect)** — *Empowering builders to create the exceptional.*
