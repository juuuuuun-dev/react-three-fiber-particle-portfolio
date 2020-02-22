import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { render } from '@testing-library/react'
import { act } from '@testing-library/react-hooks'
import About from '../../pages/About';
import en from '../../config/about/en';


let container = null;
beforeEach(() => {
  container = document.createElement('div');
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe("About", () => {
  it('renders About', () => {
    act(() => {
      render(<About />, container);
    });
    // const navs = container.querySelectorAll('.nav li');
    // navs.forEach((value, index) => {
    //   expect(value.textContent).toBe(hasPathNav[index].title);
    // });
  });
});