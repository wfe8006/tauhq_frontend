<script context="module">
 export function preload({ params, query }, session) {
  var firstPage = 1;
  var prevPage = 1;
  var currentPage = 1;
  var nextPage = 1;
  var lastPage = 1;
  var url;
  var totalRecords = 0;
  if (query.page > 1) {
   currentPage = parseInt(query.page);
   url = process.env.API_SERVER + "/transactions?page=" + currentPage;
  } else {
   url = process.env.API_SERVER + "/transactions";
  }
  var totalRecords = 0;
  return this.fetch(url)
   .then((r) => r.json())
   .then((transactions) => {
    if (currentPage == 1) {
     totalRecords = transactions[0].ID;
    } else {
     totalRecords = transactions[0].ID + (currentPage - 1) * 25;
    }
    lastPage = Math.ceil(totalRecords / 25);
    if (currentPage == lastPage) {
     nextPage = lastPage;
    } else {
     nextPage = currentPage + 1;
    }
    if (currentPage == 1) {
     prevPage = 1;
    } else {
     prevPage = currentPage - 1;
    }
    return {
     transactions,
     firstPage,
     prevPage,
     currentPage,
     nextPage,
     lastPage,
    };
   });
 }
</script>

<script>
 import { numberWithCommas, timesince } from "../../js/utils";
 import Paginator from "../../components/Paginator.svelte";
 import Metatag from "../../components/Metatag.svelte";
 export let transactions;
 export let firstPage;
 export let prevPage;
 export let currentPage;
 export let nextPage;
 export let lastPage;
</script>

<svelte:head>
 <title>Lamden Transactions</title>
 <meta property="og:url" content="{process.env.WEBSITE}/transactions" />
 <Metatag />
</svelte:head>
<div class="row">
 <h1>Transactions</h1>
</div>

<Paginator
 firstPage="{firstPage}"
 prevPage="{prevPage}"
 currentPage="{currentPage}"
 nextPage="{nextPage}"
 lastPage="{lastPage}"
 property="{'transactions'}"
/>
<div class="table-responsive">
 <table class="table table-outer-bordered">
  <thead>
   <tr>
    <th class="text-center">#</th>
    <th align="left">Hash</th>
    <th class="text-center">Date/Time</th>
    <th class="text-center">Stamps</th>
    <th class="text-center">Burned TAU</th>
    <th class="text-center">Contract</th>
    <th class="text-center">Function</th>
    <th class="text-right">Amount TAU</th>
   </tr>
  </thead>
  <tbody>
   {#each transactions as transaction}
    <tr>
     <td class="text-center">{transaction.ID}</td>
     <td>
      {#if transaction.OK == 0}
       <a
        href="/transactions/{transaction.Hash}"
        class="text-danger font-weight-bold"
        >{transaction.Hash.substring(0, 10) + "..."} TX Failed</a
       >
      {:else}
       <a href="/transactions/{transaction.Hash}"
        >{transaction.Hash.substring(0, 20) + "..."}</a
       >
      {/if}
     </td>
     <td class="text-center">{timesince(transaction.Timestamp)}</td>
     <td class="text-center">{transaction.StampsUsed}</td>
     <td class="text-center"
      >{(
       (transaction.StampsUsed * transaction.StampsBurnRatio) /
       transaction.StampsPerTAU
      ).toFixed(6)}
     </td>
     <td class="text-center">
      <a href="/contracts/{transaction.Contract}">{transaction.Contract}</a>
     </td>
     <td class="text-center">{transaction.Function}</td>
     <td class="text-right">
      {"KwargsAmount" in transaction
       ? numberWithCommas(transaction.KwargsAmount)
       : "-"}
     </td>
    </tr>
   {/each}
  </tbody>
 </table>
</div>
<Paginator
 firstPage="{firstPage}"
 prevPage="{prevPage}"
 currentPage="{currentPage}"
 nextPage="{nextPage}"
 lastPage="{lastPage}"
 property="{'transactions'}"
/>
