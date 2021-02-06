import React from 'react';
import useStore from '../contexts/store';
//https://icons8.com/preloaders/
import loaderSVG from '../assets/images/loader.gif';

import { useSpring, animated } from 'react-spring';


const Loader = () => {
  const loading = useStore(state => state.loading);
  const styles = useSpring({
    opacity: loading ? 1 : 0,
    zIndex: loading ? 101 : -1,
    config: { duration: 250 }
  });
  return (
    <>
      <animated.div
        data-testid='loader'
        style={{ ...styles }}
        className='loader-container'
      >
        <div className='loader-container__inner'>
          <img
            className='loader-img'
            title={loading ? 'loading' : 'complete'}
            src={loaderSVG}
            alt='loading...'
          ></img>
        </div>
      </animated.div>
    </>
  );
};

export default Loader;
