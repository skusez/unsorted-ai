create table "public"."wallet_addresses" (
    "id" uuid not null,
    "address" text not null
);


alter table "public"."wallet_addresses" enable row level security;

CREATE UNIQUE INDEX wallet_addresses_address_key ON public.wallet_addresses USING btree (address);

CREATE UNIQUE INDEX wallet_addresses_pkey ON public.wallet_addresses USING btree (id);

alter table "public"."wallet_addresses" add constraint "wallet_addresses_pkey" PRIMARY KEY using index "wallet_addresses_pkey";

alter table "public"."wallet_addresses" add constraint "wallet_addresses_address_key" UNIQUE using index "wallet_addresses_address_key";

alter table "public"."wallet_addresses" add constraint "wallet_addresses_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."wallet_addresses" validate constraint "wallet_addresses_id_fkey";

grant delete on table "public"."wallet_addresses" to "anon";

grant insert on table "public"."wallet_addresses" to "anon";

grant references on table "public"."wallet_addresses" to "anon";

grant select on table "public"."wallet_addresses" to "anon";

grant trigger on table "public"."wallet_addresses" to "anon";

grant truncate on table "public"."wallet_addresses" to "anon";

grant update on table "public"."wallet_addresses" to "anon";

grant delete on table "public"."wallet_addresses" to "authenticated";

grant insert on table "public"."wallet_addresses" to "authenticated";

grant references on table "public"."wallet_addresses" to "authenticated";

grant select on table "public"."wallet_addresses" to "authenticated";

grant trigger on table "public"."wallet_addresses" to "authenticated";

grant truncate on table "public"."wallet_addresses" to "authenticated";

grant update on table "public"."wallet_addresses" to "authenticated";

grant delete on table "public"."wallet_addresses" to "service_role";

grant insert on table "public"."wallet_addresses" to "service_role";

grant references on table "public"."wallet_addresses" to "service_role";

grant select on table "public"."wallet_addresses" to "service_role";

grant trigger on table "public"."wallet_addresses" to "service_role";

grant truncate on table "public"."wallet_addresses" to "service_role";

grant update on table "public"."wallet_addresses" to "service_role";

create policy "Service role can insert wallet addresses"
on "public"."wallet_addresses"
as permissive
for insert
to authenticated
with check (true);


create policy "Service role can update wallet addresses"
on "public"."wallet_addresses"
as permissive
for update
to authenticated
using (true);


create policy "Users can view own wallet address"
on "public"."wallet_addresses"
as permissive
for select
to public
using ((auth.uid() = id));



