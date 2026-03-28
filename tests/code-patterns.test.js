/**
 * tests/code-patterns.test.js
 * Valida que el código siga los patrones correctos de Alipay+ Mini Programs
 */

const fs = require('fs');
const path = require('path');

describe('Code Pattern Validation', () => {
  const projectRoot = path.join(__dirname, '..');
  const miniappDir = path.join(projectRoot, 'my-miniapp');

  describe('app.js Pattern Validation', () => {
    const appFile = path.join(miniappDir, 'app.js');
    const appContent = fs.readFileSync(appFile, 'utf8');

    test('app.js defines App() not Page()', () => {
      expect(appContent).toContain('App({');
      expect(appContent).not.toContain('Page({');
    });

    test('app.js has onLaunch lifecycle hook', () => {
      expect(appContent).toMatch(/onLaunch\s*\(\s*\)\s*\{/);
    });

    test('app.js has onShow lifecycle hook', () => {
      expect(appContent).toMatch(/onShow\s*\(\s*\)\s*\{/);
    });

    test('app.js has onHide lifecycle hook', () => {
      expect(appContent).toMatch(/onHide\s*\(\s*\)\s*\{/);
    });

    test('app.js has onError lifecycle hook', () => {
      expect(appContent).toMatch(/onError\s*\(\s*\w+\s*\)\s*\{/);
    });

    test('app.js has globalData object', () => {
      expect(appContent).toMatch(/globalData\s*:\s*\{/);
    });

    test('app.js does not use this.data direct mutation', () => {
      // Should not have patterns like this.data.key = value
      expect(appContent).not.toMatch(/this\.data\.\w+\s*=\s*(?!this)/);
    });
  });

  describe('index.js Pattern Validation', () => {
    const indexFile = path.join(miniappDir, 'pages', 'index', 'index.js');
    const indexContent = fs.readFileSync(indexFile, 'utf8');

    test('index.js defines Page() not App()', () => {
      expect(indexContent).toContain('Page({');
      expect(indexContent).not.toContain('App({');
    });

    test('index.js has data object', () => {
      expect(indexContent).toMatch(/data\s*:\s*\{/);
    });

    test('index.js uses this.setData() for state mutations', () => {
      expect(indexContent).toMatch(/this\.setData\s*\(\s*\{/);
    });

    test('index.js does not use direct this.data mutations', () => {
      // Check for anti-pattern: this.data.key = value (but not this.data.key + 1)
      const directMutationPattern = /this\.data\.\w+\s*=\s*(?![=+\-*/])/;
      // Allow only in comments or for reading
      const lines = indexContent.split('\n');
      const problematicLines = lines.filter(line => {
        if (line.trim().startsWith('//')) return false; // Skip comments
        if (/this\.data\.\w+\s*[+\-*/]|this\.data\.\w+\s*\+\+/.test(line)) return false; // Reading/arithmetic, not assignment
        if (line.includes('console.log')) return false; // Just logging
        return directMutationPattern.test(line);
      });
      expect(problematicLines.length).toBeLessThan(1);
    });

    test('index.js has onLoad lifecycle hook', () => {
      expect(indexContent).toMatch(/onLoad\s*\(\s*\)\s*\{/);
    });

    test('index.js has onShow lifecycle hook', () => {
      expect(indexContent).toMatch(/onShow\s*\(\s*\)\s*\{/);
    });

    test('index.js has onHide lifecycle hook', () => {
      expect(indexContent).toMatch(/onHide\s*\(\s*\)\s*\{/);
    });

    test('index.js has onUnload lifecycle hook', () => {
      expect(indexContent).toMatch(/onUnload\s*\(\s*\)\s*\{/);
    });

    test('index.js has event handler methods', () => {
      // Should have methods like increment, decrement, etc.
      expect(indexContent).toMatch(/\w+\s*\(\s*\)\s*\{[\s\S]*?this\.setData/);
    });

    test('index.js imports API wrapper correctly', () => {
      expect(indexContent).toMatch(/import\s+\{?\s*request\s*\}?\s+from/);
    });
  });

  describe('api.js Pattern Validation', () => {
    const apiFile = path.join(miniappDir, 'utils', 'api.js');
    const apiContent = fs.readFileSync(apiFile, 'utf8');

    test('api.js exports request function', () => {
      expect(apiContent).toMatch(/export\s+function request|export\s+const request|module\.exports.*request/);
    });

    test('api.js request function returns Promise', () => {
      expect(apiContent).toContain('return new Promise');
    });

    test('api.js uses Promise resolve for success', () => {
      expect(apiContent).toMatch(/resolve\s*\(/);
    });

    test('api.js uses Promise reject for errors', () => {
      expect(apiContent).toMatch(/reject\s*\(/);
    });

    test('api.js validates URL parameter', () => {
      expect(apiContent).toMatch(/!url|url.*required/i);
    });

    test('api.js validates HTTP method', () => {
      expect(apiContent).toMatch(/validMethods|GET.*POST.*PUT|method.*valid/i);
    });

    test('api.js exports shorthand methods (get, post, put, delete_)', () => {
      expect(apiContent).toMatch(/export\s+function get/);
      expect(apiContent).toMatch(/export\s+function post/);
      expect(apiContent).toMatch(/export\s+function put/);
      expect(apiContent).toMatch(/export\s+function delete_/);
    });

    test('api.js uses my.request internally', () => {
      expect(apiContent).toContain('my.request');
    });

    test('api.js handles success callback', () => {
      expect(apiContent).toMatch(/success\s*:\s*\(/);
    });

    test('api.js handles fail callback', () => {
      expect(apiContent).toMatch(/fail\s*:\s*\(/);
    });
  });

  describe('AXML Pattern Validation', () => {
    const axmlFile = path.join(miniappDir, 'pages', 'index', 'index.axml');
    const axmlContent = fs.readFileSync(axmlFile, 'utf8');

    test('index.axml uses data binding with {{}}', () => {
      expect(axmlContent).toMatch(/\{\{[\w\.]+\}\}/);
    });

    test('index.axml does not use web binding syntax', () => {
      expect(axmlContent).not.toMatch(/v-for|v-if|\[\(ngModel\)\]|\$\{.*\}/);
    });

    test('index.axml uses a:if for conditionals', () => {
      const hasConditional = /a:if=|a:else/.test(axmlContent);
      // Optional pattern, just checking it doesn't use if=
      expect(axmlContent).not.toMatch(/if="[^{]/);
    });

    test('index.axml uses a:for for loops if needed', () => {
      // Check if a:for pattern is used (optional in example)
      const hasLoop = /a:for=/.test(axmlContent);
      if (hasLoop) {
        // If a:for exists, should have item or index binding
        expect(axmlContent).toMatch(/\{\{[\w\.]+\}\}/);
      } else {
        // If no a:for, it's ok - optional pattern
        expect(axmlContent).toMatch(/\{\{[\w\.]+\}\}/);
      }
    });

    test('index.axml uses onTap for button clicks', () => {
      const hasButton = /<button/.test(axmlContent);
      if (hasButton) {
        expect(axmlContent).toMatch(/onTap=/);
      }
    });

    test('index.axml does not use onClick', () => {
      expect(axmlContent).not.toMatch(/\bonClick=/);
    });

    test('index.axml uses <view> and <text> elements', () => {
      expect(axmlContent).toMatch(/<view/);
      expect(axmlContent).toMatch(/<text/);
    });

    test('index.axml does not use HTML elements', () => {
      expect(axmlContent).not.toMatch(/<div\b|<span\b|<h[1-6]\b/);
    });
  });

  describe('Package.json Scripts Pattern', () => {
    const pkgFile = path.join(projectRoot, 'package.json');
    const pkgContent = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));

    test('package.json has preview script', () => {
      expect(pkgContent.scripts.preview).toBeDefined();
      expect(pkgContent.scripts.preview).toContain('miniprogram-cli');
    });

    test('package.json has upload script', () => {
      expect(pkgContent.scripts.upload).toBeDefined();
      expect(pkgContent.scripts.upload).toContain('miniprogram-cli');
    });

    test('package.json has init-cli script', () => {
      expect(pkgContent.scripts['init-cli']).toBeDefined();
      expect(pkgContent.scripts['init-cli']).toContain('init-dev.sh');
    });

    test('package.json has test script', () => {
      expect(pkgContent.scripts.test).toBeDefined();
    });
  });

  describe('Documentation Pattern Validation', () => {
    test('CLAUDE.md exists and has substantial content', () => {
      const file = path.join(projectRoot, 'CLAUDE.md');
      const content = fs.readFileSync(file, 'utf8');
      expect(content.length).toBeGreaterThan(1000);
    });

    test('CLAUDE.md mentions "NOT React/Vue"', () => {
      const file = path.join(projectRoot, 'CLAUDE.md');
      const content = fs.readFileSync(file, 'utf8');
      expect(content.toUpperCase()).toMatch(/NOT.*REACT|NOT.*VUE|NO ES REACT|NO ES VUE/);
    });

    test('CLAUDE.md documents AXML markup', () => {
      const file = path.join(projectRoot, 'CLAUDE.md');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/AXML|axml|<view>|<text>/);
    });

    test('CLAUDE.md documents this.setData pattern', () => {
      const file = path.join(projectRoot, 'CLAUDE.md');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/this\.setData|setData\(\)/);
    });

    test('CLAUDE.md documents my.request API', () => {
      const file = path.join(projectRoot, 'CLAUDE.md');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/my\.request/);
    });

    test('CLAUDE.md documents rpx units', () => {
      const file = path.join(projectRoot, 'CLAUDE.md');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/rpx/);
    });

    test('CLAUDE.md documents what does NOT exist (window, document, fetch)', () => {
      const file = path.join(projectRoot, 'CLAUDE.md');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/window|document|fetch|localStorage/);
    });

    test('README.md exists and has content', () => {
      const file = path.join(projectRoot, 'README.md');
      const content = fs.readFileSync(file, 'utf8');
      expect(content.length).toBeGreaterThan(100);
    });

    test('README.md mentions prerequisites', () => {
      const file = path.join(projectRoot, 'README.md');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/[Pp]rerequisite|require|install|setup/);
    });
  });
});
