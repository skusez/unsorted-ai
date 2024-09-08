drop policy "Users can view own wallet address" on "public"."wallet_addresses";

create or replace view "public"."wallet_addresses_public" as  SELECT wallet_addresses.id,
    wallet_addresses.address
   FROM wallet_addresses;


create policy "Allow public read access to wallet addresses"
on "public"."wallet_addresses"
as permissive
for select
to public
using (true);



