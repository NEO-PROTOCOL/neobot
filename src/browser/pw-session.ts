
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

export function rememberRoleRefsForTarget(_opts: any): void { }
export function storeRoleRefsForTarget(_opts: any): void { }
export function restoreRoleRefsForTarget(_opts: any): void { }
export function ensurePageState(_page: any): any { return {}; }
export function ensureContextState(_context: any): any { return {}; }
export async function getPageForTargetId(_opts: any): Promise<any> { throw new Error("Playwright disabled in this environment"); }
export function refLocator(_page: any, _ref: string): any { throw new Error("Playwright disabled"); }
export async function closePlaywrightBrowserConnection(): Promise<void> { }
export async function listPagesViaPlaywright(_opts: any): Promise<any[]> { return []; }
export async function createPageViaPlaywright(_opts: any): Promise<any> { throw new Error("Playwright disabled"); }
export async function closePageByTargetIdViaPlaywright(_opts: any): Promise<void> { }
export async function focusPageByTargetIdViaPlaywright(_opts: any): Promise<void> { }
