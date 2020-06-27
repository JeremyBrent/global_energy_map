-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.

-- Modify this code to update the DB schema diagram.
-- To reset the sample schema, replace everything with
-- two dots ('..' - without quotes).

CREATE TABLE "power_plants" (
    "id" int   NOT NULL,
    "country" varchar   NOT NULL,
    "country_long" varchar   NOT NULL,
    "name" varchar   NOT NULL,
    "gppd_idnr" varchar   NOT NULL,
    "capacity_mw" int   NOT NULL,
    "latitute" int   NOT NULL,
    "longitude" int   NOT NULL,
    "primary_fuel" varchar   NOT NULL,
    "other_fuel1" varchar   NOT NULL,
    "other_fuel2" varchar   NOT NULL,
    "other_fuel3" varchar   NOT NULL,
    "commissioning_year" int   NOT NULL,
    "owner" varchar   NOT NULL,
    "source" varchar   NOT NULL,
    "url" varchar   NOT NULL,
    "geolocation_source" varchar   NOT NULL,
    "wepp_id" int   NOT NULL,
    "year_of_capacity_data" int   NOT NULL,
    "generation_gwh_2013" int   NOT NULL,
    "generation_gwh_2014" int   NOT NULL,
    "generation_gwh_2015" int   NOT NULL,
    "generation_gwh_2016" int   NOT NULL,
    "generation_gwh_2017" int   NOT NULL,
    "estimated_generation_gwh" int   NOT NULL,
    CONSTRAINT "pk_power_plants" PRIMARY KEY (
        "id"
     )
);

