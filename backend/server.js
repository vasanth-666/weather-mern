const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = 6005;

const Weathermodel = require('./models/weather');

const app = express();

app.use(express.json());
app.use(
  cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: 'http://localhost:3000', 
  })
);


mongoose.connect('mongodb://127.0.0.1:27017/Weather', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.post('/insert', async (req, res) => {
  const { city, country, date, temperature, weather, description } = req.body;

  const weatherDetail = new Weathermodel({
    city,
    country,
    date,
    temperature,
    weather,
    description,
  });

  try {
    await weatherDetail.save();
    return res.status(200).json({ message: 'Weather details saved successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error saving weather details' });
  }
});

app.get('/read', async (req, res) => {
  try {
    const result = await Weathermodel.find({});
    return res.status(200).send(result);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'Error fetching weather details' });
  }
});

app.put('/update', async (req, res) => {
  const { id, newCity, newCountry, newDate, newTemperature, newWeather, newDescription } = req.body;

  try {
    const updatedWeather = await Weathermodel.findByIdAndUpdate(
      id,
      {
        city: newCity,
        country: newCountry,
        date: newDate,
        temperature: newTemperature,
        weather: newWeather,
        description: newDescription,
      },
      { new: true }
    );

    if (!updatedWeather) {
      return res.status(404).json({ message: 'Weather details not found' });
    }

    return res.status(200).json({ message: 'Weather details updated successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error updating weather details' });
  }
});

app.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Weathermodel.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Weather details not found' });
    }

    return res.status(200).json({ message: 'Weather details deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error deleting weather details' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
