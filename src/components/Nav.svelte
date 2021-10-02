<script>
 export let segment;
 let keyword;
 let notFound = 0;
 let searchType;
 import { onMount } from "svelte";
 import { mode } from "./store.js";
 import { goto, stores } from "@sapper/app";
 export let showSearch;
 showSearch = 0;

 const navigate = (route) => {
  window.location.href = route;
  goto(route);
 };

 const handleClick = async () => {
  notFound = 0;
  var url = process.env.API_SERVER + "/search?keyword=" + keyword;
  let result = await fetch(url).then((res) => res.json());
  if (result.Type == "notfound") {
   notFound = 1;
  } else {
   window.location.href = result.Type;
   return;
  }
  notFound = 1;
 };

 function updateBackgroundColor() {
  halfmoon.toggleDarkMode();
  if (halfmoon.getPreferredMode() == "dark-mode") {
   mode.set("dark-mode");
  } else {
   mode.set("light-mode");
  }
 }

 function changeroute() {
  var page = document.getElementById("top_menu_item").value;
  goto("/" + page);
 }

 function closeMenu() {
  const menu = document.getElementById("modal_top_menu");
  menu.click();
 }

 function showSearchHandler() {
  if (showSearch == 1) {
   showSearch = 0;
  } else {
   showSearch = 1;
  }
 }
</script>

<nav class="navbar navbar-expand-lg fixed-top ">
 <div class="container-fluid">
  <a class="logo text-white-dm" href="/">{process.env.SITE_NAME}</a>
  &nbsp;&nbsp;
  <select
   class="form-control form-control-lg ms-auto d-flex flex-row d-block d-md-none"
   style="width:100px;"
   id="top_menu_item"
   on:change="{changeroute}"
  >
   <option value="" selected="selected">Home</option>
   <option value="stats">Stats</option>
   <option value="tokens">Tokens</option>
   <option value="dapps">DApps</option>
   <option value="contracts">Contracts</option>
   <option value="blocks">Blocks</option>
   <option value="transactions">Transactions</option>
   <option value="addresses">Addresses</option>
  </select>

  <span class="ml-auto d-none d-md-block">
   <a class="pr-15" href="/stats"
    ><span
     class:text-primary-dm="{segment === 'stats'}"
     class:text-primary="{segment === 'stats'}"
     class="text-white-dm font-weight-bold">Stats</span
    ></a
   >
   <a class="pr-15 link-secondary " href="/tokens"
    ><span
     class:text-primary-dm="{segment === 'tokens'}"
     class:text-primary="{segment === 'tokens'}"
     class="text-white-dm font-weight-bold">Tokens</span
    ></a
   >
   <a class="pr-15" href="/dapps"
    ><span
     class:text-primary-dm="{segment === 'dapps'}"
     class:text-primary="{segment === 'dapps'}"
     class="text-white-dm font-weight-bold">DApps</span
    ></a
   >
   <a class="pr-15" href="/contracts"
    ><span
     class:text-primary-dm="{segment === 'contracts'}"
     class:text-primary="{segment === 'contracts'}"
     class="text-white-dm font-weight-bold">Contracts</span
    ></a
   >
   <a class="pr-15" href="/blocks"
    ><span
     class:text-primary-dm="{segment === 'blocks'}"
     class:text-primary="{segment === 'blocks'}"
     class="text-white-dm font-weight-bold">Blocks</span
    ></a
   >
   <a class="pr-15" href="/transactions"
    ><span
     class:text-primary-dm="{segment === 'transactions'}"
     class:text-primary="{segment === 'transactions'}"
     class="text-white-dm font-weight-bold">Transactions</span
    ></a
   >
   <a class="pr-15" href="/addresses"
    ><span
     class:text-primary-dm="{segment === 'addresses'}"
     class:text-primary="{segment === 'addresses'}"
     class="text-white-dm font-weight-bold">Addresses</span
    ></a
   >
  </span>

  <ul class="navbar-nav ms-auto d-flex flex-row d-block d-lg-none">
   <button class="btn btn-square" type="button" on:click="{showSearchHandler}">
    <i class="fa fa-search" aria-hidden="true"></i>
   </button>
  </ul>

  <div class="form-inline ms-auto d-none d-lg-block">
   <div class="input-group">
    <input
     class="form-control"
     type="text"
     placeholder="Txn Hash / Block Number / Address / Contract Name / Token"
     name="search"
     bind:value="{keyword}"
     on:keyup="{(e) => e.key === 'Enter' && handleClick()}"
    />
    <div class="input-group-append">
     <button class="btn" on:click="{handleClick}">
      <i class="fa fa-search"></i>
     </button>
    </div>
   </div>
  </div>
  <div class="ml-auto">
   <button
    class="btn btn-square"
    type="button"
    on:click="{updateBackgroundColor}"
   >
    <i class="far fa-moon" aria-hidden="true"></i>
    <span class="sr-only">Toggle dark mode</span>
   </button>
  </div>
 </div>
</nav>

<div class="alert {showSearch === 1 ? '' : 'd-none'}" role="alert">
 <div class="input-group">
  <input
   class="form-control"
   type="text"
   placeholder="Txn Hash / Block Number / Address / Contract Name / Token"
   name="search"
   bind:value="{keyword}"
   on:keyup="{(e) => e.key === 'Enter' && handleClick()}"
  />
  <div class="input-group-append">
   <button class="btn" on:click="{handleClick}">
    <i class="fa fa-search"></i>
   </button>
  </div>
 </div>
</div>

{#if notFound == 1}
 <div class="row alert">
  <div class="12 col">Not found</div>
 </div>
{/if}

<style>
 .alert {
  font-size: 16px;
  font-weight: bold;
  color: red;
 }
</style>
