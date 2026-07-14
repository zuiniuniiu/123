/**
 * Script smoke test — checks app is running and key endpoints are reachable.
 * Usage: node scripts/smoke.mjs
 * Requires the app to be running on http://localhost:5000
 */
const BASE = 'http://localhost:5000';

const endpoints = [
  { path: '/', label: '首页' },
  { path: '/Seat/Index', label: 'P02 座位列表' },
  { path: '/Seat/Detail?id=1', label: 'P03 座位详情 (id=1)' },
  { path: '/Seat/Detail?id=4', label: 'P03 维护中座位 (id=4)' },
  { path: '/Reservation/MyReservations', label: 'P05 我的预约' },
  { path: '/Admin/Login', label: 'P06 管理员登录' },
  { path: '/Admin/Statistics', label: 'P09 统计页（未登录应302→登录页）' },
];

async function check() {
  let passed = 0;
  let failed = 0;
  const results = [];

  for (const ep of endpoints) {
    try {
      const res = await fetch(`${BASE}${ep.path}`, { redirect: 'manual' });
      const status = res.status;
      // Accept 200 or 302 (redirect, e.g. for protected pages)
      if (status === 200 || status === 302) {
        results.push(`  ✅ ${ep.label} (${ep.path}) → ${status}`);
        passed++;
      } else {
        results.push(`  ❌ ${ep.label} (${ep.path}) → ${status} (unexpected)`);
        failed++;
      }
    } catch (err) {
      results.push(`  💥 ${ep.label} (${ep.path}) → ERROR: ${err.message}`);
      failed++;
    }
  }

  console.log('\n=== 脚本烟雾测试结果 ===\n');
  results.forEach(r => console.log(r));
  console.log(`\n总计: ${endpoints.length} | 通过: ${passed} | 失败: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

check();
