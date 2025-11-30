const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const shared = path.join(root, 'shared', 'lbh.ts');
const outFunc = path.join(root, 'supabase', 'functions', '_lib', 'lbh.ts');
const outFrontend = path.join(root, 'src', 'lib', 'lbh.ts');

function copy(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`Copied ${src} -> ${dest}`);
}

try {
  copy(shared, outFunc);
  copy(shared, outFrontend);
  console.log('Shared build complete');
} catch (err) {
  console.error('Build shared failed', err);
  process.exit(1);
}
