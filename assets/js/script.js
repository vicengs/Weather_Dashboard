/* ---------------------------- */
/* Project  : Weather Dashboard */
/* File     : script.js         */
/* Author   : Vicente Garcia    */
/* Date     : 03/15/2022        */
/* Modified : 03/15/2022        */
/* ---------------------------- */
//var searchFormEl = document.querySelector("#search-form");
var createButton = function(createCity){
    var arrCityButton = createCity.split(' ');
    for (var i = 0; i < arrCityButton.length; i++) {
        arrCityButton[i] = arrCityButton[i].charAt(0).toUpperCase() + arrCityButton[i].substring(1);
    };
    var cityButton = arrCityButton.join(' ');
    $(".cityButtons").append("<button id='" + createCity + "' class='rounded-3 mb-2 btn cityBtn'>"+ cityButton +"</button>");
};
var displayWeather = function(displayCity){
    createButton(displayCity);
};
var searchCity = function(event){
    event.preventDefault();
    var cityInputEl = document.querySelector("#city");
    var city = cityInputEl.value.toLowerCase().trim();
    if (city){
        displayWeather(city);
        cityInputEl.value = "";
    };
};
$("#search-form").submit(searchCity);
$(".cityButtons button").click(function(){
    console.log("PRUEBA");
});