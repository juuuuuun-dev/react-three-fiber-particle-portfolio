import React from "react"
import useStore from '../contexts/store';
import { get, set } from 'local-storage';

const CookieMessage = () => {
  const actions = useStore(state => state.actions);
  const okCookieKey = "ok_cookie";
  const cookiePath = '/cookies';
  const okCookie = get(okCookieKey);
  const [ok, setOK] = React.useState(okCookie);


  const handleLink = (e) => {
    e.preventDefault();
    actions.toggleContents(cookiePath);
  }

  const handleOK = () => {
    set(okCookieKey, 1)
    setOK(1)
  }

  return (
    <>
    {!ok &&
      <div className="cookie-message">
        <p className="cookie-message__body">This website use cookies. <a href={`${cookiePath}`} onClick={(e) => handleLink(e)}>Learn more</a>.</p>
        <p className="cookie-message__btn" onClick={handleOK}>OK</p>
      </div>
    }
      
    </>
  )
}

export default CookieMessage