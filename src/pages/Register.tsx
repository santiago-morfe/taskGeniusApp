import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterRequestDto } from '../types/Auth';
import { useAuth } from '../hooks/useAuth';
import { LoadingBlurCard } from '../components/LoadingBlurCard';
import styles from './Register.module.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registerData, setRegisterData] = useState<RegisterRequestDto>({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setRegisterData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!registerData.name || !registerData.email || !registerData.password) {
      setError('Por favor, completa todos los campos.');
      setLoading(false);
      return;
    }

    try {
      await register(registerData);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(typeof err === 'string' ? err : 'Error al registrarse. Por favor, inténtelo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <main className={styles.registerContainer}>
      <LoadingBlurCard loading={loading}>
        <h1 className={styles.registerTitle}>Registro</h1>
        {error && <p className={styles.errorMessage} role="alert">{error}</p>}
        <form onSubmit={handleSubmit} className={styles.registerForm} aria-label="Formulario de registro">
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.formLabel}>Nombre</label>
            <input
              type="text"
              id="name"
              required
              placeholder="Nombre completo"
              value={registerData.name || ''}
              onChange={handleChange}
              className={styles.formInput}
              aria-required="true"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>Correo Electrónico</label>
            <input
              type="email"
              id="email"
              required
              placeholder="correo@ejemplo.com"
              value={registerData.email || ''}
              onChange={handleChange}
              className={styles.formInput}
              aria-required="true"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>Contraseña</label>
            <input
              type="password"
              id="password"
              required
              placeholder="********"
              value={registerData.password || ''}
              onChange={handleChange}
              className={styles.formInput}
              aria-required="true"
            />
          </div>
          <button 
            type="submit" 
            className={styles.primaryButton}
            disabled={loading}
          >
            Registrarse
          </button>
          <button 
            type="button" 
            onClick={handleLoginRedirect} 
            className={styles.secondaryButton}
          >
            Iniciar Sesión
          </button>
        </form>
      </LoadingBlurCard>
    </main>
  );
}

export default Register;