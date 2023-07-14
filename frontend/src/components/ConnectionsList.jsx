import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Box, ListItemButton, ListItemIcon } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ConnectionList(props) {
  const navigate = useNavigate()
    const { connections } = props
    const n = connections.length - 1

    const handleProfile = (id) => {
      navigate(`/profile/${id}`)
    }
  
  return (
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', margin: 'auto' }}>
    {
        connections.map((con, index) => (
        <Box key={con.u_id}>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleProfile(con.u_id)}>
              <ListItemIcon>
                <Avatar></Avatar>
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
