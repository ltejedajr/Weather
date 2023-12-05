"use strict";

const selectCityDropDown = document.getElementById("selectCityDropDown");
const outputTable = document.getElementById("outputTable");

let cities = [
    { city: "Benbrook", state: "TX", Latitude: 32.6732, Longitude: -97.4606 },
    { city: "New York", state: "NY", Latitude: 40.7494660756725, Longitude: -73.98631695010853 },
    { city: "Boston", state: "MA", Latitude: 42.36012879581044, Longitude: -71.06428786281721 },
    { city: "Miami", state: "FL", Latitude: 25.747253883400695, Longitude: -80.27280719792577 },
    { city: "Houston", state: "TX", Latitude: 29.717857270255173, Longitude: -95.39037912087866 },
    { city: "Los Angeles", state: "CA", Latitude: 34.07931799934762, Longitude: -118.47560837599745, },
    { city: "Seattle", state: "WA", Latitude: 47.6062, Longitude: -122.3321 },
    { city: "Portland", state: "ME", Latitude: 43.680031, Longitude: -70.310425 },
];



window.onload = init;

function init() {
    // make sure to sore the cities first.
    cities.sort(compareCities);

    //add a unique key to the cities for later lookup.
    createCityKeys();

    //populate the dropdown.
    selectCityDropDownPopulate();

    selectCityDropDown.onchange = selectCityDropDownOnChange;
}

function createCityKeys(){
    let currentId = 0;
    for (let city of cities){
        city.id = currentId++;
    }

}

function selectCityDropDownPopulate() {

    let option = new Option("Select a city...", -1);
    selectCityDropDown.appendChild(option);

   // console.log(cities);

    for(let city of cities){
        let option = new Option(`${city.city} ${city.state}`, city.id);
        selectCityDropDown.appendChild(option);
    }

}

function selectCityDropDownOnChange(){

    let city = cities.find( city => city.id == selectCityDropDown.value)

    outputTableClear();

    if(city == undefined) {
        return;
    }

    //https://api.weather.gov/points/32.6791,-97.4641

    let firstUrl = "https://api.weather.gov/points/" + city.Latitude + "," + city.Longitude;

    console.log(firstUrl);

    fetch(firstUrl)
        .then(r => r.json())
        .then(
            data => {
                let forecastUrl = data.properties.forecast;
                //next step is to use this url for a secondary call!
                console.log(forecastUrl);
                getForecast(forecastUrl);

        }
    );

    //get a response from the first api request:


    console.log(city);

}

function getForecast(forecastUrl){
    fetch(forecastUrl)
        .then( r => r.json())
        .then( data => {
            let periods = data.properties.periods;
            outputTablePopulate(periods);
//console.log(data);
        });
}

function outputTablePopulate(periods){

    for(let period of periods){
        let periodtext = period.name;
        let temperature = "Temperature " + period.temperature + " " + period.temperatureUnit;
        let winds = "Winds " + period.windDirection + " " + period.windSpeed;
        let forecast = period.shortForecast;   
        
        outputTableAddRow(periodtext, temperature, winds, forecast);
    }

    console.log(periods);

}

function outputTableAddRow(period, temperature, winds, forecast){
    let row = outputTable.insertRow(-1);
    let cell1 = row.insertCell(0);
    cell1.innerHTML = period;

    let cell2 = row.insertCell(1);
    cell2.innerHTML = temperature;

    let cell3 = row.insertCell(2);
    cell3.innerHTML = winds;

    let cell4 = row.insertCell(3);
    cell4.innerHTML = forecast;
}

function outputTableClear(){
    outputTable.innerHTML = "";
}

function compareCities(a, b) {
    if (a.city < b.city) {
        return -1;
    }
    else if (a.city == b.city) {
        return 0;
    }
    else {
        return 1;
    };
}