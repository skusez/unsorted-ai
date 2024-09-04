# unsorted-ai

unsorted-ai is a Next.js application with Supabase integration, designed to provide a robust authentication system and a foundation for building AI-powered applications.

## Tech Stack

This project uses the following technologies:

1. **Next.js**: A React framework for building server-side rendered and statically generated web applications.

   - Version: latest (as seen in `package.json`)

2. **React**: A JavaScript library for building user interfaces.

   - Version: 18.2.0

3. **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.

   - Version: 5.3.3

4. **Supabase**: An open-source Firebase alternative providing authentication, database, and storage services.

   - Packages: @supabase/ssr and @supabase/supabase-js (latest versions)

5. **Tailwind CSS**: A utility-first CSS framework for rapidly building custom user interfaces.

   - Version: 3.4.1

6. **shadcn/ui**: A collection of re-usable components built using Radix UI and Tailwind CSS.
   - Various components are used throughout the project

## Project Structure

The project follows a typical Next.js structure with some additional directories:

- `app/`: Contains the main application code, including pages and layouts.
- `components/`: Reusable React components.
- `lib/`: Utility functions and shared code.
- `utils/`: Helper functions, including Supabase client creation.
- `public/`: Static assets.

## Key Features

1. **Authentication**: The project includes a complete authentication system with sign-up, sign-in, and password reset functionality.

2. **Theme Switching**: Supports light, dark, and system themes using next-themes.

3. **Middleware**: Implements Next.js middleware for session management and protected routes.

## Getting Started

To get started with this project:

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up your Supabase project and add the necessary environment variables to `.env.local`
4. Run the development server with `npm run dev`

For more detailed setup instructions, refer to the `components/tutorial/connect-supabase-steps.tsx` and `components/tutorial/sign-up-user-steps.tsx` files.

## Additional Notes

- The project uses a custom server-side Supabase client creation method, as seen in `utils/supabase/server.ts`.
- Form actions are implemented using server actions, as demonstrated in `app/actions.ts`.

This README provides an overview of the project structure and technologies used. For more detailed information, please refer to the specific files and components within the project.
