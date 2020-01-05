import React from "react";
import ContentWrapper from "./ContentWrapper";
import useStore from "../contexts/store";
import { useSprings, animated } from "react-spring";

/**
 * @todo useSprings collback
 * @todo closed contents scroll top
 */
export default function Contents() {
  const showContent = useStore(state => state.showContent);
  const actions = useStore(state => state.actions);
  const windowHeight = useStore(state => state.windowHeight);
  const navList = actions.getHasPathNavList();
  const refs = React.useRef(navList.map((_, index) => index))
  const [ springs, setSprings ] = useSprings(navList.length, index => {
    let top = windowHeight + 'px';
    let opacity = 0;
    if (showContent && showContent === navList[index].path) {
      top = 0 + "px";
      opacity = 1;
    }
    return {
      ref: refs[index],
      top,
      opacity,
    }
  });
  setSprings(index => {
    let top = windowHeight + 'px';
    let opacity = 0;
    if (showContent && showContent === navList[index].path) {
      top = 0 + "px";
      opacity = 1;
    }
    return {
      ref: refs[index],
      top,
      opacity,
    }
  })

  return (
    <>
    {springs.map((value, index) => {
        return (
          <animated.div
            key={index}
            style={{...value}}
            className="contents"
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
