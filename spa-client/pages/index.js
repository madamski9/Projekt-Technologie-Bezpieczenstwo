import React from 'react'
import { useRouter } from 'next/router';

const LandingPage = () => {
  const router = useRouter()

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>Witamy na stronie korepetycji!</h1>
      <p>Zaloguj się, aby kontynuować</p>
      <button 
        style={{ marginTop: 20, padding: '10px 20px' }}
        onClick={() => router.push("/login")}
        >
        Zaloguj
      </button>
    </div>
  );
};

export default LandingPage;
