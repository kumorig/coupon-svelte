<!-- https://eugenkiss.github.io/7guis/tasks#crud -->
<script>
  import Fa from 'svelte-fa'
  import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
  import { onMount } from 'svelte'
  import { API_URL_STORES } from './config'
  import { gmapsCoords } from './store'

  let prefix = ''
  let is_loading = ''

  // All stores
  let stores = []

  // Fields
  let id = 0
  let name = ''
  let address = ''
  let longitude = 31.596554
  let latitude = 130.557114

  // Listen for map changes
  gmapsCoords.subscribe(({ lat, lng }) => {
    latitude = lat
    longitude = lng
  })

  /**
   * On Mount
   */
  onMount(async () => {
    stores = await fetch(API_URL_STORES).then((r) => r.json())
    stores = stores.sort((a, b) => a.id - b.id)
  })

  /**
   * Computed
   */
  $: filteredStores = prefix ? stores.filter(() => true) : stores
  $: selected = filteredStores.find((bp) => bp.id == id)
  $: reset_inputs(selected)
  $: if (selected) gmapsCoords.set({ lat: selected.latitude, lng: selected.longitude })

  /**
   * Create
   */
  async function create() {
    is_loading = 'create'
    let new_store = await fetch(API_URL_STORES, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        name,
        address,
        latitude,
        longitude,
      }),
    }).then((r) => r.json())
    stores = stores.concat(new_store)
    id = 0
    name = ''
    address = '鹿児島'
    longitude = 31.596554
    is_loading = 130.557114
  }

  /**
   * Update
   */
  async function update() {
    is_loading = 'update'
    let updated_store = await fetch(`${API_URL_STORES}/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
      body: JSON.stringify({
        id, // id must be provided, but its only to match the DTO schema and is never used on the backend
        name,
        address,
        longitude,
        latitude,
      }),
    }).then((r) => r.json())
    console.log('updated_store', updated_store)
    let index = stores.findIndex((store) => store.id === updated_store.id)

    stores = [...stores.slice(0, index), updated_store, ...stores.slice(index + 1)]
    is_loading = ''
  }

  /**
   *
   */
  async function remove() {
    is_loading = 'remove'
    await fetch(`${API_URL_STORES}/${selected.id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE',
    }).then((r) => r.json())
    let index = stores.findIndex((bp) => bp.id === id)
    stores = [...stores.slice(0, index), ...stores.slice(index + 1)]
    name = ''
    address = '鹿児島'
    longitude = '31.596554'
    is_loading = '130.557114'
  }

  /**
   *
   * @param bp
   */
  function reset_inputs(bp) {
    name = bp ? bp.name : ''
    address = bp ? bp.address : ''
    longitude = bp ? bp.longitude : ''
    latitude = bp ? bp.latitude : ''
  }
</script>

<!-- <input placeholder="filter prefix" bind:value={prefix} /> -->

<select bind:value={id} size={15}>
  {#each filteredStores as store}
    <option value={store.id}>{store.id} -- {store.name}</option>
  {/each}
</select>

<div class="grid grid-cols-1 gap-2">
  <label><input class="px-1 rounded-sm w-full" bind:value={name} placeholder="店名" /></label>
  <label><input class="px-1 rounded-sm w-full" bind:value={address} placeholder="住所" /></label>
  <label><input class="px-1 rounded-sm w-full" bind:value={longitude} placeholder="テキスト" /></label>
  <label><input class="px-1 rounded-sm w-full" bind:value={latitude} placeholder="画像URI" /></label>
</div>

<!-- CRUD buttons  -->
<div class="flex space-x-2 buttons">
  <button
    class="disabled:opacity-50 bg-gray-300 hover:bg-gray-200 border rounded-sm border-blue-600 px-2 flex items-center"
    on:click={create}
    disabled={!name}
    >追加
    {#if is_loading === 'create'}
      <Fa icon={faCircleNotch} class="h-6 w-6 animate-spin text-blue-600" />
    {/if}
  </button>

  <button
    class="disabled:opacity-50 bg-gray-300 hover:bg-gray-200 border rounded-sm border-yellow-400 px-2 flex items-center"
    on:click={update}
    disabled={!selected}
  >
    編集
    {#if is_loading === 'update'}
      <Fa icon={faCircleNotch} class="h-6 w-6 animate-spin text-blue-600" />
    {/if}
  </button>

  <button
    class="disabled:opacity-50 bg-gray-300 hover:bg-gray-200 border rounded-sm border-red-600 px-2 flex items-center"
    on:click={remove}
    disabled={!selected}
  >
    削除
    {#if is_loading === 'remove'}
      <Fa icon={faCircleNotch} class="h-6 w-6 animate-spin text-red-600" />
    {/if}
  </button>
</div>
