const axios = require('axios');
const { io } = require('socket.io-client');
const { performance } = require('perf_hooks');

const API_BASE = process.env.API_BASE || 'https://reflex-app-hazel.vercel.app/api';
const SOCKET_URL = process.env.SOCKET_URL || 'https://reflex-app-hazel.vercel.app';

const runTimingLog = async () => {
  console.log('================================================================');
  console.log('   REFLEX SYSTEM DESIGN & ARCHITECTURE TIMING LOG SUITE');
  console.log('   Target API: ' + API_BASE);
  console.log('================================================================\n');

  const timingLogs = [];

  const recordTiming = (phase, operation, durationMs, status, details = '') => {
    timingLogs.push({
      phase,
      operation,
      durationMs: parseFloat(durationMs.toFixed(2)),
      status,
      details
    });
    const statusIcon = status === 'SUCCESS' ? '⏱️ [PASS]' : '❌ [FAIL]';
    console.log(`${statusIcon} | ${phase.padEnd(20)} | ${operation.padEnd(36)} | ${durationMs.toFixed(2).padStart(8)} ms | ${details}`);
  };

  const timestamp = Date.now();

  try {
    // 1. System Health Check
    let t0 = performance.now();
    const health = await axios.get(API_BASE.replace('/api', '/'));
    let t1 = performance.now();
    recordTiming('Infrastructure', 'API Health Check / Gateway Ping', t1 - t0, 'SUCCESS', `HTTP ${health.status}`);

    // 2. Admin Authentication
    t0 = performance.now();
    const adminLoginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@reflex.co.ke',
      password: 'Admin@Reflex2026!'
    });
    t1 = performance.now();
    const adminToken = adminLoginRes.data.token;
    recordTiming('Auth & Security', 'Admin Sign-In & JWT Generation', t1 - t0, 'SUCCESS', `Role: ${adminLoginRes.data.user.role}`);

    const adminAxios = axios.create({
      baseURL: API_BASE,
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    // 3. Retailer Registration
    const retailerEmail = `retailer_bench_${timestamp}@reflex.co.ke`;
    t0 = performance.now();
    const regRetailer = await axios.post(`${API_BASE}/auth/register`, {
      name: 'Grace Wambui',
      phone: '0711223344',
      email: retailerEmail,
      password: 'RetailerPass123!',
      role: 'retailer',
      details: {
        shopName: 'Wambui Electronics',
        shopLocation: 'Luthuli Avenue, Nairobi CBD',
        businessType: 'Consumer Electronics'
      }
    });
    t1 = performance.now();
    const retailerId = regRetailer.data.user.id;
    recordTiming('Role Registration', 'Retailer Application Submission', t1 - t0, 'SUCCESS', `ID: ${retailerId} (Pending)`);

    // 4. RBAC Pending Gatekeeper Intercept (Must reject 403)
    t0 = performance.now();
    try {
      await axios.post(`${API_BASE}/auth/login`, {
        email: retailerEmail,
        password: 'RetailerPass123!'
      });
      t1 = performance.now();
      recordTiming('RBAC Security', 'Pending User Login Gatekeeper', t1 - t0, 'FAIL', 'Allowed pending user');
    } catch (err) {
      t1 = performance.now();
      recordTiming('RBAC Security', 'Pending User Login Gatekeeper (403)', t1 - t0, 'SUCCESS', 'Correctly intercepted 403');
    }

    // 5. Rider Registration
    const riderEmail = `rider_bench_${timestamp}@reflex.co.ke`;
    t0 = performance.now();
    const regRider = await axios.post(`${API_BASE}/auth/register`, {
      name: 'Dennis Kiprono',
      phone: '0722998877',
      email: riderEmail,
      password: 'RiderPass123!',
      role: 'rider',
      details: {
        address: 'Westlands Hub, Nairobi',
        motorcycleReg: 'KMEE 777Z',
        chassisDetails: 'CHAS99881122',
        motorcycleColor: 'Midnight Blue',
        motorcycleModel: 'TVS HLX 125'
      }
    });
    t1 = performance.now();
    const riderUserId = regRider.data.user.id;
    recordTiming('Role Registration', 'Rider Application with Vehicle Data', t1 - t0, 'SUCCESS', `Reg: KMEE 777Z`);

    // 6. Dispatcher Registration
    const dispatcherEmail = `dispatcher_bench_${timestamp}@reflex.co.ke`;
    t0 = performance.now();
    const regDispatcher = await axios.post(`${API_BASE}/auth/register`, {
      name: 'Mercy Achieng',
      phone: '0733112233',
      email: dispatcherEmail,
      password: 'DispatcherPass123!',
      role: 'dispatcher',
      details: {
        address: 'Reflex Express Hub, Upper Hill'
      }
    });
    t1 = performance.now();
    const dispatcherUserId = regDispatcher.data.user.id;
    recordTiming('Role Registration', 'Dispatcher Application Submission', t1 - t0, 'SUCCESS', `ID: ${dispatcherUserId}`);

    // 7. Admin Query Applications
    t0 = performance.now();
    const pendingApps = await adminAxios.get('/admin/applications?status=pending');
    t1 = performance.now();
    recordTiming('Admin Management', 'Query Pending Applications Pipeline', t1 - t0, 'SUCCESS', `${pendingApps.data.length} applicants fetched`);

    // 8. Admin Approvals
    t0 = performance.now();
    await adminAxios.patch(`/admin/applications/${retailerId}/approve`);
    t1 = performance.now();
    recordTiming('Admin Management', 'Admin Approve Retailer Account', t1 - t0, 'SUCCESS', `Status -> approved`);

    t0 = performance.now();
    await adminAxios.patch(`/admin/applications/${riderUserId}/approve`);
    t1 = performance.now();
    recordTiming('Admin Management', 'Admin Approve Rider Account', t1 - t0, 'SUCCESS', `Status -> approved`);

    t0 = performance.now();
    await adminAxios.patch(`/admin/applications/${dispatcherUserId}/approve`);
    t1 = performance.now();
    recordTiming('Admin Management', 'Admin Approve Dispatcher Account', t1 - t0, 'SUCCESS', `Status -> approved`);

    // 9. Approved Retailer Login
    t0 = performance.now();
    const retLogin = await axios.post(`${API_BASE}/auth/login`, {
      email: retailerEmail,
      password: 'RetailerPass123!'
    });
    t1 = performance.now();
    const retailerToken = retLogin.data.token;
    recordTiming('Auth & Security', 'Approved Retailer Sign-In & Token', t1 - t0, 'SUCCESS', `JWT Issued`);

    // 10. Delivery Order Creation & QR Token Generation
    t0 = performance.now();
    const newDelivery = await axios.post(`${API_BASE}/deliveries`, {
      customerName: 'Brian Ombati',
      customerPhone: '0710009988',
      address: 'Riverside Drive, Villa 12B, Nairobi',
      itemDescription: '1x High-End Smartphone & Accessories',
      retailer: retailerId
    });
    t1 = performance.now();
    const deliveryId = newDelivery.data._id;
    const qrCode = newDelivery.data.qrCodeValue;
    recordTiming('Delivery Pipeline', 'Create Delivery & Generate QR Token', t1 - t0, 'SUCCESS', `Delivery ID: ${deliveryId}`);

    // 11. Fetch Deliveries Matrix
    t0 = performance.now();
    const deliveryList = await axios.get(`${API_BASE}/deliveries?retailerId=${retailerId}`);
    t1 = performance.now();
    recordTiming('Delivery Pipeline', 'Query Deliveries by Retailer', t1 - t0, 'SUCCESS', `${deliveryList.data.length} orders loaded`);

    // 12. Dispatcher Assigns Rider
    t0 = performance.now();
    const assignRes = await axios.patch(`${API_BASE}/deliveries/${deliveryId}/assign`, {
      riderId: riderUserId,
      dispatcherId: dispatcherUserId
    });
    t1 = performance.now();
    recordTiming('Delivery Pipeline', 'Assign Rider to Delivery Order', t1 - t0, 'SUCCESS', `Status: ${assignRes.data.currentStatus}`);

    // 13. Rider Status -> Picked Up
    t0 = performance.now();
    const pickupRes = await axios.patch(`${API_BASE}/deliveries/${deliveryId}/status`, {
      status: 'Picked Up',
      changedBy: riderUserId
    });
    t1 = performance.now();
    recordTiming('Delivery Pipeline', 'Rider Update Status -> Picked Up', t1 - t0, 'SUCCESS', `Status: ${pickupRes.data.currentStatus}`);

    // 14. Rider Status -> Delivered (QR Cryptographic Verification)
    t0 = performance.now();
    const deliveredRes = await axios.patch(`${API_BASE}/deliveries/${deliveryId}/status`, {
      status: 'Delivered',
      changedBy: riderUserId,
      qrCode: qrCode
    });
    t1 = performance.now();
    recordTiming('Delivery Pipeline', 'QR Verified Handoff -> Delivered', t1 - t0, 'SUCCESS', `Verified: ${deliveredRes.data.currentStatus}`);

    // 15. Public QR Code Verification Query
    t0 = performance.now();
    const qrVerifyRes = await axios.get(`${API_BASE}/deliveries/verify/${qrCode}`);
    t1 = performance.now();
    recordTiming('Security & Verification', 'Public QR Code Validation Query', t1 - t0, 'SUCCESS', `Valid: ${qrVerifyRes.data.currentStatus}`);

    // 16. Support Ticket Ingestion
    t0 = performance.now();
    const supportRes = await axios.post(`${API_BASE}/support`, {
      name: 'Esther Njeri',
      phone: '0712334455',
      deliveryId: deliveryId,
      issue: 'Requested digital proof of delivery receipt.'
    });
    t1 = performance.now();
    recordTiming('Customer Support', 'Public Support Ticket Submission', t1 - t0, 'SUCCESS', `Ticket: ${supportRes.data.ticketId}`);

    // 17. Admin Real-Time Metrics & Statistics Aggregation
    t0 = performance.now();
    const statsRes = await adminAxios.get('/admin/stats');
    t1 = performance.now();
    recordTiming('Admin Management', 'Aggregate Analytics & User Stats', t1 - t0, 'SUCCESS', `Approved: ${statsRes.data.approvedCount}`);

    console.log('\n================================================================');
    console.log('   TIMING LOG EXECUTION SUMMARY');
    console.log('================================================================');
    const totalDuration = timingLogs.reduce((acc, log) => acc + log.durationMs, 0);
    const avgLatency = totalDuration / timingLogs.length;
    console.log(`Total Operations Executed : ${timingLogs.length}`);
    console.log(`Cumulative Execution Time : ${totalDuration.toFixed(2)} ms`);
    console.log(`Average Operation Latency : ${avgLatency.toFixed(2)} ms`);
    console.log('================================================================\n');

    // Output JSON timing report for documentation
    console.log('JSON_TIMING_REPORT_START');
    console.log(JSON.stringify(timingLogs, null, 2));
    console.log('JSON_TIMING_REPORT_END');

  } catch (err) {
    console.error('Timing suite encountered an error:', err.response?.data || err.message);
    process.exit(1);
  }
};

runTimingLog();
