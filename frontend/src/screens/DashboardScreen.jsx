import React from 'react';

const DashboardScreen = () => {
  return (
    <>
        This is dashboard Screen
        <a className='register-link' href="/profile">
            to profile page
        </a>

        <a className='register-link' href="/login">
            logout
        </a>
    </>
  );
};

export default DashboardScreen;