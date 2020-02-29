import React from 'react';
import useStore from './contexts/store';
import Main from './pages/Main';
import Header from './components/Header';
import Contents from './components/Contents';
import Loader from './components/Loader';
import MetaHead from './components/MetaHead';
import './components/i18n';
import './scss/base.scss';

const App = () => {
  const actions = useStore(state => state.actions);
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
};

export default App;
