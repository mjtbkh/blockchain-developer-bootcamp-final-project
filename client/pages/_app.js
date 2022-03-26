import "tailwindcss/tailwind.css";
import "../styles/global.css";
import {
  ChainIdContextProvider,
  FormContextProvider,
  NotificationContextProvider,
  ThemeContextProvider,
  WalletContextProvider,
  PublisherContextProvider,
} from "../contexts";
import React from "react";

export default function MyApp({ Component, pageProps }) {
  return (
    <React.StrictMode>
      <ThemeContextProvider>
        <WalletContextProvider>
          <ChainIdContextProvider>
            <FormContextProvider>
              <PublisherContextProvider>
                <NotificationContextProvider>
                  <Component {...pageProps} />
                </NotificationContextProvider>
              </PublisherContextProvider>
            </FormContextProvider>
          </ChainIdContextProvider>
        </WalletContextProvider>
      </ThemeContextProvider>
    </React.StrictMode>
  );
}
