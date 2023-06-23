import React from 'react';
import PageContainer from '../components/PageContainer';
import { Typography } from '@mui/material';
import TaskList from '../components/TaskList'

const DashboardScreen = () => {
  return (
    <PageContainer>
        <Typography variant="h3" component="h2">
          Dash Board
        </Typography>
        <TaskList />
        <a className='register-link' href="/profile">
            to profile page
        </a>

        <a className='register-link' href="/login">
            logout
        </a>
    </PageContainer>
  );
};

export default DashboardScreen;