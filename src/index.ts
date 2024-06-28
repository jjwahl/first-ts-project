import axios from 'axios';
import readline from 'readline';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_API_KEY = 'pk.75ba8741725396e2c3231211a345d483';
const GEOCODING_BASE_URL = 'https://us1.locationiq.com/v1/search.php';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter city name: ', (city) => {
    rl.question('Enter country: ', async (country) => {
        try {
            const location = await getCoordinates(city, country);
            if (location) {
                await getWeather(city, location.latitude, location.longitude);
            } else {
                console.log('Could not find the location.');
            }
        } catch (error) {
            console.error(`An error occurred: ${(error as Error).message}`);
        } finally {
            rl.close();
        }
    });
});

async function getCoordinates(city: string, country: string): Promise<{latitude: string, longitude: string} | null> {
    try {
        const response = await axios.get(`${GEOCODING_BASE_URL}?key=${GEOCODING_API_KEY}&q=${encodeURIComponent(city + ', ' + country)}&format=json`);
        if (response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return { latitude: lat, longitude: lon };
        }
        return null;
    } catch (error) {
        console.error(`Error fetching coordinates: ${(error as Error).message}`);
        return null;
    }
}

async function getWeather(city: string, latitude: string, longitude: string) {
    try {
        const url = `${BASE_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        const response = await axios.get(url);
        const weather = response.data;
        console.log(`It's currently ${weather.current_weather.temperature}°C in ${city}, with weather details available.`);
    } catch (error) {
        console.error(`An error occurred: ${(error as Error).message}`);
    }
}