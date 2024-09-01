// App.js
import React from 'react';
// import { ThemeProvider } from './src/SettingsPage/themeContext';
import Routes from './routes/routes'; 
// import { ModalPortal } from 'react-native-modals';
import { Provider as PaperProvider } from 'react-native-paper';
const App = () => {
  return (
    // <ThemeProvider>
    <PaperProvider>
            <Routes /> 
    </PaperProvider>
      // <ModalPortal />
    // </ThemeProvider>
  );
};

export default App;
