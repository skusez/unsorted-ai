drop policy "Give users access to own folder in active project SELECT" on "storage"."objects";

create policy "Give users access to own folder in active project SELECT"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'projects'::text) AND ((auth.uid())::text = (storage.foldername(name))[2]) AND (EXISTS ( SELECT 1
   FROM projects
  WHERE ((projects.id)::text = (storage.foldername(objects.name))[1])))));



