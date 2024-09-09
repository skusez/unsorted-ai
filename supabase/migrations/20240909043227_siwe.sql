create table "public"."nonces" (
    "nonce" text not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "used" boolean default false
);


CREATE INDEX idx_nonces_created_at ON public.nonces USING btree (created_at);

CREATE UNIQUE INDEX nonces_pkey ON public.nonces USING btree (nonce);

alter table "public"."nonces" add constraint "nonces_pkey" PRIMARY KEY using index "nonces_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.cleanup_expired_nonces()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  DELETE FROM nonces
  WHERE created_at < NOW() - INTERVAL '15 minutes'
    AND used = FALSE;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_nonce()
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
  new_nonce TEXT;
BEGIN
  -- Generate a new nonce and insert it into the table
  LOOP
    new_nonce := encode(gen_random_bytes(32), 'hex');
    BEGIN
      INSERT INTO nonces (nonce) VALUES (new_nonce);
      EXIT; -- Exit the loop if insert is successful
    EXCEPTION WHEN unique_violation THEN
      -- If there's a unique violation, try again with a new nonce
    END;
  END LOOP;

  RETURN new_nonce;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.verify_nonce(nonce_to_verify text)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
  nonce_exists BOOLEAN;
BEGIN
  -- Check if the nonce exists and is unused, then mark it as used
  UPDATE nonces
  SET used = TRUE
  WHERE nonce = nonce_to_verify
    AND used = FALSE
    AND created_at > NOW() - INTERVAL '15 minutes'
  RETURNING TRUE INTO nonce_exists;

  RETURN COALESCE(nonce_exists, FALSE);
END;
$function$
;

grant delete on table "public"."nonces" to "anon";

grant insert on table "public"."nonces" to "anon";

grant references on table "public"."nonces" to "anon";

grant select on table "public"."nonces" to "anon";

grant trigger on table "public"."nonces" to "anon";

grant truncate on table "public"."nonces" to "anon";

grant update on table "public"."nonces" to "anon";

grant delete on table "public"."nonces" to "authenticated";

grant insert on table "public"."nonces" to "authenticated";

grant references on table "public"."nonces" to "authenticated";

grant select on table "public"."nonces" to "authenticated";

grant trigger on table "public"."nonces" to "authenticated";

grant truncate on table "public"."nonces" to "authenticated";

grant update on table "public"."nonces" to "authenticated";

grant delete on table "public"."nonces" to "service_role";

grant insert on table "public"."nonces" to "service_role";

grant references on table "public"."nonces" to "service_role";

grant select on table "public"."nonces" to "service_role";

grant trigger on table "public"."nonces" to "service_role";

grant truncate on table "public"."nonces" to "service_role";

grant update on table "public"."nonces" to "service_role";


