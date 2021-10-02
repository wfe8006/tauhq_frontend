<script context="module">
 export function preload({ params, query }, session) {
  var firstID = 0;
  var lastID = 0;
  var url;
  var tokenName = params.slug;
  var isFirstPage = 1;
  var address;
  if (query.address) {
   address = query.address;
  } else {
   address = "";
  }
  console.log("addr: " + address.length);

  if (
   (query.id > 1 && query.dir) ||
   (query.id > 1 && query.dir && query.address)
  ) {
   var id = parseFloat(query.id);
   var dir = query.dir;

   isFirstPage = 0;
   url =
    process.env.API_SERVER +
    "/tokens/" +
    tokenName +
    "/transfers?dir=" +
    dir +
    "&id=" +
    id;
   if (query.address) {
    url += "&address=" + address;
   }
  } else {
   url = process.env.API_SERVER + "/tokens/" + tokenName + "/transfers";
   if (query.address) {
    url += "?address=" + query.address;
   }
  }

  var totalRecords = 0;
  return this.fetch(url)
   .then((r) => r.json())
   .then((transactions) => {
    if (transactions.Transactions != null) {
     firstID = transactions.Transactions[0].ID;
     lastID =
      transactions.Transactions[transactions.Transactions.length - 1].ID;

     if (
      (dir == "prev" && transactions.Transactions.length < 25) ||
      transactions.Transactions[0].ID == transactions.LatestID
     ) {
      isFirstPage = 1;
     }
    }
    return {
     transactions: transactions.Transactions,
     firstID,
     lastID,
     tokenName,
     isFirstPage,
     oldestID: transactions.OldestID,
     address,
     tokenBalance: transactions.TokenBalance,
     tokenBalanceUSD: transactions.TokenBalanceUSD,
     totalSupply: transactions.TotalSupply,
     tokenSymbol: transactions.TokenSymbol,
    };
   });
 }
</script>

<script>
 import { getContext } from "svelte";

 export let transactions;
 export let firstID;
 export let lastID;
 export let tokenName;
 export let isFirstPage;
 export let oldestID;
 export let tokenBalance;
 export let tokenBalanceUSD;
 export let totalSupply;
 export let tokenSymbol;
 export let address;
 import { numberWithCommas, timesince } from "../../../js/utils";
</script>

<svelte:head>
 <title
  >{getContext("token_price")}
  {getContext("token_name")} ({getContext("token_symbol")}) token transfers</title
 >
 <meta
  property="og:url"
  content="{process.env.WEBSITE}/tokens/{tokenName}/transfers"
 />
</svelte:head>

{#if address.length > 0}
 <span class="font-weight-bold pr-10">Filtered by address </span>
 <p class="text-break">{address}</p>
 <div class="d-flex flex-row mb-3">
  <div class="pr-4 m-4">
   <span class="font-weight-bold pr-10">Token Balance</span>
   {tokenBalance}
   {tokenSymbol.toUpperCase()}
  </div>
 </div>
 <div class="d-flex flex-row mb-3">
  <div class="pr-4 m-4">
   <span class="font-weight-bold pr-10">Token Value</span>${Intl.NumberFormat(
    "en-US",
    {
     minimumFractionDigits: 2,
    }
   ).format(tokenBalanceUSD)}

   {#if tokenBalanceUSD != "0.00"}
    ({((tokenBalance / totalSupply) * 100).toFixed(4)}%)
   {/if}
  </div>
 </div>
{/if}

{#if transactions != null}
 <ul class="pagination text-right">
  {#if isFirstPage == 1}
   <li class="page-item disabled">
    <a href="{'#'}" class="page-link" tabindex="-1">First</a>
   </li>
  {:else}
   <li class="page-item">
    <a
     sapper:noscroll
     href="/tokens/{tokenName}/transfers{address == ''
      ? ''
      : '?address=' + address}"
     class="page-link">First</a
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
     sapper:noscroll
     href="
          /tokens/{tokenName}/transfers?dir=prev&id={firstID}{address == ''
      ? ''
      : '&address=' + address}
      "
     class="page-link">&#60;</a
    >
   </li>
  {/if}
  {#if transactions.length == 25 && transactions[transactions.length - 1].ID > oldestID}
   <li class="page-item">
    <a
     sapper:noscroll
     href="
          /tokens/{tokenName}/transfers?dir=next&id={lastID}{address == ''
      ? ''
      : '&address=' + address}
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
     <th width="15%">Hash</th>
     <th class="text-center">Date/Time</th>
     <th class="text-center">Function</th>
     <th class="text-center">From</th>
     <th class="text-center">To</th>
     <th class="text-center">Amount</th>
    </tr>
   </thead>
   <tbody>
    {#each transactions as transaction}
     <tr>
      <td width="15%">
       {#if transaction.OK == 0}
        <a
         href="/transactions/{transaction.Hash}"
         class="text-danger font-weight-bold"
         >{transaction.Hash.substring(0, 10) + "..."} TX Failed</a
        >
       {:else}
        <a href="/transactions/{transaction.Hash}"
         >{transaction.Hash.substring(0, 15) + "..."}</a
        >
       {/if}
      </td>
      <td class="text-center">{timesince(transaction.Timestamp)}</td>
      <td class="text-center">{transaction.Function}</td>
      <td class="text-center"
       ><a href="/addresses/{transaction.Sender}"
        >{transaction.Sender.substring(0, 15) + "..."}</a
       ></td
      >
      <td class="text-center">
       {#if transaction.OK == 1}
        {#if transaction.Recipient == "-"}
         {#if transaction.Contract == "con_rocketswap_official_v1_1"}
          <a href="/addresses/con_rocketswap_official_v1_1"
           >con_rocketswap_official_v1_1</a
          >
         {:else if transaction.Contract == "con_multisend2"}
          Multiple recipients
         {:else}
          N/A
         {/if}
        {:else}
         <a href="/addresses/{transaction.Recipient}"
          >{transaction.Recipient.substring(0, 15) + "..."}</a
         >
        {/if}
       {:else}
        -
       {/if}
      </td>
      <td class="text-center">{transaction.Amount}</td>
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
    <a
     sapper:noscroll
     href="/tokens/{tokenName}/transfers{address == ''
      ? ''
      : '?address=' + address}"
     class="page-link">First</a
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
     sapper:noscroll
     href="
          /tokens/{tokenName}/transfers?dir=prev&id={firstID}{address == ''
      ? ''
      : '&address=' + address}
      "
     class="page-link">&#60;</a
    >
   </li>
  {/if}
  {#if transactions.length == 25 && transactions[transactions.length - 1].ID > oldestID}
   <li class="page-item">
    <a
     sapper:noscroll
     href="
          /tokens/{tokenName}/transfers?dir=next&id={lastID}{address == ''
      ? ''
      : '&address=' + address}
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
