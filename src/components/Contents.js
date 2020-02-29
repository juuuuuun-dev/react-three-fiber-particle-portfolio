import React from 'react';
import ContentWrapper from './ContentWrapper';
import useStore from '../contexts/store';
import { useSprings, animated } from 'react-spring';
import About from '../pages/About';
import { Contact } from '../pages/Contact';

const Contents = () => {
  const showContent = useStore(state => state.showContent);
  const actions = useStore(state => state.actions);
  const windowHeight = useStore(state => state.windowHeight);
  const navList = actions.getHasPathNavList();
  const refs = React.useRef(navList.map(() => React.createRef()));
  const springFunc = index => {
    let top = windowHeight + 'px';
    let opacity = 0;
    if (showContent && showContent === navList[index].path) {
      top = 0 + 'px';
      opacity = 1;
      refs.current[index].current.firstChild.scrollTop = 0;
    }
    return {
      ref: refs[index],
      top,
      opacity,
      config: { mass: 1, tension: 240, friction: 40 }
    };
  };

  const [springs, setSprings] = useSprings(navList.length, index =>
    springFunc(index)
  );
  setSprings(index => springFunc(index));

  const components = key => {
    const list = {
      ABOUT: About,
      CONTACT: Contact
    };
    const Component = list[key];
    return <Component />;
  };
  return (
    <>
      {springs.map((value, index) => {
        return (
          <animated.div
            key={index}
            style={{ ...value }}
            className='contents'
            ref={refs.current[index]}
            data-testid={`content-${navList[index].title}`}
          >
            <ContentWrapper contentTitle={navList[index].title}>
              {components(navList[index].title)}
            </ContentWrapper>
          </animated.div>
        );
      })}
    </>
  );
};

export default Contents;
