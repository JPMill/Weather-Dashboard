import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

//POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const { cityName } = req.body;

  if (!cityName) {
    return res.status(400).json({ message: 'City name is required' });
  }

  try {
    const currentWeather = await WeatherService.getWeatherForCity(cityName);
    const forecast = await WeatherService.getWeatherForecast(cityName);
    await HistoryService.addCity(cityName);

    console.log('Weather Data: ', currentWeather);
    console.log('Forecast Data: ', forecast);

    return res.status(200).json({
      message: 'Weather data retrieved and city saved to history',
      weatherData: {
        currentWeather,
        forecast
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch weather data or save city' });
  }
});

// GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).send({message: `Error fetching search history`, error})
  }
});

// DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const {id} = req.params;
  try {
    await HistoryService.removeCity(id);
    res.status(200).send({message: `City with ID ${id} removed from history`});
  } catch (error) {
    res.status(500).send({message: `Error removing city from history`, error})
  }
});

export default router;
