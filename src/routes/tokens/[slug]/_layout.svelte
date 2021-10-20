<script context="module">
 export function preload({ params, query }, session) {
  var address;
  if (query.address) {
   address = query.address;
  } else {
   address = "";
  }
  var url;
  var tokenName = params.slug;
  url = process.env.API_SERVER + "/tokens/" + tokenName;
  return this.fetch(url)
   .then((r) => r.json())
   .then((tokens) => {
    let m = new Map();
    if ("Social" in tokens) {
     if (Object.keys(tokens.Social).length > 0) {
      for (const key in tokens.Social) {
       m.set(key, tokens.Social[key]);
      }
     }
    }
    var price = "";
    if (tokens.LastPriceTAU == 0) {
     price = "hidden";
    } else {
     if (tokenName == "con_weth_lst001") {
      price = "$" + parseFloat(tokens.TAUPriceUSD).toFixed(12);
     } else {
      price =
       "$" +
       (tokens.TAUPriceUSD * tokens.LastPriceTAU).toFixed(12) +
       "/" +
       tokens.LastPriceTAU.toFixed(12) +
       " TAU";
     }
    }
    var marketcap = "";
    if ("CirculatingSupply" in tokens) {
     if (tokenName == "con_weth_lst001") {
      marketcap =
       "$" +
       nFormatter(
        parseFloat(tokens.TAUPriceUSD * tokens.CirculatingSupply).toFixed(4),
        2
       );
     } else {
      marketcap =
       "$" +
       nFormatter(
        (
         tokens.TAUPriceUSD *
         tokens.LastPriceTAU *
         tokens.CirculatingSupply
        ).toFixed(4),
        2
       );
     }
    } else {
     marketcap = "hidden";
    }

    var stats = [
     {
      name: "Price",
      value: price,
      tooltip: "",
     },
     {
      name: "Market Cap",
      value: marketcap,
      tooltip: "",
     },
     {
      name: "Fully Diluted Cap",
      value:
       tokens.LastPriceTAU == 0 ||
       !("TotalSupply" in tokens) ||
       "CirculatingSupply" in tokens
        ? "hidden"
        : "$" +
          nFormatter(
           (
            tokens.TAUPriceUSD *
            tokens.LastPriceTAU *
            tokens.TotalSupply
           ).toFixed(4),
           2
          ),
      tooltip: "",
     },
     {
      name: "Burned",
      value:
       "TokenBurned" in tokens
        ? numberWithCommas(tokens.TokenBurned).split(".")[0]
        : "hidden",
      tooltip: "All tokens that were sent to address that nobody has access to",
     },
     {
      name: "Circulating Supply",
      value:
       "CirculatingSupply" in tokens
        ? numberWithCommas(tokens.CirculatingSupply)
        : "hidden",
      tooltip:
       "All tokens that are held by users. EXCLUDING locked tokens (in staking contracts, or otherwise locked), burned tokens, tokens held by the team behind the project",
     },
     {
      name: "Total Supply",
      value:
       "TotalSupply" in tokens
        ? numberWithCommas(tokens.TotalSupply).split(".")[0]
        : "hidden",
      tooltip:
       "All the tokens that ever exist including burned tokens since cryptos cannot be deleted",
     },
     {
      name: "Holders",
      value: "TokenHolder" in tokens ? tokens.TokenHolder : "hidden",
      tooltip: "",
     },
     {
      name: "Transactions",
      value: "Txn" in tokens ? tokens.Txn : "hidden",
      tooltip: "",
     },
     {
      name: "Contract Address",
      value: tokens.TokenContract,
      tooltip: "",
     },
    ];

    if ("Social" in tokens) {
     if (Object.keys(tokens.Social).length > 0) {
      stats.push({ name: "Social", value: "", tooltip: "" });
     }
    }

    return { tokens, tokenName, address, social: m, stats };
   });
 }
</script>

<script>
 export let address;
 export let segment;
 export let tokenName;
 export let tokens;
 export let social;
 export let stats;

 import { setContext, onMount, afterUpdate } from "svelte";
 //https://stackoverflow.com/questions/59603406/slot-prop-within-layout-svelte-not-passing-prop
 setContext("token_name", tokens.TokenName);
 setContext("token_symbol", tokens.TokenSymbol);
 setContext(
  "token_price",
  "$" + (tokens.TAUPriceUSD * tokens.LastPriceTAU).toFixed(4)
 );

 setContext(
  "total_supply",
  tokenName == "con_weth_lst001" || tokenName == "con_nebula"
   ? numberWithCommas(tokens.CirculatingSupply)
   : numberWithCommas(tokens.TotalSupply)
 );

 import {
  titleCase,
  nFormatter,
  numberWithCommas,
  timesince,
 } from "../../../js/utils";

 const handleClick = async () => {
  var url = "tokens/" + tokenName + "/transfers";
  if (address != "") {
   url += "?address=" + address;
  }
  window.location.href = url;
 };
</script>

<svelte:head>
 <meta
  property="og:image"
  content="{process.env.IMG_SERVER}/img/token_logo/{tokens.TokenContract}.jpg"
 />
 <meta name="twitter:card" content="summary" />
 <meta
  name="twitter:image"
  content="{process.env.IMG_SERVER}/img/token_logo/{tokens.TokenContract}.jpg"
 />
</svelte:head>

<div class="row header">
 <object
  data="{process.env.IMG_SERVER}/img/token_logo/{tokens.TokenContract}.jpg"
  type="image/jpg"
  class="token_logo"
  aria-label="{tokens.TokenName}"
 >
  <img
   src="{process.env.IMG_SERVER}/img/token_logo/unknown.svg"
   alt="no image"
   class="token_logo"
  />
 </object>

 <h1>
  {tokens.TokenName}
  <span class="badge badge-secondary font-weight-bold"
   >{tokens.TokenSymbol}</span
  >
 </h1>
</div>
<br />
<div class="row">
 {#each stats as stat}
  <div
   class="col-sm-6 col-lg-4 col-xl-3 p-5 m-2 {stat.value == 'hidden'
    ? 'd-none'
    : ''}"
  >
   <div class="card p-0 m-0">
    <div class="content">
     {#if stat.name == "Social"}
      <p class="font-size-20 font-weight-bold text-muted">
       {stat.name}
      </p>
      {#each [...social] as [key, value]}
       <a target="_blank" href="{value}"
        >{key.charAt(0).toUpperCase() + key.slice(1)}</a
       >&nbsp;&nbsp;&nbsp;
      {/each}
     {:else}
      {#if stat.tooltip == ""}
       <p class="font-size-20 font-weight-bold text-muted">
        {stat.name}
       </p>
      {:else}
       <p
        class="font-size-20 font-weight-bold text-muted"
        data-toggle="tooltip"
        data-title="{stat.tooltip}"
        data-placement="bottom"
       >
        {stat.name}
       </p>
      {/if}
      <p class="font-size-18 text-white-dm text-black-wm">
       {#if stat.name == "Contract Address"}
        <a href="/contracts/{stat.value}">{stat.value}</a>
       {:else if stat.name == "Price"}
        {#if tokenName == "con_weth_lst001"}
         {stat.value.split("/")[0]}
        {:else}
         {stat.value.split("/")[0]} <br />{stat.value.split("/")[1]}
        {/if}
       {:else}
        {stat.value}
       {/if}
      </p>
     {/if}
    </div>
   </div>
  </div>
 {/each}
</div>

<br />
<br />

<div class="row pb-2">
 <div class="col">
  <div class="btn-group" role="group">
   <a
    rel="prefetch"
    aria-current="{segment === '' ? 'tokens' : undefined}"
    href="/tokens/{tokenName}{address == '' ? '' : '?address=' + address}"
    class:active="{segment === undefined}"
    class="btn"
    sapper:noscroll>DEX Chart</a
   >

   <a
    rel="prefetch"
    aria-current="{segment === 'dextrades' ? 'page' : undefined}"
    href="/tokens/{tokenName}/dextrades{address == ''
     ? ''
     : '?address=' + address}"
    class:active="{segment === 'dextrades'}"
    class="btn"
    sapper:noscroll>DEX Trades</a
   >

   <a
    rel="prefetch"
    aria-current="{segment === 'addresses' ? 'page' : undefined}"
    href="/tokens/{tokenName}/addresses{address == ''
     ? ''
     : '?address=' + address}"
    class:active="{segment === 'addresses'}"
    class="btn"
    sapper:noscroll>Holders</a
   >

   <a
    rel="prefetch"
    aria-current="{segment === 'transfers' ? 'page' : undefined}"
    href="/tokens/{tokenName}/transfers{address == ''
     ? ''
     : '?address=' + address}"
    class:active="{segment === 'transfers'}"
    class="btn"
    sapper:noscroll>Transfers</a
   >
  </div>
 </div>
</div>
<br />
<div class="row">
 <div class="col col-lg-4 col-md-6">
  <div class="input-group">
   <input
    class="form-control"
    type="text"
    placeholder="Filter by Address"
    name="address"
    bind:value="{address}"
    on:keyup="{(e) => e.key === 'Enter' && handleClick()}"
   />
   <button class="btn btn-primary" on:click="{handleClick}">Find</button>
  </div>
 </div>
</div>
<br />
<br />
<slot />

<style>
 .header .token_logo {
  float: left;
  border-radius: 50%;
  height: 70px;
  width: 70px;
  background: #555;
 }

 .header h1 {
  display: inline;
  position: relative;
  top: 0px;
  left: 10px;
 }
</style>
