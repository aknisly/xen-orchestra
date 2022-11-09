<template>
  <UiCard :class="hasError ? 'ui-card-backgroud-error' : 'ui-card-backgroud'">
    <UiCardTitle>{{ $t("cpu-usage") }}</UiCardTitle>
    <HostsCpuUsage />
    <VmsCpuUsage />
  </UiCard>
</template>
<script lang="ts" setup>
import { type ComputedRef, computed, inject } from "vue";
import HostsCpuUsage from "@/components/pool/dashboard/cpuUsage/HostsCpuUsage.vue";
import VmsCpuUsage from "@/components/pool/dashboard/cpuUsage/VmsCpuUsage.vue";
import UiCard from "@/components/ui/UiCard.vue";
import UiCardTitle from "@/components/ui/UiCardTitle.vue";
import type { Stat } from "@/composables/fetch-stats.composable";
import type { VmStats, HostStats } from "@/libs/xapi-stats";
import { every } from "lodash";

const vmStats = inject<ComputedRef<Stat<VmStats>[]>>(
  "vmStats",
  computed(() => [])
);

const hostStats = inject<ComputedRef<Stat<HostStats>[]>>(
  "hostStats",
  computed(() => [])
);

const hasError = computed(
  () =>
    every(vmStats.value, (stat) => stat.stats === null) ||
    every(hostStats.value, (stat) => stat.stats === null)
);
</script>
