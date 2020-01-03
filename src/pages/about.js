import React from "react";
import useStore from "../contexts/store";
import { useSpring, animated } from 'react-spring';

export function About() {
  const showAbout = useStore(state => state.showAbout);
  const windowHeight = useStore(state => state.windowHeight);
  const actions = useStore(state => state.actions);
  
  const styles = useSpring({
    top: showAbout ? '0px' : windowHeight + 'px',
    // visibility: showContact ? 'visible' : 'hidden',
  }, [windowHeight])
  return (
    <>
    <animated.div className="contents contents__about" style={{ ...styles }}>
      <div className="contents-inner">
        <h2>ABOUT</h2>
        <p className="btn" onClick={() => actions.toggleContents('/about')}>CLOSE</p>
        <p className="text-lerge">lets create
something
beary great
together!</p>
      </div>
    </animated.div>
    </>
  );
}