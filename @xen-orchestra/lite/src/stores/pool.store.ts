import { defineStore } from "pinia";
import { computed } from "vue";
import type { XenApiPool } from "@/libs/xen-api";
import { createRecordContext } from "@/stores/index";

export const usePoolStore = defineStore("pool", () => {
  const { init, opaqueRefs, getRecord, isLoading } =
    createRecordContext<XenApiPool>("pool");

  const poolOpaqueRef = computed(() => opaqueRefs.value[0]);
  const pool = computed(() =>
    isLoading.value ? undefined : getRecord(poolOpaqueRef.value)
  );

  return {
    init,
    pool,
    poolOpaqueRef,
    isLoading,
  };
});
