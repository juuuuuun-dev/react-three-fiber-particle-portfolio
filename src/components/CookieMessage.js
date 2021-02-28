import React from "react"
import useStore from '../contexts/store';

const CookieMessage = () => {
  const actions = useStore(state => state.actions);
  const handleClick = (e) => {
    e.preventDefault();
    actions.toggleContents('/cookies');
  }
  return (
    <>
      <div className="cookie-message">
        <p className="cookie-message__body">This website use cookies. <a href="/cookie" onClick={(e) => handleClick(e)}>Learn more</a>.</p>
        <p className="cookie-message__btn">OK</p>
      </div>
    </>
  )
}

export default CookieMessage