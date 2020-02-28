import React from 'react';
import { getDevice } from '../../helpers/UserAgent';
import { clear, mockUserAgent } from 'jest-useragent-mock'

describe("UserAgent", () => {
  it('iPhone', () => {
    const agent = 'iPhone'
    mockUserAgent(agent);
    expect(getDevice()).toEqual('sp')
  });
  it('Android Mobile', () => {
    const agent = 'Android Mobile'
    mockUserAgent(agent);
    expect(getDevice()).toEqual('sp')
  });
  it('iPad', () => {
    const agent = 'iPad'
    mockUserAgent(agent);
    expect(getDevice()).toEqual('tablet')
  })
  it('Android Tablet', () => {
    const agent = 'Android Tablet'
    mockUserAgent(agent);
    expect(getDevice()).toEqual('tablet')
  })
  it('pc', () => {
    const agent = 'pc'
    mockUserAgent(agent);
    expect(getDevice()).toEqual('pc');
  })
});
