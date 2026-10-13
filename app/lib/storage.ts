// 答题进度和上次结果只保存在本机浏览器里；任何读写失败都不影响答题。
import { QUESTIONS } from "./quiz";

const PROGRESS_KEY = "wbti-progress-v3";
const RESULT_KEY = "wbti-result-v3";
const LEGACY_KEYS = ["wbti-progress-v2"];
const VALID_ANSWERS = new Set([-2, -1, 0, 1, 2]);

export type SavedProgress = { answers: number[]; current: number };

function read(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // 隐私模式或存储被禁用时，进度只保留在当前页面。
  }
}

function parseAnswers(value: unknown) {
  if (!Array.isArray(value) || value.length !== QUESTIONS.length) return null;
  if (!value.every((answer) => VALID_ANSWERS.has(answer))) return null;
  return value as number[];
}

export function readProgress(): SavedProgress | null {
  LEGACY_KEYS.forEach((key) => write(key, null));
  const raw = read(PROGRESS_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as { answers?: unknown; current?: unknown };
    const answers = parseAnswers(parsed.answers);
    const current = Number(parsed.current);
    if (!answers || !answers.some(Boolean) || !Number.isInteger(current)) throw new Error("invalid progress");
    return { answers, current: Math.min(Math.max(current, 0), QUESTIONS.length - 1) };
  } catch {
    write(PROGRESS_KEY, null);
    return null;
  }
}

export function saveProgress(progress: SavedProgress) {
  write(PROGRESS_KEY, JSON.stringify(progress));
}

export function clearProgress() {
  write(PROGRESS_KEY, null);
}

export function readLastAnswers() {
  const raw = read(RESULT_KEY);
  if (!raw) return null;

  try {
    const answers = parseAnswers((JSON.parse(raw) as { answers?: unknown }).answers);
    if (!answers || answers.includes(0)) throw new Error("invalid result");
    return answers;
  } catch {
    write(RESULT_KEY, null);
    return null;
  }
}

export function saveLastAnswers(answers: number[]) {
  write(RESULT_KEY, JSON.stringify({ answers }));
}
