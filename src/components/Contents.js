import React from "react";
import ContentWrapper from "./ContentWrapper";
import useStore from "../contexts/store";
import { useSprings, animated } from "react-spring";

export default function Contents() {
  const showContent = useStore(state => state.showContent);
  const actions = useStore(state => state.actions);
  const windowHeight = useStore(state => state.windowHeight);
  const navList = actions.getHasPathNavList();
  const refs = React.useRef(navList.map((_, index) => index))
  const [ springs, setSprings ] = useSprings(navList.length, index => {
    let top = windowHeight + 'px';
    let opacity = 0;
    if (showContent && showContent === navList[index].title) {
      top = 0 + "px";
      opacity = 1;
    }
    return {
      ref: refs[index],
      top,
      opacity,
    }
  });
  /**
   * @todo ここにanimation 
   */
  return (
    <>
    {springs.map((value, index) => {
        return (
          <ContentWrapper contentTitle={navList[index].title} key={index}>
            aa
          </ContentWrapper>
        );
    })}
    </>
  )
}
