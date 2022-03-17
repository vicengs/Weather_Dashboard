/* ---------------------------- */
/* Project  : Weather Dashboard */
/* File     : script.js         */
/* Author   : Vicente Garcia    */
/* Date     : 03/15/2022        */
/* Modified : 03/16/2022        */
/* ---------------------------- */
var currentInfoEl = $(".currentInfo");
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
    var idCity = createCity.replace(/ /g,"-");
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
    currentInfoEl.empty();
    var uviApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + weatherData.coord.lat + "&lon=" + weatherData.coord.lon + "&units=imperial&exclude=minutely,hourly,alerts&appid=1c8fa169aaefe22459f73ed7e1b2792b";
    fetch(uviApiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                currentInfoEl.append("<h3 class=''><strong>" + weatherData.name + " (" + weatherData.sys.country + ") - (" + currentDate + ") <img class='' src='http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png' width='60px'></strong></h3>");
                currentInfoEl.append("<p><strong>Temp: </strong>" + weatherData.main.temp + " °F</p>");
                currentInfoEl.append("<p><strong>Wind: </strong>" + weatherData.wind.speed + " MPH</p>");
                currentInfoEl.append("<p><strong>Humidity: </strong>" + weatherData.main.humidity + " %</p>");
                var uvRisk = "text-white ";
                var uvAbs = Math.abs(data.current.uvi);
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
                currentInfoEl.append("<p><strong>UV Index: </strong><span class='" + uvRisk + " px-3 py-1 rounded'>" + data.current.uvi + "</span></p>");
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
            currentInfoEl.empty();
            currentInfoEl.append("<h1>THE CITY DOESN'T EXIST!</h1>");
        };
    });
};
var searchWeather = function(displayCity){
    var mainApiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + displayCity + "&units=imperial&appid=1c8fa169aaefe22459f73ed7e1b2792b";
    var save = true;
    fetch(mainApiUrl).then(function(response) {
        if (response.ok) {
            $(".weatherInfo").removeClass("d-none");
            response.json().then(function(data) {
                displayWeather(data);
                for (var i=0; i<cities.length; i++){
                    if (data.name.toUpperCase().trim() === cities[i].toUpperCase().trim()){
                        save = false
                    };
                };
                if (save){
                    saveCity(createButton(data.name));
                };
            });
        }else{
            currentInfoEl.empty();
            currentInfoEl.append("<h1>THE CITY DOESN'T EXIST!</h1>");
            $(".day1").empty();
            $(".day2").empty();
            $(".day3").empty();
            $(".day4").empty();
            $(".day5").empty();
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