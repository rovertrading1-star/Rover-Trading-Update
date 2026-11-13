import fs from 'fs';
import path from 'path';
import * as esbuild from 'esbuild';

function loadEnvFile(filePath) {
  const vars = {};
  if (!fs.existsSync(filePath)) return vars;
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    vars[key] = val;
  }
  return vars;
}

const rootDir = process.cwd();
const envVars = {
  ...loadEnvFile(path.join(rootDir, '.env')),
  ...loadEnvFile(path.join(rootDir, '.env.local')),
  ...process.env
};

const getVar = (name) => JSON.stringify(envVars[name] || '');

await esbuild.build({
  entryPoints: [path.join(rootDir, 'src/firebase.js')],
  bundle: true,
  format: 'iife',
  outfile: path.join(rootDir, 'public/firebase.js'),
  define: {
    __EMAILJS_FROM_EMAIL__: JSON.stringify(envVars.VITE_EMAILJS_FROM_EMAIL || 'rovertrading1@gmail.com'),
    __EMAILJS_PUBLIC_KEY__: getVar('VITE_EMAILJS_PUBLIC_KEY'),
    __EMAILJS_SERVICE_ID__: getVar('VITE_EMAILJS_SERVICE_ID'),
    __EMAILJS_WELCOME_TEMPLATE_ID__: getVar('VITE_EMAILJS_WELCOME_TEMPLATE_ID'),
    __EMAILJS_ADMIN_TEMPLATE_ID__: getVar('VITE_EMAILJS_ADMIN_TEMPLATE_ID')
  }
});

fs.copyFileSync(
  path.join(rootDir, 'public/firebase.js'),
  path.join(rootDir, 'firebase.js')
);

console.log('Bundled public/firebase.js and copied to firebase.js');
