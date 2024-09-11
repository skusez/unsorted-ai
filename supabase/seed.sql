SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.7 (Ubuntu 15.7-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;


-- Insert sample subscriptions (in mb)
INSERT INTO public.subscriptions (tier, data_limit, price) VALUES
('Basic', 25000, 9.99), 
('Pro', 50000, 19.99),
('Enterprise', 100000, 49.99);

-- First, insert sample users into auth.users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    'user' || i || '@example.com',
    crypt('password' || i, gen_salt('bf')),  -- This creates a simple hashed password
    now(),  -- Email confirmed
    now(),  -- Created at
    now()   -- Updated at
FROM generate_series(1, 10) i
RETURNING id, email;

-- Now, insert corresponding profiles
INSERT INTO public.profiles (id, wallet_address, email, token_balance)
SELECT 
    id,
    'wallet_' || (ROW_NUMBER() OVER (ORDER BY id) * 1000)::text,
    email,
    random() * 1000
FROM auth.users
WHERE email LIKE 'user%@example.com';  -- This ensures we only select the users we just created
--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--


-- Insert sample projects
WITH project_data AS (
  SELECT * FROM (VALUES
    ('Project Alpha', 'Innovative AI initiative', ARRAY['Develop machine learning models', 'Improve natural language processing']),
    ('Project Beta', 'Renewable energy solutions', ARRAY['Enhance solar panel efficiency', 'Develop new battery technologies']),
    ('Project Gamma', 'Smart city infrastructure', ARRAY['Implement IoT sensors', 'Create data analytics platform']),
    ('Project Delta', 'Sustainable agriculture', ARRAY['Develop vertical farming techniques', 'Create AI-driven crop management']),
    ('Project Epsilon', 'Quantum computing research', ARRAY['Build quantum algorithms', 'Develop error correction methods'])
  ) AS t(name, summary, objectives)
),
generated_projects AS (
  SELECT 
    gen_random_uuid() AS id,
    p.id AS owner_id,  -- Use existing profile IDs
    pd.name,
    json_build_object(
      'root', json_build_object(
        'children', json_build_array(
          json_build_object(
            'children', json_build_array(
              json_build_object(
                'detail', 0,
                'format', 0,
                'mode', 'normal',
                'style', '',
                'text', pd.summary,
                'type', 'text',
                'version', 1
              )
            ),
            'direction', 'ltr',
            'format', '',
            'indent', 0,
            'type', 'paragraph',
            'version', 1
          ),
          json_build_object(
            'children', json_build_array(
              json_build_object(
                'detail', 0,
                'format', 1,
                'mode', 'normal',
                'style', '',
                'text', 'Project Objectives:',
                'type', 'text',
                'version', 1
              )
            ),
            'direction', 'ltr',
            'format', '',
            'indent', 0,
            'type', 'paragraph',
            'version', 1
          ),
          json_build_object(
            'children', (
              SELECT json_agg(
                json_build_object(
                  'children', json_build_array(
                    json_build_object(
                      'detail', 0,
                      'format', 0,
                      'mode', 'normal',
                      'style', '',
                      'text', obj,
                      'type', 'text',
                      'version', 1
                    )
                  ),
                  'direction', 'ltr',
                  'format', '',
                  'indent', 0,
                  'type', 'listitem',
                  'version', 1,
                  'value', 1
                )
              )
              FROM unnest(pd.objectives) obj
            ),
            'direction', 'ltr',
            'format', '',
            'indent', 0,
            'type', 'list',
            'version', 1,
            'listType', 'bullet',
            'start', 1,
            'tag', 'ul'
          )
        ),
        'direction', 'ltr',
        'format', '',
        'indent', 0,
        'type', 'root',
        'version', 1
      )
    ) AS description,
    'https://example.com/' || lower(replace(pd.name, ' ', '-')) || '.jpg' AS image_url,
    (ARRAY['Proposed', 'Active', 'Training', 'Complete']::project_status[])[floor(random() * 4 + 1)] AS status,
    floor(random() * 10000 + 1000)::integer AS data_limit,
    floor(random() * 1000)::integer AS current_data_usage,
    floor(random() * 50)::integer AS file_count,
    (random() > 0.8) AS is_full,
    s.id AS subscription_id,
    now() - (random() * interval '365 days') AS created_at,
    now() - (random() * interval '30 days') AS updated_at
  FROM project_data pd
  CROSS JOIN (SELECT id FROM public.profiles ORDER BY random() LIMIT 1) p
  CROSS JOIN (SELECT id FROM public.subscriptions ORDER BY random() LIMIT 1) s
)
INSERT INTO public.projects (
  id, owner_id, name, description, image_url, status, 
  data_limit, current_data_usage, file_count, is_full, 
  subscription_id, created_at, updated_at
)
SELECT * FROM generated_projects;

-- Insert sample user project files
INSERT INTO public.user_project_files (user_id, project_id, file_name, file_size, file_path, contribution_score, is_revoked)
SELECT
    u.id,
    p.id,
    'file_' || i || '.dat',
    (random() * 1000000 + 1000)::int,
    '/project_' || p.id || '/file_' || i || '.dat',
    random() * 100,
    (random() > 0.95)  -- 5% chance of being revoked
FROM
    generate_series(1, 100) i
CROSS JOIN (
    SELECT id FROM public.profiles ORDER BY random() LIMIT 1
) u
CROSS JOIN (
    SELECT id FROM public.projects ORDER BY random() LIMIT 1
) p;

-- Update project statistics
UPDATE public.projects p
SET
    current_data_usage = subquery.total_size,
    file_count = subquery.file_count,
    is_full = (subquery.total_size >= p.data_limit)
FROM (
    SELECT
        project_id,
        SUM(CASE WHEN NOT is_revoked THEN file_size ELSE 0 END) as total_size,
        COUNT(CASE WHEN NOT is_revoked THEN 1 END) as file_count
    FROM
        public.user_project_files
    GROUP BY
        project_id
) AS subquery
WHERE p.id = subquery.project_id;

-- Update profile statistics
UPDATE public.profiles pr
SET
    total_contribution_score = subquery.total_score,
    file_count = subquery.file_count
FROM (
    SELECT
        user_id,
        SUM(CASE WHEN NOT is_revoked THEN contribution_score ELSE 0 END) as total_score,
        COUNT(CASE WHEN NOT is_revoked THEN 1 END) as file_count
    FROM
        public.user_project_files
    GROUP BY
        user_id
) AS subquery
WHERE pr.id = subquery.user_id;

-- Set some projects to 'Training' if they're full
UPDATE public.projects
SET status = 'Training'
WHERE is_full AND status = 'Active';