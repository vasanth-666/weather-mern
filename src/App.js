import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [currentWeather, setCurrentWeather] = useState({
    id: "",
    city: "",
    country: "",
    date: "",
    temperature: "",
    weather: "",
    description: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:6005/read");
      setWeatherData(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentWeather((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (currentWeather.id) {
        await axios.put("http://localhost:6005/update", {
          id: currentWeather.id,
          newCity: currentWeather.city,
          newCountry: currentWeather.country,
          newDate: currentWeather.date,
          newTemperature: currentWeather.temperature,
          newWeather: currentWeather.weather,
          newDescription: currentWeather.description,
        });
      } else {
        await axios.post("http://localhost:6005/insert", currentWeather);
      }
      setCurrentWeather({
        id: "",
        city: "",
        country: "",
        date: "",
        temperature: "",
        weather: "",
        description: "",
      });
      fetchData();
    } catch (err) {
      console.error("Error saving data:", err);
    }
  };

  const handleEdit = (data) => {
    setCurrentWeather({
      id: data._id,
      city: data.city,
      country: data.country,
      date: data.date,
      temperature: data.temperature,
      weather: data.weather,
      description: data.description,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:6005/delete/${id}`);
      fetchData();
    } catch (err) {
      console.error("Error deleting data:", err);
    }
  };

  return (
    <div className="container-fluid mt-3">
      <h1 className="text-center">Weather Forecast</h1>
      <div className="border p-3 rounded">
        <div className="row g-3">
          <div className="col-md-6 col-12">
            <label>City:</label>
            <input className="form-control" name="city" value={currentWeather.city} onChange={handleChange} />
          </div>
          <div className="col-md-6 col-12">
            <label>Country:</label>
            <input className="form-control" name="country" value={currentWeather.country} onChange={handleChange} />
          </div>
        </div>
        <div className="row g-3 mt-2">
          <div className="col-md-6 col-12">
            <label>Date:</label>
            <input type="date" className="form-control" name="date" value={currentWeather.date} onChange={handleChange} />
          </div>
          <div className="col-md-6 col-12">
            <label>Temperature:</label>
            <input className="form-control" name="temperature" value={currentWeather.temperature} onChange={handleChange} />
          </div>
        </div>
        <div className="row g-3 mt-2">
          <div className="col-md-6 col-12">
            <label>Weather:</label>
            <input className="form-control" name="weather" value={currentWeather.weather} onChange={handleChange} />
          </div>
          <div className="col-md-6 col-12">
            <label>Description:</label>
            <input className="form-control" name="description" value={currentWeather.description} onChange={handleChange} />
          </div>
        </div>
        <button className="btn btn-primary w-100 mt-3" onClick={handleSubmit}>
          {currentWeather.id ? "Update" : "Submit"}
        </button>
      </div>
      <hr />
      <table className="table table-responsive table-striped">
        <thead>
          <tr>
            <th>City</th>
            <th>Country</th>
            <th>Date</th>
            <th>Temperature</th>
            <th>Weather</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {weatherData.map((data) => (
            <tr key={data._id}>
              <td>{data.city}</td>
              <td>{data.country}</td>
              <td>{data.date}</td>
              <td>{data.temperature}</td>
              <td>{data.weather}</td>
              <td>{data.description}</td>
              <td>
                <button className="btn btn-warning me-2" onClick={() => handleEdit(data)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(data._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
