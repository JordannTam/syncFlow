import React, { useEffect, useState } from 'react';
import PageContainer from '../components/PageContainer';
import { Box, Typography } from '@mui/material';
import TaskList from '../components/TaskList'
import Button from '../components/Button';
import { RowBox } from '../components/FlexBox';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks } from '../actions';
import Cookies from 'js-cookie';
import { apiCall } from '../utils/api';

const DashboardScreen = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const tasks = useSelector(state => state.taskReducer)
  const token = Cookies.get('loginToken')
  const [taskStorage, setTaskStorage] = useState([])
  const [loading, setLoading] = useState(false)

  const handleFetchTasks = async () => {
    try {
      const tasksRes = await apiCall('/tasks?page=dashboard', {}, 'GET', `bearer ${token}`);
      dispatch(setTasks(tasksRes))
      setTaskStorage(tasksRes)
      console.log("tasks: ", tasksRes)
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
      // setLoading(true)
      handleFetchTasks()
  }, [])

  if (!tasks && loading) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer maxWidth="lg" marginTop="0px" >
      <RowBox justifyContent='space-between' marginBottom='50px'>
        <Typography variant="h3" component="h2">
          Dashboard
        </Typography>
        <Button variant='contained' onClick={() => navigate('/task/new')}>Create Task</Button>
      </RowBox>
      <SearchBar taskStorage={taskStorage}/>
      <TaskList tasks={tasks} rowNums={10} height='800'/>
    </PageContainer>
  );
};

export default DashboardScreen;

