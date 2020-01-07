import React from 'react';
import useStore from '../contexts/store';
import { useSpring, useSprings, animated } from "react-spring";

const Header = () => {
  const actions = useStore(state => state.actions);
  const appTitle = useStore(state => state.appTitle);
  const showContent = useStore(state => state.showContent);
  const navList = actions.getHasPathNavList();
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
  // @todo header low height
  setNavSprings(index => (springFunc(index)));
  const headerSpring = useSpring({
    backdropFilter:  showContent ? "blur(1px)" : 'blur(0px)',
    backgroundColor: showContent ? "rgba(67,70,90, .7)" : "rgba(67,70,90, .0)",
  });
  return (
    <>
      <animated.div ref={headerRef} className="header" style={{ ...headerSpring }}>
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
      </animated.div>
    </>
  )
}
export default Header;