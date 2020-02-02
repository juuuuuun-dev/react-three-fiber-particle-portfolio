import React from "react"
import useStore from "../contexts/store"
import { useTransition, animated } from "react-spring"

const IndexFooterText = () => {
  const navListIndex = useStore(state => state.navListIndex);
  const transitions = useTransition(navListIndex === 0, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: [ { opacity: 0}, {visibility: "hidden"} ]
  });
    return transitions.map(({ item, key, props }) => item&& <animated.p key={key} style={props} className="index-footer-text">“Mistakes are the portals of discovery”<br />James Joyce</animated.p>
  )
}

export default IndexFooterText;