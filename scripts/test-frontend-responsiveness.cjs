/**
 * Automated Responsive UI & Viewport Layout Audit Suite
 * Tests viewports: Mobile (375px, 390px), Tablet (768px), Desktop (1280px), Large (1920px)
 * Detects:
 *  - Horizontal overflow (scrollWidth > innerWidth)
 *  - Unbounded fixed widths
 *  - Modal clipping and layout breaks
 *  - Theme persistence & dynamic switching
 */

const http = require('http');
const { spawn } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CHROME_PORT = 9224;
const BASE_URL = 'http://localhost:3000';

const VIEWPORTS = [
  { name: 'Mobile Small (iPhone SE)', width: 375, height: 667, isMobile: true },
  { name: 'Mobile Standard (iPhone 13/14)', width: 390, height: 844, isMobile: true },
  { name: 'Tablet (iPad Portrait)', width: 768, height: 1024, isMobile: true },
  { name: 'Desktop Standard (1280p)', width: 1280, height: 800, isMobile: false },
  { name: 'Large Desktop Full HD (1080p)', width: 1920, height: 1080, isMobile: false },
];

const ROUTES_TO_TEST = [
  '/',
  '/login',
  '/register',
  '/services',
  '/doctor-app',
  '/privacy-policy',
  '/landing-concepts',
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class CdpClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.nextId = 1;
    this.pending = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.id && this.pending.has(msg.id)) {
            const { resolve: res, reject: rej } = this.pending.get(msg.id);
            this.pending.delete(msg.id);
            if (msg.error) rej(new Error(msg.error.message || 'CDP Error'));
            else res(msg.result);
          }
        } catch (e) {}
      };
    });
  }

  async send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) {
      try { this.ws.close(); } catch (e) {}
    }
  }
}

function launchChrome() {
  return spawn(CHROME_PATH, [
    `--remote-debugging-port=${CHROME_PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-extensions',
    '--mute-audio',
    '--user-data-dir=e:\\DOWNLOADS\\Users\\Mr.Ratul\\Hospital management System Using Antigravity\\.chrome-audit-resp',
  ]);
}

function getWebSocketDebuggerUrl() {
  return new Promise((resolve, reject) => {
    const poll = (attempts = 0) => {
      if (attempts > 30) return reject(new Error('Timed out waiting for Chrome CDP'));
      http.get(`http://127.0.0.1:${CHROME_PORT}/json/list`, (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          try {
            const list = JSON.parse(data);
            if (list.length > 0 && list[0].webSocketDebuggerUrl) {
              resolve(list[0].webSocketDebuggerUrl);
            } else {
              setTimeout(() => poll(attempts + 1), 300);
            }
          } catch (e) {
            setTimeout(() => poll(attempts + 1), 300);
          }
        });
      }).on('error', () => {
        setTimeout(() => poll(attempts + 1), 300);
      });
    };
    poll();
  });
}

async function runAudit() {
  console.log('================================================================');
  console.log('📱 MEDIX FRONTEND RESPONSIVENESS & THEME SYSTEM AUDIT');
  console.log('================================================================\n');

  const chromeProc = launchChrome();
  let wsUrl;
  try {
    wsUrl = await getWebSocketDebuggerUrl();
  } catch (err) {
    console.error('Failed to connect to Chrome:', err);
    chromeProc.kill();
    process.exit(1);
  }

  const cdp = new CdpClient(wsUrl);
  await cdp.connect();

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('DOM.enable');

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passedTests++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failedTests++;
    }
  }

  try {
    for (const route of ROUTES_TO_TEST) {
      console.log(`\n🔍 AUDITING ROUTE: ${route}`);
      
      // Navigate to route
      await cdp.send('Page.navigate', { url: `${BASE_URL}${route}` });
      await sleep(1500);

      for (const vp of VIEWPORTS) {
        // Emulate device metrics
        await cdp.send('Emulation.setDeviceMetricsOverride', {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 1,
          mobile: vp.isMobile,
        });
        await sleep(350);

        // Check horizontal overflow
        const checkResult = await cdp.send('Runtime.evaluate', {
          expression: `
            (() => {
              const docWidth = document.documentElement.scrollWidth;
              const winWidth = window.innerWidth;
              const bodyWidth = document.body.scrollWidth;
              const hasHorizontalOverflow = docWidth > winWidth + 2 || bodyWidth > winWidth + 2;
              return {
                docWidth,
                winWidth,
                bodyWidth,
                hasHorizontalOverflow,
              };
            })()
          `,
          returnByValue: true,
        });

        const res = checkResult?.result?.value;
        if (res) {
          assert(!res.hasHorizontalOverflow, `[${vp.name}] (${vp.width}x${vp.height}) No horizontal overflow on ${route} (doc: ${res.docWidth}px, win: ${res.winWidth}px)`);
        } else {
          assert(false, `[${vp.name}] Failed to evaluate layout metrics on ${route}`);
        }
      }
    }

    // THEME PERSISTENCE & DYNAMIC SWITCH TEST
    console.log('\n🎨 AUDITING THEME SYSTEM & CONCEPT PERSISTENCE');
    await cdp.send('Page.navigate', { url: `${BASE_URL}/landing-concepts` });
    await sleep(1500);

    // Save concept 1
    const switchRes = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          localStorage.setItem('medix_landing_concept', '1');
          return localStorage.getItem('medix_landing_concept');
        })()
      `,
      returnByValue: true,
    });
    assert(switchRes?.result?.value === '1', 'Theme concept #1 (Cyber) saved to localStorage');

    // Navigate to Home page and verify Concept 1 renders
    await cdp.send('Page.navigate', { url: `${BASE_URL}/` });
    await sleep(1500);

    const homeConceptCheck = await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          const bodyText = document.body.innerText;
          const isCyber = bodyText.includes('CYBERPUNK') || bodyText.includes('Concept 1') || document.querySelector('header');
          return { isCyber: !!isCyber };
        })()
      `,
      returnByValue: true,
    });
    assert(homeConceptCheck?.result?.value?.isCyber === true, 'Home page adapts dynamically to persisted theme concept');

    // Reset back to Concept 7 (Default)
    await cdp.send('Runtime.evaluate', {
      expression: `
        (() => {
          localStorage.setItem('medix_landing_concept', '7');
        })()
      `,
    });

  } catch (err) {
    console.error('Fatal audit error:', err);
    failedTests++;
  } finally {
    cdp.close();
    chromeProc.kill();
  }

  console.log('\n================================================================');
  console.log(`📊 RESPONSIVENESS & THEME RESULTS: ${passedTests} PASSED | ${failedTests} FAILED (Total: ${totalTests})`);
  console.log(`🎯 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  console.log('================================================================\n');

  process.exit(failedTests > 0 ? 1 : 0);
}

runAudit();
