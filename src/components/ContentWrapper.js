import React from "react";
import useStore from "../contexts/store";
import { useTranslation } from 'react-i18next';
import { useSpring, useSprings, animated } from "react-spring";

export default function ContentWrapper({ contentTitle, children }) {
  const lang = useStore(state => state.lang);
  const languages = useStore(state => state.languages);
  const refs = React.useRef(languages.map((_, index) => index));
  const actions = useStore(state => state.actions);
  const contentData = actions.getContentData(contentTitle);
  const { i18n } = useTranslation();

  const springFunc = (index) => {
    let color = "#ffffff";
    if (lang && lang === languages[index]) {
      color = "#77cec9";
    }
    return {
      ref: refs[index],
      color,
    }
  }
  const [ langSprings, setLangSprings ] = useSprings(languages.length, index => (springFunc(index)));
  
  setLangSprings(index => (springFunc(index)));
  

  React.useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);
  return (
    <>
      <div className="scroll-area">
        <div className="contents__inner">
          <h2 className="contents__title">{contentData.title} <span className="lang-change">
          {langSprings.map((item, index) => {
            return (
              <animated.span
                key={index}
                style={{ ...item }}
                onClick={() => actions.setLang(languages[index])}
              >
                { languages[index].toUpperCase() }
              </animated.span>
              // <span onClick={() => setLang('ja')}>JP</span>
            )
          })}
          
          </span></h2>
          
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