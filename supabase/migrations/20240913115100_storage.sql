drop trigger if exists "create_project_storage_bucket" on "public"."projects";

CREATE TRIGGER create_project_storage_bucket BEFORE INSERT ON public.projects FOR EACH ROW EXECUTE FUNCTION handle_new_project();


