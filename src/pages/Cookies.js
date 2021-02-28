import React from "react";
import en from '../config/cookie/en';
import Paragraph from '../components/Paragraph';

const Cookies = () => {
  return (
    <>
      <div className="cookie">
        {en['paragraph'].map((value, index) => {
          return <Paragraph value={value} index={index} key={index} prefix="cookie" />;
        })}
      </div>
    </>
  );
}
export default Cookies