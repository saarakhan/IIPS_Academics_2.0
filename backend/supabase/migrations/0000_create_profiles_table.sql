-- Step 1: Create the profiles Table
CREATE TABLE public.profiles (
    id uuid NOT NULL,
    email text, -- Can be denormalized, useful for quick lookups without joining auth.users
    full_name text,
    student_id text,
    course text,
    semester text,
    role text NOT NULL DEFAULT 'student',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_student_id_key UNIQUE (student_id),
    CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT check_role CHECK (role IN ('student', 'admin')) 
);

