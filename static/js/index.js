const API_KEY =
  "pk.eyJ1IjoiamVyZW15YnJlbnQiLCJhIjoiY2tiaWh0YzF2MGZkazJybThkcWtob2Y3MyJ9.nWks4cNoybDOq9i2jGGywg";

var dataset = "../Assets/Data/clean_USA_power_plant_data.csv";

var stateSelect = d3.select("#state_select");
var energySelect = d3.select("#energy_select");
var yearSelect = d3.select("#year_select");

// function dropDownSelect(dropDown, dropDownValue) {
//   var dropDownValue = dropDown.node().value;
//   return dropDownValue
// }

energySelect.on("change", () => {
  var energySelectValue = energySelect.node().value;
  console.log(energySelectValue);
});

stateSelect.on("change", () => {
  var stateSelectValue = stateSelect.node().value;
  console.log(stateSelectValue);
});

yearSelect.on("change", () => {
  var yearSelectValue = yearSelect.node().value;
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
  var dateList = d3.select("#year_select");

  for (var i = 0; i < difYears.length; i++) {
    dateList.append("option").attr("value", `${difYears[i]}`).text(difYears[i]);
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
  } // Add our marker cluster layer to the map
  markerClusterGroup.addTo(myMap);

  var tbody = d3.select("#energy-tablebody");

  
  var columnNames = ["name", "state", "commissioning_year", "primary_fuel" , 
  "latitude", "longitude", "generation_gwh_2017"];

  const redux = array => array.map(o => columnNames.reduce((acc, curr) => {
    acc[curr] = o[curr];
    return acc;
  }, {}));

  var tableData = redux(data)

  tableData.forEach((earthQuake) => {
    // console.log(ufoRecord)
    var trow = tbody.append("tr");
    Object.entries(earthQuake).forEach(([key, value]) => {
        // console.log(key, value);
        var cell = trow.append("td");
        cell.text(value);
    })
})

  
  
  // for (const [key, value] of Obe) {
  //   Object.entries(data)
  // }
 
});


// Creating map object
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

// Grab the data with d3
