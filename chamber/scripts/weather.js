// Weather API integration
document.addEventListener('DOMContentLoaded', () => {
    // OpenWeatherMap API configuration
    const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
    const city = 'Dash City';
    const units = 'imperial';

    // Elements to update
    const temperatureElement = document.getElementById('temperature');
    const weatherDescriptionElement = document.getElementById('weather-description');
    const weatherIconElement = document.getElementById('weather-icon');
    const forecastContainer = document.getElementById('forecast-container');

    // Fetch current weather data
    async function fetchCurrentWeather() {
        try {
            // Mock data for development
            const data = {
                main: { temp: 72 },
                weather: [{ description: 'partly cloudy', icon: '02d' }]
            };

            // Update current weather display
            temperatureElement.textContent = `${Math.round(data.main.temp)}°F`;
            weatherDescriptionElement.textContent = data.weather[0].description;
            weatherIconElement.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            weatherIconElement.alt = data.weather[0].description;
        } catch (error) {
            console.error('Error fetching current weather:', error);
            temperatureElement.textContent = 'N/A';
            weatherDescriptionElement.textContent = 'Weather data unavailable';
        }
    }

    // Fetch 3-day forecast
    async function fetchForecast() {
        try {
            // Mock forecast data
            const mockForecast = [
                { date: 'Tomorrow', temp: 75, icon: '01d' },
                { date: 'Day 2', temp: 68, icon: '10d' },
                { date: 'Day 3', temp: 71, icon: '02d' }
            ];

            // Clear previous forecast
            forecastContainer.innerHTML = '';

            // Create forecast cards
            mockForecast.forEach(day => {
                const forecastDay = document.createElement('div');
                forecastDay.className = 'forecast-day';
                
                forecastDay.innerHTML = `
                    <div>${day.date}</div>
                    <img src="https://openweathermap.org/img/wn/${day.icon}.png" alt="Weather icon">
                    <div>${Math.round(day.temp)}°F</div>
                `;
                
                forecastContainer.appendChild(forecastDay);
            });
        } catch (error) {
            console.error('Error fetching forecast:', error);
            forecastContainer.innerHTML = '<p>Forecast data unavailable</p>';
        }
    }

    // Initialize weather data
    fetchCurrentWeather();
    fetchForecast();
});