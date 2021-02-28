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
        <p className="cookie-message__body">This website use cookies. <a onClick={(e) => handleClick(e)}>Learn more.</a></p>
        <a className="coolie-message__btn">OK</a>
      </div>
    </>
  )
}

export default CookieMessage