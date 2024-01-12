$('#search-button').on('click', function (e) {
  
  e.preventDefault();


const APIKey = "34868cf202b6a50a7276328f1ce106bf";

const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=London,Englandi&appid=${APIKey}`;

fetch(queryURL)
  .then(function (response) {
    console.log(response)
    return response.json();
  }).then(function (data) {
    console.log(data)









  })

})

