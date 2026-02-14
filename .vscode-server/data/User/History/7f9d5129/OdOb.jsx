import { Outlet } from "react-router-dom";
import styles from "./AdminLayout.module.css";

export default function AdminLayout() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.logo}>Admin Panel</h1>
      </header>

      <main className={styles.content}>
        <Outlet />   {/* ← ESTO ES LO QUE FALTABA */}
      </main>
    </div>
  );
}