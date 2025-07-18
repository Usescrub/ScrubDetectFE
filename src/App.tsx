import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UnauthenticatedLayout from "./layouts/UnauthenticatedLayout";
import PrivateRoute from "./components/PrivateRoute";
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";
import LoginPage from "./modules/login/LoginPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UnauthenticatedLayout />,
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    path: "",
    element: (
      <PrivateRoute>
        <AuthenticatedLayout />
      </PrivateRoute>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App
