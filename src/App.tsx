import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import UnauthenticatedLayout from "./layouts/UnauthenticatedLayout";
import PrivateRoute from "./components/PrivateRoute";
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";

import LoginPage from "./modules/LoginPage";
import ForgotPassword from "./modules/ForgotPassword";
import Password from "./modules/Password";
import JoinUs from "./modules/signup/JoinUs";
import Details from "./modules/signup/Details";
import Verification from "./modules/signup/Verification";
const router = createBrowserRouter([
  {
    path: "/",
    element: <UnauthenticatedLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="login" replace />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      { path: "forgot-password", element: <ForgotPassword /> },
      {
        path: "new-password",
        element: <Password title="Create a New Password" />,
      },
      {
        path: "/signup",
        children: [
          { index: true, element: <Navigate to="join-us" /> },
          { path: "join-us", element: <JoinUs /> },
          { path: "details", element: <Details /> },
          { path: "verification", element: <Verification /> },
          {
            path: "create-password",
            element: <Password title="Create Your Password" />,
          },
        ],
      },
    ],
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

export default App;
