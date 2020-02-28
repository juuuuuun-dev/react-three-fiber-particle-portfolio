import React from 'react';
import { render } from '@testing-library/react'

import Header from '../../components/Header';
import commonConfig from '../../config/common.json';

it('renders Header', () => {
  const { container } = render(<Header />);
  expect(container.querySelector('.logo').textContent).toBe(
    commonConfig.appTitle
  );
});
