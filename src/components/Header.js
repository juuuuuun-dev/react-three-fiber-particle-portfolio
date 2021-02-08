import React from 'react';
import useStore from '../contexts/store';
import Nav from "./Nav";

const Header = () => {
  const headerTitle = useStore(state => state.headerTitle);
  const is404 = useStore(state => state.is404);
  const actions = useStore(state => state.actions);
  const lang = useStore(state => state.lang);
  const defaultLang = useStore(state => state.defaultLang);
  const langUri = lang === defaultLang ? '/' : `/${lang}`
  const H1 = () => {
    if (is404) {
      return (<h1 className='logo'><a href={langUri}>{headerTitle}</a></h1>);
    } else {
      return (<h1 className='logo'><a href={langUri} onClick={handleClick}>{headerTitle}</a></h1>);
    }
  }
  const handleClick = (e) => {
    e.preventDefault();
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
