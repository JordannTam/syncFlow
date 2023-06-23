import React from 'react';
import SideBar from '../components/SideBar';
import PageContainer from '../components/PageContainer'
import TaskList from '../components/TaskList';
import { Box, Typography } from '@mui/material';

const ProfileScreen = () => {
  return (
    <>
      {/* <SideBar/> */}
        <PageContainer marginTop="10px" maxWidth="lg">
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
          Username: name
        </Typography>
        <Typography variant="h6" component="h2">
          Email: email@gmail.com
        </Typography>
        <Typography variant="h6" component="h2" marginBottom="20px">
          Date of Birth: 06/06/2001
        </Typography>
        <TaskList rowNums='5'/>
      </PageContainer>
    </>
  );
};

export default ProfileScreen
    ;