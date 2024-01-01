// const getInfo = (name) => {
//     const cookies = document.cookie.split(';');

//     for (const cookie of cookies) {
//       const [cookieName, cookieValue] = cookie.trim().split('=');

//       if (cookieName === name) {
//         return decodeURIComponent(cookieValue);
//       }
//     }

//     return null;
//   };

// getInfo.js

import Cookies from 'js-cookie';

const getInfo = (key) => {
  return Cookies.get(key);
};

export default getInfo;
