// store timings in closure (or could use a Map)
const _taskTimers = new Map();

export function logTaskDuration(taskName, action = 'start') {
  if (!taskName) return;

  if (action === 'start') {
    _taskTimers.set(taskName, performance.now());
    return;
  }

  if (action === 'stop') {
    if (!_taskTimers.has(taskName)) {
      console.warn(`No start time recorded for task "${taskName}"`);
      return;
    }
    const start = _taskTimers.get(taskName);
    const durationMs = performance.now() - start;
    _taskTimers.delete(taskName);

    // do something with duration
    console.log(`[TaskDuration] ${taskName}: ${durationMs.toFixed(2)} ms`);

    return durationMs;
  }
}
