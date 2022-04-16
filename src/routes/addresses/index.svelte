<script context="module">
 export function load({ url, params, session }) {
  var query = url.searchParams;
  var firstPage = 1;
  var prevPage = 1;
  var currentPage = 1;
  var nextPage = 1;
  var lastPage = 1;
  var url;
  var totalRecords = 0;
  var isFirstPage = 1;
  var firstID = 0;
  var firstBalance = 0;
  var lastID = 0;
  var lastBalance = 0;
  var dir = query.get("dir");

  if (query.get("id") && query.get("balance") && query.get("dir")) {
   var id = parseFloat(query.get("id"));
   var balance = parseFloat(query.get("balance"));
   url =
    import.meta.env.VITE_API_SERVER +
    "/addresses?id=" +
    id +
    "&balance=" +
    balance +
    "&dir=" +
    dir;
   isFirstPage = 0;
  } else {
   url = import.meta.env.VITE_API_SERVER + "/addresses";
  }
  console.log("url: " + url);

  var totalRecords = 0;
  return fetch(url)
   .then((r) => r.json())
   .then((addresses) => {
    firstID = addresses[0].ID;
    firstBalance = addresses[0].Balance;
    lastID = addresses[addresses.length - 1].ID;
    lastBalance = addresses[addresses.length - 1].Balance;

    if ((dir == "prev" && addresses.length < 25) || addresses[0].ID == 1) {
     isFirstPage = 1;
    }

    return {
     props: {
      addresses,
      firstID,
      firstBalance,
      lastID,
      lastBalance,
      isFirstPage,
      dir,
      url,
     },
    };
   });
 }
</script>

<script>
 import { numberWithCommas, timesince } from "$lib/utils";
 import Metatag from "$lib/Metatag.svelte";
 export let addresses;
 export let isFirstPage;
 export let firstID;
 export let firstBalance;
 export let lastID;
 export let lastBalance;
</script>

<svelte:head>
 <title>Lamden Addresses</title>
 <meta property="og:url" content="{import.meta.env.VITE_WEBSITE}/addresses" />
 <Metatag />
</svelte:head>

<div class="row">
 <h1>Addresses</h1>
</div>

<ul class="pagination text-right">
 {#if isFirstPage == 1}
  <li class="page-item disabled">
   <a href="{'#'}" class="page-link" tabindex="-1">First</a>
  </li>
 {:else}
  <li class="page-item">
   <a href="/addresses" class="page-link">First</a>
  </li>
 {/if}

 {#if isFirstPage == 1}
  <li class="page-item active disabled">
   <a href="{'#'}" class="page-link" tabindex="-1">&#60;</a>
  </li>
 {:else}
  <li class="page-item">
   <a
    href="
        /addresses?dir=prev&id={firstID}&balance={firstBalance}
      "
    class="page-link">&#60;</a
   >
  </li>
 {/if}

 {#if addresses.length == 25 || isFirstPage == 1}
  <li class="page-item">
   <a
    href="
          /addresses?dir=next&id={lastID}&balance={lastBalance}
        "
    class="page-link">&#62;</a
   >
  </li>
 {:else}
  <li class="page-item disabled">
   <a class="page-link" href="{'#'}" tabindex="-1">&#62;</a>
  </li>
 {/if}
</ul>

<div class="table-responsive">
 <table class="table table-outer-bordered">
  <thead>
   <tr>
    <th class="text-left" width="15%">Address</th>
    <th class="text-right">Balance TAU</th>
    <th class="text-right">Balance USD</th>
    <th class="text-right">Percentage</th>
    <th class="text-center" width="10%">Txn</th>
   </tr>
  </thead>
  <tbody>
   {#each addresses as address}
    <tr>
     <td class="text-left" width="15%">
      <a href="/addresses/{address.Address}"
       >{address.Address.trim().length > 20
        ? address.Address.trim().substring(20, 0) + "..."
        : address.Address}</a
      >
     </td>
     <td class="text-right">{numberWithCommas(address.Balance)}</td>
     <td class="text-right">
      ${Intl.NumberFormat("en-US", {
       minimumFractionDigits: 2,
      }).format(address.BalanceUSD)}
     </td>
     <td class="text-right">
      {((address.Balance / 288090567.493886586209600228) * 100).toFixed(4)}%
     </td>
     <td class="text-center" width="10%">{address.Txn}</td>
    </tr>
   {/each}
  </tbody>
 </table>
</div>
<br />
<ul class="pagination text-right">
 {#if isFirstPage == 1}
  <a href="{'#'}" class="page-link disabled" tabindex="-1">First</a>
 {:else}
  <a href="/addresses" class="page-link">First</a>
 {/if}
 <li class="page-item">
  {#if isFirstPage == 1}
   <li class="page-item active">
    <a href="{'#'}" class="page-link disabled">&#60;</a>
   </li>
  {:else}
   <a
    href="
        /addresses?dir=prev&id={firstID}&balance={firstBalance}
      "
    class="page-link">&#60;</a
   >
  {/if}
 </li>
 {#if addresses.length == 25 || isFirstPage == 1}
  <li class="page-item">
   <a
    href="
          /addresses?dir=next&id={lastID}&balance={lastBalance}
        "
    class="page-link">&#62;</a
   >
  </li>
 {:else}
  <li class="page-item">
   <a class="page-link disabled" href="{'#'}">&#62;</a>
  </li>
 {/if}
</ul>
