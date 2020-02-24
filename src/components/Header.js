import React from 'react';
import useStore from '../contexts/store';
import Nav from "./Nav";

const Header = () => {
  const appTitle = useStore(state => state.appTitle);
  return (
    <div className='header'>
      <h1 className='logo'>{appTitle}</h1>
      <Nav />
    </div>
  );
};

export default Header;
