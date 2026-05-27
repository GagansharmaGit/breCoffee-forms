# brewCoffee

brewCoffee is a modern, brutalist, and coffee-textured form builder. It allows you to create beautiful forms with advanced thematic options (like Coffee, Dark, and Modern), share them easily, and analyze the responses.

## Tech Stack
- **Frontend**: Next.js 15, React, Tailwind CSS, Lucide Icons, Shadcn UI
- **Backend**: tRPC, Next.js App Router (API Routes)
- **Database**: PostgreSQL (Neon/Local), Drizzle ORM
- **Monorepo**: Turborepo, pnpm

## Getting Started

### 1. Install Dependencies
```sh
pnpm install
```

### 2. Set Up Database
Make sure you have a PostgreSQL database running and update the `.env` file in the root with `DATABASE_URL`.
```sh
pnpm db:generate
pnpm db:migrate
```

### 3. Seed the Database
To experience brewCoffee with pre-populated data (Demo User, Forms, and Submissions), run the seed script:
```sh
pnpm --filter @repo/database run db:seed
```

Demo User Credentials:
- **Email**: demo@brewcoffee.com
- **Password**: hashedpassword123

### 4. Run the Development Server
```sh
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Features
- **Form Builder**: Drag, drop, and configure fields.
- **Theming**: Apply stunning pre-built themes like Coffee and Dark.
- **Form Publishing**: Make forms public and shareable.
- **Analytics Dashboard**: View and analyze submissions in real-time.
- **Explore Page**: Browse public forms built by the community.
