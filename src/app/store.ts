import { create } from 'zustand'

interface BananaState {
    newBananaCount:number,
    oldBananaCount: number,
    outsideBananaCount: number,
    totalBananaCount: number,
    countBanana: () => void,
    setNewBananaCount: (newData:number) => void,
    setOldBananaCount: (newData:number) => void,
    setOutsideBananaCount: (newData:number) => void,
    actionStatus: 'play' | 'stop',
    setActionStatus: (data: 'play' | 'stop') => void
}

const useStore = create<BananaState>((set) => ({
  actionStatus:'stop',
  setActionStatus: (data: 'play' | 'stop') => set(() => ({ actionStatus:data})),
  newBananaCount: 0,
  oldBananaCount: 0,
  outsideBananaCount: 0,
  totalBananaCount:0,
  countBanana: () => set((state:BananaState) => ({ newBananaCount: state.newBananaCount + 1})),
  setNewBananaCount: (newData:number) => set(() => ({ newBananaCount: newData })),
  setOldBananaCount: (newData:number) => set(() => ({ oldBananaCount: newData })),
  setOutsideBananaCount: (newData:number) => set(() => ({ outsideBananaCount: newData })),
}))



export default useStore;