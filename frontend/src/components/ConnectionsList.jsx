import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Box, IconButton, ListItemButton, ListItemIcon } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { apiCall } from '../utils/api';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { deleteConnection } from '../actions';

import { useEffect, useState } from 'react';
import WorkloadBar from './WorkloadBar';

export default function ConnectionList(props) {
    const navigate = useNavigate()
    const { connections } = props
    const n = connections.length - 1
    const token = Cookies.get('loginToken')
    const dispatch = useDispatch()

    const [scores, setScores] = useState([]);

    useEffect(() => {
      fetchScores();
    }, []);

    const fetchScores = async () => {
      try {
        const response = await apiCall(`/profile/scores?get_connected=true`, {}, 'GET', `bearer ${token}`);
        setScores(response.scores);
      } catch (err) {
        console.error(err);
      }
    };


    const handleProfile = (id) => {
      navigate(`/profile/${id}`)
    }

    const handleDeleteConnection = async (id) => {
      try {
        await apiCall(`/delete_connection?profile_id=${id}`, {}, 'DELETE', `bearer ${token}`);
        dispatch(deleteConnection(id))
      } catch (err) {
        console.error(err);
      }

    }

    const getScore = (id) => {
      const profileScore = scores.find(score => score.profile_id === id);
      return profileScore ? profileScore.score : 0;
    }
  

  return (
      <List sx={{ width: '100%', maxWidth: 700, bgcolor: 'background.paper', margin: 'auto' }}>
    {
        connections.map((con, index) => (
        <Box key={index}>
          <ListItem             
            secondaryAction = {
              <IconButton edge="end" aria-label="comments"onClick={() => handleDeleteConnection(con.u_id)}>
                <DeleteIcon />
              </IconButton>
            }
            disablePadding
            >
            <ListItemButton onClick={() => handleProfile(con.u_id)}>
              <ListItemIcon>
                <Avatar src={con.image}></Avatar>
              </ListItemIcon>
              <ListItemIcon sx={{position: 'relative', bottom:'-15px', right: '20px'}}>
                <WorkloadBar value={getScore(con.u_id)} size={48} />
              </ListItemIcon>
              <ListItemText primary={`${con.first_name} ${con.last_name}`} />
            </ListItemButton>
              {/* <WorkloadBar value={100} /> */}
          </ListItem>
            
            
          {index !== n ? <Divider />: <></>}
        </Box>

        ))
    }
        </List>
  )
}
