import React from 'react';
import useStore from '../contexts/store';
import { useSprings, animated } from "react-spring";

const Header = () => {
  const actions = useStore(state => state.actions);
  const appTitle = useStore(state => state.appTitle);
  const showContent = useStore(state => state.showContent);
  const navList = actions.getHasPathNavList();
  const refs = React.useRef(navList.map((_, index) => index))
  const springFunc = (index) => {
    let color = "#ffffff";
    if (showContent && showContent === navList[index].path) {
      color = "#77cec9";
    }
    return {
      ref: refs[index],
      color,
    }
  }
  const [ navSprings, setNavSprings ] = useSprings(navList.length, index => {
    return springFunc(index);
  });
  setNavSprings(index => (springFunc(index)));
  console.log(navSprings);
  return (
    <>
      <div className="header">
        <h1 className="logo">{ appTitle }</h1>
        <ul className="nav">
        {navSprings.map((item, index) => {
          return (
            <animated.li
              style={{ ...item }}
              onClick={() => actions.toggleContents(navList[index].path)}
              key={index}
            >
              {navList[index].title}
            </animated.li>
          )
        })}
        </ul>
      </div>
    </>
  )
}
export default Header;