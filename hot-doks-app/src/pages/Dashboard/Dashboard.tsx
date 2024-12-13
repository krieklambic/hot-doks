import React, { useEffect, useState, useMemo, useCallback } from 'react';
import styled, { useTheme } from 'styled-components';
import { Order, HotDog } from '../../components/CommandeDetail/CommandeDetail';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  Area,
  Scatter
} from 'recharts';

const API_BASE_URL = 'http://localhost:8080/hot-doks-api';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const HeaderSection = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xlarge};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin: 0;
`;

const DateNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const DateText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.large};
  color: ${({ theme }) => theme.colors.primary};
  min-width: 300px;
  text-align: center;
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 0.7;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  // Full width: 4 cards per row
  grid-template-columns: repeat(4, 1fr);

  // Medium width: 2 cards per row
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  // Small width: 1 card per row
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.small};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.small};
  background: ${({ theme }) => theme.colors.backgroundGrey};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xlarge};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  color: ${({ theme }) => theme.colors.secondary};
`;

const Icon = styled.i.attrs({ className: 'material-icons' })`
  font-size: 24px;
`;

const ChartsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xl};

  // Full width: 2 charts per row
  grid-template-columns: repeat(2, 1fr);

  // Medium width and below: 1 chart per row
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.small};
  height: 300px;
`;

const ChartTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.large};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const NoDataMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.medium};
`;

interface ChartDataPoint {
  time: string;
  value: number;
}

interface PaymentDataPoint {
  name: string;
  value: number;
  fill: string;
}

interface Stats {
  revenue: number;
  orderCount: number;
  hotDogCount: number;
  avgWaitTime: number;
  inProgressCount: number;
  inProgressHotDogCount: number;
}

interface ChartData {
  timeSlots: string[];
  displayedSlots: string[];
  data: {
    orders: ChartDataPoint[];
    waitTime: ChartDataPoint[];
  };
  totalOrders: number;
}

const getWaitTimeColor = (waitTime: number) => {
  if (waitTime <= 5) return '#c8e6c9'; // stronger green
  if (waitTime <= 10) return '#ffe0b2'; // stronger yellow/orange
  return '#ffcdd2'; // stronger red
};

const getInProgressColor = (count: number) => {
  if (count <= 3) return '#c8e6c9'; // light green
  if (count <= 6) return '#fff3e0'; // light yellow
  return '#ffcdd2'; // light red
};

const formatDateToApi = (date: Date): string => {
  if (!date || date.toString() === 'Invalid Date') {
    date = new Date();
  }
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  return `${day}${month}${year}`;
};

const formatDateToDisplay = (date: Date): string => {
  if (!date || date.toString() === 'Invalid Date') {
    date = new Date();
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  
  if (compareDate.getTime() === today.getTime()) {
    return "AUJOURD'HUI";
  }
  
  const days = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
  const months = ['JANVIER', 'FÉVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN', 'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DÉCEMBRE'];
  
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
};

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [dashboardDate, setDashboardDate] = useState<Date>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');
    if (dateParam) {
      try {
        const [day, month, year] = dateParam.split('/').map(Number);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          const date = new Date(year, month - 1, day);
          if (date.toString() !== 'Invalid Date') {
            return date;
          }
        }
      } catch (e) {
        // Silently fall back to current date
      }
    }
    return new Date();
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    revenue: 0,
    orderCount: 0,
    hotDogCount: 0,
    avgWaitTime: 0,
    inProgressCount: 0,
    inProgressHotDogCount: 0
  });
  const [orderDistribution, setOrderDistribution] = useState([
    { name: 'Classic', value: 0, fill: '#e57373' },
    { name: 'Alsace', value: 0, fill: '#8d6e63' },
    { name: 'New York', value: 0, fill: '#ffd54f' }
  ]);
  const [paymentDistribution, setPaymentDistribution] = useState([
    { name: 'Carte', value: 0, fill: '#FF9800' },
    { name: 'Espèces', value: 0, fill: '#4CAF50' }
  ]);
  const [chartData, setChartData] = useState<ChartData>({
    timeSlots: [],
    displayedSlots: [],
    data: {
      orders: [],
      waitTime: []
    },
    totalOrders: 0
  });

  const calculateDistributions = useCallback((currentOrders: Order[]) => {
    // Calculate hot dog distribution
    const hotDogCounts = currentOrders.reduce((acc, order) => {
      order.hotdogs.forEach((item: HotDog) => {
        if (item.type === 'CLASSIC') acc[0].value++;
        else if (item.type === 'ALSACE') acc[1].value++;
        else if (item.type === 'NEWYORK') acc[2].value++;
      });
      return acc;
    }, [
      { name: 'Classic', value: 0, fill: '#e57373' },
      { name: 'Alsace', value: 0, fill: '#8d6e63' },
      { name: 'New York', value: 0, fill: '#ffd54f' }
    ]);

    // Calculate payment distribution
    const paymentCounts = currentOrders.reduce((acc, order) => {
      if (order.paymentType === 'CARD') {
        acc[0].value += order.totalPrice;
      } else if (order.paymentType === 'CASH') {
        acc[1].value += order.totalPrice;
      }
      return acc;
    }, [
      { name: 'Carte', value: 0, fill: '#FF9800' },
      { name: 'Espèces', value: 0, fill: '#4CAF50' }
    ]);

    return { hotDogCounts, paymentCounts };
  }, []);

  const calculateRevenue = useCallback(async () => {
    const formattedDate = formatDateToApi(dashboardDate);
    const url = `${API_BASE_URL}/orders/filtered?orderDate=${formattedDate}&startIndex=0&pageLength=1000`;
    
    console.log('[API Call]', {
      method: 'GET',
      url,
      date: formattedDate
    });

    let rawData;
    let response;

    try {
      response = await fetch(url);
      rawData = await response.json();
    } catch (error) {
      rawData = null;
    } finally {
      console.log('[API Result]', {
        url,
        status: response?.status,
        rawData
      });
    }

    try {
      if (!response || response.status === 400 || !response.ok) {
        resetChartData();
        return;
      }

      const data = Array.isArray(rawData) ? rawData : [];
      
      if (!data || data.length === 0) {
        resetChartData();
        return;
      }

      // Calculate all data in one pass
      const { hotDogCounts, paymentCounts } = calculateDistributions(data);
      const { timeSlots, displayedSlots } = calculateTimeSlots(data, dashboardDate);
      const totalOrders = data.filter(order => order.orderTime).length;
      const chartDataValues = calculateChartData(data, timeSlots, dashboardDate);
      
      // Update all state at once
      setOrders(data);
      setOrderDistribution(hotDogCounts);
      setPaymentDistribution(paymentCounts);
      setChartData({
        timeSlots,
        displayedSlots,
        data: chartDataValues,
        totalOrders
      });

      // Calculate stats
      const totalRevenue = data.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      const orderCount = data.length;
      const hotDogCount = data.reduce((sum, order) => sum + order.hotdogs.length, 0);
      
      // Filter in-progress orders (not READY, DELIVERED, or CANCELLED)
      const inProgressOrders = data.filter(order => 
        !['READY', 'DELIVERED', 'CANCELLED'].includes(order.orderStatus)
      );
      const inProgressCount = inProgressOrders.length;
      const inProgressHotDogCount = inProgressOrders.reduce((sum, order) => sum + order.hotdogs.length, 0);

      console.log('[Dashboard Stats]', {
        totalOrders: data.length,
        inProgressCount,
        inProgressOrders: inProgressOrders.map(o => ({ id: o.id, status: o.orderStatus }))
      });

      // Calculate current wait time
      let avgWaitTime = 2;
      if (inProgressOrders.length > 0) {
        // Get current time for accurate wait calculation
        const now = new Date();
        
        // Calculate weighted wait time based on number of hot dogs
        let totalWaitTime = 0;
        let totalHotDogs = 0;
        
        inProgressOrders.forEach(order => {
          if (!order.orderTime) return;
          const orderTime = new Date(order.orderTime);
          const waitTimeMinutes = Math.round((now.getTime() - orderTime.getTime()) / (1000 * 60));
          const hotdogCount = order.hotdogs.length;
          
          totalWaitTime += waitTimeMinutes * hotdogCount;
          totalHotDogs += hotdogCount;
        });

        // Calculate weighted average
        if (totalHotDogs > 0) {
          avgWaitTime = Math.max(2, Math.round(totalWaitTime / totalHotDogs));
        }

        console.log('[Wait Time Calculation]', {
          inProgressOrders: inProgressOrders.map(o => ({
            id: o.id,
            orderTime: o.orderTime,
            hotdogs: o.hotdogs.length,
            status: o.orderStatus
          })),
          totalWaitTime,
          totalHotDogs,
          avgWaitTime
        });
      }

      setStats({
        revenue: totalRevenue,
        orderCount,
        hotDogCount,
        avgWaitTime,
        inProgressCount,
        inProgressHotDogCount
      });
    } catch (error) {
      console.error('[Dashboard Error]', error);
      // Reset stats on error
      setStats({
        revenue: 0,
        orderCount: 0,
        hotDogCount: 0,
        avgWaitTime: 0,
        inProgressCount: 0,
        inProgressHotDogCount: 0
      });
    }
  }, [dashboardDate]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      calculateRevenue();
    }, 5000);
    
    // Initial calculation
    calculateRevenue();
    
    return () => clearInterval(intervalId);
  }, [calculateRevenue]);

  const calculateTimeSlots = (orders: Order[], currentTime: Date): { timeSlots: string[], displayedSlots: string[] } => {
    // Sort orders chronologically and get the first order
    const sortedOrders = [...orders].sort((a, b) => {
      if (!a.orderTime || !b.orderTime) return 0;
      return new Date(a.orderTime).getTime() - new Date(b.orderTime).getTime();
    });
    
    // If no orders, return empty slots
    if (orders.length === 0) {
      return { timeSlots: [], displayedSlots: [] };
    }
    
    const firstOrder = sortedOrders.find(order => order.orderTime);
    const lastOrder = [...sortedOrders].reverse().find(order => order.orderTime);
    
    if (!firstOrder || !firstOrder.orderTime || !lastOrder || !lastOrder.orderTime) {
      return { timeSlots: [], displayedSlots: [] };
    }
    
    const firstTime = new Date(firstOrder.orderTime);
    const lastTime = new Date(lastOrder.orderTime);
    
    // Get the preceding quarter for the start time (the quarter before the first order)
    const startTime = new Date(firstTime);
    const startMinutes = Math.floor(startTime.getMinutes() / 15) * 15;
    startTime.setMinutes(startMinutes, 0, 0);
    
    // Get the next quarter after the last order
    const endTime = new Date(lastTime);
    const endMinutes = Math.ceil(endTime.getMinutes() / 15) * 15;
    endTime.setMinutes(endMinutes, 0, 0);
    
    const timeSlots: string[] = [];
    let currentSlot = new Date(startTime);
    
    while (currentSlot <= endTime) {
      const slot = `${currentSlot.getHours().toString().padStart(2, '0')}:${currentSlot.getMinutes().toString().padStart(2, '0')}`;
      timeSlots.push(slot);
      currentSlot.setMinutes(currentSlot.getMinutes() + 15);
    }

    const displayedSlots = timeSlots.filter((slot, index) => {
      // Always show first and last slots
      if (index === 0 || index === timeSlots.length - 1) return true;
      // Show full hours
      return slot.endsWith(':00');
    });
    
    return { timeSlots, displayedSlots };
  };

  const calculateChartData = (orders: Order[], timeSlots: string[], currentTime: Date): ChartData['data'] => {
    const dataMap = new Map<string, number>();
    const waitTimeMap = new Map<string, number>();

    // Initialize all slots with 0
    timeSlots.forEach(slot => {
      dataMap.set(slot, 0);
      waitTimeMap.set(slot, 0);
    });

    // Helper function to get the slot start time for comparison
    const getSlotStartTime = (slotStr: string) => {
      const [hours, minutes] = slotStr.split(':').map(Number);
      const date = new Date(currentTime);
      date.setHours(hours, minutes, 0, 0);
      return date;
    };

    // Helper function to get the slot end time for comparison
    const getSlotEndTime = (slotStr: string) => {
      const [hours, minutes] = slotStr.split(':').map(Number);
      const date = new Date(currentTime);
      date.setHours(hours, minutes + 14, 59, 999);
      return date;
    };

    // Process each time slot
    timeSlots.forEach(slot => {
      const slotStart = getSlotStartTime(slot);
      const slotEnd = getSlotEndTime(slot);

      // Count orders that fall within this slot's range
      const ordersInSlot = orders.filter(order => {
        if (!order.orderTime) return false;
        const orderTime = new Date(order.orderTime);
        return orderTime >= slotStart && orderTime <= slotEnd;
      });

      dataMap.set(slot, ordersInSlot.length);

      // Calculate average wait time for orders in this slot
      if (ordersInSlot.length > 0) {
        const waitTimes = ordersInSlot.map(order => {
          if (!order.orderTime) return 0;
          const orderTime = new Date(order.orderTime);
          return Math.round((currentTime.getTime() - orderTime.getTime()) / (1000 * 60));
        });
        const avgWaitTime = Math.max(2, Math.round(waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length));
        waitTimeMap.set(slot, avgWaitTime);
      }
    });

    const chartData = {
      orders: timeSlots.map(slot => ({
        time: slot,
        value: dataMap.get(slot) || 0
      })),
      waitTime: timeSlots.map(slot => ({
        time: slot,
        value: waitTimeMap.get(slot) || 0
      }))
    };

    return chartData;
  };

  const resetChartData = useCallback(() => {
    setOrders([]);
    setStats({
      revenue: 0,
      orderCount: 0,
      hotDogCount: 0,
      avgWaitTime: 0,
      inProgressCount: 0,
      inProgressHotDogCount: 0
    });
    setOrderDistribution([
      { name: 'Classic', value: 0, fill: '#e57373' },
      { name: 'Alsace', value: 0, fill: '#8d6e63' },
      { name: 'New York', value: 0, fill: '#ffd54f' }
    ]);
    setPaymentDistribution([
      { name: 'Carte', value: 0, fill: '#FF9800' },
      { name: 'Espèces', value: 0, fill: '#4CAF50' }
    ]);
    setChartData({
      timeSlots: [],
      displayedSlots: [],
      data: {
        orders: [],
        waitTime: []
      },
      totalOrders: 0
    });
  }, []);

  const StatsCards = useMemo(() => (
    <StatsGrid>
      <StatCard>
        <StatIcon style={{ backgroundColor: '#FFD700' }}>
          <Icon>euro</Icon>
        </StatIcon>
        <StatContent>
          <StatValue>{`${stats.revenue.toFixed(2)}€`}</StatValue>
          <StatLabel>Recettes</StatLabel>
        </StatContent>
      </StatCard>

      <StatCard>
        <StatIcon style={{ backgroundColor: '#E1BEE7' }}>
          <Icon>receipt_long</Icon>
        </StatIcon>
        <StatContent style={{ display: 'flex', gap: '24px' }}>
          <div>
            <StatValue>{stats.orderCount}</StatValue>
            <StatLabel>Commandes</StatLabel>
          </div>
          <div>
            <StatValue>{stats.hotDogCount}</StatValue>
            <StatLabel>Hot-dogs</StatLabel>
          </div>
        </StatContent>
      </StatCard>

      <StatCard>
        <StatIcon style={{ 
          backgroundColor: getInProgressColor(stats.inProgressCount)
        }}>
          <Icon>restaurant</Icon>
        </StatIcon>
        <StatContent style={{ display: 'flex', gap: '24px' }}>
          <div>
            <StatValue>{stats.inProgressCount}</StatValue>
            <StatLabel>En cours</StatLabel>
          </div>
          <div>
            <StatValue>{stats.inProgressHotDogCount}</StatValue>
            <StatLabel>Hot-dogs</StatLabel>
          </div>
        </StatContent>
      </StatCard>

      <StatCard>
        <StatIcon style={{ 
          fontSize: '2rem',
          padding: '8px',
          borderRadius: '50%',
          backgroundColor: getWaitTimeColor(stats.avgWaitTime)
        }}>
          <Icon>schedule</Icon>
        </StatIcon>
        <StatContent>
          <StatValue>{stats.avgWaitTime} min</StatValue>
          <StatLabel>Temps d'attente actuel</StatLabel>
        </StatContent>
      </StatCard>
    </StatsGrid>
  ), [
    stats.revenue, 
    stats.orderCount, 
    stats.hotDogCount, 
    stats.avgWaitTime,
    stats.inProgressCount,
    stats.inProgressHotDogCount
  ]);

  return (
    <PageContainer>
      <HeaderSection>
        <Title>TABLEAU DE BORD</Title>
        <DateNavigation>
          <ArrowButton onClick={() => {
            const newDate = new Date(dashboardDate);
            newDate.setDate(newDate.getDate() - 1);
            setDashboardDate(newDate);
          }}>
            <Icon>chevron_left</Icon>
          </ArrowButton>
          <DateText>{formatDateToDisplay(dashboardDate)}</DateText>
          <ArrowButton onClick={() => {
            const newDate = new Date(dashboardDate);
            newDate.setDate(newDate.getDate() + 1);
            setDashboardDate(newDate);
          }}>
            <Icon>chevron_right</Icon>
          </ArrowButton>
        </DateNavigation>
        <div /> {/* Empty div for the third column */}
      </HeaderSection>
      {StatsCards}
      <ChartsGrid>
        <ChartCard>
          <ChartTitle>Évolution des commandes</ChartTitle>
          {orders.length === 0 ? (
            <NoDataMessage>Pas de données à afficher</NoDataMessage>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={chartData.data.orders}
                margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#673ab7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#673ab7" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time"
                  ticks={chartData.displayedSlots.filter(slot => slot.endsWith(':00'))}
                  interval={0}
                  textAnchor="middle"
                  height={50}
                  tickMargin={10}
                  style={{ fontSize: '10px' }}
                />
                <YAxis 
                  domain={[0, (dataMax: number) => Math.ceil(dataMax + 1)]}
                  tickCount={Math.ceil(Math.max(...chartData.data.orders.map(d => d.value))) + 2}
                  allowDecimals={false}
                  style={{ fontSize: '10px' }}
                />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#673ab7" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#ordersGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard>
          <ChartTitle>Temps d'attente moyen</ChartTitle>
          {orders.length === 0 ? (
            <NoDataMessage>Pas de données à afficher</NoDataMessage>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData.data.waitTime}
                margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4CAF50" stopOpacity={0.3}/>
                  </linearGradient>
                  <linearGradient id="yellowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFC107" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FFC107" stopOpacity={0.3}/>
                  </linearGradient>
                  <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F44336" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#F44336" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time"
                  ticks={chartData.displayedSlots.filter(slot => slot.endsWith(':00'))}
                  interval={0}
                  textAnchor="middle"
                  height={50}
                  tickMargin={10}
                  style={{ fontSize: '10px' }}
                />
                <YAxis 
                  domain={[0, (dataMax: number) => Math.ceil(dataMax + 1)]}
                  tickCount={Math.ceil(Math.max(...chartData.data.waitTime.map(d => d.value))) + 2}
                  allowDecimals={false}
                  style={{ fontSize: '10px' }}
                />
                <Tooltip />
                <Bar 
                  dataKey="value"
                  fill="url(#greenGradient)"
                >
                  {
                    chartData.data.waitTime.map((entry, index) => {
                      let fillColor = "#4CAF50";
                      if (entry.value > 10) {
                        fillColor = "url(#redGradient)";
                      } else if (entry.value > 5) {
                        fillColor = "url(#yellowGradient)";
                      } else {
                        fillColor = "url(#greenGradient)";
                      }
                      return <Cell key={`cell-${index}`} fill={fillColor} />;
                    })
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard>
          <ChartTitle>Répartition des hot-dogs</ChartTitle>
          {orders.length === 0 ? (
            <NoDataMessage>Pas de données à afficher</NoDataMessage>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  labelLine={true}
                  label={({ name, value, percent }) => 
                    value > 0 ? `${name}: ${value} (${(percent * 100).toFixed(0)}%)` : ''
                  }
                >
                  {orderDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard>
          <ChartTitle>Répartition des paiements</ChartTitle>
          {orders.length === 0 ? (
            <NoDataMessage>Pas de données à afficher</NoDataMessage>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  labelLine={true}
                  label={({ name, value, percent }) => 
                    value > 0 ? `${name}: ${value.toFixed(2)}€ (${(percent * 100).toFixed(0)}%)` : ''
                  }
                >
                  {paymentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </ChartsGrid>
    </PageContainer>
  );
};

export default Dashboard;
