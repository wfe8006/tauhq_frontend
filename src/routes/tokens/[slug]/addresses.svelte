<script context="module">
 export function preload({ params, query }, session) {
  var tokenName = params.slug;
  var firstPage = 1;
  var prevPage = 1;
  var currentPage = 1;
  var nextPage = 1;
  var lastPage = 1;
  var url;
  var isFirstPage = 1;
  var firstID = 0;
  var firstBalance = 0;
  var lastID = 0;
  var lastBalance = 0;
  var dir = query.dir;
  if (query.id && query.balance && query.dir) {
   var id = parseFloat(query.id);
   var balance = parseFloat(query.balance);
   url =
    process.env.API_SERVER +
    "/tokens/" +
    tokenName +
    "/addresses?id=" +
    id +
    "&balance=" +
    balance +
    "&dir=" +
    dir;
   isFirstPage = 0;
  } else {
   url = process.env.API_SERVER + "/tokens/" + tokenName + "/addresses";
  }

  return this.fetch(url)
   .then((r) => r.json())
   .then((tokenAddress) => {
    var addresses = [];
    var totalSupply;
    if (tokenAddress.Addresses == null) {
     if (query.id && query.balance && query.dir) {
      return this.redirect(301, "/tokens/" + tokenName + "/addresses");
     }
    }
    if (tokenAddress.Addresses != null) {
     addresses = tokenAddress.Addresses;
     firstID = addresses[0].ID;
     firstBalance = addresses[0].Balance;
     lastID = addresses[addresses.length - 1].ID;
     lastBalance = addresses[addresses.length - 1].Balance;
     totalSupply = tokenAddress.TotalSupply;
     if ((dir == "prev" && addresses.length < 25) || addresses[0].ID == 1) {
      isFirstPage = 1;
     }
    }
    return {
     addresses,
     firstID,
     firstBalance,
     lastID,
     lastBalance,
     isFirstPage,
     dir,
     url,
     tokenName,
     totalSupply,
    };
   });
 }
</script>

<script>
 import { numberWithCommas, timesince } from "../../../js/utils";
 export let tokenName;
 export let addresses;
 export let isFirstPage;
 export let firstID;
 export let firstBalance;
 export let lastID;
 export let lastBalance;
 export let totalSupply = 0;
 import { getContext } from "svelte";
</script>

<svelte:head>
 <title
  >{getContext("token_price")}
  {getContext("token_name")} ({getContext("token_symbol")}) token Holder list</title
 >
 <meta
  property="og:url"
  content="{process.env.WEBSITE}/tokens/{tokenName}/dextrades"
 />
</svelte:head>

<ul class="pagination text-right">
 {#if isFirstPage == 1}
  <li class="page-item disabled">
   <a href="{'#'}" class="page-link" tabindex="-1">First</a>
  </li>
 {:else}
  <li class="page-item">
   <a sapper:noscroll href="/tokens/{tokenName}/addresses" class="page-link"
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
    sapper:noscroll
    href="/tokens/{tokenName}/addresses?dir=prev&id={firstID}&balance={firstBalance}"
    class="page-link">&#60;</a
   >
  </li>
 {/if}
 {#if addresses.length == 25 || isFirstPage == 1}
  <li class="page-item">
   <a
    sapper:noscroll
    href="/tokens/{tokenName}/addresses?dir=next&id={lastID}&balance={lastBalance}"
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
    <th class="text-left">Address</th>
    <th class="text-right" width="20%">Token Balance</th>
    <th class="text-right">Balance USD</th>
    {#if totalSupply != 0}
     <th class="text-right">Percentage</th>
    {/if}
   </tr>
  </thead>
  <tbody>
   {#each addresses as address}
    <tr>
     <td class="text-left">
      <a href="/tokens/{tokenName}/transfers?address={address.Address}"
       >{address.Address.substring(0, 20) + "..."}</a
      >
     </td>
     <td class="text-right" width="20%">
      {Intl.NumberFormat("en-US", {
       minimumFractionDigits: 20,
      }).format(address.Balance)}</td
     >
     <td class="text-right">
      ${Intl.NumberFormat("en-US", {
       minimumFractionDigits: 2,
      }).format(address.BalanceUSD)}
     </td>
     {#if totalSupply != 0}
      <td class="text-right">
       {((address.Balance / totalSupply) * 100).toFixed(4)} %
      </td>
     {/if}
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
   <a sapper:noscroll href="/tokens/{tokenName}/addresses" class="page-link"
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
    sapper:noscroll
    href="/tokens/{tokenName}/addresses?dir=prev&id={firstID}&balance={firstBalance}"
    class="page-link">&#60;</a
   >
  </li>
 {/if}
 {#if addresses.length == 25 || isFirstPage == 1}
  <li class="page-item">
   <a
    sapper:noscroll
    href="/tokens/{tokenName}/addresses?dir=next&id={lastID}&balance={lastBalance}"
    class="page-link">&#62;</a
   >
  </li>
 {:else}
  <li class="page-item disabled">
   <a class="page-link" href="{'#'}" tabindex="-1">&#62;</a>
  </li>
 {/if}
</ul>
