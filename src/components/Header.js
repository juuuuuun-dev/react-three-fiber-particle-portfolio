import React from 'react';
import useStore from '../contexts/store';
import Nav from "./Nav";

const Header = () => {
  const appTitle = useStore(state => state.appTitle);
  const is404 = useStore(state => state.is404);
  const actions = useStore(state => state.actions);
  const H1 = () => {
    if (is404) {
      return (<h1 className='logo'><a href="/">{appTitle}</a></h1>);
    } else {
      return (<h1 className='logo' onClick={handleClick}>{appTitle}</h1>);
    }
  }
  const handleClick = () => {
    actions.resetIndex();
  };
  return (
    <div className='header'>
      <H1 />
      <Nav />
    </div>
  );
};

export default Header;
