import styles from './Input.module.css';

export function Input({ 
  label, 
  error, 
  className = '',
  id,
  ...props 
}) {
  const inputId = id || Math.random().toString(36).substr(2, 9);
  
  return (
    <div className={`${styles.formGroup} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`${styles.input} ${error ? styles.error : ''}`}
        {...props}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}