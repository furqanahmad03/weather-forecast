let populateData = function (url, city_name) {
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
            document.getElementById('suggestions-list').style.display = "none";
            document.getElementById('preloader').style.display = "none";
            throw new Error("Error: Wrong City Entered");
          }
        } catch (error) {
          console.log(error.message);
          return;
        }

        document.querySelector(".location-name").innerHTML = city_name;
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
      }
      if (city_name === undefined) {
        document.querySelector(".location-name").innerHTML = document.getElementById('country').value.charAt(0).toUpperCase() + document.getElementById('country').value.slice(1).toLowerCase();
      }

      document.getElementById('country').value = "";
      document.getElementById('country').blur();
      suggestionsList.style.display = "none";
      document.getElementById('preloader').style.display = "none";
    })
}

let search = document.getElementById('search');
search.addEventListener('click', (e) => {
  e.preventDefault();
  let country = document.getElementById('country').value;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=6618b265c24f3e0e2f3821f553b1a57e`;
  populateData(url);
})
country.addEventListener('keypress', (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
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

let checkbox = document.getElementById('checkbox');
checkbox.addEventListener('click', (e) => {
  document.getElementsByTagName('html')[0].classList.toggle('dark');
})

window.addEventListener('keypress',(e)=>{
  if(e.key === 'I' || e.key === 'i'){
    document.getElementById('country').focus();
  }
})


const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma",
  "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas",
  "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming","Lahore","Faisalabad","Rawalpindi","Gujranwala","Peshawar","Multan","Saidu Sharif","Hyderabad","Islamabad","Quetta","Bahawalpur","Sargodha","Sialkot","Sukkur","Larkana","Chiniot","Shekhupura","Rahimyar Khan","Jhang City","Dera Ghazi Khan","Gujrat","Cantonment","Bhawana","Mardan","Sarai Alamgir","Shah Latif Town","Kasur","Chakwal","Mingaora","Nawabshah","Kotri","Sahiwal","Hafizabad","Mirpur Khas","Okara","Khanewal","Chilas","Burewala","Jacobabad","Jhelum","Saddiqabad","Kohat","Muridke","Muzaffargarh","Khanpur","Gojra","Mandi Bahauddin","Jaranwala","Lalian","Chauk Azam","Abbottabad","Turbat","Dadu","Khairpur Mir's","Bahawalnagar","Khuzdar","Pakpattan","Zafarwal","Tando Allahyar","Ahmadpur East","Vihari","New Mirpur","Kamalia","Kot Addu","Nowshera","Swabi","Parachinar","Goth Tando Sumro","Khushab","Dera Ismail Khan","Bagu Na Mohra","Chaman","Charsadda","Kandhkot","Bahrain","Chishtian","Wahga","Masho Khel","Saidpur","Hasilpur","Attock Khurd","Kambar","Arifwala","Muzaffarabad","Mianwali","Jauharabad","Jalalpur Jattan","Gwadar","Bhakkar","Zhob","Dipalpur","Kharian","Mian Channun","Pir Mahal","Bhalwal","Jamshoro","Kathri","Pattoki","Harunabad","Kahror Pakka","Toba Tek Singh","Samundri","Shakargarh","Sambrial","Shujaabad","Hujra Shah Muqim","Kabirwala","Rohri","Mansehra","Lala Musa","Chunian","Nankana Sahib","Bannu","Pasrur","Timargara","Rangewala","Chenab Nagar","Abdul Hakim","Hassan Abdal","Haripur","Tank","Hangu","Jalalabad","Naushahro Firoz","Bat Khela","Risalpur Cantonment","Karak","Kundian","Umarkot","Chitral","Batgram","Dainyor","Kulachi","Kalat","Kotli","Murree","Akora","Mithi","Mian Sahib","Nurkot","Basla","Gakuch","Gilgit","Bunji","Karachi"
];

const inputElement = document.getElementById('country');
const suggestionsList = document.getElementById('suggestions-list');

inputElement.addEventListener('input', ()=>{
  const inputText = inputElement.value.trim().toLowerCase();
  const filteredStates = states.filter((state)=>{
    return state.toLowerCase().includes(inputText);
  });
  suggestionsList.innerHTML = "";
  if(filteredStates.length > 0) {
    filteredStates.forEach((state)=>{
      const litElement = document.createElement('li');
      litElement.classList.add("py-2","px-3","cursor-pointer","border-transparent","rounded-md","transition","dark:hover:bg-[#2d2d2d]","hover:bg-gray-400");
      litElement.textContent = state;
      litElement.addEventListener('click', ()=>{
        inputElement.value = state;
        suggestionsList.innerHTML = "";
        document.getElementById('search').click();
      })
      suggestionsList.appendChild(litElement);
    })
    suggestionsList.style.display = "block";
  }
  else{
    suggestionsList.style.display = "none";
  }
})

document.addEventListener("click", function (e) {
  if (!suggestionsList.contains(e.target) && e.target !== inputElement) {
    suggestionsList.style.display = "none";
  }
});