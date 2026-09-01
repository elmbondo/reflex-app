const axios = require('axios');
const { io } = require('socket.io-client');

const API_BASE = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

const runTests = async () => {
  console.log('=== STARTING END-TO-END VERIFICATION SUITE ===\n');
  const results = [];

  const record = (name, passed, detail = '') => {
    results.push({ name, passed, detail });
    console.log(`${passed ? '✅ PASS' : '❌ FAIL'}: ${name} ${detail ? '(' + detail + ')' : ''}`);
  };

  const timestamp = Date.now();

  try {
    // 1. Health check
    const health = await axios.get('http://localhost:5000/');
    record('API Health Check', health.status === 200 && health.data === 'Reflex API is running');

    // 2. Admin Login
    let adminToken = '';
    const adminLoginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@reflex.co.ke',
      password: 'Admin@Reflex2026!'
    });
    adminToken = adminLoginRes.data.token;
    record('Admin Login', adminLoginRes.status === 200 && Boolean(adminToken), `Role: ${adminLoginRes.data.user.role}`);

    const adminAxios = axios.create({
      baseURL: API_BASE,
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    // 3. Retailer Registration (Pending)
    const retailerEmail = `retailer_${timestamp}@test.co.ke`;
    const regRetailer = await axios.post(`${API_BASE}/auth/register`, {
      name: 'Wanjiku Kamau',
      phone: '0712345678',
      email: retailerEmail,
      password: 'RetailerPass123!',
      role: 'retailer',
      details: {
        shopName: 'Wanjiku Boutique',
        shopLocation: 'Biashara Street, Nairobi CBD',
        businessType: 'Fashion & Apparel'
      }
    });
    const retailerId = regRetailer.data.user.id;
    record('Retailer Registration', regRetailer.status === 201 && regRetailer.data.user.status === 'pending', `ID: ${retailerId}`);

    // 4. Pending Retailer Login Attempt (Must be BLOCKED with 403)
    try {
      await axios.post(`${API_BASE}/auth/login`, {
        email: retailerEmail,
        password: 'RetailerPass123!'
      });
      record('Pending Retailer Blocked', false, 'Allowed login when pending!');
    } catch (err) {
      record('Pending Retailer Blocked', err.response?.status === 403 && err.response?.data?.status === 'pending', 'Correctly rejected with 403 pending');
    }

    // 5. Rider Registration (Pending)
    const riderEmail = `rider_${timestamp}@test.co.ke`;
    const regRider = await axios.post(`${API_BASE}/auth/register`, {
      name: 'Kevin Otieno',
      phone: '0722334455',
      email: riderEmail,
      password: 'RiderPass123!',
      role: 'rider',
      details: {
        address: 'Ngara Stage Base, Nairobi',
        motorcycleReg: 'KMDF 500X',
        chassisDetails: 'MD2A35BY2NW999888',
        motorcycleColor: 'Solid Red',
        motorcycleModel: 'Boxer BM 150'
      }
    });
    const riderUserId = regRider.data.user.id;
    record('Rider Registration', regRider.status === 201 && regRider.data.user.status === 'pending', `Reg: KMDF 500X`);

    // 6. Dispatcher Registration (Pending)
    const dispatcherEmail = `dispatcher_${timestamp}@test.co.ke`;
    const regDispatcher = await axios.post(`${API_BASE}/auth/register`, {
      name: 'Sarah Mwangi',
      phone: '0733445566',
      email: dispatcherEmail,
      password: 'DispatcherPass123!',
      role: 'dispatcher',
      details: {
        address: 'Reflex Central Hub, Industrial Area'
      }
    });
    const dispatcherUserId = regDispatcher.data.user.id;
    record('Dispatcher Registration', regDispatcher.status === 201 && regDispatcher.data.user.status === 'pending');

    // 7. Rejected User Registration & Rejection Flow
    const rejectedEmail = `baduser_${timestamp}@test.co.ke`;
    const regBadUser = await axios.post(`${API_BASE}/auth/register`, {
      name: 'Bad Actor',
      phone: '0700112233',
      email: rejectedEmail,
      password: 'BadUserPass123!',
      role: 'rider',
      details: {
        address: 'Unknown',
        motorcycleReg: 'FAKE 000',
        chassisDetails: 'NONE',
        motorcycleColor: 'Black',
        motorcycleModel: 'None'
      }
    });
    const badUserId = regBadUser.data.user.id;
    // Admin rejects bad user
    const rejectRes = await adminAxios.patch(`/admin/applications/${badUserId}/reject`);
    record('Admin Reject Application', rejectRes.status === 200 && rejectRes.data.user.status === 'rejected');

    // Rejected user login attempt (Must be BLOCKED with 403)
    try {
      await axios.post(`${API_BASE}/auth/login`, {
        email: rejectedEmail,
        password: 'BadUserPass123!'
      });
      record('Rejected User Blocked', false, 'Allowed login when rejected!');
    } catch (err) {
      record('Rejected User Blocked', err.response?.status === 403 && err.response?.data?.status === 'rejected', 'Correctly rejected with 403 rejected');
    }

    // 8. Admin Application Listing & Role-specific details review
    const pendingApps = await adminAxios.get('/admin/applications?status=pending');
    const hasRetailer = pendingApps.data.some(a => a._id === retailerId && a.details?.shopName === 'Wanjiku Boutique');
    const hasRider = pendingApps.data.some(a => a._id === riderUserId && a.details?.motorcycleReg === 'KMDF 500X');
    record('Admin View Applications with Details', hasRetailer && hasRider, `Total Pending: ${pendingApps.data.length}`);

    // 9. Admin Approves Retailer, Rider, and Dispatcher
    const appRetailerRes = await adminAxios.patch(`/admin/applications/${retailerId}/approve`);
    record('Admin Approve Retailer', appRetailerRes.status === 200 && appRetailerRes.data.user.status === 'approved');

    const appRiderRes = await adminAxios.patch(`/admin/applications/${riderUserId}/approve`);
    record('Admin Approve Rider', appRiderRes.status === 200 && appRiderRes.data.user.status === 'approved');

    const appDispatcherRes = await adminAxios.patch(`/admin/applications/${dispatcherUserId}/approve`);
    record('Admin Approve Dispatcher', appDispatcherRes.status === 200 && appDispatcherRes.data.user.status === 'approved');

    // 10. Approved Retailer Login (Must SUCCEED with 200 + JWT)
    const retailerLoginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: retailerEmail,
      password: 'RetailerPass123!'
    });
    const retailerToken = retailerLoginRes.data.token;
    record('Approved Retailer Login', retailerLoginRes.status === 200 && Boolean(retailerToken), `Role: ${retailerLoginRes.data.user.role}`);

    // 11. Approved Rider Login
    const riderLoginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: riderEmail,
      password: 'RiderPass123!'
    });
    const riderToken = riderLoginRes.data.token;
    record('Approved Rider Login', riderLoginRes.status === 200 && Boolean(riderToken));

    // 12. Approved Dispatcher Login
    const dispatcherLoginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: dispatcherEmail,
      password: 'DispatcherPass123!'
    });
    const dispatcherToken = dispatcherLoginRes.data.token;
    record('Approved Dispatcher Login', dispatcherLoginRes.status === 200 && Boolean(dispatcherToken));

    // 13. Socket.io Real-time Event Verification
    const socket = io(SOCKET_URL);
    let socketConnected = false;
    let deliveryCreatedFired = false;
    let deliveryUpdatedFired = false;

    await new Promise((resolve) => {
      socket.on('connect', () => {
        socketConnected = true;
        resolve();
      });
      setTimeout(resolve, 2000);
    });
    record('Socket.io Connection', socketConnected);

    socket.on('delivery-created', () => {
      deliveryCreatedFired = true;
    });
    socket.on('delivery-updated', () => {
      deliveryUpdatedFired = true;
    });

    // 14. Real Delivery Creation by Approved Retailer
    const newDelivery = await axios.post(`${API_BASE}/deliveries`, {
      customerName: 'Amina Hassan',
      customerPhone: '0711998877',
      address: 'Kilimani, Wood Avenue Apt 4B',
      itemDescription: '1x Designer Handbag (Secure Box)',
      retailer: retailerId
    });
    const deliveryId = newDelivery.data._id;
    const qrCode = newDelivery.data.qrCodeValue;
    record('Create Delivery (Retailer)', newDelivery.status === 201 && Boolean(deliveryId), `Delivery ID: ${deliveryId}`);

    // 15. Fetch Deliveries
    const listDeliveries = await axios.get(`${API_BASE}/deliveries?retailerId=${retailerId}`);
    record('Fetch Deliveries List', listDeliveries.status === 200 && listDeliveries.data.length > 0);

    // 16. Dispatcher Assigns Rider
    const assignRes = await axios.patch(`${API_BASE}/deliveries/${deliveryId}/assign`, {
      riderId: riderUserId,
      dispatcherId: dispatcherUserId
    });
    record('Assign Rider (Dispatcher)', assignRes.status === 200 && assignRes.data.currentStatus === 'Assigned');

    // 17. Rider Updates Status to "Picked Up"
    const pickupRes = await axios.patch(`${API_BASE}/deliveries/${deliveryId}/status`, {
      status: 'Picked Up',
      changedBy: riderUserId
    });
    record('Status Update -> Picked Up (Rider)', pickupRes.status === 200 && pickupRes.data.currentStatus === 'Picked Up');

    // 18. Rider Updates Status to "Delivered" with QR Code
    const deliverRes = await axios.patch(`${API_BASE}/deliveries/${deliveryId}/status`, {
      status: 'Delivered',
      changedBy: riderUserId,
      qrCode: qrCode
    });
    record('Status Update -> Delivered with QR (Rider)', deliverRes.status === 200 && deliverRes.data.currentStatus === 'Delivered');

    // 19. Check Socket.io Event Triggers
    await new Promise(r => setTimeout(r, 1000));
    record('Socket.io Real-time Broadcasts', deliveryCreatedFired && deliveryUpdatedFired);
    socket.disconnect();

    // 20. Admin Statistics Verification
    const statsRes = await adminAxios.get('/admin/stats');
    record('Admin Statistics Live Query', statsRes.status === 200 && statsRes.data.approvedCount >= 3, `Total approved: ${statsRes.data.approvedCount}`);

    // 21. Support Ticket Submission (Public)
    const supportRes = await axios.post(`${API_BASE}/support`, {
      name: 'Otieno Odhiambo',
      phone: '0722000111',
      deliveryId: deliveryId,
      issue: 'Customer requested an updated delivery ETA for parcel.'
    });
    record('Submit Support Ticket (Public)', supportRes.status === 201 && Boolean(supportRes.data.ticketId), `Ticket ID: ${supportRes.data.ticketId}`);

    console.log('\n=== ALL VERIFICATION TESTS COMPLETED ===');
    const allPassed = results.every(r => r.passed);
    console.log(`\nTOTAL TESTS: ${results.length} | PASSED: ${results.filter(r => r.passed).length} | FAILED: ${results.filter(r => !r.passed).length}`);
    console.log(`OVERALL RESULT: ${allPassed ? 'ALL TESTS PASSED ✅' : 'FAILURES DETECTED ❌'}`);
    process.exit(allPassed ? 0 : 1);

  } catch (err) {
    console.error('Test suite exception:', err.response?.data || err.message);
    process.exit(1);
  }
};

runTests();
