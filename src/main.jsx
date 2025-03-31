import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
import AuthProvider from "./providers/AuthProvider.jsx";
import Routes from "./routes/Routes.jsx";
import ThemeProvider from "./providers/ThemeProvider.jsx";
// ..
AOS.init();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <HelmetProvider>
          <QueryClientProvider client={new QueryClient()}>
            <RouterProvider router={Routes}></RouterProvider>
          </QueryClientProvider>
          <Toaster position="top-right" reverseOrder={false}></Toaster>
        </HelmetProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
