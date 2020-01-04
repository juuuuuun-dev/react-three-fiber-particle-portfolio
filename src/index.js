import React from 'react';
import ReactDOM from 'react-dom';
import useStore from './contexts/store';
import { Contact } from "./pages/contact";
import { About } from "./pages/about";
import { Main } from "./pages/main";
import Header from "./components/Header";

import './scss/base.scss';

const Index = () => {
  const appTitle = useStore(state => state.appTitle);
  const actions = useStore((state) => state.actions);
  window.onresize = actions.onResize;
  window.onpopstate = actions.onPopState;
  return (
    <>
      <Header title={appTitle} />
      <Main />
      <About />
      <Contact />
    </>
  );
}

ReactDOM.render(<Index />, document.getElementById('root'));
