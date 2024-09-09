create type "public"."project_status" as enum ('Proposed', 'Active', 'Training', 'Complete');

create table "public"."profiles" (
    "id" uuid not null,
    "wallet_address" text,
    "email" text,
    "token_balance" double precision default 0,
    "total_contribution_score" double precision default 0,
    "file_count" integer default 0,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."profiles" enable row level security;

create table "public"."projects" (
    "id" uuid not null default uuid_generate_v4(),
    "owner_id" uuid not null,
    "name" text not null,
    "description" text,
    "image_url" text,
    "status" project_status not null default 'Proposed'::project_status,
    "data_limit" integer not null,
    "current_data_usage" integer default 0,
    "file_count" integer default 0,
    "is_full" boolean default false,
    "subscription_id" uuid not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."projects" enable row level security;

create table "public"."storage_buckets" (
    "id" uuid not null default uuid_generate_v4(),
    "project_id" uuid not null,
    "bucket_name" text not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."storage_buckets" enable row level security;

create table "public"."subscriptions" (
    "id" uuid not null default uuid_generate_v4(),
    "tier" text not null,
    "data_limit" integer not null,
    "price" double precision not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."subscriptions" enable row level security;

create table "public"."user_project_files" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid not null,
    "project_id" uuid not null,
    "file_name" text not null,
    "file_size" integer not null,
    "file_path" text not null,
    "contribution_score" double precision default 0,
    "is_revoked" boolean default false,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."user_project_files" enable row level security;

CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profiles_wallet_address_key ON public.profiles USING btree (wallet_address);

CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (id);

CREATE UNIQUE INDEX storage_buckets_pkey ON public.storage_buckets USING btree (id);

CREATE UNIQUE INDEX subscriptions_pkey ON public.subscriptions USING btree (id);

CREATE UNIQUE INDEX user_project_files_pkey ON public.user_project_files USING btree (id);

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."storage_buckets" add constraint "storage_buckets_pkey" PRIMARY KEY using index "storage_buckets_pkey";

alter table "public"."subscriptions" add constraint "subscriptions_pkey" PRIMARY KEY using index "subscriptions_pkey";

alter table "public"."user_project_files" add constraint "user_project_files_pkey" PRIMARY KEY using index "user_project_files_pkey";

alter table "public"."profiles" add constraint "profiles_email_key" UNIQUE using index "profiles_email_key";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_wallet_address_key" UNIQUE using index "profiles_wallet_address_key";

alter table "public"."projects" add constraint "projects_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES profiles(id) not valid;

alter table "public"."projects" validate constraint "projects_owner_id_fkey";

alter table "public"."projects" add constraint "projects_subscription_id_fkey" FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) not valid;

alter table "public"."projects" validate constraint "projects_subscription_id_fkey";

alter table "public"."storage_buckets" add constraint "storage_buckets_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) not valid;

alter table "public"."storage_buckets" validate constraint "storage_buckets_project_id_fkey";

alter table "public"."user_project_files" add constraint "user_project_files_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) not valid;

alter table "public"."user_project_files" validate constraint "user_project_files_project_id_fkey";

alter table "public"."user_project_files" add constraint "user_project_files_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."user_project_files" validate constraint "user_project_files_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.calculate_contribution_score(p_file_size integer, p_project_id uuid)
 RETURNS double precision
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_project_total_size INTEGER;
    v_score FLOAT;
BEGIN
    SELECT current_data_usage INTO v_project_total_size
    FROM public.projects
    WHERE id = p_project_id;

    -- Simple scoring algorithm: (file_size / total_project_size) * 100
    -- Adjust this algorithm based on your specific requirements
    v_score := (p_file_size::FLOAT / NULLIF(v_project_total_size, 0)) * 100;

    RETURN v_score;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.distribute_project_tokens(p_project_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_total_score FLOAT;
    v_owner_id UUID;
    v_token_amount FLOAT := 1000000; -- Assume 1 million tokens per project, adjust as needed
BEGIN
    -- Get the project owner and total contribution score
    SELECT owner_id, COALESCE(SUM(upf.contribution_score), 0)
    INTO v_owner_id, v_total_score
    FROM public.projects p
    LEFT JOIN public.user_project_files upf ON p.id = upf.project_id AND upf.is_revoked = FALSE
    WHERE p.id = p_project_id
    GROUP BY p.owner_id;

    -- Distribute tokens to project owner (20%)
    UPDATE public.profiles
    SET token_balance = token_balance + (v_token_amount * 0.2)
    WHERE id = v_owner_id;

    -- Distribute tokens to contributors (60%)
    UPDATE public.profiles p
    SET token_balance = p.token_balance + (
        (upf.contribution_score / NULLIF(v_total_score, 0)) * (v_token_amount * 0.6)
    )
    FROM public.user_project_files upf
    WHERE upf.project_id = p_project_id AND upf.is_revoked = FALSE AND p.id = upf.user_id;

    -- The remaining 20% goes to the platform (not represented in this schema)
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_file_upload(p_user_id uuid, p_project_id uuid, p_file_name text, p_file_size integer, p_file_path text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_file_id UUID;
    v_file_count INTEGER;
    v_project_limit INTEGER;
    v_current_usage INTEGER;
    v_score FLOAT;
BEGIN
    -- Check if user has reached the file limit for this project
    SELECT COUNT(*) INTO v_file_count
    FROM public.user_project_files
    WHERE user_id = p_user_id AND project_id = p_project_id AND is_revoked = FALSE;

    IF v_file_count >= 5 THEN
        RAISE EXCEPTION 'User has reached the maximum limit of 5 files for this project.';
    END IF;

    -- Check if project has reached its data limit
    SELECT data_limit, current_data_usage INTO v_project_limit, v_current_usage
    FROM public.projects
    WHERE id = p_project_id;

    IF v_current_usage + p_file_size > v_project_limit THEN
        RAISE EXCEPTION 'This upload would exceed the project''s data limit.';
    END IF;

    -- Calculate the contribution score
    v_score := public.calculate_contribution_score(p_file_size, p_project_id);

    -- Insert the new file record
    INSERT INTO public.user_project_files (user_id, project_id, file_name, file_size, file_path, contribution_score)
    VALUES (p_user_id, p_project_id, p_file_name, p_file_size, p_file_path, v_score)
    RETURNING id INTO v_file_id;

    -- Update project and user statistics
    UPDATE public.projects
    SET current_data_usage = current_data_usage + p_file_size,
        file_count = file_count + 1,
        is_full = (current_data_usage + p_file_size >= data_limit)
    WHERE id = p_project_id;

    UPDATE public.profiles
    SET total_contribution_score = total_contribution_score + v_score,
        file_count = file_count + 1
    WHERE id = p_user_id;

    RETURN v_file_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$function$
;

create or replace view "public"."project_statistics" as  SELECT p.id AS project_id,
    p.name AS project_name,
    p.owner_id,
    p.status,
    p.data_limit,
    p.current_data_usage,
    p.file_count,
    p.is_full,
    count(DISTINCT upf.user_id) AS contributor_count,
    avg(upf.contribution_score) AS avg_contribution_score
   FROM (projects p
     LEFT JOIN user_project_files upf ON (((p.id = upf.project_id) AND (upf.is_revoked = false))))
  GROUP BY p.id, p.name, p.owner_id, p.status, p.data_limit, p.current_data_usage, p.file_count, p.is_full;


CREATE OR REPLACE FUNCTION public.revoke_file(p_user_id uuid, p_file_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_revoked BOOLEAN;
    v_file_size INTEGER;
    v_project_id UUID;
    v_contribution_score FLOAT;
BEGIN
    UPDATE public.user_project_files
    SET is_revoked = TRUE
    WHERE id = p_file_id AND user_id = p_user_id
    RETURNING is_revoked, file_size, project_id, contribution_score INTO v_revoked, v_file_size, v_project_id, v_contribution_score;

    IF v_revoked THEN
        -- Update project statistics
        UPDATE public.projects
        SET current_data_usage = current_data_usage - v_file_size,
            file_count = file_count - 1,
            is_full = FALSE
        WHERE id = v_project_id;

        -- Update user statistics
        UPDATE public.profiles
        SET total_contribution_score = total_contribution_score - v_contribution_score,
            file_count = file_count - 1
        WHERE id = p_user_id;
    END IF;

    RETURN v_revoked;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_project_status()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW.is_full AND OLD.status = 'Active' THEN
        NEW.status := 'Training';
    END IF;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$function$
;

create or replace view "public"."user_statistics" as  SELECT u.id AS user_id,
    u.email,
    u.wallet_address,
    u.token_balance,
    u.total_contribution_score,
    u.file_count,
    count(DISTINCT upf.project_id) AS projects_contributed,
    sum(
        CASE
            WHEN (p.owner_id = u.id) THEN 1
            ELSE 0
        END) AS projects_owned
   FROM ((profiles u
     LEFT JOIN user_project_files upf ON (((u.id = upf.user_id) AND (upf.is_revoked = false))))
     LEFT JOIN projects p ON ((u.id = p.owner_id)))
  GROUP BY u.id, u.email, u.wallet_address, u.token_balance, u.total_contribution_score, u.file_count;


grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."projects" to "anon";

grant insert on table "public"."projects" to "anon";

grant references on table "public"."projects" to "anon";

grant select on table "public"."projects" to "anon";

grant trigger on table "public"."projects" to "anon";

grant truncate on table "public"."projects" to "anon";

grant update on table "public"."projects" to "anon";

grant delete on table "public"."projects" to "authenticated";

grant insert on table "public"."projects" to "authenticated";

grant references on table "public"."projects" to "authenticated";

grant select on table "public"."projects" to "authenticated";

grant trigger on table "public"."projects" to "authenticated";

grant truncate on table "public"."projects" to "authenticated";

grant update on table "public"."projects" to "authenticated";

grant delete on table "public"."projects" to "service_role";

grant insert on table "public"."projects" to "service_role";

grant references on table "public"."projects" to "service_role";

grant select on table "public"."projects" to "service_role";

grant trigger on table "public"."projects" to "service_role";

grant truncate on table "public"."projects" to "service_role";

grant update on table "public"."projects" to "service_role";

grant delete on table "public"."storage_buckets" to "anon";

grant insert on table "public"."storage_buckets" to "anon";

grant references on table "public"."storage_buckets" to "anon";

grant select on table "public"."storage_buckets" to "anon";

grant trigger on table "public"."storage_buckets" to "anon";

grant truncate on table "public"."storage_buckets" to "anon";

grant update on table "public"."storage_buckets" to "anon";

grant delete on table "public"."storage_buckets" to "authenticated";

grant insert on table "public"."storage_buckets" to "authenticated";

grant references on table "public"."storage_buckets" to "authenticated";

grant select on table "public"."storage_buckets" to "authenticated";

grant trigger on table "public"."storage_buckets" to "authenticated";

grant truncate on table "public"."storage_buckets" to "authenticated";

grant update on table "public"."storage_buckets" to "authenticated";

grant delete on table "public"."storage_buckets" to "service_role";

grant insert on table "public"."storage_buckets" to "service_role";

grant references on table "public"."storage_buckets" to "service_role";

grant select on table "public"."storage_buckets" to "service_role";

grant trigger on table "public"."storage_buckets" to "service_role";

grant truncate on table "public"."storage_buckets" to "service_role";

grant update on table "public"."storage_buckets" to "service_role";

grant delete on table "public"."subscriptions" to "anon";

grant insert on table "public"."subscriptions" to "anon";

grant references on table "public"."subscriptions" to "anon";

grant select on table "public"."subscriptions" to "anon";

grant trigger on table "public"."subscriptions" to "anon";

grant truncate on table "public"."subscriptions" to "anon";

grant update on table "public"."subscriptions" to "anon";

grant delete on table "public"."subscriptions" to "authenticated";

grant insert on table "public"."subscriptions" to "authenticated";

grant references on table "public"."subscriptions" to "authenticated";

grant select on table "public"."subscriptions" to "authenticated";

grant trigger on table "public"."subscriptions" to "authenticated";

grant truncate on table "public"."subscriptions" to "authenticated";

grant update on table "public"."subscriptions" to "authenticated";

grant delete on table "public"."subscriptions" to "service_role";

grant insert on table "public"."subscriptions" to "service_role";

grant references on table "public"."subscriptions" to "service_role";

grant select on table "public"."subscriptions" to "service_role";

grant trigger on table "public"."subscriptions" to "service_role";

grant truncate on table "public"."subscriptions" to "service_role";

grant update on table "public"."subscriptions" to "service_role";

grant delete on table "public"."user_project_files" to "anon";

grant insert on table "public"."user_project_files" to "anon";

grant references on table "public"."user_project_files" to "anon";

grant select on table "public"."user_project_files" to "anon";

grant trigger on table "public"."user_project_files" to "anon";

grant truncate on table "public"."user_project_files" to "anon";

grant update on table "public"."user_project_files" to "anon";

grant delete on table "public"."user_project_files" to "authenticated";

grant insert on table "public"."user_project_files" to "authenticated";

grant references on table "public"."user_project_files" to "authenticated";

grant select on table "public"."user_project_files" to "authenticated";

grant trigger on table "public"."user_project_files" to "authenticated";

grant truncate on table "public"."user_project_files" to "authenticated";

grant update on table "public"."user_project_files" to "authenticated";

grant delete on table "public"."user_project_files" to "service_role";

grant insert on table "public"."user_project_files" to "service_role";

grant references on table "public"."user_project_files" to "service_role";

grant select on table "public"."user_project_files" to "service_role";

grant trigger on table "public"."user_project_files" to "service_role";

grant truncate on table "public"."user_project_files" to "service_role";

grant update on table "public"."user_project_files" to "service_role";

create policy "Users can update own profile"
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Users can view own profile"
on "public"."profiles"
as permissive
for select
to public
using ((auth.uid() = id));


create policy "Users can update own projects"
on "public"."projects"
as permissive
for update
to public
using ((auth.uid() = owner_id));


create policy "Users can view all projects"
on "public"."projects"
as permissive
for select
to public
using (true);


create policy "Users can update own files"
on "public"."user_project_files"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view own files"
on "public"."user_project_files"
as permissive
for select
to public
using ((auth.uid() = user_id));


CREATE TRIGGER update_profiles_timestamp BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER project_status_update BEFORE UPDATE ON public.projects FOR EACH ROW WHEN ((new.is_full IS DISTINCT FROM old.is_full)) EXECUTE FUNCTION update_project_status();

CREATE TRIGGER update_projects_timestamp BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_user_project_files_timestamp BEFORE UPDATE ON public.user_project_files FOR EACH ROW EXECUTE FUNCTION update_timestamp();


