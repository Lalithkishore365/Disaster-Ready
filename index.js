document.addEventListener("DOMContentLoaded", function () {
    let map = L.map('map').setView([20, 78], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    let weatherLayer = null;
    const apiKey = '149b110a287cdf78183bc648da798918';
    let activeLayer = ''; // Keeps track of the currently active layer

    function changeLayer(type, button) {
        if (weatherLayer) {
            map.removeLayer(weatherLayer);
            weatherLayer = null;
        }

        if (activeLayer === type) {
            // If the same button is clicked again, just disable the layer and reset active state
            activeLayer = '';
            resetButtonHighlight();
            return;
        }

        let layerUrl;
        if (type === 'rain') {
            layerUrl = `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`;
        } else if (type === 'temp') {
            layerUrl = `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`;
        } else if (type === 'alerts') {
            layerUrl = `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`;
        }

        weatherLayer = L.tileLayer(layerUrl, { attribution: 'Weather data © OpenWeatherMap' });
        weatherLayer.addTo(map);
        activeLayer = type;

        highlightActiveButton(button);
    }

    function highlightActiveButton(button) {
        resetButtonHighlight();
        button.classList.add("active-button");
    }

    function resetButtonHighlight() {
        document.querySelectorAll(".map-controls button").forEach(btn => {
            btn.classList.remove("active-button");
        });
    }

    // Get user location and fetch weather
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            map.setView([lat, lon], 10);

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
                .then(response => response.json())
                .then(data => {
                    document.getElementById("weather").innerHTML = `🌡 Temp: ${data.main.temp}°C <br> ☔ Rain: ${data.weather[0].description}`;
                });

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
