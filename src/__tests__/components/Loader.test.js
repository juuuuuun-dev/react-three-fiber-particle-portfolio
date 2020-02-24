import React from 'react';
import { render, getByAltText } from '@testing-library/react'
import Loader from '../../components/Loader';

describe("Loader", () => {
  it('renders Loader', () => {
    const { container } = render(<Loader />);
    expect(getByAltText(container, 'loading...')).toBeDefined();
  });
});

