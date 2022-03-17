/* ---------------------------- */
/* Project  : Weather Dashboard */
/* File     : script.js         */
/* Author   : Vicente Garcia    */
/* Date     : 03/15/2022        */
/* Modified : 03/17/2022        */
/* ---------------------------- */
// Declares jQuery (DOM) to current info section
var currentInfoEl = $(".currentInfo");
var forecastEl = $(".weatherForecast");
// Declares cities array
var cities = [];
// Function to load (if exists) cities form local storage 
var loadCities = function(){
    // Call to local storage
    cities = JSON.parse(localStorage.getItem('searchCities'));
    if (cities){
        // Create button to each city found in local storage
        for (var i=0; i<cities.length; i++){
            createButton(cities[i]);
        };
    }else{
        // If there are nothing in local storage initializes global array variable
        cities = [];
    };
};
// Function to save a new search city
var saveCity = function(newCity){
    // Add new city searchedn to array
    cities.push(newCity);
    // Add to local storage array (plus 1 city)
    localStorage.setItem("searchCities", JSON.stringify(cities));
};
// Funtion to search city by button
var searchCityBtn = function(){
    // Call to function that search and display weather of a city
    searchWeather(this.textContent);
};
// Function to create a new city button
var createButton = function(createCity){
    // Declares variable with city name (received in parameter) replacing spaces with middle slash
    var idCity = createCity.replace(/ /g,"-");
    // Add to HTML by jQuery button with style classes and id to identify when clicked
    $(".cityButtons").append("<button id='" + idCity + "' class='rounded-3 mb-2 btn cityBtn'>"+ createCity +"</button>");
    // Add listener to new (or load) button to response on click
    $("#"+idCity).click(searchCityBtn);
    // Return city id (only works for new valid searches)
    return createCity;
};
// Funtion to show error in screen
var errorScreen = function(){
    forecastEl.addClass("d-none");
    currentInfoEl.empty();
    currentInfoEl.append("<h1 class='text-center text-danger my-5'>ERROR - THE CITY DOESN'T EXIST!</h1>");
}
// Function to display weather for city
var displayWeather = function(weatherData){
    // Format to current date (mm/dd/yyyy)
    var currentDate = moment().format("L");
    // Clear section for new wheater city info
    currentInfoEl.empty();
    // Declares new API to get UV index value
    var uviApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + weatherData.coord.lat + "&lon=" + weatherData.coord.lon + "&units=imperial&exclude=minutely,hourly,alerts&appid=1c8fa169aaefe22459f73ed7e1b2792b";
    // Call to API
    fetch(uviApiUrl).then(function(response) {
        // If API retrieves a weather data for the city coordinates
        if (response.ok) {
            response.json().then(function(data) {
                // Create elements in the current weather section
                currentInfoEl.append("<h3 class=''><strong>" + weatherData.name + " (" + weatherData.sys.country + ") - (" + currentDate + ") <img class='' src='http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png' width='60px'></strong></h3>");
                currentInfoEl.append("<p><strong>Temp: </strong>" + weatherData.main.temp + " °F</p>");
                currentInfoEl.append("<p><strong>Wind: </strong>" + weatherData.wind.speed + " MPH</p>");
                currentInfoEl.append("<p><strong>Humidity: </strong>" + weatherData.main.humidity + " %</p>");
                // Declares variable to define class color depending the UV Index level
                var uvRisk = "text-white ";
                // Declares variable to get absolute value of UV Index and validaters to define a level risk (color)
                var uvAbs = Math.abs(data.current.uvi);
                // Validation of UV Index level risk
                if (uvAbs < 3){
                    uvRisk = uvRisk + "uvLow";
                }else if (uvAbs > 2 && data.current.uvi < 6){
                    uvRisk = "uvModerate";
                }else if (uvAbs > 5 && data.current.uvi < 8){
                    uvRisk = uvRisk + "uvHigh";
                }else if (uvAbs > 7 && data.current.uvi < 11){
                    uvRisk = uvRisk + "uvVeryHigh";
                }else if (uvAbs > 10){
                    uvRisk = uvRisk + "uvExtreme";
                }
                // Create UV Index element
                currentInfoEl.append("<p><strong>UV Index: </strong><span class='" + uvRisk + " px-3 py-1 rounded'>" + data.current.uvi + "</span></p>");
                // Create forecast elements (5 days after today)
                forecastEl.removeClass("d-none");
                for (i=0; i<5; i++){
                    var strDay = ".day"+(i+1);
                    $(strDay).empty();
                    $(strDay).append("<h5>"+ moment().add(i+1,"d").format("L") +"</h5>");
                    $(strDay).append("<img class='' src='http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png' width='60px'>");
                    $(strDay).append("<p>Temp: " + data.daily[i].temp.day + " °F</p>");
                    $(strDay).append("<p>Wind: " + data.daily[i].wind_speed + " MPH</p>");
                    $(strDay).append("<p>Humidity: " + data.daily[i].humidity + " %</p>");
                };
            });
        }else{
            // If API doesn't retrieve data call function to clear screen and show a message about the city UV Index doesn't exist
            errorScreen();
        };
    });
};
// Function to search weather
var searchWeather = function(displayCity){
    // Declares main API to search by city (parameter sent by city button or search button)
    var mainApiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + displayCity + "&units=imperial&appid=1c8fa169aaefe22459f73ed7e1b2792b";
    // Variable to define if the button exists or not to save it in the search history
    var save = true;
    $(".weatherInfo").removeClass("d-none");
    // Call to api
    fetch(mainApiUrl).then(function(response) {
        // If API retrieves a weather data for the city
        if (response.ok) {
            // Do for each response
            response.json().then(function(data) {
                // Call function to display weather, send array object
                displayWeather(data);
                // For each city in the array validates if the city to search exists or is a new search thus new search button in the history search
                for (var i=0; i<cities.length; i++){
                    if (data.name.toUpperCase().trim() === cities[i].toUpperCase().trim()){
                        save = false
                    };
                };
                // If city doesn't exist before (in the array) creates a new button search by the city
                if (save){
                    // Call to save button but first create button through the create button function that remember returns the city to be used by save function
                    saveCity(createButton(data.name));
                };
            });
        }else{
            // If API doesn't retrieve data call function to clear screen and show a message about the city doesn't exist
            errorScreen();
        };
    });
};
// Function to search city
var searchCity = function(event){
    // Prevent to reload page because form
    event.preventDefault();
    // Declares variable for search field DOM
    var cityInputEl = document.querySelector("#city");
    // Declares variable with a value of city typed converted to lower case without spaces 
    var city = cityInputEl.value.toLowerCase().trim();
    // If city is typed clear field (for new searches) and call function to search weather to that city
    if (city){
        searchWeather(city);
        cityInputEl.value = "";
    };
};
// Listener on click form (when search a city) to call function that search a city
$("#search-form").submit(searchCity);
// Call function to load city buttons in local storage
loadCities();