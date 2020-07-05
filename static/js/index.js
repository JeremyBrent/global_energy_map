const API_KEY =
  "pk.eyJ1IjoiamVyZW15YnJlbnQiLCJhIjoiY2tiaWh0YzF2MGZkazJybThkcWtob2Y3MyJ9.nWks4cNoybDOq9i2jGGywg";

var dataset = "../Assets/Data/clean_USA_power_plant_data.csv";

var locationStateSelect = d3.select("#location_state_select");
var locationEnergySelect = d3.select("#location_energy_select");
var locationYearSelect = d3.select("#location_year_select");

var prodStateSelect = d3.select("#prod_state_select");
var prodEnergySelect = d3.select("#prod_energy_select");
var prodYearSelect = d3.select("#prod_year_select");

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// function dropDownSelect(dropDown) {
//   dropDown.on("change", () => {
//     var dropDownValue = dropDown.property("value");
//     return dropDownValue;
//   });
// }

// Function to filter data based on fuel type
function filterByEnergy(dataset, energyType) {
  var statsData = dataset.filter((data) => data.primary_fuel == energyType);
  return statsData;
}

// var stateSelectValue;
// locationStateSelect.on("change", dropDownSelect(locationStateSelect, stateSelectValue));

locationStateSelect.on("change", () => {
  var stateSelectValue = locationStateSelect.node().value;
  console.log(stateSelectValue);
});

locationEnergySelect.on("change", () => {
  energySelectValue = locationEnergySelect.node().value;
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

//////////
// Data extraction maps filterers
d3.csv(dataset).then((data) => {
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
});

//////////
// Data extraction for map 1
d3.csv(dataset).then((data) => {
  var columnNames = [
    "name",
    "primary_fuel",
    "commissioning_year",
    "latitude",
    "longitude",
  ];

  const redux = (array) =>
    array.map((o) =>
      columnNames.reduce((acc, curr) => {
        acc[curr] = o[curr];
        return acc;
      }, {})
    );

  var reducedData = redux(data);

  reducedData.forEach((d) => {
    d.latitude = +d.latitude;
    d.longitude = +d.longitude;
    d.commissioning_year = +d.commissioning_year;
  });

  var markerClusterGroup = L.markerClusterGroup();

  var markerArray = [];

  for (var i = 0; i < reducedData.length; i++) {
    allLocations = [reducedData[i].latitude, reducedData[i].longitude];

    var marker = L.marker(allLocations).bindPopup(`
          <p><strong> Name: </strong> ${reducedData[i].name} </p>
          <hr>
          <p><strong> Commission Year: </strong> ${reducedData[i].commissioning_year} </p>
          <p><strong> Primary Fuel Type: </strong> ${reducedData[i].primary_fuel} </p>
        `);
    markerArray.push(marker);
  }

  markerClusterGroup.addLayers(markerArray);
  // Add our marker cluster layer to the map
  markerClusterGroup.addTo(myMap);

  locationEnergySelect.on("change", () => {
    // markerArray = [];
    var energySelectValue = locationEnergySelect.node().value;
    var filteredData = filterByEnergy(reducedData, energySelectValue);

    // console.log(markerClusterGroup);
    // // markerClusterGroup.clearLayers();
    // console.log(markerClusterGroup);
    if (markerClusterGroup) {
      myMap.removeLayers(markerClusterGroup);
    }

    // Check for location property
    if (energySelectValue == "All") {
      for (var i = 0; i < reducedData.length; i++) {
        allLocations = [reducedData[i].latitude, reducedData[i].longitude];

        marker = L.marker(allLocations).bindPopup(`
                <p><strong> Name: </strong> ${reducedData[i].name} </p>
                <hr>
                <p><strong> Commission Year: </strong> ${reducedData[i].commissioning_year} </p>
                <p><strong> Primary Fuel Type: </strong> ${reducedData[i].primary_fuel} </p>
              `);
        markerArray.push(marker);
      }
      markerClusterGroup.addLayers(markerArray);
    } else {
      // // Loop through data
      for (var i = 0; i < filteredData.length; i++) {
        // Set the data location property to a variable
        var filteredLocations = [
          filteredData[i].latitude,
          filteredData[i].longitude,
        ];

        marker = L.marker(filteredLocations).bindPopup(`
              <p><strong> Name: </strong> ${filteredData[i].name} </p>
              <hr>
              <p><strong> Commission Year: </strong> ${filteredData[i].commissioning_year} </p>
              <p><strong> Primary Fuel Type: </strong> ${filteredData[i].primary_fuel} </p>
            `);
        markerArray.push(marker);
      }
      markerClusterGroup.addLayers(markerArray);
    }
    // Add our marker cluster layer to the map
    markerClusterGroup.addTo(myMap);
  });
});

//////////
// Data extraction for map 2
d3.csv(dataset).then(function (data) {
  console.log(data);
  var columnNames = [
    "name",
    "primary_fuel",
    "generation_gwh_2017",
    "latitude",
    "longitude",

  ];

  const redux = (array) =>
    array.map((o) =>
      columnNames.reduce((acc, curr) => {
        acc[curr] = o[curr];
        return acc;
      }, {})
    );

  var reducedData = redux(data);
  // Create a new choropleth layer
  var choroplethLayer = L.choropleth(reducedData, {

    // Define what  property in the features to use
    valueProperty: 'generation_gwh_2017',

    // Set color scale
    scale: ["white", "red"],

    // Number of breaks in step range
    steps: 10,

    // q for quartile, e for equidistant, k for k-means
    mode: 'q',
    // Set style
    style: {
      color: '#fff', // border color
      weight: 2,
      fillOpacity: 0.8
    },
    onEachFeature: function (feature, layer) {
      // Binding a pop-up to each layer
      if (feature.properties.generation_gwh_2017) {
        layer.bindPopup("<h3> Median House Hold Income </h3> <hr>" + feature.properties.generation_gwh_2017)
      }
    }
  }).addTo(myMap2);
console.log(choroplethLayer)
  // Set up the legend
  var legend = L.control({ position: 'bottomright' })
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend')
    var limits = choroplethLayer.options.limits
    var colors = choroplethLayer.options.colors
    var labels = []
    console.log(choroplethLayer)
    console.log(colors)

    // Add min & max
    div.innerHTML = '<div class="labels"><div class="min">' + limits[0] + '</div> \
			<div class="max">' + limits[limits.length - 1] + '</div></div>'

    limits.forEach(function (limit, index) {
      labels.push('<li style="background-color: ' + colors[index] + '"></li>')
    })

    div.innerHTML += '<ul>' + labels.join('') + '</ul>'
    return div
  }
  legend.addTo(myMap2)
});

//////////
// Data extraction to build the data table
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

  // Function to reduce data object to specific properties
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

function quantity(dataset) {
  var total = dataset.length;
  return total;
}

//////////
// Data extraction for stats table
d3.csv(dataset).then((data) => {
  var columnNames = ["primary_fuel", "generation_gwh_2017"];

  const redux = (array) =>
    array.map((o) =>
      columnNames.reduce((acc, curr) => {
        acc[curr] = o[curr];
        return acc;
      }, {})
    );

  var almostTableData = redux(data);

  almostTableData.forEach((d) => {
    d.generation_gwh_2017 = +d.generation_gwh_2017;
  });

  console.log(almostTableData);

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

  almostTableData.forEach(function (item) {
    sum += item.generation_gwh_2017;
  });

  var allStationsSum = sum.toFixed(2);
  var allStationsCount = data.length;
  var allStationsAvg = (allStationsSum / allStationsCount).toFixed(2);

  tbody.append("td").text(numberWithCommas(allStationsCount));
  tbody.append("td").text(numberWithCommas(allStationsSum));
  tbody.append("td").text(numberWithCommas(allStationsAvg));
  tbody.append("td").text(100);

  dropDown.on("change", () => {
    tbody.selectAll("td").remove();
    var value = dropDown.property("value");
    var dataStats = filterByEnergy(almostTableData, value);
    var dataStationsCount = dataStats.length;
    var sum = 0;
    dataStats.forEach((item) => (sum += item.generation_gwh_2017));
    var dataStationsSum = sum.toFixed(2);
    var dataStationsAvg = (dataStationsSum / dataStationsCount).toFixed(2);
    var dataStatsPercent = ((dataStationsSum / allStationsSum) * 100).toFixed(
      2
    );
    if (value == "All") {
      tbody.append("td").text(numberWithCommas(allStationsCount));
      tbody.append("td").text(numberWithCommas(allStationsSum));
      tbody.append("td").text(numberWithCommas(allStationsAvg));
      tbody.append("td").text(100);
    } else {
      tbody.append("td").text(numberWithCommas(dataStationsCount));
      tbody.append("td").text(numberWithCommas(dataStationsSum));
      tbody.append("td").text(numberWithCommas(dataStationsAvg));
      tbody.append("td").text(dataStatsPercent);
    }
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
    id: "mapbox/dark-v10",
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
    id: "mapbox/light-v10",
    accessToken: API_KEY,
  }
).addTo(myMap2);
