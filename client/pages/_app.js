import "tailwindcss/tailwind.css";
import "../styles/global.css";
import {
  ChainIdContextProvider,
  FormContextProvider,
  NotificationContextProvider,
  ThemeContextProvider,
  WalletContextProvider,
} from "../contexts";

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeContextProvider>
      <WalletContextProvider>
        <ChainIdContextProvider>
          <FormContextProvider>
            <NotificationContextProvider>
              <Component {...pageProps} />
            </NotificationContextProvider>
          </FormContextProvider>
        </ChainIdContextProvider>
      </WalletContextProvider>
    </ThemeContextProvider>
  );
}
