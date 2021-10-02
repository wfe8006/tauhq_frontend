<script context="module">
 export function preload({ params, query }, session) {
  console.log("profiling started");
  var start = new Date().getTime();
  var url = process.env.API_SERVER + "/summary";
  return this.fetch(url)
   .then((r) => r.json())
   .then((summary) => {
    var end = new Date().getTime();
    var time = end - start;
    console.log("time taken: " + time);

    var stats = [
     {
      name: "Tokens",
      total: summary.TotalToken,
      icon: "fa-coins",
      color: "primary",
      link: "/tokens",
     },
     {
      name: "Dapps",
      total: summary.TotalDapp,
      icon: "fa-grip-horizontal",
      color: "secondary",
      link: "/dapps",
     },
     {
      name: "Contracts",
      total: summary.TotalContract,
      icon: "fa-file-alt",
      color: "success",
      link: "/contracts",
     },
     {
      name: "Blocks",
      total: summary.TotalBlock,
      icon: "fa-cube",
      color: "danger",
      link: "/blocks",
     },
     {
      name: "Transactions",
      total: summary.TotalTxn,
      icon: "fa-exchange-alt",
      color: "dark-light",
      link: "/transactions",
     },
     {
      name: "Addresses",
      total: summary.TotalAddress,
      icon: "fa-address-card",
      color: "primary",
      link: "/addresses",
     },
     {
      name: "TAU Price",
      total: "$" + parseFloat(summary.TAUPrice).toFixed(4),
      icon: "fa-dollar-sign",
      color: "secondary",
      link: "/",
     },
     {
      name: "Stamps per TAU",
      total: "65",
      icon: "fa-gas-pump",
      color: "success",
      link: "/",
     },
     {
      name: "Total Burned",
      total: parseFloat(summary.TotalBurned).toFixed(4) + " TAU",
      icon: "fa-fire",
      color: "danger",
      link: "/stats/burned",
     },
    ];

    return {
     summary,
     stats,
    };
   });
 }
</script>

<script>
 export let summary;
 export let stats;
 import { each } from "svelte/internal";
 import Metatag from "../components/Metatag.svelte";
 import { onMount } from "svelte";
 onMount(() => {
  document.getElementById("top_menu_item").selectedIndex = 0;
 });
</script>

<svelte:head>
 <title>Lamden dDapps & Smart Contract/Block Explorer</title>
 <meta property="og:url" content="{process.env.WEBSITE}" />
 <Metatag />
</svelte:head>
<br />

<div class="row">
 {#each stats as stat}
  <div class="p-2 m-5 col-sm">
   <a href="{stat.link}" class="card mw-full m-0 p-0 d-flex">
    <div class="w-100 h-100 m-5 align-self-center">
     <div
      class="w-100 h-100 rounded d-flex align-items-center justify-content-center bg-{stat.color}-lm"
     >
      <i
       class="fas {stat.icon} fa-4x text-white-lm text-{stat.color}-dm"
       aria-hidden="true"></i>
      <span class="sr-only">{stat.name}</span>
     </div>
    </div>
    <div
     class="flex-grow-1 overflow-y-hidden d-flex align-items-center position-relative h-120"
    >
     <div class="p-10 w-full m-auto">
      <p
       class="font-size-14 text-dark-lm text-light-dm m-0 mb-5 text-truncate font-weight-medium"
      >
       {stat.name}
      </p>
      <p class="font-size-{stat.name == 'Total Burned' ? 18 : 24} mt-5 mb-0">
       {stat.total}
      </p>
     </div>
    </div>
   </a>
  </div>
 {/each}
</div>

<div class="row">
 <div class="col pl-10 mb-0">
  <br />
  <h4>Featured DApps</h4>
 </div>
</div>
<div class="row">
 {#each summary.Contracts as contract}
  <div class="col-sm-6 col-lg-4 col-xl-3 ">
   <a href="/dapps/{contract.DappName.toLowerCase().split(' ').join('_')}">
    <div class="card p-0">
     <img
      src="{process.env.IMG_SERVER}/img/{contract.DappName.toLowerCase()
       .split(' ')
       .join('_')}_sm.png"
      class="img-fluid rounded-top"
      alt="{contract.DappName}"
     />
     <div class="content">
      <h2 class="content-title">
       {contract.DappName}
       <span class="badge badge-success">{contract.DappCategory}</span>
      </h2>
      <p class="text-muted">
       {contract.DappDescription}
      </p>
     </div>
    </div>
   </a>
  </div>
 {/each}
</div>

<style>
 .header_widget {
  color: white;
  padding: 20px;
  margin: 10px 5px;
  border-radius: 15px;
  box-shadow: 3px 3px 10px #00000026;
 }
 .header_widget_white {
  border-color: black solid 1px;
  background-color: white;
  color: #aaa;
 }
 .header_widget_blue {
  border-color: #0165ff solid 1px;
  background-color: #0165ff;
 }
 .no {
  font-size: 16px;
 }
 .no_big {
  font-size: 24px;
 }
 .black {
  color: black;
 }
</style>
