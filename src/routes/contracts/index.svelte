<script context="module">
 export function preload({ params, query }, session) {
  var firstPage = 1;
  var prevPage = 1;
  var currentPage = 1;
  var nextPage = 1;
  var lastPage = 1;
  var url;
  var totalRecords = 0;
  if (query.page > 1) {
   currentPage = parseInt(query.page);
   url = process.env.API_SERVER + "/contracts?page=" + currentPage;
  } else {
   url = process.env.API_SERVER + "/contracts";
  }
  var totalRecords = 0;
  return this.fetch(url)
   .then((r) => r.json())
   .then((contracts) => {
    if (currentPage == 1) {
     totalRecords = contracts[0].ID;
    } else {
     totalRecords = contracts[0].ID + (currentPage - 1) * 25;
    }
    lastPage = Math.ceil(totalRecords / 25);
    if (currentPage == lastPage) {
     nextPage = lastPage;
    } else {
     nextPage = currentPage + 1;
    }
    if (currentPage == 1) {
     prevPage = 1;
    } else {
     prevPage = currentPage - 1;
    }
    return {
     contracts,
     firstPage,
     prevPage,
     currentPage,
     nextPage,
     lastPage,
    };
   });
 }
</script>

<script>
 import Paginator from "../../components/Paginator.svelte";
 import Metatag from "../../components/Metatag.svelte";
 export let contracts;
 export let firstPage;
 export let prevPage;
 export let currentPage;
 export let nextPage;
 export let lastPage;
</script>

<svelte:head>
 <title>Lamden Contracts</title>
 <meta property="og:url" content="{process.env.WEBSITE}/contracts" />
 <Metatag />
</svelte:head>
<div class="row">
 <h1>Contracts</h1>
</div>
<Paginator
 firstPage="{firstPage}"
 prevPage="{prevPage}"
 currentPage="{currentPage}"
 nextPage="{nextPage}"
 lastPage="{lastPage}"
 property="{'contracts'}"
/>

<div class="table-responsive">
 <table class="table table-outer-bordered">
  <thead>
   <tr>
    <th class="text-center">#</th>
    <th class="text-left">Contract Name</th>
   </tr>
  </thead>
  <tbody>
   {#each contracts as contract, i}
    <tr>
     <td class="text-center" width="5%">{contract.ID}</td>
     <td class="text-left">
      <a href="/contracts/{contract.ContractName}">{contract.ContractName}</a>
     </td>
    </tr>
   {/each}
  </tbody>
 </table>
</div>
<br />
<Paginator
 firstPage="{firstPage}"
 prevPage="{prevPage}"
 currentPage="{currentPage}"
 nextPage="{nextPage}"
 lastPage="{lastPage}"
 property="{'contracts'}"
/>
