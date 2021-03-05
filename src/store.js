import { writable } from 'svelte/store'

export const userDefault = { id: 0, name: '', role: '', email: '', device: '' }
export const gmapsReady = writable(false)
export const gmapsCoords = writable({ lat: 31.58597, lng: 130.557114 })
export const currentUser = writable({ ...userDefault })
