const apiKey = "aaeecb433b821a94d7631d5015204573";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

// Helper: Get weather icon path based on condition
function getWeatherIcon(main) {
  const icons = {
    Clouds: "clouds.png",
    Clear: "clear.png",
    Rain: "rain.png",
    Drizzle: "drizzle.png",
    Mist: "mist.png",
    Snow: "snow.png",
  };
  return icons[main] || "default.png"; // fallback if unknown
}

async function checkWeather(city) {
  // Input validation: trim and check if empty
  if (!city.trim()) {
    alert("Please enter a city name.");
    return;
  }

  try {
    // Show loading state (optional UX improvement)
    document.querySelector(".city").innerHTML = "Loading...";
    document.querySelector(".temp").innerHTML = "--°C";
    document.querySelector(".humidity").innerHTML = "--%";
    document.querySelector(".wind").innerHTML = "-- km/h";
    weatherIcon.src = "images/loading.gif"; // Add a small loading GIF if possible

    const response = await fetch(apiUrl + encodeURIComponent(city) + `&appid=${apiKey}`);

    // Check if response is OK (status 200)
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("City not found. Please check the spelling.");
      } else {
        throw new Error("Failed to fetch weather data. Please try again.");
      }
    }

    const data = await response.json();

    // Update UI with real data
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

    // Use helper function for cleaner icon logic
    weatherIcon.src = "images/" + getWeatherIcon(data.weather[0].main);

  } catch (error) {
    // Handle errors gracefully
    document.querySelector(".city").innerHTML = "Error";
    document.querySelector(".temp").innerHTML = "--°C";
    document.querySelector(".humidity").innerHTML = "--%";
    document.querySelector(".wind").innerHTML = "-- km/h";
    weatherIcon.src = "images/error.png"; // Optional: add an error icon

    alert(error.message); // Or show in a div instead of alert for better UX
  }
}

// Event listeners
searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});

// Allow pressing Enter key in search box
searchBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    checkWeather(searchBox.value);
  }
});