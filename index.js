let populateData = function (url) {
  let response = fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      for (let x of Object.keys(response)) {
        try {
          if (response["cod"] === "404") {
            alert(response["message"]);
            document.getElementById('country').value = "";
            document.getElementById('country').blur();
            document.getElementById('preloader').style.display = "none";
            throw new Error("Error: Wrong City Entered");
          }
        } catch (error) {
          console.log(error.message);
          return;
        }

        document.querySelector(".location-name").innerHTML = response["name"]
        document.querySelector(".longitude").innerHTML = response["coord"]["lon"]
        document.querySelector(".latitude").innerHTML = response["coord"]["lat"]
        document.querySelector(".description").innerHTML = response["weather"]["0"]["main"] + ", " + response["weather"]["0"]["description"]
        document.querySelector(".temp-deg").innerHTML = (parseFloat(response["main"]["temp"]) - 273.15).toFixed(1) + `<sup class="font-medium dark:text-white">&deg;</sup>`;
        document.querySelector(".temp-fh").innerHTML = ((parseFloat(response["main"]["temp"]) - 273.15) * 9 / 5 + 32).toFixed(1) + "&deg;F";
        document.querySelector(".min-temp").innerHTML = ((parseFloat(response["main"]["temp_min"]) - 273.15)).toFixed(1) + `<span class="font-medium">&deg;</span>`;
        document.querySelector(".max-temp").innerHTML = ((parseFloat(response["main"]["temp_max"]) - 273.15)).toFixed(1) + `<span class="font-medium">&deg;</span>`;
        document.querySelector(".feels-like").innerHTML = parseInt(response["main"]["feels_like"]) - 273 + "&deg;";

        document.querySelector(".wind-speed").innerHTML = response["wind"]["speed"] + " mph"
        document.querySelector(".wind-direction").innerHTML = response["wind"]["deg"] + "&deg;"
        {
          let riseTime = new Date(parseInt(response["sys"]["sunrise"]) * 1000);
          document.querySelector(".sunrise").innerHTML = `${riseTime.getHours()}:${riseTime.getMinutes()} AM`
        }
        {
          let setTime = new Date(parseInt(response["sys"]["sunset"]) * 1000);
          let hours = setTime.getHours();
          if (hours > 12) {
            hours -= 12;
          }
          document.querySelector(".sunset").innerHTML = `${hours}:${setTime.getMinutes()} PM`
        }
        document.querySelector(".visibility").innerHTML = response["visibility"]
        document.querySelector(".pressure").innerHTML = response["main"]["pressure"] + " hpa"
        document.querySelector(".humidity").innerHTML = response["main"]["humidity"] + "%"
        if (response["wind"]["gust"] === undefined) {
          document.querySelector(".GUST").style.visibility = "hidden";
        }
        else {
          document.querySelector(".GUST").style.visibility = "visible";
          document.querySelector(".gusts").innerHTML = response["wind"]["gust"] + " mph"
        }
        document.getElementById('country').value = "";
        document.getElementById('country').blur();
        document.getElementById('preloader').style.display = "none";
      }
    })
}

let search = document.getElementById('search');
search.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('preloader').style.display = "block";
  let country = document.getElementById('country').value;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=6618b265c24f3e0e2f3821f553b1a57e`;
  populateData(url);
})
country.addEventListener('keypress', (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    document.getElementById('preloader').style.display = "block";
    let country = document.getElementById('country').value;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=6618b265c24f3e0e2f3821f553b1a57e`;
    populateData(url);
  }
})
$(document).ready(function () {
  console.log("JS is working properly!")
  let date = new Date();
  if (screen.width <= 768) {
    let hide = document.querySelectorAll('.hide');
    hide.forEach((elm) => {
      elm.style.display = "none";
    })
  }
  else if (date.getHours() >= 6 && date.getHours() <= 18) {
    document.querySelector('#sun').style.display = "block";
    document.querySelector('#moon').style.display = "none";
  }
  else {
    document.querySelector('#moon').style.display = "block";
    document.querySelector('#sun').style.display = "none";
  }

  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
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
            let url = `https://api.openweathermap.org/data/2.5/weather?q=${response["name"]}&appid=6618b265c24f3e0e2f3821f553b1a57e`;
            populateData(url);
          })
          .catch((error) => {
            console.log("Error Occured: " + error);
            let url = `https://api.openweathermap.org/data/2.5/weather?q=Islamabad&appid=6618b265c24f3e0e2f3821f553b1a57e`;
            populateData(url);
          })
      },
      (error) => {
        console.log("Error Occured: " + error);
        let url = `https://api.openweathermap.org/data/2.5/weather?q=Islamabad&appid=6618b265c24f3e0e2f3821f553b1a57e`;
        populateData(url);
      })
  })()
})

let checkbox = document.getElementById('checkbox');
checkbox.addEventListener('click', (e) => {
  document.getElementsByTagName('html')[0].classList.toggle('dark');
})