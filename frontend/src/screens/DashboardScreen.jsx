import React from 'react';
import PageContainer from '../components/PageContainer';
import { Typography } from '@mui/material';
import TaskList from '../components/TaskList'

const DashboardScreen = () => {
  return (
    <PageContainer maxWidth="lg" marginTop="0px" >
        <Typography variant="h3" component="h2">
          Dashboard
        </Typography>
        <TaskList rowNums={10} height='800'/>
    </PageContainer>
  );
};

export default DashboardScreen;

