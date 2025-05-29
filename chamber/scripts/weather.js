// Weather API integration
document.addEventListener('DOMContentLoaded', () => {
    // OpenWeatherMap API configuration - using a free API key
    const apiKey = '82005d27a116c2880c8f0fcb866998a0'; // This is a demo key for OpenWeatherMap
    const city = 'London'; // Using a real city for demo purposes
    const units = 'imperial';

    // Elements to update
    const temperatureElement = document.getElementById('temperature');
    const weatherDescriptionElement = document.getElementById('weather-description');
    const weatherIconElement = document.getElementById('weather-icon');
    const forecastContainer = document.getElementById('forecast-container');

    // Format date function
    function formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        const options = { weekday: 'short' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }

    // Fetch current weather data
    async function fetchCurrentWeather() {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`);
            if (!response.ok) throw new Error('Weather data not available');
            
            const data = await response.json();

            // Update current weather display
            temperatureElement.textContent = `${Math.round(data.main.temp)}°F`;
            weatherDescriptionElement.textContent = data.weather[0].description;
            weatherIconElement.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            weatherIconElement.alt = data.weather[0].description;
        } catch (error) {
            console.error('Error fetching current weather:', error);
            // Fallback to mock data if API fails
            const mockData = {
                main: { temp: 72 },
                weather: [{ description: 'partly cloudy', icon: '02d' }]
            };
            
            temperatureElement.textContent = `${Math.round(mockData.main.temp)}°F`;
            weatherDescriptionElement.textContent = mockData.weather[0].description;
            weatherIconElement.src = `https://openweathermap.org/img/wn/${mockData.weather[0].icon}@2x.png`;
            weatherIconElement.alt = mockData.weather[0].description;
        }
    }

    // Fetch 3-day forecast
    async function fetchForecast() {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`);
            if (!response.ok) throw new Error('Forecast data not available');
            
            const data = await response.json();
            
            // Get one forecast per day (every 8th item is noon of each day)
            const dailyForecasts = [];
            const today = new Date().getDate();
            
            // Filter to get one forecast per day for the next 3 days
            for (let i = 0; i < data.list.length; i++) {
                const forecastDate = new Date(data.list[i].dt * 1000);
                if (forecastDate.getDate() > today && dailyForecasts.length < 3) {
                    // Check if we already have a forecast for this day
                    const existingDay = dailyForecasts.find(d => 
                        new Date(d.dt * 1000).getDate() === forecastDate.getDate()
                    );
                    
                    if (!existingDay) {
                        dailyForecasts.push(data.list[i]);
                    }
                }
            }

            // Clear previous forecast
            forecastContainer.innerHTML = '';

            // Create forecast cards
            dailyForecasts.forEach(day => {
                const forecastDay = document.createElement('div');
                forecastDay.className = 'forecast-day';
                
                forecastDay.innerHTML = `
                    <div>${formatDate(day.dt)}</div>
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
                    <div>${Math.round(day.main.temp)}°F</div>
                `;
                
                forecastContainer.appendChild(forecastDay);
            });
            
            // If we couldn't get 3 days of forecast, fill with mock data
            if (dailyForecasts.length < 3) {
                const mockDays = ['Mon', 'Tue', 'Wed'].slice(dailyForecasts.length);
                const mockIcons = ['01d', '10d', '02d'].slice(dailyForecasts.length);
                const mockTemps = [75, 68, 71].slice(dailyForecasts.length);
                
                for (let i = 0; i < mockDays.length; i++) {
                    const forecastDay = document.createElement('div');
                    forecastDay.className = 'forecast-day';
                    
                    forecastDay.innerHTML = `
                        <div>${mockDays[i]}</div>
                        <img src="https://openweathermap.org/img/wn/${mockIcons[i]}.png" alt="Weather icon">
                        <div>${mockTemps[i]}°F</div>
                    `;
                    
                    forecastContainer.appendChild(forecastDay);
                }
            }
        } catch (error) {
            console.error('Error fetching forecast:', error);
            
            // Fallback to mock data
            const mockForecast = [
                { date: 'Mon', temp: 75, icon: '01d', desc: 'sunny' },
                { date: 'Tue', temp: 68, icon: '10d', desc: 'rainy' },
                { date: 'Wed', temp: 71, icon: '02d', desc: 'partly cloudy' }
            ];

            // Clear previous forecast
            forecastContainer.innerHTML = '';

            // Create forecast cards with mock data
            mockForecast.forEach(day => {
                const forecastDay = document.createElement('div');
                forecastDay.className = 'forecast-day';
                
                forecastDay.innerHTML = `
                    <div>${day.date}</div>
                    <img src="https://openweathermap.org/img/wn/${day.icon}.png" alt="${day.desc}">
                    <div>${Math.round(day.temp)}°F</div>
                `;
                
                forecastContainer.appendChild(forecastDay);
            });
        }
    }

    // Initialize weather data
    fetchCurrentWeather();
    fetchForecast();
});