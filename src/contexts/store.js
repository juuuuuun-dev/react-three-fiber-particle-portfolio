import create from 'zustand';
import * as THREE from 'three';
import { useCallback, useEffect } from 'react'
import { getDevice } from '../helpers/UserAgent';
import NavList from '../config/ImageList';
import { useGesture } from 'react-use-gesture'
import { upperCaseFirst } from "upper-case-first";


const [ useStore ] = create((set, get) => ({
  appTitle: "KATADA",
  navList: NavList,
  navListLength:NavList.length,
  navListIndex: 0,
  coefficient: 0.6,
  targetCoefficient: 0.1,
  isScroll: false,
  scrollCallbacks: [],
  windowHeight: window.innerHeight,
  ua: getDevice(),
  showContact: false,
  showAbout: false,
  mutation: {
    mouse: new THREE.Vector2(-250, 50),
    mousePos: new THREE.Vector2(10, 10),
  },
  actions: {
    onResize() {
      set(() => ({ windowHeight: window.innerHeight }));
    },
    onPopState() {
      const pathname = document.location.pathname;
      if (pathname === '/') {
        set(() => ({ 
          showContact: false,
          showAbout: false,
        }));
      } else {
        const showName = get().actions.getShowName(pathname);
        if (showName) {
          set(state => state[showName] = true);
        }
      }
    },
    getShowName(pathname) {
      const res = get().navList.filter(value => value.path === pathname);
      if (res) {
        const name = 'show' + upperCaseFirst(pathname.substr(1));
        return name;
      }
    },
    getContentData(title) {
      const res = get().navList.filter(value => value.title === title);
      if (res) {
        return res[0];
      }
    },
    updateMouse({ clientX: x, clientY: y }) {
      get().mutation.mouse.set(x - window.innerWidth / 2, y - window.innerHeight / 2);
      get().mutation.mousePos.set(( x - window.innerWidth / 2 ) * 2 - 1, ( y - window.innerHeight / 2 ) * 2 - 1)
    },
    toggleContents(pathname) {
      const showName = get().actions.getShowName(pathname);
        if (showName) {
          set((state) => {
            if (state[showName]) {
              window.history.pushState('','', '/');
            } else {
              window.history.pushState('', '', pathname);
            }
            set(state => state[showName] = !state[showName]);
          });
        }
    },
    // toggleContact() {
    //   set((state) => {
    //     console.log(state.opendContact);
    //     if (state.opendContact) {
    //       window.history.pushState('','', '/');
    //     } else {
    //       window.history.pushState('','', '/contact');
    //     }
    //     return { opendContact: state.opendContact = !state.opendContact };
    //   });
    // },
    setCoefficient(d) {
      set(() => ({coefficient: d}));
    },
    setScrollCollbacks(fn) {
      set((state) => ({scrollCallbacks: [...state.scrollCallbacks, fn]}));
    },
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

            get().scrollCallbacks.map(fn => fn(index));
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
  }
}))

export default useStore