import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from "react-redux";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { HelmetProvider } from 'react-helmet-async';
import Store, { persistor } from './redux/store.js';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/lib/integration/react.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={Store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
          <BrowserRouter >
          <HelmetProvider>
    <App />

    </HelmetProvider>
    </BrowserRouter>
    </QueryClientProvider>
    </PersistGate>
    </Provider>
  </StrictMode>,
)
