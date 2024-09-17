## Getting Started

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Set up Supabase cli, the .env.local file is setup already
4. Run the development server with `pnpm run dev`

## Seeding the database

1. Add necessary files to the seed-files folder
2. Run `pnpm run seed`

This will create some projects, users and upload the files to the s3 bucket. This is useful for local development because you don't have to manually create the projects and users in the dashboard everytime you reset the database.

## Helpful commands

`pnpm run gen:migration` - Syncs the local database schema with the Supabase project.

`pnpm run gen:db:types:local` - Generates a database types file for use in the local development environment.

`supabase status` - Shows the local supabase status and useful URLs for interacting with the database. Studio url is a web interface for interacting with the database. S3 Storage URL is the URL of the S3 bucket, you can use any s3 client to interact with the bucket (the credentials are also shown at the end of the command).

## Storage Bucket Structure

The storage bucket is structured as follows:

- `projects/` - The root of the bucket, all projects are stored in this folder.
- `projects/{project_id}/` - Each project has a folder containing all the files uploaded by the project.
- `projects/{project_id}/{user_id}/` - Each user has a folder containing all the files uploaded by the user.
- `projects/{project_id}/{user_id}/{file_name}` - The files are stored in the user's folder with the user_id and the file_name.

There are authentication and authorization checks in place to prevent users from accessing each other's files. These are enforced at the database level using Row Level Security. You can bypass these checks by using the supabase admin client. More info here: [Bypassing Access Controls in Supabase Storage](https://supabase.com/docs/guides/storage/security/access-control#bypassing-access-controls)

## Authentication

The authentication is handled by Supabase. This application manipulates SIWE messages to enable signing in with Web3 wallets and using a wallet signature. There are several restricted routes that are protected using middleware. To view the middleware code, see `middleware.ts` at the project root.

## Security

There are database row level security policies in place for projects, users and files. These are enforced at the database level. For example, you wont be able to upload a file to a project unless it exists. Only project owners can add collaborators can view all the files in a project, wheras other users can only view their own files. If a projects status is not active, then uploading is restricted. If a project is active, then users can upload files, delete their files, etc. You can view the database policies in supabase studio. The raw SQL for these policies can be found in the `supabase/migrations/*.sql` file at the root of this repository.

## Working with other languages

This repo uses typescript and the supabase-js client. There are other languages that have supabase clients. You can see them in the `References` section of [Supabase Docs](https://supabase.com/docs)

Alternatively, there is a GraphQL API that can be used to interact with the database. This is useful for working with other languages. You can find more info here: [Supabase GraphQL](https://supabase.com/docs/guides/graphql). For working with storage, you can use any S3 compatible client.

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
