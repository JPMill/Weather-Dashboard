import dotenv from 'dotenv';
dotenv.config();


interface Coordinates {
  latitude: number;
  longitude: number;
}

class Weather {
  temperature: number;
  humidity: number;
  description: string;
  windspeed: number;
  date?: string;
  icon?: string;
  
  constructor (temperature: number, humidity: number, description: string, windspeed: number, date?: string, icon?: string) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.description = description;
    this.windspeed = windspeed;
    this.date = date ?? new Date().toISOString();
    this.icon = icon ?? '';
  }
}

class WeatherService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    // Validate environment variables
    if (!process.env.API_BASE_URL || !process.env.API_KEY) {
      throw new Error("Missing required environment variables: API_BASE_URL or API_KEY");
    }

    this.baseURL = process.env.API_BASE_URL;
    this.apiKey = process.env.API_KEY;
  }

  private async fetchLocationData(query: string): Promise<Coordinates> {
    const response = await fetch(this.buildGeocodeQuery(query));
    const locationData = await response.json();
    return this.destructureLocationData(locationData[0])
  }
 
  private destructureLocationData(locationData: any): Coordinates {
    return {
      latitude: locationData.lat,
      longitude: locationData.lon,
    }
  }

  private buildGeocodeQuery(city: string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${city}&appid=${this.apiKey}`
  }
  
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}&units=metric`;
  }

  private buildForecastQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}&units=metric`;
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    const weatherData = await response.json();
    return weatherData;
    }

  private async fetchForecastData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildForecastQuery(coordinates));
    const forecastData = await response.json();
    return forecastData;
  }
  
  private parseCurrentWeather(response: any): Weather {
    return new Weather(
      response.main.temp,
      response.main.humidity,
      response.weather[0].description,
      response.wind.speed,
      response.weather[0].icon
    )
  }

  private buildForecastArray(weatherData: any[]): Weather[] {
    return weatherData.map((data: any) => {
      return new Weather(
        data.main.temp,
        data.main.humidity,
        data.weather[0].description,
        data.wind.speed,
        data.dt_txt, 
        data.weather[0].icon
      );
    });
  }
  
  async getWeatherForCity(city: string): Promise<Weather> {
    const coordinates = await this.fetchLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    return this.parseCurrentWeather(weatherData);
  }

  async getWeatherForecast(city: string): Promise<Weather[]> {
    const coordinates = await this.fetchLocationData(city);
    const forecastData = await this.fetchForecastData(coordinates);
    return this.buildForecastArray(forecastData.list);
  }
}

export default new WeatherService();
