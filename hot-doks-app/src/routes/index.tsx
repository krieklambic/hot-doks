import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Commandes from '../pages/Commandes/Commandes';
import NouvelleCommande from '../pages/Commandes/NouvelleCommande';
import Paiement from '../pages/Commandes/Paiement';
import Preparation from '../pages/Preparation/Preparation';
import PreparationCommande from '../pages/Preparation/PreparationCommande';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
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
  );
};

export default AppRoutes;
