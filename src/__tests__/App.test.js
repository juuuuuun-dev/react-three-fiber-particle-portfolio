import React from 'react';
import {
  render,
  cleanup,
  fireEvent,
  getByText,
  wait,
  waitForElement,
  getByTitle,
  waitForDomChange
} from '@testing-library/react';
import MoveText from '../components/MoveText';
import App from '../App';
import { act, renderHook } from '@testing-library/react-hooks';
// import { act } from 'react-dom/test-utils';
import TestRenderer from 'react-test-renderer';

import Header from '../components/Header';
import Contents from '../components/Contents';
import Main from '../pages/Main';
import Loader from '../components/Loader';
import MetaHead from '../components/MetaHead';
import useStore from '../contexts/store';
import i18n from '../components/i18n';

import navList from '../config/navList';
import * as THREE from 'three';
import 'jest-canvas-mock';
import '@testing-library/jest-dom/extend-expect';
// three
import 'mutationobserver-shim';

jest.useFakeTimers();
afterEach(() => cleanup());
jest.setTimeout(100000);

describe('App', () => {
  it('loading', async () => {
    const { container, getByTestId } = render(
      <>
        <App />
      </>
    );
    const { result } = renderHook(() => useStore(state => state));
    expect(result.current.ready).toBe(false);
    expect(result.current.loading).toBe(true);
    expect(result.current.showContent).toBe(null);
    const loader = getByTestId('loader');
    expect(loader).toHaveStyle('opacity: 1');
    expect(loader).toHaveStyle('z-index: 101');
  });

  it('click about', async () => {
    const { container, getByTestId } = render(
      <>
        <App />
      </>
    );
    const { result } = renderHook(() => useStore(state => state));
    const aboutLink = getByTestId('link-ABOUT');
    const aboutContent = getByTestId('content-ABOUT');
    expect(aboutLink).toHaveStyle('color: rgb(255, 255, 255)');
    expect(aboutContent).toBeDefined();
    expect(aboutContent).toHaveStyle(`top: ${window.innerHeight}px`);
    expect(aboutContent).toHaveStyle('opacity: 0');

    act(() => {
      fireEvent.click(aboutLink);
    });

    expect(document.location.pathname).toBe('/about');
    expect(result.current.showContent).toBe('/about');

    // close
    act(() => {
      fireEvent.click(aboutLink);
    });
    expect(document.location.pathname).toBe('/');
    expect(result.current.showContent).toBe(null);
  });

  it('resize', async () => {
    const { container, findByText, getByTestId } = render(
      <>
        <App />
      </>
    );
    const { result } = renderHook(() => useStore(state => state));
    act(() => {
      fireEvent.scroll(container, { target: { scrollY: 200 } });
    });

    const loader = getByTestId('loader');
    const items = await findByText(/complete/);
    await wait(() => getByTitle(container, 'complete'), { timeout: 50000 });
    // await expect(loader).toHaveStyle('opacity: 0');

    // expect(items).toHaveLength(10);

    waitForDomChange({ container, timeout: 30000 })
      .then(() => {
        console.log('DOM changed!', result.current);
      })
      .catch(err => console.log(`Error you need to deal with: ${err}`));

    // const { act } = TestRenderer;
    // act(() => {
    //   window.onresize = () => {
    //     window.innerWidth = 500;
    //     console.log(window.innerWidth);
    //   };
    // });
  });

  // it('render Index loader test', async () => {
  //   const { container, getByTestId } = render(
  //     <>
  //       <MetaHead />
  //       <Header />
  //       <Main />
  //       <Contents />
  //       <Loader />
  //     </>
  //   );
  //   const { result } = renderHook(() => useStore(state => state));
  //   expect(result.current.ready).toBe(false);
  //   expect(result.current.loading).toBe(false);
  //   expect(result.current.showContent).toBe(null);

  //   const loader = getByTestId('loader');
  //   expect(loader).toHaveStyle('opacity: 0');
  //   expect(loader).toHaveStyle('z-index: -1');
  //   global.innerWidth = 500;
  //   console.log(window.innerWidth);

  //   // act(() => {
  //   //   global.dispatchEvent(new Event('resize'));
  //   // });
  //   const { act } = TestRenderer;
  //   act(() => {
  //     window.onresize = () => {
  //       window.innerWidth = 500;
  //       console.log(window.innerWidth);
  //     };
  //   });

  //   // expect(document.location.pathname).toBe('/');
  //   // expect(result.current.showContent).toBe(null);
  // });

  // it('render Index click about', async () => {
  //   const { container, getByTestId } = render(
  //     <>
  //       <MetaHead />
  //       <Header />
  //       <Main />
  //       <Contents />
  //       <Loader />
  //     </>
  //   );
  //   const { result } = renderHook(() => useStore(state => state));

  //   const aboutLink = getByTestId('link-ABOUT');
  //   const aboutContent = getByTestId('content-ABOUT');
  //   expect(aboutLink).toHaveStyle('color: rgb(255, 255, 255)');
  //   expect(aboutContent).toBeDefined();
  //   expect(aboutContent).toHaveStyle(`top: ${window.innerHeight}px`);
  //   expect(aboutContent).toHaveStyle('opacity: 0');

  //   act(() => {
  //     fireEvent.click(aboutLink);
  //   });
  //   expect(document.location.pathname).toBe('/about');
  //   expect(result.current.showContent).toBe('/about');

  //   // close
  //   act(() => {
  //     fireEvent.click(aboutLink);
  //   });
  //   expect(document.location.pathname).toBe('/');
  //   expect(result.current.showContent).toBe(null);
  // });

  // it('render Index scroll', async () => {
  //   const { result } = renderHook(() => useStore(state => state));

  //   act(() => {
  //     result.current.actions.init();
  //     // fireEvent.scroll(container, { target: { scrollY: 200 } });
  //   });
  //   const { container, getByTestId } = render(
  //     <>
  //       <MetaHead />
  //       <Header />
  //       <Main />
  //       <Contents />
  //       <Loader />
  //     </>
  //   );
  //   waitForDomChange({ container, timeout: 30000 })
  //     .then(() => console.log('DOM changed!', result.current))
  //     .catch(err => console.log(`Error you need to deal with: ${err}`));

  //   const onScroll = jest.fn();
  //   // const [usernameElement, passwordElement] = await waitForElement(
  //   //   () => [console.log(result.current.navListIndex)],
  //   //   { container, timeout: 30000 }
  //   // );

  //   // expect(result.current.navListIndex).toBe(0);

  //   // console.log(wait);
  //   // wait(() => {
  //   //   console.log(result.current.navListIndex);
  //   //   expect(result.current.actions.useYScroll).toHaveBeenCalled();
  //   //   console.log(result.current);
  //   //   console.log('in wait');
  //   // }, 10000);
  // });
});
