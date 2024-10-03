create type "public"."project_status" as enum ('Proposed', 'Active', 'Training', 'Complete');

create table "public"."nonces" (
    "nonce" text not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "used" boolean default false
);


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

create table "public"."project_managers" (
    "id" uuid not null default uuid_generate_v4(),
    "project_id" uuid not null,
    "user_id" uuid not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."project_managers" enable row level security;

create table "public"."projects" (
    "id" uuid not null default uuid_generate_v4(),
    "owner_id" uuid not null,
    "name" text not null,
    "description" json,
    "image_url" text,
    "status" project_status not null default 'Proposed'::project_status,
    "data_limit" bigint not null,
    "current_data_usage" bigint default 0,
    "file_count" integer default 0,
    "is_full" boolean default false,
    "subscription_id" uuid not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


create table "public"."subscriptions" (
    "id" uuid not null default uuid_generate_v4(),
    "tier" text not null,
    "data_limit" bigint not null,
    "price" double precision not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "file_size_limit" bigint not null default 5242880
);


alter table "public"."subscriptions" enable row level security;

create table "public"."training_queue" (
    "project_id" uuid not null,
    "status" text not null default 'pending'::text,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "error_message" text
);


create table "public"."user_project_files" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid not null,
    "project_id" uuid not null,
    "contribution_score" double precision default 0,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "storage_objects_id" uuid
);


alter table "public"."user_project_files" enable row level security;

CREATE INDEX idx_nonces_created_at ON public.nonces USING btree (created_at);

CREATE INDEX idx_training_queue_status ON public.training_queue USING btree (status);

CREATE UNIQUE INDEX nonces_pkey ON public.nonces USING btree (nonce);

CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profiles_wallet_address_key ON public.profiles USING btree (wallet_address);

CREATE UNIQUE INDEX project_managers_pkey ON public.project_managers USING btree (id);

CREATE UNIQUE INDEX project_managers_project_id_user_id_key ON public.project_managers USING btree (project_id, user_id);

CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (id);

CREATE UNIQUE INDEX subscriptions_pkey ON public.subscriptions USING btree (id);

CREATE UNIQUE INDEX training_queue_pkey ON public.training_queue USING btree (project_id);

CREATE UNIQUE INDEX user_project_files_pkey ON public.user_project_files USING btree (id);

alter table "public"."nonces" add constraint "nonces_pkey" PRIMARY KEY using index "nonces_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."project_managers" add constraint "project_managers_pkey" PRIMARY KEY using index "project_managers_pkey";

alter table "public"."projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."subscriptions" add constraint "subscriptions_pkey" PRIMARY KEY using index "subscriptions_pkey";

alter table "public"."training_queue" add constraint "training_queue_pkey" PRIMARY KEY using index "training_queue_pkey";

alter table "public"."user_project_files" add constraint "user_project_files_pkey" PRIMARY KEY using index "user_project_files_pkey";

alter table "public"."profiles" add constraint "profiles_email_key" UNIQUE using index "profiles_email_key";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_wallet_address_key" UNIQUE using index "profiles_wallet_address_key";

alter table "public"."project_managers" add constraint "project_managers_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) not valid;

alter table "public"."project_managers" validate constraint "project_managers_project_id_fkey";

alter table "public"."project_managers" add constraint "project_managers_project_id_user_id_key" UNIQUE using index "project_managers_project_id_user_id_key";

alter table "public"."project_managers" add constraint "project_managers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."project_managers" validate constraint "project_managers_user_id_fkey";

alter table "public"."projects" add constraint "projects_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES profiles(id) not valid;

alter table "public"."projects" validate constraint "projects_owner_id_fkey";

alter table "public"."projects" add constraint "projects_subscription_id_fkey" FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) not valid;

alter table "public"."projects" validate constraint "projects_subscription_id_fkey";

alter table "public"."training_queue" add constraint "training_queue_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) not valid;

alter table "public"."training_queue" validate constraint "training_queue_project_id_fkey";

alter table "public"."user_project_files" add constraint "user_project_files_storage_objects_id_fkey" FOREIGN KEY (storage_objects_id) REFERENCES storage.objects(id) ON DELETE CASCADE not valid;

alter table "public"."user_project_files" validate constraint "user_project_files_storage_objects_id_fkey";

alter table "public"."user_project_files" add constraint "user_project_files_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."user_project_files" validate constraint "user_project_files_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_to_training_queue()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW.status = 'Training'::project_status AND OLD.status != 'Training'::project_status THEN
        INSERT INTO public.training_queue (project_id)
        VALUES (NEW.id);
    END IF;
    RETURN NEW;
END;
$function$
;

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

CREATE OR REPLACE FUNCTION public.cleanup_expired_nonces()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  DELETE FROM nonces
  WHERE created_at < NOW() - INTERVAL '15 minutes'
    AND used = FALSE;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_file(p_user_id uuid, p_file_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_deleted BOOLEAN;
    v_file_size BIGINT;
    v_project_id UUID;
    v_contribution_score FLOAT;
    v_storage_objects_id UUID;
BEGIN
    -- Get file information and delete the record
    DELETE FROM public.user_project_files
    WHERE id = p_file_id AND user_id = p_user_id
    RETURNING project_id, contribution_score, storage_objects_id INTO v_project_id, v_contribution_score, v_storage_objects_id;

    -- If file was found and deleted
    IF FOUND THEN
        -- Get file size from storage.objects
        SELECT (metadata->>'size')::bigint INTO v_file_size
        FROM storage.objects
        WHERE id = v_storage_objects_id;

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

        v_deleted := TRUE;
    ELSE
        v_deleted := FALSE;
    END IF;

    RETURN v_deleted;
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
    LEFT JOIN public.user_project_files upf ON p.id = upf.project_id
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
    WHERE upf.project_id = p_project_id AND p.id = upf.user_id;

    -- The remaining 20% goes to the platform (not represented in this schema)
END;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_nonce()
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
  new_nonce TEXT;
BEGIN
  -- Generate a new nonce and insert it into the table
  LOOP
    new_nonce := encode(gen_random_bytes(32), 'hex');
    BEGIN
      INSERT INTO nonces (nonce) VALUES (new_nonce);
      EXIT; -- Exit the loop if insert is successful
    EXCEPTION WHEN unique_violation THEN
      -- If there's a unique violation, try again with a new nonce
    END;
  END LOOP;

  RETURN new_nonce;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_max_file_size(project_id uuid)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    max_size INTEGER;
BEGIN
    SELECT s.file_size_limit INTO max_size
    FROM public.projects p
    JOIN public.subscriptions s ON p.subscription_id = s.id
    WHERE p.id = project_id;

    RETURN COALESCE(max_size, 5242880); -- Default to 5MB if not found
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_paginated_projects(p_search text, p_page_size integer, p_cursor uuid DEFAULT NULL::uuid, p_status project_status DEFAULT NULL::project_status)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_result JSON;
BEGIN
  WITH filtered_projects AS (
    SELECT *
    FROM public.project_statistics
    WHERE project_name ILIKE '%' || p_search || '%' AND (p_status IS NULL OR status = p_status)
  ),
  paginated_projects AS (
    SELECT *
    FROM filtered_projects
    WHERE (p_cursor IS NULL) OR (project_id > p_cursor)
    ORDER BY project_id
    LIMIT p_page_size + 1
  )
  SELECT json_build_object(
    'projects', COALESCE(json_agg(proj.*), '[]'::json),
    'nextCursor', (
      SELECT project_id
      FROM paginated_projects
      OFFSET p_page_size
      LIMIT 1
    )
  ) INTO v_result
  FROM (
    SELECT *
    FROM paginated_projects
    LIMIT p_page_size
  ) proj;

  RETURN v_result;
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


CREATE OR REPLACE FUNCTION public.handle_project_upload()
RETURNS TRIGGER AS $$
DECLARE
  v_project_id UUID;
  v_file_size BIGINT;
  v_user_id UUID;
  v_old_file_size BIGINT;
BEGIN
  -- Check if the bucket_id is 'projects'
  IF NEW.bucket_id = 'projects' THEN
    -- Extract project_id and user_id from the file name
    v_project_id := (storage.foldername(NEW.name))[1]::UUID;
    v_user_id := (storage.foldername(NEW.name))[2]::UUID;

    -- Get new file size
    v_file_size := (NEW.metadata->>'size')::bigint;

    -- Insert or update user_project_files
    INSERT INTO public.user_project_files (user_id, project_id, storage_objects_id)
    VALUES (v_user_id, v_project_id, NEW.id)
    ON CONFLICT (storage_objects_id) 
    DO UPDATE SET user_id = EXCLUDED.user_id, project_id = EXCLUDED.project_id;

    -- Handle INSERT operation
    IF (TG_OP = 'INSERT') THEN
      -- Update project's current_data_usage, file_count, and is_full
      UPDATE public.projects
      SET 
        current_data_usage = current_data_usage + v_file_size,
        file_count = file_count + 1,
        is_full = CASE 
          WHEN (current_data_usage + v_file_size) >= data_limit THEN true 
          ELSE false 
        END
      WHERE id = v_project_id;

      -- Update user's file_count
      UPDATE public.profiles
      SET file_count = file_count + 1
      WHERE id = v_user_id;

    -- Handle UPDATE operation
    ELSIF (TG_OP = 'UPDATE') THEN
      -- Get old file size
      v_old_file_size := (OLD.metadata->>'size')::bigint;

      -- Update project's current_data_usage and is_full
      UPDATE public.projects
      SET 
        current_data_usage = current_data_usage - v_old_file_size + v_file_size,
        is_full = CASE 
          WHEN (current_data_usage - v_old_file_size + v_file_size) >= data_limit THEN true 
          ELSE false 
        END
      WHERE id = v_project_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT operations
CREATE TRIGGER after_project_file_insert
AFTER INSERT ON storage.objects
FOR EACH ROW
EXECUTE FUNCTION public.handle_project_upload();

-- Create trigger for UPDATE operations
CREATE TRIGGER after_project_file_update
AFTER UPDATE ON storage.objects
FOR EACH ROW
EXECUTE FUNCTION public.handle_project_upload();

-- Function to handle project file deletions
CREATE OR REPLACE FUNCTION public.handle_project_file_delete()
RETURNS TRIGGER AS $$
DECLARE
  v_project_id UUID;
  v_user_id UUID;
  v_file_size BIGINT;
BEGIN
  -- Check if the deleted object was in the 'projects' bucket
  IF OLD.bucket_id = 'projects' THEN
    -- Extract project_id and user_id from the file name
    v_project_id := storage.foldername(OLD.name)[1]::UUID;
    v_user_id := storage.foldername(OLD.name)[2]::UUID;

    -- Get the file size
    v_file_size := (OLD.metadata->>'size')::bigint;

    -- Update project's current_data_usage, file_count, and is_full
    UPDATE public.projects
    SET 
      current_data_usage = GREATEST(0, current_data_usage - v_file_size),
      file_count = GREATEST(0, file_count - 1),
      is_full = CASE 
        WHEN (current_data_usage - v_file_size) < data_limit THEN false 
        ELSE is_full 
      END
    WHERE id = v_project_id;

    -- Update user's file_count
    UPDATE public.profiles
    SET file_count = GREATEST(0, file_count - 1)
    WHERE id = v_user_id;

    -- Delete the corresponding entry from user_project_files
    DELETE FROM public.user_project_files
    WHERE storage_objects_id = OLD.id;
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for DELETE operations
CREATE TRIGGER before_project_file_delete
BEFORE DELETE ON storage.objects
FOR EACH ROW
EXECUTE FUNCTION public.handle_project_file_delete();

create or replace view "public"."project_statistics" as  SELECT p.id AS project_id,
    p.name AS project_name,
    p.owner_id,
    p.status,
    p.data_limit,
    p.current_data_usage,
    p.file_count,
    p.created_at,
    p.is_full,
    p.description,
    p.image_url AS project_image,
    count(DISTINCT upf.user_id) AS contributor_count,
    avg(upf.contribution_score) AS avg_contribution_score
   FROM (projects p
     LEFT JOIN user_project_files upf ON ((p.id = upf.project_id)))
  GROUP BY p.id, p.name, p.owner_id, p.status, p.data_limit, p.current_data_usage, p.file_count, p.is_full, p.image_url;


CREATE OR REPLACE FUNCTION public.remove_from_training_queue()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW.status = 'Complete'::project_status AND OLD.status = 'Training'::project_status THEN
        DELETE FROM public.training_queue WHERE project_id = NEW.id;
    END IF;
    RETURN NEW;
END;
$function$
;

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

create or replace view "public"."user_profiles" as  SELECT au.id,
    au.email,
    (au.raw_user_meta_data ->> 'web3_password'::text) AS web3_password,
    p.wallet_address,
    p.token_balance,
    p.total_contribution_score,
    p.file_count,
    p.created_at,
    p.updated_at
   FROM (auth.users au
     JOIN profiles p ON ((au.id = p.id)));


CREATE OR REPLACE FUNCTION public.verify_nonce(nonce_to_verify text)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
  nonce_exists BOOLEAN;
BEGIN
  -- Check if the nonce exists and is unused, then mark it as used
  UPDATE nonces
  SET used = TRUE
  WHERE nonce = nonce_to_verify
    AND used = FALSE
    AND created_at > NOW() - INTERVAL '15 minutes'
  RETURNING TRUE INTO nonce_exists;

  RETURN COALESCE(nonce_exists, FALSE);
END;
$function$
;

grant delete on table "public"."nonces" to "anon";

grant insert on table "public"."nonces" to "anon";

grant references on table "public"."nonces" to "anon";

grant select on table "public"."nonces" to "anon";

grant trigger on table "public"."nonces" to "anon";

grant truncate on table "public"."nonces" to "anon";

grant update on table "public"."nonces" to "anon";

grant delete on table "public"."nonces" to "authenticated";

grant insert on table "public"."nonces" to "authenticated";

grant references on table "public"."nonces" to "authenticated";

grant select on table "public"."nonces" to "authenticated";

grant trigger on table "public"."nonces" to "authenticated";

grant truncate on table "public"."nonces" to "authenticated";

grant update on table "public"."nonces" to "authenticated";

grant delete on table "public"."nonces" to "service_role";

grant insert on table "public"."nonces" to "service_role";

grant references on table "public"."nonces" to "service_role";

grant select on table "public"."nonces" to "service_role";

grant trigger on table "public"."nonces" to "service_role";

grant truncate on table "public"."nonces" to "service_role";

grant update on table "public"."nonces" to "service_role";

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

grant delete on table "public"."project_managers" to "anon";

grant insert on table "public"."project_managers" to "anon";

grant references on table "public"."project_managers" to "anon";

grant select on table "public"."project_managers" to "anon";

grant trigger on table "public"."project_managers" to "anon";

grant truncate on table "public"."project_managers" to "anon";

grant update on table "public"."project_managers" to "anon";

grant delete on table "public"."project_managers" to "authenticated";

grant insert on table "public"."project_managers" to "authenticated";

grant references on table "public"."project_managers" to "authenticated";

grant select on table "public"."project_managers" to "authenticated";

grant trigger on table "public"."project_managers" to "authenticated";

grant truncate on table "public"."project_managers" to "authenticated";

grant update on table "public"."project_managers" to "authenticated";

grant delete on table "public"."project_managers" to "service_role";

grant insert on table "public"."project_managers" to "service_role";

grant references on table "public"."project_managers" to "service_role";

grant select on table "public"."project_managers" to "service_role";

grant trigger on table "public"."project_managers" to "service_role";

grant truncate on table "public"."project_managers" to "service_role";

grant update on table "public"."project_managers" to "service_role";

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

grant delete on table "public"."training_queue" to "anon";

grant insert on table "public"."training_queue" to "anon";

grant references on table "public"."training_queue" to "anon";

grant select on table "public"."training_queue" to "anon";

grant trigger on table "public"."training_queue" to "anon";

grant truncate on table "public"."training_queue" to "anon";

grant update on table "public"."training_queue" to "anon";

grant delete on table "public"."training_queue" to "authenticated";

grant insert on table "public"."training_queue" to "authenticated";

grant references on table "public"."training_queue" to "authenticated";

grant select on table "public"."training_queue" to "authenticated";

grant trigger on table "public"."training_queue" to "authenticated";

grant truncate on table "public"."training_queue" to "authenticated";

grant update on table "public"."training_queue" to "authenticated";

grant delete on table "public"."training_queue" to "service_role";

grant insert on table "public"."training_queue" to "service_role";

grant references on table "public"."training_queue" to "service_role";

grant select on table "public"."training_queue" to "service_role";

grant trigger on table "public"."training_queue" to "service_role";

grant truncate on table "public"."training_queue" to "service_role";

grant update on table "public"."training_queue" to "service_role";

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


create policy "manage_project_managers"
on "public"."project_managers"
as permissive
for all
to authenticated
using ((project_id IN ( SELECT projects.id
   FROM projects
  WHERE (projects.owner_id = auth.uid()))));


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


create policy "Users can view subscription tiers"
on "public"."subscriptions"
as permissive
for select
to public
using (true);


create policy "Users can delete own files if project is active"
on "public"."user_project_files"
as permissive
for delete
to authenticated
using (((auth.uid() = user_id) AND (project_id IN ( SELECT projects.id
   FROM projects
  WHERE (projects.status = 'Active'::project_status)))));


create policy "Users can insert their own files"
on "public"."user_project_files"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));


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

CREATE TRIGGER add_to_training_queue_trigger AFTER UPDATE OF status ON public.projects FOR EACH ROW EXECUTE FUNCTION add_to_training_queue();

CREATE TRIGGER project_status_update BEFORE UPDATE ON public.projects FOR EACH ROW WHEN ((new.is_full IS DISTINCT FROM old.is_full)) EXECUTE FUNCTION update_project_status();

CREATE TRIGGER remove_from_training_queue_trigger AFTER UPDATE OF status ON public.projects FOR EACH ROW EXECUTE FUNCTION remove_from_training_queue();

CREATE TRIGGER update_projects_timestamp BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_user_project_files_timestamp BEFORE UPDATE ON public.user_project_files FOR EACH ROW EXECUTE FUNCTION update_timestamp();


create policy "Allow project owners and managers to view"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'projects'::text) AND ((EXISTS ( SELECT 1
   FROM projects
  WHERE (((projects.id)::text = (storage.foldername(projects.name))[1]) AND (projects.owner_id = auth.uid())))) OR (EXISTS ( SELECT 1
   FROM project_managers
  WHERE (((project_managers.project_id)::text = (storage.foldername(objects.name))[1]) AND (project_managers.user_id = auth.uid())))))));


create policy "Give users access to own folder in active project DELETE"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'projects'::text) AND ((auth.uid())::text = (storage.foldername(name))[2]) AND (EXISTS ( SELECT 1
   FROM projects
  WHERE (((projects.id)::text = (storage.foldername(objects.name))[1]) AND (projects.status = 'Active'::project_status))))));


create policy "Give users access to own folder in active project INSERT"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'projects'::text) AND ((auth.uid())::text = (storage.foldername(name))[2]) AND (EXISTS ( SELECT 1
   FROM projects
  WHERE (((projects.id)::text = (storage.foldername(objects.name))[1]) AND (projects.status = 'Active'::project_status))))));


create policy "Give users access to own folder in active project SELECT"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'projects'::text) AND ((auth.uid())::text = (storage.foldername(name))[2]) AND (EXISTS ( SELECT 1
   FROM projects
  WHERE (((projects.id)::text = (storage.foldername(objects.name))[1]) AND (projects.status = 'Active'::project_status))))));


create policy "Give users access to own folder in active project UPDATE"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'projects'::text) AND ((auth.uid())::text = (storage.foldername(name))[2]) AND (EXISTS ( SELECT 1
   FROM projects
  WHERE (((projects.id)::text = (storage.foldername(objects.name))[1]) AND (projects.status = 'Active'::project_status))))));


ALTER TABLE public.user_project_files
ADD CONSTRAINT user_project_files_storage_objects_id_key UNIQUE (storage_objects_id);

