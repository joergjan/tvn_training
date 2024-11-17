<script>
  import { formatDate } from "$lib/functions/formatDate";
  import { getWeekday } from "$lib/functions/getWeekday";

  export let profile;
  export let trainings;
</script>

<div class="overflow-x-scroll">
  <table class="border-separate border-spacing-0">
    <thead>
      <tr class="">
        <th>
          <p class="w-24"></p>
        </th>
        <th>
          <p>{profile?.full_name}</p>
        </th>
      </tr>
    </thead>
    <tbody>
      {#each trainings as training, i}
        <tr class="{i % 2 == 0 ? '' : 'bg-gray-100'} divide-x">
          <td>
            <p>
              {getWeekday(training?.day)}, {formatDate(training?.day)}
            </p>
          </td>
          <td>
            {#each profile?.trainings_profiles as training_profile, i}
              {#if training_profile?.trainings?.id == training?.id}
                <p class="items-center justify-center flex">X</p>
              {/if}
            {/each}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
