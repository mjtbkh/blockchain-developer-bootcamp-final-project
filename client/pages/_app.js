import "tailwindcss/tailwind.css";
import "../styles/global.css";
import {
  ChainIdContextProvider,
  NotificationContextProvider,
  ThemeContextProvider,
  WalletContextProvider,
} from "../contexts";

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeContextProvider>
      <WalletContextProvider>
        <ChainIdContextProvider>
          <NotificationContextProvider>
            <Component {...pageProps} />
          </NotificationContextProvider>
        </ChainIdContextProvider>
      </WalletContextProvider>
    </ThemeContextProvider>
  );
}
