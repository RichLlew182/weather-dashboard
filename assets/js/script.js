$('#search-button').on('click', function (e, userLocation) {
  
  e.preventDefault();

  const APIKey = "34868cf202b6a50a7276328f1ce106bf";
  
  var userLocation = $('#search-input').val().trim()

const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${userLocation}&appid=${APIKey}`;

fetch(geoURL)
.then(function (response) {
  console.log(response)
  return response.json();
}).then(function (data) {
  console.log(data)
  
  var lat = data[0].lat;
  var lon = data[0].lon;

  console.log(lat,lon)
  
  const queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${APIKey}`;

  fetch(queryURL)
  .then(function (response) {
    console.log(response)
    return response.json();
  }).then(function (newData) {
    console.log(newData);

    const cityName = newData.city.name;
    console.log({ cityName })
    
    const date = newData.list[0].dt_txt;
    console.log({ date })
    
    const iconCode = newData.list[0].weather[0].icon;
    console.log({ iconCode });

    const weatherIconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    console.log(weatherIconURL);
    
    const temp = newData.list[0].main.temp
    console.log({ temp })
    
    const windSpeed = newData.list[0].wind.speed
    console.log({windSpeed})




  })

})
  
})

