import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

const StatusPieChart = ({ data = {} }) => {
  const chartData = [
    { id: 'pending', value: data.pending || 0, label: 'Pending', color: '#F3533A' },
    { id: 'inprogress', value: data.inprogress || 0, label: 'In Progress', color: '#FA9F42' },
    { id: 'resolved', value: data.resolved || 0, label: 'Resolved', color: '#8AB879' },
    { id: 'closed', value: data.closed || 0, label: 'Closed', color: '#5AC5C9' },
  ];

  return (
    <Card sx={{ height: '100%' }} elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'text.primary',textAlign:"center" }}>
          Overall Status Distribution
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 300,
            width: '100%',
          }}
        >
          <PieChart
            series={[
              {
                data: chartData,
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                paddingAngle: 2,
                innerRadius: 80,
                outerRadius: 120,
              },
            ]}
            width={500}
            height={300}
            slotProps={{
              legend: {
                direction: 'column',
                position: { vertical: 'middle', horizontal: 'right' }, // place legend to right
                itemMarkWidth: 16,
                itemMarkHeight: 16,
                markGap: 8,
                itemGap: 30, // space between legend items
                labelStyle: {
                  fontSize: 18,
                },
              },
            }}
            sx={{
            //   marginRight: 4, // spacing between chart and legend
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatusPieChart;
