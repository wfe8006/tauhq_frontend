<script context="module">
 export function load({ params, query, session }) {
  var url;
  url = import.meta.env.VITE_API_SERVER + "/dapps";
  return fetch(url)
   .then((r) => r.json())
   .then((dapps) => {
    return {
     props: {
      dapps,
     },
    };
   });
 }
</script>

<script>
 import Metatag from "$lib/Metatag.svelte";
 export let dapps;
</script>

<svelte:head>
 <title>Lamden DApps</title>
 <meta property="og:url" content="{import.meta.env.VITE_WEBSITE}/dapps" />
 <Metatag />
</svelte:head>
<div class="row">
 <h1>DApps</h1>
</div>

<div class="container">
 <div class="row">
  {#each dapps as dapp}
   <div class="col-sm-6 col-lg-4 col-xl-3 ">
    <a href="/dapps/{dapp.Name.toLowerCase().split(' ').join('_')}">
     <div class="card p-0">
      <img
       src="{import.meta.env.VITE_IMG_SERVER}/img/{dapp.Name.toLowerCase()
        .split(' ')
        .join('_')}_sm.png"
       class="img-fluid rounded-top"
       alt="..."
      />

      <div class="content">
       <h2 class="content-title">
        {dapp.Name}
        <span class="badge badge-success">{dapp.Category}</span>
       </h2>

       <p class="text-muted">
        {dapp.Description}
       </p>
      </div>
     </div>
    </a>
   </div>
  {/each}
 </div>
</div>
