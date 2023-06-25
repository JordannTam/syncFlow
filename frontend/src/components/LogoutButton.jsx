import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const RowBox = styled(FlexBox)(
  {
    flexDirection: 'row'
  }
)

export const ColumnBox = styled(FlexBox)(
  {
    flexDirection: 'column'
  }
)

export default function LogoutButton() {
  return (
    <List>
        <ListItem key='logout' disablePadding sx={{ display: 'block' }}>
            <ListItemButton
            component={RouterLink}
            oncl
            sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
            }}
            >
            <ListItemIcon
                sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
                }}
            >
                <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary='Log out' sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
        </ListItem>
    </List>
  )
}
