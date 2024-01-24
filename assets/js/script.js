// variable that gets history from local story or if no local storage present is set as an empty array
const storedHistory = JSON.parse(localStorage.getItem('history')) || [];

const historyDiv = $('#history');
const historyList = $('#history-buttons')
const historyTitle = $('<h3>').text('History');

// conditional statement that checks if there is any local storage
if (storedHistory.length > 0) {
    // if true adds the history title to the history section
    historyDiv.prepend(historyTitle);

    // then for each locally stored value a button is created and added to the history list
    $.each(storedHistory, function (i, historyLocation) {
        const historyButton = $('<button>');
        historyButton.text(historyLocation).addClass('history-btn').attr('data-name', historyLocation)
        historyList.prepend(historyButton);
    })

}

// Click function on Search button that triggers the fetchWeather function
$('#search-button').on('click', function (e) {

    e.preventDefault();
    fetchWeather()

})

// fetchWeather function
function fetchWeather() {

    // variable that stores the data-name attribute of the history button that has been clicked
    var historyButtonInput = $(this).attr('data-name');

    // variable for the search input field    
    var userInput = $('#search-input');

    // variable for user location which is set as either the value of the search input field or the history button data-name attribute
    userLocation = $('#search-input').val().trim() || historyButtonInput;

    // if statement that checks if any text has been entered into the search input    
    if (!userLocation == '') {

        //empties the input field
        userInput.val('')

        // adds history title to the history section
        historyDiv.prepend(historyTitle);

        // if statement that checks if there is any local storage
        if (storedHistory) {

            // if statement to fist check if a duplicate location already exists in the stored array
            if (!storedHistory.includes(userLocation)) {

                // if true add new location to the array
                storedHistory.push(userLocation)

                // adds new location to local storage    
                localStorage.setItem('history', JSON.stringify(storedHistory));

                // history button is created and given text, a class name and a data-name attribute    
                historyButton = $('<button>').text(userLocation).addClass('history-btn').attr('data-name', userLocation);

                // history button is added to the history list section   
                historyList.prepend(historyButton);
            }
        }


        // variable for open weather API Key
        const APIKey = "34868cf202b6a50a7276328f1ce106bf";

        // variable for geo location api URL
        const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${userLocation}&appid=${APIKey}`;


        // fetch request and response using geo location api
        fetch(geoURL)
            .then(function (response) {
                return response.json();
            }).then(function (data) {

                // variables to store latitude and longitude
                const lat = data[0].lat;
                const lon = data[0].lon;

                // variable for new query URL that adds the lat and lon variables from first fetch request
                const queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${APIKey}`;

                //second fetch request and response using forecase api
                fetch(queryURL)
                    .then(function (response) {
                        return response.json();
                    }).then(function (newData) {

                        // variable for the City Name    
                        const cityName = data[0].name;

                        // variable for current date and time, which is then formatted using dayjs
                        let date = newData.list[0].dt_txt;
                        date = dayjs(date).format('DD/MM/YYYY')

                        // variables for current weather, including the weather icon, temperature, windspeed, and humidity
                        const iconCode = newData.list[0].weather[0].icon;
                        const weatherIconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
                        const temp = newData.list[0].main.temp
                        const windSpeed = newData.list[0].wind.speed
                        const humidity = newData.list[0].main.humidity

                        // variables for dynamic elements that are created for today's weather   
                        const todayDiv = $('#today').empty();
                        const todayCard = $('<article>').addClass('card p-5')
                        const todayHeader = $('<h2>').text(cityName + ' ' + date);
                        const todayIcon = $('<img>').attr('src', weatherIconURL);
                        const todayTemp = $('<p>').text('Temp: ' + temp + ' °C')
                        const todayWind = $('<p>').text('Wind: ' + windSpeed + ' MPH')
                        const todayHumidity = $('<p>').text('Humidity: ' + humidity + '%')

                        //append the todayCard element with the data, then append the todayDiv with the card  
                        todayCard.append(todayHeader, todayIcon, todayTemp, todayWind, todayHumidity);
                        todayDiv.append(todayCard);

                        //variable for the Forecast heading
                        const forecastHeader = $('<h3>').text('4 Day Forecast').addClass('w-100 px-3');

                        // variable for the forecast section which also gets emptied on each request    
                        const forecastEl = $('#forecast').empty();

                        // for loop that iterates through the data list and increases by 8 each time to get the weather 24 hours ahead each time, as the objects returned are every 3 hours  
                        for (let i = 8; i < newData.list.length; i += 8) {
                            const fiveDayForecast = newData.list[i];

                            // variable for the date and time for each iteration, which is then formatted with dayjs
                            let fiveDayDate = fiveDayForecast.dt_txt;
                            fiveDayDate = dayjs(fiveDayDate).format('DD/MM/YYYY')

                            // variables for the forecast weather, including the weather icon, temperature, windspeed, and humidity
                            const fiveDayIconCode = fiveDayForecast.weather[0].icon;
                            const fiveDayWeatherIconURL = `https://openweathermap.org/img/wn/${fiveDayIconCode}@2x.png`;
                            const fiveDayTemp = fiveDayForecast.main.temp
                            const fiveDayWindSpeed = fiveDayForecast.wind.speed
                            const fiveDayHumidity = fiveDayForecast.main.humidity

                            // variables for all the dymanic elements that are created on each loop and appended with the returned data
                            const fiveDayCard = $('<div>').addClass('col-sm-6 col-xl-3');
                            const fiveDayWrapper = $('<article>').addClass('five-day-card p-5 ')
                            const fiveDayDateEl = $('<h4>').text(fiveDayDate);
                            const fiveDayIconEl = $('<img>').attr('src', fiveDayWeatherIconURL);
                            const fiveDayTempEl = $('<p>').text('Temp: ' + fiveDayTemp + ' °C')
                            const fiveDayWindEl = $('<p>').text('Wind: ' + fiveDayWindSpeed + ' MPH')
                            const fiveDayHumidityEl = $('<p>').text('Humidity: ' + fiveDayHumidity + '%');

                            // appending data and elements to the forecase section
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

// on click event added to all history buttons which has reference to the fetchWeather function
$(document).on('click', '.history-btn', fetchWeather)
