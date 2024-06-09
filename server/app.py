from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, AdaBoostRegressor
from sklearn.metrics import r2_score, mean_squared_error
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)
CORS(app)

# Load the Excel file
file_path =  r'C:\Users\vshetty\Downloads\fvariables.xlsx'
data = pd.read_excel(file_path)

# Add a time column if it doesn't exist
if 'Date' not in data.columns:
    data['Date'] = pd.date_range(start='2017-01-01', periods=len(data), freq='M')

# Define the target and features
target = 'CFR INIDIA FROM TURKEY (AS PER  VOLZA)'
features = [
    'TURKEY ENERGY PRICE($ / MMBtu)',
    'COAL PRICES 4200 GAR',
    'CHINA SODA ASH PRODUCTION (THOUSAND METRIC TONNE)',
    'COST HOU $ PER MT (EXCL NH4Cl)',
    'COST SOLVAY $ PER MT',
    'US SODA ASH PRODUCTION (THOUSAND METRIC TONNE)',
    'LOCAL PRICE CHINA (LIGHT)',
    'LOCAL PRICE CHINA (DENSE)',
    'CHINA SODA ASH FOB ($/METRIC TONNES)',
    'US ENERGY PRICE ($/MMBtu)',
    'EUROPE ENERGY PRICE($/MMBtu)',
    'EXCHANGE RATE (USD PER LIRA)'
]

@app.route('/api/features', methods=['GET'])
def get_all_features():
    return jsonify({'features': features})

@app.route('/api/models', methods=['POST'])
def train_model():
    selected_model = request.json['selectedModel']
    selected_features = request.json['selectedFeatures']

    # Split the data into input features (X) and target variable (y)
    X = data[selected_features]
    y = data[target]
    dates = data['Date']

    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test, dates_train, dates_test = train_test_split(X, y, dates, test_size=0.2, random_state=42)

    # Create and train the selected model
    if selected_model == 'Random Forest':
        model = RandomForestRegressor(n_estimators=100, random_state=42)
    elif selected_model == 'Gradient Boosting':
        model = GradientBoostingRegressor(n_estimators=100, random_state=42)
    elif selected_model == 'AdaBoost':
        model = AdaBoostRegressor(n_estimators=100, random_state=42)
    else:
        return jsonify({'error': 'Invalid model selected'}), 400

    model.fit(X_train, y_train)

    # Make predictions and evaluate the model
    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    accuracy = r2 * 100
    mse = mean_squared_error(y_test, y_pred)

    # Create a date range for future predictions
    future_dates = pd.date_range(start='2024-01-01', periods=10, freq='M')

    # Assume the last known row of data is used to make future predictions
    last_known_data = X.iloc[-1].values.reshape(1, -1)

    # Generate future predictions using the rolling window approach
    future_pred = rolling_predictions(model, last_known_data, 10)

    response = {
        selected_model: {
            'accuracy': accuracy,
            'mse': mse,
            'actualVsPredicted': {
                'dates': dates_test.tolist(),
                'actual': y_test.tolist(),
                'predicted': y_pred.tolist()
            },
            'futurePredictions': {
                'dates': future_dates.tolist(),
                'predictions': future_pred
            }
        }
    }

    return jsonify(response)

# Rolling window prediction function
def rolling_predictions(model, last_known_data, n_periods):
    future_pred = []
    current_data = last_known_data.copy()
    for _ in range(n_periods):
        pred = model.predict(current_data)
        future_pred.append(pred[0])
        # Update the current_data with the new prediction
        # Assuming the last feature is the target we predicted, add it to the end and remove the oldest feature
        current_data = np.append(current_data[:, 1:], pred).reshape(1, -1)
    return future_pred

@app.route('/api/correlation-matrix', methods=['GET'])
def get_correlation_matrix():
    numeric_data = data[features].select_dtypes(include=[np.number])
    corr_matrix = numeric_data.corr()

    response = {
        'correlationMatrix': corr_matrix.to_dict()
    }

    return jsonify(response)

@app.route('/api/variable-importance', methods=['GET'])
def get_variable_importance():
    # Remove rows with missing values in the target variable
    df = data.dropna(subset=[target])

    # Split the data into features (X) and target (y)
    X = df[features]
    y = df[target]

    # Standardize the features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

    models = {
        'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42),
        'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, random_state=42),
        'AdaBoost': AdaBoostRegressor(n_estimators=100, random_state=42)
    }

    importances = {}
    for name, model in models.items():
        model.fit(X_train, y_train)
        if hasattr(model, 'feature_importances_'):
            importances[name] = model.feature_importances_

    # Normalize importances
    for name in importances:
        importances[name] /= np.max(importances[name])

    response = {
        'variableImportance': importances
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
