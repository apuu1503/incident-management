import React, { useState } from 'react';
import Login from '../pages/Login'; 
import Register from '../pages/Register'; 

export default function AuthToggle() {

  const [currentView, setCurrentView] = useState('login');

  const toggleView = (view) => {
    setCurrentView(view);
  };

  return (
 
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
    
      <div 
        className="card shadow-lg overflow-hidden" 
        style={{ maxWidth: '400px', width: '100%' }}
      >
        <div className="card-body">
        
          {currentView === 'login' ? (
            <Login toggleView={toggleView} />
          ) : (
            <Register toggleView={toggleView} />
          )}
        </div>
      </div>
    </div>
  );
}