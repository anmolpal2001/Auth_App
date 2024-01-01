import './App.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthLayout from './components/AuthLayout'
import ForgotPassword from './pages/ForgotPassword'
import OtpDetails from './pages/OtpDetails'
import ResetPassword from './pages/ResetPassword'
import { Outlet } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element : <Home/>
  },
  {
    path: "/about",
    element : <About/>
  },
  {
    path: "/sign-in",
    element: <SignIn/>
  },
  {
    path: "/sign-up",
    element: <SignUp/>
  },
  {
    path: "/profile",
    element: <AuthLayout><Profile/></AuthLayout>
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword/>
  },
  {
    path: "/otp-verification/:id/:token",
    element: <OtpDetails/>
  },
  {
    path : "/reset-password/:id/:token",
    element: <ResetPassword/>
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router}>
      <Outlet />
        </RouterProvider>
      <ToastContainer />
    </>
  )
}

export default App
