// Refresh a project screenshot for the Projects section.
//
//   npm run shot -- https://hebras-lemon.vercel.app hebras
//
// Writes public/<name>-screenshot.webp at 1280x800, captured at 2x and
// downsampled so text stays crisp. Drives headless Chrome over CDP rather
// than the --screenshot flag, because these sites put a cookie banner
// across the fold and the flag can't click it away.
//
// No new dependencies: Node ships WebSocket, Next ships sharp.
import { spawn } from "node:child_process";
import sharp from "sharp";

const [url, name] = process.argv.slice(2);
if (!url || !name) {
  console.error("usage: npm run shot -- <url> <name>");
  process.exit(1);
}

// A dead URL still renders — as Vercel's 404 — and would quietly overwrite a
// good screenshot, so refuse before Chrome ever starts.
const res = await fetch(url, { redirect: "follow" }).catch((e) => {
  console.error(`${url} — ${e.message}`);
  process.exit(1);
});
if (!res.ok) {
  console.error(`${url} returned ${res.status}; refusing to overwrite ${name}`);
  process.exit(1);
}

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9222;
// Reused between runs on purpose: deleting it races Chrome's shutdown, and
// a warm profile remembers the cookie consent it clicked last time.
const PROFILE = "/tmp/portfolio-shot-profile";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(
  CHROME,
  [
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${PROFILE}`,
    "about:blank",
  ],
  { stdio: "ignore" }
);

try {
  // Chrome needs a moment before /json answers.
  let targets;
  for (let i = 0; i < 20; i++) {
    await sleep(500);
    try {
      targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
      break;
    } catch {}
  }
  if (!targets) throw new Error("Chrome never opened a debugging port");

  const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  let id = 0;
  const pending = new Map();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    pending.get(m.id)?.(m.result);
  };
  const send = (method, params = {}) =>
    new Promise((r) => {
      pending.set(++id, r);
      ws.send(JSON.stringify({ id, method, params }));
    });

  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1280,
    height: 800,
    deviceScaleFactor: 2,
    mobile: false,
  });
  await send("Page.navigate", { url });
  // ponytail: a fixed wait, not a network-idle listener. These are five
  // static marketing pages; swap in Page.loadEventFired if one gets slow.
  await sleep(6000);

  const { result } = await send("Runtime.evaluate", {
    expression: `(() => {
      const hit = [...document.querySelectorAll('button,a')].find((b) =>
        /^(aceptar|accept|entendido|ok)\\b/i.test(b.textContent.trim()));
      if (hit) { hit.click(); return 'dismissed: ' + hit.textContent.trim(); }
      return 'no cookie banner';
    })()`,
    returnByValue: true,
  });
  console.log(result.value);
  await sleep(1500);

  const { data } = await send("Page.captureScreenshot", { format: "png" });
  ws.close();

  const out = `public/${name}-screenshot.webp`;
  const info = await sharp(Buffer.from(data, "base64"))
    .resize(1280, 800)
    .webp({ quality: 82 })
    .toFile(out);
  console.log(`${out} — ${(info.size / 1024).toFixed(0)}KB`);
} finally {
  chrome.kill();
}
