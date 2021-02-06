import React from 'react';
import LoadImage from '../../helpers/LoadImage';
import img from '../../assets/images/smile.png'

describe("LoadImage", () => {
  it('resolve', () => {
    LoadImage(img).then(image => {
      expect(image).toBeDefined();
    })
  });
});