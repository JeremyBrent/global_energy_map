-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE power_plants (
    id int   NOT NULL,
    country varchar   NOT NULL,
    country_long varchar   NOT NULL,
    name varchar   NOT NULL,
    gppd_idnr varchar   NOT NULL,
    capacity_mw int   NOT NULL,
    latitude int   NOT NULL,
    longitude int   NOT NULL,
    primary_fuel varchar   NOT NULL,
    commissioning_year int   NOT NULL,
    owner varchar   NOT NULL,
    source varchar   NOT NULL,
    url varchar   NOT NULL,
    geolocation_source varchar   NOT NULL,
    wepp_id int   NOT NULL,
    year_of_capacity_data int   NOT NULL,
    generation_gwh_2017 int   NOT NULL,
    CONSTRAINT pk_power_plants PRIMARY KEY (
        id
     )
);

