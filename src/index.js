import React from 'react';
import ReactDOM from 'react-dom';
import useStore from './contexts/store';
import { Main } from "./pages/main";
import Header from "./components/Header";
import Contents from "./components/Contents";
import Loader from "./components/Loader";
import MetaHead from "./components/MetaHead";

import './scss/base.scss';

const Index = () => {
  const actions = useStore((state) => state.actions);
  actions.init();
  return (
    <>
      <MetaHead />
      <Header />
      <Main />
      <Contents />
      <Loader />
    </>
  );
}

ReactDOM.render(<Index />, document.getElementById('root'));
