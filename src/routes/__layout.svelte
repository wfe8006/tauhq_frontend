<script>
 import Nav from "$lib/header/Nav.svelte";

 import "../app.css";
</script>

<svelte:head>
 <meta name="keyword" content="{import.meta.env.VITE_META_KEYWORD}" />
 <meta name="description" content="{import.meta.env.VITE_META_DESCRIPTION}" />
 <meta property="og:type" content="website" />
 <meta property="og:site_name" content="{import.meta.env.VITE_SITE_NAME}" />
 <script
  async
  src="https://www.googletagmanager.com/gtag/js?id={import.meta.env
   .VITE_GTAG}"></script>
 <script
  data-ad-client="ca-pub-{import.meta.env.VITE_ADSENSE}"
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
</svelte:head>

<Nav />

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
     href="https://twitter.com/{import.meta.env.VITE_TWITTER_PROFILE}"
    >
     <h5>
      <i class="fab fa-twitter"></i> &nbsp;@{import.meta.env
       .VITE_TWITTER_PROFILE}
     </h5></a
    >
   </div>
   <div class="p-10">
    <a
     class="donation"
     href="/addresses/{import.meta.env.VITE_TAU_DONATION_ADDRESS}"
    >
     <h5><i class="fa fa-heart"></i> &nbsp;Donation</h5>
    </a>
   </div>
  </div>
 </footer>
</div>
