import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppRouter from './routes/AppRouter.jsx';
import AuthProvider from './context/AuthProvider.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { SocketProvider } from './context/SocketProvider.jsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      {/* CORRECT ORDER: QueryClientProvider must wrap SocketProvider */}
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          <AppRouter />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                fontSize: '15px',
                padding: '12px 20px',
              }
            }}
          />
        </SocketProvider>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);