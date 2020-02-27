import React from 'react';
import { render, cleanup, fireEvent, getByText } from '@testing-library/react';
import MoveText from '../components/MoveText';
import { act } from 'react-dom/test-utils';

import Header from '../components/Header';
import Contents from '../components/Contents';
import Main from '../pages/Main';
import Loader from '../components/Loader';
import MetaHead from '../components/MetaHead';
import i18n from '../components/i18n';

import navList from '../config/navList';
import * as THREE from 'three';
import 'jest-canvas-mock';
import '@testing-library/jest-dom/extend-expect';
// three
import 'mutationobserver-shim';

jest.useFakeTimers();
afterEach(() => cleanup());
jest.setTimeout(10000);

describe('Index', () => {
  it('render Index click about', async () => {
    const { container, getByTestId } = render(
      <>
        <MetaHead />
        <Header />
        <Main />
        <Contents />
        <Loader />
      </>
    );
    const loader = getByTestId('loader');
    expect(loader).toHaveStyle('opacity: 0');
    expect(loader).toHaveStyle('z-index: -1');
    const aboutLink = getByTestId('link-ABOUT');
    const aboutContent = getByTestId('content-ABOUT');
    expect(aboutLink).toHaveStyle('color: rgb(255, 255, 255)');
    expect(aboutContent).toBeDefined();
    expect(aboutContent).toHaveStyle(`top: ${window.innerHeight}px`);
    expect(aboutContent).toHaveStyle('opacity: 0');

    fireEvent.click(aboutLink);
    const callback = jest.fn();

    console.log('click');
    jest.useFakeTimers();
    setTimeout(() => {
      console.log("Time's up -- stop!");
      fireEvent.click(aboutLink);
      expect(aboutLink).toHaveStyle('color: rgb(255, 255, 255)');
    }, 1000);
    jest.advanceTimersByTime(1000);

    console.log('nuketa');

    console.log('second click');
    // fireEvent.click(getByText(aboutLink, 'ABOUT'));

    // expect(aboutContent).toHaveStyle(`top: 0px`);

    // expect(aboutContent).toHaveStyle('opacity: 1');
  });
});
