import React from 'react';
import Paragraph from '../components/Paragraph';
import enAbout from '../config/about/en.json';
import { useTranslation } from 'react-i18next';

export function About() {
  const [t] = useTranslation();
  return (
    <>
      <div className='contents__cover'>
        <p
          className='message'
          dangerouslySetInnerHTML={{
            __html: t(`about.cover`)
          }}
        />
      </div>
      {enAbout['paragraph'].map((value, index) => {
        return <Paragraph value={value} index={index} key={index} />;
      })}
    </>
  );
}
