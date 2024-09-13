drop policy "Users can view buckets for their projects" on "public"."storage_buckets";

revoke delete on table "public"."storage_buckets" from "anon";

revoke insert on table "public"."storage_buckets" from "anon";

revoke references on table "public"."storage_buckets" from "anon";

revoke select on table "public"."storage_buckets" from "anon";

revoke trigger on table "public"."storage_buckets" from "anon";

revoke truncate on table "public"."storage_buckets" from "anon";

revoke update on table "public"."storage_buckets" from "anon";

revoke delete on table "public"."storage_buckets" from "authenticated";

revoke insert on table "public"."storage_buckets" from "authenticated";

revoke references on table "public"."storage_buckets" from "authenticated";

revoke select on table "public"."storage_buckets" from "authenticated";

revoke trigger on table "public"."storage_buckets" from "authenticated";

revoke truncate on table "public"."storage_buckets" from "authenticated";

revoke update on table "public"."storage_buckets" from "authenticated";

revoke delete on table "public"."storage_buckets" from "service_role";

revoke insert on table "public"."storage_buckets" from "service_role";

revoke references on table "public"."storage_buckets" from "service_role";

revoke select on table "public"."storage_buckets" from "service_role";

revoke trigger on table "public"."storage_buckets" from "service_role";

revoke truncate on table "public"."storage_buckets" from "service_role";

revoke update on table "public"."storage_buckets" from "service_role";

alter table "public"."storage_buckets" drop constraint "fk_storage_buckets_bucket";

alter table "public"."storage_buckets" drop constraint "storage_buckets_pkey";

drop index if exists "public"."idx_storage_buckets_id";

drop index if exists "public"."storage_buckets_pkey";

drop table "public"."storage_buckets";

alter table "public"."projects" add column "bucket_id" text not null;

alter table "public"."projects" add constraint "projects_bucket_id_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id) not valid;

alter table "public"."projects" validate constraint "projects_bucket_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_project()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Insert into storage.buckets
  INSERT INTO storage.buckets (id, name, owner, created_at, updated_at, public)
  VALUES (NEW.id, generate_bucket_name(NEW.id), auth.uid(), NOW(), NOW(), false);
  
  -- Update the project with the new bucket_id
  NEW.bucket_id := NEW.id::text;
  
  RETURN NEW;
END;
$function$
;


