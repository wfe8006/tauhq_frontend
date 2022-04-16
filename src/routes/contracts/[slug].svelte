<script context="module">
 export function load({ params, url, query, session }) {
  var query = url.searchParams;
  var url;
  url = import.meta.env.VITE_API_SERVER + "/contracts/" + params.slug;
  return fetch(url)
   .then((r) => r.json())
   .then((contracts) => {
    return { props: { contracts } };
   });
 }
</script>

<script>
 export let contracts;
 import { onMount, afterUpdate } from "svelte";
 import Metatag from "$lib/Metatag.svelte";
 function formatCode(code) {
  var codeXML = code.replace(/__/gi, "");
  var formattedCode = codeXML.split("\n");
  return formattedCode;
 }

 function timesince(timestamp) {
  //timestamp in milliseconds so * 1000
  if (timestamp == 0) {
   return "-";
  }
  const dateObject = new Date(timestamp * 1000);
  const humanDateFormat = dateObject.toLocaleString();
  var diff;
  diff = Date.now() / 1000 - timestamp;
  var interval;
  interval = diff / 86400;
  if (interval > 1) {
   return Math.floor(interval) + " days ago - " + humanDateFormat + " UTC+0";
  }
  interval = diff / 3600;
  if (interval > 1) {
   return Math.floor(interval) + " hrs ago - " + humanDateFormat + " UTC+0";
  }
  interval = diff / 60;
  if (interval > 1) {
   return Math.floor(interval) + " mins ago - " + humanDateFormat + " UTC+0";
  }
  return Math.floor(diff) + " secs ago - " + humanDateFormat + " UTC+0";
 }
</script>

<svelte:head>
 <title>Lamden Contract {contracts.ContractName}</title>
 <meta
  property="og:url"
  content="{import.meta.env.WEBSITE}/contracts/{contracts.ContractName}"
 />
 <Metatag />
</svelte:head>
<div class="row">
 <h1>Contract {contracts.ContractName}</h1>
</div>

<div class="table-responsive">
 <table class="table table-outer-bordered">
  <tbody>
   {#if "ContractCreator" in contracts}
    <tr>
     <td class="font-weight-bold" width="10%">Creator</td>
     <td>
      <a href="/addresses/{contracts.ContractCreator}"
       >{contracts.ContractCreator}</a
      ></td
     >
    </tr>
   {/if}
   {#if "TXHash" in contracts}
    <tr>
     <td class="font-weight-bold">Creation Hash</td>
     <td>
      <a href="/transactions/{contracts.TXHash}">{contracts.TXHash}</a>
     </td>
    </tr>
   {/if}
   {#if contracts.ContractCreated != 0}
    <tr>
     <td class="font-weight-bold">Created On</td>
     <td>{timesince(contracts.ContractCreated)} </td>
    </tr>
   {/if}
  </tbody>
 </table>
</div>
<br />

<div class="row">
 <div class="12 col bold"><h3>Contract Code</h3></div>
</div>
<div class="bytecode">
 <pre><code>
  <div class="Box-body blob-wrapper data">
    <table class="code tab-size" data-tab-size="8">
      <tbody>
        {#each formatCode(contracts.ContractCode) as line, key}
       <tr>
            <td class="blob_num text-white-dm bg-white-lm bg-black-dm"
         >{key + 1}</td
        >
            <td
         class="blob_code blob_code_inner text-white-dm bg-white-lm bg-black-dm"
         >{line}</td
        >
          </tr>
      {/each}
      </tbody>
    </table>
  </div>
  </code></pre>
</div>
<br />
{#if "ByteCode" in contracts}
 <div class="row">
  <div class="12 col bold"><h3>Byte Code</h3></div>
 </div>
 <div class="bytecode">
  <pre><code>{contracts.ByteCode}</code></pre>
 </div>
{/if}

<style>
 .code td {
  padding: 0 0 0 2em;
  border-bottom: 0;
 }

 .blob_num {
  width: 1%;
  min-width: 50px;
  padding-right: 10px;
  padding-left: 10px;
  font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
  font-size: 12px;
  line-height: 20px;
  color: rgba(27, 31, 35, 0.3);
  text-align: right;
  white-space: nowrap;
  vertical-align: top;
  cursor: pointer;
  user-select: none;
 }

 .blob_code_inner {
  overflow: visible;
  font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
  font-size: 12px;
  color: #24292e;
  /* word-wrap: normal; */
  white-space: pre;
 }

 .blob_code {
  position: relative;
  padding-right: 10px;
  padding-left: 10px;
  line-height: 20px;
  vertical-align: top;
 }

 .tab-size[data-tab-size="8"] {
  -moz-tab-size: 8;
  tab-size: 8;
 }

 table.code {
  border-spacing: 0;
  border-collapse: collapse;
 }

 .Box-body:last-of-type {
  margin-bottom: -1px;
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 6px;
 }
 .blob-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
 }

 .p-0 {
  padding: 0 !important;
 }

 .Box-body {
  padding: 16px;
  border-bottom: 1px solid #e1e4e8;
 }

 * {
  box-sizing: border-box;
 }

 pre {
  white-space: pre-wrap; /* Since CSS 2.1 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
 }

 div.bytecode {
  height: 400px;
  overflow: scroll;
 }
</style>
