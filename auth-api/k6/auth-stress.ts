import http from 'k6/http';

export const options = {
  scenarios: {
    ramping: {
      executor: 'ramping-vus',
      stages: [
        { duration: '10s', target: 50 },
        { duration: '30s', target: 200 },
        { duration: '20s', target: 500 },
        { duration: '10s', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<1000', 'avg<500'],
  },
};
const users = Array.from({ length: 50 }, (_, i) => ({
  email: `testuser${i}@test.com`,
  password: '123456',
}));

export default function () {
  const randomUser = users[Math.floor(Math.random() * users.length)];

  const res = http.post('http://localhost:5001/api/auth/login', JSON.stringify(randomUser), {
    headers: { 'Content-Type': 'application/json' },
  });

  // Optional: track failed logins
  if (res.status !== 200) {
    console.error(`❌ Login failed for ${randomUser.email} → ${res.status}`);
  }
}
