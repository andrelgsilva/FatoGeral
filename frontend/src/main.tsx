import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './router/index';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster position="top-right" />
    <RouterProvider router={router} />
  </StrictMode>
);