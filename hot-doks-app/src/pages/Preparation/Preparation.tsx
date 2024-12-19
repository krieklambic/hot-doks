import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import {
  TableContainer,
  Table,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableCell,
} from '../../styles/globalStyles';
import { ApiOrder, OrderView } from '../../types/api';
import config from '../../config';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xlarge};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin: 0;
`;

const ListSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii.medium};
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2<{ variant?: 'waiting' | 'preparation' }>`
  font-size: ${({ theme }) => theme.typography.fontSize.medium};
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme, variant }) => 
    variant === 'waiting' ? '#ef9a9a' : 
    variant === 'preparation' ? '#fff176' : 
    'transparent'};
  border-radius: ${({ theme }) => theme.radii.small};
`;

const calculateWaitingTime = (orderTime: string): number => {
  const orderDateTime = new Date(orderTime);
  return Math.floor((new Date().getTime() - orderDateTime.getTime()) / (1000 * 60));
};

const Preparation: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderView[]>([]);
  const [inPreparationOrders, setInPreparationOrders] = useState<OrderView[]>([]);

  const handlePrepareOrder = () => {
    navigate('/preparation/commande');
  };

  const handleFinishPreparation = async (orderId: string) => {
    try {
      const url = `${config.API_BASE_URL}/orders/${orderId}/status?status=READY`;
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
      
      // Refresh the orders lists
      fetchOrders();
      fetchInPreparationOrders();
    } catch (error) {
      console.error('Error marking order as prepared:', error);
    }
  };

  const fetchOrders = useCallback(async () => {
    const url = `${config.API_BASE_URL}/orders/status/ORDERED`;
    console.log('Fetching orders from:', url);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        const ordersWithWaitingTime = data.map((order: ApiOrder) => ({
          id: order.id.toString(),
          time: new Date(order.orderTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          orderedBy: order.orderedBy || '-',
          preparedBy: order.preparedBy || '-',
          classic: order.hotdogs.filter(h => h.type === 'CLASSIC').length,
          alsace: order.hotdogs.filter(h => h.type === 'ALSACE').length,
          newYork: order.hotdogs.filter(h => h.type === 'NEWYORK').length,
          total: order.hotdogs.length,
          status: order.orderStatus,
          customerName: order.customerName || '-',
          paymentType: order.paymentType || 'CASH',
          preparationMinutes: calculateWaitingTime(order.orderTime),
          totalPrice: order.totalPrice,
        }));
        setOrders(ordersWithWaitingTime);
      }
    } catch (err) {
      setOrders([]);
    }
  }, []);

  const fetchInPreparationOrders = useCallback(async () => {
    const url = `${config.API_BASE_URL}/orders/status/IN_PREPARATION`;
    console.log('Fetching in-preparation orders from:', url);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        const ordersWithWaitingTime = data.map((order: ApiOrder) => ({
          id: order.id.toString(),
          time: new Date(order.orderTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          orderedBy: order.orderedBy || '-',
          preparedBy: order.preparedBy || '-',
          classic: order.hotdogs.filter(h => h.type === 'CLASSIC').length,
          alsace: order.hotdogs.filter(h => h.type === 'ALSACE').length,
          newYork: order.hotdogs.filter(h => h.type === 'NEWYORK').length,
          total: order.hotdogs.length,
          status: order.orderStatus,
          customerName: order.customerName || '-',
          paymentType: order.paymentType || 'CASH',
          preparationMinutes: calculateWaitingTime(order.orderTime),
          totalPrice: order.totalPrice,
        }));
        setInPreparationOrders(ordersWithWaitingTime);
      }
    } catch (err) {
      setInPreparationOrders([]);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchInPreparationOrders();
    const ordersInterval = setInterval(fetchOrders, 5000);
    const inPrepInterval = setInterval(fetchInPreparationOrders, 5000);
    return () => {
      clearInterval(ordersInterval);
      clearInterval(inPrepInterval);
    };
  }, [fetchOrders, fetchInPreparationOrders]);

  const ActionIcon = styled.i.attrs({ className: 'material-icons' })`
    font-size: 20px;
    color: ${({ theme }) => theme.colors.success};
    cursor: pointer;
    padding: 4px;
    border-radius: ${({ theme }) => theme.radii.small};
    transition: all ${({ theme }) => theme.transitions.default};

    &:hover {
      background-color: ${({ theme }) => theme.colors.backgroundGrey};
    }
  `;

  return (
    <PageContainer>
      <HeaderSection>
        <Title>Préparation</Title>
        <Button 
          variant="primary"
          icon="restaurant"
          onClick={handlePrepareOrder}
        >
          Préparer une commande
        </Button>
      </HeaderSection>

      <ListSection>
        <TableContainer>
          <SectionTitle variant="waiting">Commandes en attente</SectionTitle>
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>Heure</TableHeaderCell>
                <TableHeaderCell>Client</TableHeaderCell>
                <TableHeaderCell>Pris par</TableHeaderCell>
                <TableHeaderCell>Préparé par</TableHeaderCell>
                <TableHeaderCell>Classic</TableHeaderCell>
                <TableHeaderCell>Alsace</TableHeaderCell>
                <TableHeaderCell>New-York</TableHeaderCell>
                <TableHeaderCell>Total</TableHeaderCell>
                <TableHeaderCell>Attente</TableHeaderCell>
              </tr>
            </TableHeader>
            <tbody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.time}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.orderedBy}</TableCell>
                  <TableCell>{order.preparedBy}</TableCell>
                  <TableCell>{order.classic}</TableCell>
                  <TableCell>{order.alsace}</TableCell>
                  <TableCell>{order.newYork}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>{order.preparationMinutes} min</TableCell>
                </TableRow>
              ))}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} style={{ textAlign: 'center' }}>
                    Aucune commande en attente
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>
        </TableContainer>
      </ListSection>

      <ListSection>
        <TableContainer>
          <SectionTitle variant="preparation">Commandes en préparation</SectionTitle>
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>Heure</TableHeaderCell>
                <TableHeaderCell>Client</TableHeaderCell>
                <TableHeaderCell>Pris par</TableHeaderCell>
                <TableHeaderCell>Préparé par</TableHeaderCell>
                <TableHeaderCell>Classic</TableHeaderCell>
                <TableHeaderCell>Alsace</TableHeaderCell>
                <TableHeaderCell>New-York</TableHeaderCell>
                <TableHeaderCell>Total</TableHeaderCell>
                <TableHeaderCell>Attente</TableHeaderCell>
              </tr>
            </TableHeader>
            <tbody>
              {inPreparationOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.time}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.orderedBy}</TableCell>
                  <TableCell>{order.preparedBy}</TableCell>
                  <TableCell>{order.classic}</TableCell>
                  <TableCell>{order.alsace}</TableCell>
                  <TableCell>{order.newYork}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>{order.preparationMinutes} min</TableCell>
                  <TableCell style={{ width: '40px', textAlign: 'center' }}>
                    <ActionIcon
                      onClick={() => handleFinishPreparation(order.id)}
                      title="Terminer la préparation"
                    >
                      check_circle
                    </ActionIcon>
                  </TableCell>
                </TableRow>
              ))}
              {inPreparationOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} style={{ textAlign: 'center' }}>
                    Aucune commande en préparation
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>
        </TableContainer>
      </ListSection>
    </PageContainer>
  );
};

export default Preparation;