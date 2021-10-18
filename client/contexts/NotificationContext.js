import { useState, createContext } from "react";

export const NotificationContext = createContext({});

export default function NotificationContextProvider(props) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  return (
    <NotificationContext.Provider
      value={{
        isNotificationOpen,
        setIsNotificationOpen,
        notificationMessage,
        setNotificationMessage
      }}
    >
      {props.children}
    </NotificationContext.Provider>
  );
}
