// import React from 'react';
// import { Card, CardContent, Typography, Box } from '@mui/material';
// import { BarChart } from '@mui/x-charts/BarChart';

// const ProjectBarChart = ({ projects }) => {
//   const projectNames = projects.map((project) => project.name);
//   const pendingData = projects.map((project) => project.pending || 0);
//   const inprogressData = projects.map((project) => project.inprogress || 0);
//   const resolvedData = projects.map((project) => project.resolved || 0);
//   const closedData = projects.map((project) => project.closed || 0);

//   const series = [
//     {
//       data: pendingData,
//       label: 'Pending',
//       color: '#F3533A',
//       stack: 'total',
//     },
//     {
//       data: inprogressData,
//       label: 'In Progress',
//       color: '#FA9F42',
//       stack: 'total',
//     },
//     {
//       data: resolvedData,
//       label: 'Resolved',
//       color: '#8AB879',
//       stack: 'total',
//     },
//     {
//       data: closedData,
//       label: 'Closed',
//       color: '#5AC5C9',
//       stack: 'total',
//     },
//   ];

//   return (
//     <Card sx={{ height: '80%' }} elevation={3}>
//       <CardContent>
//         <Typography
//           variant="h6"
//           gutterBottom
//           sx={{ fontWeight: 700, color: 'text.primary',textAlign:"center" }}
//         >
//           Project-wise Status Distribution
//         </Typography>

//         <Box
//           sx={{
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center', // center vertically
//             width: '100%',
//             overflowX: 'auto',
//             mt: 2,
//           }}
//         >
//           <Box sx={{ minWidth: 600, width: '100%', maxWidth: 1200 }}>
//             <BarChart
//               series={series}
//               layout="horizontal"
//               borderRadius={4}
//               height={Math.max(400, projects.length * 60)}
//               margin={{ top: 30, bottom: 120, left: 150, right: 30 }} // increased bottom for legend spacing
//               yAxis={[
//                 {
//                   data: projectNames,
//                   scaleType: 'band',
//                   categoryGapRatio: 0.7,
//                   barGapRatio: 0.2,
//                 },
//               ]}
//               xAxis={[{ scaleType: 'linear' }]}
//               slotProps={{
//                 legend: {
//                   direction: 'row',
//                   position: { vertical: 'bottom', horizontal: 'middle' },
//                   padding: 16, // spacing inside legend box
//                 },
//               }}
//             />
//           </Box>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default ProjectBarChart;
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

const ProjectBarChart = ({ projects = [] }) => {
  const xLabels = projects.map((project) => project.name);

  const pendingData = projects.map((project) => project.pending || 0);
  const inprogressData = projects.map((project) => project.inprogress || 0);
  const resolvedData = projects.map((project) => project.resolved || 0);
  const closedData = projects.map((project) => project.closed || 0);

  return (
    <Card elevation={3} sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'text.primary',textAlign:"center" }}>
          Project-wise Status Distribution
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            overflowX: 'auto',
            mt: 1,
          }}
        >
          <BarChart
            height={300}
            width={Math.max(800, projects.length * 100)} // Responsive width
            xAxis={[{ data: xLabels, scaleType: 'band', categoryGapRatio: 0.7, barGapRatio: 0.2 }]}
            legend={{ hidden: true }}
            series={[
              {
                data: pendingData,
                label: 'Pending',
                color: '#F3533A',
              },
              {
                data: inprogressData,
                label: 'In Progress',
                color: '#FA9F42',
              },
              {
                data: resolvedData,
                label: 'Resolved',
                color: '#8AB879',
              },
              {
                data: closedData,
                label: 'Closed',
                color: '#5AC5C9',
              },
            ]}
            groupPadding={0.3}
            slotProps={{
              legend: {
                direction: 'row',
                position: { vertical: 'bottom', horizontal: 'middle' },
                itemGap: 12,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectBarChart;

