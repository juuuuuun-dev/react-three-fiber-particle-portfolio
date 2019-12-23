// import * as THREE from 'three';
import create from 'zustand';
import { useCallback, useEffect } from 'react'
import { getDevice } from '../helpers/UserAgent';
import NavList from '../config/ImageList';
import { useGesture } from 'react-use-gesture'


const [ useStore ] = create((set, get) => ({
  navList: NavList,
  navListLength:NavList.length,
  navListIndex: 0,
  coefficient: 0.6,
  targetCoefficient: 0.1,
  isScroll: false,
  scrollCallbacks: [],
  ua: getDevice(),
  actions: {
    setCoefficient(d) {
      set(() => ({coefficient: d}));
    },
    setScrollCollbacks(fn) {
      set((state) => ({scrollCallbacks: [...state.scrollCallbacks, fn]}));
    },
    // @todo 差分y stateに setTimeoutも
    useYScroll(props) {
      let y = 0;
      const fn = useCallback(
        ({ xy: [, cy], previous: [, py] }) => {
          if (get().isScroll) return;
          let index = get().navListIndex;
          const diffY = cy - py;
          if (diffY > 10 || diffY < -10) {
            set(() => ({ isScroll: true }));
            if (diffY < 0) {
              index -=1;
              if (index < 0) {
                index += get().navListLength;
              }
            } else {
              index = (index + 1) % get().navListLength;
            }
            set(() => ({ navListIndex: index }));
            set(() => ({ coefficient: 3.0 }));

            get().scrollCallbacks.map(fn => fn());
            setTimeout(() => {
              set(() => ({ isScroll: false }))
            }, 500);
          }
          return cy - py;
        }, []
      )
      const bind = useGesture({ onWheel: fn, onDrag: fn }, props)
      useEffect(() => props && props.domTarget && bind(), [props, bind]);
      return [ y ];
    },
    onScroll(e) {
      if (get().isScroll) return;
      let index = get().navListIndex;
      const deltaY = e.deltaY;
      set(() => ({ isScroll: true }))
      if (deltaY < 0) {
        index -=1;
        if (index < 0) {
          index += get().navListLength;
        }
      } else {
        index = (index + 1) % get().navListLength;
      }
      set(() => ({ navListIndex: index }));
      setTimeout(() => {
        set(() => ({ isScroll: false }))
      }, 500);
    }
  }
}))

export default useStore