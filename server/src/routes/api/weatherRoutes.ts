import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const { cityName } = req.body;

  if (!cityName) {
    return res.status(400).json({ message: 'City name is required' });
  }

  try {
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    await HistoryService.addCity(cityName);

    console.log('Weather Data: ', weatherData)

    return res.status(200).json({
      message: 'Weather data retrieved and city saved to history',
      weatherData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch weather data or save city' });
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).send({message: `Error fetching search history`, error})
  }
});

// * BONUS TODO: DELETE city from search history
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
