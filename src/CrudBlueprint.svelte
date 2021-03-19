<!-- https://eugenkiss.github.io/7guis/tasks#crud -->
<script>
  import Fa from 'svelte-fa'
  import { faQrcode, faHandPointUp, faCircleNotch } from '@fortawesome/free-solid-svg-icons'
  import { onMount } from 'svelte'
  import { API_URL_BLUEPRINTS } from './config'
  import Select from 'svelte-select'

  let availableCategories = [
    { value: '→200円', label: '→200円' },
    { value: '→350円', label: '→350円' },
    { value: '→500円', label: '→500円' },
    { value: '→その他', label: '→その他' },
  ]
  let availableAreas = [
    { value: '鹿児島', label: '鹿児島' },
    { value: '東京', label: '東京' },
    { value: '北海度', label: '北海度' },
  ]

  let categories = []
  let areas = []
  let blueprints = []
  let is_loading = ''
  let prefix = ''
  let title = ''
  let content = ''
  let image = ''
  let valid_from = new Date()
  let valid_to = new Date()
  let use_limit = 1
  let qr_or_button = 'qr'
  let id = 0

  /**
   * On Mount
   */
  onMount(async () => {
    blueprints = await fetch(API_URL_BLUEPRINTS).then((r) => r.json())
    blueprints.map((bp) => {
      // Dates are stored as: yyyy-mm-ddT12:00:00. (We only want the date for inputs)
      bp.valid_from = bp.valid_from.split('T')[0]
      bp.valid_to = bp.valid_to.split('T')[0]
      return bp
    })
    blueprints = blueprints.sort((a, b) => a.id - b.id)
  })

  /**
   * Computed
   */
  $: filteredBlueprints = prefix ? blueprints.filter(() => true) : blueprints
  $: selected = filteredBlueprints.find((bp) => bp.id == id)
  $: reset_inputs(selected)

  /**
   * Create
   */
  async function create() {
    is_loading = 'create'
    let new_blueprint = await fetch(API_URL_BLUEPRINTS, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        title,
        content,
        image,
        valid_from: new Date(valid_from).toISOString().split('Z')[0], // removes traling timezone
        valid_to: new Date(valid_to).toISOString().split('Z')[0], // removes traling timezone
        use_limit,
        stores: [],
        is_qr: qr_or_button === 'qr',
        is_buttonable: qr_or_button === 'button',
        category: categories.join('|'),
        area: areas.join('|'),
      }),
    }).then((r) => r.json())
    blueprints = blueprints.concat(new_blueprint)
    clear_inputs()
  }

  /**
   * Update
   */
  async function update() {
    is_loading = 'update'
    let updated_blueprint = await fetch(`${API_URL_BLUEPRINTS}/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
      body: JSON.stringify({
        id, // id only to satisfy the DTO schema, but its discarded server-side (url-param is used instead)
        title,
        content,
        image,
        valid_from: new Date(valid_from).toISOString().split('Z')[0], // removes traling timezone
        valid_to: new Date(valid_to).toISOString().split('Z')[0], // removes traling timezone
        use_limit,
        is_qr: qr_or_button === 'qr',
        is_buttonable: qr_or_button === 'button',
        category: categories.join('|'),
        area: areas.join('|'),
      }),
    }).then((r) => r.json())
    // UCT is used serverside, so we ensure timezone by just adding "Z",
    // (This is the easiest, but not correct and will cause trouble when used in mixed timezones. )
    // then we only take the date (yyyy-mm-dd) or the <input type="date"> will complain
    updated_blueprint.valid_from = new Date(updated_blueprint.valid_from + 'Z').toISOString().split('T')[0]
    updated_blueprint.valid_to = new Date(updated_blueprint.valid_to + 'Z').toISOString().split('T')[0]
    let index = blueprints.findIndex((bp) => bp.id === updated_blueprint.id)
    blueprints = [...blueprints.slice(0, index), updated_blueprint, ...blueprints.slice(index + 1)]
    is_loading = ''
  }

  /**
   * Remove
   */
  async function remove() {
    is_loading = 'remove'
    await fetch(`${API_URL_BLUEPRINTS}/${selected.id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE',
    }).then((r) => r.json())
    let index = blueprints.findIndex((bp) => bp.id === id)
    blueprints = [...blueprints.slice(0, index), ...blueprints.slice(index + 1)]
    clear_inputs()
  }

  /**
   *
   */
  function selectArea(e) {
    areas = e.detail ? e.detail.map((i) => i.value) : []
  }
  /**
   *
   */
  function selectCategory(e) {
    categories = e.detail ? e.detail.map((i) => i.value) : []
  }

  function clear_inputs() {
    title = ''
    content = ''
    use_limit = 1
    id = 0
    is_loading = ''
    qr_or_button = 'qr'
  }

  /**
   *
   */
  function reset_inputs(bp) {
    console.log(bp)
    title = bp ? bp.title : ''
    content = bp ? bp.content : ''
    image = bp ? bp.image : ''
    valid_from = bp ? bp.valid_from : ''
    valid_to = bp ? bp.valid_to : ''
    use_limit = bp ? bp.use_limit : 1
    qr_or_button = bp && bp.is_buttonable ? 'button' : 'qr'
    categories = bp ? bp.category.split('|') : []
    areas = bp ? bp.area.split('|') : []
  }
</script>

<div class="flex flex-col space-y-2">
  <select bind:value={id} size={15}>
    {#each filteredBlueprints as blueprint}
      <option value={blueprint.id}>{blueprint.id} -- {blueprint.title}</option>
    {/each}
  </select>

  <div class="grid grid-cols-1 gap-2">
    <label><input class="px-1 rounded-sm w-full" bind:value={title} placeholder="見出し" /></label>
    <label
      ><textarea class="px-1 rounded-sm w-full" bind:value={content} placeholder="テキスト" rows="5" />
      <label><input class="px-1 rounded-sm w-full" bind:value={image} placeholder="画像URI" /></label>
      <label
        >日付から<input
          class="px-1 rounded-sm w-full"
          type="date"
          bind:value={valid_from}
          placeholder="日付から"
          required
        />
      </label>
      <label
        >日付まで<input
          class="px-1 rounded-sm w-full"
          type="date"
          bind:value={valid_to}
          placeholder="日付まで"
          required
        />
      </label>
      <label
        >何回使用可能<input
          class="px-1 rounded-sm w-full"
          type="number"
          min="1"
          bind:value={use_limit}
          placeholder="何回使用可能"
        /></label
      >
    </label>
  </div>
</div>
<div class="flex flex-col grid-cols-2 space-y-2">
  <div class="grid grid-cols-1 gap-2">
    <div>
      <span>地域</span>
      <Select items={availableAreas} selectedValue={areas} isMulti={true} on:select={selectArea} placeholder={''} />
    </div>
    <div>
      <span>カテゴリー</span>
      <Select
        items={availableCategories}
        selectedValue={categories}
        isMulti={true}
        on:select={selectCategory}
        placeholder={''}
      />
    </div>
    <label class="flex items-center">
      <input
        class="mr-2 form-radio h-6 w-6"
        type="radio"
        name="qrbutton"
        bind:group={qr_or_button}
        value="qr"
        placeholder="QR"
      />
      <Fa icon={faQrcode} color="grey" class="h-6 w-6" />
      <span class="ml-2">QR</span>
    </label>

    <label class="flex items-center">
      <input
        class="mr-2 form-radio h-6 w-6"
        type="radio"
        name="qrbutton"
        bind:group={qr_or_button}
        value="button"
        placeholder="QR"
      />
      <Fa icon={faHandPointUp} color="grey" class="h-6 w-6" />
      <span class="ml-2">ボタン</span>
    </label>
  </div>

  <!-- CRUD buttons  -->
  <div class="flex space-x-2 buttons">
    <button
      class="disabled:opacity-50 bg-gray-300 hover:bg-gray-200 border rounded-sm border-blue-600 px-2 flex items-center"
      on:click={create}
      disabled={!title || !content || !valid_from || !valid_to}
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
    <button
      class="disabled:opacity-50 bg-gray-300 hover:bg-gray-200 border rounded-sm border-green-600 px-2 flex items-center"
      on:click={remove}
      disabled={!selected}
    >
      全ユーザーに追加
    </button>
  </div>
</div>
