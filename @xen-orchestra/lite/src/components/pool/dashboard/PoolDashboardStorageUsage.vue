<template>
  <UiCard>
    <UiCardTitle
      :left="$t('storage-usage')"
      :right="$t('top-#', { n: N_ITEMS })"
    />
    <UsageBar
      :data="srStore.isReady ? data.result : undefined"
      :nItems="N_ITEMS"
    >
      <template #footer>
        <SizeStatsSummary :size="data.maxSize" :usage="data.usedSize" />
      </template>
    </UsageBar>
  </UiCard>
</template>

<script lang="ts" setup>
import UiCardTitle from "@/components/ui/UiCardTitle.vue";
import { computed } from "vue";
import SizeStatsSummary from "@/components/ui/SizeStatsSummary.vue";
import UsageBar from "@/components/UsageBar.vue";
import UiCard from "@/components/ui/UiCard.vue";
import { useSrStore } from "@/stores/storage.store";
import { N_ITEMS } from "@/views/pool/PoolDashboardView.vue";

const srStore = useSrStore();

const data = computed<{
  result: { id: string; label: string; value: number }[];
  maxSize: number;
  usedSize: number;
}>(() => {
  const result: { id: string; label: string; value: number }[] = [];
  let maxSize = 0;
  let usedSize = 0;

  srStore.allRecords.forEach(
    ({ name_label, physical_size, physical_utilisation, uuid }) => {
      if (physical_size < 0 || physical_utilisation < 0) {
        return;
      }

      maxSize += physical_size;
      usedSize += physical_utilisation;

      const percent = (physical_utilisation / physical_size) * 100;

      if (isNaN(percent)) {
        return;
      }

      result.push({
        id: uuid,
        label: name_label,
        value: percent,
      });
    }
  );
  return { result, maxSize, usedSize };
});
</script>
