create or replace view "public"."user_profiles" as  SELECT au.id,
    au.email,
    (au.raw_user_meta_data ->> 'web3_password'::text) AS web3_password,
    p.wallet_address,
    p.token_balance,
    p.total_contribution_score,
    p.file_count,
    p.created_at,
    p.updated_at
   FROM (auth.users au
     JOIN profiles p ON ((au.id = p.id)));



