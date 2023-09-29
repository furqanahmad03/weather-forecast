// TASKS TO DO WHEN SITE IS READY
// Displaying Sun, Moon images according to the TIME and Screen Width
$(document).ready(function () {
  console.log("JS is working properly!")
  let date = new Date();
  if (screen.width <= 768) {
    $('.hide').css('display', 'none');
  }
  else if (date.getHours() >= 6 && date.getHours() <= 18) {
    $('#sun').css('display', 'block')
    $('#moon').css('display', 'none')
  }
  else {
    $('#moon').css('display', 'block')
    $('#sun').css('display', 'none')
  }
  if (screen.width <= 1024) {
    $('.hide-column').css('display', 'none');
  }

  // SETTING UP SYSTEM DEFAULT THEME OF WEBSITE
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    $('html').addClass('dark');
  } else {
    $('html').removeClass('dark');
  }

  // DETECTING THE LOCATION (Longitude and Latitude) OF CLIENT TO DISPLAY HIS RELEVENT DATA
  (function () {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let longitude = position.coords.longitude;
        let latitude = position.coords.latitude;
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=6618b265c24f3e0e2f3821f553b1a57e`;
        fetch(url)
          .then(response => response.json())
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
let populateData = function (url, city_name) {
  let response = fetch(url)
    .then((response) => {
      return response.json();
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

      // DISPLAYING THE (Successfully) FETCHED DATA
      $(".location-name").html(city_name);
      $(".longitude").html(response["coord"]["lon"]);
      $(".latitude").html(response["coord"]["lat"]);
      $(".description").html(response["weather"]["0"]["main"] + ", " + response["weather"]["0"]["description"]);
      $(".temp-deg").html((parseFloat(response["main"]["temp"]) - 273.15).toFixed(1) + `<sup class="font-medium dark:text-white">&deg;</sup>`);
      $(".temp-fh").html(((parseFloat(response["main"]["temp"]) - 273.15) * 9 / 5 + 32).toFixed(1) + "&deg;F");
      $(".min-temp").html(((parseFloat(response["main"]["temp_min"]) - 273.15)).toFixed(1) + `<span class="font-medium">&deg;</span>`);
      $(".max-temp").html(((parseFloat(response["main"]["temp_max"]) - 273.15)).toFixed(1) + `<span class="font-medium">&deg;</span>`);
      $(".feels-like").html(parseInt(response["main"]["feels_like"]) - 273 + "&deg;");

      $(".wind-speed").html(response["wind"]["speed"] + " mph");
      $(".wind-direction").html(response["wind"]["deg"] + "&deg;");

      // CALCULATING SUNRISE TIME AS GIVEN IN UNIX TIMESTAMPS
      {
        let riseTime = new Date(parseInt(response["sys"]["sunrise"]) * 1000);
        if (riseTime.getMinutes() < 10) {
          $(".sunrise").html(`${riseTime.getHours()}:0${riseTime.getMinutes()} AM`);
        }
        else {
          $(".sunrise").html(`${riseTime.getHours()}:${riseTime.getMinutes()} AM`);
        }
      }
      // CALCULATING SUNSET TIME AS GIVEN IN UNIX TIMESTAMPS
      {
        let setTime = new Date(parseInt(response["sys"]["sunset"]) * 1000);
        let hours = setTime.getHours();
        if (hours > 12) {
          hours -= 12;
        }
        if (setTime.getMinutes() < 10) {
          $(".sunset").html(`${hours}:0${setTime.getMinutes()} PM`);
        }
        else {
          $(".sunset").html(`${hours}:${setTime.getMinutes()} PM`);
        }
      }

      $(".visibility").html(response["visibility"]);
      $(".pressure").html(response["main"]["pressure"] + " hpa");
      $(".humidity").html(response["main"]["humidity"] + "%");

      // MOST OF THE TIMES GUST IS NOT GIVEN
      if (response["wind"]["gust"] === undefined) {
        $(".GUST").css('visibility', 'hidden');
      }
      else {
        $(".GUST").css('visibility', 'visible');
        $(".gusts").html(response["wind"]["gust"] + " mph");
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

      $('#country').val("");
      $('#country').blur();
      $('#suggestions-list').css('display', 'none');
      $('#preloader').css('display', 'none');
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
    }
    populatingHistory();
  }
}

// UPDATING SEARCHED HISTORY
function populatingHistory() {
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
  searchedCitiesArr.forEach((city, index) => {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=6618b265c24f3e0e2f3821f553b1a57e`;
    let response = fetch(url)
      .then((response) => {
        return response.json();
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

        // MAKING ROWS TO SHOW
        str += `
          <tr class="text-center dark:text-white">
          <td class="border border-collapse p-1 capitalize md:text-lg xsm:text-[10px]">${city}</td>
          <td class="border border-collapse p-1 capitalize md:text-lg xsm:text-[10px]">${response["weather"]["0"]["description"]}</td>
          <td class="border border-collapse p-1 hide-element md:text-lg xsm:text-[10px]">${response["wind"]["speed"] + " mph"}</td>
          <td class="border border-collapse p-1 hide-element md:text-lg xsm:text-[10px]">${response["wind"]["deg"] + "&deg;"}</td>
          <td class="border border-collapse p-1 md:text-lg xsm:text-[10px]">${SunRiseTime}<span class="md:text-base xsm:text-[8px]"> AM</span></td>
          <td class="border border-collapse p-1 md:text-lg xsm:text-[10px]">${SunSetTime}<span class="md:text-base xsm:text-[8px]"> PM</span></td>
          <td class="border border-collapse p-1 md:text-lg xsm:text-[10px]">${(((parseFloat(response["main"]["temp_min"]) - 273.15)).toFixed(1))}<span class="font-medium">&deg;</span></td>
          <td class="border border-collapse p-1 md:text-lg xsm:text-[10px]">${(((parseFloat(response["main"]["temp_max"]) - 273.15)).toFixed(1))}<span class="font-medium">&deg;</span></td>
          <td class="border border-collapse p-1"><button data-index="${index}" class="deleteItem bg-red-800 hover:bg-red-900 transition-all md:px-4 xsm:px-2 py-1 md:rounded-lg xsm:rounded-md text-xs font-bold"><i class="fa fa-trash text-white" aria-hidden="true"></i></button></td>
        </tr>
          `;
        $('.search-history').html(str);
        if(screen.width <=1024){
          $('.hide-element').css('display','none');
        }
      })
  })
}

// DELETING THE SELECTED ITEM
$('.search-history').on('click', '.deleteItem', function () {
  let index = $(this).data('index');
  let searchedCitiesArr = localStorage.getItem('searchedCities');
  searchedCitiesArr = JSON.parse(searchedCitiesArr);
  searchedCitiesArr.splice(index, 1);
  localStorage.setItem('searchedCities', JSON.stringify(searchedCitiesArr));
  populatingHistory();
});