import React from 'react';
import ReactDOM from 'react-dom';
import useStore from './contexts/store';
import { Main } from "./pages/main";
import Header from "./components/Header";
import Contents from "./components/Contents";
import './scss/base.scss';

/**
 * @todo reloaded showContents set
 * @todo make init function
 */
const Index = () => {
  const actions = useStore((state) => state.actions);
  window.onresize = actions.onResize;
  window.onpopstate = actions.onPopState;
  return (
    <>
      <Header />
      <Main />
      <Contents />
    </>
  );
}

ReactDOM.render(<Index />, document.getElementById('root'));
