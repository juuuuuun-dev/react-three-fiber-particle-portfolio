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
jest.setTimeout(6000);

describe('App', () => {
  it('loading', async () => {
    const { container, getByTestId } = render(<App />);
    // await wait(() => findByTestId('home-text'));
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
      <App />
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

  it('scroll', async () => {
    const { container } = render(<App />);
    const { result } = renderHook(() => useStore(state => state));
    container.addEventListener('scroll', () => {
      // console.log('scroll')
    });
    waitForDomChange({ container, timeout: 30000 })
      .then(() => {
        console.log('DOM changed!', result.current);
      })
      .catch(err => console.log(`Error you need to deal with: ${err}`));
    act(() => {
      fireEvent.scroll(container, { target: { scrollY: 200 } });
      window.innerWidth = 500;
    });
  });
});
