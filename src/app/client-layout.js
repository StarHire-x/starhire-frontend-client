"use client";

import Navbar from "@/components/navbar/Navbar";
import "./globals.css";
// import { Inter, Roboto, Poppins  } from 'next/font/google';
import Footer from "@/components/footer/Footer";
import { ThemeProvider } from "@/context/ThemeContext";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import { UserContext, UserProvider } from "@/context/UserContext";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // Choose the desired theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "@/components/ErrorPage/ErrorPage";

function fallbackRender({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.
  return <ErrorPage error={error} resetErrorBoundary={resetErrorBoundary} />;
}

const logError = (error, info) => {
  // Do something with the error, e.g. log to an external API
  console.log("Error has been logged: " + error);
};

export function ClientRootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <UserProvider>
              <div className="container">
                <ErrorBoundary
                  fallbackRender={fallbackRender}
                  onError={logError}
                  onReset={(details) => {
                    // Reset the state of your app so the error doesn't happen again
                  }}
                >
                  <Navbar />

                  {children}

                  <Footer />
                </ErrorBoundary>
              </div>
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
