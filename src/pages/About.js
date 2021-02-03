import React from 'react';
import Paragraph from '../components/Paragraph';
import enAbout from '../config/about/en';
// import { useTranslation } from 'react-i18next';

const About = () => {
  // const [t] = useTranslation();
  return (
    <>
      {/* <div className='contents__cover'>
        <p
          data-testid="cover"
          className='message'
          dangerouslySetInnerHTML={{
            __html: t(`about.cover`)
          }}
        />
      </div> */}
      {enAbout['paragraph'].map((value, index) => {
        return <Paragraph value={value} index={index} key={index} />;
      })}
    </>
  );
}

export default About;