import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import { useOrderStore } from '../../store/orderStore';
import {
  TableContainer,
  Table,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableCell,
} from '../../styles/globalStyles';
import config from '../../config';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  height: calc(100vh - ${({ theme }) => theme.layout.headerHeight} - ${({ theme }) => theme.layout.footerHeight} - ${({ theme }) => theme.spacing.lg} * 2);
  display: flex;
  flex-direction: column;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-shrink: 0;
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
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

const getStatusIconStyle = (status: string) => {
  switch (status) {
    case 'ORDERED':
      return {
        icon: 'receipt',
        backgroundColor: '#EF9A9A'  // More intense light red
      };
    case 'IN_PREPARATION':
      return {
        icon: 'restaurant',
        backgroundColor: '#FFF9C4'  // Light yellow
      };
    case 'READY':
      return {
        icon: 'check_circle',
        backgroundColor: '#C8E6C9'  // Light green
      };
    default:
      return {
        icon: 'help',
        backgroundColor: '#E0E0E0'
      };
  }
};

const StatusIcon = styled.i.attrs({ className: 'material-icons' })<{ status: string }>`
  background-color: ${props => getStatusIconStyle(props.status).backgroundColor};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: 50%;
  font-size: 20px;
`;

const PaymentIcon = styled.i.attrs({ className: 'material-icons' })`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 20px;
`;

const getPaymentIcon = (paymentType: 'CASH' | 'CARD') => {
  switch (paymentType) {
    case 'CASH':
      return 'payments';
    case 'CARD':
      return 'credit_card';
    default:
      return 'help';
  }
};

interface ApiOrder {
  id: number;
  orderStatus: string;  
  orderedBy: string;
  preparedBy: string | null;
  orderTime: string;
  preparationTime: string | null;
  customerName: string;
  paymentType: 'CASH' | 'CARD';
  hotdogs: Array<{
    type: 'CLASSIC' | 'ALSACE' | 'NEWYORK';
  }>;
  preparationMinutes: number | null;
  totalPrice: number;
}

interface OrderView {
  id: string;
  time: string;
  orderedBy: string;
  preparedBy: string;
  classic: number;
  alsace: number;
  newYork: number;
  total: number;
  status: 'ORDERED' | 'IN_PREPARATION' | 'READY';
  customerName: string;
  paymentType: 'CASH' | 'CARD';
  preparationMinutes: number;
  totalPrice: number;
}

const ITEMS_PER_PAGE = 15;

const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  return `${day}${month}${year}`;  
};

const Commandes: React.FC = () => {
  const [orders, setOrders] = useState<OrderView[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setCurrentOrder } = useOrderStore();
  const navigate = useNavigate();

  const calculateWaitingTime = (orderTime: string, status: string, preparationTime: string | null): number => {
    const orderDateTime = new Date(orderTime);
    const now = new Date();
    
    // For READY orders, use the preparation time
    if (status === 'READY' && preparationTime) {
      const preparationDateTime = new Date(preparationTime);
      return Math.floor((preparationDateTime.getTime() - orderDateTime.getTime()) / (1000 * 60));
    }
    
    // For orders in preparation, use current time but cap at 60 minutes
    const waitingTime = Math.floor((now.getTime() - orderDateTime.getTime()) / (1000 * 60));
    return Math.min(waitingTime, 60); // Cap at 60 minutes
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/orders/filtered?orderDate=${formatDate(new Date())}&startIndex=0&pageLength=${ITEMS_PER_PAGE}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      
      setOrders(data.map((order: ApiOrder) => ({
        id: order.id.toString(),
        time: new Date(order.orderTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        orderedBy: order.orderedBy || '-',
        preparedBy: order.preparedBy || '-',
        classic: order.hotdogs.filter((h: { type: string }) => h.type === 'CLASSIC').length,
        alsace: order.hotdogs.filter((h: { type: string }) => h.type === 'ALSACE').length,
        newYork: order.hotdogs.filter((h: { type: string }) => h.type === 'NEWYORK').length,
        total: order.hotdogs.length,
        status: order.orderStatus as 'ORDERED' | 'IN_PREPARATION' | 'READY',
        customerName: order.customerName || '-',
        paymentType: order.paymentType || 'CASH',
        preparationMinutes: calculateWaitingTime(order.orderTime, order.orderStatus, order.preparationTime),
        totalPrice: order.totalPrice,
      })));
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders');
    }
  };

  useEffect(() => {
    fetchOrders(); // Initial fetch
    const interval = setInterval(fetchOrders, 10000); // Fetch every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <PageContainer>
      <HeaderSection>
        <Title>Commandes</Title>
        <Button onClick={() => {
          setCurrentOrder({
            id: null,
            orderStatus: 'ORDERED',
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
          navigate('/commandes/nouvelle');
        }}>Nouvelle commande</Button>
      </HeaderSection>
      <ListSection>
        <TableContainer>
          {error ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>{error}</div>
          ) : (
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
                  <TableHeaderCell>Paiement</TableHeaderCell>
                  <TableHeaderCell>Attente</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Prix total</TableHeaderCell>
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
                    <TableCell>
                      <PaymentIcon>
                        {getPaymentIcon(order.paymentType)}
                      </PaymentIcon>
                    </TableCell>
                    <TableCell>{order.preparationMinutes ? `${order.preparationMinutes} min` : '-'}</TableCell>
                    <TableCell>
                      <StatusIcon status={order.status}>
                        {getStatusIconStyle(order.status).icon}
                      </StatusIcon>
                    </TableCell>
                    <TableCell>{order.totalPrice} €</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          )}
        </TableContainer>
      </ListSection>
    </PageContainer>
  );
};

export default Commandes;
