var MasterArr = [];     // DECLARING MASTER ARRAY FOR STRORING CITIES DATA

// TASKS TO DO WHEN SITE IS READY
$(document).ready(function () {
  console.log("JS is working properly!")
  // SETTING UP SYSTEM DEFAULT THEME OF WEBSITE
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    $('html').addClass('dark');
  } else {
    $('html').removeClass('dark');
  }

  // DETECTING THE LOCATION (Longitude and Latitude) OF CLIENT TO DISPLAY HIS RELEVENT DATA
  (async function () {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        let longitude = position.coords.longitude;
        let latitude = position.coords.latitude;
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=6618b265c24f3e0e2f3821f553b1a57e`;
        await fetch(url)
          .then(async (response) => await response.json())
          .then((response) => {
            if (response["cod"] !== "400") {
              // IF API SUCCESSFULLY DETECTS THE LOCATION
              let url = `https://api.openweathermap.org/data/2.5/weather?q=${response["name"]}&appid=6618b265c24f3e0e2f3821f553b1a57e`;
              populateData(url, response["name"]);
            }
            else {
              // ELSE POPULATING THE WEATHER DATA OF ISLAMABAD
              console.log("Error Occured: " + error);
              let url = `https://api.openweathermap.org/data/2.5/weather?q=Islamabad&appid=6618b265c24f3e0e2f3821f553b1a57e`;
              populateData(url, "Islamabad");
            }
          })
          .catch((error) => {
            // IF RESPONSE CATCHES ERROR THEN DISPLAYING DATA OF ISLAMABAD (BY DEFAULT)
            console.log("Error Occured: " + error);
            let url = `https://api.openweathermap.org/data/2.5/weather?q=Islamabad&appid=6618b265c24f3e0e2f3821f553b1a57e`;
            populateData(url, "Islamabad");
          })
      },
      (error) => {
        // IF FETCH THROW AN ERROR THEN DISPLAYING DATA OF ISLAMABAD (BY DEFAULT)
        console.log("Error Occured: " + error);
        let url = `https://api.openweathermap.org/data/2.5/weather?q=Islamabad&appid=6618b265c24f3e0e2f3821f553b1a57e`;
        populateData(url, "Islamabad");
      })
  })()
})

// IMPORTING CITIES FOR TYPE AHEAD SUGGESTIONS
import states from './worldcities.js';
// WHILE INPUTTING, THIS WILL PROMPT USER ABOUT THE RELEVENT CITIES / AREAS
$('#country').on('input', () => {
  const inputText = $('#country').val().trim().toLowerCase();
  const filteredStates = states.filter((state) => {
    return state.name.toLowerCase().includes(inputText);
  });
  // DISPLAYING SUGGESTION LIST
  $('#suggestions-list').html("");
  if (filteredStates.length > 0) {
    filteredStates.forEach((state) => {
      const litElement = $('<li>');
      litElement.addClass("py-2 px-3 cursor-pointer border-transparent rounded-md transition dark:hover:bg-[#2d2d2d] hover:bg-gray-400");
      litElement.text(state.name);
      litElement.on('click', () => {
        $('#country').val(state.name);
        $('#suggestions-list').html("");
        $('#search').click();
      })
      $('#suggestions-list').append(litElement);
    })
    $('#suggestions-list').css('display', 'block');
  }
  else {
    $('#suggestions-list').css('display', 'none');
  }
})

// START SEARCHING THE INPUT CITY
// IF USER CLICKS THE SEARCH ICON
$('#search').on('click', (e) => {
  e.preventDefault();
  let country = $('#country').val();
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=6618b265c24f3e0e2f3821f553b1a57e`;
  populateData(url);
})
// IF USER PRESSES "ENTER" KEY
$('#country').on('keypress', (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    let country = $('#country').val();
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=6618b265c24f3e0e2f3821f553b1a57e`;
    populateData(url);
  }
})

// LIGHT / DARK MODE TOGGLER
$('#themeChange').on('click', (e) => {
  $('html').toggleClass('dark');
})

// FOCUSING THE SEARCH BAR IF USER PRESSES Alt+I (No matter whether CapsLock is ON or OFF)
window.addEventListener('keypress', (e) => {
  if (e.key === 'I' || e.key === 'i') {
    $('#country').focus();
  }
})

// HIDING THE SUGESSION LIST IF USER CLICKS ANYWHERE ON THE SCREEN
$(document).on('click', function (e) {
  if (!$(e.target).closest('#suggestions-list').length && e.target !== $('#country')[0]) {
    $('#suggestions-list').css('display', 'none');
  }
});

// POPULATING DATA FROM THE FETCHED API
let populateData = async function (url, city_name) {
  let response = await fetch(url)
    .then(async (response) => {
      return await response.json();
    })
    .then((response) => {
      try {
        if (response["cod"] === "404") {
          // CHECKS IF ENTERED CITY EXISTS OR NOT
          alert(response["message"]);
          $('#country').val("");
          $('#country').blur();
          $('#suggestions-list').css('display', 'none');
          $('#preloader').css('display', 'none');
          throw new Error("Error: Wrong City Entered");
        }
      } catch (error) {
        console.log(error.message + "wronglocatin entered");
        return;
      }

      // DISPLAYING CITY NAME, FETCHING FROM SEARCH BAR.
      if (city_name === undefined) {
        $(".location-name").html($('#country').val().charAt(0).toUpperCase() + $('#country').val().slice(1).toLowerCase());
        // UPDATING THE SEARCHED HISTORY, (when searched by user)
        update($('#country').val().toLowerCase());
      }
      else {
        // UPDATING THE SEARCHED HISTORY, (while loading website)
        update(city_name.toLowerCase());
      }

      // TIME SETTING
      let riseTime = new Date(parseInt(response["sys"]["sunrise"]) * 1000);
      let SunRiseTime;
      if (riseTime.getMinutes() < 10) {
        SunRiseTime = `${riseTime.getHours()}:0${riseTime.getMinutes()}`;
      }
      else {
        SunRiseTime = `${riseTime.getHours()}:${riseTime.getMinutes()}`;
      }

      let setTime = new Date(parseInt(response["sys"]["sunset"]) * 1000);
      let SunSetTime;
      let hours = setTime.getHours();
      if (hours > 12) {
        hours -= 12;
      }
      if (setTime.getMinutes() < 10) {
        SunSetTime = `${hours}:0${setTime.getMinutes()}`;
      }
      else {
        SunSetTime = `${hours}:${setTime.getMinutes()}`;
      }


      // PUSHING DATA TO MASTER ARRAY
      let subArr =
      {
        // "city": city,
        "temp": response["weather"]["0"]["description"],
        "windSpeed": response["wind"]["speed"] + " mph",
        "windDirection": response["wind"]["deg"] + "&deg;",
        "sunRise": SunRiseTime,
        "sunSet": SunSetTime,
        "minTemp": (((parseFloat(response["main"]["temp_min"]) - 273.15)).toFixed(1)),
        "maxTemp": (((parseFloat(response["main"]["temp_max"]) - 273.15)).toFixed(1))
      }
      MasterArr.push(subArr);

      $('#country').val("");
      $('#country').blur();
      $('#suggestions-list').css('display', 'none');
      // $('#preloader').css('display', 'none');
    })
}

// UPDATING THE DATA IN LOCAL-STORAGE
function update(city_name) {
  if (localStorage.getItem('searchedCities') == null) {
    let searchedCitiesArr = [];
    searchedCitiesArr.push(city_name.toLowerCase());
    localStorage.setItem('searchedCities', JSON.stringify(searchedCitiesArr));
  }
  else {
    let searchedCitiesArr = localStorage.getItem('searchedCities');
    searchedCitiesArr = JSON.parse(searchedCitiesArr);
    let ifExists = searchedCitiesArr.some((city) => {
      if (city_name == city) return true;
    })
    if (!ifExists && city_name != null) {
      searchedCitiesArr.push(city_name);
      localStorage.setItem('searchedCities', JSON.stringify(searchedCitiesArr));
      populatingHistory();
    }
    else {
      localStorage.setItem('searchedCities', JSON.stringify(searchedCitiesArr));
      $('#placeholder').css('display', 'none');
      populatingHistory();
    }
  }
}

// UPDATING SEARCHED HISTORY
let populatingHistory = async () => {
  let searchedCitiesArr = localStorage.getItem('searchedCities');
  searchedCitiesArr = JSON.parse(searchedCitiesArr);
  if (searchedCitiesArr.length < 1) {
    $('.history').css('display', 'none');
    return;
  }
  else {
    $('.history').css('display', 'block');
  }

  let str = "";
  searchedCitiesArr.forEach(async (city, index) => {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=6618b265c24f3e0e2f3821f553b1a57e`;
    let response = await fetch(url)
      .then(async (response) => {
        return await response.json();
      })
      .then((response) => {

        // CALCULATING SUNRISE & SUNSET TIMES AS GIVEN IN UNIX TIMESTAMPS
        let riseTime = new Date(parseInt(response["sys"]["sunrise"]) * 1000);
        let SunRiseTime;
        if (riseTime.getMinutes() < 10) {
          SunRiseTime = `${riseTime.getHours()}:0${riseTime.getMinutes()}`;
        }
        else {
          SunRiseTime = `${riseTime.getHours()}:${riseTime.getMinutes()}`;
        }

        let setTime = new Date(parseInt(response["sys"]["sunset"]) * 1000);
        let SunSetTime;
        let hours = setTime.getHours();
        if (hours > 12) {
          hours -= 12;
        }
        if (setTime.getMinutes() < 10) {
          SunSetTime = `${hours}:0${setTime.getMinutes()}`;
        }
        else {
          SunSetTime = `${hours}:${setTime.getMinutes()}`;
        }
        
        const imageAddresses = ['images/weather-icon.svg','images/wind.svg','images/compass.svg','images/day.svg','images/night.svg','images/temp-low.svg','images/temp-high.svg'];
        // MAKING ROWS TO SHOW
        str += `
          <div
      class=" sm:container sm:mx-auto xsm:mb-8 xsm:mx-3 border-gray-800 lg:px-8 sm:px-6 xsm:px-2 py-3 flex sm:flex-row xsm:flex-col sm:items-center xsm:items-start sm:justify-between xsm:justify-around bg-gradient-to-r from-[#e4e4e4] to-gray-200 dark:bg-gradient-to-r dark:from-[#1f1d1d] dark:via-[#252525] dark:to-[#1c1919]">
      <div class="flex">
        <div class="w-20 xl:w-32 flex flex-col items-start sm:mb-0 sm:ml-0 xsm:mb-3 xsm:ml-4">
          <img src="./${imageAddresses[0]}" alt="Cloud Icon">
          <h2 class="sm:text-base xsm:text-sm text-black dark:text-white !leading-4 capitalize">${city}</h2>
        </div>
        <div class="sm:ml-7 xsm:ml-4 flex justify-center flex-col align-middle">
          <h6 class="text-4xl text-black dark:text-white font-extrabold">${(parseInt(response["main"]["temp"]) - 273.15).toFixed(0)}&deg;<span
              class="sm:text-base xsm:text-[12px] font-semibold"> /
              ${((parseFloat(response["main"]["temp"]) - 273.15) * 9 / 5 + 32).toFixed(1)}&deg;F</span>
          </h6>
          <p class="text-black sm:text-base xsm:text-[10px] dark:text-white sm:mt-0 xsm:-mt-2 capitalize">${response["weather"]["0"]["description"]}</p>
        </div>
      </div>
      <div class="flex sm:flex-row sm:justify-around xsm:flex-col xsm:gap-2 sm:grow-[1] sm:w-auto xsm:w-full">
        <div class="flex sm:flex-col xsm:flex-row gap-2 sm:w-auto xsm:w-full">
          <div class="flex items-center justify-between border border-gray-500 rounded-full px-4 py-1 sm:w-auto xsm:w-1/2">
            <div>
              <h6 class="text-gray-500 text-[10px] -mb-2 dark:text-gray-300">
                Wind Speed</h6>
              <p class="text-base font-semibold dark:text-white">${response["wind"]["speed"]} km/h</p>
            </div>
            <img class="w-6 h-6 lg:ml-5 -mr-1.5 zoom" src="./${imageAddresses[1]}" alt="sunrise">
          </div>
          <div class="flex items-center justify-between border border-gray-500 rounded-full px-4 py-1 sm:w-auto xsm:w-1/2">
            <div>
              <h6 class="text-gray-500 text-[10px] -mb-2 dark:text-gray-300">
                Wind Direction</h6>
              <p class="text-base font-semibold dark:text-white">${response["wind"]["deg"]}&deg;</p>
            </div>
            <img class="w-6 h-6 lg:ml-5 -mr-1.5 zoom" src="./${imageAddresses[2]}" alt="sunrise">
          </div>
        </div>
        <div class="hidden md:flex flex-col gap-2">
          <div class="flex items-center justify-between border border-gray-500 rounded-full px-4 py-1">
            <div>
              <h6 class="text-gray-500 text-[10px] -mb-2 dark:text-gray-300">
                Sunrise</h6>
              <p class="text-base font-semibold dark:text-white">${SunRiseTime} AM</p>
            </div>
            <img class="w-6 h-6 lg:ml-5 -mr-1.5 zoom" src="./${imageAddresses[3]}" alt="sunrise">
          </div>
          <div class="flex items-center justify-between border border-gray-500 rounded-full px-4 py-1">
            <div>
              <h6 class="text-gray-500 text-[10px] -mb-2 dark:text-gray-300">
                Sunset</h6>
              <p class="text-base font-semibold dark:text-white">${SunSetTime} PM</p>
            </div>
            <img class="w-6 h-6 lg:ml-5 -mr-1.5 zoom" src="./${imageAddresses[4]}" alt="sunrise">
          </div>
        </div>
        <div class="flex sm:flex-col xsm:flex-row gap-2 sm:w-auto xsm:w-full">
          <div class="flex items-center justify-between border border-gray-500 rounded-full px-4 py-1 sm:w-auto xsm:w-1/2">
            <div>
              <h6 class="text-gray-500 text-[10px] -mb-2 dark:text-gray-300">
                Min Temp</h6>
              <p class="text-base font-semibold dark:text-white">${(((parseFloat(response["main"]["temp_min"]) - 273.15)).toFixed(1))}&deg;</p>
            </div>
              <img class="w-6 h-6 lg:ml-5 -mr-1.5 zoom" src="./${imageAddresses[5]}" alt="sunrise">
          </div>
          <div class="flex items-center border justify-between border-gray-500 rounded-full px-4 py-1 sm:w-auto xsm:w-1/2">
            <div>
              <h6 class="text-gray-500 text-[10px] -mb-2 dark:text-gray-300">
                Max Temp</h6>
              <p class="text-base font-semibold dark:text-white">${(((parseFloat(response["main"]["temp_max"]) - 273.15)).toFixed(1))}&deg;</p>
            </div>
              <img class="w-6 h-6 lg:ml-5 -mr-1.5 zoom" src="./${imageAddresses[6]}" alt="sunrise">
          </div>
        </div>
      </div>
      <button data-index="${index}"
        class="deleteItem bg-red-800 hover:bg-red-900 transition-all px-3 py-2 rounded-full text-xs font-bold sm:relative sm:left-0 sm:-translate-y-0 xsm:absolute xsm:right-3 xsm:-translate-y-24"><i
          class="fa fa-trash text-white" aria-hidden="true"></i></button>
    </div>
        `;


        $('.history').html(str);
        $('#preloader').css('display', 'none');
      })
  })
}

// DELETING THE SELECTED ITEM
$('.history').on('click', '.deleteItem', function (e) {
  e.preventDefault();
  let index = $(this).data('index');
  let searchedCitiesArr = localStorage.getItem('searchedCities');
  searchedCitiesArr = JSON.parse(searchedCitiesArr);
  searchedCitiesArr.splice(index, 1);
  localStorage.setItem('searchedCities', JSON.stringify(searchedCitiesArr));
  populatingHistory();
});