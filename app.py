import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, render_template

from config import username, password, username_heroku, password_heroku, database_heroku, host_heroku

connection_string = f"{username_heroku}:{password_heroku}@{host_heroku}:5432/{database_heroku}"
engine = create_engine(f'postgresql://{connection_string}')

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

power_plants_data = Base.classes.power_plants
#################################################
# Flask Setup
#################################################
app = Flask(__name__)

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/testing<br/>"
        f"/api/v1.0/input_testing/insert_fuel_type_here</br>"
        f"/api/v1.0/input_testing/insert_commissioning_year_here"
    )


@app.route("/api/v1.0/testing")
def power_plant_filter():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of all Power Plants depending on filter"""
    
    results3 = session.query(power_plants_data.name, power_plants_data.owner, power_plants_data.latitude, power_plants_data.longitude, power_plants_data.capacity_mw, power_plants_data.primary_fuel, power_plants_data.commissioning_year).filter_by(primary_fuel='Gas').all()
    # for row in results3:
    #     print(f'Plant Name: {row.name} ||| Capacity (MW): {row.capacity_mw} ||| Fuel Type: {row.primary_fuel}')

    session.close()


    # Failed Attempt to return all results

    all_rows = []
    for name, owner, latitude, longitude, capacity_mw, primary_fuel, commissioning_year in results3:
        test_dict = {}
        test_dict["name"] = name
        test_dict["owner"] = owner
        test_dict["latitude"] = float(latitude)
        test_dict["longtitude"] = float(longitude)
        test_dict["capacity_mw"] = float(capacity_mw)
        test_dict["primary_fuel"] = primary_fuel
        test_dict["commissioning_year"] = commissioning_year
        all_rows.append(test_dict)
    unique_countries = list(np.ravel(results3))
    print(all_rows)


    return jsonify(all_rows)
    # return render_template("index.html", rows=all_rows)


@app.route("/api/v1.0/input_testing/<fuel_type>")
def filter_function(fuel_type):
    # Create our session (link) from Python to the DB
    session = Session(engine)

    # fuel_type_input = input('Enter Fuel Type: ')
    test_filter = session.query(power_plants_data.name, power_plants_data.owner, power_plants_data.latitude, power_plants_data.longitude, power_plants_data.capacity_mw, power_plants_data.primary_fuel, power_plants_data.commissioning_year).filter_by(primary_fuel= fuel_type).all()
    
    session.close()
    
    all_rows_2 = []
    for name, owner, latitude, longitude, capacity_mw, primary_fuel, commissioning_year in test_filter:
        test_dict = {}
        test_dict["name"] = name
        test_dict["owner"] = owner
        test_dict["latitude"] = float(latitude)
        test_dict["longtitude"] = float(longitude)
        test_dict["capacity_mw"] = float(capacity_mw)
        test_dict["primary_fuel"] = primary_fuel
        test_dict["commissioning_year"] = commissioning_year
        all_rows_2.append(test_dict)

    print(all_rows_2)

    avg_gwh_list = []
    gwh_produced = session.query(power_plants_data.generation_gwh_2017).filter_by(primary_fuel= fuel_type).all()
    avg_gwh_list.append(gwh_produced)
    avg_gwh = np.mean(avg_gwh_list)

    print("---------------------------------------------------")
    print(f'Average GWH Produced from {fuel_type}: {avg_gwh}')
    # unique_countries = list(np.ravel(test_filter))

    total_gwh_list = []
    total_gwh_list.append(gwh_produced)
    total_gwh = np.sum(total_gwh_list)
    print("---------------------------------------------------")
    print(f'Total GWH Produced from {fuel_type}: {total_gwh}')    

    # return jsonify(all_rows_2)
    return (
        f'{jsonify}({all_rows_2})' '<br/>'
        f'The Average GWH produced by {fuel_type}: {avg_gwh}' '<br/>'
        f'Total GWH Produced from {fuel_type}: {total_gwh}'
        )

@app.route("/api/v1.0/input_testing/<string:year_input>")
def filter_function2(year_input):
    # Create our session (link) from Python to the DB
    session = Session(engine)

    # year_input is a string
    # year_input = input('Enter Year: ')
    test_filter = session.query(power_plants_data.name, power_plants_data.owner, power_plants_data.latitude, power_plants_data.longitude, power_plants_data.capacity_mw, power_plants_data.primary_fuel, power_plants_data.commissioning_year).filter_by(commissioning_year = year_input).all()
    
    session.close()
    
    all_rows_3 = []
    for name, owner, latitude, longitude, capacity_mw, primary_fuel, commissioning_year in test_filter:
        test_dict = {}
        test_dict["name"] = name
        test_dict["owner"] = owner
        test_dict["latitude"] = float(latitude)
        test_dict["longtitude"] = float(longitude)
        test_dict["capacity_mw"] = float(capacity_mw)
        test_dict["primary_fuel"] = primary_fuel
        test_dict["commissioning_year"] = commissioning_year
        all_rows_3.append(test_dict)
    unique_countries = list(np.ravel(test_filter))
    print(all_rows_3)

    return jsonify(all_rows_3)


# @app.route("/api/v1.0/input_testing/<state>")
# def filter_function(state):
#     # Create our session (link) from Python to the DB
#     session = Session(engine)

#     # state_input = input('Enter State: ')
#     test_filter = session.query(power_plants_data.name, power_plants_data.owner, power_plants_data.state, power_plants_data.latitude, power_plants_data.longitude, power_plants_data.capacity_mw, power_plants_data.primary_fuel, power_plants_data.commissioning_year).filter_by(state= state).all()
    
#     session.close()
    
#     all_rows_3 = []
#     for name, owner, latitude, longitude, capacity_mw, primary_fuel, commissioning_year in test_filter:
#         test_dict = {}
#         test_dict["name"] = name
#         test_dict["owner"] = owner
#         test_dict["latitude"] = float(latitude)
#         test_dict["longtitude"] = float(longitude)
#         test_dict["capacity_mw"] = float(capacity_mw)
#         test_dict["primary_fuel"] = primary_fuel
#         test_dict["commissioning_year"] = commissioning_year
#         all_rows_3.append(test_dict)
#     unique_countries = list(np.ravel(test_filter))
#     print(all_rows_3)

#     return jsonify(all_rows_3)

if __name__ == '__main__':
    app.run(debug=True)