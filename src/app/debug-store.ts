import {create} from 'zustand';

interface debugProps {
    debug:boolean,
    toggleDebug: () => void,
    bananaBounce:{
        value: number,
        min: number,
        max: number,
        step: number
    }
}

const useDebugStore = create<debugProps>((set) => ({
  debug: false,
  toggleDebug: () => set((state) =>  ({ debug: !state.debug})),
  bananaBounce: {
    value: 0.5,
    min: 0,
    max: 1,
    step: 0.01
  },
}));



export default useDebugStore