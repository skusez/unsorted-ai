drop trigger if exists "demo_create_new_project" on "public"."projects";

drop trigger if exists "demo_max_file_trigger" on "public"."projects";

drop function if exists "public"."demo_create_new_project"();

drop function if exists "public"."demo_update_project_status"();

create policy "Enable read access for all users"
on "public"."project_data_types"
as permissive
for select
to public
using (true);



