// import * as THREE from 'three';
import create from 'zustand';

const [ useStore ] = create((set, get) => ({
  count: 0,
  listLength:3,
  isScroll: false,
  listIndex: 0,
  // increase: () => set(state => ({ count: state.count + 1 })),
  increase: () => set(state => {
    
  }),
  reset: () => set({ count: 0 }),
  mutation: {
    
  },
  actions: {
    onScroll(e) {
      console.log(get().isScroll)
      if (get().isScroll) return;
      let index = get().listIndex;
      const deltaY = e.deltaY;
      set(state => ({ isScroll: true }))
      // get().mutation.isScroll.set(true);
      if (deltaY < 0) {
        index -=1;
        if (index < 0) {
          index += get().listLength;
        }
      } else {
        index = (index + 1) % get().listLength;
      }
      console.log(index)
      set(state => ({ listIndex: index }));
      setTimeout(() => {
        console.log('setTimeout')
        set(state => ({ isScroll: false }))
      }, 500);
    }
  }
}))

export default useStore