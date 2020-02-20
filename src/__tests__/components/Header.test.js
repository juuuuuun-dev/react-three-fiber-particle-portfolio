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
  const action = () => {};
  const hasPathNav = navList.filter(value => value.path);

  act(() => {
    render(<Header navList={hasPathNav} onClick={action} />, container);
  });
  expect(container.querySelector('.logo').textContent).toBe(
    commonConfig.appTitle
  );
  container.querySelectorAll('.nav li').forEach((value, index) => {
    expect(value.textContent).toBe(hasPathNav[index].title);
  });
});
