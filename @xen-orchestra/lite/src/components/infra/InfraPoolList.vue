<template>
  <ul class="infra-pool-list">
    <InfraLoadingItem
      v-if="!isReady || pool === undefined"
      :icon="faBuilding"
    />
    <li v-else class="infra-pool-item">
      <InfraItemLabel
        :icon="faBuilding"
        :route="{ name: 'pool.dashboard', params: { uuid: pool.uuid } }"
        active
      >
        {{ pool.name_label || "(Pool)" }}
      </InfraItemLabel>

      <InfraHostList />

      <InfraVmList />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { faBuilding } from "@fortawesome/free-regular-svg-icons";
import InfraHostList from "@/components/infra/InfraHostList.vue";
import InfraItemLabel from "@/components/infra/InfraItemLabel.vue";
import InfraLoadingItem from "@/components/infra/InfraLoadingItem.vue";
import InfraVmList from "@/components/infra/InfraVmList.vue";
import { usePoolStore } from "@/stores/pool.store";

const poolStore = usePoolStore();
const { pool, isReady } = storeToRefs(poolStore);
</script>

<style lang="postcss" scoped>
.infra-pool-list {
  font-size: 1.6rem;
  font-weight: 500;
}

.infra-vm-list:deep(.link) {
  padding-left: 3rem;
}
</style>
