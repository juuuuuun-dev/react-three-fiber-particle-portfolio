import React from 'react';
import { useSprings, animated } from 'react-spring';
import useStore from '../contexts/store';
import variables from '../scss/_variables.scss';

const Nav = () => {
  const activeColor = variables.activeColor;
  const textColor = variables.textColor;
  const actions = useStore(state => state.actions);
  const { showContent } = useStore(state => ({
    showContent: state.showContent
  }));
  console.log('rerender', { showContent });

  const navList = actions.getHasPathNavList();
  const navListIndex = useStore(state => state.navListIndex);
  const refs = React.useRef(navList.map((_, index) => index));
  const springFunc = (index, show) => {
    let color = '#ffffff';
    // const currentShow = show || showContent;
    if (show && show === navList[index].path) {
      color = activeColor;
    }
    console.log('spring', { show });

    return {
      color
    };
  };
  const [navSprings, setNavSprings] = useSprings(navList.length, index =>
    springFunc(index, showContent)
  );

  const handleClick = async index => {
    if (navListIndex !== index + 1) {
      actions.execCallbacks(index + 1);
      actions.setCoefficient();
    }
    const show = await actions.toggleContents(navList[index].path);
    console.log('handleclick', show);
    setNavSprings(index => springFunc(index, show));
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
