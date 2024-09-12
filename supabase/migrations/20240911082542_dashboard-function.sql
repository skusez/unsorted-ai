drop view if exists "public"."project_statistics";

create or replace view "public"."project_statistics" as  SELECT p.id AS project_id,
    p.name AS project_name,
    p.owner_id,
    p.status,
    p.data_limit,
    p.current_data_usage,
    p.file_count,
    p.created_at,
    p.is_full,
    p.description,
    p.image_url AS project_image,
    count(DISTINCT upf.user_id) AS contributor_count,
    avg(upf.contribution_score) AS avg_contribution_score
   FROM (projects p
     LEFT JOIN user_project_files upf ON (((p.id = upf.project_id) AND (upf.is_revoked = false))))
  GROUP BY p.id, p.name, p.owner_id, p.status, p.data_limit, p.current_data_usage, p.file_count, p.is_full, p.image_url;



