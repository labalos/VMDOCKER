import styles from './Card.module.css';

export function Card({ children, className = '', padding = 'md', ...props }) {
  return (
    <div className={`${styles.card} ${styles[padding]} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`${styles.header} ${className}`}>{children}</div>;
}

export function CardBody({ children, className = '' }) {
  return <div className={`${styles.body} ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={`${styles.footer} ${className}`}>{children}</div>;
}