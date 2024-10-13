create table "public"."project_devices" (
    "project_id" uuid,
    "device_type_id" character varying
);


alter table "public"."project_devices" enable row level security;

alter table "public"."project_devices" add constraint "project_devices_device_type_id_fkey" FOREIGN KEY (device_type_id) REFERENCES device_types(name) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."project_devices" validate constraint "project_devices_device_type_id_fkey";

alter table "public"."project_devices" add constraint "project_devices_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."project_devices" validate constraint "project_devices_project_id_fkey";

grant delete on table "public"."project_devices" to "anon";

grant insert on table "public"."project_devices" to "anon";

grant references on table "public"."project_devices" to "anon";

grant select on table "public"."project_devices" to "anon";

grant trigger on table "public"."project_devices" to "anon";

grant truncate on table "public"."project_devices" to "anon";

grant update on table "public"."project_devices" to "anon";

grant delete on table "public"."project_devices" to "authenticated";

grant insert on table "public"."project_devices" to "authenticated";

grant references on table "public"."project_devices" to "authenticated";

grant select on table "public"."project_devices" to "authenticated";

grant trigger on table "public"."project_devices" to "authenticated";

grant truncate on table "public"."project_devices" to "authenticated";

grant update on table "public"."project_devices" to "authenticated";

grant delete on table "public"."project_devices" to "service_role";

grant insert on table "public"."project_devices" to "service_role";

grant references on table "public"."project_devices" to "service_role";

grant select on table "public"."project_devices" to "service_role";

grant trigger on table "public"."project_devices" to "service_role";

grant truncate on table "public"."project_devices" to "service_role";

grant update on table "public"."project_devices" to "service_role";


