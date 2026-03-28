/**
 * tests/file-structure.test.js
 * Valida la estructura de archivos y directorios del proyecto
 */

const fs = require('fs');
const path = require('path');

describe('File Structure Validation', () => {
  const projectRoot = path.join(__dirname, '..');
  const miniappDir = path.join(projectRoot, 'my-miniapp');

  describe('Required Directories', () => {
    test('my-miniapp directory exists', () => {
      expect(fs.existsSync(miniappDir)).toBe(true);
      const stats = fs.statSync(miniappDir);
      expect(stats.isDirectory()).toBe(true);
    });

    test('pages/index directory exists', () => {
      const pagesDir = path.join(miniappDir, 'pages', 'index');
      expect(fs.existsSync(pagesDir)).toBe(true);
    });

    test('components directory exists', () => {
      const componentsDir = path.join(miniappDir, 'components');
      expect(fs.existsSync(componentsDir)).toBe(true);
    });

    test('utils directory exists', () => {
      const utilsDir = path.join(miniappDir, 'utils');
      expect(fs.existsSync(utilsDir)).toBe(true);
    });

    test('assets directory exists', () => {
      const assetsDir = path.join(miniappDir, 'assets');
      expect(fs.existsSync(assetsDir)).toBe(true);
    });

    test('scripts directory exists', () => {
      const scriptsDir = path.join(projectRoot, 'scripts');
      expect(fs.existsSync(scriptsDir)).toBe(true);
    });
  });

  describe('Required Files - App Configuration', () => {
    test('app.js exists', () => {
      const file = path.join(miniappDir, 'app.js');
      expect(fs.existsSync(file)).toBe(true);
    });

    test('app.json exists and is valid JSON', () => {
      const file = path.join(miniappDir, 'app.json');
      expect(fs.existsSync(file)).toBe(true);
      const content = fs.readFileSync(file, 'utf8');
      expect(() => JSON.parse(content)).not.toThrow();
    });

    test('app.acss exists', () => {
      const file = path.join(miniappDir, 'app.acss');
      expect(fs.existsSync(file)).toBe(true);
    });

    test('mini.project.json exists and is valid JSON', () => {
      const file = path.join(miniappDir, 'mini.project.json');
      expect(fs.existsSync(file)).toBe(true);
      const content = fs.readFileSync(file, 'utf8');
      expect(() => JSON.parse(content)).not.toThrow();
    });

    test('package.json exists in my-miniapp', () => {
      const file = path.join(miniappDir, 'package.json');
      expect(fs.existsSync(file)).toBe(true);
    });
  });

  describe('Required Files - Index Page', () => {
    const indexDir = path.join(miniappDir, 'pages', 'index');

    test('index.js exists', () => {
      const file = path.join(indexDir, 'index.js');
      expect(fs.existsSync(file)).toBe(true);
    });

    test('index.axml exists', () => {
      const file = path.join(indexDir, 'index.axml');
      expect(fs.existsSync(file)).toBe(true);
    });

    test('index.acss exists', () => {
      const file = path.join(indexDir, 'index.acss');
      expect(fs.existsSync(file)).toBe(true);
    });

    test('index.json exists and is valid JSON', () => {
      const file = path.join(indexDir, 'index.json');
      expect(fs.existsSync(file)).toBe(true);
      const content = fs.readFileSync(file, 'utf8');
      expect(() => JSON.parse(content)).not.toThrow();
    });
  });

  describe('Required Files - Utilities', () => {
    test('utils/api.js exists', () => {
      const file = path.join(miniappDir, 'utils', 'api.js');
      expect(fs.existsSync(file)).toBe(true);
    });

    test('utils/api.js is not empty', () => {
      const file = path.join(miniappDir, 'utils', 'api.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content.length).toBeGreaterThan(100);
    });
  });

  describe('Root Configuration Files', () => {
    test('package.json exists in root', () => {
      const file = path.join(projectRoot, 'package.json');
      expect(fs.existsSync(file)).toBe(true);
    });

    test('.env.example exists', () => {
      const file = path.join(projectRoot, '.env.example');
      expect(fs.existsSync(file)).toBe(true);
    });

    test('scripts/init-dev.sh exists', () => {
      const file = path.join(projectRoot, 'scripts', 'init-dev.sh');
      expect(fs.existsSync(file)).toBe(true);
    });

    test('CLAUDE.md exists', () => {
      const file = path.join(projectRoot, 'CLAUDE.md');
      expect(fs.existsSync(file)).toBe(true);
    });

    test('README.md exists', () => {
      const file = path.join(projectRoot, 'README.md');
      expect(fs.existsSync(file)).toBe(true);
    });
  });

  describe('JSON Files Validity', () => {
    test('app.json has pages array', () => {
      const file = path.join(miniappDir, 'app.json');
      const content = JSON.parse(fs.readFileSync(file, 'utf8'));
      expect(Array.isArray(content.pages)).toBe(true);
      expect(content.pages.length).toBeGreaterThan(0);
    });

    test('app.json has window configuration', () => {
      const file = path.join(miniappDir, 'app.json');
      const content = JSON.parse(fs.readFileSync(file, 'utf8'));
      expect(typeof content.window).toBe('object');
    });

    test('index.json is valid', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.json');
      const content = JSON.parse(fs.readFileSync(file, 'utf8'));
      expect(typeof content).toBe('object');
    });

    test('mini.project.json has projectId', () => {
      const file = path.join(miniappDir, 'mini.project.json');
      const content = JSON.parse(fs.readFileSync(file, 'utf8'));
      expect(content.projectId).toBeDefined();
    });
  });

  describe('.gitignore Configuration', () => {
    test('.gitignore exists', () => {
      const file = path.join(projectRoot, '.gitignore');
      expect(fs.existsSync(file)).toBe(true);
    });

    test('.gitignore includes .env', () => {
      const file = path.join(projectRoot, '.gitignore');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toContain('.env');
    });

    test('.gitignore includes node_modules', () => {
      const file = path.join(projectRoot, '.gitignore');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toContain('node_modules');
    });
  });
});
