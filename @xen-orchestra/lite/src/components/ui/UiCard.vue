<template>
  <div class="ui-card ui-card-backgroud">
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
.ui-card {
  height: fit-content;
  padding: 2.1rem;
  border-radius: 0.8rem;
  box-shadow: var(--shadow-200);
}

.ui-card-backgroud {
  background-color: var(--background-color-primary);
}
.ui-card-backgroud-error {
  background-color: var(--background-color-red-vates);
}
</style>
