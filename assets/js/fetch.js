var input = document.querySelector('#input')
var search = document.querySelector('#search-button')
var history = document.querySelector('.history') 

renderHistory();

function renderHistory() {
    var inputValue = input.value

    if(!input) {
        return
    }

    console.log(inputValue)

    var li = document.createElement("li");
    var city = document.createTextNode(inputValue);
    li.appendChild(city);
    var element = document.querySelector('.history');
    element.appendChild(city);


}

search.addEventListener('click', function(e) {
    e.preventDefault();

    var inputValue = input.value

    if (inputValue === '') {
        alert("City cannot be blank");    
    }

    localStorage.setItem("city", JSON.stringify(inputValue));
    renderHistory();
})

async function getCurrent(input) {
    var myKey = "def35bfe62d36753cee6a89b19b55b81";
    // Change to addEventListener
    var cityName = window.localStorage.city
    var response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${myKey}`
    );

    var data = await response.json();
    convertLongLat(data.coord.lon, data.coord.lat)
}
getCurrent()

async function convertLongLat(lon, lat) {
    var myKey = "def35bfe62d36753cee6a89b19b55b81";
    var unit = 'imperial'
    var response = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${unit}&exclude=hourly,minutely&appid=${myKey}`
    );

    var data = await response.json();
    
    // Current Date
    var date = new Date(data.current.dt * 1000)
    var currentDate = document.querySelector('#current-date')
    currentDate.append(date.toLocaleDateString());
    var currentTemp = document.querySelector('.currentTemp');
    currentTemp.append(data.current.temp);
    var currentWind = document.querySelector('.currentWind');
    // Not sure if this is imperial
    currentWind.append(data.current.wind_speed += ' MPH');
    var currentHumidity = document.querySelector('.currentHumidity');
    currentHumidity.append(data.current.humidity + ' %');
    // Current UVI ---- MAKE GREEN
    var currentUVIndex = document.querySelector('.currentUVIndex');
    currentUVIndex.append(data.current.uvi);

    //5-day forecast
    for (i = 0; i <= 4; i++) {
        var date = document.querySelector(`[data-date='${i}']`)
        // Date doesnt work
        var forecastDates = new Date(data.daily[i].dt * 1000) 
        // Got mm/dd/yyy format from Yogi on stackoverflow
        // https://stackoverflow.com/questions/11591854/format-date-to-mm-dd-yyyy-in-javascript
        date.append(((forecastDates.getMonth() > 8) ? (forecastDates.getMonth() + 1) : ('0' + (forecastDates.getMonth() + 1))) + '/' + ((forecastDates.getDate() > 9) ? forecastDates.getDate() : ('0' + forecastDates.getDate())) + '/' + forecastDates.getFullYear());
        // Icons won't work
        var dayIcon = document.querySelector(`[data-icon='${i}']`) 
        dayIcon.append(data.daily[i].weather.icon)
        var dayTemp = document.querySelector(`[data-temp='${i}']`)
        dayTemp.append(data.daily[i].temp.day + ' °');
        var dayHumidity = document.querySelector(`[data-humidity='${i}']`)
        dayHumidity.append(data.daily[i].humidity + '%');
        var dayWind = document.querySelector(`[data-wind='${i}']`)
        dayWind.append(data.daily[i].wind_speed + ' MPH');
    }
}

