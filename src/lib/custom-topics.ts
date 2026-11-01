export type TopicFormat = "markdown" | "html";

export interface CustomTopic {
  id: string;
  label: string;
  group: string;
  format: TopicFormat;
  content: string;
}

const KEY = "interview-prep.custom-topics.v1";

export function loadCustomTopics(): CustomTopic[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CustomTopic[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCustomTopics(topics: CustomTopic[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(topics));
}

export function upsertCustomTopic(topic: CustomTopic): CustomTopic[] {
  const all = loadCustomTopics();
  const idx = all.findIndex((t) => t.id === topic.id);
  const next = idx >= 0 ? all.map((t) => (t.id === topic.id ? topic : t)) : [...all, topic];
  saveCustomTopics(next);
  return next;
}

export function deleteCustomTopic(id: string): CustomTopic[] {
  const next = loadCustomTopics().filter((t) => t.id !== id);
  saveCustomTopics(next);
  return next;
}
