



const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const notificationElement = document.querySelector(".notification");
const feelsLikeElement = document.querySelector(".temperature-feels-like-value p")
const tempHighElement = document.querySelector(".temperature-high-value p")
const tempLowElement = document.querySelector(".temperature-low-value p")
const humidityElement = document.querySelector(".humidity p")
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");



const weather = {};

weather.temperature = {
    unit : "celsius"
}


if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError)
}
else{
    notificationElement.style.display = "block"
    notificationElement.innerHTML= `<p>Browser doesn't Support Geolocation</p>`
}

function setPosition (position){
    let latitude = position.coords.latitude
    let longitude = position.coords.longitude
   
        getWeather(latitude, longitude)
}

function showError (error){
    notificationElement.style.display= "block"
    notificationElement.innerHTML= `<p> ${error.message} </p>`
}




const kelvin = 273  
const key = "021b6592f1d6cd88cabae5596138c71e"  

function getWeather(latitude, longitude){
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    
    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            console.log(data)
            weather.temperature.value = Math.floor(data.main.temp - kelvin);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.tempfeelslike = Math.floor(data.main.feels_like - kelvin);
            weather.tempHigh = Math.floor(data.main.temp_max - kelvin +2);
            weather.tempLow = Math.floor(data.main.temp_min - kelvin -4); 
            weather.humidity = data.main.humidity;
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.bgTitle= data.weather[0].description;
            

        })
        .then(function(){
            displayWeather();
            displayBackground();
        });
}


function displayBackground (){
    document.body.style.cssText = `background-image:linear-gradient(to bottom,rgba(0,0,0, 0),rgba(0,0,0, 100)), url(https://source.unsplash.com/1600x900/?${weather.bgTitle}) ;`
}


function displayWeather(){  
    iconElement.innerHTML=` <img src="./icons/${weather.iconId}.png" alt="weather-icon"></img>`
    tempElement.innerHTML= `${weather.temperature.value}°<span>C</span>`
    feelsLikeElement.innerHTML= `Feels like - ${weather.tempfeelslike}°<span>C</span>`
    tempHighElement.innerHTML = `Max - ${weather.tempHigh}°<span>C</span>`
    tempLowElement.innerHTML = `Min - ${weather.tempLow}°<span>C</span>`
    humidityElement.innerHTML = `Humidity - ${weather.humidity}<span>%</span>`
    descElement.innerHTML=`${weather.description}`
    locationElement.innerHTML= `${weather.city}, ${weather.country}`
}



function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}


tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;
    
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});

