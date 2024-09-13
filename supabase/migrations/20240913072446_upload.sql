set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.generate_bucket_name(project_id uuid)
 RETURNS text
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
BEGIN
  RETURN 'project-' || project_id::text;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_project()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Insert into storage_buckets
  INSERT INTO storage.buckets (id, name, owner, created_at, updated_at, public)
  VALUES (NEW.id, generate_bucket_name(NEW.id), auth.uid(), NOW(), NOW(), false);
  
  -- Insert into our custom storage_buckets table
  INSERT INTO public.storage_buckets (id, project_id, bucket_name, created_at)
  VALUES (NEW.id, NEW.id, generate_bucket_name(NEW.id), NOW());
  
  RETURN NEW;
END;
$function$
;

CREATE TRIGGER create_project_storage_bucket AFTER INSERT ON public.projects FOR EACH ROW EXECUTE FUNCTION handle_new_project();


