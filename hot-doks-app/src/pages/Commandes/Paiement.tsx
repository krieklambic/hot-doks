import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import { useOrderStore } from '../../store/orderStore';
import config from '../../config';
import { useAuth } from '../../context/AuthContext';

const PageContainer = styled.div`
  height: calc(100vh - ${({ theme }) => theme.layout.headerHeight} - ${({ theme }) => theme.layout.footerHeight} - ${({ theme }) => theme.spacing.lg} * 2);
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
`;

const HeaderSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-shrink: 0;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xlarge};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  margin: 0;
`;

const CommandeSection = styled.section`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii.medium};
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  overflow-y: auto;
`;

const FooterSection = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
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

const SummaryCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-of-type {
    border-bottom: none;
  }
`;

const ItemName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.medium};
  color: ${({ theme }) => theme.colors.primary};
`;

const ItemQuantity = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.medium};
  color: ${({ theme }) => theme.colors.accent};
  font-weight: bold;
`;

const TotalSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 2px solid ${({ theme }) => theme.colors.border};
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TotalLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.large};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const TotalAmount = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xlarge};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.accent};
`;

const Paiement: React.FC = () => {
  const navigate = useNavigate();
  const { currentOrder, clearCurrentOrder } = useOrderStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { username } = useAuth();

  const handleBack = () => {
    navigate('/commandes/nouvelle');
  };

  const handlePaymentComplete = async (paymentType: 'CASH' | 'CARD') => {
    if (!currentOrder || isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Create a new order object without IDs
      const finalOrder = {
        orderStatus: 'ORDERED',  // Set explicit status for new orders
        orderedBy: username,     // Set the current user as orderedBy
        preparedBy: currentOrder.preparedBy,
        orderTime: new Date().toISOString(),
        preparationTime: currentOrder.preparationTime,
        customerName: currentOrder.customerName,
        paymentType: paymentType,
        hotdogs: currentOrder.hotdogs.map(hotdog => ({
          type: hotdog.type,
          withKetchup: hotdog.withKetchup,
          withMustard: hotdog.withMustard,
          withMayo: hotdog.withMayo,
          withOnions: hotdog.withOnions,
          comment: hotdog.comment,
          price: hotdog.price || getHotdogPrice(hotdog.type)
        })),
        preparationMinutes: currentOrder.preparationMinutes,
        totalPrice: calculateTotal()
      };

      console.log('Saving order:', {
        url: `${config.API_BASE_URL}/orders`,
        order: finalOrder
      });

      const response = await fetch(`${config.API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include',
        body: JSON.stringify(finalOrder)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Failed to save order: ${response.status} ${response.statusText}`);
      }

      clearCurrentOrder();
      navigate('/commandes');
    } catch (error) {
      console.error('Error saving order:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  };

  function calculateTotal(): number {
    if (!currentOrder) return 0;

    return currentOrder.hotdogs.reduce((total, hotdog) => {
      return total + (hotdog.price || getHotdogPrice(hotdog.type));
    }, 0);
  }

  function getHotdogPrice(type: 'CLASSIC' | 'ALSACE' | 'NEWYORK'): number {
    switch (type) {
      case 'CLASSIC':
        return 7.0;
      case 'ALSACE':
      case 'NEWYORK':
        return 8.0;
      default:
        return 0;
    }
  }

  function getHotdogCounts() {
    if (!currentOrder) return { classic: 0, alsace: 0, newYork: 0 };

    return currentOrder.hotdogs.reduce(
      (counts, hotdog) => {
        switch (hotdog.type) {
          case 'CLASSIC':
            counts.classic++;
            break;
          case 'ALSACE':
            counts.alsace++;
            break;
          case 'NEWYORK':
            counts.newYork++;
            break;
        }
        return counts;
      },
      { classic: 0, alsace: 0, newYork: 0 }
    );
  }

  const hotdogCounts = getHotdogCounts();
  const total = calculateTotal();

  return (
    <PageContainer>
      <HeaderSection>
        <Title>Paiement</Title>
      </HeaderSection>

      <CommandeSection>
        <SummaryCard>
          <ItemRow>
            <ItemName>Classic (7,00€)</ItemName>
            <ItemQuantity>{hotdogCounts.classic}</ItemQuantity>
          </ItemRow>
          <ItemRow>
            <ItemName>Alsace (8,00€)</ItemName>
            <ItemQuantity>{hotdogCounts.alsace}</ItemQuantity>
          </ItemRow>
          <ItemRow>
            <ItemName>New-York (8,00€)</ItemName>
            <ItemQuantity>{hotdogCounts.newYork}</ItemQuantity>
          </ItemRow>

          <TotalSection>
            <TotalRow>
              <TotalLabel>Total</TotalLabel>
              <TotalAmount>{total.toFixed(2).replace('.', ',')}€</TotalAmount>
            </TotalRow>
          </TotalSection>
        </SummaryCard>
      </CommandeSection>

      <FooterSection>
        <LeftButtons>
          <Button 
            variant="secondary" 
            icon="keyboard_return"
            onClick={handleBack}
            disabled={isSubmitting}
          >
            Retour
          </Button>
        </LeftButtons>
        <RightButtons>
          <Button 
            icon="payments"
            onClick={() => handlePaymentComplete('CASH')}
            disabled={isSubmitting}
          >
            Payé en cash
          </Button>
          <Button 
            icon="credit_card"
            onClick={() => handlePaymentComplete('CARD')}
            disabled={isSubmitting}
          >
            Payé par carte
          </Button>
        </RightButtons>
      </FooterSection>
    </PageContainer>
  );
};

export default Paiement;
