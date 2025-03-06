function fetchWeather(city = null) {
    if (!city) {
        city = document.getElementById('city-input').value.trim();
    }
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=QNHA8BAWA7ERBYE7VLE9C5JWD&contentType=json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (!data || !data.currentConditions) {
                alert('Weather data unavailable.');
                return;
            }

            // Update current weather details
            document.getElementById('city').textContent = data.resolvedAddress.split(',')[0].trim();
            document.getElementById('current-temperature').textContent = (data.currentConditions.temp || "N/A") + "°C";
            document.getElementById('current-humidity').textContent = (data.currentConditions.humidity || "N/A") + "%";
            document.getElementById('Max-Temperature').textContent = (data.days[0]?.tempmax || "N/A") + "°C";
            document.getElementById('Min-Temperature').textContent = (data.days[0]?.tempmin || "N/A") + "°C";
            document.getElementById('feels-like').textContent = (data.currentConditions.feelslike || "N/A") + "°C";
            document.getElementById('wind-degree').textContent = (data.currentConditions.winddir || "N/A") + "°";
            document.getElementById('current-wind').textContent = ((data.currentConditions.windspeed * 1.60934).toFixed(2) || "N/A") + " km/h";
            document.getElementById('sun-rise').textContent = data.currentConditions.sunrise || "N/A";
            document.getElementById('sun-set').textContent = data.currentConditions.sunset || "N/A";

            // Set icons based on temperature
            let temperature = data.currentConditions.temp || 0;
            document.getElementById('weather-icon').src = temperature <= 10 
                ? "https://cdn-icons-png.flaticon.com/128/4834/4834551.png" 
                : temperature <= 25 
                    ? "https://cdn-icons-png.flaticon.com/128/869/869869.png" 
                    : "https://cdn-icons-png.flaticon.com/128/890/890347.png";

            document.getElementById('humidity-icon').src = "https://cdn-icons-png.flaticon.com/128/728/728093.png";

            // Generate 7-day forecast dynamically
            const forecastContainer = document.querySelector('.forecast-container');
            forecastContainer.innerHTML = ''; // Clear previous content

            data.days.slice(0, 7).forEach((day, index) => {
                let cardHTML = `
                    <div class="col-md-6 col-lg-4 mb-3">
                        <div class="card border-primary">
                            <div class="bg-primary text-white card-header">
                                Date: ${new Date(day.datetime).toDateString()}
                            </div>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">Temperature: ${day.temp || "N/A"}°C</li>
                                <li class="list-group-item">Humidity: ${day.humidity || "N/A"}%</li>
                                <li class="list-group-item">Wind Speed: ${(day.windspeed * 1.60934).toFixed(2) || "N/A"} km/h</li>
                                <li class="list-group-item">Conditions: ${day.conditions || "N/A"}</li>
                            </ul>
                        </div>
                    </div>
                `;
                forecastContainer.innerHTML += cardHTML;
            });

            // Call displayWeatherData to update last 24 hours weather data
            displayWeatherData(data);

        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('Could not fetch weather data. Please try again.');
        });
}

// Function to display last 24 hours weather data
function displayWeatherData(data) {
    console.log("Last 24 Hours Weather Data:", data);
    const hoursData = data.days[0].hours;

    let output = `<h2 class="bg-primary text-white text-center py-3 my-4">Last 24 Hours Weather for ${data.resolvedAddress}</h2>`;
    output += `<div class="row justify-content-center" id="weather-list" style="width: 90%; margin: 40px auto;">`;

    hoursData.forEach((hour, index) => {
        let hiddenClass = index >= 6 ? 'd-none more-weather' : ''; // Hide all except first 6
        output += `
            <div class="col-md-6 col-lg-4 mb-3 weather-item ${hiddenClass}">
                <div class="card border-primary">
                    <div class="bg-primary text-white card-header text-center">
                        Time: ${hour.datetime}
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">🌡 Temperature: ${hour.temp}°C</li>
                        <li class="list-group-item">💧 Humidity: ${hour.humidity || "N/A"}%</li>
                        <li class="list-group-item">💨 Wind Speed: ${(hour.windspeed * 1.60934).toFixed(2) || "N/A"} km/h</li>
                        <li class="list-group-item">☁ Conditions: ${hour.conditions}</li>
                    </ul>
                </div>
            </div>
        `;
    });

    output += `</div>`;
    output += `
        <div class="text-center mt-3">
            <button class="btn btn-primary" id="toggle-btn" onclick="toggleWeather()">Show More</button>
        </div>
    `;

    document.getElementById("weatherdata").innerHTML = output;
}

// Function to toggle visibility of extra weather data
function toggleWeather() {
    let hiddenItems = document.querySelectorAll('.more-weather');
    let button = document.getElementById('toggle-btn');

    if (hiddenItems[0].classList.contains('d-none')) {
        hiddenItems.forEach(item => item.classList.remove('d-none'));
        button.textContent = "Show Less";
    } else {
        hiddenItems.forEach(item => item.classList.add('d-none'));
        button.textContent = "Show More";
    }
}

function showLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;
                
                // Fetch city name using OpenStreetMap's Nominatim API
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                .then(response => response.json())
                .then(data => {
                    let city = data.address.city || data.address.town || data.address.village || "Unknown";
                    document.getElementById("display-location").innerHTML = 
                        `City: ${city} <br> Latitude: ${latitude} <br> Longitude: ${longitude}`;
                })
                .catch(error => {
                    document.getElementById("display-location").innerHTML = 
                        "Error getting city name: " + error.message;
                });
            },
            function (error) {
                document.getElementById("display-location").innerHTML = 
                    "Error getting location: " + error.message;
            }
        );
    } else {
        document.getElementById("display-location").innerHTML = 
            "Geolocation is not supported by this browser.";
    }
}


// }
// function showLocation() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//             function (position) {
//                 let latitude = position.coords.latitude;
//                 let longitude = position.coords.longitude;
//                 document.getElementById("display-location").innerHTML = 
//                     `Latitude: ${latitude} <br> Longitude: ${longitude}`;
//             },
//             function (error) {
//                 document.getElementById("display-location").innerHTML = 
//                     "Error getting location: " + error.message;
//             }
//         );
//     } else {
//         document.getElementById("display-location").innerHTML = 
//             "Geolocation is not supported by this browser.";
//     }
// }
