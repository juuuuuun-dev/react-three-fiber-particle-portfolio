// import * as THREE from 'three';
import create from 'zustand';

const [ useStore ] = create(set => ({
  count: 0,
  increase: () => set(state => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 })
}))

export default useStore