import create from 'zustand';
import * as THREE from 'three';
import { useCallback, useEffect } from 'react'
import { getDevice } from '../helpers/UserAgent';
import NavList from '../config/ImageList';
import { useGesture } from 'react-use-gesture'
import variables from '../scss/_variables.scss'

const [ useStore ] = create((set, get) => ({
  lang: 'en',
  defaultLang: 'en',
  languages: [{id: 'en', name: 'EN'}, {id: 'ja', name: 'JP'}],
  appTitle: "Jun Katada",
  description: "descriptionです",
  pageTitle: "",
  primaryColor: variables.primaryColor,
  loading: false,
  ready: false,
  navList: NavList,
  navListLength:NavList.length,
  navListIndex: 0,
  prevNavListIndex: 0,
  coefficient: 0.6,
  targetCoefficient: 0.1,
  isScroll: false,
  stopMainFrame: false,
  resizeTimer: 200,
  doResize: false,
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
      // @todo content reload
      
    },
    onResize() {
      clearTimeout(get().doResize);
      set(() => ({ doResize: setTimeout(get().actions.resizedw, 200) }));
      set(() => ({ stopMainFrame: true }));
      // set(() => ({ windowHeight: window.innerHeight }));
    },
    resizedw() {
      console.log('end');
      set(() => ({ stopMainFrame: false }));
      set(() => ({ navListIndex: 0 }));
    },
    // to prevent re-rendering
    onPopState() {
      get().actions.setRouter();
    },
    setRouter() {
      let pathname = document.location.pathname;
      const paths = pathname.split('/');
      const pathLength = paths.length;
      if (pathLength >= 2 && paths[1]) {
        // local
        for (let i = 0; pathLength >= i; i++) {
          get().languages.map((value) => {
            if (paths[i] === value.id) {
              set(() => ({ lang: value.id }));
              if (pathLength === 2) {
                set(() => ({ showContent: false }));
              }
            }
          })
          if (get().actions.isContentsPath(`/${paths[i]}`)) {
            set(state => state.showContent = `/${paths[i]}`);
            if (pathLength === 2) {
              set(() => ({ lang: get().defaultLang}));
            }
          }
        }
      }
      if (pathname === '/') {
        set(() => ({ showContent: false }));
      }
    },
    setLang(lang, path) {
      set(() => ({ lang }));
      get().actions.setHistory(path);
    },
    isDefaultLang() {
      return get().defaultLang === get().lang;
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
    isContentsPath(pathname) {
      return get().navList.filter(value => value.path === pathname).length;
    },
    updateMouse({ clientX: x, clientY: y }) {
      get().mutation.mouse.set(x - window.innerWidth / 2, y - window.innerHeight / 2);
      get().mutation.mousePos.set(( x - window.innerWidth / 2 ) * 2 - 1, ( y - window.innerHeight / 2 ) * 2 - 1)
    },
    // location
    toggleContents(pathname) {
      const showContent = get().showContent;
      if (showContent) {
        if (showContent === pathname) {
          set((state) => ({
            showContent: null,
            pageTitle: '',
            description: state.navList[0].description,
          }));
          window.history.pushState('','', `/${get().actions.getLangPath()}`);
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
      get().actions.setHistory(pathname);
    },
    setHistory(pathname) {
      // const current_path = document.location.pathname;
      // console.log({current_path});
      window.history.pushState('', '', get().actions.getLangPath() + pathname);
    },
    setReady(val) {
      set(() => ({ ready: val }));
    },
    getLangPath() {
      const lang = get().lang;
      if (get().defaultLang !== lang) {
        return lang;
      }
      return '';
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
          set(() => ({ prevNavListIndex: index }));
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