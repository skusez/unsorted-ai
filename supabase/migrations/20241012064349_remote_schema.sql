alter table "public"."project_managers" drop constraint "project_managers_pkey";

drop index if exists "public"."project_managers_pkey";

create table "public"."project_categories" (
    "project_id" uuid not null,
    "category_id" character varying not null default ''::character varying
);


alter table "public"."project_categories" enable row level security;

create table "public"."project_data_types" (
    "project_id" uuid not null,
    "data_type_id" character varying not null default ''::character varying
);


alter table "public"."project_data_types" enable row level security;

create table "public"."user_devices" (
    "user_id" uuid not null,
    "device_id" integer,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."user_devices" enable row level security;

alter table "public"."project_devices" alter column "device_type_id" set not null;

alter table "public"."project_devices" alter column "project_id" set not null;

alter table "public"."project_managers" drop column "id";

CREATE UNIQUE INDEX project_categories_pkey ON public.project_categories USING btree (project_id, category_id);

CREATE UNIQUE INDEX project_data_types_pkey ON public.project_data_types USING btree (project_id, data_type_id);

CREATE UNIQUE INDEX project_devices_pkey ON public.project_devices USING btree (project_id, device_type_id);

CREATE UNIQUE INDEX user_devices_pkey ON public.user_devices USING btree (user_id);

CREATE UNIQUE INDEX project_managers_pkey ON public.project_managers USING btree (project_id, user_id);

alter table "public"."project_categories" add constraint "project_categories_pkey" PRIMARY KEY using index "project_categories_pkey";

alter table "public"."project_data_types" add constraint "project_data_types_pkey" PRIMARY KEY using index "project_data_types_pkey";

alter table "public"."project_devices" add constraint "project_devices_pkey" PRIMARY KEY using index "project_devices_pkey";

alter table "public"."user_devices" add constraint "user_devices_pkey" PRIMARY KEY using index "user_devices_pkey";

alter table "public"."project_managers" add constraint "project_managers_pkey" PRIMARY KEY using index "project_managers_pkey";

alter table "public"."project_categories" add constraint "project_categories_category_id_fkey" FOREIGN KEY (category_id) REFERENCES categories(category_name) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."project_categories" validate constraint "project_categories_category_id_fkey";

alter table "public"."project_categories" add constraint "project_categories_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."project_categories" validate constraint "project_categories_project_id_fkey";

alter table "public"."project_data_types" add constraint "project_data_types_data_type_id_fkey" FOREIGN KEY (data_type_id) REFERENCES data_types(name) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."project_data_types" validate constraint "project_data_types_data_type_id_fkey";

alter table "public"."project_data_types" add constraint "project_data_types_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."project_data_types" validate constraint "project_data_types_project_id_fkey";

alter table "public"."user_devices" add constraint "user_devices_device_id_fkey" FOREIGN KEY (device_id) REFERENCES devices(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_devices" validate constraint "user_devices_device_id_fkey";

alter table "public"."user_devices" add constraint "user_devices_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_devices" validate constraint "user_devices_user_id_fkey";

grant delete on table "public"."project_categories" to "anon";

grant insert on table "public"."project_categories" to "anon";

grant references on table "public"."project_categories" to "anon";

grant select on table "public"."project_categories" to "anon";

grant trigger on table "public"."project_categories" to "anon";

grant truncate on table "public"."project_categories" to "anon";

grant update on table "public"."project_categories" to "anon";

grant delete on table "public"."project_categories" to "authenticated";

grant insert on table "public"."project_categories" to "authenticated";

grant references on table "public"."project_categories" to "authenticated";

grant select on table "public"."project_categories" to "authenticated";

grant trigger on table "public"."project_categories" to "authenticated";

grant truncate on table "public"."project_categories" to "authenticated";

grant update on table "public"."project_categories" to "authenticated";

grant delete on table "public"."project_categories" to "service_role";

grant insert on table "public"."project_categories" to "service_role";

grant references on table "public"."project_categories" to "service_role";

grant select on table "public"."project_categories" to "service_role";

grant trigger on table "public"."project_categories" to "service_role";

grant truncate on table "public"."project_categories" to "service_role";

grant update on table "public"."project_categories" to "service_role";

grant delete on table "public"."project_data_types" to "anon";

grant insert on table "public"."project_data_types" to "anon";

grant references on table "public"."project_data_types" to "anon";

grant select on table "public"."project_data_types" to "anon";

grant trigger on table "public"."project_data_types" to "anon";

grant truncate on table "public"."project_data_types" to "anon";

grant update on table "public"."project_data_types" to "anon";

grant delete on table "public"."project_data_types" to "authenticated";

grant insert on table "public"."project_data_types" to "authenticated";

grant references on table "public"."project_data_types" to "authenticated";

grant select on table "public"."project_data_types" to "authenticated";

grant trigger on table "public"."project_data_types" to "authenticated";

grant truncate on table "public"."project_data_types" to "authenticated";

grant update on table "public"."project_data_types" to "authenticated";

grant delete on table "public"."project_data_types" to "service_role";

grant insert on table "public"."project_data_types" to "service_role";

grant references on table "public"."project_data_types" to "service_role";

grant select on table "public"."project_data_types" to "service_role";

grant trigger on table "public"."project_data_types" to "service_role";

grant truncate on table "public"."project_data_types" to "service_role";

grant update on table "public"."project_data_types" to "service_role";

grant delete on table "public"."user_devices" to "anon";

grant insert on table "public"."user_devices" to "anon";

grant references on table "public"."user_devices" to "anon";

grant select on table "public"."user_devices" to "anon";

grant trigger on table "public"."user_devices" to "anon";

grant truncate on table "public"."user_devices" to "anon";

grant update on table "public"."user_devices" to "anon";

grant delete on table "public"."user_devices" to "authenticated";

grant insert on table "public"."user_devices" to "authenticated";

grant references on table "public"."user_devices" to "authenticated";

grant select on table "public"."user_devices" to "authenticated";

grant trigger on table "public"."user_devices" to "authenticated";

grant truncate on table "public"."user_devices" to "authenticated";

grant update on table "public"."user_devices" to "authenticated";

grant delete on table "public"."user_devices" to "service_role";

grant insert on table "public"."user_devices" to "service_role";

grant references on table "public"."user_devices" to "service_role";

grant select on table "public"."user_devices" to "service_role";

grant trigger on table "public"."user_devices" to "service_role";

grant truncate on table "public"."user_devices" to "service_role";

grant update on table "public"."user_devices" to "service_role";


