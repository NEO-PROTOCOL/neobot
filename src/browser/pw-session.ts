
// Stub file to replace Playwright dependency as per user request (Brave MCP compatibility)

export type WithSnapshotForAI = {
  _snapshotForAI?: (options?: any) => Promise<any>;
};

export type BrowserConsoleMessage = {
  type: string;
  text: string;
  timestamp: string;
  location?: { url?: string; lineNumber?: number; columnNumber?: number };
};

export type BrowserPageError = {
  message: string;
  name?: string;
  stack?: string;
  timestamp: string;
};

export type BrowserNetworkRequest = {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  resourceType?: string;
  status?: number;
  ok?: boolean;
  failureText?: string;
};

export function rememberRoleRefsForTarget(opts: any): void { }
export function storeRoleRefsForTarget(opts: any): void { }
export function restoreRoleRefsForTarget(opts: any): void { }
export function ensurePageState(page: any): any { return {}; }
export function ensureContextState(context: any): any { return {}; }
export async function getPageForTargetId(opts: any): Promise<any> { throw new Error("Playwright disabled in this environment"); }
export function refLocator(page: any, ref: string): any { throw new Error("Playwright disabled"); }
export async function closePlaywrightBrowserConnection(): Promise<void> { }
export async function listPagesViaPlaywright(opts: any): Promise<any[]> { return []; }
export async function createPageViaPlaywright(opts: any): Promise<any> { throw new Error("Playwright disabled"); }
export async function closePageByTargetIdViaPlaywright(opts: any): Promise<void> { }
export async function focusPageByTargetIdViaPlaywright(opts: any): Promise<void> { }
