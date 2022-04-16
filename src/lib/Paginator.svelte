<script>
  export let firstPage;
  export let prevPage;
  export let currentPage;
  export let nextPage;
  export let lastPage;
  export let property;
</script>

<ul class="pagination text-right">
  <li class="page-item {currentPage == firstPage ? 'disabled' : ''}">
    {#if currentPage == firstPage}
      <a href={"#"} class="page-link" tabindex="-1">First</a>
    {:else}
      <a href="/{property}?page={firstPage}" class="page-link">First </a>
    {/if}
  </li>
  <li class="page-item">
    <a href="/{property}?page={prevPage}" class="page-link">&#60;</a>
  </li>
  <li class="page-item active">
    <a href={"#"} class="page-link" tabindex="-1">{currentPage}</a>
  </li>
  <li class="page-item">
    <a href="/{property}?page={nextPage}" class="page-link">&#62;</a>
  </li>
  <li class="page-item {currentPage == lastPage ? 'disabled' : ''}">
    {#if currentPage == lastPage}
      <a href={"#"} class="page-link" tabindex="-1">Last</a>
    {:else}
      <a href="/{property}?page={lastPage}" class="page-link">Last</a>
    {/if}
  </li>
</ul>
