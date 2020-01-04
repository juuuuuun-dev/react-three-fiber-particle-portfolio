import React from "react";
import useStore from "../contexts/store";
import { useSpring, animated } from 'react-spring';

export default function ContentWrapper({ contentTitle, children }) {
  const actions = useStore(state => state.actions);
  const contentData = actions.getContentData(contentTitle);
  const showName = actions.getShowName(contentData.path);
  const isShow = useStore(state => state[showName]);
  const windowHeight = useStore(state => state.windowHeight);
  
  const styles = useSpring({
    top: isShow ? '0px' : windowHeight + 'px',
    opacity: isShow ? 1 : 0,
  }, [windowHeight])
  let btnStyle = {
    top: windowHeight - 120 + 'px',
  }
  if (isShow) {
    window.addEventListener("wheel", (e) => {
      console.log(e.clientY - e.offsetY);
      btnStyle = {
        // top: windowHeight - e.clientY + 'px',
        top:  e.clientY - e.offsetY + 'px',
      }
    })
  }

  return (
    <>
      <div className="content-wrapper">
        <animated.div className="contents contents__about" style={{ ...styles }}>
          <div className="contents__inner">
            <h2 className="contents__title">{contentData.title}</h2>
            <p className="back-btn" style={{ ...btnStyle }} onClick={() => actions.toggleContents(contentData.path)}>BACK</p>
            {children}
          </div>
        </animated.div>
      </div>
    </>
  )
}