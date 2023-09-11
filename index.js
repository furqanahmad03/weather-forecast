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
        document.querySelector(".temp-deg").innerHTML = (parseFloat(response["main"]["temp"]) - 273.15).toFixed(1);
        document.querySelector(".temp-fh").innerHTML = ((parseFloat(response["main"]["temp"]) - 273.15) * 9 / 5 + 32).toFixed(1);
        document.querySelector(".min-temp").innerHTML = ((parseFloat(response["main"]["temp_min"]) - 273.15)).toFixed(1);
        document.querySelector(".max-temp").innerHTML = ((parseFloat(response["main"]["temp_max"]) - 273.15)).toFixed(1);
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
      }
    })
}

let search = document.getElementById('search');
search.addEventListener('click', (e) => {
  e.preventDefault();
  let country = document.getElementById('country').value;
  url = `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=6618b265c24f3e0e2f3821f553b1a57e`;
  populateData(url);
})
country.addEventListener('keypress', (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    let country = document.getElementById('country').value;
    url = `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=6618b265c24f3e0e2f3821f553b1a57e`;
    populateData(url);
  }
})
$(document).ready(function () {
  // document.getElementById('checkbox').click()
  let date = new Date();
  if(screen.width<=768){
    let hide = document.querySelectorAll('.hide');
    hide.forEach((elm)=>{
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
  url = `https://api.openweathermap.org/data/2.5/weather?q=Mian Channu&appid=6618b265c24f3e0e2f3821f553b1a57e`;
  populateData(url);
})

let checkbox = document.getElementById('checkbox');
checkbox.addEventListener('click', (e) => {
  document.getElementsByTagName('html')[0].classList.toggle('dark');
})