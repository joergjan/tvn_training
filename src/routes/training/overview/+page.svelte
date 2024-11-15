<script lang="ts">
  export let data;

  let { session, supabase, trainings, profiles } = data;
  $: ({ session, supabase, trainings, profiles } = data);

  function getWeekday(dateString: string) {
    const daysOfWeek = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
    const dayIndex = new Date(dateString).getDay();
    return daysOfWeek[dayIndex];
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (getMonth() returns 0-11, so add 1)
    // const year = date.getFullYear(); // Get full year

    return `${day}.${month}.`; //.${year}
  }
</script>

<div class="flex"></div>

<div class="px-4 sm:px-6 lg:px-8">
  <div class="sm:flex sm:items-center">
    <div class="sm:flex-auto">
      <h1 class="text-base font-semibold text-gray-900">Users</h1>
      <p class="mt-2 text-sm text-gray-700">
        A list of all the users in your account including their name, title,
        email and role.
      </p>
    </div>
    <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
      <button
        type="button"
        class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >Add user</button
      >
    </div>
  </div>
  <div class="mt-8 flow-root">
    <div class="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle">
        <table class="min-w-full border-separate border-spacing-0">
          <thead>
            <tr class="h-10 text-xs">
              <th></th>
              {#each trainings as training}
                <th class="-rotate-45">
                  {getWeekday(training?.day)}, {formatDate(training?.day)}
                </th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each profiles as profile}
              <tr>
                <td>
                  {profile?.full_name}
                  {profile?.username}
                </td>
                {#each trainings as training, i}
                  {#each profile?.trainings_profiles as training_profile}
                    {#if training_profile?.trainings?.day == training?.day}
                      <td>X</td>
                    {/if}
                  {/each}
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
