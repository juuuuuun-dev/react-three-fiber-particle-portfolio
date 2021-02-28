import React from 'react';
import { render, getByTestId, getByText, fireEvent } from '@testing-library/react'
import Contents from '../../components/Contents';
import enAbout from '../../config/about/en';
import jaAbout from '../../config/about/ja';
import i18n from '../../components/i18n';



describe("Contents", () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders language default About Contents', () => {
    const { container } = render(<Contents />);
    const contentAbout = getByTestId(container, 'content-ABOUT');
    testParagraph(contentAbout, enAbout.paragraph);
  });
  it("language change JA About Contents", () => {
    const { container } = render(<Contents />);
    const contentAbout = getByTestId(container, 'content-ABOUT');
    fireEvent.click(getByText(contentAbout, "JP"));
    testParagraph(contentAbout, jaAbout.paragraph);
  })
  const testParagraph = (contentAbout, paragraph) => {
    paragraph.map((value) => {
      expect(getByText(contentAbout, value.title)).toBeDefined();
      expect(contentAbout.innerHTML).toMatch(value.title);
      if (value.description) {
        expect(contentAbout.innerHTML).toMatch(value.description);
      }
      if (value.quotes) {
        value.quotes.map((quote) => {
          expect(contentAbout.innerHTML).toMatch(quote.title);
          quote.items.map(item => {
            expect(contentAbout.innerHTML).toMatch(item.body);
            expect(contentAbout.innerHTML).toMatch(item.author);
          })
        })
      }
    })
  }
});