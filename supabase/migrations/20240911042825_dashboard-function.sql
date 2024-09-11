set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_paginated_projects(p_search text, p_page_size integer, p_cursor uuid DEFAULT NULL::uuid)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_result JSON;
BEGIN
  WITH filtered_projects AS (
    SELECT *
    FROM public.project_statistics
    WHERE project_name ILIKE '%' || p_search || '%'
  ),
  paginated_projects AS (
    SELECT *
    FROM filtered_projects
    WHERE (p_cursor IS NULL) OR (project_id > p_cursor)
    ORDER BY project_id
    LIMIT p_page_size + 1
  )
  SELECT json_build_object(
    'projects', COALESCE(json_agg(proj.*), '[]'::json),
    'nextCursor', (
      SELECT project_id
      FROM paginated_projects
      OFFSET p_page_size
      LIMIT 1
    )
  ) INTO v_result
  FROM (
    SELECT *
    FROM paginated_projects
    LIMIT p_page_size
  ) proj;

  RETURN v_result;
END;
$function$
;


