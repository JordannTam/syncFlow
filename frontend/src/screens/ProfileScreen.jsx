import React, { useEffect } from 'react';
import SideBar from '../components/SideBar';
import PageContainer from '../components/PageContainer'
import TaskList from '../components/TaskList';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

const ProfileScreen = () => {
  const dispatch = useDispatch()
  const tasks = useSelector(state => state.taskReducer)
  const profile = useSelector(state => state.taskReducer)

  const handleFetchTasks = async () => {
    try {
      // const tasks = await apiCall('/task', object, 'GET', undefined);
      // dispatch(setTasks(tasks))
    } catch (err) {
      console.log(err);
    }
  }
  const handleFetchProfile = async () => {
    try {
      // const profile = await apiCall('/profile', object, 'GET', undefined);
      // dispatch(setProfile(profile))
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
      handleFetchTasks()
      handleFetchProfile()
  }, [])

  return (
    <>
      {/* <SideBar/> */}
        <PageContainer marginTop="0px" maxWidth="lg">
        <Typography variant="h3" component="h2" marginBottom="15px">
          Profile
        </Typography>
        <Box
          component="img"
          sx={{
            height: 150,
            width: 150,
            maxHeight: { xs: 250, md: 250 },
            maxWidth: { xs: 250, md: 250 },
          }}
          alt="profile image"
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
        />
        <Typography variant="h6" component="h2" marginTop="10px">
          Username: {profile.name}
        </Typography>
        <Typography variant="h6" component="h2">
          Email: email@gmail.com
        </Typography>
        <Typography variant="h6" component="h2" marginBottom="20px">
          Date of Birth: 06/06/2001
        </Typography>
        <TaskList tasks={tasks} rowNums={5} height='400'/>
      </PageContainer>
    </>
  );
};

export default ProfileScreen
    ;