import React from 'react';
import PageContainer from '../components/PageContainer';
import { Box, Typography } from '@mui/material';
import TaskList from '../components/TaskList'
import Button from '../components/Button';
import { RowBox } from '../components/FlexBox';
import { useNavigate } from 'react-router-dom';

const DashboardScreen = () => {
  const navigate = useNavigate()
  return (
    <PageContainer maxWidth="lg" marginTop="0px" >
      <RowBox justifyContent='space-between' marginBottom='50px'>
        <Typography variant="h3" component="h2">
          Dashboard
        </Typography>
        <Button variant='contained' onClick={() => navigate('/newtask')}>Create Task</Button>
      </RowBox>
        <TaskList rowNums={10} height='800'/>
    </PageContainer>
  );
};

export default DashboardScreen;

