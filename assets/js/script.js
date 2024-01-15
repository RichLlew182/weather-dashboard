const storedHistory = JSON.parse(localStorage.getItem('history')) || [];

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

$('#search-button').on('click', function (e) {
  
  e.preventDefault();
  fetchWeather() 
  
})

function fetchWeather() {

  
  var historyButtonInput = $(this).attr('data-name');

  var userInput = $('#search-input');
  
  userLocation = $('#search-input').val().trim() || historyButtonInput;

  if (!userLocation == '') {
    userInput.val('')
    historyDiv.prepend(historyTitle);
    if (storedHistory) {
        
      if (!storedHistory.includes(userLocation)) {
        storedHistory.push(userLocation)
        localStorage.setItem('history', JSON.stringify(storedHistory));
        historyButton = $('<button>').text(userLocation).addClass('history-btn').attr('data-name', userLocation);
        historyList.prepend(historyButton);
      }
    }
     
  
     
     const APIKey = "34868cf202b6a50a7276328f1ce106bf";
  
     const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${userLocation}&appid=${APIKey}`;
    

      fetch(geoURL)
        .then(function (response) {
          return response.json();
        }).then(function (data) {
  
          const lat = data[0].lat;
          const lon = data[0].lon;

  
          const queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${APIKey}`;

          fetch(queryURL)
            .then(function (response) {
              return response.json();
            }).then(function (newData) {

              const cityName = data[0].name;
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

              const forecastHeader = $('<h3>').text('4 Day Forecast').addClass('w-100 px-3 mb-5');

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
                fiveDayCard.append(fiveDayWrapper);
                forecastEl.prepend(forecastHeader)
                forecastEl.append(fiveDayCard)
            
              }

            })

        })
    
      }  
    }
  

// })
  
$(document).on('click', '.history-btn', fetchWeather)



