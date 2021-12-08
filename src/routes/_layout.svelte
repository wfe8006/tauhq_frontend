<script>
 import Nav from "../components/Nav.svelte";

 export let segment;

 import { onMount } from "svelte";
 onMount(() => {
  window.dataLayer = window.dataLayer || [];
  function gtag() {
   dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", process.env.GTAG);
 });
</script>

<svelte:head>
 <meta name="keyword" content="{process.env.META_KEYWORD}" />
 <meta name="description" content="{process.env.META_DESCRIPTION}" />
 <meta property="og:type" content="website" />
 <meta property="og:site_name" content="{process.env.SITE_NAME}" />
 <script
  async
  src="https://www.googletagmanager.com/gtag/js?id={process.env.GTAG}"></script>
 <script
  data-ad-client="ca-pub-{process.env.ADSENSE}"
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
</svelte:head>

<header>
 <Nav segment="{segment}" />
</header>
<div class="container-lg p-10">
 <main>
  <slot />
 </main>
 <br />
 <hr />
 <footer>
  <div class="d-flex flex-row bd-highlight mb-3">
   <div class="p-10">
    <a
     class="twitter"
     target="_blank"
     href="https://twitter.com/{process.env.TWITTER_PROFILE}"
    >
     <h5>
      <i class="fab fa-twitter"></i> &nbsp;@{process.env.TWITTER_PROFILE}
     </h5></a
    >
   </div>
   <div class="p-10">
    <a class="donation" href="/addresses/{process.env.TAU_DONATION_ADDRESS}">
     <h5><i class="fa fa-heart"></i> &nbsp;Donation</h5>
    </a>
   </div>
  </div>
 </footer>
</div>
