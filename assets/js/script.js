/* ---------------------------- */
/* Project  : Weather Dashboard */
/* File     : script.js         */
/* Author   : Vicente Garcia    */
/* Date     : 03/15/2022        */
/* Modified : 03/15/2022        */
/* ---------------------------- */
var cities = [];
var loadCities = function(){
    cities = JSON.parse(localStorage.getItem('searchCities'));
    // If there are nothing in local storage initializes global array variable
    if (cities){
        for (var i=0; i<cities.length; i++){
            createButton(cities[i]);
        };
    }else{
        cities = [];
    };
};
var saveCity = function(newCity){
    cities.push(newCity);
    localStorage.setItem("searchCities", JSON.stringify(cities));
};
var searchCityBtn = function(){
    searchWeather(this.textContent);
};
var createButton = function(createCity){
    //var arrCityButton = createCity.split(' ');
    var idCity = createCity.replace(" ","-");
    /*for (var i = 0; i < arrCityButton.length; i++) {
        arrCityButton[i] = arrCityButton[i].charAt(0).toUpperCase() + arrCityButton[i].substring(1);
    };
    var cityButton = arrCityButton.join(' ');*/
    $(".cityButtons").append("<button id='" + idCity + "' class='rounded-3 mb-2 btn cityBtn'>"+ createCity +"</button>");
    $("#"+idCity).click(searchCityBtn);
    return createCity;
};
var displayWeather = function(weatherData){
    var currentDate = moment().format("L");
    var currentInfoEl = $(".currentInfo");
    currentInfoEl.empty();
    //console.log("Lat: "+data.coord.lat);
    //console.log("Lon: "+data.coord.lon);
    //console.log("Icon: "+data.weather.icon);
    //console.log(data);
    currentInfoEl.append("<h3 class='mb-3'>" + weatherData.name + " (" + currentDate + ") icon</h3>");
    currentInfoEl.append("<p>Temp: " + weatherData.main.temp + " °F</p>");
    currentInfoEl.append("<p>Wind: " + weatherData.wind.speed + " MPH</p>");
    currentInfoEl.append("<p>Humidity: " + weatherData.main.humidity + " %</p>");
    currentInfoEl.append("<p>UV Index: " +  + "</p>");
};
var searchWeather = function(displayCity){
    //var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=30.26715&lon=-97.74306&appid=1c8fa169aaefe22459f73ed7e1b2792b";
    var mainApiUrl = "http://api.openweathermap.org/data/2.5/weather?q="+displayCity+"&appid=1c8fa169aaefe22459f73ed7e1b2792b";
    var save = true;
    fetch(mainApiUrl).then(function(response) {
        if (response.ok) {
            $(".weatherInfo").removeClass("d-none");
            response.json().then(function(data) {
                displayWeather(data);
                for (var i=0; i<cities.length; i++){
                    if (displayCity.toUpperCase().trim() === cities[i].toUpperCase().trim()){
                        save = false
                    };
                };
                if (save){
                    saveCity(createButton(data.name));
                };
            });
        }else{
            console.log('Error: Weather Not Found');
        };
    });
};
var searchCity = function(event){
    event.preventDefault();
    var cityInputEl = document.querySelector("#city");
    var city = cityInputEl.value.toLowerCase().trim();
    if (city){
        searchWeather(city);
        cityInputEl.value = "";
    };
};
$("#search-form").submit(searchCity);
loadCities();