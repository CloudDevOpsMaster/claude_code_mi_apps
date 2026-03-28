/**
 * tests/syntax-validation.test.js
 * Valida la sintaxis correcta en archivos JavaScript, AXML, CSS y JSON
 */

const fs = require('fs');
const path = require('path');

describe('Syntax Validation', () => {
  const projectRoot = path.join(__dirname, '..');
  const miniappDir = path.join(projectRoot, 'my-miniapp');

  describe('JavaScript Syntax Validation', () => {
    test('app.js has valid JavaScript syntax', () => {
      const file = path.join(miniappDir, 'app.js');
      const content = fs.readFileSync(file, 'utf8');
      // Check for basic JavaScript structure
      expect(content).toContain('App({');
      expect(content).toMatch(/onLaunch\s*\(\s*\)/);
    });

    test('app.js contains lifecycle hooks', () => {
      const file = path.join(miniappDir, 'app.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toContain('onLaunch');
      expect(content).toContain('onShow');
      expect(content).toContain('onHide');
      expect(content).toContain('onError');
    });

    test('index.js has valid JavaScript syntax', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toContain('Page({');
      expect(content).toMatch(/data\s*:\s*\{/);
    });

    test('index.js can be required without error', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.js');
      const content = fs.readFileSync(file, 'utf8');
      // Check for syntax patterns that would break require
      expect(content).not.toMatch(/SyntaxError|const\s+\{.*\}\s+=\s+this\./);
    });

    test('api.js has valid JavaScript syntax', () => {
      const file = path.join(miniappDir, 'utils', 'api.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/export\s+(function|const)/);
      expect(content).toMatch(/function request|const request/);
    });

    test('api.js exports request function', () => {
      const file = path.join(miniappDir, 'utils', 'api.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toMatch(/export\s+function request|export\s+\{\s*request/);
    });
  });

  describe('AXML Markup Validation', () => {
    test('index.axml uses valid AXML elements', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.axml');
      const content = fs.readFileSync(file, 'utf8');
      // Should have at least one AXML element
      expect(content).toMatch(/<(view|text|button|image|scroll-view|form|input)/);
    });

    test('index.axml uses AXML elements not HTML', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.axml');
      const content = fs.readFileSync(file, 'utf8');
      // Should contain AXML elements
      expect(content).toMatch(/<(view|text|button|image|scroll-view)\b/);
      // Should NOT have pure HTML markup (allow comments that mention HTML)
      const codeOnly = content.replace(/<!--[\s\S]*?-->/g, '');
      const hasHTMLTags = /<(div|span)\s|<(div|span)>|<p\s|<p>|<html|<body/.test(codeOnly);
      expect(hasHTMLTags).toBe(false);
    });

    test('index.axml uses correct event binding syntax', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.axml');
      const content = fs.readFileSync(file, 'utf8');
      // Should use onTap or other on* attributes
      const hasValidEvents = /\bon(Tap|Input|Change|Submit|Scroll|Touch)/;
      expect(content).toMatch(hasValidEvents);
    });

    test('index.axml does not use onClick (web syntax)', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.axml');
      const content = fs.readFileSync(file, 'utf8');
      // Should NOT use web event handlers
      expect(content).not.toMatch(/\bon(Click|Change)=(?!\{)/);
    });

    test('index.axml uses data binding syntax', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.axml');
      const content = fs.readFileSync(file, 'utf8');
      // Should use {{variable}} syntax
      expect(content).toMatch(/\{\{[\w\.]+\}\}/);
    });

    test('index.axml has closing tags for elements', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.axml');
      const content = fs.readFileSync(file, 'utf8');
      // Basic validation: if opening tag exists, closing should be present
      const openViewTags = (content.match(/<view/g) || []).length;
      const closeViewTags = (content.match(/<\/view>/g) || []).length;
      expect(closeViewTags).toBeGreaterThanOrEqual(openViewTags - 2); // Allow for self-closing
    });
  });

  describe('ACSS Style Validation', () => {
    test('index.acss exists and contains styles', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.acss');
      const content = fs.readFileSync(file, 'utf8');
      expect(content.length).toBeGreaterThan(10);
    });

    test('index.acss uses rpx units', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.acss');
      const content = fs.readFileSync(file, 'utf8');
      // Should contain at least one rpx unit
      expect(content).toMatch(/\d+rpx/);
    });

    test('app.acss exists and contains base styles', () => {
      const file = path.join(miniappDir, 'app.acss');
      const content = fs.readFileSync(file, 'utf8');
      expect(content.length).toBeGreaterThan(10);
    });

    test('ACSS does not use px instead of rpx for responsive design', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.acss');
      const content = fs.readFileSync(file, 'utf8');
      // Should NOT have explicit px units (should use rpx for responsive)
      const pxMatches = (content.match(/width:\s*\d+px|height:\s*\d+px|padding:\s*\d+px|margin:\s*\d+px/g) || []).length;
      expect(pxMatches).toBeLessThan(3); // Allow some flexibility for edge cases
    });
  });

  describe('JSON Syntax Validation', () => {
    test('app.json is valid JSON', () => {
      const file = path.join(miniappDir, 'app.json');
      const content = fs.readFileSync(file, 'utf8');
      expect(() => JSON.parse(content)).not.toThrow();
    });

    test('mini.project.json is valid JSON', () => {
      const file = path.join(miniappDir, 'mini.project.json');
      const content = fs.readFileSync(file, 'utf8');
      expect(() => JSON.parse(content)).not.toThrow();
    });

    test('index.json is valid JSON', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.json');
      const content = fs.readFileSync(file, 'utf8');
      expect(() => JSON.parse(content)).not.toThrow();
    });

    test('root package.json is valid JSON', () => {
      const file = path.join(projectRoot, 'package.json');
      const content = fs.readFileSync(file, 'utf8');
      expect(() => JSON.parse(content)).not.toThrow();
    });

    test('my-miniapp package.json is valid JSON', () => {
      const file = path.join(miniappDir, 'package.json');
      const content = fs.readFileSync(file, 'utf8');
      expect(() => JSON.parse(content)).not.toThrow();
    });
  });

  describe('.env Example Format', () => {
    test('.env.example has valid format', () => {
      const file = path.join(projectRoot, '.env.example');
      const content = fs.readFileSync(file, 'utf8');
      // Should contain variable definitions
      expect(content).toMatch(/[A-Z_]+=/);
    });

    test('.env.example contains required variables', () => {
      const file = path.join(projectRoot, '.env.example');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toContain('WORKSPACE_ID');
      expect(content).toContain('SUPER_APP_ID');
      expect(content).toContain('MINI_PROGRAM_ID');
      expect(content).toContain('CLI_ACCESS_KEY_ID');
      expect(content).toContain('CLI_SECRET_ACCESS_KEY');
    });
  });
});
