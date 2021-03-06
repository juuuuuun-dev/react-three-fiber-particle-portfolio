import React from 'react';
import useStore from '../contexts/store';
import { useTranslation } from 'react-i18next';
import { useSprings, animated } from 'react-spring';
import ContentFooter from './ContentFooter';
import variables from '../assets/scss/_variables.scss';

export default function ContentWrapper({ contentTitle, children }) {
  const lang = useStore(state => state.lang);
  const languages = useStore(state => state.languages);
  const refs = React.useRef(languages.map((_, index) => index));
  const actions = useStore(state => state.actions);
  const contentData = actions.getContentData(contentTitle);
  const { i18n } = useTranslation();
  const textColor = variables.textColor;
  const activeColor = variables.activeColor;
  const springFunc = index => {
    let color = textColor;
    if (lang && lang === languages[index].id) {
      color = activeColor;
    }
    const res = {
      ref: refs[index],
      color
    }
    return res;
  };
  const [langSprings, setLangSprings] = useSprings(languages.length, index =>
    springFunc(index)
  );
  setLangSprings(index => springFunc(index));
  React.useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  const toggleContents = (e, path) => {
    e.preventDefault()
    actions.toggleContents(path)
  }

  return (
    <>
      <div className='scroll-area'>
        <div className='contents__inner'>
          <h2 className='contents__title'>
            {contentData.title}{' '}
            <span className='lang-change'>
              {langSprings.map((item, index) => {
                return (
                  <animated.span
                    key={index}
                    style={{ ...item }}
                    onClick={() =>
                      actions.setLang(languages[index].id, contentData.path)
                    }
                  >
                    {languages[index].name}
                  </animated.span>
                );
              })}
            </span>
          </h2>

          <a
            href="/"
            className='back-btn'
            onClick={(e) => toggleContents(e, contentData.path)}
          >
            BACK
          </a>
          <div>{children}</div>
          <ContentFooter />
        </div>
      </div>
    </>
  );
}
