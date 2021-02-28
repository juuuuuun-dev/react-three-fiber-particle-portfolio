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
  headerTitle: common.headerTitle,
  domain: common.domain,
  copyrightStartYear: common.copyrightStartYear,
  pageTitle: '',
  primaryColor: variables.primaryColor,
  loading: false,
  ready: false,
  navList: navList,
  navListLength: navList.length,
  hasAnimatedNavList: navList.filter(value => value.animated),
  hasAnimatedNavListLength: navList.filter(value => value.animated).length,
  hasPathNavList: navList.filter(value => value.path),
  hasAnimatedAndPathNavList: navList.filter(value => value.path && value.animated),
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
      const paths = get().actions.makeLocationPaths();
      get().actions.initPathCheck(paths)
    },
    makeLocationPaths() {
      const pathname = document.location.pathname.slice(1);
      const paths = pathname.split('/');
      return paths;
    },
    initPathCheck(paths) {
      let lang = null;
      let content = null;
      if (paths[0] === "") return;
      lang = get().actions.getCurrentLang(paths[0]);
      if (paths.length === 1) {
        if (!lang) {
          content = get().actions.getCurrentContentPath(paths[0])
          if (!content) {
            get().actions.set404()
          }
        }
      } else if (paths.length === 2) {
        if (!lang) get().actions.set404()
        content = get().actions.getCurrentContentPath(paths[1])
        if (!content) {
          get().actions.set404()
        }
      } else {
        get().actions.set404()
      }
      if (lang) set(() => ({ lang: lang }))
      if (!lang && !content) {
        get().actions.set404();
      }
    },
    getCurrentContentPath(path) {
      const les = get().navList.filter(val => val.path === `/${path}`);
      if (les[0]) return les[0].path;
    },
    getCurrentLang(path) {
      let lang = null;
      get().languages.forEach(value => {
        if (path === value.id) {
          lang = path;
        }
      });
      return lang;
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
    // async setInitLang() {
    //   let pathname = document.location.pathname;
    //   const paths = pathname.split('/');
    //   const pathLength = paths.length;
    //   if (pathLength >= 2 && paths[1]) {
    //     for (let i = 0; pathLength >= i; i++) {
    //       // local
    //       get().languages.forEach(value => {
    //         if (paths[i] === value.id) {
    //           set(() => ({ lang: value.id }));
    //         }
    //       });
    //     }
    //     // check404
    //     get().actions.check404(`/${paths[1]}`);
    //   }
    // },
    set404() {
      set(() => ({
        is404: true,
        navList: get().error404Nav,
        navListLength: 1,
        pageTitle: "404 NOT FOUTD",
      }));
    },
    // check404(path) {
    //   if (get().actions.isDefaultLang()) {
    //     const les = get().navList.filter(val => val.path === path)
    //     if (les.length === 0) {
    //       set(() => ({
    //         is404: true,
    //         navList: get().error404Nav,
    //         navListLength: 1,
    //         pageTitle: "404 NOT FOUTD",
    //       }));
    //     }
    //   }
    // },
    setRouter() {
      const pathList = get().actions.makeLocationPaths();
      const lang = get().actions.getCurrentLang(pathList[0]);
      set(() => ({ lang: lang || get().defaultLang }));
      const pathListLen = pathList.length;
      if (pathListLen === 1) {
        set(() => ({ showContent: false }));
      }
      if (pathListLen >= 1 && pathList[0]) {
        for (let i = 0; pathListLen >= i; i++) {
          // content
          if (get().actions.isContentsPath(`/${pathList[i]}`)) {
            const [content] = get().navList.filter(val => val.path === `/${pathList[i]}`);
            set(() => ({
              showContent: content.path,
              pageTitle: content.title
            }));
            // set(state => (state.showContent = `/${paths[i]}`));
          }
        }
      }
      if (pathList[0] === '') {
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
    getHasAnimatedNavList() {
      return get().navList.filter(value => value.animated);
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
      const lang = get().actions.getLangPath();
      const langUri = lang ? '/' + lang : '';
      window.history.pushState('', '', langUri + pathname);
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
                index += get().hasAnimatedNavListLength;
              }
            } else {
              index = (index + 1) % get().hasAnimatedNavListLength;
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
