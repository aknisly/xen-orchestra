<template>
  <div class="noData">
    <img alt="No data" class="img" src="../assets/undraw_bug_fixing.svg" />
    <p class="errorText">{{ $t("error-no-data") }}</p>
  </div>
</template>

<style scoped lang="postcss">
.nodata {
  text-align: center;
}

.img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1em;
  width: 17em;
  height: 13em;
}
.errorText {
  margin: auto;
  width: 8em;
  height: 3.75em;
  font-family: "Poppins";
  font-style: normal;
  font-weight: 500;
  font-size: 1.25em;
  line-height: 150%;
  text-align: center;
  color: var(--color-red-vates-base);
}
</style>
