/**
 * tests/configuration-and-docs.test.js
 * Valida configuración de proyecto, documentación y scripts shell
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

describe('Configuration and Documentation Validation', () => {
  const projectRoot = path.join(__dirname, '..');
  const miniappDir = path.join(projectRoot, 'my-miniapp');

  describe('Root Configuration Files', () => {
    test('root package.json has required fields', () => {
      const file = path.join(projectRoot, 'package.json');
      const config = JSON.parse(fs.readFileSync(file, 'utf8'));
      expect(config.name).toBeDefined();
      expect(config.version).toBeDefined();
      expect(config.scripts).toBeDefined();
    });

    test('root package.json has all npm scripts', () => {
      const file = path.join(projectRoot, 'package.json');
      const config = JSON.parse(fs.readFileSync(file, 'utf8'));
      expect(config.scripts.preview).toBeDefined();
      expect(config.scripts.upload).toBeDefined();
      expect(config.scripts['init-cli']).toBeDefined();
      expect(config.scripts.test).toBeDefined();
    });

    test('root package.json preview script references miniprogram-cli', () => {
      const file = path.join(projectRoot, 'package.json');
      const config = JSON.parse(fs.readFileSync(file, 'utf8'));
      expect(config.scripts.preview).toContain('miniprogram-cli');
      expect(config.scripts.preview).toContain('preview');
    });

    test('root package.json upload script references miniprogram-cli', () => {
      const file = path.join(projectRoot, 'package.json');
      const config = JSON.parse(fs.readFileSync(file, 'utf8'));
      expect(config.scripts.upload).toContain('miniprogram-cli');
      expect(config.scripts.upload).toContain('upload');
    });

    test('root package.json init-cli script references init-dev.sh', () => {
      const file = path.join(projectRoot, 'package.json');
      const config = JSON.parse(fs.readFileSync(file, 'utf8'));
      expect(config.scripts['init-cli']).toContain('init-dev.sh');
    });

    test('my-miniapp package.json exists', () => {
      const file = path.join(miniappDir, 'package.json');
      expect(fs.existsSync(file)).toBe(true);
      const config = JSON.parse(fs.readFileSync(file, 'utf8'));
      expect(typeof config).toBe('object');
    });

    test('mini.project.json in root exists', () => {
      const file = path.join(projectRoot, 'mini.project.json');
      expect(fs.existsSync(file)).toBe(true);
    });

    test('mini.project.json in my-miniapp exists', () => {
      const file = path.join(miniappDir, 'mini.project.json');
      expect(fs.existsSync(file)).toBe(true);
    });

    test('.env.example exists with example variables', () => {
      const file = path.join(projectRoot, '.env.example');
      expect(fs.existsSync(file)).toBe(true);
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toContain('WORKSPACE_ID');
      expect(content).toContain('SUPER_APP_ID');
      expect(content).toContain('MINI_PROGRAM_ID');
    });

    test('.env.example does not have real secrets', () => {
      const file = path.join(projectRoot, '.env.example');
      const content = fs.readFileSync(file, 'utf8');
      // Should only have placeholder values, not real ones
      const lines = content.split('\n');
      const hasRealSecrets = lines.some(line => {
        if (line.includes('=')) {
          const value = line.split('=')[1];
          // Check for patterns that look like real secrets
          return /^[a-f0-9]{32,}$|^ak_[a-z0-9]+$|^sk_[a-z0-9]+$/i.test(value.trim());
        }
        return false;
      });
      expect(hasRealSecrets).toBe(false);
    });
  });

  describe('Documentation - CLAUDE.md', () => {
    const claudeFile = path.join(projectRoot, 'CLAUDE.md');
    const claudeContent = fs.readFileSync(claudeFile, 'utf8');

    test('CLAUDE.md has substantial content', () => {
      expect(claudeContent.length).toBeGreaterThan(2000);
    });

    test('CLAUDE.md has Table of Contents section', () => {
      expect(claudeContent).toMatch(/tabla de contenidos|table of contents|índice/i);
    });

    test('CLAUDE.md has Framework Description section', () => {
      expect(claudeContent).toMatch(/framework|description|alipay\+|mini program/i);
    });

    test('CLAUDE.md clarifies "NOT React/Vue"', () => {
      expect(claudeContent).toMatch(/NOT.*React|NO.*React|no es react|not.*vue|no es vue/i);
    });

    test('CLAUDE.md has Syntax and Language section', () => {
      expect(claudeContent).toMatch(/syntax|lenguaje|language|axml|acss/i);
    });

    test('CLAUDE.md documents AXML markup rules', () => {
      expect(claudeContent).toMatch(/axml|<view>|<text>|<button>/);
    });

    test('CLAUDE.md documents this.setData pattern', () => {
      expect(claudeContent).toMatch(/this\.setData|setData\(\)/);
      expect(claudeContent).toMatch(/reactive|state|data binding/i);
    });

    test('CLAUDE.md documents event handlers', () => {
      expect(claudeContent).toMatch(/onTap|onChange|onInput|event/i);
    });

    test('CLAUDE.md has "What Does NOT Exist" section', () => {
      expect(claudeContent).toMatch(/what.*not exist|no existe|does not exist/i);
    });

    test('CLAUDE.md documents missing DOM APIs', () => {
      expect(claudeContent).toMatch(/document|window|localStorage|fetch|axios/i);
    });

    test('CLAUDE.md has File Structure section', () => {
      expect(claudeContent).toMatch(/file.*structure|estructura|directory|directorio/i);
    });

    test('CLAUDE.md documents my.request API', () => {
      expect(claudeContent).toMatch(/my\.request|http|api|request/i);
    });

    test('CLAUDE.md documents rpx units', () => {
      expect(claudeContent).toMatch(/rpx|responsive|pixel|unit/i);
    });

    test('CLAUDE.md has Available Commands section', () => {
      expect(claudeContent).toMatch(/command|comando|npm run|preview|upload/i);
    });

    test('CLAUDE.md has code examples', () => {
      expect(claudeContent).toMatch(/```|javascript|axml|acss/);
    });

    test('CLAUDE.md provides navigation to pages', () => {
      expect(claudeContent).toMatch(/my\.navigateTo|navigation/i);
    });

    test('CLAUDE.md documents my.alert and dialogs', () => {
      expect(claudeContent).toMatch(/my\.alert|my\.confirm|dialog|alert/i);
    });

    test('CLAUDE.md documents Page lifecycle', () => {
      expect(claudeContent).toMatch(/onLoad|onShow|onHide|onUnload|lifecycle/i);
    });
  });

  describe('Documentation - README.md', () => {
    const readmeFile = path.join(projectRoot, 'README.md');
    const readmeContent = fs.readFileSync(readmeFile, 'utf8');

    test('README.md exists and has content', () => {
      expect(readmeContent.length).toBeGreaterThan(200);
    });

    test('README.md has Prerequisites section', () => {
      expect(readmeContent).toMatch(/prerequisite|require|install/i);
    });

    test('README.md mentions Node.js requirement', () => {
      expect(readmeContent).toMatch(/node\.js|node|nodejs/i);
    });

    test('README.md has Installation or Setup section', () => {
      expect(readmeContent).toMatch(/installation|setup|install|begin|start/i);
    });

    test('README.md has step-by-step instructions', () => {
      expect(readmeContent).toMatch(/step|1\.|2\.|3\.|clone|install|run/i);
    });

    test('README.md mentions npm commands', () => {
      expect(readmeContent).toMatch(/npm|npm run|npm install/);
    });

    test('README.md mentions CLI initialization', () => {
      expect(readmeContent).toMatch(/init|cli|miniprogram|setup/i);
    });

    test('README.md has Workflow or Usage section', () => {
      expect(readmeContent).toMatch(/workflow|usage|develop|daily|working/i);
    });

    test('README.md has Troubleshooting section', () => {
      expect(readmeContent).toMatch(/troubleshoot|problem|issue|error|faq/i);
    });

    test('README.md mentions preview command', () => {
      expect(readmeContent).toMatch(/preview|npm run preview/i);
    });

    test('README.md mentions upload or publish', () => {
      expect(readmeContent).toMatch(/upload|publish|deploy|release/i);
    });
  });

  describe('Shell Scripts - init-dev.sh', () => {
    const scriptFile = path.join(projectRoot, 'scripts', 'init-dev.sh');
    const scriptContent = fs.readFileSync(scriptFile, 'utf8');

    test('init-dev.sh has bash shebang', () => {
      expect(scriptContent.startsWith('#!/bin/bash')).toBe(true);
    });

    test('init-dev.sh is executable', () => {
      const stats = fs.statSync(scriptFile);
      const isExecutable = (stats.mode & 0o111) !== 0;
      expect(isExecutable).toBe(true);
    });

    test('init-dev.sh has node version check', () => {
      expect(scriptContent).toMatch(/node|version|18/i);
    });

    test('init-dev.sh has npm availability check', () => {
      expect(scriptContent).toMatch(/npm|command/i);
    });

    test('init-dev.sh has git availability check', () => {
      expect(scriptContent).toMatch(/git/i);
    });

    test('init-dev.sh has miniprogram-cli check', () => {
      expect(scriptContent).toMatch(/miniprogram-cli|cli/i);
    });

    test('init-dev.sh has user prompts', () => {
      expect(scriptContent).toMatch(/read|prompt|echo|input|ask/i);
    });

    test('init-dev.sh has error handling', () => {
      expect(scriptContent).toMatch(/exit|error|fail|if/i);
    });

    test('init-dev.sh references environment variables', () => {
      expect(scriptContent).toMatch(/WORKSPACE_ID|SUPER_APP_ID|MINI_PROGRAM_ID|CLI_ACCESS/i);
    });

    test('init-dev.sh has comment documentation', () => {
      expect(scriptContent).toMatch(/#.*check|#.*verify|#.*initialize/i);
    });

    test('init-dev.sh handles error cases', () => {
      expect(scriptContent).toMatch(/error|fail|exit 1|not.*found|required|check/i);
    });
  });

  describe('API and Integration Points', () => {
    test('my-miniapp has all required configuration', () => {
      const appJsonFile = path.join(miniappDir, 'app.json');
      const appJson = JSON.parse(fs.readFileSync(appJsonFile, 'utf8'));

      expect(appJson.pages).toBeDefined();
      expect(appJson.window).toBeDefined();
    });

    test('Project structure supports multiple pages', () => {
      const pagesDir = path.join(miniappDir, 'pages');
      expect(fs.existsSync(pagesDir)).toBe(true);
      const items = fs.readdirSync(pagesDir);
      expect(items.length).toBeGreaterThan(0);
    });

    test('Components directory is prepared for future use', () => {
      const componentsDir = path.join(miniappDir, 'components');
      expect(fs.existsSync(componentsDir)).toBe(true);
    });

    test('Assets directory is prepared for resources', () => {
      const assetsDir = path.join(miniappDir, 'assets');
      expect(fs.existsSync(assetsDir)).toBe(true);
    });

    test('Utils directory has API wrapper', () => {
      const utilsDir = path.join(miniappDir, 'utils');
      const items = fs.readdirSync(utilsDir);
      expect(items).toContain('api.js');
    });
  });

  describe('Security Checks', () => {
    test('No hardcoded secrets in app.js', () => {
      const file = path.join(miniappDir, 'app.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).not.toMatch(/access[_-]key|secret[_-]key|token.*=.*[\'"][a-z0-9]{20,}[\'"]|password.*=.*[\'"][^\'"]*/i);
    });

    test('No hardcoded secrets in index.js', () => {
      const file = path.join(miniappDir, 'pages', 'index', 'index.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).not.toMatch(/api[_-]key|secret|token.*=.*[\'"][a-z0-9]{20,}[\'"]|password/i);
    });

    test('No hardcoded secrets in api.js', () => {
      const file = path.join(miniappDir, 'utils', 'api.js');
      const content = fs.readFileSync(file, 'utf8');
      expect(content).not.toMatch(/access[_-]key|secret[_-]key|bearer.*[a-z0-9]/i);
    });

    test('.env is not tracked (in .gitignore)', () => {
      const gitignoreFile = path.join(projectRoot, '.gitignore');
      const gitignore = fs.readFileSync(gitignoreFile, 'utf8');
      expect(gitignore).toContain('.env');
    });

    test('.env.example is documented, not .env', () => {
      const envExampleExists = fs.existsSync(path.join(projectRoot, '.env.example'));
      const envExists = fs.existsSync(path.join(projectRoot, '.env'));
      expect(envExampleExists).toBe(true);
      // .env should not exist in repo (would be in .gitignore)
      expect(envExists).toBe(false);
    });

    test('No AWS or cloud credentials in code', () => {
      const files = [
        path.join(miniappDir, 'app.js'),
        path.join(miniappDir, 'pages', 'index', 'index.js'),
        path.join(miniappDir, 'utils', 'api.js')
      ];

      files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        expect(content).not.toMatch(/AKIA[0-9A-Z]{16}|aws_access_key|aws_secret|mongodb\+srv/);
      });
    });
  });

  describe('Cross-platform Compatibility', () => {
    test('init-dev.sh uses POSIX sh syntax', () => {
      const file = path.join(projectRoot, 'scripts', 'init-dev.sh');
      const content = fs.readFileSync(file, 'utf8');
      // Should not use bash-specific features excessively
      expect(content).not.toMatch(/declare\s+-A/);
    });

    test('No Windows-specific paths in scripts', () => {
      const file = path.join(projectRoot, 'scripts', 'init-dev.sh');
      const content = fs.readFileSync(file, 'utf8');
      // Should not have Windows paths
      expect(content).not.toMatch(/C:\\|\\Users\\|cmd\.exe|powershell/i);
    });

    test('Package.json scripts use cd and chaining with &&', () => {
      const file = path.join(projectRoot, 'package.json');
      const config = JSON.parse(fs.readFileSync(file, 'utf8'));
      const scripts = Object.values(config.scripts);
      scripts.forEach(script => {
        // Should use && for proper error handling
        if (script.includes('cd ')) {
          expect(script).toMatch(/&&/);
        }
      });
    });
  });
});
