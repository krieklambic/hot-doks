import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button/Button';
import CommandeDetail, { Order } from '../../components/CommandeDetail/CommandeDetail';
import config from '../../config';

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

const PreparationCommande: React.FC = () => {
  const navigate = useNavigate();
  const mounted = useRef(false);
  const { username } = useAuth();
  const [order, setOrder] = useState<Order>({
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
  });

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    const fetchNextOrder = async () => {
      try {
        const url = `${config.API_BASE_URL}/orders/next-to-prepare?user=${username}`;
        console.log('Fetching next order to prepare, calling API:', url);
        const response = await fetch(url, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch next order');
        }
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Error fetching next order:', error);
        navigate('/preparation');
      }
    };

    fetchNextOrder();
  }, []);

  const handleCancelPreparation = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/orders/${order.id}/status?status=ORDERED`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to cancel preparation');
      navigate('/preparation');
    } catch (err) {
      console.error('Error canceling preparation:', err);
    }
  };

  const handleCancel = () => {
    navigate('/preparation');
  };

  const handleFinishPreparation = async () => {
    if (!order.id) return;
    
    try {
      const url = `${config.API_BASE_URL}/orders/${order.id}/status?status=READY`;
      console.log('Finishing preparation, calling API:', url);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark order as prepared');
      }
      
      navigate('/preparation');
    } catch (error) {
      console.error('Error marking order as prepared:', error);
    }
  };

  const startPreparation = async (orderId: string) => {
    const url = `${config.API_BASE_URL}/orders/${orderId}/start`;
    console.log('Starting preparation, calling API:', url);
    try {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to start preparation');
      }
    } catch (error) {
      console.error('Error starting preparation:', error);
    }
  };

  return (
    <PageContainer>
      <HeaderSection>
        <Title>Préparation de la commande</Title>
      </HeaderSection>

      <CommandeDetail 
        order={order}
        onOrderChange={setOrder}
        readOnly={true}
      />
      
      <FooterSection>
        <LeftButtons>
          <Button 
            variant="secondary" 
            icon="close"
            onClick={handleCancelPreparation}
          >
            Annuler la préparation
          </Button>
        </LeftButtons>
        <RightButtons>
          <Button 
            variant="primary"
            icon="check"
            onClick={handleFinishPreparation}
          >
            Terminer la préparation
          </Button>
        </RightButtons>
      </FooterSection>
    </PageContainer>
  );
};

export default PreparationCommande;
