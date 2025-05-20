import React from 'react';
import { useRouter } from 'next/router';
import { BookOpen, ChevronRight, Trophy, Computer, LibraryBig } from 'lucide-react';

const LandingPage = () => {
  const router = useRouter();

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.logo}>
          <BookOpen size={48} color="#3b82f6" />
          <span style={styles.logoText}>Korepetycje online</span>
        </div>
        
        <h1 style={styles.title}>Znajdź idealnego korepetytora</h1>
        
        <p style={styles.subtitle}>
          Połącz się z najlepszymi nauczycielami w całej Polsce. 
          Matematyka, fizyka, języki obce i wiele więcej!
        </p>
        
        <div style={styles.ctaContainer}>
          <button 
            style={styles.primaryButton}
            onClick={() => router.push("/login")}
          >
            Rozpocznij naukę
            <ChevronRight size={20} />
          </button>
          
          <button 
            style={styles.secondaryButton}
            onClick={() => router.push("/about")}
          >
            Dowiedz się więcej
          </button>
        </div>
      </div>
      
      <div style={styles.features}>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>
            <LibraryBig size={30} color="green" />
          </div>
          <h3 style={styles.featureTitle}>Dziesiątki przedmiotów</h3>
          <p style={styles.featureText}>Od matematyki po programowanie</p>
        </div>
        
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>
            <Trophy size={30} color="orange" />
          </div>
          <h3 style={styles.featureTitle}>Weryfikowani nauczyciele</h3>
          <p style={styles.featureText}>Tylko najlepsi specjaliści</p>
        </div>
        
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>
            <Computer size={30} />
          </div>
          <h3 style={styles.featureTitle}>Lekcje online</h3>
          <p style={styles.featureText}>Ucz się wygodnie z domu</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    fontFamily: "'Inter', sans-serif",
    color: '#1f2937',
    backgroundColor: '#f9fafb',
  },
  hero: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '2rem',
  },
  logoText: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1e40af',
  },
  title: {
    fontSize: '3rem',
    fontWeight: '800',
    lineHeight: '1.2',
    margin: '0 0 1rem 0',
    background: 'linear-gradient(45deg, #1e40af, #3b82f6)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#4b5563',
    maxWidth: '600px',
    margin: '0 auto 2.5rem auto',
    lineHeight: '1.6',
  },
  ctaContainer: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#2563eb',
      transform: 'translateY(-1px)',
    },
  },
  secondaryButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'transparent',
    color: '#3b82f6',
    border: '1px solid #3b82f6',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#eff6ff',
      transform: 'translateY(-1px)',
    },
  },
  features: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    width: '280px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
    },
  },
  featureIcon: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  featureTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    margin: '0 0 0.5rem 0',
    color: '#1f2937',
  },
  featureText: {
    color: '#6b7280',
    margin: 0,
    lineHeight: '1.5',
  },
};

export default LandingPage;