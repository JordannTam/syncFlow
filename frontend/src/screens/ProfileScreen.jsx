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
import { setTasks } from '../actions';
import WorkloadBar from '../components/WorkloadBar';

const ProfileScreen = () => {
  const dispatch = useDispatch()
  const token = Cookies.get('loginToken');
  const tasks = useSelector(state => state.taskReducer)
  // const profile = useSelector(state => state.profileReducer)
  const [taskStorage, setTaskStorage] = useState([])
  const [profile, setProfile] = useState([])
  const [score, setScore] = useState(0)
  const params = useParams()


  const handleFetchTasks = async () => {
    try {
      const res = await apiCall(`/tasks?page=profile&profile_id=${params.id}`, {}, 'GET', `bearer ${token}`);
      dispatch(setTasks(res))
      setTaskStorage(res)
    } catch (err) {
      console.error(err);
    }
  }
  const handleFetchProfile = async () => {
    try {
      const profile_data = await apiCall(`/profile?profile_id=${params.id}`, {}, 'GET', `bearer ${token}`);
      const score_data = await apiCall(`/profile/score?profile_id=${params.id}`, {}, 'GET', `bearer ${token}`);
      setScore(score_data)
      setProfile(profile_data)
      console.log("User profile: ", profile_data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    handleFetchProfile()
    handleFetchTasks()
  }, [])

  if (!tasks) {
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
        <WorkloadBar value={score}/>
        <Typography variant="h6" component="h2" marginTop="10px">
          Name: {profile.first_name} {profile.last_name}
        </Typography>
        <Typography variant="h6" component="h2">
          Email: {profile.email} 
        </Typography>
        <Typography variant="h6" component="h2" marginBottom="20px">
          Date of Birth: {profile.date_of_birth} 
        </Typography>
        <SearchBar taskStorage={taskStorage}/>
        <TaskList tasks={tasks} id={params.id} rowNums={5} height='400'/>
      </PageContainer>
    </>
  );
};

export default ProfileScreen
    ;