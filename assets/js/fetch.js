async function getCurrent(input) {
    var myKey = "def35bfe62d36753cee6a89b19b55b81";
    // Change to addEventListener
    var atl = 'Atlanta'
    var response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${atl}&appid=${myKey}`
    );

    var data = await response.json();
    
    console.log(data);
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

    // Current Temp
    var currentTemp = document.querySelector('.currentTemp');
    currentTemp.append(data.current.temp);

    // Current Wind
    var currentWind = document.querySelector('.currentWind');
    // Not sure if this is imperial
    currentWind.append(data.current.wind_speed);

    // Current Humidity 
    var currentHumidity = document.querySelector('.currentHumidity');
    currentHumidity.append(data.current.humidity);

    // Current UVI
    var currentUVIndex = document.querySelector('.currentUVIndex');
    currentUVIndex.append(data.current.uvi);
}


