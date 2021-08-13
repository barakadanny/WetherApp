'use strict';
const menuBtn = document.querySelector('.menu-bar');
const setting = document.querySelector('.settings');
const main = document.querySelector(".main");
const navigation = document.querySelector(".navigation");
const nav = document.querySelectorAll(".nav");

const headerBar = document.querySelector(".header-bar");
const currentTime = document.querySelector(".current-time");
const searchBtn = document.querySelector(".search-btn");
const inputData = document.querySelector(".input-data");

const blueColor = document.querySelector(".blue");
const redColor = document.querySelector(".red");
const yellowColor = document.querySelector(".yellow");
const greenColor = document.querySelector(".green");
const TempId = document.querySelector("#temp-id");
const cityName = document.querySelector(".city-name");
const cityIcon = document.querySelector(".weather-icon");
const CurrentCityName = document.querySelector(".current-town");
const CurrentCityTime = document.querySelector(".current-town-time");
const TownDate = document.querySelector(".town-date");
const TownHumidity = document.querySelector(".town-humidity");

// variables
let latitude, longitude, query, queriedFromSearch;
const metric='&units=metric'
const apiKey='&appid=abdd1f82a9fdc06feedefef68b5f4125'
const apiEndpoint ='https://api.openweathermap.org/data/2.5/weather?'

let theme = localStorage.getItem('theme');
if(theme == null){
    setMode("blue");
}else{
    setMode(theme);
}

// displaying the section
const menuDisplay=()=>{
    main.classList.toggle('set-black');
    setting.classList.toggle('set-active');
    menuBtn.classList.toggle("close");
    
}

// event handler
menuBtn.addEventListener('click', menuDisplay)

let btnMode = document.getElementsByClassName("modes");


for (let i = 0; btnMode.length > i ; i++) {
    btnMode[i].addEventListener('click',()=>{
        const mode = btnMode[i].dataset.mode;
        
        setMode(mode);

        menuDisplay();
    }) 
}
 function setMode(mode){
     if (mode == 'blue' ) {
         document.getElementById("theme-mode").href = '../styles.css'
         blueColor.classList.add("active");
         yellowColor.classList.remove("active");
         redColor.classList.remove("active");
         greenColor.classList.remove("active");
     }
     if (mode == 'red' ) {
         document.getElementById("theme-mode").href = 'theme/red.css'
         redColor.classList.add("active");
         yellowColor.classList.remove("active");
         blueColor.classList.remove("active");
         greenColor.classList.remove("active");
     }
     if (mode == 'yellow' ) {
         document.getElementById("theme-mode").href = 'theme/yellow.css'
         yellowColor.classList.add("active");
         blueColor.classList.remove("active");
         redColor.classList.remove("active");
         greenColor.classList.remove("active");
     }
     if (mode == 'green' ) {
         document.getElementById("theme-mode").href = 'theme/green.css'
         greenColor.classList.add("active");
         yellowColor.classList.remove("active");
         redColor.classList.remove("active");
         blueColor.classList.remove("active");
     }
     localStorage.setItem('theme', mode);
 }

let date,dayName,time,day;

window.onload = (e) => {
    getLocation()
    currentCityTime()
    date = new Date()
}

function currentCityTime(){
    date = new Date()
    dayName = new Intl.DateTimeFormat('en-US', {weekday: 'long'}).format();
    let hours = date.getHours()
    let minutes = date.getMinutes()
    time=`${hours<10?'0'+hours:hours} : ${minutes<10?'0'+minutes:minutes}`
    day = `${date.getDate()}`            
    CurrentCityTime.innerText=time
    TownDate.innerText = `${day}, ${dayName} ${ time}`
}

let refreshRate = 60000
let count = 0

setInterval(() => {
    currentCityTime()
}, 60000);

function getLocation(){
    navigator.geolocation.getCurrentPosition((position)=>{
        longitude = position.coords.longitude
        latitude = position.coords.latitude
        query = `lat=${latitude}&lon=${longitude}`
        fetch(apiEndpoint+query+metric+apiKey)
        .then(response => response.json())
        .then(data => {
            const tempr =data.main.temp
            const icon = 'http://openweathermap.org/img/wn/'+ data.weather[0].icon+'@2x.png';

            cityIcon.src = icon
            cityName.innerText = data.name
            CurrentCityName.innerText = data.name
            TempId.innerText = Math.floor(tempr)

            currentCityTime()
            TownHumidity.innerText= `Humidity: ${data.main.humidity}%`
            console.log(data)

        })
        }, (error)=>{
            console.log(`ERROR(${err.code}): ${err.message}`);
        }, {enableAccuracy:true, timeout:5000})
}

function search(){
    query = 'q='+inputData.value

    fetch(apiEndpoint+query+metric+apiKey)
    .then(response => response.json())
    .then(data => {
        const tempr =data.main.temp
        const icon = 'http://openweathermap.org/img/wn/'+ data.weather[0].icon+'@2x.png';

        cityIcon.src = icon
        queriedFromSearch = data.name
        cityName.innerText = queriedFromSearch
        TownHumidity.innerText= `Humidity: ${data.main.humidity}%`
        TempId.innerText = Math.floor(tempr)
        console.log(data)
    })
    .catch(err => alert("wrong city name"));
    
    inputData.value = ""    // clear input box

    // get query

    let recent = []

    let recentValue = {
        locationName: queriedFromSearch,
        favorite:false,
    }

    recent.push(recentValue)
    
    localStorage.setItem("recent", recent)

    for(let i=0; i<localStorage.getItem("recent").length; i++){
        console.log(localStorage.getItem("recent"))
    }

}
searchBtn.addEventListener('click', function(event){
    search()
})
document.addEventListener('keydown', function(event){
    if(event.key == "Enter"){
        if(!(inputData.value == null || inputData.value == "")){
            event.preventDefault();
            search()
        }else{
            alert('Please insert data')
        }
    }
})
// navigation section
function changeTab(event){
    const activeTab = document.querySelectorAll(".active")
    activeTab.forEach((e)=>{
        e.className = e.className.replace("active","")
    })
   event.target.className = "active"
}
navigation.addEventListener("click", changeTab, false)


// Models

// "recent":[{location1Name:string, favorite:boolean}, {location2:string, favorite:boolean},...]
// "favorites":[{location1Name:string, favorite:boolean}, {location1Name:string, favorite:boolean},...]
// "suggestion":[{location1Name:string, favorite:boolean}, {location1Name:string, favorite:boolean},...]