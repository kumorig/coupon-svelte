import App from './App.svelte'
import { gmapsReady } from './store'

const app = new App({
  target: document.body
})

window.initMap = function ready () {
  gmapsReady.set(true)
}

export default app
