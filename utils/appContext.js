import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [doWebViewReload, setDoWebViewReload] = useState(false);

  return (
    <AppContext.Provider value={{
      doWebViewReload,
      setDoWebViewReload
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};