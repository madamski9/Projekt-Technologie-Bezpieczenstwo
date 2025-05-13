'use client'

import React from 'react'
import "./globals.css"

const LandingPage = () => {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>Witamy na stronie korepetycji!</h1>
      <p>Zaloguj się, aby kontynuować</p>
      <a href="http://localhost:3002/login">
        <button style={{ marginTop: 20, padding: '10px 20px' }}>
          Zaloguj
        </button>
      </a>
    </div>
  );
};

export default LandingPage;
