
init();

const API_KEY =
  "pk.eyJ1IjoiamVyZW15YnJlbnQiLCJhIjoiY2tiaWh0YzF2MGZkazJybThkcWtob2Y3MyJ9.nWks4cNoybDOq9i2jGGywg";

// var dataset = "../Assets/Data/clean_USA_power_plant_data_states.csv";

var locationStateSelect = d3.select("#location_state_select");
var locationEnergySelect = d3.select("#location_energy_select");
var locationYearSelect = d3.select("#location_year_select");

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var markerClusterGroup = L.markerClusterGroup();

/////
// Function to initialize map 1
/////
function initMap() {
  d3.json("/all_energy").then((data) => {
    console.log(data);
    // Preparing data for the marker cluster map 1
    var markerArray = [];
    for (var i = 0; i < data.length; i++) {
      allLocations = [data[i].latitude, data[i].longitude];

      marker = L.marker(allLocations).bindPopup(`
              <p><strong> Name: </strong> ${data[i].name} </p>
              <hr>
              <p><strong> Commission Year: </strong> ${data[i].commissioning_year} </p>
              <p><strong> Primary Fuel Type: </strong> ${data[i].primary_fuel} </p>
            `);
      markerArray.push(marker);
    }
    markerClusterGroup.addLayers(markerArray);

    markerClusterGroup.addTo(myMap);
  });
}

/////
// Function to initialize map 2
/////
function initMap2 () {
  d3.json("/all_energy").then((data) => {
  var heatArray = [];


    for (var i = 0; i < data.length; i++) {
      allLocations = [data[i].latitude, data[i].longitude, (data[i].generation_gwh_2017 / 100)];
      // Heat layer
      heatArray.push(allLocations)
    }
    var heat = L.heatLayer(heatArray, {
      max: .2,
      radius:25,
      // gradient: {0.4: 'blue', 0.65: 'lime', 1: 'red'}
    }).addTo(myMap2);
  })
}

/////
// Function to initialize table
/////
function initTable() {
  d3.json("/all_energy").then((data) => {
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

    $(document).ready(() => {
      $("#energy-table").DataTable({
        data: tableData,
        columns: [
          { title: "Name" },
          { title: "State" },
          { title: "Commissioning Year" },
          { title: "Primary Fuel" },
          { title: "Latitude" },
          { title: "Longitude" },
          { title: "Energy Generation (gwh, 2017)" },
        ],
      });
    });
  })
}


/////
// Function to initialize stats table
/////
function initStat() {
  d3.json("/all_energy").then((data) => {
    console.log(data);

    var difEnergy = [...new Set(data.map((x) => x.primary_fuel).sort())];

    var dropDown = d3.select(".energyTypeStats");
    var tbody = d3.select(".stats-table-body tr");

    for (var i = 0; i < difEnergy.length; i++) {
      dropDown
        .append("option")
        .attr("value", `${difEnergy[i]}`)
        .text(difEnergy[i]);
    }

    var sum = 0;

    data.forEach(function (item) {
      sum += item.generation_gwh_2017;
    });

    console.log(data);

    var allStationsSum = sum.toFixed(2);
    var allStationsCount = data.length;
    var allStationsAvg = (allStationsSum / allStationsCount).toFixed(2);
    var percentAllStations = (allStationsSum / allStationsSum) * 100;

    tbody.append("td").text(numberWithCommas(allStationsCount));
    tbody.append("td").text(numberWithCommas(allStationsSum));
    tbody.append("td").text(numberWithCommas(allStationsAvg));
    tbody.append("td").text(percentAllStations);
  });
}


/////
// Function to initialize page
/////
function init() {
  initStat();
  initMap();
  initMap2();
  initTable();
}

/////
// Function to store user chosen filters from dropdown menus
/////
function mapFilter() {
  var selectedFilters = {};
  var localStateSelectValue = locationStateSelect.property("value");
  var localEnergySelectValue = locationEnergySelect.property("value");
  var localYearSelectValue = locationYearSelect.property("value");

  if (localStateSelectValue) {
    selectedFilters["state"] = localStateSelectValue;
    console.log("date Not empty");
  }
  if (localEnergySelectValue) {
    selectedFilters["primary_fuel"] = localEnergySelectValue;
    console.log("energy Not empty");
  }
  if (localYearSelectValue) {
    selectedFilters["commissioning_year"] = localYearSelectValue;
    console.log("year Not empty");
  }

  return selectedFilters;
}

/////
// Function to filter map
/////
function filterData() {
  var selectedFilters = mapFilter();

  state_name = selectedFilters["state"];
  energy = selectedFilters["primary_fuel"];
  year = selectedFilters["commissioning_year"];

  removeLayers();

  d3.json(`/map_filter/${state_name}/${energy}/${year}`).then((data) => {
    console.log(data);

    var markerArray = [];
    for (var i = 0; i < data.length; i++) {
      allLocations = [data[i].latitude, data[i].longitude];

      marker = L.marker(allLocations).bindPopup(`
              <p><strong> Name: </strong> ${data[i].name} </p>
              <hr>
              <p><strong> Commission Year: </strong> ${data[i].commissioning_year} </p>
              <p><strong> Primary Fuel Type: </strong> ${data[i].primary_fuel} </p>
            `);
      markerArray.push(marker);
    }
    markerClusterGroup.addLayers(markerArray);

    markerClusterGroup.addTo(myMap);
  });
}

function removeLayers() {
  markerClusterGroup.clearLayers();
  myMap.removeLayer(markerClusterGroup);
}

function resetData() {
  removeLayers();
  initMap()

  // locationStateSelect.select("option").text("All");
  // locationEnergySelect = d3.select("option").text("All");
  // locationYearSelect = d3.select("option").text("All");
}


/////
// Function to create interactive Stats Table
/////
function onChangeStatsTable(fuel_type) {
  var tbody = d3.select(".stats-table-body tr");

  d3.json(`/filter_stats_table/${fuel_type}`).then((data) => {
    console.log(data);
    tbody.selectAll("td").remove();

    if (fuel_type == "All") {
      initStat();
    } else {
      tbody.append("td").text(numberWithCommas(data.num_power_plants));
      tbody.append("td").text(numberWithCommas(data.total_prod.toFixed(2)));
      tbody.append("td").text(numberWithCommas(data.avg_prod.toFixed(2)));
      tbody.append("td").text(numberWithCommas(data.percent_prod.toFixed(2)));
    }
  });
}

/////////////
// Data extraction for map filter drop down values
////////////
d3.json("/all_energy").then((data) => {
  var difYears = [
    ...new Set(data.map((x) => x.commissioning_year).sort((a, b) => b - a)),
  ];

  var difEnergy = [...new Set(data.map((x) => x.primary_fuel).sort())];

  var difStates = [...new Set(data.map((x) => x.state).sort())];

  for (var i = 0; i < difStates.length; i++) {
    locationStateSelect
      .append("option")
      .attr("value", `${difStates[i]}`)
      .text(difStates[i]);
  }

  for (var i = 0; i < difYears.length; i++) {
    locationYearSelect
      .append("option")
      .attr("value", `${difYears[i]}`)
      .text(difYears[i]);
  }

  for (var i = 0; i < difEnergy.length; i++) {
    locationEnergySelect
      .append("option")
      .attr("value", `${difEnergy[i]}`)
      .text(difEnergy[i]);
  }
});


// Map 1
// Map of geolocations
var myMap = L.map("map", {
  center: [39.8283, -98.5795],
  zoom: 2,
  maxZoom: 18,
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

var myMap2 = L.map("map_2", {
  center: [39.8283, -98.5795],
  zoom: 3,
  maxZoom: 18,
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
    id: "mapbox/light-v10",
    accessToken: API_KEY,
  }
).addTo(myMap2);
