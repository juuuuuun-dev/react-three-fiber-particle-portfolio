import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { render } from '@testing-library/react'
import { act } from '@testing-library/react-hooks'
import Nav from '../../components/Nav';
import navList from '../../config/navList';


let container = null;
beforeEach(() => {
  container = document.createElement('div');
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});
describe("Nav", () => {
  it('renders Nav', () => {
    const hasPathNav = navList.filter(value => value.path);
    act(() => {
      render(<Nav />, container);
    });
    const navs = container.querySelectorAll('.nav li');
    navs.forEach((value, index) => {
      expect(value.textContent).toBe(hasPathNav[index].title);
    });
  });
});
