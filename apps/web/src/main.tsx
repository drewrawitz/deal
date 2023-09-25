import NiceModal from "@ebay/nice-modal-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "./routes/Home";
import Login from "./routes/Login";
import ErrorPage from "./routes/Error";
import Games from "./routes/Games";
import App from "./App";
import GameDetail from "./routes/GameDetail";
import { OnlineUsersProvider } from "./providers/online-users.context";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/games",
        element: <Games />,
      },
      {
        path: "/games/:gameId",
        element: <GameDetail />,
      },
    ],
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <NiceModal.Provider>
        <OnlineUsersProvider>
          <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              className: "",
              duration: 5000,
            }}
          />
          <RouterProvider router={router} />
        </OnlineUsersProvider>
      </NiceModal.Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
