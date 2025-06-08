import { create } from 'zustand'

interface MenuState {
  menuState: string
  isTransitioning: boolean
  setMenuState: (state: string) => void
  setIsTransitioning: (transitioning: boolean) => void
  navigateToMenu: (state: string) => void
}

export const useMenuStore = create<MenuState>((set) => ({
  menuState: 'main',
  isTransitioning: false,
  setMenuState: (state) => set({ menuState: state }),
  setIsTransitioning: (transitioning) => set({ isTransitioning: transitioning }),
  navigateToMenu: (state) => {
    set({ isTransitioning: true })
    setTimeout(() => {
      set({ menuState: state, isTransitioning: false })
    }, 500)
  }
}))