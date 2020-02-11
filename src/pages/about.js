import React from "react";
import cover from "../images/smile_cover.png";
import Paragraph from "../components/Paragraph";
import enAbout from "../config/about/en.json"
export function About() {
  return (
    <>
      <img className="cover" src={cover} alt="i love to create" />
      { enAbout['paragraph'].map((value, index)=> {
        return (
          <Paragraph value={value} index={index} key={index} />
        )
      })}
    </>
  );
}