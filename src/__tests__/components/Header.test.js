import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import Header from '../../components/Header';
import commonConfig from '../../config/common.json';
import navList from '../../config/navList';
// import { renderHook, act } from '@testing-library/react-hooks';

let container = null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('renders Header', () => {
  act(() => {
    render(<Header />, container);
  });
  expect(container.querySelector('.logo').textContent).toBe(
    commonConfig.appTitle
  );
});
