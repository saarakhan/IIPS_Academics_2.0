# IIPS Academic Portal - Backend Supabase Configuration

This document outlines the Supabase configuration for the backend of the IIPS Academic Portal. Supabase is utilized as a Backend-as-a-Service (BaaS) solution, providing the database, authentication, and other backend functionalities.

## Overview

The backend setup involves:
*   A PostgreSQL database schema for storing application data, including user profiles.
*   Supabase Authentication for managing user registration, login, and sessions (supporting Email, Google, and GitHub providers).
*   SQL-defined database triggers for automated actions, such as profile creation upon user registration.
*   Row Level Security (RLS) policies to ensure data security and appropriate access control.

The SQL scripts defining the database objects and RLS policies are located in the `supabase/migrations/` directory.

## Supabase Project Setup and Configuration

Developers are required to configure their Supabase project (either a shared development instance or an individual one) according to the following instructions.

**1. Supabase Project Initialization:**

*   Ensure you have access to a Supabase project. If creating a new one, do so via [supabase.com](https://supabase.com/).
*   The **Project URL** and **Anon Key (public)** are required for frontend configuration. These are available in your Supabase project settings under the "API" section.

**2. Database Schema and Logic Deployment (SQL Migrations):**

The database schema, triggers, and RLS policies are defined in SQL scripts within the `supabase/migrations/` directory. These must be executed in your Supabase project's SQL Editor in the specified order:

    1.  `0000_create_profiles_table.sql`: Establishes the `public.profiles` table for storing extended user information, linked to `auth.users`.
    2.  `0001_enable_rls_and_create_trigger.sql`: Enables Row Level Security on the `profiles` table and deploys the `handle_new_user` trigger, which automatically creates a basic user profile upon new user registration in `auth.users`.
    3.  `0002_create_rls_policies.sql`: Implements RLS policies on `public.profiles` to restrict data access, ensuring users can only view and modify their own profile data.

To deploy, copy the content of each SQL file and execute it sequentially in the Supabase SQL Editor.

**3. Authentication Provider Configuration:**

Configure the following authentication providers in your Supabase project dashboard under "Authentication" -> "Providers".

    *   **Email Authentication:**
        *   Ensure the "Email" provider is enabled.
        *   It is highly recommended to enable **"Enable email confirmations"** for production environments. This may be disabled for local development convenience but should be re-enabled before deployment.
        *   Consider enabling "Enable secure email change".

    *   **Google OAuth 2.0:**
        1.  Enable the "Google" provider.
        2.  Obtain a "Client ID" and "Client Secret" from the [Google Cloud Console](https://console.cloud.google.com/) by creating an "OAuth client ID" for a "Web application".
        3.  Required "Authorized JavaScript origins": Add your frontend development URL (e.g., `http://localhost:PORT`) and your production application URL.
        4.  Required "Authorized redirect URIs": Add `https://<YOUR_PROJECT_REF>.supabase.co/auth/v1/callback`. Replace `<YOUR_PROJECT_REF>` with your Supabase project reference ID.
        5.  Enter the obtained Client ID and Client Secret into the Supabase Google provider settings.

    *   **GitHub OAuth:**
        1.  Enable the "GitHub" provider.
        2.  Obtain a "Client ID" and "Client Secret" by creating a new OAuth App in your GitHub Developer settings.
        3.  Homepage URL: Your frontend development URL (e.g., `http://localhost:PORT`) and production URL.
        4.  Authorization callback URL: `https://<YOUR_PROJECT_REF>.supabase.co/auth/v1/callback`.
        5.  Enter the obtained Client ID and Client Secret into the Supabase GitHub provider settings.

**4. Supabase Authentication Settings:**

*   Navigate to "Authentication" -> "Settings" in your Supabase dashboard.
*   Set the **"Site URL"** to your primary frontend application URL (e.g., `http://localhost:PORT` for development, `https://yourdomain.com` for production). This URL is used by Supabase for constructing links in emails.

Upon completion of these steps, the Supabase backend will be configured to support user authentication and profile management as defined by the project requirements. The frontend application will interact with this configuration using the Supabase client library, Project URL, and Anon Key.
