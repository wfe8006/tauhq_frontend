<script context="module">
</script>

<script>
  import { getContext, onMount, afterUpdate } from "svelte";
  import Metatag from "../../components/Metatag.svelte";
</script>

<svelte:head>
  <title>Lamden Stats</title>
  <meta property="og:url" content="{process.env.WEBSITE}/stats" />
  <Metatag />
</svelte:head>

<div class="row">
  <h1>Lamden Stats</h1>
</div>

<div class="table-responsive">
  <table class="table table-outer-bordered">
    <tbody>
      <tr>
        <td><a href="/stats/txns">Daily Txn Chart</a></td>
      </tr>
      <tr>
        <td><a href="/stats/burned">Daily TAU Burnt Chart</a></td>
      </tr>
      <tr>
        <td><a href="/stats/addresses">Daily Wallet Creation Chart</a></td>
      </tr>
      <tr>
        <td><a href="/stats/users">Daily Active Users Chart</a></td>
      </tr>
      <tr>
        <td>
          <a href="/stats/txns_addresses"
            >Daily Txn vs Daily Wallet Creation Chart</a
          >
        </td>
      </tr>
      <tr>
        <td>
          <a href="/stats/tau_lost_forever">Number of TAUs Lost Forver</a>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<br />
