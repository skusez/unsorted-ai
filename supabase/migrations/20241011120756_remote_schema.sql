drop trigger if exists "add_to_training_queue_trigger" on "public"."projects";

drop function if exists "public"."add_to_training_queue"();

alter table "public"."projects" add column "demo_created_at" timestamp with time zone;

alter table "public"."projects" enable row level security;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.demo_create_new_project()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
INSERT INTO public.projects (owner_id, name, description, image_url, status, data_limit, current_data_usage, file_count, is_full, subscription_id) VALUES
('fd919b95-34fb-455e-adbc-4724f05cf211', 'Unsorted demo', '{"description": "This AI is an expert at hand written text. Contribute your drawings to receive a score."}', '/alpha.jpg', 'Active', 1073741824, 0, 0, false, (SELECT id FROM public.subscriptions WHERE tier = 'Basic' LIMIT 1));
return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.demo_update_project_status()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
NEW.status := 'Training';
    INSERT INTO public.training_queue (project_id)
        VALUES (NEW.id);
  RETURN NEW;
END;
$function$
;

create or replace view "public"."user_project_scores" as  SELECT user_project_files.user_id,
    user_project_files.project_id,
    avg(user_project_files.contribution_score) AS avg_score,
    sum(user_project_files.contribution_score) AS total_score,
    count(*) AS file_count
   FROM user_project_files
  GROUP BY user_project_files.user_id, user_project_files.project_id;


CREATE TRIGGER demo_create_new_project AFTER UPDATE OF status ON public.projects FOR EACH ROW WHEN ((old.status = 'Active'::project_status)) EXECUTE FUNCTION demo_create_new_project();

CREATE TRIGGER demo_max_file_trigger BEFORE UPDATE OF file_count ON public.projects FOR EACH ROW WHEN (((new.file_count >= 10) AND (old.status = 'Active'::project_status))) EXECUTE FUNCTION demo_update_project_status();


