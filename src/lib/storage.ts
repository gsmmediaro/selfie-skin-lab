import { SkinAnalysis } from "./mockAI";

const STORAGE_KEYS = {
  SCANS: "skinscan_history",
  CURRENT_SCAN: "skinscan_current",
};

export const saveScan = (scan: SkinAnalysis): void => {
  const history = getScanHistory();
  history.unshift(scan);
  localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(history));
};

export const getScanHistory = (): SkinAnalysis[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SCANS);
  return data ? JSON.parse(data) : [];
};

export const getScanById = (id: string): SkinAnalysis | null => {
  const history = getScanHistory();
  return history.find(scan => scan.id === id) || null;
};

export const updateScan = (id: string, updates: Partial<SkinAnalysis>): void => {
  const history = getScanHistory();
  const index = history.findIndex(scan => scan.id === id);
  if (index !== -1) {
    history[index] = { ...history[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(history));
  }
};

export const unlockScan = (id: string): void => {
  updateScan(id, { unlocked: true });
};

export const setCurrentScan = (scan: SkinAnalysis): void => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_SCAN, JSON.stringify(scan));
};

export const getCurrentScan = (): SkinAnalysis | null => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_SCAN);
  return data ? JSON.parse(data) : null;
};

export const clearCurrentScan = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_SCAN);
};
