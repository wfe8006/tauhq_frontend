<script context="module">
 export function load({ params, url, query, session }) {
  var query = url.searchParams;
  var url;
  url = import.meta.env.VITE_API_SERVER + "/blocks/" + params.slug;
  return fetch(url)
   .then((r) => r.json())
   .then((blocks) => {
    return { props: { blocks, blockID: params.slug } };
   });
 }
</script>

<script>
 export let blocks;
 export let blockID;
 import Metatag from "$lib/Metatag.svelte";

 function timesince(timestamp) {
  //timestamp in milliseconds so * 1000
  if (timestamp == 0) {
   return "-";
  }
  const dateObject = new Date(timestamp * 1000);
  const humanDateFormat = dateObject.toLocaleString();
  var diff;
  diff = Date.now() / 1000 - timestamp;
  var interval;
  interval = diff / 86400;
  if (interval > 1) {
   return Math.floor(interval) + " days ago - " + humanDateFormat + " UTC+0";
  }
  interval = diff / 3600;
  if (interval > 1) {
   return Math.floor(interval) + " hrs ago - " + humanDateFormat + " UTC+0";
  }
  interval = diff / 60;
  if (interval > 1) {
   return Math.floor(interval) + " mins ago - " + humanDateFormat + " UTC+0";
  }
  return Math.floor(diff) + " secs ago - " + humanDateFormat + " UTC+0";
 }
</script>

<svelte:head>
 <title>Lamden Block #{blocks.ID}</title>
 <meta
  property="og:url"
  content="{import.meta.env.VITE_WEBSITE}/blocks/{blocks.ID}"
 />
 <Metatag />
</svelte:head>
<div class="row">
 <h1>Block #{blocks.ID}</h1>
</div>

{#if blockID == 70704}
 <div class="row">
  <div class="12 col">Block not found</div>
 </div>
{:else}
 <ul class="pagination text-right">
  <li class="page-item">
   <a href="/blocks/{blocks.ID == 1 ? 1 : blocks.ID - 1}" class="page-link"
    >&#60;</a
   >
  </li>
  <li class="page-item active">
   <a href="{'#'}" class="page-link" tabindex="-1">{blocks.ID}</a>
  </li>
  <li class="page-item">
   <a
    href="/blocks/{blocks.ID == blocks.LatestBlock ? blocks.ID : blocks.ID + 1}"
    class="page-link">&#62;</a
   >
  </li>
 </ul>

 <div class="table-responsive">
  <table class="table table-outer-bordered">
   <tbody>
    <tr>
     <td class="font-weight-bold">Hash</td>
     <td>{blocks.Hash}</td>
    </tr>
    <tr>
     <td class="font-weight-bold">Timestamp</td>
     <td>{timesince(blocks.Timestamp)}</td>
    </tr>
    <tr>
     <td class="font-weight-bold">Total SubBlocks</td>
     <td>{blocks.SubBlock}</td>
    </tr>
    <tr>
     <td class="font-weight-bold">Total Transactions</td>
     <td>{blocks.Txn}</td>
    </tr>
   </tbody>
  </table>
 </div>

 {#if blocks.Txn > 0}
  <br />
  <div class="table-responsive">
   <table class="table table-outer-bordered">
    <thead>
     <tr><th scope="col">Transactions</th></tr>
    </thead>
    <tbody>
     {#each blocks.Transactions as tx}
      <tr>
       <td><a href="/transactions/{tx}">{tx}</a></td>
      </tr>
     {/each}
    </tbody>
   </table>
  </div>
 {/if}
{/if}
