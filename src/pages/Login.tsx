import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginRequestDto } from '../types/Auth';  
import { useAuth } from '../hooks/useAuth'; 
import { LoadingBlurCard } from '../components/LoadingBlurCard';
import styles from './Login.module.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState<LoginRequestDto>({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!loginData.email || !loginData.password) {
      setError('Por favor, completa todos los campos.');
      setLoading(false);
      return;
    }

    try {
      await login(loginData);
      navigate('/'); 
    } catch (err) {
      console.error(err);
      setError('Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <main className={styles.loginContainer}>
      <LoadingBlurCard loading={loading}>
        <h1 className={styles.loginTitle}>Iniciar Sesión</h1>
        {error && <p className={styles.errorMessage} role="alert">{error}</p>}
        <form onSubmit={handleSubmit} className={styles.loginForm} aria-label="Formulario de inicio de sesión">
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>Correo Electrónico</label>
            <input
              type="email"
              id="email"
              required
              placeholder="correo@ejemplo.com"
              value={loginData.email || ''}
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
              value={loginData.password ||''}
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
            Iniciar Sesión
          </button>
          <button 
            type="button" 
            onClick={handleRegisterRedirect} 
            className={styles.secondaryButton}
          >
            Registrarse
          </button>
        </form>
      </LoadingBlurCard>
    </main>
  );
}

export default Login;