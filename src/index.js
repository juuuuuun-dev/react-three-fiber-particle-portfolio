import React from 'react';
import ReactDOM from 'react-dom';
import TagManager from 'react-gtm-module'
import App from './App';

const Index = () => {
  return (
    <>
      <App />
    </>
  );
};
// GTM setting .env
if (process.env.REACT_APP_GTM) {
  const tagManagerArgs = {
    gtmId: process.env.REACT_APP_GTM
  }
  TagManager.initialize(tagManagerArgs)
}
ReactDOM.render(<Index />, document.getElementById('root'));
