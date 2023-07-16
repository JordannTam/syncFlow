import React, { useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import PageContainer from '../components/PageContainer'
import TaskList from '../components/TaskList';
import { Box, Typography, CircularProgress  } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { apiCall } from '../utils/api';
import SearchBar from '../components/SearchBar';
import { useParams } from 'react-router-dom';
import WorkloadBar from '../components/WorkloadBar';

const ProfileScreen = () => {
  const dispatch = useDispatch()
  const token = Cookies.get('loginToken');
  const [ptasks, setPTasks] = useState([])
  const profile = useSelector(state => state.profileReducer)
  const params = useParams()


  const handleFetchTasks = async () => {
    try {
      const res = await apiCall(`/tasks?page=profile&profile_id=${params.id}`, {}, 'GET', `bearer ${token}`);
      setPTasks(res)
    } catch (err) {
      console.error(err);
    }
  }
  // const handleFetchProfile = async () => {
  //   try {
  //     // dispatch(setProfile(profile))
  //     const profile_data = await apiCall('/profile', {}, 'GET', `bearer ${token}`);
  //     console.log("User profile: ", profile_data);
  //     setProfile(profile_data)
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  useEffect(() => {
      handleFetchTasks()
  }, [])

  if (!ptasks) {
    return <>Loading...</>
  }

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
        <WorkloadBar value={110}/>
        <Typography variant="h6" component="h2" marginTop="10px">
          Name: {profile.first_name} {profile.last_name}
        </Typography>
        <Typography variant="h6" component="h2">
          Email: {profile.email} 
        </Typography>
        <Typography variant="h6" component="h2" marginBottom="20px">
          Date of Birth: {profile.date_of_birth} 
        </Typography>
        <SearchBar displayTask={ptasks} setDisplayTask={setPTasks}/>
        <TaskList tasks={ptasks} id={params.id} rowNums={5} height='400'/>
      </PageContainer>
    </>
  );
};

export default ProfileScreen
    ;