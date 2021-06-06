import express, { response } from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

const router = express.Router();

dotenv.config();

router.get('/', async (req, res) => {
    const city = 'delhi';
    const country = 'india';
    const apiKey = process.env.OPEN_WEATHER_API_KEY;

    try {
        const locationResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&limit=1&appid=${apiKey}`);
        if (locationResponse.status === 400) {
            throw new Error("Location could not be fetched");
        }

        const locationData = await locationResponse.json();
        const { lat, lon } = locationData[0];

        const pollutionResponse = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        if (pollutionResponse.status === 400) {
            throw new Error("Pollution could not be fetched");
        }
        
        const pollutionData = await pollutionResponse.json();
        res.send(pollutionData);
    }
    catch (err) {
        res.status(500).send({
            error: err.message,
            message: "Server error"
        })
    }
})

export default router;