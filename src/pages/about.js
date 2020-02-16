import React from "react";
import cover from "../images/smile_cover.png";
import Paragraph from "../components/Paragraph";
import enAbout from "../config/about/en.json";
import { useTranslation } from 'react-i18next';
import { useTransition, animated } from 'react-spring';

export function About() {
  const [ t ] = useTranslation();
  
  const str = "Hello! My name is Jun Kadada. I'm a frontend & backend developer working for a web production company in Tokyo. He became a web designer in 2005, and has since developed frontends and backends. I feel that the more I do both design and development, the more I like"
  const strArr = Array.from(str);
  const randomStr = strRandom(strArr);
  // console.log(randomStr);
  const [ items, set ] = React.useState(strArr);

  const transitions = useTransition(items, item => item, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  
  return (
    <>
      {/* {transitions.map(({ item, props, key }) => {
        return (
        <animated.span key={key + '_' + item} style={props}>{item}</animated.span>
        )
      })} */}
      { enAbout['paragraph'].map((value, index)=> {
        return (
          <Paragraph value={value} index={index} key={index} />
        )
      })}
    </>
  );
}

const strRandom = (arr) => {
  const t = [];
  const r = [];
  const k = [];
  let len = arr.length;
  let n = len;
  while (n-- > 0) {
    const i = Math.random() * len | 0;
    r[n] = t[i] || arr[i];
    k[i] = i;
    --len;
    t[i] = t[len] || arr[len];
  }
  return {r, k};
}