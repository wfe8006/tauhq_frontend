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
   url = process.env.API_SERVER + "/tokens?page=" + currentPage;
  } else {
   url = process.env.API_SERVER + "/tokens";
  }
  var totalRecords = 0;
  return this.fetch(url)
   .then((r) => r.json())
   .then((tokens) => {
    if (currentPage == 1) {
     totalRecords = tokens[0].ID;
    } else {
     totalRecords = tokens[0].ID + (currentPage - 1) * 25;
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
     tokens,
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
 export let tokens;
 export let firstPage;
 export let prevPage;
 export let currentPage;
 export let nextPage;
 export let lastPage;
</script>

<svelte:head>
 <title>Lamden TAU Tokens</title>
 <meta property="og:url" content="{process.env.WEBSITE}/tokens" />
</svelte:head>
<div class="row">
 <h1>Tokens</h1>
</div>
<!--
<Paginator
  {firstPage}
  {prevPage}
  {currentPage}
  {nextPage}
  {lastPage}
  property={"tokens"}
/>
//-->

<div class="table-responsive">
 <table class="table table-outer-bordered">
  <thead>
   <tr>
    <th class="text-center">#</th>
    <th class="text-left">Token Name</th>
   </tr>
  </thead>
  <tbody>
   {#each tokens as token, i}
    <tr>
     <td class="text-center" width="5%">
      <object
       data="{process.env.IMG_SERVER}/img/token_logo/{token.TokenContract}.jpg"
       type="image/jpg"
       class="token_logo"
       aria-label="{token.TokenName}"
      >
       <img
        src="{process.env.IMG_SERVER}/img/token_logo/unknown.svg"
        alt="no image"
        class="token_logo"
       />
      </object>
     </td>
     <td class="text-left">
      <a href="/tokens/{token.TokenContract}">{token.TokenName}</a>
      <span class="success">{token.TokenSymbol.toUpperCase()}</span>
     </td>
    </tr>
   {/each}
  </tbody>
 </table>
</div>

<!--
<Paginator
  {firstPage}
  {prevPage}
  {currentPage}
  {nextPage}
  {lastPage}
  property={"tokens"}
/>
//-->
<style>
 .token_logo {
  border-radius: 50%;
  height: 30px;
  width: 30px;
 }
</style>
