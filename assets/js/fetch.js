var input = document.querySelector('#input')
var search = document.querySelector('#search-button')
var weatherInfo = document.querySelector('.weather-info')
var cityArr = []

function checkLocalStorage() {
    var cities = JSON.parse(localStorage.getItem('cityArr'))
    if (cities && cities.length > 0) {
        for (var i = 0; i < cities.length; i++ ) {
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
        return;
    } else {
        cityArr.push(inputValue)
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
    var currentIcon = document.querySelector('.current-icon');
    currentIcon.src = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png` 
    currentDate.innerText = cityName + ' ' + date.toLocaleDateString()
    currentTemp.innerText = 'Temp: ' + data.current.temp + '°F'
    currentWind.innerText = data.current.wind_speed += ' MPH'
    currentHumidity.innerText = 'Humidity: ' + data.current.humidity + ' %'
    currentUVIndex.innerText = ' ' + data.current.uvi
    
    // Refactor to a switch case?
    var checkUVI  = () =>{
       if (data.current.uvi < 1) {
        currentUVIndex.style.backgroundColor = "green"
       } else if (data.current.uvi >= 2) {
        currentUVIndex.style.backgroundColor = "#6fa832"
       } else if (data.current.uvi >= 3) {
        currentUVIndex.style.backgroundColor = "##fbff24"
       } else if (data.current.uvi >= 4) {
        currentUVIndex.style.backgroundColor = "#a87f32"
    }    else if (data.current.uvi >= 5) {
        currentUVIndex.style.backgroundColor = "#ffb224"
    }    else if (data.current.uvi >= 6) {
        currentUVIndex.style.backgroundColor = "#ff2b24"
    }    else if (data.current.uvi >= 7) {
        currentUVIndex.style.backgroundColor = "#ad0c07"
    }    else if (data.current.uvi >= 8) {
        currentUVIndex.style.backgroundColor = "#ad0744"
    }    else if (data.current.uvi >= 9) {
        currentUVIndex.style.backgroundColor = "#ad0787"
    }    else  {
        currentUVIndex.style.backgroundColor = "#fa50db"
    }        
    }
    checkUVI()

    //5-day forecast
    for (var i = 0; i <= 4; i++) {
        var dayIcon = document.querySelector(`[data-icon='${i}']`); 
        var dayTemp = document.querySelector(`[data-temp='${i}']`);
        var dayHumidity = document.querySelector(`[data-humidity='${i}']`);
        var dayWind = document.querySelector(`[data-wind='${i}']`);
        var date = document.querySelector(`[data-date='${i}']`)
        var forecastDates = new Date(data.daily[i].dt * 1000) 
        date.innerText = forecastDates.toLocaleDateString()
        dayIcon.src = `http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`
        dayTemp.innerText = 'Temp: ' + data.daily[i].temp.day + ' °F'
        dayHumidity.innerText = 'Humidity: ' + data.daily[i].humidity + '%'
        dayWind.innerText = data.daily[i].wind_speed + ' MPH'
    }
}
