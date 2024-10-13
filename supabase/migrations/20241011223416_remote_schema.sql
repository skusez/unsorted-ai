create sequence "public"."devices_id_seq";

create table "public"."categories" (
    "category_name" character varying(100) not null
);


create table "public"."data_types" (
    "name" character varying(100) not null,
    "icon_url" character varying(255)
);


create table "public"."device_types" (
    "name" character varying(100) not null,
    "icon_url" character varying(255)
);


create table "public"."devices" (
    "id" integer not null default nextval('devices_id_seq'::regclass),
    "name" character varying(100) not null,
    "device_type_id" character varying(100),
    "icon_url" character varying(255)
);


alter sequence "public"."devices_id_seq" owned by "public"."devices"."id";

CREATE UNIQUE INDEX categories_pkey ON public.categories USING btree (category_name);

CREATE UNIQUE INDEX data_types_pkey ON public.data_types USING btree (name);

CREATE UNIQUE INDEX device_types_pkey ON public.device_types USING btree (name);

CREATE UNIQUE INDEX devices_pkey ON public.devices USING btree (id);

alter table "public"."categories" add constraint "categories_pkey" PRIMARY KEY using index "categories_pkey";

alter table "public"."data_types" add constraint "data_types_pkey" PRIMARY KEY using index "data_types_pkey";

alter table "public"."device_types" add constraint "device_types_pkey" PRIMARY KEY using index "device_types_pkey";

alter table "public"."devices" add constraint "devices_pkey" PRIMARY KEY using index "devices_pkey";

alter table "public"."devices" add constraint "devices_device_type_id_fkey" FOREIGN KEY (device_type_id) REFERENCES device_types(name) not valid;

alter table "public"."devices" validate constraint "devices_device_type_id_fkey";

grant delete on table "public"."categories" to "anon";

grant insert on table "public"."categories" to "anon";

grant references on table "public"."categories" to "anon";

grant select on table "public"."categories" to "anon";

grant trigger on table "public"."categories" to "anon";

grant truncate on table "public"."categories" to "anon";

grant update on table "public"."categories" to "anon";

grant delete on table "public"."categories" to "authenticated";

grant insert on table "public"."categories" to "authenticated";

grant references on table "public"."categories" to "authenticated";

grant select on table "public"."categories" to "authenticated";

grant trigger on table "public"."categories" to "authenticated";

grant truncate on table "public"."categories" to "authenticated";

grant update on table "public"."categories" to "authenticated";

grant delete on table "public"."categories" to "service_role";

grant insert on table "public"."categories" to "service_role";

grant references on table "public"."categories" to "service_role";

grant select on table "public"."categories" to "service_role";

grant trigger on table "public"."categories" to "service_role";

grant truncate on table "public"."categories" to "service_role";

grant update on table "public"."categories" to "service_role";

grant delete on table "public"."data_types" to "anon";

grant insert on table "public"."data_types" to "anon";

grant references on table "public"."data_types" to "anon";

grant select on table "public"."data_types" to "anon";

grant trigger on table "public"."data_types" to "anon";

grant truncate on table "public"."data_types" to "anon";

grant update on table "public"."data_types" to "anon";

grant delete on table "public"."data_types" to "authenticated";

grant insert on table "public"."data_types" to "authenticated";

grant references on table "public"."data_types" to "authenticated";

grant select on table "public"."data_types" to "authenticated";

grant trigger on table "public"."data_types" to "authenticated";

grant truncate on table "public"."data_types" to "authenticated";

grant update on table "public"."data_types" to "authenticated";

grant delete on table "public"."data_types" to "service_role";

grant insert on table "public"."data_types" to "service_role";

grant references on table "public"."data_types" to "service_role";

grant select on table "public"."data_types" to "service_role";

grant trigger on table "public"."data_types" to "service_role";

grant truncate on table "public"."data_types" to "service_role";

grant update on table "public"."data_types" to "service_role";

grant delete on table "public"."device_types" to "anon";

grant insert on table "public"."device_types" to "anon";

grant references on table "public"."device_types" to "anon";

grant select on table "public"."device_types" to "anon";

grant trigger on table "public"."device_types" to "anon";

grant truncate on table "public"."device_types" to "anon";

grant update on table "public"."device_types" to "anon";

grant delete on table "public"."device_types" to "authenticated";

grant insert on table "public"."device_types" to "authenticated";

grant references on table "public"."device_types" to "authenticated";

grant select on table "public"."device_types" to "authenticated";

grant trigger on table "public"."device_types" to "authenticated";

grant truncate on table "public"."device_types" to "authenticated";

grant update on table "public"."device_types" to "authenticated";

grant delete on table "public"."device_types" to "service_role";

grant insert on table "public"."device_types" to "service_role";

grant references on table "public"."device_types" to "service_role";

grant select on table "public"."device_types" to "service_role";

grant trigger on table "public"."device_types" to "service_role";

grant truncate on table "public"."device_types" to "service_role";

grant update on table "public"."device_types" to "service_role";

grant delete on table "public"."devices" to "anon";

grant insert on table "public"."devices" to "anon";

grant references on table "public"."devices" to "anon";

grant select on table "public"."devices" to "anon";

grant trigger on table "public"."devices" to "anon";

grant truncate on table "public"."devices" to "anon";

grant update on table "public"."devices" to "anon";

grant delete on table "public"."devices" to "authenticated";

grant insert on table "public"."devices" to "authenticated";

grant references on table "public"."devices" to "authenticated";

grant select on table "public"."devices" to "authenticated";

grant trigger on table "public"."devices" to "authenticated";

grant truncate on table "public"."devices" to "authenticated";

grant update on table "public"."devices" to "authenticated";

grant delete on table "public"."devices" to "service_role";

grant insert on table "public"."devices" to "service_role";

grant references on table "public"."devices" to "service_role";

grant select on table "public"."devices" to "service_role";

grant trigger on table "public"."devices" to "service_role";

grant truncate on table "public"."devices" to "service_role";

grant update on table "public"."devices" to "service_role";


