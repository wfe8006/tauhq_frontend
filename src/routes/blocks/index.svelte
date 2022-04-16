<script context="module">
 export function load({ params, url, query, session }) {
  var query = url.searchParams;
  var firstPage = 1;
  var prevPage = 1;
  var currentPage = 1;
  var nextPage = 1;
  var lastPage = 1;
  var url;
  var totalRecords = 0;
  if (query.get("page") > 1) {
   currentPage = parseInt(query.get("page"));
   url = import.meta.env.VITE_API_SERVER + "/blocks?page=" + currentPage;
  } else {
   url = import.meta.env.VITE_API_SERVER + "/blocks";
  }
  var totalRecords = 0;
  return fetch(url)
   .then((r) => r.json())
   .then((blocks) => {
    if (currentPage == 1) {
     totalRecords = blocks[0].ID;
    } else {
     totalRecords = blocks[0].ID + (currentPage - 1) * 25;
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
     props: {
      blocks,
      firstPage,
      prevPage,
      currentPage,
      nextPage,
      lastPage,
     },
    };
   });
 }
</script>

<script>
 import { numberWithCommas, timesince } from "$lib/utils";
 import Metatag from "$lib/Metatag.svelte";
 import Paginator from "$lib/Paginator.svelte";
 export let blocks;
 export let firstPage;
 export let prevPage;
 export let currentPage;
 export let nextPage;
 export let lastPage;
</script>

<svelte:head>
 <title>Lamden Blocks</title>
 <meta property="og:url" content="{import.meta.env.VITE_WEBSITE}/blocks" />
 <Metatag />
</svelte:head>

<div class="row">
 <h1>Blocks</h1>
</div>
<Paginator
 firstPage="{firstPage}"
 prevPage="{prevPage}"
 currentPage="{currentPage}"
 nextPage="{nextPage}"
 lastPage="{lastPage}"
 property="{'blocks'}"
/>
<div class="table-responsive">
 <table class="table table-outer-bordered">
  <thead>
   <tr>
    <th class="text-center">#</th>
    <th class="text-left">Hash</th>
    <th class="text-center">Date/Time</th>
    <th class="text-center">Txn</th>
   </tr>
  </thead>
  <tbody>
   {#each blocks as block}
    <tr>
     <td class="text-center"><a href="/blocks/{block.ID}">{block.ID}</a></td>
     <td class="text-left">{block.Hash.substring(0, 20) + "..."}</td>
     <td class="text-center">{timesince(block.Timestamp)}</td>
     <td class="text-center">{block.Txn}</td>
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
 property="{'blocks'}"
/>
