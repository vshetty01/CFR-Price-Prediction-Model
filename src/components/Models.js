import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './Models.css';

function Models() {
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [models, setModels] = useState(null);

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleFeatureChange = (e) => {
    const feature = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      setSelectedFeatures([...selectedFeatures, feature]);
    } else {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feature));
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/models', {
        selectedModel,
        selectedFeatures,
      });
      setModels(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="models">
      <h2>PRICE FORECASTING MODEL</h2>
      <div className="model-selection">
        <label htmlFor="model-select">Select a model:</label>
        <select id="model-select" value={selectedModel} onChange={handleModelChange}>
          <option value="">Choose a model</option>
          <option value="Random Forest">Random Forest</option>
          <option value="Gradient Boosting">Gradient Boosting</option>
          <option value="AdaBoost">AdaBoost</option>
        </select>
      </div>

      <div className="feature-selection">
        <h3>Feature Selection</h3>
        <label>
          <input
            type="checkbox"
            value="FOB (TURKEY)"
            checked={selectedFeatures.includes('FOB (TURKEY)')}
            onChange={handleFeatureChange}
          />
          FOB (TURKEY)
        </label>
        <label>
          <input
            type="checkbox"
            value="EXCHANGE RATE (USD PER LIRA)"
            checked={selectedFeatures.includes('EXCHANGE RATE (USD PER LIRA)')}
            onChange={handleFeatureChange}
          />
          EXCHANGE RATE (USD PER LIRA)
        </label>
        <label>
          <input
            type="checkbox"
            value="NATURAL GAS PRICES (USD PER MMBtu)"
            checked={selectedFeatures.includes('NATURAL GAS PRICES (USD PER MMBtu)')}
            onChange={handleFeatureChange}
          />
          NATURAL GAS PRICES (USD PER MMBtu)
        </label>
        <label>
          <input
            type="checkbox"
            value="COAL PRICES 4200"
            checked={selectedFeatures.includes('COAL PRICES 4200')}
            onChange={handleFeatureChange}
          />
          COAL PRICES 4200
        </label>
        <label>
          <input
            type="checkbox"
            value="CHINA PRODUCTION"
            checked={selectedFeatures.includes('CHINA PRODUCTION')}
            onChange={handleFeatureChange}
          />
          CHINA PRODUCTION
        </label>
        <label>
          <input
            type="checkbox"
            value="COST HOU $ PER MT (EXCL NH4Cl)"
            checked={selectedFeatures.includes('COST HOU $ PER MT (EXCL NH4Cl)')}
            onChange={handleFeatureChange}
          />
          COST HOU $ PER MT (EXCL NH4Cl)
        </label>
        <label>
          <input
            type="checkbox"
            value="COST HOU $ PER MT (INCLUDE SOLVAY)"
            checked={selectedFeatures.includes('COST HOU $ PER MT (INCLUDE SOLVAY)')}
            onChange={handleFeatureChange}
          />
          COST HOU $ PER MT (INCLUDE SOLVAY)
        </label>
        <label>
          <input
            type="checkbox"
            value="US SODA ASH PRODUCTION (THOUSAND METRIC TONNE)"
            checked={selectedFeatures.includes('US SODA ASH PRODUCTION (THOUSAND METRIC TONNE)')}
            onChange={handleFeatureChange}
          />
          US SODA ASH PRODUCTION (THOUSAND METRIC TONNE)
        </label>
        <label>
          <input
            type="checkbox"
            value="LOCAL PRICE CHINA (LIGHT)"
            checked={selectedFeatures.includes('LOCAL PRICE CHINA (LIGHT)')}
            onChange={handleFeatureChange}
          />
          LOCAL PRICE CHINA (LIGHT)
        </label>
        <label>
          <input
            type="checkbox"
            value="LOCAL PRICE CHINA (DENSE)"
            checked={selectedFeatures.includes('LOCAL PRICE CHINA (DENSE)')}
            onChange={handleFeatureChange}
          />
          LOCAL PRICE CHINA (DENSE)
        </label>
        <label>
          <input
            type="checkbox"
            value="CHINA SODA ASH FOB ($/METRIC TONNES)"
            checked={selectedFeatures.includes('CHINA SODA ASH FOB ($/METRIC TONNES)')}
            onChange={handleFeatureChange}
          />
          CHINA SODA ASH FOB ($/METRIC TONNES)
        </label>
        <label>
          <input
            type="checkbox"
            value="US ENERGY PRICE ($/MMBtu)"
            checked={selectedFeatures.includes('US ENERGY PRICE ($/MMBtu)')}
            onChange={handleFeatureChange}
          />
          US ENERGY PRICE ($/MMBtu)
        </label>
        <label>
          <input
            type="checkbox"
            value="EUROPE ENERGY PRICE"
            checked={selectedFeatures.includes('EUROPE ENERGY PRICE')}
            onChange={handleFeatureChange}
          />
          EUROPE ENERGY PRICE
        </label>
      </div>

      <button className="predict-button" onClick={handleSubmit}>
        Predict
      </button>

      {models && (
        <div className="result-section">
          {Object.keys(models).map((model) => (
            <div key={model}>
              <h3>{model}</h3>
              <p>Accuracy: {models[model].accuracy.toFixed(2)}%</p>
              <p>Mean Squared Error: {models[model].mse.toFixed(4)}</p>
              <LineChart
                width={800}
                height={400}
                data={models[model].actualVsPredicted.dates.map((date, index) => ({
                  date,
                  actual: models[model].actualVsPredicted.actual[index],
                  predicted: models[model].actualVsPredicted.predicted[index],
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="predicted" stroke="#82ca9d" />
              </LineChart>

              <h3>Future Predictions</h3>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Predicted Value</th>
                  </tr>
                </thead>
                <tbody>
                  {models[model].futurePredictions.dates.map((date, index) => (
                    <tr key={date}>
                      <td>{date}</td>
                      <td>{models[model].futurePredictions.predictions[index].toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Models;