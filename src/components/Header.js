import React from 'react';
import useStore from '../contexts/store';
import { useSpring, useSprings, animated } from "react-spring";
import variables from '../scss/_variables.scss'


const Header = () => {
  const primaryColor = variables.primaryColor;
  const actions = useStore(state => state.actions);
  const appTitle = useStore(state => state.appTitle);
  const showContent = useStore(state => state.showContent);
  const navList = actions.getHasPathNavList();
  const navListIndex = useStore(state => state.navListIndex);
  const headerRef = React.useRef();
  const refs = React.useRef(navList.map((_, index) => index));
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
  const [ navSprings, setNavSprings ] = useSprings(navList.length, index => (springFunc(index)));
  setNavSprings(index => (springFunc(index)));
  const headerSpring = useSpring({
    backdropFilter:  showContent ? "blur(3px)" : 'blur(0px)',
    backgroundColor: showContent ? `rgba(54, 59, 78, .7)` : `rgba(54, 59, 78, .0)`,
  });
  const handleClick = (index) => {
    if (navListIndex !== index + 1) {
      actions.execCallbacks(index + 1);
      actions.setCoefficient();
    }
    actions.toggleContents(navList[index].path);
  }
  return (
    <>
      <animated.div ref={headerRef} className="header" style={{ ...headerSpring }}>
        <h1 className="logo">{ appTitle }</h1>
        <ul className="nav">
        {navSprings.map((item, index) => {
          return (
            <animated.li
              style={{ ...item }}
              onClick={() => handleClick(index)}
              key={index}
            >
              {navList[index].title}
            </animated.li>
          )
        })}
        </ul>
      </animated.div>
    </>
  )
}
export default Header;