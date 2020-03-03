import React from 'react';
import { useSprings, animated } from 'react-spring';
import useStore from '../contexts/store';

const Nav = () => {
  // _variables is error in test
  const activeColor = '#d6c792';
  const textColor = '#ffffff';
  const actions = useStore(state => state.actions);
  const showContent = useStore(state => state.showContent);

  const navList = actions.getHasPathNavList();
  const navListIndex = useStore(state => state.navListIndex);
  const refs = React.useRef(navList.map((_, index) => index));
  const springFunc = index => {
    let color = textColor;
    if (showContent && showContent === navList[index].path) {
      color = activeColor;
    }
    return {
      ref: refs[index],
      color
    };
  };
  const [navSprings, setNavSprings] = useSprings(navList.length, index =>
    springFunc(index)
  );
  setNavSprings(index => springFunc(index));

  const handleClick = async index => {
    if (navListIndex !== index + 1) {
      actions.execCallbacks(index + 1);
    }
    actions.toggleContents(navList[index].path);
  };
  return (
    <ul className='nav'>
      {navSprings.map((item, index) => {
        return (
          <animated.li
            data-testid={`link-${navList[index].title}`}
            className='nav__li'
            style={{ ...item }}
            onClick={() => handleClick(index)}
            key={index}
          >
            {navList[index].title}
          </animated.li>
        );
      })}
    </ul>
  );
};

export default Nav;
