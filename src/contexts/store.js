import create from 'zustand';
import * as THREE from 'three';
import { useCallback, useEffect } from 'react'
import { getDevice } from '../helpers/UserAgent';
import NavList from '../config/ImageList';
import { useGesture } from 'react-use-gesture'
import variables from '../scss/_variables.scss'

const [ useStore ] = create((set, get) => ({
  appTitle: "JUN KATADA",
  description: "descriptionです",
  pageTitle: "",
  primaryColor: variables.primaryColor,
  loading: false,
  ready: false,
  navList: NavList,
  navListLength:NavList.length,
  navListIndex: 0,
  coefficient: 0.6,
  targetCoefficient: 0.1,
  isScroll: false,
  scrollCallbacks: [],
  windowHeight: window.innerHeight,
  ua: getDevice(),
  showContent: null,
  mutation: {
    mouse: new THREE.Vector2(-250, 50),
    mousePos: new THREE.Vector2(10, 10),
  },
  /**
   * action
   */
  actions: {
    init() {
      set(() => ({
        loading: true,
      }));
      window.onresize = get().actions.onResize;
      window.onpopstate = get().actions.onPopState;
    },
    onResize() {
      set(() => ({ windowHeight: window.innerHeight }));
    },
    // history
    onPopState() {
      const pathname = document.location.pathname;
      if (pathname === '/') {
        set(() => ({ showContent: false }));
      } else {
        set(state => state.showContent = pathname);
      }
    },
    getHasPathNavList() {
      return get().navList.filter(value => value.path);
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
      const showContent = get().showContent;
      if (showContent) {
        if (showContent === pathname) {
          set((state) => ({
            showContent: null,
            pageTitle: '',
            description: state.navList[0].description,
          }));
          window.history.pushState('','', '/');
        } else {
          get().actions.setContents(pathname);
        }
      } else {
        get().actions.setContents(pathname);
      }
    },
    setContents(pathname) {
      const [ content ] = get().navList.filter(val => val.path === pathname);
      set(() => ({
        showContent: pathname,
        pageTitle: content.title,
        description: content.description,
      }));
      window.history.pushState('', '', pathname);
    },
    setReady(val) {
      set(() => ({ ready: val }));
    },
    setPageTitle(val) {

    },
    toggleLoading() {
      set((state) => ({ loading: state.loading = !state.loading }));
    },
    setLoading(val) {
      set(() => ({ loading: val }))
    },
    setCoefficient(d = 3.0) {
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
            get().actions.execCallbacks(index);
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
    execCallbacks(index) {
      set(() => ({ navListIndex: index }));
      get().scrollCallbacks.map(fn => fn(index));
    },
  }
}))

export default useStore