import React, { useEffect, useState } from 'react'
import MiniDrawer from '../components/MiniDrawer';
import ControledDataGrid from '../components/ControledDataGrid';
import { Box, Button, Card, CardActions, CardContent, Chip, Divider, Grid, LinearProgress, MenuItem, TextField, Typography } from '@mui/material';
import { Beenhere, DoneAll, PendingActions, RotateRight } from '@mui/icons-material';
import { projectService } from '../services/projectServices';
import { PieChart } from '@mui/x-charts/PieChart';
import { useNavigate } from 'react-router-dom';
import StatusPieChart from '../components/charts/StatusPieChart';
import ProjectBarChart from '../components/charts/ProjectBarChart';

export const Home = () => {
  
  const [projects, setProjects] = useState(null);
  const fetchProjects = async () => {
    try {
      const response = await projectService.getActiveProjects();
      // console.log("get device response:",response);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching device:', error);
    }
  };
  const [count, setCount] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);


  const newProjects = count?.projects;
  const totals = (newProjects ?? []).reduce(
    (acc, project) => {
      acc.pending += project.pending ?? 0;
      acc.inprogress += project.inprogress ?? 0;
      acc.resolved += project.resolved ?? 0;
      acc.closed += project.closed ?? 0;
      return acc;
    },
    { pending: 0, inprogress: 0, resolved: 0, closed: 0 }
  );
  // getActiveProjects

  return (
    <MiniDrawer>

      {/* Summary Cards */}
      {count ? (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
            <ComplainCard data={{ color: "#F3533A", icon: <PendingActions fontSize="large" />, title: "Pending", count: totals.pending }} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
            <ComplainCard data={{ color: "#FA9F42", icon: <RotateRight fontSize="large" />, title: "Inprogress", count: totals.inprogress }} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
            <ComplainCard data={{ color: "#8AB879", icon: <DoneAll fontSize="large" />, title: "Resolved", count: totals.resolved }} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
            <ComplainCard data={{ color: "#5AC5C9", icon: <Beenhere fontSize="large" />, title: "Closed", count: totals.closed }} />
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ mb: 4 }}>Loading...</Box>
      )}

      {/* Projects Section */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary', mb: 3 }}>
        Projects
      </Typography>
      {count?.projects ? (
        <Grid container spacing={2}>
          {count?.projects.map((data, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={index}>
              <ProjectCard data={data} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box>Loading...</Box>
      )}
      {/* Charts Section */}
      {count && (
        <Grid container spacing={3} sx={{ mb: 2, mt: 1 }}>
          <Grid item xs={12} md={4}>
            <StatusPieChart data={totals} />
          </Grid>
          <Grid item xs={12} md={8}>
            {count?.projects && count.projects.length > 0 && (
              <ProjectBarChart projects={count.projects} />
            )}
          </Grid>
        </Grid>
      )}

    </MiniDrawer>
  );
};

const ComplainCard = ({ data }) => {
  const navigate = useNavigate();

  const handleCardClick = (status) => {
    navigate(`/complains?status=${status}`);
  };
  return <Box sx={{ p: 2, borderRadius: "10px", display: "flex", justifyContent: "space-between", background: data.color, color: "#fff", cursor:"pointer" }} onClick={() => handleCardClick(data.title)}>
    <Box>
      <Typography variant="body2" style={{ fontWeight: "700" }}> {data.title}</Typography>
      <Typography variant="h4" style={{ fontWeight: "700" }}>{data.count}</Typography>
    </Box>
    <Box style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      {data.icon}
    </Box>
  </Box>
}

const ProjectCard = ({ data }) => {
  return <Card sx={{ minWidth: 275 }} elevation={3}>
    <CardContent sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ flex: 1, maxWidth: 200 }}>
        <PieChart
          series={[
            {
              paddingAngle: 2,
              innerRadius: 25,
              outerRadius: 40,
              data: [
                { value: data.pending, color: '#F3533A' },
                { value: data.inprogress, color: '#FA9F42' },
                { value: data.resolved, color: '#8AB879' },
                { value: data.closed, color: '#5AC5C9' },
              ],
            },
          ]}
          margin={{ right: 10 }}
          width={100}
          height={100}
          legend={{ hidden: true }}
        />
      </Box>
      <Box sx={{ flex: 3 }}>
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 20, fontWeight: 700 }}>
          {data.name}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box component="span" sx={{ background: '#F3533A', width: 15, height: 15, borderRadius: '50%' }} />
            <Typography mx={1}>
              {data.pending}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box component="span" sx={{ background: '#FA9F42', width: 15, height: 15, borderRadius: '50%' }} />
            <Typography mx={1}>
              {data.inprogress}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box component="span" sx={{ background: '#8AB879', width: 15, height: 15, borderRadius: '50%' }} />
            <Typography mx={1}>
              {data.resolved}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box component="span" sx={{ background: '#5AC5C9', width: 15, height: 15, borderRadius: '50%' }} />
            <Typography mx={1}>
              {data.closed}
            </Typography>
          </Box>
        </Box>
      </Box>
    </CardContent>
  </Card>
}

// const pieParams = {
//   height: 80,
//   margin: { right: 5 },
//   slotProps: { legend: { hidden: true } },
// };