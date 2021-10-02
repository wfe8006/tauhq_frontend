<script context="module">
 export function preload({ params, query }, session) {
  var url;
  var chartName = params.slug;
  url = process.env.API_SERVER + "/stats/" + chartName;
  var chartTitle;
  if (chartName == "txns") {
   chartTitle = "Daily Txn Chart";
  } else if (chartName == "burned") {
   chartTitle = "Daily TAU Burnt Chart";
  } else if (chartName == "addresses") {
   chartTitle = "Daily Wallet Creation Chart";
  } else if (chartName == "users") {
   chartTitle = "Daily Active Users Chart";
  } else if (chartName == "txns_addresses") {
   chartTitle = "Daily Txn vs Daily Wallet Creation Chart";
  } else if (chartName == "tau_lost_forever") {
   chartTitle = "Numbers of TAUs that are probably lost forever";
  }

  if (chartName == "tau_lost_forever") {
   return this.fetch(url)
    .then((r) => r.json())
    .then((contracts) => {
     return { contracts, chartTitle, chartName };
    });
  } else {
   return this.fetch(url)
    .then((r) => r.json())
    .then((contracts) => {
     var dataArray = [];
     var dataset = contracts.ChartData;

     for (var i = 0; i < dataset.Datasets.length; i++) {
      var multiData = [];

      if (chartName == "burned") {
       for (var j = 0; j < dataset.Datasets[i].DataF.length; j++) {
        //[[date1, data1], [date2, data2], [...]]
        multiData[j] = [dataset.XData[j], dataset.Datasets[i].DataF[j]];
       }
      } else {
       for (var j = 0; j < dataset.Datasets[i].DataI.length; j++) {
        //[[date1, data1], [date2, data2], [...]]
        multiData[j] = [dataset.XData[j], dataset.Datasets[i].DataI[j]];
       }
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
     return { contracts, chartTitle, chartName };
    });
  }
 }
</script>

<script>
 export let chartName;
 export let contracts;
 export let chartTitle;
 export let totalBalance = 0;
 export let totalBalanceUSD = 0;
 export let totalPercentage = 0;

 import { getContext, onMount, afterUpdate } from "svelte";
 import Highcharts from "highcharts/highstock";
 import Metatag from "../../components/Metatag.svelte";
 import { numberWithCommas, timesince } from "../../js/utils";
 import { mode } from "../../components/store.js";
 var chartOptions;
 //https://stackoverflow.com/questions/64858904/how-to-trigger-a-function-when-there-is-a-value-change-in-subscribed-store-in-sv
 $: $mode, reloadPage();

 function reloadPage() {
  if (process.browser) {
   if ($mode != "default" && chartName != "tau_lost_forever") {
    location.reload();
   }
  } else {
   console.log("no");
  }
 }
 afterUpdate(() => {
  if (chartName == "tau_lost_forever") {
   for (var i = 0; i < contracts.length; i++) {
    totalBalance += parseFloat(contracts[i].Balance);
    totalBalanceUSD += parseFloat(contracts[i].BalanceUSD);
   }
   totalPercentage = (
    (totalBalance / 288090567.493886586209600228) *
    100
   ).toFixed(4);
  } else {
   chartOptions = {
    //for non-continuos date eg wallet not generated every day
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
    xAxis: [{ ordinal: false }],
    yAxis: [
     {
      gridLineColor: "#25282c",
      labels: {
       align: "left",
      },
      height: chartName == "users" ? "100%" : "70%",
      resize: {
       enabled: true,
      },
     },
     {
      gridLineColor: "#25282c",
      labels: {
       align: "left",
      },
      top: "70%",
      height: "30%",
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
     text: chartTitle,
    },
    series: contracts.ChartData,
   };
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
  }
 });
</script>

<svelte:head>
 <title>
  Lamden {chartTitle}</title
 >
 <meta property="og:url" content="{process.env.WEBSITE}/stats/{chartName}}" />
 <Metatag />
</svelte:head>
<div class="row">
 <h1>{chartTitle}</h1>
</div>

{#if chartName == "tau_lost_forever"}
 <div class="alert alert-danger p-20" role="alert">
  A Lamden address usually has 64 characters. This is a list of non-standard
  addresses and contract addresses have been excluded.
 </div>

 <br />

 <div class="table-responsive">
  <table class="table table-outer-bordered">
   <thead>
    <tr>
     <th class="text-center">#</th>
     <th class="text-left">Address</th>
     <th class="text-right">Balance TAU</th>
     <th class="text-right">Balance USD</th>
     <th class="text-right">Percentage</th>
    </tr>
   </thead>
   <tbody>
    {#each contracts as contract, i}
     <tr>
      <td class="text-center">{i + 1}</td>
      <td class="text-left"
       ><a href="/addresses/{encodeURI(contract.Address.trim())}"
        >{contract.Address.trim().length > 20
         ? contract.Address.trim().substring(20, 0) + "..."
         : contract.Address}</a
       ></td
      >
      <td class="text-right">{numberWithCommas(contract.Balance)}</td>
      <td class="text-right">${numberWithCommas(contract.BalanceUSD)}</td>
      <td class="text-right">
       {((contract.Balance / 288090567.493886586209600228) * 100).toFixed(
        4
       )}%</td
      >
     </tr>
    {/each}
    <tr>
     <td class="text-center">&nbsp;</td>
     <td class="text-left"><b>Total Coins Lost</b></td>
     <td class="text-right"><b>{numberWithCommas(totalBalance)}</b></td>
     <td class="text-right"><b>${numberWithCommas(totalBalanceUSD)}</b></td>
     <td class="text-right" width="10%"><b>{totalPercentage}%</b></td>
    </tr>
   </tbody>
  </table>
 </div>
{:else}
 <div>
  {#if chartName == "users"}
   <div class="alert alert-success p-20" role="alert">
    The number of unique addresses seen in all transactions per day, including
    sender and recipient address. Airdop to multiple addresses will increase
    this number.
   </div>
  {:else if chartName == "addresses"}
   <div class="alert alert-success p-20" role="alert">
    Based on the first transaction date of a wallet address
   </div>
  {:else if chartName == "burned"}
   <div class="alert alert-success p-20" role="alert">
    Currently <b>1%</b> of the stamps used in each transaction is burned
    <br />
    <a
     href="https://masternode-01.lamden.io/contracts/rewards/S?key=value"
     target="_blank"
     rel="noopener"
     >https://masternode-01.lamden.io/contracts/rewards/S?key=value</a
    ><br />
    <a
     href="https://github.com/Lamden/lamden/blob/1d0c88d239556058863a1f0195b0ce8344a4efee/lamden/rewards.py#L105"
     target="_blank"
     rel="noopener"
     >https://github.com/Lamden/lamden/blob/1d0c88d239556058863a1f0195b0ce8344a4efee/lamden/rewards.py#L105</a
    >
   </div>
  {/if}
  <br />

  <div
   id="container"
   style="min-width: 310px; height: 700px; margin: 0 auto"
  ></div>
 </div>
{/if}
