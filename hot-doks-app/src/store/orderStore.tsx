import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Order } from '../components/CommandeDetail/CommandeDetail';

interface OrderContextType {
  currentOrder: Order | null;
  setCurrentOrder: (order: Order) => void;
  clearCurrentOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider = ({ children }: OrderProviderProps) => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const clearCurrentOrder = () => {
    setCurrentOrder(null);
  };

  return (
    <OrderContext.Provider
      value={{
        currentOrder,
        setCurrentOrder,
        clearCurrentOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderStore = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrderStore must be used within an OrderProvider');
  }
  return context;
};
