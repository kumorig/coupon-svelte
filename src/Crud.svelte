<!-- https://eugenkiss.github.io/7guis/tasks#crud -->
<script>
  let people = [
    {
      first: 'Hans',
      last: 'Emil',
    },
    {
      first: 'Max',
      last: 'Mustermann',
    },
    {
      first: 'Roman',
      last: 'Tisch',
    },
  ]

  let prefix = ''
  let first = ''
  let last = ''
  let i = 0

  $: filteredPeople = prefix
    ? people.filter((person) => {
        const name = `${person.last}, ${person.first}`
        return name.toLowerCase().startsWith(prefix.toLowerCase())
      })
    : people

  $: selected = filteredPeople[i]

  $: reset_inputs(selected)

  function create() {
    people = people.concat({ first, last })
    i = people.length - 1
    first = last = ''
  }

  function update() {
    people[i] = { first, last }
  }

  function remove() {
    people = [...people.slice(0, i), ...people.slice(i + 1)]

    first = last = ''
    i = Math.min(i, people.length - 1)
  }

  function reset_inputs(person) {
    first = person ? person.first : ''
    last = person ? person.last : ''
  }
</script>

<!-- <input placeholder="filter prefix" bind:value={prefix} /> -->

<select bind:value={i} size={5}>
  {#each filteredPeople as person, i}
    <option value={i}>{person.last}, {person.first}</option>
  {/each}
</select>

<div class="flex space-x-2">
  <label><input class="px-1 rounded-sm" bind:value={first} placeholder="first" /></label>
  <label><input class="px-1 rounded-sm" bind:value={last} placeholder="last" /></label>
</div>

<div class="flex space-x-2 buttons">
  <button
    class="bg-gray-300 hover:bg-gray-200 border rounded-sm border-gray-400 px-2 flex items-center"
    on:click={create}
    disabled={!first || !last}>create</button
  >
  <button
    class="bg-gray-300 hover:bg-gray-200 border rounded-sm border-gray-400 px-2 flex items-center"
    on:click={update}
    disabled={!first || !last || !selected}>update</button
  >
  <button
    class="bg-gray-300 hover:bg-gray-200 border rounded-sm border-gray-400 px-2 flex items-center"
    on:click={remove}
    disabled={!selected}>delete!</button
  >
</div>

<style>
</style>
