// Simple client-side mock API for demo purposes.
// Loads initial JSON from /src/mock and persists runtime changes to localStorage.
type Item = { id: string } & Record<string, any>;

const collections = {
  levels: () => import("@/mock/levels.json"),
  grades: () => import("@/mock/grades.json"),
  students: () => import("@/mock/students.json"),
  parents: () => import("@/mock/parents.json"),
  subjects: () => import("@/mock/subjects.json"),
  exams: () => import("@/mock/exams.json"),
  marks: () => import("@/mock/marks.json"),
  attendance: () => import("@/mock/attendance.json"),
  fees: () => import("@/mock/fees.json"),
  payments: () => import("@/mock/payments.json"),
  academic_years: () => import("@/mock/academic_years.json"),
  terms: () => import("@/mock/terms.json"),
} as const;

const STORAGE_PREFIX = "mock:";

function delay(ms = 300) {
  return new Promise((res) => setTimeout(res, ms));
}

async function loadInitial<T extends Item[]>(name: keyof typeof collections): Promise<T> {
  const key = STORAGE_PREFIX + name;
  // Force reload from JSON files by clearing localStorage cache
  localStorage.removeItem(key);
  // Also clear any other mock data to ensure clean state
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(STORAGE_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
  const mod = await collections[name]();
  const data = ((mod as any).default ?? mod) as T;
  localStorage.setItem(key, JSON.stringify(data));
  return data;
}

async function list(name: keyof typeof collections, opts: { delayMs?: number } = {}) {
  await delay(opts.delayMs ?? 300);
  return loadInitial(name);
}

async function get(name: keyof typeof collections, id: string) {
  await delay();
  const items = await loadInitial(name);
  const numericId = isNaN(Number(id)) ? id : Number(id);
  return items.find((i) => i.id === numericId) ?? null;
}

async function create(name: keyof typeof collections, item: Item) {
  await delay();
  const key = STORAGE_PREFIX + name;
  const items = await loadInitial(name);
  items.push(item);
  localStorage.setItem(key, JSON.stringify(items));
  return item;
}

async function update(name: keyof typeof collections, id: string, patch: Partial<Item>) {
  await delay();
  const key = STORAGE_PREFIX + name;
  const items = await loadInitial(name);
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) throw new Error("Not found");
  items[idx] = { ...items[idx], ...patch };
  localStorage.setItem(key, JSON.stringify(items));
  return items[idx];
}

async function remove(name: keyof typeof collections, id: string) {
  await delay();
  const key = STORAGE_PREFIX + name;
  let items = await loadInitial(name);
  items = items.filter((i) => i.id !== id);
  localStorage.setItem(key, JSON.stringify(items));
}

export const mockApi = { list, get, create, update, remove };

export default mockApi;
