import React, { useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import { Box, Typography } from '@mui/material';
import TaskList from '../components/TaskList'
import Button from '../components/Button';
import { RowBox } from '../components/FlexBox';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks } from '../actions';
import Cookies from 'js-cookie';
import { apiCall } from '../utils/api';

const DashboardScreen = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const tasks = useSelector(state => state.taskReducer)
  const token = Cookies.get('loginToken');

  const handleFetchTasks = async () => {
    try {
      const tasks = await apiCall('/tasks', undefined, 'GET', `bearer ${token}`); //Uncomment
      dispatch(setTasks(tasks)) 
      console.log("tasks: ", tasks)
    } catch (err) {
      console.error(err);
    }
  }

  

  useEffect(() => {
      handleFetchTasks()
  }, [])

  return (
    <PageContainer maxWidth="lg" marginTop="0px" >
      <RowBox justifyContent='space-between' marginBottom='50px'>
        <Typography variant="h3" component="h2">
          Dashboard
        </Typography>
        <Button variant='contained' onClick={() => navigate('/task/new')}>Create Task</Button>
      </RowBox>
        <TaskList tasks={tasks} rowNums={10} height='800'/>
    </PageContainer>
  );
};

export default DashboardScreen;

