import React from "react";
import useStore from "../contexts/store";

export default function ContentWrapper({ contentTitle, children }) {
  const actions = useStore(state => state.actions);
  const contentData = actions.getContentData(contentTitle);
  
  return (
    <>
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