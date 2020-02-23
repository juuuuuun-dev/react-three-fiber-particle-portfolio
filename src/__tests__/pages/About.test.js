import React from 'react';
import { render, getByTestId, getByText } from '@testing-library/react'
import { act } from '@testing-library/react-hooks'
import About from '../../pages/About';
import "@testing-library/jest-dom/extend-expect";
import en from '../../config/about/en';
import i18n from '../../components/i18n';


describe("About", () => {
  it('renders About', () => {
    const { container } = render(<About />);
    const cover = getByTestId(container, 'cover');
    expect(cover).toBeDefined();
    expect(cover.innerHTML).toBe(en.cover);
  });
});