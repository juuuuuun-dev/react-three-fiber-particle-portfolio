import React from 'react';
import useStore from '../contexts/store';

export default function () {
  const navListIndex = useStore(state => state.navListIndex);

  console.log("test");
  return (
    <>
      <mesh></mesh>
    </>
  )
}