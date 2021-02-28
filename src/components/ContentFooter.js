import React from 'react';
import useStore from '../contexts/store';

const ContentFooter = () => {
  const nowYear = new Date().getFullYear();
  const domain = useStore(state => state.domain);
  const startYear = useStore(state => state.copyrightStartYear);
  const currnetYear = startYear !== nowYear ? `-${nowYear}` : '';
  const lang = useStore(state => state.lang);
  const defaultLang = useStore(state => state.defaultLang);
  const langUri = lang === defaultLang ? '' : `/${lang}`
  const actions = useStore(state => state.actions);
  const cookiePath = '/cookies';

  const handleLink = (e) => {
    e.preventDefault();
    actions.toggleContents(cookiePath);
  }

  return (
    <>
      <div className='contents__footer'>
        <p className="contents__footer-copyright">
        &copy; {startYear}
        {currnetYear} {domain}
        </p>
        <p className="cookie-message__body"><a href={`${langUri}${cookiePath}`} onClick={(e) => handleLink(e)}>Cookies policy</a></p>
      </div>
      
    </>
  );
};

export default ContentFooter;
