import React, { useState } from 'react';

const PollutionMeter = () => {
    const [data, setData] = useState({});
    const [formData, setFormData] = useState({
        city: '',
        country: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const getPollutants = async (event) => {
        event.preventDefault();
        const { city, country } = formData;
        try {
            const response = await fetch(`http://localhost:3000/pollution?city=${city}&country=${country}`);

            if (response.status === 400) {
                throw new Error('Could not fetch pollution data from client');
            }

            const data = await response.json();
            console.log(data);
            setData(data);
        }
        catch (err) {
            console.error('Error: ', err.message);
        }
    }

    return (
        <form onSubmit={getPollutants}>
            <label htmlFor="city">Enter city</label>
            <input id="city" name="city" onChange={handleChange}/>
            <label htmlFor="country">Enter country</label>
            <input id="country" name="country" onChange={handleChange}/>
            <button>Get pollutants</button>
            <ul>
                {
                    Object.keys(data).map((pollutant, idx) => <li key={idx}>{`${pollutant}: ${data[pollutant]}`}</li>)
                }
            </ul>
        </form>
    )
}

export default PollutionMeter;