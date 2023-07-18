import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Box, IconButton, ListItemButton, ListItemIcon } from '@mui/material';
import Button from './Button';
import { RowBox } from './FlexBox';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { addConnections } from '../actions';

export default function ConnectionReqList(props) {
    const navigate = useNavigate()
    const { connections } = props
    const n = connections.length - 1
    const token = Cookies.get('loginToken')
    const dispatch = useDispatch()
    const [isManaged, setIsManaged] = React.useState(false)

    const handleProfile = (id) => {
        navigate(`/profile/${id}`)
    }

    const handleAccept = async (user) => {
        try {
            setIsManaged(true)
            const object = {
                sender_id: user.u_id,
                decision: true
            }
            await apiCall('/connection_request_management', object, 'POST', `bearer ${token}`);
            dispatch(addConnections(user))
            const rs = connections
            const ls = rs.filter((x) => user.u_id !== x.u_id)
            props.setConnectionsReqs(ls)
        } catch (err) {
        console.error(err);
        }
    
    }

    const handleDecline = async (user) => {
        try {
            setIsManaged(true)
            const object = {
                sender_id: user.u_id, 
                decision: false
            }
            await apiCall('/connection_request_management', object, 'POST', `bearer ${token}`);
            const ls = connections
            const a = ls.filter((x) => x.u_id !== user.u_id)
            console.log(ls, a, user.u_id);
            props.setConnectionsReqs(a)
        } catch (err) {
            console.error(err);
        }
    }

  
  return (
      <List sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper', margin: 'auto' }}>
    {
        connections.map((con, index) => (
        <Box key={index}>
          <ListItem             
            secondaryAction = {
                <RowBox columnGap="10px">
                    <Button disabled={isManaged} variant="contained" onClick={() => handleAccept(con)} >Accpet</Button>
                    <Button disabled={isManaged} variant="outlined" color="error" onClick={() => handleDecline(con)}>Decline</Button>
                </RowBox>
            }
            disablePadding
            >
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