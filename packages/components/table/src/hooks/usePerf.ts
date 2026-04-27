import { shallowRef, provide, inject } from 'vue'
import type { InjectionKey, ShallowRef } from 'vue'

export interface PerfEntry {
  label: string
  duration: number
  timestamp: number
}

export interface MemorySnapshot {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
  renderedRows: number
  renderedCells: number
  timestamp: number
}

export interface PerfMetrics {
  entries: PerfEntry[]
  memory: MemorySnapshot | null
  scrollEventsPerSec: number
  fps: number
}

export interface PerfContext {
  enabled: ShallowRef<boolean>
  metrics: ShallowRef<PerfMetrics>
  markStart: (label: string) => void
  markEnd: (label: string) => void
  captureMemory: (rows: number, cells: number) => void
  recordScrollEvent: () => void
}

const PERF_KEY: InjectionKey<PerfContext> = Symbol('TablePerf')
const MAX_ENTRIES = 200
const NOOP = () => {}

const NOOP_CTX: PerfContext = {
  enabled: shallowRef(false),
  metrics: shallowRef({ entries: [], memory: null, scrollEventsPerSec: 0, fps: 0 }),
  markStart: NOOP,
  markEnd: NOOP,
  captureMemory: NOOP,
  recordScrollEvent: NOOP,
}

let _activeCtx: PerfContext = NOOP_CTX

export function createPerfContext(enabled: ShallowRef<boolean>): PerfContext {
  const metrics = shallowRef<PerfMetrics>({
    entries: [],
    memory: null,
    scrollEventsPerSec: 0,
    fps: 0,
  })

  let scrollCount = 0
  let frameCount = 0
  let fpsRaf: number | null = null
  let lastFpsTime = 0
  const pendingMarks = new Map<string, number>()

  const fpsLoop = (now: number) => {
    frameCount++
    if (now - lastFpsTime >= 1000) {
      const current = metrics.value
      metrics.value = {
        ...current,
        fps: frameCount,
        scrollEventsPerSec: scrollCount,
      }
      frameCount = 0
      scrollCount = 0
      lastFpsTime = now
    }
    if (enabled.value) {
      fpsRaf = requestAnimationFrame(fpsLoop)
    }
  }

  const start = () => {
    lastFpsTime = performance.now()
    frameCount = 0
    scrollCount = 0
    fpsRaf = requestAnimationFrame(fpsLoop)
  }

  const markStart = (label: string) => {
    if (!enabled.value) return
    pendingMarks.set(label, performance.now())
  }

  const markEnd = (label: string) => {
    if (!enabled.value) return
    const startTime = pendingMarks.get(label)
    if (startTime === undefined) return
    pendingMarks.delete(label)
    const duration = performance.now() - startTime
    const current = metrics.value
    const entries =
      current.entries.length >= MAX_ENTRIES
        ? current.entries.slice(-MAX_ENTRIES + 1)
        : [...current.entries]
    entries.push({ label, duration, timestamp: Date.now() })
    metrics.value = { ...current, entries }
  }

  const captureMemory = (rows: number, cells: number) => {
    if (!enabled.value) return
    const mem = (performance as any).memory
    const current = metrics.value
    metrics.value = {
      ...current,
      memory: {
        usedJSHeapSize: mem?.usedJSHeapSize ?? 0,
        totalJSHeapSize: mem?.totalJSHeapSize ?? 0,
        jsHeapSizeLimit: mem?.jsHeapSizeLimit ?? 0,
        renderedRows: rows,
        renderedCells: cells,
        timestamp: Date.now(),
      },
    }
  }

  const recordScrollEvent = () => {
    if (!enabled.value) return
    scrollCount++
  }

  if (enabled.value) start()

  const ctx: PerfContext = {
    enabled,
    metrics,
    markStart,
    markEnd,
    captureMemory,
    recordScrollEvent,
  }
  _activeCtx = ctx
  return ctx
}

export function providePerfContext(ctx: PerfContext) {
  provide(PERF_KEY, ctx)
}

/**
 * Get the perf context. Works both inside the same component (via module-level ref)
 * and in child components (via inject). Uses lazy delegation so call order doesn't matter.
 */
export function usePerf(): PerfContext {
  const injected = inject(PERF_KEY, null)
  if (injected) return injected
  return {
    get enabled() {
      return _activeCtx.enabled
    },
    get metrics() {
      return _activeCtx.metrics
    },
    markStart: (l: string) => _activeCtx.markStart(l),
    markEnd: (l: string) => _activeCtx.markEnd(l),
    captureMemory: (r: number, c: number) => _activeCtx.captureMemory(r, c),
    recordScrollEvent: () => _activeCtx.recordScrollEvent(),
  }
}
