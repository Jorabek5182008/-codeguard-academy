// Usage: node scripts/hash-password.js "your-strong-password"
const bcrypt = require('bcryptjs');

const pw = process.argv[2];
if (!pw) {
  console.error('Usage: node scripts/hash-password.js "your-strong-password"');
  process.exit(1);
}

const hash = bcrypt.hashSync(pw, 12);
console.log('\nAdd this to .env.local:\n');
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
