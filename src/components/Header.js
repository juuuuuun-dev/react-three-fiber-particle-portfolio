import React from 'react';
import useStore from '../contexts/store';

const Header = ({ title }) => {
  const appTitle = useStore(state => state.appTitle);
  const navList = useStore(state => state.navList);

  return (
    <>
      <div className="header">
       <h1 className="logo">{ appTitle }</h1>
        <ul className="nav">
        {navList.map((item, index) => {
          if (item.path) {
            return (
              <li key={index}>{item.title}</li>
            )
          }
          return null;
        })}
        </ul>
      </div>
    </>
  )
}
export default Header;