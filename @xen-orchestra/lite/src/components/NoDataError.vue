<template>
  <div class="no-data">
    <img alt="No data" class="img" src="../assets/undraw-bug-fixing.svg" />
    <p class="error-text">{{ $t("error-no-data") }}</p>
  </div>
</template>

<style scoped lang="postcss">
.no-data {
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
.error-text {
  margin: auto;
  width: 8em;
  height: 3.75em;
  font-family: "Poppins";
  font-style: normal;
  font-weight: 500;
  font-size: 1.25em;
  line-height: 150%;
  color: var(--color-red-vates-base);
}
</style>
