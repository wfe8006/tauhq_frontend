<script context="module">
 export function load({ params, url, session }) {
  var query = url.searchParams;
  var firstID = 0;
  var lastID = 0;
  var url;
  var tokenName = params.slug;
  var isFirstPage = 1;
  var address;
  if (query.get("address")) {
   address = query.address;
  } else {
   address = "";
  }
  console.log("addr: " + address.length);

  if (
   (query.get("id") > 1 && query.get("dir")) ||
   (query.get("id") > 1 && query.get("dir") && query.get("address"))
  ) {
   var id = parseFloat(query.get("id"));
   var dir = query.get("dir");
   isFirstPage = 0;
   url =
    import.meta.env.VITE_API_SERVER +
    "/tokens/" +
    tokenName +
    "/dextrades?dir=" +
    dir +
    "&id=" +
    id;
   if (query.get("address")) {
    url += "&address=" + address;
   }
  } else {
   url =
    import.meta.env.VITE_API_SERVER + "/tokens/" + tokenName + "/dextrades";
   if (query.get("address")) {
    url += "?address=" + query.get("address");
   }
  }
  var totalRecords = 0;
  console.log("line 41");
  return fetch(url)
   .then((r) => r.json())
   .then((dextrades) => {
    var transactions = [];
    if (dextrades.Transactions != null) {
     console.log("here here here");
     transactions = dextrades.Transactions;
     firstID = dextrades.Transactions[0].ID;
     lastID = dextrades.Transactions[dextrades.Transactions.length - 1].ID;

     if (
      (dir == "prev" && dextrades.Transactions.length < 25) ||
      dextrades.Transactions[0].ID == dextrades.LatestID
     ) {
      isFirstPage = 1;
     }
    } else {
     console.log("there");
    }
    return {
     props: {
      transactions,
      firstID,
      lastID,
      tokenName,
      address,
      isFirstPage,
      oldestID: dextrades.OldestID,
      symbol: dextrades.Symbol,
     },
    };
   });
 }
</script>

<script>
 export let transactions;
 export let firstID;
 export let lastID;
 export let tokenName;
 export let isFirstPage;
 export let oldestID;
 export let symbol;
 export let address;
 import { getContext } from "svelte";
 import { numberWithCommas, timesince } from "$lib/utils";
</script>

<svelte:head>
 <title
  >{getContext("token_price")}
  {getContext("token_name")} ({getContext("token_symbol")}) token DEX Trades</title
 >
 <meta
  property="og:url"
  content="{import.meta.env.VITE_WEBSITE}/tokens/{tokenName}/dextrades"
 />
</svelte:head>

{#if address.length > 0}
 <span class="font-weight-bold pr-10">Filtered by address </span>
 <p class="text-break">{address}</p>
 <br />
{/if}

{#if transactions != null}
 <ul class="pagination text-right">
  {#if isFirstPage == 1}
   <li class="page-item disabled">
    <a href="{'#'}" class="page-link" tabindex="-1">First</a>
   </li>
  {:else}
   <li class="page-item">
    <a sveltekit:noscroll href="/tokens/{tokenName}/dextrades" class="page-link"
     >First</a
    >
   </li>
  {/if}
  {#if isFirstPage == 1}
   <li class="page-item active disabled">
    <a href="{'#'}" class="page-link" tabindex="-1">&#60;</a>
   </li>
  {:else}
   <li class="page-item">
    <a
     sveltekit:noscroll
     href="
            /tokens/{tokenName}/dextrades?dir=prev&id={firstID}
        "
     class="page-link">&#60;</a
    >
   </li>
  {/if}

  {#if transactions.length == 25 && transactions[transactions.length - 1].ID > oldestID}
   <li class="page-item">
    <a
     sveltekit:noscroll
     href="
            /tokens/{tokenName}/dextrades?dir=next&id={lastID}
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
     <th>Hash</th>
     <th class="text-center">Date/Time</th>
     <th class="text-center">Action</th>
     <th class="text-left">Amount Out</th>
     <th class="text-left">Amount In (Est.)</th>
     <th class="text-left">Swapped Rate</th>
     <th class="text-left" width="10%">Txn Value</th>
    </tr>
   </thead>
   <tbody>
    {#each transactions as transaction}
     <tr>
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
      <td class="text-center">{transaction.Action}</td>
      <td class="text-left"
       >{transaction.Amount}
       {transaction.Action == "sell" ? symbol.toUpperCase() : "TAU"}</td
      >
      <td class="text-left">
       {#if transaction.SwapRateTAU == null}
        &nbsp;
       {:else if transaction.Action == "sell"}
        {parseFloat(transaction.Amount * transaction.SwapRateTAU).toFixed(8)}
        {transaction.Action == "sell" ? "TAU" : symbol.toUpperCase()}
       {:else}
        {parseFloat(transaction.Amount / transaction.SwapRateTAU).toFixed(8)}
        {transaction.Action == "sell" ? "TAU" : symbol.toUpperCase()}
       {/if}
      </td>
      <td class="text-left"
       >{transaction.SwapRateTAU == null
        ? ""
        : parseFloat(transaction.SwapRateTAU).toFixed(6) + " TAU"}
      </td>
      <td class="text-left" width="10%">
       {#if transaction.SwapRateTAU == null}
        &nbsp;
       {:else if transaction.Action == "sell"}
        ${parseFloat(
         transaction.Amount * transaction.SwapRateTAU * transaction.TAUPriceUSD
        ).toFixed(4)}
       {:else}
        ${parseFloat(transaction.Amount * transaction.TAUPriceUSD).toFixed(4)}
       {/if}
      </td>
     </tr>
    {/each}
   </tbody>
  </table>
 </div>
 <br />
 <ul class="pagination text-right">
  {#if isFirstPage == 1}
   <li class="page-item disabled">
    <a href="{'#'}" class="page-link" tabindex="-1">First</a>
   </li>
  {:else}
   <li class="page-item">
    <a sveltekit:noscroll href="/tokens/{tokenName}/dextrades" class="page-link"
     >First</a
    >
   </li>
  {/if}
  {#if isFirstPage == 1}
   <li class="page-item active disabled">
    <a href="{'#'}" class="page-link" tabindex="-1">&#60;</a>
   </li>
  {:else}
   <li class="page-item">
    <a
     sveltekit:noscroll
     href="
            /tokens/{tokenName}/dextrades?dir=prev&id={firstID}
        "
     class="page-link">&#60;</a
    >
   </li>
  {/if}

  {#if transactions.length == 25 && transactions[transactions.length - 1].ID > oldestID}
   <li class="page-item">
    <a
     sveltekit:noscroll
     href="
            /tokens/{tokenName}/dextrades?dir=next&id={lastID}
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
{/if}
