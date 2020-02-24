import React from 'react';
import { render, getByTestId, getByTitle } from '@testing-library/react'
import MetaHead from '../../components/MetaHead';

describe("MetaHead", () => {
  it('renders MetaHead', () => {
    const { container, getByText } = render(<MetaHead />);

    // getByTestId(container, 'helmet')
    // getByTitle(container, 'loading...')
    // expect(getByTitle(container, 'loading...')).toBeDefined();
  });
});

