drop trigger if exists "create_project_bucket_trigger" on "public"."projects";

alter table "public"."storage_buckets" alter column "id" set data type text using "id"::text;

CREATE INDEX idx_storage_buckets_id ON public.storage_buckets USING btree (id);

alter table "public"."storage_buckets" add constraint "fk_storage_buckets_bucket" FOREIGN KEY (id) REFERENCES storage.buckets(id) ON DELETE CASCADE not valid;

alter table "public"."storage_buckets" validate constraint "fk_storage_buckets_bucket";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_project_storage_bucket()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    INSERT INTO storage.buckets (id, name)
    VALUES (NEW.id, 'project-' || NEW.id);
    RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_project()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  -- Insert into storage.buckets
  INSERT INTO storage.buckets (id, name, owner, created_at, updated_at, public)
  VALUES (NEW.id::text, generate_bucket_name(NEW.id), auth.uid(), NOW(), NOW(), false);

  -- Insert into public.storage_buckets
  INSERT INTO public.storage_buckets (id, project_id, bucket_name)
  VALUES (NEW.id::text, NEW.id, generate_bucket_name(NEW.id));

  RETURN NEW;
END;$function$
;


