<script context="module">
 export function preload({ params, query }, session) {
  var url;
  url = process.env.API_SERVER + "/dapps/" + params.slug;
  return this.fetch(url)
   .then((r) => r.json())
   .then((contracts) => {
    var dataArray = [];
    var dataset = contracts.ChartData;
    for (var i = 0; i < dataset.Datasets.length; i++) {
     var multiData = [];
     for (var j = 0; j < dataset.Datasets[i].DataI.length; j++) {
      //[[date1, data1], [date2, data2], [...]]
      multiData[j] = [dataset.XData[j], dataset.Datasets[i].DataI[j]];
     }
     var obj;
     obj = {
      name: dataset.Datasets[i].Name,
      data: multiData,
      type: dataset.Datasets[i].Type,
      yAxis: dataset.Datasets[i].Axis == "y" ? 1 : 0,
      tooltip: {
       valueDecimals: dataset.Datasets[i].Decimal,
       valuePrefix:
        "Prefix" in dataset.Datasets[i] ? dataset.Datasets[i].Prefix : null,
       valueSuffix:
        "Suffix" in dataset.Datasets[i] ? dataset.Datasets[i].Suffix : null,
      },
     };
     dataArray[i] = obj;
    }
    contracts.ChartData = dataArray;

    var stats = [
     {
      name: "Transactions",
      daily: "DailyTxn" in contracts ? contracts.DailyTxn : 0,
      total: contracts.TotalAddresses,
      icon: "fa-exchange-alt",
      color: "primary",
     },
     {
      name: "Users",
      daily: "DailyAddresses" in contracts ? contracts.DailyAddresses : 0,
      total: contracts.TotalAddresses,
      icon: "fa-user-friends",
      color: "secondary",
     },
     {
      name: "Stamps",
      daily: "DailyStampsUsed" in contracts ? contracts.DailyStampsUsed : 0,
      total: contracts.TotalStampsUsed,
      icon: "fa-gas-pump",
      color: "danger",
     },
    ];

    return { contracts, stats };
   });
 }
</script>

<script>
 export let contracts;
 export let stats;
 import { onMount, afterUpdate } from "svelte";
 import Highcharts from "highcharts/highstock";
 import { mode } from "../../components/store.js";

 //https://stackoverflow.com/questions/64858904/how-to-trigger-a-function-when-there-is-a-value-change-in-subscribed-store-in-sv
 $: $mode, reloadPage();

 function reloadPage() {
  if (process.browser) {
   if ($mode != "default") {
    location.reload();
   }
  } else {
   console.log("no");
  }
 }

 var chartOptions = {
  rangeSelector: {
   inputBoxBorderColor: "#000000",
   inputStyle: {
    color: "#000000",
    fontWeight: "bold",
   },
  },
  chart: {
   backgroundColor: "#ffffff",
  },
  yAxis: [
   {
    gridLineColor: "#25282c",
    labels: {
     align: "left",
    },
    height: "80%",
    resize: {
     enabled: true,
    },
   },
   {
    gridLineColor: "#25282c",
    labels: {
     align: "left",
    },
    top: "80%",
    height: "20%",
    offset: 0,
   },
  ],
  plotOptions: {
   series: {
    dataGrouping: {
     smoothed: true,
    },
   },
  },
  credits: {
   enabled: false,
  },
  legend: {
   enabled: true,
  },
  title: {
   text: "Transactions stats for " + contracts.DappName,
  },
  series: contracts.ChartData,
 };

 afterUpdate(() => {
  if (halfmoon.getPreferredMode() == "dark-mode") {
   chartOptions.rangeSelector.inputBoxBorderColor = "#ffffff";
   chartOptions.rangeSelector.inputStyle.color = "#ffffff;";
   chartOptions.chart.backgroundColor = "#000000";
  } else {
   chartOptions.rangeSelector.inputBoxBorderColor = "#000000";
   chartOptions.rangeSelector.inputStyle.color = "#000000;";
   chartOptions.chart.backgroundColor = "#ffffff";
  }
  Highcharts.stockChart("container", chartOptions);
 });
</script>

<svelte:head>
 <title>{contracts.DappName}</title>
 <meta
  property="og:url"
  content="{process.env.WEBSITE}/dapps/{contracts.DappName}"
 />
 <meta
  property="og:image"
  content="{process.env.IMG_SERVER}/img/{contracts.DappName.toLowerCase()
   .split(' ')
   .join('_')}_lg.png"
 />
 <meta name="twitter:card" content="summary_large_image" />
 <meta
  name="twitter:image"
  content="{process.env.IMG_SERVER}/img/{contracts.DappName.toLowerCase()
   .split(' ')
   .join('_')}_lg.png"
 />
 <meta name="description" content="{contracts.DappDescription}" />
</svelte:head>

<div class="row">
 <div class="col m-0 p-0 d-flex">
  <div class="my-20 w-110 h-110 m-10 ">
   <img
    class="dapp_logo rounded"
    src="{contracts.Logo}"
    alt="{contracts.DappName}"
   />
  </div>
  <div class="flex-grow-1 overflow-y-hidden d-flex position-relative">
   <div class="w-full">
    <h3 class="dapp_title">
     {contracts.DappName}
     <span class="badge badge-success">{contracts.DappCategory}</span>
    </h3>
    <p class="dapp_description">{contracts.DappDescription}</p>
    <a target="_blank" href="{contracts.Website}"
     ><button class="btn btn-danger btn-md">Visit Website</button></a
    >
   </div>
  </div>
 </div>
</div>
<br />
<div class="row">
 <div class="col">
  <img
   class="img-fluid"
   src="{process.env.IMG_SERVER}/img/{contracts.DappName.toLowerCase()
    .split(' ')
    .join('_')}_lg.png"
   alt="{contracts.DappName}"
  />
 </div>
</div>

<br />
<h4>Charts</h4>
<div>
 <div
  id="container"
  style="min-width: 310px; height: 700px; margin: 0 auto"
 ></div>
</div>

<br />
<h4>Statistics</h4>
<div class="row">
 {#each stats as stat}
  <div class="p-2 m-5 col-sm">
   <div class="card mw-full m-0 p-0 d-flex">
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
       {stat.name} <span class="text-success">24h</span>/<span
        class="text-very-dark">Total</span
       >
      </p>
      <p class="font-size-24 mt-5 mb-0 text-success">
       {stat.daily}
      </p>
      <p class="font-size-24 mt-5 mb-0 text-very-dark">
       {stat.total}
      </p>
     </div>
    </div>
   </div>
  </div>
 {/each}
</div>

<br />
<h4>Contracts Used</h4>
<div class="row">
 <div class="col break">
  {#if contracts.DappName == "RocketSwap"}
   <a href="/contracts/con_rocketswap_official_v1_1"
    >con_rocketswap_official_v1_1</a
   ><br />
   <a href="/contracts/con_simple_staking_tau_rswp_001"
    >con_simple_staking_tau_rswp_001</a
   ><br />
   <a href="/contracts/con_staking_rswp_rswp">con_staking_rswp_rswp</a><br />
  {:else if contracts.DappName == "Lamden Bot"}
   <a href="/contracts/con_dice001">con_dice001</a><br />
   <a href="/contracts/con_gold_flip">con_gold_flip</a><br />
   <a href="/contracts/con_gold_ticket_003">con_gold_ticket_003</a><br />
   <a href="/contracts/con_multisend2">con_multisend2</a><br />
  {:else}
   <a href="/contracts/{contracts.ContractName}">{contracts.ContractName}</a>
  {/if}
 </div>
</div>

<br />

<style>
 * {
  box-sizing: border-box;
 }

 .eee {
  vertical-align: top;
 }

 .dapp_logo {
  height: 120px;
  width: 120px;
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

 .stats {
  color: #aaa;
  font-weight: bold;
 }

 h3.dapp_title {
  margin-bottom: 0px;
 }

 p.dapp_description {
  margin-top: 2px;
  margin-bottom: 2px;
 }
</style>
