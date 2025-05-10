import React, { useState, useEffect, useCallback } from 'react';
import { getTaskAdvice, askTaskQuestion } from '../api/geniusService';
import styles from './GeniusAdvice.module.css';
import { FaArrowsRotate, FaLightbulb, FaQuestion, FaPaperPlane } from "react-icons/fa6";
import { LoadingBlurCard } from './LoadingBlurCard';


const GeniusAdvice: React.FC = () => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [countdownQuestion, setCountdownQuestion] = useState<number>(0);
  const [showQuestionInput, setShowQuestionInput] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>('');
  const [questionResponse, setQuestionResponse] = useState<string | null>(null);
  const [lastFunction, setLastFunction] = useState<string | null>(null);
  const [submittedQuestion, setSubmittedQuestion] = useState<string>('');

  const fetchAdvice = useCallback(async () => {
    if (loading || countdown > 0) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await getTaskAdvice();
      setAdvice(response.advice);
      setLastFunction('getTaskAdvice');
    } catch (err) {
      setError('Error al obtener el consejo. Inténtalo de nuevo.');
      console.error('Error fetching advice:', err);
    } finally {
      setCountdown(20);
      setLoading(false);
    }
  }, [loading, countdown]);

  const submitQuestion = useCallback(async () => {
    if (!question.trim()) {
      setError('La pregunta no puede estar vacía.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSubmittedQuestion(question);
      const response = await askTaskQuestion(question);
      setQuestionResponse(response.advice);
      setLastFunction('askTaskQuestion');
    } catch (err) {
      setError('Error al responder la pregunta. Inténtalo de nuevo.');
      console.error('Error submitting question:', err);
    } finally {
      setCountdownQuestion(20);
      setLoading(false);
      setShowQuestionInput(false);
      setQuestion('');
    }
  }, [question]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submitQuestion();
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (countdownQuestion > 0) {
      timer = setTimeout(() => setCountdownQuestion(countdownQuestion - 1), 1000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdownQuestion]);

  return (
    <LoadingBlurCard loading={loading}>
      <section className={styles.adviceContainer} aria-labelledby="genius-title">
        <h2 id="genius-title" className={styles.title}>Genius AI</h2>
        
        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}
        
        {lastFunction === 'askTaskQuestion' && questionResponse && (
          <QuestionResponse question={submittedQuestion} response={questionResponse} />
        )}
        
        {lastFunction === 'getTaskAdvice' && advice && (
          <Advice advice={advice} />
        )}
        
        {!lastFunction && !loading && (
          <div className={styles.advice}>
            Obtén consejos o haz preguntas sobre tus tareas actuales para optimizar tu productividad.
          </div>
        )}
        
        <div className={styles.buttonContainer}>
          <button
            className={styles.fetchButton}
            onClick={fetchAdvice}
            disabled={loading || countdown > 0}
            aria-disabled={loading || countdown > 0}
          >
            {countdown > 0 ? (
              `Espera ${countdown}s`
            ) : (
              <>
                {advice ? <FaArrowsRotate className={styles.icon} /> : <FaLightbulb className={styles.icon} />}
                {advice ? 'Nuevo consejo' : 'Obtener consejo'}
              </>
            )}
          </button>

          <button
            className={styles.questionButton}
            onClick={() => setShowQuestionInput(true)}
            disabled={loading}
          >
            <FaQuestion className={styles.icon} />
            Hacer una pregunta
          </button>
        </div>

        {showQuestionInput && (
          <div className={styles.overlay}>
            <div className={styles.modal}>
              <h3 className={styles.questionTitle}>¿Qué quieres preguntarle a Genius?</h3>
              
              <div className={styles.questionInputContainer}>
                <label htmlFor="question-input" className="sr-only">Escribe tu pregunta</label>
                <input
                  id="question-input"
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu pregunta aquí..."
                  className={styles.questionInput}
                  autoFocus
                />
              </div>
              
              <div className={styles.modalButtonContainer}>
                <button
                  className={styles.cancelButton}
                  onClick={() => setShowQuestionInput(false)}
                  type="button"
                > Cancelar
                </button>
                
                <button
                  className={styles.submitButton}
                  onClick={submitQuestion}
                  disabled={loading || !question.trim()}
                  type="submit"
                >
                  <FaPaperPlane /> Enviar
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </LoadingBlurCard>
  );
};

const QuestionResponse: React.FC<{ question: string; response: string | null }> = ({ question, response }) => {
  return (
    <div className={styles.questionResponseContainer}>
      <h3 className={styles.questionTitle}>Tu pregunta:</h3>
      {question && <p className={styles.question}>{question}</p>}
      <h3 className={styles.responseTitle}>Respuesta:</h3>
      {response && <p className={styles.response}>{response}</p>}
    </div>
  );
};

const Advice: React.FC<{ advice: string | null }> = ({ advice }) => {
  if (!advice) return null;
  
  return (
    <div className={styles.adviceContent}>
      <p className={styles.advice}>{advice}</p>
    </div>
  );
};

export default GeniusAdvice;