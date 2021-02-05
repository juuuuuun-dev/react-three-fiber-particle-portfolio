import React from 'react';
import { render, } from '@testing-library/react'
import { act } from '@testing-library/react-hooks'
import About from '../../pages/About';
import "@testing-library/jest-dom/extend-expect";
import en from '../../config/about/en';
import i18n from '../../components/i18n';


describe("About", () => {
  it('Successful render title', () => {
    const { container, getByTestId } = render(<About />);
    for (let i = 0; i < en.paragraph.length; i++) {
      expect(getByTestId(`about-paragraph-${i}`).innerHTML).toMatch(en.paragraph[i].title);
    }
  });
});