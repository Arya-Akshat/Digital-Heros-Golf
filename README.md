# Digital Heroes Golf

Welcome to **Digital Heroes Golf**, a premium, subscription-based golf charity platform. 
This application is built with a modern stack focusing on performance, scalability, and a "liquid crystal" aesthetic.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) + Framer Motion
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: NextAuth.js (Auth.js)
- **Icons**: Lucide React
- **UI Components**: Custom Shadcn/Radix Primitives

## Project Structure

- `src/app`: App Router pages and layouts.
- `src/components`: Reusable UI components.
- `src/lib`: Utilities and helpers.
- `prisma`: Database schema and migrations.
- `src/services`: Business logic and backend services.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Copy `.env` (create one if missing) and configure:
    - `DATABASE_URL` (PostgreSQL connection string, for example your Render external database URL)
    - `NEXTAUTH_SECRET`
    - `NEXTAUTH_URL`

3.  **Database**:
    Initialize the PostgreSQL database:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Demo Admin Access

This project is only for assignment/demo purposes and not for production use.

- Admin Email: `admin@example.com`
- Admin Password: `admin`

## Features (Planned)

1.  **Public Frontend**: Premium landing page, charity discovery.
2.  **User Dashboard**: Score tracking (last 5 scores), subscription status.
3.  **Charity System**: Select and support charities.
4.  **Monthly Draws**: Automated draw logic with 5/4/3 match tiers.
5.  **Admin Panel**: Full control over users, draws, and payouts.

## Design System

The UI follows a "Liquid Crystal" theme:
- Deep midnight backgrounds.
- Translucent glass panels.
- Neon cyan/blue accents.
- Sophisticated typography.
