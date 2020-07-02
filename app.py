import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify

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
        f"/api/v1.0/countries<br/>"
        f"/api/v1.0/testing"
    )

@app.route("/api/v1.0/countries")
def names():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of all passenger names"""
    # Query all passengers
    # results = session.query(" country_long from power_plants ").all()
    
    results2 = session.query("power_plants_data.country").all()

    session.close()

    # Convert list of tuples into normal list
    all_names = list(np.ravel(results2))
    unique_countries = list(np.ravel(results2))

    # return jsonify(all_names)
    return jsonify(unique_countries)


@app.route("/api/v1.0/testing")
def power_plant_filter():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of all Power Plants depending on filter"""
    
    results3 = session.query(power_plants_data).filter_by(primary_fuel='Gas').all()
    # for row in results3:
    #     print(f'Plant Name: {row.name} ||| Capacity (MW): {row.capacity_mw} ||| Fuel Type: {row.primary_fuel}')

    session.close()


    # Failed Attempt to return all results

    # all_rows = []
    # for name, capacity_mw, primary_fuel in results3:
    #     test_dict = {}
    #     test_dict["name"] = name
    #     test_dict["capacity_mw"] = capacity_mw
    #     test_dict["primary_fuel"] = primary_fuel
    #     all_rows.append(test_dict)
    # return jsonify(all_rows)

    for row in results3:
        return(f'Plant Name: {row.name} ||| Capacity (MW): {row.capacity_mw} ||| Fuel Type: {row.primary_fuel}')


if __name__ == '__main__':
    app.run(debug=True)