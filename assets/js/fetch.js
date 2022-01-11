var input = document.querySelector('#input')
var search = document.querySelector('#search-button')
var weatherInfo = document.querySelector('.weather-info')


var cityArr = []

// function check to see if there is anything in local storage 
// Use a for loop to append each item in the for loop
// Clear renderHistory when the page loads
// Do line 17 through 21

// var myStorage = wi
// console.log(window.localStorage.cityArr[0].length)


function checkLocalStorage() {
    var cities = JSON.parse(window.localStorage.getItem('cityArr'))
    if (cities && cities.length > 0) {
        for (var i = 0; i < cities.length; i++ ) {
            console.log('for loop works')
            var li = document.createElement("li");
            li.classList.add("city-name");
            li.addEventListener('click', historyName)
            li.innerText = cities[i];
            var history = document.querySelector('.history') 
            history.appendChild(li);
        }
        getCurrent(cities[cities.length - 1])
    } 
}
checkLocalStorage()

function renderHistory() {
    var inputValue = input.value
    if(!input) {
        return
    }
    var li = document.createElement("li");
    li.classList.add("city-name");
    li.addEventListener('click', historyName)
    li.innerText = inputValue;
    var history = document.querySelector('.history') 
    history.appendChild(li);
}

function historyName(e) {
    getCurrent(e.target.innerText)
}

search.addEventListener('click', function(e) {
    e.preventDefault();

    var inputValue = input.value

    if (inputValue === '') {
        alert("City cannot be blank");    
    } else {
        cityArr.push(inputValue)
        // console.log(cityArr)
    }

    localStorage.setItem("cityArr", JSON.stringify(cityArr));
    renderHistory();
    getCurrent(inputValue)
})

async function getCurrent(input) {
    var myKey = "def35bfe62d36753cee6a89b19b55b81";
    var cityArr = JSON.parse(localStorage.getItem('cityArr'))
    
    if (cityArr.length > 0) {
    var response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${myKey}`);

    var data = await response.json();
    convertLongLat(data.coord.lon, data.coord.lat, data.name)
    }
    // console.log(data);
}
if (cityArr.length > 0) {
    var cityArr = JSON.parse(localStorage.getItem('cityArr')) 
    getCurrent(cityArr[0])
}

async function convertLongLat(lon, lat, cityName) {
    var myKey = "def35bfe62d36753cee6a89b19b55b81";
    var unit = 'imperial'
    var response = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${unit}&exclude=hourly,minutely&appid=${myKey}`
    );

    // Current Date
    var data = await response.json();
    var date = new Date(data.current.dt * 1000)  
    var currentDate = document.querySelector('#current-date')
    var currentTemp = document.querySelector('.currentTemp');
    var currentWind = document.querySelector('.currentWind');
    var currentHumidity = document.querySelector('.currentHumidity'); 
    var currentUVIndex = document.querySelector('.currentUVIndex');

    currentDate.innerText = cityName + ' ' + date.toLocaleDateString()

    currentTemp.innerText = 'Temp: ' + data.current.temp + '°F'
    currentWind.innerText = data.current.wind_speed += ' MPH'
    currentHumidity.innerText = 'Humidity: ' + data.current.humidity + ' %'
    currentUVIndex.innerText = 'UV Index: ' + data.current.uvi

    //5-day forecast
    for (var i = 0; i <= 4; i++) {
        var dayIcon = document.querySelector(`[data-icon='${i}']`); 
        var dayTemp = document.querySelector(`[data-temp='${i}']`);
        var dayHumidity = document.querySelector(`[data-humidity='${i}']`);
        var dayWind = document.querySelector(`[data-wind='${i}']`);
        var date = document.querySelector(`[data-date='${i}']`)
        var forecastDates = new Date(data.daily[i].dt * 1000) 
        date.innerText = forecastDates.toLocaleDateString()
        dayIcon.innerText = data.daily[i].weather.icon
        dayTemp.innerText = 'Temp: ' + data.daily[i].temp.day + ' °F'
        dayHumidity.innerText = 'Humidity: ' + data.daily[i].humidity + '%'
        dayWind.innerText = data.daily[i].wind_speed + ' MPH'
    }
}

// function init() {
//     renderHistory();
//   }
//   init();
  
