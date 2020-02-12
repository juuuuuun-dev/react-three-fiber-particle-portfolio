import React from "react";
import cover from "../images/smile_cover.png";
import Paragraph from "../components/Paragraph";
import enAbout from "../config/about/en.json";
import { useTranslation } from 'react-i18next';

export function About() {
  const [ t ] = useTranslation();
  return (
    <>
      {/* <img className="cover" src={cover} alt="i love to create" /> */}
      <div className="contents__cover contents__cover--about">
        <h3 className="message" dangerouslySetInnerHTML={{ __html: t('about.cover')}} />
      </div>
      { enAbout['paragraph'].map((value, index)=> {
        return (
          <Paragraph value={value} index={index} key={index} />
        )
      })}
    </>
  );
}