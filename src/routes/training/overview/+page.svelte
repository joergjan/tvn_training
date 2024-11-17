<script lang="ts">
  import { formatDate } from "$lib/functions/formatDate";
  import { getWeekday } from "$lib/functions/getWeekday";

  export let data;

  $: ({ session, supabase, trainings, profiles } = data);
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
            <td>
              {#each profile?.trainings_profiles as training_profile}
                {#if training_profile?.trainings?.id == training?.id}
                  <p class="items-center justify-center flex">X</p>
                {/if}
              {/each}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
