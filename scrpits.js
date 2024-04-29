
/*f96fc290e3a2f1a0e562a0626ef9f3c4
https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key} */

const userTab = document.querySelector("[data-userWeather");
const searchTab = document.querySelector("[data-searchWeather");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let currTab = userTab;
const API_KEY = "f96fc290e3a2f1a0e562a0626ef9f3c4";
currTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab (clickedTab) {
    if(clickedTab != currTab)
    {
        currTab.classList.remove("current-tab");
        currTab = clickedTab;
        currTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active"))
        {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else
        {
            //main serach p hu dusre p jana hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab your waether m hu to weather bhi chaiye
            getfromSessionStorage();
        }
    }
}
userTab.addEventListener("click", ()=>{
    switchTab(userTab);
})
searchTab.addEventListener("click", ()=>{
    switchTab(searchTab);
})

//check if cordinates are alreday their in storage
function getfromSessionStorage () {
    const localCoordinates = sessionStorage.getItem("user-coordintes");
    if(!localCoordinates)
    {
        grantAccessContainer.classList.add("active");
    }
    else
    {
        const coordintes = JSON.parse(localCoordinates);
        getMyWeather(coordintes);
    }
}


function renderWeatherInfo(data) {
    console.log(data);
    const cityNameElement = document.querySelector("[data-cityName]");
    const countryIconElement = document.querySelector("[data-countryIcon]");
    const descElement = document.querySelector("[data-weatherDesc]");
    const weatherIconElement = document.querySelector("[data-weatherIcon]");
    const tempElement = document.querySelector("[data-temp]");
    const windSpeedElement = document.querySelector("[data-windSpeed]");
    const humidityElement = document.querySelector("[data-humidity]");
    const cloudinessElement = document.querySelector("[data-clouds]");

    if (cityNameElement) cityNameElement.innerText = data?.name;
    if (countryIconElement) countryIconElement.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    if (descElement) descElement.innerText = data?.weather?.[0]?.description;
    if (weatherIconElement) weatherIconElement.src = `https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    if (tempElement) tempElement.innerText = `${Math.round((data?.main?.temp)-273.15)}°C`;
    if (windSpeedElement) windSpeedElement.innerText = `${data?.wind?.speed}m/s`;
    if (humidityElement) humidityElement.innerText = `${data?.main?.humidity}%`;
    if (cloudinessElement) cloudinessElement.innerText = `${data?.clouds?.all}%`;
}


async function getMyWeather(coordintes) {
    
    const {lat,longi} = coordintes;
    //make grantacess invisible
    grantAccessContainer.classList.remove("active");
    //makeloader visible
    loadingScreen.classList.add("active");
    try{

        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${longi}&appid=${API_KEY}`);
        const data = await res.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err)
    {
        loadingScreen.classList.remove("active");
        alert("get-An error occurred: " + err.message);
    }
}

const grantAccessBtn = document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener("click",getLocation)

async function getLocation(){
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("No geo Location Support");
    }
}
function showPosition(position) {
    const userCoordinates = {
        lat : position.coords.latitude,
        longi : position.coords.longitude
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    getMyWeather(userCoordinates);
}

let searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e)=> {
    e.preventDefault();
    if(searchInput.value === "") return;

    fetchshowWeather(searchInput.value);
})
async function fetchshowWeather(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
    
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err)
    {
        alert("fetch-An error occurred: " + err.message);
    }
}

