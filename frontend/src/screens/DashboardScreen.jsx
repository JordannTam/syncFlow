import React from 'react';
import PageContainer from '../components/PageContainer';

const DashboardScreen = () => {
  return (
    <PageContainer>
        This is dashboard Screen
        <a className='register-link' href="/profile">
            to profile page
        </a>

        <a className='register-link' href="/login">
            logout
        </a>
    </PageContainer>
  );
};

export default DashboardScreen;

