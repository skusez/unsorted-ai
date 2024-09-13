alter table "public"."subscriptions" add column "file_size_limit" integer not null default 5242880;

set check_function_bodies = off;

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

CREATE OR REPLACE FUNCTION public.handle_file_upload(p_user_id uuid, p_project_id uuid, p_file_name text, p_file_size integer, p_file_path text)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
DECLARE
    max_file_size INTEGER;
    project_data_limit INTEGER;
    project_current_usage INTEGER;
    new_file_id UUID;
BEGIN
    -- Get the max file size for this project's subscription
    max_file_size := public.get_max_file_size(p_project_id);

    -- Check if the file size exceeds the max allowed size
    IF p_file_size > max_file_size THEN
        RAISE EXCEPTION 'File size exceeds the maximum allowed for this subscription tier (% bytes)', max_file_size;
    END IF;

    -- Get the project's data limit and current usage
    SELECT data_limit, current_data_usage
    INTO project_data_limit, project_current_usage
    FROM public.projects
    WHERE id = p_project_id;

    -- Check if the new file would exceed the project's data limit
    IF (project_current_usage + p_file_size) > project_data_limit THEN
        RAISE EXCEPTION 'Uploading this file would exceed the project''s data limit';
    END IF;

    -- Insert the new file record
    INSERT INTO public.user_project_files (user_id, project_id, file_name, file_size, file_path)
    VALUES (p_user_id, p_project_id, p_file_name, p_file_size, p_file_path)
    RETURNING id INTO new_file_id;

    -- Update project's current_data_usage and file_count
    UPDATE public.projects
    SET current_data_usage = current_data_usage + p_file_size,
        file_count = file_count + 1,
        is_full = CASE WHEN (current_data_usage + p_file_size) >= data_limit THEN true ELSE false END
    WHERE id = p_project_id;

    -- Update user's file_count in profiles
    UPDATE public.profiles
    SET file_count = file_count + 1
    WHERE id = p_user_id;

    RETURN new_file_id;
END;
$function$
;

create policy "Users can view buckets for their projects"
on "public"."storage_buckets"
as permissive
for select
to public
using ((project_id IN ( SELECT user_project_files.project_id
   FROM user_project_files
  WHERE (user_project_files.user_id = auth.uid()))));


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



