import express, { response } from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

const router = express.Router();

dotenv.config();

/*
Structure of response
{
    "level": <class>
    "pollutants": [
        {
            "name": "co2",
            "value": <value>
        },
        {
            "name": "co",
            "value": <value>
        },
        {
            "name": "pm2.5",
            "value": <value>
        },
        {
            "name": "pm10",
            "value": <value>
        }
    ]
}
*/

router.get('/', async (req, res) => {
    const { lat, lon } = req.query;
    const apiKey = process.env.OPEN_WEATHER_API_KEY;

    try {
        const pollutionResponse = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        if (pollutionResponse.status === 400) {
            throw new Error("Pollution could not be fetched");
        }
        const pollutionData = await pollutionResponse.json();
        const pollutantsList = pollutionData.list[0].components;

        let refactoredList = Object.keys(pollutantsList).map(pollutant => {
            let name = '';
            if (pollutant === 'co') {
                name = 'Carbon Monoxide';
            }
            if (pollutant === 'no') {
                name = 'Nitrogen Monoxide';
            }
            if (pollutant === 'no2') {
                name = 'Nitrogen Dioxide';
            }
            if (pollutant === 'o3') {
                name = 'Ozone';
            }
            if (pollutant === 'so2') {
                name = 'Sulphur Dioxide';
            }
            if (pollutant === 'pm2_5') {
                name = 'PM2.5';
            }
            if (pollutant === 'pm10') {
                name = 'PM10';
            }
            if (pollutant === 'nh3') {
                name = 'Ammonia';
            }
            
            return {
                name: name,
                value: pollutantsList[pollutant]
            }
        });

        const pollutionClassResponse = await fetch(`http://127.0.0.1:5000/?data=${JSON.stringify(pollutantsList)}`);
        const pollutionClass = await pollutionClassResponse.json();
        console.log(pollutionClass)

        const finalData = {
            level: pollutionClass['prediction'],
            pollutants: [
                ...refactoredList,
                {
                    name: "AQI",
                    value: '56PPI'
                }
            ]
        }

        res.send(finalData);
    }
    catch (err) {
        res.status(500).send({
            error: err.message,
            message: "Server error"
        })
    }
});

export default router;