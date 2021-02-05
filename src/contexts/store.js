import create from 'zustand';
import { useCallback, useEffect } from 'react';
import { getDevice } from '../helpers/UserAgent';
import navList from '../config/navList';
import error404Nav from '../config/error404';
import common from '../config/common';
import { useGesture } from 'react-use-gesture';
import variables from '../assets/scss/_variables.scss';

const [useStore] = create((set, get) => ({
  lang: common.defaultLang,
  defaultLang: common.defaultLang,
  languages: common.languages,
  appTitle: common.appTitle,
  domain: common.domain,
  copyrightStartYear: common.copyrightStartYear,
  pageTitle: '',
  primaryColor: variables.primaryColor,
  loading: false,
  ready: false,
  navList: navList,
  navListLength: navList.length,
  navListIndex: 0,
  error404Nav: error404Nav,
  homeText: navList[0] ? navList[0].texts.join(' ') : null,
  prevNavListIndex: 0,
  isScroll: false,
  is404: false,
  stopMainFrame: false,
  doResize: false,
  scrollCallbacks: [],
  windowHeight: window.innerHeight,
  ua: getDevice(),
  showContent: null, // pathname
  /**
   * action
   */
  actions: {
    async init() {
      set(() => ({
        loading: true
      }));
      window.onresize = get().actions.onResize;
      window.onpopstate = get().actions.onPopState;
      get().actions.setInitLang();
    },
    onResize() {
      clearTimeout(get().doResize);
      set(() => ({ doResize: setTimeout(get().actions.resizedw, 500) }));
      set(() => ({ stopMainFrame: true }));
      set(() => ({ isScroll: true }));
    },
    resizedw() {
      set(() => ({ stopMainFrame: false }));
      set(() => ({ navListIndex: 0 }));
      setTimeout(() => {
        set(() => ({ isScroll: false }));
      }, 500);
    },
    // to prevent re-rendering
    onPopState() {
      get().actions.setRouter();
    },
    async setInitLang() {
      let pathname = document.location.pathname;
      const paths = pathname.split('/');
      const pathLength = paths.length;
      if (pathLength >= 2 && paths[1]) {
        for (let i = 0; pathLength >= i; i++) {
          // local
          get().languages.forEach(value => {
            if (paths[i] === value.id) {
              set(() => ({ lang: value.id }));
            }
          });
        }
        // check404
        get().actions.check404(`/${paths[1]}`);
      }
    },
    check404(path) {
      if (get().actions.isDefaultLang()) {
        const les = get().navList.filter(val => val.path === path)
        if (les.length === 0) {
          set(() => ({
            is404: true,
            navList: get().error404Nav,
            navListLength: 1,
            pageTitle: "404 NOT FOUTD",
          }));
        }
      }
    },
    setRouter() {
      let pathname = document.location.pathname;
      const paths = pathname.split('/');
      const pathLength = paths.length;
      if (pathLength === 2) {
        set(() => ({ showContent: false }));
      }
      if (pathLength >= 2 && paths[1]) {
        for (let i = 0; pathLength >= i; i++) {
          // content
          if (get().actions.isContentsPath(`/${paths[i]}`)) {
            set(state => (state.showContent = `/${paths[i]}`));
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
    // location
    toggleContents(pathname) {
      console.log(pathname);
      return new Promise(async resolve => {
        const showContent = get().showContent;
        if (showContent) {
          if (showContent === pathname) {
            get().actions.resetContent();
          } else {
            get().actions.setContents(pathname);
          }
        } else {
          get().actions.setContents(pathname);
        }
        return resolve(get().showContent);
      });
    },
    resetContent() {
      set(state => ({
        showContent: null,
        pageTitle: '',
      }));
      window.history.pushState('', '', `/${get().actions.getLangPath()}`);
    },
    setContents(pathname) {
      const [content] = get().navList.filter(val => val.path === pathname);
      set(() => ({
        showContent: pathname,
        pageTitle: content.title
      }));
      get().actions.setHistory(pathname);
    },
    resetIndex() {
      const showContent = get().showContent;
      if (showContent) {
        get().actions.resetContent();
      }
    },
    setHistory(pathname) {
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
      set(state => ({ loading: (state.loading = !state.loading) }));
    },
    setLoading(val) {
      set(() => ({ loading: val }));
    },
    setScrollCollbacks(fn) {
      set(state => ({ scrollCallbacks: [...state.scrollCallbacks, fn] }));
    },
    useYScroll(props) {
      let y = 0;
      const fn = useCallback(
        ({ wheeling, xy: [, cy], previous: [, py], ...pp }) => {

          if (get().isScroll) return;

          let index = get().navListIndex;
          set(() => ({ prevNavListIndex: index }));
          const diffY = wheeling ? cy - py : py - cy;
          if (diffY > 10 || diffY < -10) {
            set(() => ({ isScroll: true }));
            if (diffY < 0) {
              index -= 1;
              if (index < 0) {
                index += get().navListLength;
              }
            } else {
              index = (index + 1) % get().navListLength;
            }
            set(() => ({ navListIndex: index }));
            get().actions.execCallbacks(index);
            setTimeout(() => {
              set(() => ({ isScroll: false }));
            }, 500);
          }
          return cy - py;
        },
        []
      );
      const bind = useGesture({ onWheel: fn, onDrag: fn }, props);
      useEffect(() => props && props.domTarget && bind(), [props, bind]);
      return [y];
    },
    execCallbacks(index) {
      set(() => ({ navListIndex: index }));
      get().scrollCallbacks.map(fn => fn(index));
    }
  }
}));

export default useStore;
