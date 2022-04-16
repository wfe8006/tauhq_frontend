<script context="module">
 export function load({ params, url, session }) {
  var query = url.searchParams;
  var url;
  url = import.meta.env.VITE_API_SERVER + "/transactions/" + params.slug;
  console.log(url);
  return fetch(url)
   .then((r) => r.json())
   .then((transactions) => {
    return { props: { transactions } };
   });
 }
</script>

<script>
 export let transactions;
 import { onMount } from "svelte";
 import Metatag from "$lib/Metatag.svelte";

 onMount(() => {});

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

 function copy_sender() {
  var content = document.getElementById("sender_address");
  content.select();
  document.execCommand("copy");
  alert("Address Copied!");
 }

 function copy_recipient() {
  var content = document.getElementById("recipient_address");
  content.select();
  document.execCommand("copy");
  alert("Address Copied!");
 }
</script>

<svelte:head>
 <title>Lamden Transaction #{transactions.Hash}</title>
 <meta
  property="og:url"
  content="{import.meta.env.VITE_WEBSITE}/transactions/{transactions.Hash}"
 />
 <Metatag />
</svelte:head>

<div class="row">
 <h1>Transaction #{transactions.ID}</h1>
</div>

<div class="table-responsive">
 <table class="table table-outer-bordered">
  <tbody>
   <tr>
    <td class="font-weight-bold">Hash</td>
    <td>{transactions.Hash}</td>
   </tr>
   <tr>
    <td class="font-weight-bold">Status</td>
    <td
     >{#if "HasError" in transactions}
      <span class="text-danger font-weight-bold">Failed</span>
     {:else}<span class="text-success font-weight-bold">Success</span>{/if}</td
    >
   </tr>
   {#if "HasError" in transactions}
    <tr>
     <td class="font-weight-bold">Error Message</td>
     <td class="text-danger font-weight-bold">{transactions.Result}</td>
    </tr>
   {:else if transactions.Result != "None"}
    <tr>
     <td class="font-weight-bold">Result</td>
     <td>{transactions.Result}</td>
    </tr>
   {/if}

   <tr>
    <td class="font-weight-bold">Timestamp</td>
    <td>{timesince(transactions.Timestamp)}</td>
   </tr>
   <tr>
    <td class="font-weight-bold">Block</td>
    <td><a href="/blocks/{transactions.BlockID}">{transactions.BlockID}</a></td>
   </tr>
   <tr>
    <td class="font-weight-bold">Stamps Used</td>
    <td>{transactions.StampsUsed}</td>
   </tr>
   <tr>
    <td class="font-weight-bold">Burned Fee</td>
    <td>
     {(
      (transactions.StampsUsed * transactions.StampsBurnRatio) /
      transactions.StampsPerTAU
     ).toFixed(8)} TAU</td
    >
   </tr>
   <tr>
    <td class="font-weight-bold">From</td>
    <td
     ><a href="/addresses/{transactions.Sender}">{transactions.Sender}</a
     >&nbsp;<i class="far fa-copy fa-md" on:click="{copy_sender}"></i>
     <input
      type="text"
      id="sender_address"
      value="{transactions.Sender}"
      style="position:absolute;left:-1000px;top:-1000px;"
     /></td
    >
   </tr>

   {#if (transactions.Contract == "currency" && transactions.Function == "transfer") || (transactions.Contract == "con_token_swap" && transactions.Function == "disperse")}
    <tr>
     <td class="font-weight-bold">To</td>
     <td>
      <a href="/addresses/{transactions.Kwargs.to}">{transactions.Kwargs.to}</a
      >&nbsp;<i class="far fa-copy fa-md" on:click="{copy_recipient}"></i>
      <input
       type="text"
       id="recipient_address"
       value="{transactions.Kwargs.to}"
       style="position:absolute;left:-1200px;top:-1200px;"
      />
     </td></tr
    >
    <tr>
     <td class="font-weight-bold">Value</td>
     <td>
      {transactions.KwargsAmount} TAU (${Intl.NumberFormat("en-US", {
       minimumFractionDigits: 2,
      }).format(transactions.TAUPriceUSD * transactions.KwargsAmount)})
     </td>
    </tr>
   {/if}
   <tr>
    <td class="font-weight-bold">Contract Name</td>
    <td
     ><a href="/contracts/{transactions.Contract}">{transactions.Contract}</a
     ></td
    >
   </tr>
   <tr>
    <td class="font-weight-bold">Function Name</td>
    <td>{transactions.Function}</td>
   </tr>
  </tbody>
 </table>
</div>

<br />
<details class="collapse-panel mw-full">
 <!-- w-400 = width: 40rem (400px), mw-full = max-width: 100% -->
 <summary class="collapse-header">Additional Info</summary>
 <div class="table-responsive collapse-content">
  <table class="table">
   <tbody>
    <tr>
     <td class="font-weight-bold">SubBlock Number</td>
     <td>{transactions.SubBlockNO ? transactions.SubBlockNO : 0}</td>
    </tr>
    <tr>
     <td class="font-weight-bold">Nonce</td>
     <td>{transactions.Nonce ? transactions.Nonce : 0}</td>
    </tr>
    <tr>
     <td class="font-weight-bold">Processor</td>
     <td>{transactions.Processor}</td>
    </tr>
    <tr>
     <td class="font-weight-bold">Signature</td>
     <td>{transactions.Signature}</td>
    </tr>
    <tr>
     <td class="font-weight-bold">Stamps Supplied</td>
     <td>{transactions.StampsSupplied}</td>
    </tr>
    <tr>
     <td class="font-weight-bold">Stamps per TAU</td>
     <td>{transactions.StampsPerTAU}</td>
    </tr>
   </tbody>
  </table>
 </div>
</details>

<br />
<div class="row">
 <div class="12 col bold">
  <h3>Kwargs</h3>
 </div>
</div>
<div class="table-responsive">
 <table class="table table-outer-bordered">
  <tbody>
   {#each Object.entries(transactions.Kwargs) as [key, value]}
    <tr>
     <td class="font-weight-bold" width="15%">{key}</td>
     <td>
      {#if key == "addresses"}
       {#each value as address}
        <a href="/addresses/{address}">{address}</a><br />
       {/each}
      {:else}
       {typeof value == "object" && value !== null && !Array.isArray(value)
        ? JSON.stringify(value)
        : value}
      {/if}
     </td>
    </tr>
   {/each}
  </tbody>
 </table>
</div>

<br />
<div class="row">
 <div class="12 col bold">
  <h3>State Changes</h3>
 </div>
</div>
<div class="hb"></div>

<div class="table-responsive">
 <table class="table table-outer-bordered">
  <tbody>
   {#each Object.entries(transactions.State) as [key, state]}
    <tr>
     <td class="font-weight-bold">Contract</td>
     <td>{transactions.State[key].Key.split(".")[0]}</td>
    </tr>
    <tr>
     <td class="font-weight-bold">Variable</td>
     <td>{transactions.State[key].Key.split(".")[1].split(":")[0]} </td>
    </tr>
    {#if transactions.State[key].Key.split(/:(.+)/).length > 1}
     <tr>
      <td class="font-weight-bold">Key</td>
      <td>
       {transactions.State[key].Key.split(/:(.+)/)[1]}
      </td>
     </tr>
    {/if}
    <tr>
     <td class="font-weight-bold">New Value</td>
     <td>
      {#if typeof state.value == "object" && state.value !== null}
       {#if "__fixed__" in state.value}
        {state.value.__fixed__}
       {:else if "__time__" in state.value}
        {state.value.__time__}
       {:else if "__bytes__" in state.value}{state.value.__bytes__}{/if}
      {:else}{state.value}{/if}
     </td>
    </tr>
    <tr>
     <td>&nbsp;</td>
    </tr>
   {/each}
  </tbody>
 </table>
</div>

<style>
</style>
