<script context="module">
 export function preload({ params, query }, session) {
  var url;
  var hasData = 0;
  url = process.env.API_SERVER + "/tokens/" + params.slug + "/chart";
  return this.fetch(url)
   .then((r) => r.json())
   .then((contracts) => {
    var dataArray = [];
    var dataset = contracts.ChartData;
    for (var i = 0; i < dataset.Datasets.length; i++) {
     var multiData = [];
     if ("DataF" in dataset.Datasets[i]) {
      hasData = 1;
      for (var j = 0; j < dataset.Datasets[i].DataF.length; j++) {
       //[[date1, data1], [date2, data2], [...]]
       multiData[j] = [dataset.XData[j], dataset.Datasets[i].DataF[j]];
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
    }
    contracts.ChartData = dataArray;
    return { contracts, hasData, contractName: params.slug };
   });
 }
</script>

<script>
 export let contractName;
 export let contracts;
 export let hasData;
 import { getContext, onMount, afterUpdate } from "svelte";
 import Highcharts from "highcharts/highstock";
 import { mode } from "../../../components/store.js";
 var chartOptions;

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

 if (hasData == 1) {
  var chartTitle =
   getContext("token_name") +
   " (" +
   getContext("token_symbol") +
   ") token DEX Chart";

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
    text: chartTitle,
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
 }
</script>

<svelte:head>
 <title>
  {getContext("token_name")} ({getContext("token_symbol")}) token</title
 >
 <meta
  property="og:url"
  content="{process.env.WEBSITE}/tokens/{getContext('token_name')}"
 />
 <meta
  name="description"
  content="{contractName == 'con_weth_lst001'
   ? 'Circulating Supply'
   : 'Total Supply'}: {getContext('total_supply')}"
 />
</svelte:head>

<hr />

<div>
 {#if hasData == 1}
  <div
   id="container"
   style="min-width: 310px; height: 700px; margin: 0 auto"
  ></div>
 {:else}
  <h6>No data</h6>
 {/if}
</div>

<br />

<style>
 * {
  box-sizing: border-box;
 }
</style>
