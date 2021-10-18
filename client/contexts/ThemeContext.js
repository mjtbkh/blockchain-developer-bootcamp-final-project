import { useState, createContext } from "react";

export const ThemeContext = createContext({});

export default function ThemeContextProvider(props) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {props.children}
    </ThemeContext.Provider>
  );
}
