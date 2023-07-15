import React, { useEffect, useState } from 'react';
import PageContainer from '../components/PageContainer';
import { Badge, Box, Modal, TextField, Typography } from '@mui/material';
import Button from '../components/Button';
import { ColumnBox, RowBox } from '../components/FlexBox';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setConnections } from '../actions';
import Cookies from 'js-cookie';
import { apiCall } from '../utils/api';
import ConnectionList from '../components/ConnectionsList';
import ConnectionReqList from '../components/ConnectionsReqList';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '16px',
  p: 4,
};


const ConnectionsScreen = () => {
  const dispatch = useDispatch()
  const connections = useSelector(state => state.connectionsReducer)
  const [connectionsReqs, setConnectionsReqs] = useState([])
  const token = Cookies.get('loginToken')
  const [openReq, setOpenReq] = useState(false)
  const [openAdd, setOpenSend] = useState(false)
  const [email, setEmail] = useState("")
  const handleOpenAdd = () => setOpenSend(true)
  const handleCloseAdd = () => setOpenSend(false)
  const handleOpenReq = () => setOpenReq(true)
  const handleCloseReq = () => setOpenReq(false)

  const handleFetchConnections = async () => {
    try {
      const res = await apiCall('/connections', {}, 'GET', `bearer ${token}`);
      dispatch(setConnections(res.connection_list))
    } catch (err) {
      console.error(err);
    }
  }

  const handleFetchConnectionsRequests = async () => {
    try {
      const res = await apiCall('/connection_requests', {}, 'GET', `bearer ${token}`);
      setConnectionsReqs(res.request_list)
      console.log(res.request_list);
    } catch (err) {
      console.error(err);
    }
  }


  const handleAddConnection = async () => {
    try {
      const object = {
        email,
      }
      await apiCall(`/connection_request`, object, 'POST', `bearer ${token}`);
      setOpenSend(false)
    } catch (err) {
      console.error(err);
    }
  }

  
  useEffect(() => {
    handleFetchConnections()
    handleFetchConnectionsRequests()
  }, [])

  if (!connections) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer maxWidth="md" marginTop="0px" sx={{ minHeight: "400px" }}>
      <RowBox justifyContent='space-between' marginBottom='50px'>
        <Typography variant="h3" component="h2">
          Connection
        </Typography>
        <RowBox columnGap='20px'>
          <Badge badgeContent={connectionsReqs.length} color="secondary">
          <Button variant='contained' onClick={handleOpenReq}>Show request</Button>
          </Badge>
          <Button variant='contained' onClick={handleOpenAdd}>Add connection</Button>
        </RowBox>
      </RowBox>
      <ConnectionList connections={connections} />

      {/* ***************** Modal *********************** */}
      <Modal
          open={openReq}
          onClose={handleCloseReq}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Connection Request
            </Typography>
              <ConnectionReqList setConnectionsReqs={setConnectionsReqs} connections={connectionsReqs} />
            <Box display="flex" flexDirection="row-reverse" columnGap='20px'>
              <Button variant='contained' onClick={handleCloseReq}>Back</Button>
            </Box>
          </Box>
        </Modal>
        <Modal
          open={openAdd}
          onClose={handleCloseAdd}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          >
          <Box sx={style} rowGap='50px' display='flex' flexDirection="column">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Connections
            </Typography>
            <TextField id="outlined-basic" value={email} onChange={(e) => setEmail(e.target.value)} label="email" variant="standard" />
            <Box display="flex" flexDirection="row-reverse" columnGap='20px'>
              <Button variant='contained' onClick={handleAddConnection}>Send Invitation</Button>
              <Button variant='outlined' onClick={handleCloseAdd}>Back</Button>
            </Box>
          </Box>
        </Modal>


    </PageContainer>
  );
};

export default ConnectionsScreen;

