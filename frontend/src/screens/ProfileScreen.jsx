import React from 'react';

const ProfileScreen = () => {
  return (
    <>
        This is Profile Screen
        <a className='register-link' href="/home">
            to dashboard page
        </a>

        <a className='register-link' href="/login">
            logout
        </a>
    </>
  );
};

export default ProfileScreen
    ;