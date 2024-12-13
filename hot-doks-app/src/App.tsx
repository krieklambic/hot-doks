import React from 'react';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import { GlobalStyles } from './styles/globalStyles';
import Router from './router/Router';
import { AuthProvider } from './context/AuthContext';
import JsonViewer from './components/JsonViewer/JsonViewer';
import { OrderProvider, useOrderStore } from './store/orderStore';

interface JsonViewerState {
  show: boolean;
  onClose: () => void;
  openJsonViewer: () => void;
}

export const JsonViewerContext = React.createContext<JsonViewerState>({
  show: false,
  onClose: () => {},
  openJsonViewer: () => {},
});

const JsonViewerWrapper: React.FC = () => {
  const [showJsonViewer, setShowJsonViewer] = React.useState(false);
  const { currentOrder } = useOrderStore();

  const jsonViewerState = {
    show: showJsonViewer,
    onClose: () => setShowJsonViewer(false),
    openJsonViewer: () => setShowJsonViewer(true),
  };

  return (
    <JsonViewerContext.Provider value={jsonViewerState}>
      <Router />
      {showJsonViewer && (
        <JsonViewer 
          data={currentOrder} 
          onClose={() => setShowJsonViewer(false)} 
        />
      )}
    </JsonViewerContext.Provider>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <OrderProvider>
          <GlobalStyles />
          <JsonViewerWrapper />
        </OrderProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
