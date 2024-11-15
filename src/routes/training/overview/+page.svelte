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

<div class="overflow-y-scroll">
  <table class="border-separate border-spacing-0">
    <thead>
      <tr class="">
        <th>
          <p class="w-36"></p>
        </th>
        {#each trainings as training}
          <th>
            <p
              class="whitespace-nowrap -rotate-[65deg] w-14 h-20 text-xs items-center flex"
            >
              {getWeekday(training?.day)}, {formatDate(training?.day)}
            </p>
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each profiles as profile, i}
        <tr class="{i % 2 == 0 ? '' : 'bg-gray-100'} divide-x">
          <td>
            {profile?.full_name}
            {profile?.username}
          </td>
          {#each trainings as training, i}
            {#if profile?.trainings_profiles.length > 0}
              {#each profile?.trainings_profiles as training_profile}
                {#if training_profile?.trainings?.id == training?.id}
                  <td>
                    <p class="items-center justify-center flex">X</p>
                  </td>
                {:else}
                  <td>
                    <p></p>
                  </td>
                {/if}
              {/each}
            {:else}
              <td>
                <p></p>
              </td>
            {/if}
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
