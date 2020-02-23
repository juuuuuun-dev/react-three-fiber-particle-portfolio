import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { render, getByTestId, getByText } from '@testing-library/react'
import { act } from '@testing-library/react-hooks'
import Contents from '../../components/Contents';
import navList from '../../config/navList';
import en from '../../config/about/en';
import i18n from '../../components/i18n';

// jest.mock('react-spring', () => {
//   return {
//     animated: jest.fn(),
//     useSprings: jest.fn().mockImplementation(() => {
//       return [[1, 2], () => {
//         console.log("springs?")
//         return [
//           {
//             opacity: 1
//           }
//         ]
//       }];
//     }),
//   }
// });

// jest.mock("../../contexts/store", () => jest.fn());
// useStore.mockImplementation((state) => {
//   const [useStore] = create(() => ({
//     windowHeight: 100,
//     showContent: null,
//     actions: {
//       getHasPathNavList() {
//         const navList = [
//           {
//             title: "ABOUT",
//             path: "/about"
//           }
//         ];
//         return navList;
//       }
//     }
//   }));
//   return useStore((state));
// })


describe("Contents", () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders Contents', () => {
    const { container } = render(<Contents />);
    const cover = getByTestId(container, 'cover');
    expect(cover).toBeDefined();
    expect(cover.innerHTML).toBe(en.cover);
  });
});