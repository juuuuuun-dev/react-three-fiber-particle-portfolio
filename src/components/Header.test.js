import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import Header from "./Header";
import create from 'zustand';
import useStore from "../contexts/store";

// @todo test

const expectState = {
  appTitle: 'test',
  navList: [
    {
      title: 'test',
    },
    {
      title: 'page1',
      path: '/page1',
    }
  ],
}

// mock巻き上げ対策の為いったんfnに
jest.mock("../contexts/store", () => jest.fn());
useStore.mockImplementation((state) => {
  const [ useStore ] = create(() => (expectState));
  return useStore((state));
})

let container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
})

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
})

it("renders Header", () => {
  act(() => {
    render(<Header />, container);
  });
  expect(container.querySelector(".logo").textContent).toBe(expectState.appTitle);
});
