const storedHistory = JSON.parse(localStorage.getItem('history')) || [];
console.log(storedHistory);

const historyDiv = $('#history');
const historyList = $('#history-buttons')
const historyTitle = $('<h3>').text('History');

if (storedHistory.length > 0) { 

      historyDiv.prepend(historyTitle);

  $.each(storedHistory, function (i, historyLocation) {
    const historyButton = $('<button>');
    historyButton.text(historyLocation).addClass('history-btn').attr('data-name', historyLocation)
    historyList.prepend(historyButton);
 })

}

$('#search-button').on('click', function (e, userLocation) {
  
  e.preventDefault();
  fetchWeather() 
  
})

function fetchWeather() {

  
  // console.log($(this).attr('data-name'))
  
  var historyButtonInput = $(this).attr('data-name');
  
  userLocation = $('#search-input').val().trim() || historyButtonInput;

  if (!userLocation == '') {
    historyDiv.prepend(historyTitle);
    if (storedHistory) {
        
      if (!storedHistory.includes(userLocation)) {
        storedHistory.push(userLocation)
        localStorage.setItem('history', JSON.stringify(storedHistory));
        historyButton = $('<button>').text(userLocation).addClass('history-btn').attr('data-name', userLocation);
        historyList.prepend(historyButton);
      }
    }
     
  }
     
     
      const APIKey = "34868cf202b6a50a7276328f1ce106bf";
  
     const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${userLocation}&appid=${APIKey}`;
    

      fetch(geoURL)
        .then(function (response) {
          console.log(response)
          return response.json();
        }).then(function (data) {
          console.log(data)
  
          const lat = data[0].lat;
          const lon = data[0].lon;

          console.log(lat, lon)
  
          const queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${APIKey}`;

          fetch(queryURL)
            .then(function (response) {
              console.log(response)
              return response.json();
            }).then(function (newData) {
              console.log(newData);

              const cityName = newData.city.name;
              let date = newData.list[0].dt_txt;
              date = dayjs(date).format('DD/MM/YYYY')
              const iconCode = newData.list[0].weather[0].icon;
              const weatherIconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
              const temp = newData.list[0].main.temp
              const windSpeed = newData.list[0].wind.speed
              const humidity = newData.list[0].main.humidity

              const todayDiv = $('#today').empty();
              const todayCard = $('<article>').addClass('card p-5')
              const todayHeader = $('<h2>').text(cityName + ' ' + date);
              const todayIcon = $('<img>').attr('src', weatherIconURL);
              const todayTemp = $('<p>').text('Temp: ' + temp + ' °C')
              const todayWind = $('<p>').text('Wind: ' + windSpeed + ' MPH')
              const todayHumidity = $('<p>').text('Humidity: ' + humidity + '%')

              todayCard.append(todayHeader, todayIcon, todayTemp, todayWind, todayHumidity);
              todayDiv.append(todayCard);
            
              const forecastEl = $('#forecast').empty();

              for (let i = 8; i < newData.list.length; i += 8) {
                const fiveDayForecast = newData.list[i];
    
                let fiveDayDate = fiveDayForecast.dt_txt;
                fiveDayDate = dayjs(fiveDayDate).format('DD/MM/YYYY')

                const fiveDayIconCode = fiveDayForecast.weather[0].icon;
                const fiveDayWeatherIconURL = `https://openweathermap.org/img/wn/${fiveDayIconCode}@2x.png`;
                const fiveDayTemp = fiveDayForecast.main.temp
                const fiveDayWindSpeed = fiveDayForecast.wind.speed
                const fiveDayHumidity = fiveDayForecast.main.humidity
              
                const fiveDayCard = $('<div>').addClass('col-sm-6 col-xl-3');
                const fiveDayWrapper = $('<article>').addClass('five-day-card p-5 ')
                const fiveDayDateEl = $('<h4>').text(fiveDayDate);
                const fiveDayIconEl = $('<img>').attr('src', fiveDayWeatherIconURL);
                const fiveDayTempEl = $('<p>').text('Temp: ' + fiveDayTemp + ' °C')
                const fiveDayWindEl = $('<p>').text('Wind: ' + fiveDayWindSpeed + ' MPH')
                const fiveDayHumidityEl = $('<p>').text('Humidity: ' + fiveDayHumidity + '%');

                fiveDayWrapper.append(fiveDayDateEl, fiveDayIconEl, fiveDayTempEl, fiveDayWindEl, fiveDayHumidityEl)
                fiveDayCard.append(fiveDayWrapper)
                forecastEl.append(fiveDayCard)
            
              }

            })

        })
    
    }
  

// })
  

$(document).on('click', '.history-btn', fetchWeather)

// {
//   console.log(e)
//   console.log(this)

//   var historyBtnLocation = $(this).text();
//   console.log({ historyBtnLocation })


// })



