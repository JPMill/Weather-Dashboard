import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}
// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  humidity: number;
  description: string;
  windspeed: number;
  
  constructor (temperature: number, humidity: number, description: string, windspeed: number) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.description = description;
    this.windspeed = windspeed;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL: string = "https://api.openweathermap.org/data/2.5";
  private apiKey: string = process.env.API_KEY || '';
  private cityName: string = '';
  // TODO: Define the baseURL, API key, and city name properties
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const response = await fetch(`${this.baseURL}/geo/1.0/direct?q=${query}&appid=${this.apiKey}`);
    const locationData = await response.json();
    return this.destructureLocationData(locationData[0])
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return {
      latitude: locationData.lat,
      longitude: locationData.lon,
    }
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(city: string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${city}&appid=${this.apiKey}`
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(query: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(query);
    return locationData;
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    const weatherData = await response.json();
    return weatherData;
    }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    return new Weather(
      response.main.temp,
      response.main.humidity,
      response.weather[0].description,
      response.wind.speed
    )
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    return weatherData.map((data) => new Weather(
      data.main.temp,
      data.main.humidity,
      data.weather[0].description,
      data.wind.speed
    ));
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather> {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    return this.parseCurrentWeather(weatherData)
  }
}

export default new WeatherService();
