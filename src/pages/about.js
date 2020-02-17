import React from 'react';
import Paragraph from '../components/Paragraph';
import enAbout from '../config/about/en.json';

export function About() {
  return (
    <>
      {enAbout['paragraph'].map((value, index) => {
        return <Paragraph value={value} index={index} key={index} />;
      })}
    </>
  );
}
