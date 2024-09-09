drop policy "Allow public read access to wallet addresses" on "public"."wallet_addresses";

drop policy "Service role can insert wallet addresses" on "public"."wallet_addresses";

drop policy "Service role can update wallet addresses" on "public"."wallet_addresses";

revoke delete on table "public"."wallet_addresses" from "anon";

revoke insert on table "public"."wallet_addresses" from "anon";

revoke references on table "public"."wallet_addresses" from "anon";

revoke select on table "public"."wallet_addresses" from "anon";

revoke trigger on table "public"."wallet_addresses" from "anon";

revoke truncate on table "public"."wallet_addresses" from "anon";

revoke update on table "public"."wallet_addresses" from "anon";

revoke delete on table "public"."wallet_addresses" from "authenticated";

revoke insert on table "public"."wallet_addresses" from "authenticated";

revoke references on table "public"."wallet_addresses" from "authenticated";

revoke select on table "public"."wallet_addresses" from "authenticated";

revoke trigger on table "public"."wallet_addresses" from "authenticated";

revoke truncate on table "public"."wallet_addresses" from "authenticated";

revoke update on table "public"."wallet_addresses" from "authenticated";

revoke delete on table "public"."wallet_addresses" from "service_role";

revoke insert on table "public"."wallet_addresses" from "service_role";

revoke references on table "public"."wallet_addresses" from "service_role";

revoke select on table "public"."wallet_addresses" from "service_role";

revoke trigger on table "public"."wallet_addresses" from "service_role";

revoke truncate on table "public"."wallet_addresses" from "service_role";

revoke update on table "public"."wallet_addresses" from "service_role";

alter table "public"."wallet_addresses" drop constraint "wallet_addresses_address_key";

alter table "public"."wallet_addresses" drop constraint "wallet_addresses_id_fkey";

drop view if exists "public"."wallet_addresses_public";

alter table "public"."wallet_addresses" drop constraint "wallet_addresses_pkey";

drop index if exists "public"."wallet_addresses_address_key";

drop index if exists "public"."wallet_addresses_pkey";

drop table "public"."wallet_addresses";


