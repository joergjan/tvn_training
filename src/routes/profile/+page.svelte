<!-- src/routes/account/+page.svelte -->
<script lang="ts">
  import { enhance } from "$app/forms";
  import type { SubmitFunction } from "@sveltejs/kit";
  import Avatar from "./Avatar.svelte";

  export let data;
  export let form;

  let { session, supabase, trainings, profile } = data;
  $: ({ session, supabase, trainings, profile } = data);

  let profileForm: HTMLFormElement;
  let loading = false;
  let fullName: string = profile?.full_name ?? "";
  let username: string = profile?.username ?? "";
  let avatarUrl: string = profile?.avatar_url ?? "";

  const handleSubmit: SubmitFunction = () => {
    loading = true;
    return async () => {
      loading = false;
    };
  };

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

<div class="form-widget">
  <form
    class="form-widget"
    method="post"
    action="?/update"
    use:enhance={handleSubmit}
    bind:this={profileForm}
  >
    <Avatar
      {supabase}
      bind:url={avatarUrl}
      size={10}
      on:upload={() => {
        profileForm.requestSubmit();
      }}
    />

    <div>
      <label for="email">Email</label>
      <input id="email" type="text" value={session.user.email} disabled />
    </div>

    <div>
      <label for="fullName">Vorname</label>
      <input
        id="fullName"
        name="fullName"
        type="text"
        value={form?.fullName ?? fullName}
      />
    </div>

    <div>
      <label for="username">Nachname</label>
      <input
        id="username"
        name="username"
        type="text"
        value={form?.username ?? username}
      />
    </div>

    <div>
      <input
        type="submit"
        class="button block primary"
        value={loading ? "Loading..." : "Update"}
        disabled={loading}
      />
    </div>
  </form>
</div>

{#if profile?.trainings_profiles?.length > 0}
  <div class="overflow-x-scroll">
    <table class="border-separate border-spacing-0">
      <thead>
        <tr class="">
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
                {training.day}
              </p>
            </td>
            {#each profile?.trainings_profiles as training_profile, i}
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
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{:else}
  <p>noch kein Training besucht</p>
{/if}
