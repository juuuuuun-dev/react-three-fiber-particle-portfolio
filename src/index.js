import React from 'react';
import ReactDOM from 'react-dom';
import useStore from './contexts/store';
import { Main } from './pages/main';
import Header from './components/Header';
import Contents from './components/Contents';
import Loader from './components/Loader';
import MetaHead from './components/MetaHead';
import './components/i18n';
import './scss/base.scss';

const Index = () => {
  const actions = useStore(state => state.actions);
  // const navListIndex = useStore(state => state.navListIndex);
  // const navList = actions.getHasPathNavList();

  actions.init();

  // const handleClick = index => {
  //   if (navListIndex !== index + 1) {
  //     actions.execCallbacks(index + 1);
  //     actions.setCoefficient();
  //   }
  //   actions.toggleContents(navList[index].path);
  // };
  return (
    <>
      <MetaHead />
      <Header />
      <Main />
      {/* <IndexFooterText /> */}
      <Contents />
      <Loader />
    </>
  );
};

ReactDOM.render(<Index />, document.getElementById('root'));
