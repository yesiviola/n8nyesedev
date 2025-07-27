#!/usr/bin/env node

// Script optimizado para build de @n8n/chat en Render
const { spawn } = require('child_process');

console.log('🚀 Starting optimized @n8n/chat build for Render...');

// Configuración de memoria optimizada para Render
process.env.NODE_OPTIONS = '--max-old-space-size=3072 --max-semi-space-size=128';

// Build con configuración optimizada
const buildProcess = spawn('pnpm', ['run', 'build:vite'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'production',
    // Reducir paralelismo para usar menos memoria
    UV_THREADPOOL_SIZE: '2',
  }
});

buildProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ @n8n/chat build completed successfully!');
    
    // Ejecutar bundle build si el primer build fue exitoso
    const bundleProcess = spawn('pnpm', ['run', 'build:bundle'], {
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        NODE_ENV: 'production',
        UV_THREADPOOL_SIZE: '2',
      }
    });
    
    bundleProcess.on('close', (bundleCode) => {
      if (bundleCode === 0) {
        console.log('✅ @n8n/chat bundle build completed successfully!');
      } else {
        console.error('❌ @n8n/chat bundle build failed');
        process.exit(bundleCode);
      }
    });
    
  } else {
    console.error('❌ @n8n/chat build failed');
    process.exit(code);
  }
});

buildProcess.on('error', (error) => {
  console.error('❌ Failed to start build process:', error);
  process.exit(1);
});