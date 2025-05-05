import { useNotification } from '../hooks/useNotification';
import { Notification } from '../types/Notification';
import styles from './NotificationLane.module.css';

const NotificationLane: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  // Handle notification click to remove it
  const handleNotificationClick = (id: string) => {
    removeNotification(id);
  };

  return (
    <div className={styles.notificationLane} aria-live="polite">
      {notifications.map((notification: Notification) => (
        <div 
          key={notification.id} 
          className={`${styles.notification} ${styles[notification.type]}`}
          onClick={() => handleNotificationClick(notification.id)}
          role="alert"
        >
          <p className={styles.message}>{notification.message}</p>
          <button 
            className={styles.closeButton} 
            onClick={(e) => {
              e.stopPropagation();
              handleNotificationClick(notification.id);
            }}
            aria-label="Cerrar notificación"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationLane;