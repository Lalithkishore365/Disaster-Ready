document.addEventListener("DOMContentLoaded", function () {
    let map = L.map('map').setView([20, 78], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    let weatherLayer = null;
    const apiKey = '149b110a287cdf78183bc648da798918';
    let activeLayer = null;

    function changeLayer(type) {
        // If the same layer is active, remove it
        if (activeLayer === type) {
            if (weatherLayer) {
                map.removeLayer(weatherLayer);
                weatherLayer = null;
            }
            activeLayer = null;
            resetButtonHighlight();
            return;
        }
    
        // Remove previous layer
        if (weatherLayer) {
            map.removeLayer(weatherLayer);
        }
    
        let layerUrl = '';
        if (type === 'rain') {
            layerUrl = `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`;
        } else if (type === 'temp') {
            layerUrl = `https://tile.openweathermap.org/map/temp/{z}/{x}/{y}.png?appid=${apiKey}`; // Ensure "temp" instead of "temp_new"
        } else if (type === 'alerts') {
            layerUrl = `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`;
        }
    
        weatherLayer = L.tileLayer(layerUrl, { attribution: 'Weather data © OpenWeatherMap' });
        weatherLayer.addTo(map);
        activeLayer = type;
    
        highlightActiveButton(type);
    }
    

    function highlightActiveButton(type) {
        resetButtonHighlight();
        let button = document.querySelector(`button[data-layer="${type}"]`);
        if (button) {
            button.classList.add("active-button");
        }
    }

    function resetButtonHighlight() {
        document.querySelectorAll(".map-controls button").forEach(btn => {
            btn.classList.remove("active-button");
        });
    }

    // Attach event listeners to buttons
    document.querySelectorAll(".map-controls button").forEach(button => {
        let layerType = button.innerText.toLowerCase();
        button.setAttribute("data-layer", layerType);
        button.addEventListener("click", () => changeLayer(layerType));
    });

    // Get user location and fetch weather
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            map.setView([lat, lon], 10);

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
        let temp = data.main.temp;
        let humidity = data.main.humidity;
        let windSpeed = data.wind.speed;
        let pressure = data.main.pressure;
        let sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        let sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

        document.getElementById("weather").innerHTML = `
            🌡 Temperature: ${temp}°C <br> 
            💧 Humidity: ${humidity}% <br> 
            🌬 Wind Speed: ${windSpeed} m/s <br> 
            🌡 Pressure: ${pressure} hPa <br> 
            🌅 Sunrise: ${sunrise} <br> 
            🌇 Sunset: ${sunset} <br> 
            ☔ Condition: ${data.weather[0].description}
        `;
    })
    .catch(error => console.error("Weather fetch error:", error));


            document.getElementById("disaster-alert").innerText = "⚠️ Flood warning in your area!";
        });
    }

    // Slideshow functionality
    let slideIndex = 0;
    function showSlides() {
        let slides = document.getElementsByClassName("slide");
        for (let slide of slides) {
            slide.style.display = "none";
        }
        slideIndex++;
        if (slideIndex > slides.length) slideIndex = 1;
        slides[slideIndex - 1].style.display = "block";
        setTimeout(showSlides, 3000);
    }
    showSlides();

    // FAQ toggle
    document.querySelectorAll(".faq-question").forEach(question => {
        question.addEventListener("click", function () {
            let answer = this.nextElementSibling;
            answer.style.display = (answer.style.display === "block") ? "none" : "block";
        });
    });
});
