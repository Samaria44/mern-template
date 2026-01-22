import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { storeService } from '../services/storeServices';
import { useSnackbar } from 'notistack';

const ProfitAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('daily');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await storeService.getStores();
      const medicines = res || [];
      
      const processedData = processAnalyticsData(medicines, timeRange);
      setAnalytics(processedData);
    } catch (error) {
      enqueueSnackbar("Failed to fetch analytics", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (medicines, range) => {
    const today = new Date();
    const data = [];
    
    if (range === 'daily') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString();
        
        const dayData = {
          date: dateStr,
          totalProfit: 0,
          totalRevenue: 0,
          totalCost: 0,
          medicinesSold: 0
        };
        
        // Simulate daily sales (in real app, this would come from sales transactions)
        medicines.forEach(medicine => {
          const simulatedSales = Math.floor(Math.random() * 10);
          const profit = (medicine.sellPrice - medicine.buyPrice) * simulatedSales;
          dayData.totalProfit += profit;
          dayData.totalRevenue += medicine.sellPrice * simulatedSales;
          dayData.totalCost += medicine.buyPrice * simulatedSales;
          dayData.medicinesSold += simulatedSales;
        });
        
        data.push(dayData);
      }
    } else if (range === 'weekly') {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - (i * 7));
        const weekStr = `Week ${4 - i}`;
        
        const weekData = {
          date: weekStr,
          totalProfit: 0,
          totalRevenue: 0,
          totalCost: 0,
          medicinesSold: 0
        };
        
        medicines.forEach(medicine => {
          const simulatedSales = Math.floor(Math.random() * 50);
          const profit = (medicine.sellPrice - medicine.buyPrice) * simulatedSales;
          weekData.totalProfit += profit;
          weekData.totalRevenue += medicine.sellPrice * simulatedSales;
          weekData.totalCost += medicine.buyPrice * simulatedSales;
          weekData.medicinesSold += simulatedSales;
        });
        
        data.push(weekData);
      }
    } else if (range === 'monthly') {
      // Last 6 months
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      for (let i = 5; i >= 0; i--) {
        const monthStr = months[i];
        
        const monthData = {
          date: monthStr,
          totalProfit: 0,
          totalRevenue: 0,
          totalCost: 0,
          medicinesSold: 0
        };
        
        medicines.forEach(medicine => {
          const simulatedSales = Math.floor(Math.random() * 200);
          const profit = (medicine.sellPrice - medicine.buyPrice) * simulatedSales;
          monthData.totalProfit += profit;
          monthData.totalRevenue += medicine.sellPrice * simulatedSales;
          monthData.totalCost += medicine.buyPrice * simulatedSales;
          monthData.medicinesSold += simulatedSales;
        });
        
        data.push(monthData);
      }
    }
    
    return data;
  };

  const getTotalProfit = () => {
    if (!analytics) return 0;
    return analytics.reduce((sum, item) => sum + item.totalProfit, 0);
  };

  const getTotalRevenue = () => {
    if (!analytics) return 0;
    return analytics.reduce((sum, item) => sum + item.totalRevenue, 0);
  };

  const getAverageProfit = () => {
    if (!analytics || analytics.length === 0) return 0;
    return getTotalProfit() / analytics.length;
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </FormControl>
        
        <Button
          onClick={fetchAnalytics}
          variant="contained"
          startIcon={<RefreshIcon />}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Profit
              </Typography>
              <Typography variant="h5">
                ${getTotalProfit().toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h5">
                ${getTotalRevenue().toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Profit
              </Typography>
              <Typography variant="h5">
                ${getAverageProfit().toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {analytics && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Profit Trend ({timeRange})
                </Typography>
                <LineChart
                  width={700}
                  height={300}
                  series={[
                    { data: analytics.map(item => item.totalProfit), label: 'Profit', color: '#8884d8' },
                    { data: analytics.map(item => item.totalRevenue), label: 'Revenue', color: '#82ca9d' }
                  ]}
                  xAxis={[{ scaleType: 'point', data: analytics.map(item => item.date) }]}
                />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sales Volume
                </Typography>
                <BarChart
                  width={400}
                  height={300}
                  series={[
                    { data: analytics.map(item => item.medicinesSold), label: 'Medicines Sold', color: '#8884d8' }
                  ]}
                  xAxis={[{ scaleType: 'band', data: analytics.map(item => item.date) }]}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ProfitAnalytics;
