import React from "react";
import common from "../config/contact/common.json"

const Contact = () => {
  return (
    <>
      <div className="contact">
        <ul className="contact-links">
          <li className="contact-links__item"><a href={`mailto:${common.email}`}>Email</a></li>
          <li className="contact-links__item"><a href={`${common.github}`} target="_blank" rel="noopener noreferrer">GitHub</a></li>
          {/* <li className="contact-links__item"><a href={`${common.blog}`} target="_blank" rel="noopener noreferrer">Blog</a></li> */}
        </ul>
      </div>
    </>
  );
}
export default Contact