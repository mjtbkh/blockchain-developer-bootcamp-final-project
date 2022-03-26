import { useContext, useEffect } from "react";
import { NotificationContext } from "../contexts";

export default function Notification({ message }) {
  const { isNotificationOpen, setIsNotificationOpen } =
    useContext(NotificationContext);

  // set a timeout to close notifications 6.5 seconds after they are visible
  useEffect(() => {
    if (isNotificationOpen === true)
      setTimeout(() => setIsNotificationOpen(false), 6500);
  }, [isNotificationOpen]);

  return (
    <dialog
      className={`flex items-center justify-center gap-2 fixed bottom-0 ml-0 translate-x-[32px] -translate-y-1/3 z-30 rounded-sm text-yellow-900 ring ring-yellow-500 bg-yellow-300 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-lg font-extrabold shadow-lg ${
        isNotificationOpen ? "visible-notification" : "hidden-notification"
      }`}
    >
      {message}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-red-700 rotate-45"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        onClick={() => setIsNotificationOpen(false)}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    </dialog>
  );
}
