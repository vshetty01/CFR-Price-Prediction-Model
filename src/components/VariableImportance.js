import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VariableImportance.css';

function VariableImportance() {
  const [variableImportance, setVariableImportance] = useState(null);

  useEffect(() => {
    const fetchVariableImportance = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/variable-importance');
        setVariableImportance(response.data.variableImportance);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchVariableImportance();
  }, []);

  return (
    <div className="variable-importance">
      <h2>Feature Importances Across Different Ensemble Models:</h2>
      {variableImportance && (
        <table>
          <thead>
            <tr>
              <th>Variable</th>
              <th>FOB (TURKEY)</th>
              <th>EXCHANGE RATE (USD PER LIRA)</th>
              <th>NATURAL GAS PRICES (USD PER MMBtu)</th>
              <th>COAL PRICES 4200</th>
              <th>CHINA PRODUCTION</th>
              <th>COST HOU $ PER MT (EXCL NH4Cl)</th>
              <th>COST HOU $ PER MT (INCLUDE SOLVAY)</th>
              <th>US SODA ASH PRODUCTION (THOUSAND METRIC TONNE)</th>
              <th>LOCAL PRICE CHINA (LIGHT)</th>
              <th>LOCAL PRICE CHINA (DENSE)</th>
              <th>CHINA SODA ASH FOB ($/METRIC TONNES)</th>
              <th>US ENERGY PRICE ($/MMBtu)</th>
              <th>EUROPE ENERGY PRICE</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(variableImportance).map(([variable, values], index) => (
              <tr key={variable}>
                <td>{variable}</td>
                {Object.values(values).map((value, idx) => (
                  <td key={idx}>{value.toFixed(6)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default VariableImportance;