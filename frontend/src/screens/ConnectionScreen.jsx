import React, { useEffect, useState } from 'react';
import PageContainer from '../components/PageContainer';
import { Box, Typography } from '@mui/material';
import Button from '../components/Button';
import { RowBox } from '../components/FlexBox';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setConnections } from '../actions';
import Cookies from 'js-cookie';
import { apiCall } from '../utils/api';

const ConnectionsScreen = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const connections = useSelector(state => state.connectionsReducer)
  const token = Cookies.get('loginToken')

  const handleFetchConnections = async () => {
    try {
      const connectionsRes = await apiCall('/connections', {}, 'GET', `bearer ${token}`);
      dispatch(setConnections(connectionsRes))
      console.log("connections: ", connectionsRes)
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
      handleFetchConnections()
  }, [])

  if (!connections) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer maxWidth="lg" marginTop="0px" >
      <RowBox justifyContent='space-between' marginBottom='50px'>
        <Typography variant="h3" component="h2">
          Connection
        </Typography>
        <Button variant='contained' onClick={() => navigate('/task/new')}>Create Task</Button>
      </RowBox>
    </PageContainer>
  );
};

export default ConnectionsScreen;

