let populateData = function (url, city_name) {
  let response = fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      try {
        if (response["cod"] === "404") {
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
      {
        let riseTime = new Date(parseInt(response["sys"]["sunrise"]) * 1000);
        if(riseTime.getMinutes()<10){
          $(".sunrise").html(`${riseTime.getHours()}:0${riseTime.getMinutes()} AM`);
        }
        else{
          $(".sunrise").html(`${riseTime.getHours()}:${riseTime.getMinutes()} AM`);
        }
      }
      {
        let setTime = new Date(parseInt(response["sys"]["sunset"]) * 1000);
        let hours = setTime.getHours();
        if (hours > 12) {
          hours -= 12;
        }
        if(setTime.getMinutes()<10){
          $(".sunset").html(`${hours}:0${setTime.getMinutes()} PM`);
        }
        else{
          $(".sunset").html(`${hours}:${setTime.getMinutes()} PM`);
        }
      }
      $(".visibility").html(response["visibility"]);
      $(".pressure").html(response["main"]["pressure"] + " hpa");
      $(".humidity").html(response["main"]["humidity"] + "%");
      if (response["wind"]["gust"] === undefined) {
        $(".GUST").css('visibility', 'hidden');
      }
      else {
        $(".GUST").css('visibility', 'visible');
        $(".gusts").html(response["wind"]["gust"] + " mph");
      }

      if (city_name === undefined) {
        $(".location-name").html($('#country').val().charAt(0).toUpperCase() + $('#country').val().slice(1).toLowerCase());
      }

      $('#country').val("");
      $('#country').blur();
      $('#suggestions-list').css('display', 'none');
      $('#preloader').css('display', 'none');
    })
}


$('#search').on('click', (e) => {
  e.preventDefault();
  let country = $('#country').val();
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=6618b265c24f3e0e2f3821f553b1a57e`;
  populateData(url);
})
$('#country').on('keypress', (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    let country = $('#country').val();
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=6618b265c24f3e0e2f3821f553b1a57e`;
    populateData(url);
  }
})
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

  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    $('html').addClass('dark');
  } else {
    $('html').removeClass('dark');
  }

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
              let url = `https://api.openweathermap.org/data/2.5/weather?q=${response["name"]}&appid=6618b265c24f3e0e2f3821f553b1a57e`;
              populateData(url, response["name"]);
            }
            else {
              console.log("Error Occured: " + error);
              let url = `https://api.openweathermap.org/data/2.5/weather?q=Islamabad&appid=6618b265c24f3e0e2f3821f553b1a57e`;
              populateData(url, "Islamabad");
            }
          })
          .catch((error) => {
            console.log("Error Occured: " + error);
            let url = `https://api.openweathermap.org/data/2.5/weather?q=Islamabad&appid=6618b265c24f3e0e2f3821f553b1a57e`;
            populateData(url, "Islamabad");
          })
      },
      (error) => {
        console.log("Error Occured: " + error);
        let url = `https://api.openweathermap.org/data/2.5/weather?q=Islamabad&appid=6618b265c24f3e0e2f3821f553b1a57e`;
        populateData(url, "Islamabad");
      })
  })()
})

$('#checkbox').on('click', (e) => {
  $('html').toggleClass('dark');
})

window.addEventListener('keypress', (e) => {
  if (e.key === 'I' || e.key === 'i') {
    $('#country').focus();
  }
})


import states from './worldcities.js';

$('#country').on('input', () => {
  const inputText = $('#country').val().trim().toLowerCase();
  const filteredStates = states.filter((state) => {
    return state.name.toLowerCase().includes(inputText);
  });
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


$(document).on('click', function (e) {
  if (!$(e.target).closest('#suggestions-list').length && e.target !== $('#country')[0]) {
    $('#suggestions-list').css('display', 'none');
  }
});