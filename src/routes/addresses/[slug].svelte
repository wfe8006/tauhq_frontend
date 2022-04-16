<script context="module">
 export function load({ params, url, session }) {
  var query = url.searchParams;
  var firstID = 0;
  var lastID = 0;
  var url;
  var address = params.slug;
  var isFirstPage = 1;
  if (query.get("id") > 1 && query.get("dir")) {
   var id = parseFloat(query.get("id"));
   var dir = query.dir;
   isFirstPage = 0;
   url =
    import.meta.env.VITE_API_SERVER +
    "/addresses/" +
    address +
    "?dir=" +
    dir +
    "&id=" +
    id;
  } else {
   url = import.meta.env.VITE_API_SERVER + "/addresses/" + address;
  }

  var totalRecords = 0;
  return fetch(url)
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
     props: {
      transactions: transactions.Transactions,
      tokens: transactions.Tokens,
      firstID,
      lastID,
      address,
      isFirstPage,
      oldestID: transactions.OldestID,
      balance:
       transactions.Balance == null
        ? 0
        : numberWithCommas(transactions.Balance),
      balanceUSD:
       transactions.Balance == null
        ? 0
        : Intl.NumberFormat("en-US", {
           minimumFractionDigits: 2,
          }).format(transactions.BalanceUSD),
      txn: transactions.Txn,
      percentage: (
       (transactions.Balance / 288090567.493886586209600228) *
       100
      ).toFixed(4),
     },
    };
   });
 }

 function copy() {
  var content = document.getElementById("user_address");
  content.select();
  document.execCommand("copy");
  alert("Address Copied!");
 }
</script>

<script>
 export let transactions;
 export let firstID;
 export let lastID;
 export let address;
 export let isFirstPage;
 export let oldestID;
 export let balance;
 export let balanceUSD;
 export let txn = 0;
 export let percentage;
 export let tokens;
 import { numberWithCommas, timesince } from "$lib/utils";
 import Metatag from "$lib/Metatag.svelte";
</script>

<svelte:head>
 <title>Lamden Address {address}</title>
 <meta
  property="og:url"
  content="{import.meta.env.VITE_WEBSITE}/addresses/{address}"
 />
 <Metatag />
</svelte:head>
<div class="row">
 <h5 class="break">
  <b>Address {address}</b> <i class="far fa-copy fa-md" on:click="{copy}"></i>
 </h5>
</div>

<input
 type="text"
 id="user_address"
 value="{address}"
 style="position:absolute;left:-1000px;top:-1000px;"
/>
<br />
<div class="table-responsive">
 <table class="table table-outer-bordered">
  <tbody>
   <tr>
    <td class="text-left" width="20%">Balance TAU</td>
    <td>{balance} TAU</td>
   </tr>
   <tr>
    <td class="text-left">Balance USD</td>
    <td>${balanceUSD}</td>
   </tr>
   <tr>
    <td class="text-left">Percentage</td>
    <td>{percentage} %</td>
   </tr>
   <tr>
    <td class="text-left">Txn</td>
    <td>{txn}</td>
   </tr>
  </tbody>
 </table>
</div>

{#if tokens !== undefined}
 <br />
 <div>
  <h5><b>Tokens</b></h5>
  {#each tokens as token}
   <p>
    {token.TokenBalance}
    <a href="/tokens/{token.TokenContract}">{token.TokenSymbol.toUpperCase()}</a
    >
    - <b>{token.TokenName}</b><br />
   </p>
  {/each}
 </div>
{/if}

{#if transactions != null}
 <br />
 <br />
 <div class="row"><h5><b>Transactions</b></h5></div>

 <ul class="pagination text-right">
  {#if isFirstPage == 1}
   <li class="page-item disabled">
    <a href="{'#'}" class="page-link" tabindex="-1">First</a>
   </li>
  {:else}
   <li class="page-item">
    <a sapper:noscroll href="/addresses/{address}" class="page-link">First</a>
   </li>
  {/if}

  {#if isFirstPage == 1}
   <li class="page-item active disabled">
    <a sapper:noscroll href="{'#'}" class="page-link" tabindex="-1">&#60;</a>
   </li>
  {:else}
   <li class="page-item">
    <a
     sapper:noscroll
     href="
          /addresses/{address}?dir=prev&id={firstID}
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
      /addresses/{address}?dir=next&id={lastID}
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
     <th class="text-left">Hash</th>
     <th class="text-center">Date/Time</th>
     <th class="text-center">Stamps</th>
     <th class="text-center">Contract</th>
     <th class="text-center">Function</th>
     <th class="text-right" width="10%">Amount TAU</th>
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
         >{transaction.Hash.substring(0, 20) + "..."}
        </a>
       {/if}
      </td>
      <td class="text-center">{timesince(transaction.Timestamp)}</td>
      <td class="text-center">{transaction.StampsUsed}</td>
      <td class="text-center">
       <a href="/contracts/{transaction.Contract}">{transaction.Contract}</a>
      </td>
      <td class="text-center">{transaction.Function}</td>
      <td class="text-right" width="10%">
       {#if "KwargsAmount" in transaction}
        {#if transaction.Flow == "in"}
         <span class="success"
          >+{numberWithCommas(transaction.KwargsAmount)}
         </span>
        {:else}
         <span class="failed"
          >-{numberWithCommas(transaction.KwargsAmount)}
         </span>
        {/if}
       {:else}<span v-else>-</span>{/if}
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
    <a sapper:noscroll href="/addresses/{address}" class="page-link">First</a>
   </li>
  {/if}

  {#if isFirstPage == 1}
   <li class="page-item active disabled">
    <a sapper:noscroll href="{'#'}" class="page-link" tabindex="-1">&#60;</a>
   </li>
  {:else}
   <li class="page-item">
    <a
     sapper:noscroll
     href="
          /addresses/{address}?dir=prev&id={firstID}
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
      /addresses/{address}?dir=next&id={lastID}
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
