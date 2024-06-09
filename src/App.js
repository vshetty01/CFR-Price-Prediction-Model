import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Models from './components/Models';
import CorrelationMatrix from './components/CorrelationMatrix';
import VariableImportance from './components/VariableImportance';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navigation">
          <Link to="/">HOME</Link>
          <Link to="/models">MODELS</Link>
          <Link to="/correlation-matrix">CORRELATION MATRIX</Link>
          <Link to="/variable-importance">VARIABLE IMPORTANCE</Link>
        </nav>

        <div className="content">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/models" element={<Models />} />
            <Route path="/correlation-matrix" element={<CorrelationMatrix />} />
            <Route path="/variable-importance" element={<VariableImportance />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;