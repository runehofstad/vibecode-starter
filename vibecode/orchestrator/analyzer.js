import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';

/**
 * Project analyzer for automatic agent configuration
 * Detects project type, stack, and configures appropriate agents
 */

export class ProjectAnalyzer {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.projectInfo = {
      type: null,
      frontend: null,
      backend: null,
      mobile: null,
      database: null,
      deployment: null,
      testing: null,
      features: []
    };
  }

  /**
   * Analyze project and detect configuration
   */
  async analyze() {
    await this.detectProjectType();
    await this.detectFrontend();
    await this.detectBackend();
    await this.detectMobile();
    await this.detectDatabase();
    await this.detectTesting();
    await this.detectDeployment();
    await this.detectFeatures();

    return this.projectInfo;
  }

  /**
   * Detect overall project type
   */
  async detectProjectType() {
    const hasPackageJson = existsSync(join(this.projectRoot, 'package.json'));
    const hasGoMod = existsSync(join(this.projectRoot, 'go.mod'));
    const hasCargo = existsSync(join(this.projectRoot, 'Cargo.toml'));
    const hasPyproject = existsSync(join(this.projectRoot, 'pyproject.toml'));
    const hasRequirements = existsSync(join(this.projectRoot, 'requirements.txt'));

    if (hasPackageJson) {
      const pkg = JSON.parse(readFileSync(join(this.projectRoot, 'package.json'), 'utf8'));

      // Check for Next.js
      if (pkg.dependencies?.next || pkg.devDependencies?.next) {
        this.projectInfo.type = 'nextjs-fullstack';
        return;
      }

      // Check for React
      if (pkg.dependencies?.react || pkg.devDependencies?.react) {
        // Check if it's React Native
        if (pkg.dependencies?.['react-native']) {
          this.projectInfo.type = 'mobile-app';
          return;
        }
        this.projectInfo.type = 'web-app';
        return;
      }

      // Check for Express/Fastify/NestJS
      if (pkg.dependencies?.express || pkg.dependencies?.fastify || pkg.dependencies?.['@nestjs/core']) {
        this.projectInfo.type = 'api-backend';
        return;
      }

      // Check for Electron
      if (pkg.dependencies?.electron || pkg.devDependencies?.electron) {
        this.projectInfo.type = 'desktop-app';
        return;
      }

      // Check for CLI tool
      if (pkg.bin) {
        this.projectInfo.type = 'cli-tool';
        return;
      }
    }

    if (hasGoMod) {
      this.projectInfo.type = 'go-backend';
      return;
    }

    if (hasPyproject || hasRequirements) {
      // Check for Django/Flask
      if (hasRequirements) {
        const requirements = readFileSync(join(this.projectRoot, 'requirements.txt'), 'utf8');
        if (requirements.includes('django') || requirements.includes('flask')) {
          this.projectInfo.type = 'python-backend';
          return;
        }
      }
    }

    // Default to web-app if uncertain
    this.projectInfo.type = 'web-app';
  }

  /**
   * Detect frontend framework
   */
  async detectFrontend() {
    const hasPackageJson = existsSync(join(this.projectRoot, 'package.json'));

    if (!hasPackageJson) {
      this.projectInfo.frontend = null;
      return;
    }

    const pkg = JSON.parse(readFileSync(join(this.projectRoot, 'package.json'), 'utf8'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    if (deps.react) {
      this.projectInfo.frontend = 'react';
      if (deps.next) {
        this.projectInfo.frontend = 'nextjs';
      }
    } else if (deps.vue) {
      this.projectInfo.frontend = 'vue';
      if (deps.nuxt) {
        this.projectInfo.frontend = 'nuxt';
      }
    } else if (deps['@angular/core']) {
      this.projectInfo.frontend = 'angular';
    } else if (deps.svelte) {
      this.projectInfo.frontend = 'svelte';
      if (deps['@sveltejs/kit']) {
        this.projectInfo.frontend = 'sveltekit';
      }
    }
  }

  /**
   * Detect backend service
   */
  async detectBackend() {
    // Check for Supabase
    const hasSupabase = await this.checkForFiles(['supabase/**', '**/supabase.js', '**/supabase.ts']);
    if (hasSupabase) {
      this.projectInfo.backend = 'supabase';
      return;
    }

    // Check for Firebase
    const hasFirebase = await this.checkForFiles(['firebase.json', '**/firebase.js', '**/firebase.ts']);
    if (hasFirebase) {
      this.projectInfo.backend = 'firebase';
      return;
    }

    // Check for AWS
    const hasAWS = await this.checkForFiles(['serverless.yml', 'sam-template.yml', '**/aws-config.js']);
    if (hasAWS) {
      this.projectInfo.backend = 'aws';
      return;
    }

    // Check for custom backend
    const hasPackageJson = existsSync(join(this.projectRoot, 'package.json'));
    if (hasPackageJson) {
      const pkg = JSON.parse(readFileSync(join(this.projectRoot, 'package.json'), 'utf8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      if (deps.express || deps.fastify) {
        this.projectInfo.backend = 'node-api';
      } else if (deps['@nestjs/core']) {
        this.projectInfo.backend = 'nestjs';
      } else if (deps.graphql) {
        this.projectInfo.backend = 'graphql';
      }
    }
  }

  /**
   * Detect mobile framework
   */
  async detectMobile() {
    const hasPackageJson = existsSync(join(this.projectRoot, 'package.json'));

    if (hasPackageJson) {
      const pkg = JSON.parse(readFileSync(join(this.projectRoot, 'package.json'), 'utf8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      if (deps['react-native']) {
        this.projectInfo.mobile = 'react-native';
        if (deps.expo) {
          this.projectInfo.mobile = 'expo';
        }
      }
    }

    // Check for Flutter
    if (existsSync(join(this.projectRoot, 'pubspec.yaml'))) {
      this.projectInfo.mobile = 'flutter';
    }

    // Check for iOS
    const hasIOS = await this.checkForFiles(['*.xcodeproj', '*.xcworkspace']);
    if (hasIOS) {
      this.projectInfo.mobile = this.projectInfo.mobile || 'ios-native';
    }

    // Check for Android
    if (existsSync(join(this.projectRoot, 'build.gradle'))) {
      this.projectInfo.mobile = this.projectInfo.mobile || 'android-native';
    }
  }

  /**
   * Detect database
   */
  async detectDatabase() {
    // Check for Prisma
    if (existsSync(join(this.projectRoot, 'prisma', 'schema.prisma'))) {
      this.projectInfo.database = 'prisma';
      return;
    }

    // Check for migrations folders
    const hasMigrations = await this.checkForFiles(['migrations/**', 'db/migrate/**']);
    if (hasMigrations) {
      // Try to detect specific database from config
      const hasPostgres = await this.checkForFiles(['**/postgres*', '**/postgresql*']);
      const hasMysql = await this.checkForFiles(['**/mysql*']);
      const hasMongo = await this.checkForFiles(['**/mongo*']);

      if (hasPostgres) this.projectInfo.database = 'postgresql';
      else if (hasMysql) this.projectInfo.database = 'mysql';
      else if (hasMongo) this.projectInfo.database = 'mongodb';
      else this.projectInfo.database = 'sql';
    }
  }

  /**
   * Detect testing framework
   */
  async detectTesting() {
    const hasPackageJson = existsSync(join(this.projectRoot, 'package.json'));

    if (hasPackageJson) {
      const pkg = JSON.parse(readFileSync(join(this.projectRoot, 'package.json'), 'utf8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      if (deps.jest) this.projectInfo.testing = 'jest';
      else if (deps.vitest) this.projectInfo.testing = 'vitest';
      else if (deps.mocha) this.projectInfo.testing = 'mocha';
      else if (deps['@playwright/test']) this.projectInfo.testing = 'playwright';
      else if (deps.cypress) this.projectInfo.testing = 'cypress';
    }
  }

  /**
   * Detect deployment target
   */
  async detectDeployment() {
    // Check for Vercel
    if (existsSync(join(this.projectRoot, 'vercel.json'))) {
      this.projectInfo.deployment = 'vercel';
      return;
    }

    // Check for Netlify
    if (existsSync(join(this.projectRoot, 'netlify.toml'))) {
      this.projectInfo.deployment = 'netlify';
      return;
    }

    // Check for Docker
    if (existsSync(join(this.projectRoot, 'Dockerfile'))) {
      this.projectInfo.deployment = 'docker';
      return;
    }

    // Check for GitHub Actions
    const hasGHA = await this.checkForFiles(['.github/workflows/*.yml']);
    if (hasGHA) {
      this.projectInfo.deployment = 'github-actions';
    }
  }

  /**
   * Detect special features
   */
  async detectFeatures() {
    const features = [];

    // Check for authentication
    const hasAuth = await this.checkForFiles(['**/auth/**', '**/login*', '**/signup*']);
    if (hasAuth) features.push('authentication');

    // Check for payment
    const hasPayment = await this.checkForFiles(['**/stripe*', '**/payment*', '**/billing*']);
    if (hasPayment) features.push('payment');

    // Check for real-time
    const hasRealtime = await this.checkForFiles(['**/socket*', '**/websocket*', '**/realtime*']);
    if (hasRealtime) features.push('realtime');

    // Check for i18n
    const hasI18n = await this.checkForFiles(['**/i18n/**', '**/locales/**', '**/translations/**']);
    if (hasI18n) features.push('internationalization');

    // Check for PWA
    const hasPWA = await this.checkForFiles(['manifest.json', 'service-worker.js', 'sw.js']);
    if (hasPWA) features.push('pwa');

    this.projectInfo.features = features;
  }

  /**
   * Check if files matching patterns exist
   */
  async checkForFiles(patterns) {
    for (const pattern of patterns) {
      const files = await glob(pattern, { cwd: this.projectRoot });
      if (files.length > 0) return true;
    }
    return false;
  }

  /**
   * Get recommended agents based on analysis
   */
  getRecommendedAgents() {
    const agents = [];

    // Always include testing and security
    agents.push('testing-agent', 'security-agent');

    // Frontend agents
    if (this.projectInfo.frontend) {
      agents.push('frontend-agent', 'design-agent');
      if (this.projectInfo.features.includes('pwa')) {
        agents.push('pwa-offline-agent');
      }
    }

    // Backend agents
    if (this.projectInfo.backend) {
      agents.push('backend-agent');
      if (this.projectInfo.backend === 'supabase') {
        agents.push('backend-agent'); // Supabase specialist
      } else if (this.projectInfo.backend === 'firebase') {
        agents.push('firebase-backend-agent');
      } else if (this.projectInfo.backend === 'aws') {
        agents.push('aws-backend-agent');
      } else if (this.projectInfo.backend === 'graphql') {
        agents.push('api-graphql-agent');
      }
    }

    // Mobile agents
    if (this.projectInfo.mobile) {
      agents.push('mobile-agent');
      if (this.projectInfo.mobile === 'flutter') {
        agents.push('flutter-agent');
      } else if (this.projectInfo.mobile === 'ios-native') {
        agents.push('ios-swift-agent');
      }
    }

    // Database agents
    if (this.projectInfo.database) {
      agents.push('data-agent', 'database-migration-agent');
    }

    // Deployment agents
    if (this.projectInfo.deployment) {
      agents.push('devops-agent');
      if (this.projectInfo.deployment === 'docker') {
        agents.push('docker-container-agent');
      }
    }

    // Feature-specific agents
    if (this.projectInfo.features.includes('authentication')) {
      agents.push('security-agent');
    }
    if (this.projectInfo.features.includes('payment')) {
      agents.push('payment-agent');
    }
    if (this.projectInfo.features.includes('realtime')) {
      agents.push('websocket-realtime-agent');
    }
    if (this.projectInfo.features.includes('internationalization')) {
      agents.push('localization-agent');
    }

    // Remove duplicates
    return [...new Set(agents)];
  }
}

export default ProjectAnalyzer;