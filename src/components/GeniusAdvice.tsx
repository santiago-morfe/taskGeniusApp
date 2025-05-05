import React, { useState, useEffect } from 'react';
import { getTaskAdvice } from '../api/geniusService';
import styles from './GeniusAdvice.module.css';

const GeniusAdvice: React.FC = () => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(0);

  const fetchAdvice = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTaskAdvice();
      setAdvice(response.advice);
      setCountdown(60);
    } catch (err) {
      setError('Error al obtener el consejo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div className={styles.adviceContainer}>
      <h2 className={styles.title}>Consejo del día</h2>
      {advice && <p className={styles.advice}>{advice}</p>}
      {error && <div className={styles.error}>{error}</div>}
      <button 
        className={styles.fetchButton} 
        onClick={fetchAdvice} 
        disabled={loading || countdown > 0}
      >
        {loading ? 'Cargando consejo...' : countdown > 0 ? `Espera ${countdown}s` : 'Obtener consejo'}
      </button>
    </div>
  );
};

export default GeniusAdvice;