<!-- src/routes/account/+page.svelte -->
<script lang="ts">
  import { enhance } from "$app/forms";
  import type { SubmitFunction } from "@sveltejs/kit";
  import Avatar from "./Avatar.svelte";
  import Training from "./Training.svelte";

  export let data;
  export let form;

  $: ({ session, supabase, trainings, profile } = data);

  let profileForm: HTMLFormElement;
  let loading = false;
  $: fullName = profile?.full_name;
  $: username = profile?.username;
  $: avatarUrl = profile?.avatar_url;

  const handleSubmit: SubmitFunction = () => {
    loading = true;
    return async () => {
      loading = false;
    };
  };
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
  <Training {profile} {trainings} />
{:else}
  <p>noch kein Training besucht</p>
{/if}
