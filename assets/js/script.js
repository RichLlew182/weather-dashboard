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

  console.log(latitude,longitude)
  
  const queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;






  })

})

