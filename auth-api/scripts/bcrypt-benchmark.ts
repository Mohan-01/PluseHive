import bcrypt from 'bcrypt';

const password = 'VerySecurePassword123!';
const roundsToTest = [4, 8, 10, 12];

async function benchmark() {
  for (const rounds of roundsToTest) {
    console.time(`bcrypt hash with ${rounds} rounds`);
    await bcrypt.hash(password, rounds);
    console.timeEnd(`bcrypt hash with ${rounds} rounds`);
  }
}

benchmark();
