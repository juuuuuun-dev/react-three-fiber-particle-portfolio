import React, { useMemo, useState, useContext } from 'react';
import { Canvas, useThree, useFrame } from 'react-three-fiber';
import { srcData } from '../config/srcData';
import AppContext from '../contexts/AppContext';

export default function Particle() {
  const value = useContext(AppContext);
  console.log(value)
  return (
    <>
    {value}
    </>
  )
}