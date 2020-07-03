const API_KEY =
  "pk.eyJ1IjoiamVyZW15YnJlbnQiLCJhIjoiY2tiaWh0YzF2MGZkazJybThkcWtob2Y3MyJ9.nWks4cNoybDOq9i2jGGywg";

var dataset = "../Assets/Data/clean_USA_power_plant_data.csv";

// function thousands_separators(num) {
//   var num_parts = num.toString().split(".");
//   num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   return num_parts.join(".");
// }

var locationStateSelect = d3.select("#location_state_select");
var locationEnergySelect = d3.select("#location_energy_select");
var locationYearSelect = d3.select("#location_year_select");

var prodStateSelect = d3.select("#prod_state_select");
var prodEnergySelect = d3.select("#prod_energy_select");
var prodYearSelect = d3.select("#prod_year_select");

function dropDownSelect(dropDown, dropDownValue) {
  var dropDownValue = dropDown.property("value");
  return dropDownValue
}


var stateSelectValue;
locationStateSelect.on("change", dropDownSelect(locationStateSelect, stateSelectValue));

locationEnergySelect.on("change", () => {
  var energySelectValue = locationEnergySelect.node().value;
  console.log(energySelectValue);
});

locationYearSelect.on("change", () => {
  var yearSelectValue = locationYearSelect.node().value;
  console.log(yearSelectValue);
});

prodStateSelect.on("change", () => {
  var stateSelectValue = prodStateSelect.node().value;
  console.log(stateSelectValue);
});

prodEnergySelect.on("change", () => {
  var energySelectValue = prodEnergySelect.node().value;
  console.log(energySelectValue);
});

prodYearSelect.on("change", () => {
  var yearSelectValue = prodYearSelect.node().value;
  console.log(yearSelectValue);
});

d3.csv(dataset).then((data) => {
  console.log(data);

  data.forEach((d) => {
    d.capacity_mw = +d.capacity_mw;
    d.commissioning_year = +d.commissioning_year;
    d.generation_gwh_2017 = +d.generation_gwh_2017;
    d.id = +d.id;
    d.wepp_id = +d.wepp_id;
    d.year_of_capacity_data = +d.year_of_capacity_data;
  });

  var difYears = [
    ...new Set(data.map((x) => x.commissioning_year).sort((a, b) => b - a)),
  ];

  var difEnergy = [...new Set(data.map((x) => x.primary_fuel).sort())];

  for (var i = 0; i < difYears.length; i++) {
    locationYearSelect
      .append("option")
      .attr("value", `${difYears[i]}`)
      .text(difYears[i]);
    prodYearSelect
      .append("option")
      .attr("value", `${difYears[i]}`)
      .text(difYears[i]);
  }

  for (var i = 0; i < difEnergy.length; i++) {
    locationEnergySelect
      .append("option")
      .attr("value", `${difEnergy[i]}`)
      .text(difEnergy[i]);
    prodEnergySelect
      .append("option")
      .attr("value", `${difEnergy[i]}`)
      .text(difEnergy[i]);
  }

  // console.log(data)
  // // Create a new marker cluster group
  var markerClusterGroup = L.markerClusterGroup();

  // // Loop through data
  for (var i = 0; i < data.length; i++) {
    // Set the data location property to a variable
    var location = [data[i].latitude, data[i].longitude];

    // Check for location property
    if (location) {
      // Add a new marker to the cluster group and bind a pop-up
      markerClusterGroup.addLayer(
        L.marker(location).bindPopup(`
              <p><strong> Name: </strong> ${data[i].name} </p>
              <hr>
              <p><strong> Commission Year: </strong> ${data[i].commissioning_year} </p>
              <p><strong> Primary Fuel Type: </strong> ${data[i].primary_fuel} </p>
            `)
      );
    }
  }

  // Add our marker cluster layer to the map
  markerClusterGroup.addTo(myMap);
});

// Loop to build the table
d3.csv(dataset).then((data) => {
  var columnNames = [
    "name",
    "state",
    "commissioning_year",
    "primary_fuel",
    "latitude",
    "longitude",
    "generation_gwh_2017",
  ];

  const redux = (array) =>
    array.map((o) =>
      columnNames.reduce((acc, curr) => {
        acc[curr] = o[curr];
        return acc;
      }, {})
    );

  var almostTableData = redux(data);

  var tableData = almostTableData.map(Object.values);

  $(document).ready(function () {
    $("#energy-table").DataTable({
      data: tableData,
      columns: [
        { title: "Name" },
        { title: "State" },
        { title: "Commissioning year" },
        { title: "Primary fuel" },
        { title: "Latitude" },
        { title: "Longitude" },
        { title: "Energy Generation (gwh, 2017)" },
      ],
    });
  });
});


// Map 1
// Map of geolocations
var myMap = L.map("map", {
  center: [39.8283, -98.5795],
  zoom: 4,
});

// Adding tile layer to the map
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY,
  }
).addTo(myMap);

// Map 2
// Choropleth of production

var myMap2 = L.map("map2", {
  center: [39.8283, -98.5795],
  zoom: 4,
});

// Adding tile layer to the map
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY,
  }
).addTo(myMap2);
