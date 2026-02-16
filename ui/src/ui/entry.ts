
import { html, render } from 'lit';

console.log("OpenClaw Control UI - Entry Point Loaded");

const app = document.querySelector<HTMLDivElement>('#app') || document.body;

const template = html`
  <div style="font-family: system-ui; padding: 2rem; text-align: center;">
    <h1>OpenClaw Control UI</h1>
    <p>Status: Operational</p>
    <p>Build Time: ${new Date().toISOString()}</p>
  </div>
`;

render(template, app);
