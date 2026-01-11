import React from 'react'; // React 18
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import StoreLayout from './src/layouts/StoreLayout';
import AdminLayout from './src/layouts/AdminLayout';
import HomePage from './src/pages/HomePage';
import CategoryPage from './src/pages/CategoryPage';
import FakeNotFound from './components/FakeNotFound';
import { ShopProvider } from './src/contexts/ShopContext';
import { HelmetProvider } from 'react-helmet-async';
import { AdminProvider } from './src/contexts/AdminContext';

// Define Routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <StoreLayout />,
    errorElement: <FakeNotFound />, // Handle 404s
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ':categorySlug',
        element: <CategoryPage />,
      }
    ],
  },
  {
    path: '/BLUE-SKYWATITWA', // Secret Admin Path
    element: <AdminLayout />,
  },
]);

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <AdminProvider>
        <ShopProvider>
          <RouterProvider router={router} />
        </ShopProvider>
      </AdminProvider>
    </HelmetProvider>
  );
};

export default App;
