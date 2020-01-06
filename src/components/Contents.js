import React from "react";
import ContentWrapper from "./ContentWrapper";
import useStore from "../contexts/store";
import { useSprings, animated } from "react-spring";

/**
 * @todo useSprings collback
 */
export default function Contents() {
  const showContent = useStore(state => state.showContent);
  const actions = useStore(state => state.actions);
  const windowHeight = useStore(state => state.windowHeight);
  const navList = actions.getHasPathNavList();
  const refs = React.useRef(navList.map(() => React.createRef()))
  const springFunc = (index) => {
    let top = windowHeight + 'px';
    let opacity = 0;
    if (showContent && showContent === navList[index].path) {
      top = 0 + "px";
      opacity = 1;
      refs.current[index].current.firstChild.scrollTop = 0;
    }
    return {
      ref: refs[index],
      top,
      opacity,
    }
  }
  const [ springs, setSprings ] = useSprings(navList.length, index => (springFunc(index)));
  setSprings(index => (springFunc(index)));

  return (
    <>
    {springs.map((value, index) => {
        return (
          <animated.div
            key={index}
            style={{...value}}
            className="contents"
            ref={refs.current[index]}
          >
            <ContentWrapper contentTitle={navList[index].title}>
              <p className="text-lerge">lets create something
              <br />beary great together!</p>
              <p className="text-lerge">lets create something
              <br />beary great together!</p>
              <p className="text-lerge">lets create something
              <br />beary great together!</p>
              <p className="text-lerge">lets create something
              <br />beary great together!</p>
              <p className="text-lerge">lets create something
              <br />beary great together!</p>
              <p className="text-lerge">lets create something
              <br />beary great together!</p>
              <p className="text-lerge">lets create something
              <br />beary great together!</p>
              <p className="text-lerge">lets create something
              <br />beary great together!</p>
              <p className="text-lerge">lets create something
              <br />beary great together!</p>
              <p className="text-lerge">lets create something
              <br />beary great together!</p>
              <p className="text-lerge">lets create something
              <br />beary great together!</p>
              <p className="text-lerge">lets create something
              <br />beary great together!</p>
              <h3>center</h3>
              <p className="text-lerge">lets create something
              <br />beary great together!</p>
              <p className="text-lerge">lets create something
              <br />beary great together!</p>
              <p className="text-lerge">lets create something
              <br />beary great together!</p>
              <p className="text-lerge">lets create something
              <br />beary great together!</p>
              <p className="text-lerge">lets create something
              <br />beary great together!</p>
              <p className="text-lerge">lets create something
              <br />beary great together!</p>
              <p className="text-lerge">lets create something
              <br />beary great together!</p>
              <p className="text-lerge">lets create something
              <br />beary great together!</p>
              <p className="text-lerge">lets create something
              <br />beary great together!</p>
              <p className="text-lerge">lets create something
              <br />beary great together!</p>
              <h3>end</h3>
            </ContentWrapper>
          </animated.div>
        );
    })}
    </>
  )
}
