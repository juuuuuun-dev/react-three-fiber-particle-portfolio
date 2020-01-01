import React from "react";
import useStore from "../contexts/store";
import { useSpring, animated } from 'react-spring';

export function Contact() {
  const showContact = useStore(state => state.showContact);
  const windowHeight = useStore(state => state.windowHeight);
  const actions = useStore(state => state.actions);
  
  const styles = useSpring({
    top: showContact ? '0px' : -windowHeight + 'px',
    // visibility: showContact ? 'visible' : 'hidden',
  }, [windowHeight])
  return (
    <>
    <animated.div className="contents contents-contact" style={{ ...styles }}>
      <div className="contents-inner">
        <h2>CONTACT</h2>
        <p className="btn" onClick={() => actions.toggleContents('/contact')}>CLOSE</p>
        <p className="text-lerge">lets create
something
beary great
together!</p>
      </div>
    </animated.div>
    </>
  );
}