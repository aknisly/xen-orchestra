<template>
  <li class="infra-loading-item">
    <div class="infra-item-label-placeholder">
      <div class="link-placeholder">
        <UiIcon :icon="icon" class="icon" />
        <div class="loader">&nbsp;</div>
      </div>
    </div>
  </li>
</template>

<script lang="ts" setup>
import UiIcon from "@/components/ui/UiIcon.vue";
import type { IconDefinition } from "@fortawesome/fontawesome-common-types";

defineProps<{
  icon: IconDefinition;
}>();
</script>

<style lang="postcss" scoped>
.infra-item-label-placeholder {
  display: flex;
  height: 6rem;
  margin-bottom: 0.2rem;
  background-color: var(--background-color-primary);
}

.icon {
  color: var(--color-blue-scale-100);
}

.link-placeholder {
  display: flex;
  align-items: center;
  flex: 1;
  padding: 0 1.5rem;
  gap: 1rem;
}

.loader {
  flex: 1;
  animation: pulse alternate 1s infinite;
  background-color: var(--background-color-extra-blue);
}

@keyframes pulse {
  0% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
}
</style>
