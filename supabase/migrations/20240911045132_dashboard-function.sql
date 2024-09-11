alter table "public"."storage_buckets" drop constraint "storage_buckets_project_id_fkey";

alter table "public"."user_project_files" drop constraint "user_project_files_project_id_fkey";

drop view if exists "public"."user_statistics";

drop view if exists "public"."project_statistics";

alter table "public"."projects" alter column "description" set data type json using "description"::json;

alter table "public"."projects" disable row level security;

create or replace view "public"."project_statistics" as  SELECT p.id AS project_id,
    p.name AS project_name,
    p.owner_id,
    p.status,
    p.data_limit,
    p.current_data_usage,
    p.file_count,
    p.is_full,
    p.description,
    p.image_url AS project_image,
    count(DISTINCT upf.user_id) AS contributor_count,
    avg(upf.contribution_score) AS avg_contribution_score
   FROM (projects p
     LEFT JOIN user_project_files upf ON (((p.id = upf.project_id) AND (upf.is_revoked = false))))
  GROUP BY p.id, p.name, p.owner_id, p.status, p.data_limit, p.current_data_usage, p.file_count, p.is_full, p.image_url;



