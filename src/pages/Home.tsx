import NotificationLane from "../components/NotificationLane";
import ListTask from "../components/ListTask";
import GeniusAdvice from "../components/GeniusAdvice";
import { TaskProvider } from "../context/TaskContext";
import { TaskFocusProvider } from "../context/TaskFocusContext";
import { useNotification } from "../hooks/useNotification";
import { useAuth } from "../hooks/useAuth";
import styles from "./Home.module.css";

const Home = () => {
  const { addNotification } = useNotification();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    addNotification("Sesión cerrada", "success");
  };

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>TaskGenius</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>Cerrar sesión</button>
      </header>
      <main className={styles.mainContainer}>
        <NotificationLane />

        <TaskProvider>
          <section className={styles.contentSection}>
            <GeniusAdvice />
            <TaskFocusProvider>
              <ListTask />
            </TaskFocusProvider>
          </section>
        </TaskProvider>
      </main>

    </>
  );
};

export default Home;