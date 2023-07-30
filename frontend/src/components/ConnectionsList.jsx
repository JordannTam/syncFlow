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

export default function ConnectionList(props) {
    const navigate = useNavigate()
    const { connections } = props
    const n = connections.length - 1
    const token = Cookies.get('loginToken')
    const dispatch = useDispatch()


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
              <ListItemText primary={`${con.first_name} ${con.last_name}`} />
            </ListItemButton>
          </ListItem>
            
            
          {index !== n ? <Divider />: <></>}
        </Box>

        ))
    }
        </List>
  )
}
