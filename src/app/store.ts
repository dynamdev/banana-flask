import { create } from 'zustand'

interface BananaState {
    newBananaCount:number,
    oldBananaCount: number,
    outsideBananaCount: number,
    totalBananaCount: number,
    setNewBananaCount: (newData:number) => void,
    setOldBananaCount: (newData:number) => void,
    setOutsideBananaCount: (newData:number) => void,
}



const useStore = create<BananaState>((set) => ({
  newBananaCount: 0,
  oldBananaCount: 0,
  outsideBananaCount: 0,
  totalBananaCount:0,
  setNewBananaCount: (newData:number) => set(() => ({ newBananaCount: newData })),
  setOldBananaCount: (newData:number) => set(() => ({ oldBananaCount: newData })),
  setOutsideBananaCount: (newData:number) => set(() => ({ outsideBananaCount: newData })),

}))



export default useStore;