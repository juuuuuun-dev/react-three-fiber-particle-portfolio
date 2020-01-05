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
    from: {
      top: windowHeight + 'px',
      opacity: 0,
    },
    to: {
      top: isShow ? '0px' : windowHeight + 'px',
      opacity: isShow ? 1 : 0,
    }
  }, [windowHeight])
  return (
    <>
        {/* <animated.div className="contents contents__about" style={{ ...styles }}> */}
          <div className="scroll-area">
            <div className="contents__inner">
              <h2 className="contents__title">{contentData.title}</h2>
              <p className="back-btn" onClick={() => actions.toggleContents(contentData.path)}>BACK</p>
              <div>
                {children}
              </div>
              <div className="contents__footer"></div>
            </div>
          </div>
    </>
  )
}