import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import CommandeDetail, { Order } from '../../components/CommandeDetail/CommandeDetail';
import { useOrderStore } from '../../store/orderStore';
import { useAuth } from '../../context/AuthContext';

const PageContainer = styled.div`
  height: calc(100vh - ${({ theme }) => theme.layout.headerHeight} - ${({ theme }) => theme.layout.footerHeight} - ${({ theme }) => theme.spacing.lg} * 2);
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const HeaderSection = styled.div`
  flex-shrink: 0;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xlarge};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  margin: 0;
`;

const FooterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;

const LeftButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const RightButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const NouvelleCommande: React.FC = () => {
  const navigate = useNavigate();
  const { currentOrder, setCurrentOrder, clearCurrentOrder } = useOrderStore();
  const { username } = useAuth();
  const [order, setOrder] = useState<Order>(() => {
    if (currentOrder) {
      return currentOrder;
    }
    return {
      id: null,
      orderStatus: null,
      orderedBy: null,
      preparedBy: null,
      orderTime: null,
      preparationTime: null,
      customerName: null,
      paymentType: null,
      hotdogs: [],
      preparationMinutes: null,
      totalPrice: 0
    };
  });

  const handleCancel = () => {
    clearCurrentOrder();
    navigate('/commandes');
  };

  const handleConfirm = () => {
    setCurrentOrder({
      ...order,
      orderedBy: username,
      orderStatus: 'ORDERED'
    });
    navigate('/commandes/paiement');
  };

  return (
    <PageContainer>
      <HeaderSection>
        <Title>Nouvelle commande</Title>
      </HeaderSection>

      <CommandeDetail 
        order={order}
        onOrderChange={setOrder}
        readOnly={false}
      />
      
      <FooterSection>
        <LeftButtons>
          <Button 
            variant="secondary" 
            icon="close"
            onClick={handleCancel}
          >
            Abandonner la commande
          </Button>
        </LeftButtons>
        <RightButtons>
          <Button 
            icon="check"
            onClick={handleConfirm}
          >
            Valider la commande
          </Button>
        </RightButtons>
      </FooterSection>
    </PageContainer>
  );
};

export default NouvelleCommande;
