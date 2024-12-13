import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login/Login';
import Layout from '../components/Layout/Layout';
import Commandes from '../pages/Commandes/Commandes';
import Dashboard from '../pages/Dashboard/Dashboard';
import Preparation from '../pages/Preparation/Preparation';
import NouvelleCommande from '../pages/Commandes/NouvelleCommande';
import Paiement from '../pages/Commandes/Paiement';
import PreparationCommande from '../pages/Preparation/PreparationCommande';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { username } = useAuth();
  
  if (!username) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="commandes">
            <Route index element={<Commandes />} />
            <Route path="nouvelle" element={<NouvelleCommande />} />
            <Route path="paiement" element={<Paiement />} />
          </Route>
          <Route path="preparation">
            <Route index element={<Preparation />} />
            <Route path="commande" element={<PreparationCommande />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
