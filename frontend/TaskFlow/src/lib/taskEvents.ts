export const TASKS_REFRESH_EVENT = "taskflow:refresh-tasks";

export function notifyTasksRefresh() {
  window.dispatchEvent(new CustomEvent(TASKS_REFRESH_EVENT));
}
