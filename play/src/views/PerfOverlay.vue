<script setup lang="ts">
import { computed } from 'vue'
import type { PerfContext } from '../../../packages/components/table/src/hooks/usePerf'

const props = defineProps<{ perfContext?: PerfContext }>()

const ctx = props.perfContext
const metrics = computed(() => ctx?.metrics.value)

const formatBytes = (bytes: number) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

const latestTimings = computed(() => {
  const entries = metrics.value?.entries ?? []
  const map = new Map<string, { avg: number; last: number; count: number }>()
  const recent = entries.slice(-100)
  for (const e of recent) {
    const existing = map.get(e.label)
    if (existing) {
      existing.count++
      existing.avg = existing.avg + (e.duration - existing.avg) / existing.count
      existing.last = e.duration
    } else {
      map.set(e.label, { avg: e.duration, last: e.duration, count: 1 })
    }
  }
  return map
})
</script>

<template>
  <div v-if="ctx?.enabled.value" class="perf-overlay">
    <div class="perf-overlay-title">Table Perf</div>
    <div class="perf-row">
      <span class="perf-label">FPS</span>
      <span class="perf-value">{{ metrics?.fps ?? '-' }}</span>
    </div>
    <div class="perf-row">
      <span class="perf-label">Scroll/s</span>
      <span class="perf-value">{{ metrics?.scrollEventsPerSec ?? '-' }}</span>
    </div>
    <div v-if="metrics?.memory" class="perf-row">
      <span class="perf-label">Heap</span>
      <span class="perf-value">{{ formatBytes(metrics.memory.usedJSHeapSize) }}</span>
    </div>
    <div v-if="metrics?.memory" class="perf-row">
      <span class="perf-label">Rows</span>
      <span class="perf-value">{{ metrics.memory.renderedRows }}</span>
    </div>
    <div v-if="metrics?.memory" class="perf-row">
      <span class="perf-label">Cells</span>
      <span class="perf-value">{{ metrics.memory.renderedCells }}</span>
    </div>
    <template v-for="[label, t] of latestTimings" :key="label">
      <div class="perf-row">
        <span class="perf-label">{{ label }}</span>
        <span class="perf-value">{{ t.last.toFixed(2) }}ms (avg {{ t.avg.toFixed(2) }})</span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.perf-overlay {
  position: fixed;
  bottom: 12px;
  right: 12px;
  z-index: 99999;
  background: rgba(0, 0, 0, 0.82);
  color: #0f0;
  font-family: 'SF Mono', 'Menlo', 'Monaco', monospace;
  font-size: 11px;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 6px;
  min-width: 220px;
  pointer-events: none;
  backdrop-filter: blur(4px);
}
.perf-overlay-title {
  color: #fff;
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  padding-bottom: 4px;
}
.perf-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.perf-label {
  color: #aaa;
  white-space: nowrap;
}
.perf-value {
  color: #0f0;
  text-align: right;
}
</style>
