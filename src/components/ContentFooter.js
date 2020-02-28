import React from 'react';
import useStore from '../contexts/store';

const ContentFooter = () => {
  const nowYear = new Date().getFullYear();
  const domain = useStore(state => state.domain);
  const startYear = useStore(state => state.copyrightStartYear);
  const currnetYear = startYear !== nowYear ? `-${nowYear}` : '';
  return (
    <>
      <div className='contents__footer'>
        &copy; {startYear}
        {currnetYear} {domain}
      </div>
    </>
  );
};

export default ContentFooter;
