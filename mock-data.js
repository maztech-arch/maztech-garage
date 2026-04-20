/**
 * mock-data.js — ข้อมูลกลางของระบบ Maztech Garage
 * =========================================================
 * วิธีสลับ mock ↔ Google Apps Script:
 *
 *   GAS_URL = null          → ใช้ข้อมูล mock ด้านล่าง
 *   GAS_URL = 'https://...' → ดึงจาก Google Apps Script จริง
 *
 * ขั้นตอนเชื่อม GAS:
 *   1. Deploy Code.gs เป็น Web App (ดูคำแนะนำ deploy)
 *   2. วาง URL ที่ได้ใน GAS_URL ด้านล่าง
 *   3. บันทึกไฟล์ — ทุกหน้าจะดึงข้อมูลจริงทันที
 * =========================================================
 */

// ── แก้ตรงนี้เพียงจุดเดียวเพื่อเชื่อม GAS ─────────────────
// const GAS_URL = null;  // ← mock mode
const GAS_URL = 'https://script.google.com/macros/s/AKfycbw148DigdORg8qcOrutbrdt1vq5XYPnILpqbPOpaKKTiRToW7sH3KnrrL4CPUriaJYt/exec';

const MockData = (() => {

  // ── GAS Fetch Helper ──────────────────────────────────────
  // ถ้า GAS_URL มีค่า จะ fetch จริง ไม่งั้นใช้ fallback mock
  async function gasFetch(action, params = {}) {
    if (!GAS_URL) return null;  // ใช้ mock แทน
    const qs  = new URLSearchParams({ action, ...params }).toString();
    const res = await fetch(`${GAS_URL}?${qs}`);
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || 'GAS error');
    return json.data;
  }

  // ─────────────────────────────────────────────
  // KPI / Dashboard Overview
  // ─────────────────────────────────────────────
  const dashboardData = {
    cashBalance:      284300,
    revenueMonth:     521800,
    expenseMonth:     218400,
    netProfitMonth:   303400,
    gpPercent:        58.1,
    carsInProgress:   8,
    carsWaitingParts: 3,
    carsReadyToDeliver: 2,
    arOverdue:        47500,
    arOverdueCount:   2,
    revenueChange:    12.4,   // % vs last month
    expenseChange:    -5.1,
    carsChange:       1,      // +1 vs yesterday
  };

  // ─────────────────────────────────────────────
  // Monthly Revenue & Car Count (6 months)
  // ─────────────────────────────────────────────
  const monthlyRevenue = [
    { month: 'ต.ค.', revenue: 412000, expense: 210000 },
    { month: 'พ.ย.', revenue: 388000, expense: 198000 },
    { month: 'ธ.ค.', revenue: 465000, expense: 225000 },
    { month: 'ม.ค.', revenue: 501000, expense: 230000 },
    { month: 'ก.พ.', revenue: 479000, expense: 218000 },
    { month: 'มี.ค.', revenue: 522000, expense: 218400 },
  ];

  const monthlyCars = [
    { month: 'ต.ค.', count: 38 },
    { month: 'พ.ย.', count: 34 },
    { month: 'ธ.ค.', count: 41 },
    { month: 'ม.ค.', count: 45 },
    { month: 'ก.พ.', count: 42 },
    { month: 'มี.ค.', count: 47 },
  ];

  const revenueByCategory = [
    { label: 'เครื่องยนต์ / DPF', percent: 38, color: '#1e6fc4' },
    { label: 'ช่วงล่าง / ช่วงบน',  percent: 24, color: '#059669' },
    { label: 'อะไหล่ทั่วไป',        percent: 19, color: '#f59e0b' },
    { label: 'เซอร์วิสตามระยะ',     percent: 12, color: '#7c3aed' },
    { label: 'อื่นๆ',               percent: 7,  color: '#e24b4a' },
  ];

  // ─────────────────────────────────────────────
  // Alerts
  // ─────────────────────────────────────────────
  const alerts = [
    { level: 'danger',  text: 'รถ ชม-5678 รออะไหล่เกิน 3 วัน',              tag: 'เร่งด่วน' },
    { level: 'warning', text: 'ลูกหนี้ 2 รายค้างเกิน 7 วัน รวม ฿47,500',   tag: 'ค้างชำระ' },
    { level: 'info',    text: 'มี 2 คันรอส่งมอบ ยังไม่ได้แจ้งลูกค้า',        tag: 'แจ้งเตือน' },
    { level: 'success', text: 'GP% เดือนนี้ 58.1% — สูงกว่า target ✓',       tag: 'ปกติ' },
  ];

  // ─────────────────────────────────────────────
  // Jobs List
  // ─────────────────────────────────────────────
  const jobs = [
    {
      id:           'MT-2504-0042',
      date:         '19 เม.ย. 68',
      plate:        'กข-1234',
      model:        'Mazda2 1.3E',
      customer:     'คุณวิชัย ท.',
      phone:        '081-234-5678',
      symptom:      'เครื่องสั่น ควันดำ',
      estimated:    15000,
      actual:       12800,
      jobStatus:    'กำลังซ่อม',
      payStatus:    'มัดจำแล้ว',
      assignee:     'สุทธินนท์',
      appointDate:  '22 เม.ย. 68',
    },
    {
      id:           'MT-2504-0041',
      date:         '18 เม.ย. 68',
      plate:        'ชม-5678',
      model:        'CX-5 2.0S',
      customer:     'คุณพรรณี ส.',
      phone:        '089-876-5432',
      symptom:      'DPF อุดตัน เตือน',
      estimated:    32000,
      actual:       28400,
      jobStatus:    'รออะไหล่',
      payStatus:    'ค้างชำระ',
      assignee:     'ภควัต',
      appointDate:  '25 เม.ย. 68',
    },
    {
      id:           'MT-2504-0040',
      date:         '17 เม.ย. 68',
      plate:        'พบ-9012',
      model:        'Mazda3 2.0',
      customer:     'คุณธนกร ว.',
      phone:        '062-345-6789',
      symptom:      'ช่วงล่างดัง เบรก',
      estimated:    9000,
      actual:       8500,
      jobStatus:    'พร้อมส่งมอบ',
      payStatus:    'ชำระครบ',
      assignee:     'อภิสิทธิ์',
      appointDate:  '20 เม.ย. 68',
    },
    {
      id:           'MT-2504-0039',
      date:         '16 เม.ย. 68',
      plate:        'สข-3456',
      model:        'CX-30 2.0',
      customer:     'คุณสมหญิง ล.',
      phone:        '095-111-2222',
      symptom:      'เกียร์กระตุก ไม่ขึ้น',
      estimated:    45000,
      actual:       41200,
      jobStatus:    'ตรวจซ้ำ',
      payStatus:    'ชำระบางส่วน',
      assignee:     'สุทธินนท์',
      appointDate:  '23 เม.ย. 68',
    },
    {
      id:           'MT-2504-0038',
      date:         '15 เม.ย. 68',
      plate:        'กส-7890',
      model:        'Mazda2 1.5D',
      customer:     'คุณมานพ อ.',
      phone:        '084-567-8901',
      symptom:      'เปลี่ยนน้ำมัน ฟิลเตอร์',
      estimated:    3500,
      actual:       3200,
      jobStatus:    'ส่งมอบแล้ว',
      payStatus:    'ชำระครบ',
      assignee:     'ภควัต',
      appointDate:  '—',
    },
    {
      id:           'MT-2504-0037',
      date:         '14 เม.ย. 68',
      plate:        'นค-2211',
      model:        'MX-5 2.0',
      customer:     'คุณปิยะ ร.',
      phone:        '090-222-3344',
      symptom:      'แอร์ไม่เย็น ตรวจ',
      estimated:    6800,
      actual:       6800,
      jobStatus:    'ตรวจเช็ก',
      payStatus:    'ยังไม่ชำระ',
      assignee:     'อภิสิทธิ์',
      appointDate:  '21 เม.ย. 68',
    },
  ];

  // Summary counts for jobs page
  const jobSummary = {
    total:       47,
    waitParts:   3,
    inProgress:  8,
    readyDeliver: 2,
    delivered:   31,
    arOverdue:   3,
  };

  // ─────────────────────────────────────────────
  // Job Detail (MT-2504-0041)
  // ─────────────────────────────────────────────
  const jobDetail = {
    id:           'MT-2504-0041',
    openDate:     '18 เม.ย. 2568',
    appointDate:  '25 เม.ย. 2568',
    daysOpen:     2,
    jobStatus:    'รออะไหล่',
    payStatus:    'ค้างชำระ',
    assignee:     'เอ (Owner)',
    technician:   'ภควัต',
    urgency:      4,   // out of 5

    customer: {
      name:     'คุณพรรณี สุขสม',
      phone:    '089-876-5432',
      line:     '@pannee_s',
      type:     'ลูกค้า VIP',
    },

    vehicle: {
      plate:    'ชม-5678',
      model:    'Mazda CX-5 2.0S (2021)',
      mileage:  82450,
      color:    'Polymetal Grey',
      vin:      'JMZKF5B44N0123456',
      owner:    'คุณพรรณี สุขสม (เจ้าของคนแรก)',
    },

    symptoms: {
      customer: 'ไฟแจ้งเตือน DPF ขึ้น เครื่องยนต์อ่อนแรงลง ควันออกมากกว่าปกติ โดยเฉพาะตอนขึ้นทางด่วน',
      tech:     'DPF อุดตันระดับ 85% — จำเป็นต้องเปลี่ยนใหม่ ตรวจพบ EGR valve เริ่มสกปรก แนะนำทำความสะอาดพร้อมกัน ระบบหัวฉีดปกติ ไม่พบรอยรั่ว',
      internal: 'อะไหล่ DPF สั่งจาก PSS อยู่ระหว่างรอส่ง คาดถึง 22 เม.ย. 68 — แจ้งลูกค้าแล้วทาง LINE',
    },

    parts: [
      {
        partNo:   'SH01-20303',
        name:     'DPF Filter Assembly CX-5',
        type:     'แท้',
        qty:      1,
        unit:     'ชิ้น',
        costUnit: 12400,
        sellUnit: 16800,
        supplier: 'PSS',
      },
      {
        partNo:   'RF7W-20300',
        name:     'EGR Valve (ทำความสะอาด)',
        type:     'บริการ',
        qty:      1,
        unit:     'ครั้ง',
        costUnit: 0,
        sellUnit: 800,
        supplier: '—',
      },
      {
        partNo:   'PE01-14302',
        name:     'น้ำมันเครื่อง Mazda Original 5W-30',
        type:     'แท้',
        qty:      4,
        unit:     'ลิตร',
        costUnit: 380,
        sellUnit: 480,
        supplier: 'PSS',
      },
    ],

    financials: {
      partsTotal:   18720,
      laborMain:    3500,
      laborExtra:   0,
      specialService: 800,
      discount:     800,
      vatRate:      0.07,
      deposit:      5000,
    },

    timeline: [
      { step: 'รับรถเข้า',    status: 'done',    time: '18 เม.ย. 68 09:00' },
      { step: 'ตรวจเช็ก',    status: 'done',    time: '18 เม.ย. 68 11:30' },
      { step: 'เสนอราคา',    status: 'done',    time: '18 เม.ย. 68 14:00' },
      { step: 'ลูกค้าอนุมัติ', status: 'done',  time: '18 เม.ย. 68 15:45' },
      { step: 'รออะไหล่',    status: 'active',  time: 'คาดถึง 22 เม.ย. 68' },
      { step: 'กำลังซ่อม',   status: 'pending', time: '—' },
      { step: 'ตรวจคุณภาพ',  status: 'pending', time: '—' },
      { step: 'พร้อมส่งมอบ', status: 'pending', time: '—' },
      { step: 'ส่งมอบ / รับชำระ', status: 'pending', time: '—' },
    ],

    history: [
      { jobId: 'MT-2411-0018', date: '12 พ.ย. 67', work: 'เซอร์วิส 80,000 กม.',     amount: 4800,  status: 'ส่งมอบแล้ว' },
      { jobId: 'MT-2408-0009', date: '5 ส.ค. 67',  work: 'เปลี่ยนผ้าเบรก หน้า-หลัง', amount: 6200, status: 'ส่งมอบแล้ว' },
      { jobId: 'MT-2405-0031', date: '20 พ.ค. 67', work: 'เซอร์วิส 60,000 กม.',     amount: 3900,  status: 'ส่งมอบแล้ว' },
    ],
  };

  // ─────────────────────────────────────────────
  // Public API
  // GAS_URL มีค่า  → fetch จาก Google Apps Script
  // GAS_URL = null → ใช้ข้อมูล mock ด้านบน
  // ─────────────────────────────────────────────
  return {
    getDashboard:       async () => (await gasFetch('getDashboard'))       ?? { ...dashboardData },
    getMonthlyRevenue:  async () => (await gasFetch('getMonthlyRevenue'))  ?? [...monthlyRevenue],
    getMonthlyCars:     async () => (await gasFetch('getMonthlyCars'))     ?? [...monthlyCars],
    getRevenueCategory: async () => (await gasFetch('getRevenueCategory')) ?? [...revenueByCategory],
    getAlerts:          async () => (await gasFetch('getAlerts'))          ?? [...alerts],
    getJobs:            async () => (await gasFetch('getJobs'))            ?? [...jobs],
    getJobSummary:      async () => (await gasFetch('getJobSummary'))      ?? { ...jobSummary },
    getJobDetail:       async (id) => (await gasFetch('getJobDetail', { id })) ?? { ...jobDetail },
  };

})();
