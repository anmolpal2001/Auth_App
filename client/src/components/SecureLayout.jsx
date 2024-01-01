import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// const SecureLayout = ({ children }) => {
//   const { currentData } = useSelector(state => state.auth);
//   const currentPath = window.location.pathname;

//   // Check if currentData is available, indicating that the user is authenticated
//   const isAuthenticated = currentData;

//   // Check if the user is authenticated and trying to directly access /reset-password from /otp-verification
//   const isInvalidResetPasswordAccess =
//     isAuthenticated && currentPath.includes('/reset-password');

//   // Check if the user is authenticated and trying to directly access /otp-verification from /forgot-password
//   const isInvalidOtpVerificationAccess =
//     isAuthenticated && currentPath.includes('/otp-verification');

//   return isInvalidResetPasswordAccess ? (
//     <Navigate to='/sign-in' />
//   ) : isInvalidOtpVerificationAccess ? <Navigate to='/sign-in'/> : currentData  ? (
//     children
//   ) : (
//     <Navigate to='/sign-in' />
//   );
// };

const SecureLayout = ({children}) => {
  const {currentData, permission} = useSelector(state => state.auth);
  return currentData && permission ? children : <Navigate to='/sign-in'/>
}

export default SecureLayout;
