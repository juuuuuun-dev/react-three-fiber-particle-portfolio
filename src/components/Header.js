import React from 'react';
import useStore from '../contexts/store';
import Nav from "./Nav";
import LoadImage from '../helpers/LoadImage';
import img from '../images/smile.png'

const Header = () => {
  const appTitle = useStore(state => state.appTitle);
  load();
  return (
    <div className='header'>
      <h1 className='logo'>{appTitle}</h1>
      <Nav />
    </div>
  );
};

const load = async () => {
  console.log('image', await LoadImage('https://i.picsum.photos/id/237/200/300.jpg'))

}
export default Header;
