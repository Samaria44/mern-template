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
import CollapsableDrawer from '../components/CollapsableDrawer';

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

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <MiniDrawer>
      {/* <CollapsableDrawer /> */}

    </MiniDrawer>
  );
};