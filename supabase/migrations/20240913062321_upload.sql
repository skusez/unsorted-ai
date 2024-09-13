set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_project_storage_bucket()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    INSERT INTO storage.buckets (id, name)
    VALUES (NEW.id, 'project-' || NEW.id);
    RETURN NEW;
END;
$function$
;

CREATE TRIGGER create_project_bucket_trigger AFTER INSERT ON public.projects FOR EACH ROW EXECUTE FUNCTION create_project_storage_bucket();


