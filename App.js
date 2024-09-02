// // App.js
// import React from 'react';
// // import { ThemeProvider } from './src/SettingsPage/themeContext';
// import Routes from './routes/routes'; 
// // import { ModalPortal } from 'react-native-modals';
// import { Provider as PaperProvider } from 'react-native-paper';
// const App = () => {
//   return (
//     // <ThemeProvider>
//     <PaperProvider>
//             <Routes /> 
//     </PaperProvider>
//       // <ModalPortal />
//     // </ThemeProvider>
//   );
// };

// export default App;
import React from 'react';
import Routes from './routes/routes'; 
import { Provider as PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <PaperProvider>
      <Routes /> 
      <Toast />
    </PaperProvider>
  );
};

export default App;
