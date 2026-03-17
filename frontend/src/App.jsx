import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Deals from './pages/Deals';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Public Login Route */}
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? (
              <Login setAuth={setIsAuthenticated} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        {/* Protected Dashboard Routes */}
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <div className="flex bg-gray-50 min-h-screen">
                <Sidebar onLogout={handleLogout} />
                
                <div className="flex-1 flex flex-col min-h-screen">
                  <Navbar onLogout={handleLogout} />
                  
                  <main className="flex-1 p-8 overflow-y-auto">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/leads" element={<Leads />} />
                      <Route path="/deals" element={<Deals />} />
                      {/* Fallback */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
