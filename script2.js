const userTab = document.querySelector("[data-user-Weather]"); // user tab (your weather Tab)
const searchTab = document.querySelector("[data-searchWeather]"); // search tab
const userContainer = document.querySelector(".weather-container"); // grant location container 


const grantAccessContainer = document.querySelector(".grant-location-container"); // grant location container - inside the wheather contianer  
const searchForm = document.querySelector("[data-searchForm]");  // data search form container 
const loadingScreen = document.querySelector(".loading-container");  // loading container 
const userInfoContainer = document.querySelector(".user-info-container"); // show whole wheather info 


let oldTab = userTab; // old TAb == current TAb
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab"); // adding background color to cliked tab 
getfromSessionStorage();

// those tab will come that have clicked through the addEventelistner in switchTab function 
function switchTab(newTab){  // New Tab == Clicked TAb
    if(newTab != oldTab){
        oldTab.classList.remove("current-tab");   // remove the background color once switched the tab
        oldTab = newTab; // old tab become current tab
        oldTab.classList.add("current-tab");   // add background color on present tab 


        if(!searchForm.classList.contains("active")){
            // kya search form wala container is invisible, if yes then make it visible .
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // mai pahle search wale tab par tha , ab your whether tab visible karna hai 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // ab mai your whetehr tab mai aa gaya hoo , tou whether bhi display karna padega , so let's check  local storage first
            // for coordinates , if we have saved them there. 
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click",() =>{
       // pass clicked tab as input parameter
    switchTab(userTab);
    })

searchTab.addEventListener("click",()=>{
    // pass Cliked tab as input parameter 
    switchTab(searchTab);
})

// check if coordinates are alreday present in session storage . 
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");  // web storage - store the data till the browser tab open .
    if(!localCoordinates){
        // agar local coordinate nahi mile 
        grantAccessContainer.classList.add("active");
    }

    else{
        const coordinate =JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinate);
    }
}


async function fetchUserWeatherInfo(coordinate){
    const {lat, lon} = coordinate;

    // make grantContainer inVisible 
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    // API CALL 
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`   
          );

          const data = await response.json();

          // ab data aa gaya , ab loader ko hata do 
          loadingScreen.classList.remove("active");
          userInfoContainer.classList.add("active");
          renderWeatherInfo(data);
    }   
    catch(err){
         console.log("Search - Api Fetch Error", error.message);
        loadingScreen.classList.remove("active");
        apiErrorContainer.classList.add("active");
        apiErrorMessage.innerText = `${err?.message}`;
        apiErrorBtn.style.display = "none";
    }
}


function renderWeatherInfo(weatherInfo){
        // Firstly we have to fetch Elements
         const cityName=document.querySelector("[data-cityName]");
         const countryIcon = document.querySelector("[data-countryIcon]");
         const desc = document.querySelector("[data-weatherDesc]");
         const WeatherIcon = document.querySelector("[data-weatherIcon]");
         const temp =document.querySelector("[data-temp]");
         const windspeed = document.querySelector("[data-windspeed]");
         const humidity =document.querySelector("[data-humidity]");
         const cloudiness = document.querySelector("[data-cloudiness]");


         // Fetch values from weatherInfo object and put it on UI Elements . 
         cityName.innerText = weatherInfo?.name;
         countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`; // toLowerCase use to convert in lowercase
         desc.innerText = weatherInfo?.weather?.[0]?.description;
         WeatherIcon.src =  `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
         temp.innerText = `${weatherInfo?.main?.temp}°C`;
         windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`; 
         humidity.innerText = `${weatherInfo?.main?.humidity}%`;
         cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
         console.log(weatherInfo);
}       

            function getLocation(){
                if(navigator.geolocation){  // Using Geolocation API 
                    navigator.geolocation.getCurrentPosition(showPosition);
                }   
                else{
                    grantAccessBtn.style.display = "none";
                    messageText.innerText = "Geolocation is not supported by this browser.";
                }
            }
                function showPosition(position){
                     const userCoordinates = {
                       lat: position.coords.latitude,
                       lon: position.coords.longitude,  
                     }

                     sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates)) // save the coordinates 
                     fetchUserWeatherInfo(userCoordinates);
                } 
        const grantAccessBtn = document.querySelector("[data-grantAccess]");
        grantAccessBtn.addEventListener("click",getLocation);

        const searchInput = document.querySelector("[data-searchInput]");
        searchForm.addEventListener("submit",(e)=>{
            e.preventDefault();
            let cityName = searchInput.value;

            if(cityName === "")
                return;
            else 
            fetchSearchWeatherInfo(cityName);
        })


         async function fetchSearchWeatherInfo(city){
                loadingScreen.classList.add("active");
                userInfoContainer.classList.remove("active");
                grantAccessContainer.classList.remove("active");

                try{
                    const response= await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
                      );
                      const data = await response.json();
                      loadingScreen.classList.remove("active");
                      userInfoContainer.classList.add("active");
                      renderWeatherInfo(data);
                }
                catch(err){
                    console.log("Search - Api Fetch Error", error.message);
                        loadingScreen.classList.remove("active");
                        apiErrorContainer.classList.add("active");
                        apiErrorMessage.innerText = `${error?.message}`;
                        apiErrorBtn.style.display = "none";
                }
           }