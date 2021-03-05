<!-- httpss://eugenkiss.github.io/7guis/tasks#crud -->
<script>
  import { onMount } from 'svelte'
  import { API_URL_USERS } from './config'
  import { currentUser, userDefault } from './store'

  let users = []
  onMount(async () => {
    users = await fetch(API_URL_USERS).then((r) => r.json())
  })

  let prefix = ''
  let id = 0
  let name = ''
  let role = ''
  let i = 0

  $: filteredUsers = prefix
    ? users.filter((person) => {
        const name = `${user.role}, ${user.name}`
        return name.toLowerCase().startsWith(prefix.toLowerCase())
      })
    : users

  $: selected = filteredUsers[i]

  $: reset_inputs(selected)

  async function create() {
    let new_user = await fetch(API_URL_USERS, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ name, role }),
    }).then((r) => r.json())
    users = users.concat(new_user)
    i = users.length - 1
    name = ''
    role = ''
  }

  function update() {
    users[i] = { name, role }
  }

  async function remove() {
    let response = await fetch(`${API_URL_USERS}/${selected.id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE',
    }).then((r) => r.json())
    users = [...users.slice(0, i), ...users.slice(i + 1)]
    name = role = ''
    i = Math.min(i, users.length - 1)
  }

  function reset_inputs(selected) {
    let user = selected ? selected : { ...userDefault }
    currentUser.set(user)
    name = user ? user.name : ''
    role = user ? user.role : ''
  }




</script>

<!-- <input placeholder="filter prefix" bind:value={prefix} /> -->

<select bind:value={i} size={15}>
  {#each filteredUsers as user, index}
    <option value={index} selected={index === i}>{user.id}. {user.name} ({user.role})</option>
  {/each}
</select>

<div class="grid grid-cols-2 gap-2">
  <label><input class="px-1 rounded-sm w-full" bind:value={name} placeholder="name" /></label>
  <label><input class="px-1 rounded-sm w-full" bind:value={role} placeholder="role" /></label>
</div>

<div class="flex space-x-2 buttons">
  <button
    class="bg-gray-300 hover:bg-gray-200 border rounded-sm border-blue-600 px-2 flex items-center"
    on:click={create}
    disabled={!name || !role}>追加</button
  >
  <button
    class="bg-gray-300 hover:bg-gray-200 border rounded-sm border-yellow-400 px-2 flex items-center"
    on:click={update}
    disabled={!name || !role || !selected}>編集</button
  >
  <button
    class="bg-gray-300 hover:bg-gray-200 border rounded-sm border-red-600 px-2 flex items-center"
    on:click={remove}
    disabled={!selected}>削除</button
  >
</div>

<!-- <input placeholder="filter prefix" bind:value={prefix} /> -->
<style>
</style>
