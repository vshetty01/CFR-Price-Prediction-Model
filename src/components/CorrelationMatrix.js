import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CorrelationMatrix.css';

function CorrelationMatrix() {
  const [correlationMatrix, setCorrelationMatrix] = useState(null);

  useEffect(() => {
    const fetchCorrelationMatrix = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/correlation-matrix');
        setCorrelationMatrix(response.data.correlationMatrix);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchCorrelationMatrix();
  }, []);

  return (
    <div className="correlation-matrix">
      <h2>Correlation Matrix</h2>
      {correlationMatrix && (
        <table>
          <thead>
            <tr>
              <th></th>
              {Object.keys(correlationMatrix).map((variable) => (
                <th key={variable}>{variable}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(correlationMatrix).map(([variable, values]) => (
              <tr key={variable}>
                <td>{variable}</td>
                {Object.values(values).map((value, index) => (
                  <td key={index}>{value.toFixed(2)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CorrelationMatrix;

