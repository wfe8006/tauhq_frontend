<script context="module">
 export function load({ error, status }) {
  return {
   props: {
    message: error.message,
    status, // same as status: status
   },
  };
 }
</script>

<script>
 export let message;
 export let status;
</script>

{#if status == 404}
 <!-- Used '==' instead of '===' to match string/number status code (just to be sure) -->
 <h3>Page not found</h3>
{:else if import.meta.env.VITE_NODE_ENV == "development"}
 <h3>Message: {message}</h3>
 <h3>Status: {status}</h3>
{:else}
 <h3>Something went wrong, please try again later</h3>
{/if}
