"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const readline_1 = __importDefault(require("readline"));
const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_API_KEY = 'pk.75ba8741725396e2c3231211a345d483';
const GEOCODING_BASE_URL = 'https://us1.locationiq.com/v1/search.php';
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question('Enter city name: ', (city) => {
    rl.question('Enter country: ', (country) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const location = yield getCoordinates(city, country);
            if (location) {
                yield getWeather(city, location.latitude, location.longitude);
            }
            else {
                console.log('Could not find the location.');
            }
        }
        catch (error) {
            console.error(`An error occurred: ${error.message}`);
        }
        finally {
            rl.close();
        }
    }));
});
function getCoordinates(city, country) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`${GEOCODING_BASE_URL}?key=${GEOCODING_API_KEY}&q=${encodeURIComponent(city + ', ' + country)}&format=json`);
            if (response.data.length > 0) {
                const { lat, lon } = response.data[0];
                return { latitude: lat, longitude: lon };
            }
            return null;
        }
        catch (error) {
            console.error(`Error fetching coordinates: ${error.message}`);
            return null;
        }
    });
}
function getWeather(city, latitude, longitude) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = `${BASE_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
            const response = yield axios_1.default.get(url);
            const weather = response.data;
            let emoji = '';
            switch (weather.current_weather.weather_code) {
                case 'clear':
                    emoji = '☀️';
                    break;
                case 'cloudy':
                    emoji = '☁️';
                    break;
                case 'rain':
                    emoji = '🌂';
                    break;
                default:
                    emoji = '';
            }
            console.log(`It's currently ${weather.current_weather.temperature}°C in ${city}, with weather details available. ${weather.current_weather.weather_code} ${emoji}`);
        }
        catch (error) {
            console.error(`An error occurred: ${error.message}`);
        }
    });
}
//# sourceMappingURL=index.js.map