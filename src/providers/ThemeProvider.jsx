import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext(null);

const ThemeProvider = ({ children }) => {
  const storedTheme = localStorage.getItem("theme") === "dark";
  const [theme, setTheme] = useState(storedTheme);

  useEffect(() => {
    if (theme) {
      document.querySelector("#root").setAttribute("class", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.querySelector("#root").setAttribute("class", "");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const toggle = () => setTheme((prevTheme) => !prevTheme);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
