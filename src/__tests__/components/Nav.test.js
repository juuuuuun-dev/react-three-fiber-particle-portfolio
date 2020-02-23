import React from 'react';
import { render } from '@testing-library/react'
import Nav from '../../components/Nav';
import navList from '../../config/navList';


describe("Nav", () => {
  it('renders Nav', () => {
    const hasPathNav = navList.filter(value => value.path);
    const { container } = render(<Nav />);
    const navs = container.querySelectorAll('.nav li');
    navs.forEach((value, index) => {
      expect(value.textContent).toBe(hasPathNav[index].title);
    });
  });
});
