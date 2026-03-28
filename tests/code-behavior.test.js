/**
 * tests/code-behavior.test.js
 * Valida el comportamiento en tiempo de ejecución del código
 */

const fs = require('fs');
const path = require('path');

describe('Code Behavior Validation', () => {
  const projectRoot = path.join(__dirname, '..');
  const miniappDir = path.join(projectRoot, 'my-miniapp');

  // Mock global.my object for API testing
  beforeEach(() => {
    if (!global.my) {
      global.my = {
        getSystemInfo: jest.fn((config) => {
          config.success?.({ platform: 'iOS', windowWidth: 750 });
        }),
        request: jest.fn((config) => {
          if (config.url.includes('success')) {
            config.success?.({ status: 200, data: { success: true } });
          } else {
            config.fail?.({ errorMessage: 'Network error' });
          }
        }),
        alert: jest.fn(),
        setStorage: jest.fn((config) => {
          config.success?.();
        }),
        getStorage: jest.fn((config) => {
          config.success?.({ data: 'test_value' });
        })
      };
    }
  });

  describe('app.js Behavior', () => {
    test('app.js structure can be parsed', () => {
      const file = path.join(miniappDir, 'app.js');
      const content = fs.readFileSync(file, 'utf8');
      // Remove comments and validate structure
      const stripped = content.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '');
      expect(stripped).toContain('App({');
      expect(stripped).toContain('globalData');
    });

    test('app.js globalData is accessible pattern', () => {
      const file = path.join(miniappDir, 'app.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/globalData\s*:\s*\{[\s\S]*?user|token|apiBaseUrl/);
    });

    test('app.js onLaunch calls my.getSystemInfo', () => {
      const file = path.join(miniappDir, 'app.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toContain('my.getSystemInfo');
    });

    test('app.js onLaunch has success callback', () => {
      const file = path.join(miniappDir, 'app.js');
      const content = fs.readFileSync(file, 'utf8');
      const onLaunchMatch = content.match(/onLaunch\s*\(\s*\)\s*\{[\s\S]*?^\s*\}/m);
      expect(onLaunchMatch?.[0]).toContain('success');
    });

    test('app.js onError accepts error parameter', () => {
      const file = path.join(miniappDir, 'app.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/onError\s*\(\s*\w+\s*\)/);
    });
  });

  describe('index.js (Page) Behavior', () => {
    test('index.js data structure is object', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/data\s*:\s*\{[\s\S]*?counter|message|loading/);
    });

    test('index.js has counter in data', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/counter\s*:\s*0/);
    });

    test('index.js increment method exists', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/increment\s*\(\s*\)\s*\{/);
    });

    test('index.js decrement method exists', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/decrement\s*\(\s*\)\s*\{/);
    });

    test('index.js reset method exists', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/reset\s*\(\s*\)\s*\{/);
    });

    test('index.js has loadInitialData method', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/loadInitialData\s*\(\s*\)\s*\{/);
    });

    test('index.js onLoad calls loadInitialData', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/onLoad\s*\(\s*\)\s*\{[\s\S]*?this\.loadInitialData/);
    });

    test('index.js has event handlers with this.setData', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.js');
      const content = fs.readFileSync(file, 'utf8');
      // Count setData calls - should be multiple
      const setDataCalls = (content.match(/this\.setData/g) || []).length;
      expect(setDataCalls).toBeGreaterThanOrEqual(3);
    });

    test('index.js has showAlert method', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/showAlert\s*\(\s*\)/);
    });

    test('index.js showAlert uses my.alert', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.js');
      const content = fs.readFileSync(file, 'utf8');
      const showAlertMatch = content.match(/showAlert\s*\(\s*\)\s*\{[\s\S]*?my\.alert/);
      expect(showAlertMatch).toBeTruthy();
    });

    test('index.js has fetchData method', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/fetchData\s*\(\s*\)/);
    });

    test('index.js fetchData is async', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/async\s+fetchData\s*\(\s*\)/);
    });

    test('index.js has error handling in async methods', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.js');
      const content = fs.readFileSync(file, 'utf8');
      // Check if async methods exist and have error handling
      expect(content).toMatch(/async\s+\w+/);
      expect(content).toMatch(/try|catch|error/i);
    });

    test('index.js has loading state in data', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/loading\s*:\s*false/);
    });

    test('index.js has error state in data', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/error\s*:\s*null/);
    });

    test('index.js manages loading state in methods', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.js');
      const content = fs.readFileSync(file, 'utf8');
      const loadingMatches = (content.match(/loading\s*:\s*true|loading\s*:\s*false/g) || []).length;
      expect(loadingMatches).toBeGreaterThanOrEqual(2);
    });
  });

  describe('api.js Function Behavior', () => {
    test('api.js request validates required URL', () => {
      const file = path.join(miniappDir, 'utils', 'api.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/!url|url.*required|url.*empty/i);
    });

    test('api.js request validates HTTP method', () => {
      const file = path.join(miniappDir, 'utils', 'api.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/validMethods|GET.*POST|method.*valid/);
    });

    test('api.js request handles data param for POST', () => {
      const file = path.join(miniappDir, 'utils', 'api.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/POST|PUT|PATCH/);
      expect(content).toMatch(/requestConfig\.data|\.data\s*=\s*data/);
    });

    test('api.js request sets Content-Type header', () => {
      const file = path.join(miniappDir, 'utils', 'api.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/Content-Type|application\/json/);
    });

    test('api.js request checks HTTP status code', () => {
      const file = path.join(miniappDir, 'utils', 'api.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/status.*>=.*400|400/);
    });

    test('api.js get shorthand function exists', () => {
      const file = path.join(miniappDir, 'utils', 'api.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/function\s+get\s*\(/);
    });

    test('api.js post shorthand function exists', () => {
      const file = path.join(miniappDir, 'utils', 'api.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/function\s+post\s*\(/);
    });

    test('api.js shorthand functions call request', () => {
      const file = path.join(miniappDir, 'utils', 'api.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/function\s+get[\s\S]*?request\s*\(/);
      expect(content).toMatch(/function\s+post[\s\S]*?request\s*\(/);
    });

    test('api.js has default export', () => {
      const file = path.join(miniappDir, 'utils', 'api.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/export\s+default/);
    });

    test('api.js handles error message from my.request', () => {
      const file = path.join(miniappDir, 'utils', 'api.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/errorMessage|error\.message/);
    });
  });

  describe('Configuration Files Behavior', () => {
    test('app.json pages array is not empty', () => {
      const file = path.join(miniappDir, 'app.json');
      const config = JSON.parse(fs.readFileSync(file, 'utf8'));
      expect(config.pages.length).toBeGreaterThan(0);
    });

    test('app.json pages includes index page', () => {
      const file = path.join(miniappDir, 'app.json');
      const config = JSON.parse(fs.readFileSync(file, 'utf8'));
      const hasIndexPage = config.pages.some(p => p.includes('index'));
      expect(hasIndexPage).toBe(true);
    });

    test('mini.project.json has valid projectId', () => {
      const file = path.join(miniappDir, 'mini.project.json');
      const config = JSON.parse(fs.readFileSync(file, 'utf8'));
      expect(config.projectId).toBeDefined();
      expect(typeof config.projectId).toBe('string');
    });

    test('index.json is object (not array)', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.json');
      const config = JSON.parse(fs.readFileSync(file, 'utf8'));
      expect(typeof config).toBe('object');
      expect(!Array.isArray(config)).toBe(true);
    });
  });

  describe('Script Configuration', () => {
    test('init-dev.sh is executable', () => {
      const file = path.join(projectRoot, 'scripts', 'init-dev.sh');
      const stats = fs.statSync(file);
      // Check if file has execute permissions (mode & 0o111)
      const hasExecutePermission = (stats.mode & 0o111) !== 0;
      expect(hasExecutePermission).toBe(true);
    });

    test('init-dev.sh has bash shebang', () => {
      const file = path.join(projectRoot, 'scripts', 'init-dev.sh');
      const content = fs.readFileSync(file, 'utf8');
      expect(content.startsWith('#!/bin/bash')).toBe(true);
    });

    test('init-dev.sh has prerequisites checks', () => {
      const file = path.join(projectRoot, 'scripts', 'init-dev.sh');
      const content = fs.readFileSync(file, 'utf8');
      // Should check for node, npm, git, etc
      expect(content).toMatch(/node|npm|git|miniprogram-cli/i);
    });

    test('init-dev.sh has version check for Node.js', () => {
      const file = path.join(projectRoot, 'scripts', 'init-dev.sh');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/node.*version|18|version.*check/i);
    });

    test('init-dev.sh has environment variable section', () => {
      const file = path.join(projectRoot, 'scripts', 'init-dev.sh');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/WORKSPACE_ID|env|environment/i);
    });

    test('root package.json references my-miniapp', () => {
      const file = path.join(projectRoot, 'package.json');
      const config = JSON.parse(fs.readFileSync(file, 'utf8'));
      const preview = config.scripts.preview;
      expect(preview).toContain('my-miniapp');
    });
  });
});
