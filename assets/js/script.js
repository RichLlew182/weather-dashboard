var storedHistory = JSON.parse(localStorage.getItem('history')) || [];
console.log(storedHistory);

var historyDiv = $('#history');
var historyList = $('#history-buttons')
var historyTitle = $('<h3>').text('History');

if (storedHistory.length > 0) { 

      historyDiv.prepend(historyTitle);

  $.each(storedHistory, function (i, historyLocation) {
    var historyButton = $('<button>');
    historyButton.text(historyLocation).addClass('history-btn')
    historyList.prepend(historyButton);
 })

}

$('#search-button').on('click', function (e, userLocation) {
  
  e.preventDefault();
  var userLocation = $('#search-input').val().trim()
  
  if (!userLocation == '') {
    historyDiv.prepend(historyTitle);

    if (storedHistory) {

      if (!storedHistory.includes(userLocation)) {
        storedHistory.push(userLocation)
        localStorage.setItem('history', JSON.stringify(storedHistory));
        historyButton = $('<button>').text(userLocation).addClass('history-btn');
        historyList.prepend(historyButton);
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
  
        var lat = data[0].lat;
        var lon = data[0].lon;

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

            var todayDiv = $('#today');
            todayDiv.empty();
            var todayCard = $('<article>').addClass('card p-3')
            var todayHeader = $('<h2>').text(cityName + ' ' + date);
            var todayIcon = $('<img>').attr('src', weatherIconURL);
            var todayTemp = $('<p>').text('Temp: ' + temp + ' °C')
            var todayWind = $('<p>').text('Wind: ' + windSpeed + ' MPH')
            var todayHumidity = $('<p>').text('Humidity: ' + humidity + '%')

            todayCard.append(todayHeader, todayIcon, todayTemp, todayWind, todayHumidity);
            todayDiv.append(todayCard);
            
            var fiveDayEl = $('#forecast')
            fiveDayEl.empty();

            for (let i = 0; i < newData.list.length; i += 8) {
              var fiveDayForecast = newData.list[i];
    
              let fiveDayDate = fiveDayForecast.dt_txt;
              fiveDayDate = dayjs(fiveDayDate).format('DD/MM/YYYY')

              const fiveDayIconCode = fiveDayForecast.weather[0].icon;
              const fiveDayWeatherIconURL = `https://openweathermap.org/img/wn/${fiveDayIconCode}@2x.png`;
              const fiveDayTemp = fiveDayForecast.main.temp
              const fiveDayWindSpeed = fiveDayForecast.wind.speed
              const fiveDayHumidity = fiveDayForecast.main.humidity
              
              const fiveDayCard = $('<article>').addClass('five-day-card p-3')
              const fiveDayDateEl = $('<h4>').text(fiveDayDate);
              const fiveDayIconEl = $('<img>').attr('src', fiveDayWeatherIconURL);
              const fiveDayTempEl = $('<p>').text('Temp: ' + fiveDayTemp + ' °C')
              const fiveDayWindEl = $('<p>').text('Wind: ' + fiveDayWindSpeed + ' MPH')
              const fiveDayHumidityEl = $('<p>').text('Humidity: ' + fiveDayHumidity + '%');

              fiveDayCard.append(fiveDayDateEl, fiveDayIconEl, fiveDayTempEl, fiveDayWindEl, fiveDayHumidityEl)
              
              fiveDayEl.append(fiveDayCard)
            
            }

          })

      })
    
  }

})
  

$(document).on('click', '.history-btn', function (e) {
  console.log(e)
  console.log(this)

  var historyBtnLocation = $(this).text();
  console.log({ historyBtnLocation })


})



