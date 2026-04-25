/**
 * mock-data.js — Data Layer ของ Maztech Garage MVP
 * -------------------------------------------------
 * ตอนนี้ใช้ localStorage เป็นฐานข้อมูลหลักก่อน เพื่อให้ทุกเมนูเชื่อมกันจริง
 * อนาคตสามารถเปลี่ยน DATA_MODE เป็น 'gas' และใส่ GAS_URL เพื่อเชื่อม Google Sheets + Apps Script
 */

'use strict';

const DATA_MODE = 'local'; // 'local' = localStorage, 'gas' = Google Apps Script
const GAS_URL = '';        // ใส่ URL /exec เมื่อ Deploy Apps Script แล้ว
const STORAGE_KEY = 'maztech_garage_mvp_v2';

const MockData = (() => {
  const clone = (obj) => JSON.parse(JSON.stringify(obj));
  const nowISO = () => new Date().toISOString();
  const todayISO = () => new Date().toISOString().slice(0, 10);
  const num = (v) => Number(v || 0);

  const seed = {
    version: 2,
    settings: {
      shopName: 'Maztech Garage',
      ownerName: 'เอ',
      phone: '089-000-0000',
      address: 'กรุงเทพฯ',
      vatRate: 0.07,
      gpTarget: 35,
      reservePercent: 30,
      bankAccounts: [
        { id: 'KRCV', name: 'KBank-รับ', openingBalance: 185000 },
        { id: 'KPAY', name: 'KBank-จ่าย', openingBalance: 99300 },
        { id: 'CASH', name: 'เงินสดหน้างาน', openingBalance: 0 },
      ],
      gasUrl: '',
    },
    customers: [
      { id: 'CUST-0001', name: 'คุณวิชัย ท.', phone: '081-234-5678', line: '@wichai', type: 'ลูกค้าทั่วไป', createdAt: '2026-04-19T09:00:00.000Z' },
      { id: 'CUST-0002', name: 'คุณพรรณี สุขสม', phone: '089-876-5432', line: '@pannee_s', type: 'ลูกค้า VIP', createdAt: '2026-04-18T09:00:00.000Z' },
      { id: 'CUST-0003', name: 'คุณธนกร ว.', phone: '062-345-6789', line: '@thanakorn', type: 'ลูกค้าประจำ', createdAt: '2026-04-17T09:00:00.000Z' },
      { id: 'CUST-0004', name: 'คุณสมหญิง ล.', phone: '095-111-2222', line: '@somying', type: 'ลูกค้าทั่วไป', createdAt: '2026-04-16T09:00:00.000Z' },
      { id: 'CUST-0005', name: 'คุณมานพ อ.', phone: '084-567-8901', line: '@manop', type: 'ลูกค้าประจำ', createdAt: '2026-04-15T09:00:00.000Z' },
    ],
    vehicles: [
      { id: 'VH-0001', customerId: 'CUST-0001', plate: 'กข-1234', model: 'Mazda2 1.3E', year: '2019', mileage: 93000, color: 'ขาว', vin: 'MM7DJ2HAAKW000001' },
      { id: 'VH-0002', customerId: 'CUST-0002', plate: 'ชม-5678', model: 'Mazda CX-5 2.0S (2021)', year: '2021', mileage: 82450, color: 'Polymetal Grey', vin: 'JMZKF5B44N0123456' },
      { id: 'VH-0003', customerId: 'CUST-0003', plate: 'พบ-9012', model: 'Mazda3 2.0', year: '2020', mileage: 76800, color: 'แดง', vin: 'JMZBP5S0000000003' },
      { id: 'VH-0004', customerId: 'CUST-0004', plate: 'สข-3456', model: 'CX-30 2.0', year: '2022', mileage: 51000, color: 'ดำ', vin: 'JMZDM000000000004' },
      { id: 'VH-0005', customerId: 'CUST-0005', plate: 'กส-7890', model: 'Mazda2 1.5D', year: '2018', mileage: 120500, color: 'เทา', vin: 'MM7DL2S0000000005' },
    ],
    parts: [
      { id: 'PART-0001', partNo: 'SH01-20303', name: 'DPF Filter Assembly CX-5', type: 'แท้', unit: 'ชิ้น', costUnit: 12400, sellUnit: 16800, stockQty: 1, minStock: 1, supplier: 'PSS' },
      { id: 'PART-0002', partNo: 'RF7W-20300', name: 'EGR Valve (ทำความสะอาด)', type: 'บริการ', unit: 'ครั้ง', costUnit: 0, sellUnit: 800, stockQty: 99, minStock: 0, supplier: 'Maztech' },
      { id: 'PART-0003', partNo: 'PE01-14302', name: 'น้ำมันเครื่อง Mazda Original 5W-30', type: 'แท้', unit: 'ลิตร', costUnit: 380, sellUnit: 480, stockQty: 20, minStock: 8, supplier: 'พระนคร เซลส์' },
      { id: 'PART-0004', partNo: 'D10G-39070A', name: 'ยางแท่นเครื่อง', type: 'แท้', unit: 'ชิ้น', costUnit: 1850, sellUnit: 2600, stockQty: 2, minStock: 1, supplier: 'Wor Ladprao' },
      { id: 'PART-0005', partNo: 'KE64-39060A', name: 'ยางแท่นเครื่อง CX-5', type: 'แท้', unit: 'ชิ้น', costUnit: 2450, sellUnit: 3400, stockQty: 1, minStock: 1, supplier: 'พระนคร เซลส์' },
      { id: 'PART-0006', partNo: 'LABOR', name: 'ค่าแรงเหมาซ่อม', type: 'บริการ', unit: 'งาน', costUnit: 0, sellUnit: 8000, stockQty: 999, minStock: 0, supplier: 'Maztech' },
    ],
    jobs: [
      {
        id: 'MT-2604-0042', reNo: 'RE-260419-001', openDate: '2026-04-19', appointDate: '2026-04-22', daysOpen: 6,
        customerId: 'CUST-0001', vehicleId: 'VH-0001', customer: 'คุณวิชัย ท.', phone: '081-234-5678', line: '@wichai',
        plate: 'กข-1234', model: 'Mazda2 1.3E', mileage: 93000, symptom: 'เครื่องสั่น ควันดำ', techNote: 'ตรวจพบเขม่าสะสมและหัวฉีดเริ่มสกปรก', internalNote: '',
        estimated: 15000, jobStatus: 'กำลังซ่อม', payStatus: 'มัดจำแล้ว', assignee: 'สุทธินนท์', technician: 'สุทธินนท์', urgency: 3,
        financials: { laborMain: 3500, laborExtra: 0, specialService: 800, discount: 500, vatRate: 0, deposit: 5000 },
        parts: [
          { partNo: 'PE01-14302', name: 'น้ำมันเครื่อง Mazda Original 5W-30', type: 'แท้', qty: 4, unit: 'ลิตร', costUnit: 380, sellUnit: 480, supplier: 'พระนคร เซลส์' },
          { partNo: 'RF7W-20300', name: 'EGR Valve (ทำความสะอาด)', type: 'บริการ', qty: 1, unit: 'ครั้ง', costUnit: 0, sellUnit: 800, supplier: 'Maztech' },
        ],
        timeline: [], notes: ['ลูกค้านัดรับ 22 เม.ย.'], createdAt: '2026-04-19T09:00:00.000Z', updatedAt: '2026-04-19T09:00:00.000Z'
      },
      {
        id: 'MT-2604-0041', reNo: 'RE-260418-001', openDate: '2026-04-18', appointDate: '2026-04-25', daysOpen: 7,
        customerId: 'CUST-0002', vehicleId: 'VH-0002', customer: 'คุณพรรณี สุขสม', phone: '089-876-5432', line: '@pannee_s',
        plate: 'ชม-5678', model: 'Mazda CX-5 2.0S (2021)', mileage: 82450, symptom: 'DPF อุดตัน เตือน', techNote: 'DPF อุดตันระดับ 85% แนะนำเปลี่ยน/ล้าง และทำความสะอาด EGR', internalNote: 'อะไหล่ DPF สั่งจาก PSS อยู่ระหว่างรอส่ง',
        estimated: 32000, jobStatus: 'รออะไหล่', payStatus: 'ค้างชำระ', assignee: 'ภควัต', technician: 'ภควัต', urgency: 4,
        financials: { laborMain: 3500, laborExtra: 0, specialService: 800, discount: 800, vatRate: 0.07, deposit: 5000 },
        parts: [
          { partNo: 'SH01-20303', name: 'DPF Filter Assembly CX-5', type: 'แท้', qty: 1, unit: 'ชิ้น', costUnit: 12400, sellUnit: 16800, supplier: 'PSS' },
          { partNo: 'RF7W-20300', name: 'EGR Valve (ทำความสะอาด)', type: 'บริการ', qty: 1, unit: 'ครั้ง', costUnit: 0, sellUnit: 800, supplier: 'Maztech' },
          { partNo: 'PE01-14302', name: 'น้ำมันเครื่อง Mazda Original 5W-30', type: 'แท้', qty: 4, unit: 'ลิตร', costUnit: 380, sellUnit: 480, supplier: 'พระนคร เซลส์' },
        ],
        timeline: [], notes: ['แจ้งลูกค้าทาง LINE แล้ว'], createdAt: '2026-04-18T09:00:00.000Z', updatedAt: '2026-04-18T09:00:00.000Z'
      },
      {
        id: 'MT-2604-0040', reNo: 'RE-260417-001', openDate: '2026-04-17', appointDate: '2026-04-20', daysOpen: 3,
        customerId: 'CUST-0003', vehicleId: 'VH-0003', customer: 'คุณธนกร ว.', phone: '062-345-6789', line: '@thanakorn',
        plate: 'พบ-9012', model: 'Mazda3 2.0', mileage: 76800, symptom: 'ช่วงล่างดัง เบรก', techNote: 'เปลี่ยนผ้าเบรกหน้าและตรวจช่วงล่าง', internalNote: '',
        estimated: 9000, jobStatus: 'พร้อมส่งมอบ', payStatus: 'ชำระครบ', assignee: 'อภิสิทธิ์', technician: 'อภิสิทธิ์', urgency: 2,
        financials: { laborMain: 1800, laborExtra: 0, specialService: 0, discount: 300, vatRate: 0, deposit: 8500 },
        parts: [{ partNo: 'BRK-F', name: 'ผ้าเบรกหน้า Mazda3', type: 'OEM', qty: 1, unit: 'ชุด', costUnit: 2700, sellUnit: 4200, supplier: 'Wor Ladprao' }],
        timeline: [], notes: [], createdAt: '2026-04-17T09:00:00.000Z', updatedAt: '2026-04-17T09:00:00.000Z'
      },
      {
        id: 'MT-2604-0039', reNo: 'RE-260416-001', openDate: '2026-04-16', appointDate: '2026-04-23', daysOpen: 7,
        customerId: 'CUST-0004', vehicleId: 'VH-0004', customer: 'คุณสมหญิง ล.', phone: '095-111-2222', line: '@somying',
        plate: 'สข-3456', model: 'CX-30 2.0', mileage: 51000, symptom: 'เกียร์กระตุก ไม่ขึ้น', techNote: 'ตรวจเบื้องต้น รอทดสอบซ้ำ', internalNote: '',
        estimated: 45000, jobStatus: 'ตรวจซ้ำ', payStatus: 'ชำระบางส่วน', assignee: 'สุทธินนท์', technician: 'สุทธินนท์', urgency: 4,
        financials: { laborMain: 8000, laborExtra: 0, specialService: 0, discount: 1000, vatRate: 0, deposit: 20000 },
        parts: [{ partNo: 'ATF-FZ', name: 'น้ำมันเกียร์ MAZDA ATF-FZ', type: 'แท้', qty: 5, unit: 'ลิตร', costUnit: 420, sellUnit: 620, supplier: 'พระนคร เซลส์' }],
        timeline: [], notes: [], createdAt: '2026-04-16T09:00:00.000Z', updatedAt: '2026-04-16T09:00:00.000Z'
      },
      {
        id: 'MT-2604-0038', reNo: 'RE-260415-001', openDate: '2026-04-15', appointDate: '', daysOpen: 1,
        customerId: 'CUST-0005', vehicleId: 'VH-0005', customer: 'คุณมานพ อ.', phone: '084-567-8901', line: '@manop',
        plate: 'กส-7890', model: 'Mazda2 1.5D', mileage: 120500, symptom: 'เปลี่ยนน้ำมัน ฟิลเตอร์', techNote: 'เซอร์วิสตามระยะ', internalNote: '',
        estimated: 3500, jobStatus: 'ส่งมอบแล้ว', payStatus: 'ชำระครบ', assignee: 'ภควัต', technician: 'ภควัต', urgency: 1,
        financials: { laborMain: 600, laborExtra: 0, specialService: 0, discount: 0, vatRate: 0, deposit: 3200 },
        parts: [{ partNo: 'PE01-14302', name: 'น้ำมันเครื่อง Mazda Original 5W-30', type: 'แท้', qty: 4, unit: 'ลิตร', costUnit: 380, sellUnit: 480, supplier: 'พระนคร เซลส์' }],
        timeline: [], notes: [], createdAt: '2026-04-15T09:00:00.000Z', updatedAt: '2026-04-15T09:00:00.000Z'
      }
    ],
    cashflow: [
      { id: 'CF-0001', date: '2026-04-15', accountId: 'KRCV', type: 'in', category: 'รายรับ-ค่าซ่อม', refNo: 'RE-260415-001', jobId: 'MT-2604-0038', description: 'รับชำระงานเซอร์วิส คุณมานพ', amount: 3200, channel: 'โอน/QR', createdAt: '2026-04-15T12:00:00.000Z' },
      { id: 'CF-0002', date: '2026-04-17', accountId: 'KRCV', type: 'in', category: 'รายรับ-ค่าซ่อม', refNo: 'RE-260417-001', jobId: 'MT-2604-0040', description: 'รับชำระงานเบรก คุณธนกร', amount: 8500, channel: 'โอน/QR', createdAt: '2026-04-17T12:00:00.000Z' },
      { id: 'CF-0003', date: '2026-04-18', accountId: 'KRCV', type: 'in', category: 'รายรับ-มัดจำ', refNo: 'RE-260418-001', jobId: 'MT-2604-0041', description: 'รับมัดจำ DPF CX-5', amount: 5000, channel: 'โอน/QR', createdAt: '2026-04-18T12:00:00.000Z' },
      { id: 'CF-0004', date: '2026-04-19', accountId: 'KRCV', type: 'in', category: 'รายรับ-มัดจำ', refNo: 'RE-260419-001', jobId: 'MT-2604-0042', description: 'รับมัดจำ Mazda2', amount: 5000, channel: 'โอน/QR', createdAt: '2026-04-19T12:00:00.000Z' },
      { id: 'CF-0005', date: '2026-04-20', accountId: 'KPAY', type: 'out', category: 'ต้นทุน-อะไหล่', refNo: 'PO-260420-001', jobId: 'MT-2604-0041', description: 'ซื้อ DPF Filter', amount: 12400, channel: 'โอน', createdAt: '2026-04-20T12:00:00.000Z' },
      { id: 'CF-0006', date: '2026-04-20', accountId: 'KPAY', type: 'out', category: 'ค่าเช่า', refNo: 'EXP-260420-001', jobId: '', description: 'ค่าเช่าอู่', amount: 35000, channel: 'โอน', createdAt: '2026-04-20T13:00:00.000Z' },
    ],
    audit: [
      { id: 'LOG-0001', at: '2026-04-23T08:33:00.000Z', user: 'System', action: 'INIT', ref: 'localStorage', detail: 'สร้างข้อมูลตัวอย่างเริ่มต้น' },
    ],
  };

  function storageAvailable() {
    try { localStorage.setItem('__mz_test', '1'); localStorage.removeItem('__mz_test'); return true; }
    catch (_) { return false; }
  }

  function loadDb() {
    if (!storageAvailable()) return clone(seed);
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const db = clone(seed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
      return db;
    }
    try {
      const db = JSON.parse(raw);
      if (!db.version || db.version < seed.version) return migrateDb(db);
      return db;
    } catch (_) {
      localStorage.setItem(STORAGE_KEY + '_corrupt_' + Date.now(), raw);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return clone(seed);
    }
  }

  function migrateDb(old) {
    const db = { ...clone(seed), ...old, version: seed.version };
    db.settings = { ...clone(seed.settings), ...(old.settings || {}) };
    ['customers','vehicles','parts','jobs','cashflow','audit'].forEach(k => { if (!Array.isArray(db[k])) db[k] = []; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return db;
  }

  function saveDb(db) {
    db.version = seed.version;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    window.dispatchEvent(new CustomEvent('mz-db-updated'));
    return db;
  }

  function nextSeq(prefix, collection, width = 4) {
    const max = collection.reduce((m, x) => {
      const n = Number(String(x.id || '').split('-').pop()) || 0;
      return Math.max(m, n);
    }, 0) + 1;
    return `${prefix}-${String(max).padStart(width, '0')}`;
  }

  function nextJobId(db) {
    const d = new Date();
    const yy = String(d.getFullYear() + 543).slice(-2);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const prefix = `MT-${yy}${mm}`;
    const max = db.jobs.filter(j => String(j.id).startsWith(prefix)).reduce((m, j) => Math.max(m, Number(String(j.id).split('-').pop()) || 0), 0) + 1;
    return `${prefix}-${String(max).padStart(4, '0')}`;
  }

  function nextReNo(db) {
    const d = new Date();
    const yy = String(d.getFullYear() + 543).slice(-2);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const prefix = `RE-${yy}${mm}${dd}`;
    const max = db.jobs.filter(j => String(j.reNo).startsWith(prefix)).reduce((m, j) => Math.max(m, Number(String(j.reNo).split('-').pop()) || 0), 0) + 1;
    return `${prefix}-${String(max).padStart(3, '0')}`;
  }

  function addAudit(db, action, ref, detail, user = 'Owner') {
    db.audit.unshift({ id: nextSeq('LOG', db.audit), at: nowISO(), user, action, ref, detail });
    db.audit = db.audit.slice(0, 300);
  }

  async function gasFetch(action, params = {}) {
    if (DATA_MODE !== 'gas' || !GAS_URL) return null;
    const qs = new URLSearchParams({ action, ...params }).toString();
    const res = await fetch(`${GAS_URL}?${qs}`);
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || 'GAS error');
    return json.data;
  }

  function calcJobTotals(job) {
    const partsTotal = (job.parts || []).reduce((s, p) => s + num(p.sellUnit) * num(p.qty), 0);
    const partsCost = (job.parts || []).reduce((s, p) => s + num(p.costUnit) * num(p.qty), 0);
    const f = job.financials || {};
    const subtotal = partsTotal + num(f.laborMain) + num(f.laborExtra) + num(f.specialService);
    const afterDisc = Math.max(0, subtotal - num(f.discount));
    const vat = Math.round(afterDisc * num(f.vatRate));
    const grand = afterDisc + vat;
    const paid = num(f.deposit);
    const remaining = Math.max(0, grand - paid);
    const gp = afterDisc - partsCost;
    const gpPct = afterDisc ? (gp / afterDisc) * 100 : 0;
    return { partsTotal, partsCost, subtotal, afterDisc, vat, grand, paid, remaining, gp, gpPct };
  }

  function normalizeJob(job) {
    const totals = calcJobTotals(job);
    return {
      id: job.id,
      reNo: job.reNo || '',
      date: thaiDate(job.openDate),
      openDate: job.openDate,
      appointDate: job.appointDate ? thaiDate(job.appointDate) : '—',
      appointDateISO: job.appointDate || '',
      plate: job.plate || '',
      model: job.model || '',
      customer: job.customer || '',
      phone: job.phone || '',
      symptom: job.symptom || '',
      estimated: num(job.estimated),
      actual: totals.grand,
      remaining: totals.remaining,
      jobStatus: job.jobStatus || 'รับรถเข้า',
      payStatus: job.payStatus || 'ยังไม่ชำระ',
      assignee: job.assignee || '',
      technician: job.technician || '',
      urgency: num(job.urgency || 1),
      gpPct: totals.gpPct,
    };
  }

  function accountBalances(db) {
    const accounts = clone(db.settings.bankAccounts || []);
    return accounts.map(acc => {
      const flow = db.cashflow.filter(x => x.accountId === acc.id).reduce((s, x) => s + (x.type === 'in' ? num(x.amount) : -num(x.amount)), 0);
      return { ...acc, balance: num(acc.openingBalance) + flow };
    });
  }

  function currentMonthCashflow(db) {
    const mk = App.monthKey ? App.monthKey() : new Date().toISOString().slice(0,7);
    return db.cashflow.filter(x => String(x.date || '').slice(0, 7) === mk);
  }

  function jobsSorted(db) {
    return db.jobs.slice().sort((a, b) => String(b.openDate).localeCompare(String(a.openDate)) || String(b.id).localeCompare(String(a.id)));
  }

  function buildTimeline(job) {
    const steps = ['รับรถเข้า','ตรวจเช็ก','เสนอราคา','รออะไหล่','กำลังซ่อม','ตรวจซ้ำ','พร้อมส่งมอบ','ส่งมอบแล้ว'];
    const currentIndex = Math.max(0, steps.indexOf(job.jobStatus));
    return steps.map((step, i) => ({
      step,
      status: i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'pending',
      time: i === 0 ? thaiDate(job.openDate) : i === currentIndex ? 'สถานะปัจจุบัน' : '—',
    }));
  }

  function detailFor(db, id) {
    const job = db.jobs.find(j => j.id === id) || db.jobs[0];
    const c = db.customers.find(x => x.id === job.customerId) || { name: job.customer, phone: job.phone, line: job.line, type: 'ลูกค้าทั่วไป' };
    const v = db.vehicles.find(x => x.id === job.vehicleId) || { plate: job.plate, model: job.model, mileage: job.mileage, color: '', vin: '', owner: job.customer };
    const totals = calcJobTotals(job);
    const history = db.jobs
      .filter(j => j.vehicleId === job.vehicleId && j.id !== job.id)
      .map(j => ({ jobId: j.id, date: thaiDate(j.openDate), work: j.symptom, amount: calcJobTotals(j).grand, status: j.jobStatus }));

    return {
      ...clone(job),
      openDate: thaiDate(job.openDate),
      openDateISO: job.openDate,
      appointDate: job.appointDate ? thaiDate(job.appointDate) : '—',
      appointDateISO: job.appointDate || '',
      daysOpen: Math.max(0, Math.round((Date.now() - new Date(job.openDate).getTime()) / 86400000)),
      customer: { name: c.name || job.customer, phone: c.phone || job.phone, line: c.line || job.line || '', type: c.type || 'ลูกค้าทั่วไป' },
      vehicle: { plate: v.plate || job.plate, model: v.model || job.model, mileage: num(v.mileage || job.mileage), color: v.color || '', vin: v.vin || '', owner: c.name || job.customer },
      symptoms: { customer: job.symptom || '', tech: job.techNote || '', internal: job.internalNote || (job.notes || []).join('\n') },
      financials: { laborMain: 0, laborExtra: 0, specialService: 0, discount: 0, vatRate: 0, deposit: 0, ...(job.financials || {}) },
      totals,
      timeline: job.timeline && job.timeline.length ? clone(job.timeline) : buildTimeline(job),
      history,
    };
  }

  function getDashboardLocal() {
    const db = loadDb();
    const thisMonth = currentMonthCashflow(db);
    const revenueMonth = thisMonth.filter(x => x.type === 'in').reduce((s, x) => s + num(x.amount), 0);
    const expenseMonth = thisMonth.filter(x => x.type === 'out').reduce((s, x) => s + num(x.amount), 0);
    const activeJobs = db.jobs.filter(j => !['ส่งมอบแล้ว','ยกเลิก'].includes(j.jobStatus));
    const ready = db.jobs.filter(j => j.jobStatus === 'พร้อมส่งมอบ').length;
    const wait = db.jobs.filter(j => j.jobStatus === 'รออะไหล่').length;
    const inProgress = db.jobs.filter(j => ['รับรถเข้า','ตรวจเช็ก','เสนอราคา','รออนุมัติ','รออะไหล่','กำลังซ่อม','ตรวจซ้ำ'].includes(j.jobStatus)).length;
    const overdueJobs = db.jobs.map(j => ({ j, t: calcJobTotals(j) })).filter(x => x.t.remaining > 0 && x.j.payStatus !== 'ชำระครบ');
    const allJobTotals = db.jobs.map(calcJobTotals).filter(t => t.grand > 0);
    const grossSell = allJobTotals.reduce((s, t) => s + t.afterDisc, 0);
    const grossCost = allJobTotals.reduce((s, t) => s + t.partsCost, 0);
    return {
      cashBalance: accountBalances(db).reduce((s, a) => s + a.balance, 0),
      revenueMonth,
      expenseMonth,
      netProfitMonth: revenueMonth - expenseMonth,
      gpPercent: grossSell ? ((grossSell - grossCost) / grossSell) * 100 : 0,
      carsInProgress: inProgress,
      carsWaitingParts: wait,
      carsReadyToDeliver: ready,
      arOverdue: overdueJobs.reduce((s, x) => s + x.t.remaining, 0),
      arOverdueCount: overdueJobs.length,
      revenueChange: 0,
      expenseChange: 0,
      carsChange: activeJobs.length,
      accountBalances: accountBalances(db),
    };
  }

  function getMonthlyRevenueLocal() {
    const db = loadDb();
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toISOString().slice(0, 7);
      const mon = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'][d.getMonth()];
      const rows = db.cashflow.filter(x => String(x.date).slice(0, 7) === key);
      months.push({ month: mon, revenue: rows.filter(x => x.type === 'in').reduce((s, x) => s + num(x.amount), 0), expense: rows.filter(x => x.type === 'out').reduce((s, x) => s + num(x.amount), 0) });
    }
    return months;
  }

  function getMonthlyCarsLocal() {
    const db = loadDb();
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toISOString().slice(0, 7);
      const mon = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'][d.getMonth()];
      months.push({ month: mon, count: db.jobs.filter(j => String(j.openDate).slice(0, 7) === key).length });
    }
    return months;
  }

  function getRevenueCategoryLocal() {
    const db = loadDb();
    const rows = currentMonthCashflow(db).filter(x => x.type === 'in');
    const total = rows.reduce((s, x) => s + num(x.amount), 0) || 1;
    const colors = ['#1e6fc4','#059669','#f59e0b','#7c3aed','#e24b4a','#0ea5e9'];
    const map = new Map();
    rows.forEach(r => map.set(r.category, (map.get(r.category) || 0) + num(r.amount)));
    const data = Array.from(map.entries()).map(([label, amount], i) => ({ label, amount, percent: Math.round((amount / total) * 100), color: colors[i % colors.length] }));
    return data.length ? data : [{ label: 'ยังไม่มีรายรับเดือนนี้', amount: 0, percent: 100, color: '#94a3b8' }];
  }

  function getAlertsLocal() {
    const db = loadDb();
    const alerts = [];
    db.jobs.filter(j => j.jobStatus === 'รออะไหล่').forEach(j => alerts.push({ level: 'warning', text: `รถ ${j.plate} รออะไหล่`, tag: j.id }));
    const ar = getDashboardLocal();
    if (ar.arOverdue > 0) alerts.push({ level: 'danger', text: `ลูกหนี้ค้างชำระ ${ar.arOverdueCount} ราย รวม ${fmt.baht(ar.arOverdue)}`, tag: 'ค้างชำระ' });
    db.parts.filter(p => num(p.stockQty) <= num(p.minStock)).slice(0, 3).forEach(p => alerts.push({ level: 'info', text: `สต็อกต่ำ: ${p.name} เหลือ ${p.stockQty} ${p.unit}`, tag: 'คลัง' }));
    if (!alerts.length) alerts.push({ level: 'success', text: 'ระบบปกติ ไม่มีแจ้งเตือนเร่งด่วน', tag: 'ปกติ' });
    return alerts;
  }

  function getJobSummaryLocal() {
    const db = loadDb();
    return {
      total: db.jobs.length,
      waitParts: db.jobs.filter(j => j.jobStatus === 'รออะไหล่').length,
      inProgress: db.jobs.filter(j => ['รับรถเข้า','ตรวจเช็ก','เสนอราคา','รออนุมัติ','รออะไหล่','กำลังซ่อม','ตรวจซ้ำ'].includes(j.jobStatus)).length,
      readyDeliver: db.jobs.filter(j => j.jobStatus === 'พร้อมส่งมอบ').length,
      delivered: db.jobs.filter(j => j.jobStatus === 'ส่งมอบแล้ว').length,
      arOverdue: db.jobs.filter(j => calcJobTotals(j).remaining > 0 && j.payStatus !== 'ชำระครบ').length,
      activeJobs: db.jobs.filter(j => !['ส่งมอบแล้ว','ยกเลิก'].includes(j.jobStatus)).length,
    };
  }

  function upsertCustomer(db, data) {
    const phone = String(data.phone || '').trim();
    let c = db.customers.find(x => phone && x.phone === phone) || db.customers.find(x => x.name === data.name);
    if (!c) {
      c = { id: nextSeq('CUST', db.customers), name: data.name || 'ไม่ระบุชื่อ', phone, line: data.line || '', type: data.type || 'ลูกค้าทั่วไป', createdAt: nowISO() };
      db.customers.push(c);
      addAudit(db, 'CREATE_CUSTOMER', c.id, `เพิ่มลูกค้า ${c.name}`);
    } else {
      Object.assign(c, { name: data.name || c.name, phone: phone || c.phone, line: data.line || c.line, type: data.type || c.type });
    }
    return c;
  }

  function upsertVehicle(db, customerId, data) {
    const plate = String(data.plate || '').trim();
    let v = db.vehicles.find(x => x.plate === plate);
    if (!v) {
      v = { id: nextSeq('VH', db.vehicles), customerId, plate: plate || 'ไม่ระบุ', model: data.model || '', year: data.year || '', mileage: num(data.mileage), color: data.color || '', vin: data.vin || '' };
      db.vehicles.push(v);
      addAudit(db, 'CREATE_VEHICLE', v.id, `เพิ่มรถทะเบียน ${v.plate}`);
    } else {
      Object.assign(v, { customerId, model: data.model || v.model, year: data.year || v.year, mileage: num(data.mileage || v.mileage), color: data.color || v.color, vin: data.vin || v.vin });
    }
    return v;
  }

  // Public API
  return {
    _load: () => clone(loadDb()),
    resetDemoData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(seed)); return clone(seed); },
    exportBackup() { return clone(loadDb()); },
    importBackup(data) { const db = migrateDb(data || {}); saveDb(db); return clone(db); },
    peekSummary: () => getJobSummaryLocal(),

    getDashboard: async () => (await gasFetch('getDashboard')) ?? getDashboardLocal(),
    getMonthlyRevenue: async () => (await gasFetch('getMonthlyRevenue')) ?? getMonthlyRevenueLocal(),
    getMonthlyCars: async () => (await gasFetch('getMonthlyCars')) ?? getMonthlyCarsLocal(),
    getRevenueCategory: async () => (await gasFetch('getRevenueCategory')) ?? getRevenueCategoryLocal(),
    getAlerts: async () => (await gasFetch('getAlerts')) ?? getAlertsLocal(),
    getJobSummary: async () => (await gasFetch('getJobSummary')) ?? getJobSummaryLocal(),
    getJobs: async () => (await gasFetch('getJobs')) ?? jobsSorted(loadDb()).map(normalizeJob),
    getJobDetail: async (id) => (await gasFetch('getJobDetail', { id })) ?? detailFor(loadDb(), id),
    getParts: async () => (await gasFetch('getParts')) ?? clone(loadDb().parts).sort((a,b) => String(a.name).localeCompare(String(b.name), 'th')),
    getCustomers: async () => {
      const gas = await gasFetch('getCustomers');
      if (gas) return gas;
      const db = loadDb();
      return db.customers.map(c => ({ ...c, vehicles: db.vehicles.filter(v => v.customerId === c.id), jobs: db.jobs.filter(j => j.customerId === c.id) }));
    },
    getVehicles: async () => (await gasFetch('getVehicles')) ?? clone(loadDb().vehicles),
    getCashflow: async () => (await gasFetch('getCashflow')) ?? clone(loadDb().cashflow).sort((a,b) => String(b.date).localeCompare(String(a.date)) || String(b.id).localeCompare(String(a.id))),
    getReports: async () => {
      const db = loadDb();
      return {
        dashboard: getDashboardLocal(),
        monthlyRevenue: getMonthlyRevenueLocal(),
        jobs: jobsSorted(db).map(normalizeJob),
        parts: clone(db.parts),
        accounts: accountBalances(db),
      };
    },
    getAudit: async () => clone(loadDb().audit),
    getSettings: async () => clone(loadDb().settings),
    getAccountBalances: async () => accountBalances(loadDb()),

    createJob(data) {
      const db = loadDb();
      const c = upsertCustomer(db, data.customer || data);
      const v = upsertVehicle(db, c.id, data.vehicle || data);
      const id = nextJobId(db);
      const job = {
        id,
        reNo: nextReNo(db),
        openDate: data.openDate || todayISO(),
        appointDate: data.appointDate || '',
        customerId: c.id,
        vehicleId: v.id,
        customer: c.name,
        phone: c.phone,
        line: c.line,
        plate: v.plate,
        model: v.model,
        mileage: v.mileage,
        symptom: data.symptom || '',
        techNote: data.techNote || '',
        internalNote: data.internalNote || '',
        estimated: num(data.estimated),
        jobStatus: data.jobStatus || 'รับรถเข้า',
        payStatus: num(data.deposit) > 0 ? 'มัดจำแล้ว' : 'ยังไม่ชำระ',
        assignee: data.assignee || 'เอ',
        technician: data.technician || data.assignee || 'เอ',
        urgency: num(data.urgency || 2),
        financials: { laborMain: num(data.laborMain), laborExtra: 0, specialService: num(data.specialService), discount: num(data.discount), vatRate: data.useVat ? num(db.settings.vatRate) : 0, deposit: num(data.deposit) },
        parts: [],
        notes: [],
        timeline: [],
        createdAt: nowISO(), updatedAt: nowISO(),
      };
      db.jobs.push(job);
      if (num(data.deposit) > 0) {
        db.cashflow.push({ id: nextSeq('CF', db.cashflow), date: data.openDate || todayISO(), accountId: data.accountId || 'KRCV', type: 'in', category: 'รายรับ-มัดจำ', refNo: job.reNo, jobId: job.id, description: `รับมัดจำ ${job.plate} ${job.customer}`, amount: num(data.deposit), channel: data.channel || 'โอน/QR', createdAt: nowISO() });
      }
      addAudit(db, 'CREATE_JOB', id, `เปิดจ๊อบ ${id} ${job.plate}`);
      saveDb(db);
      return clone(job);
    },

    updateJob(id, patch) {
      const db = loadDb();
      const job = db.jobs.find(j => j.id === id);
      if (!job) throw new Error('ไม่พบ Job_ID');
      Object.assign(job, patch || {});
      if (patch.financials) job.financials = { ...(job.financials || {}), ...patch.financials };
      job.updatedAt = nowISO();
      addAudit(db, 'UPDATE_JOB', id, `แก้ไขข้อมูลจ๊อบ ${id}`);
      saveDb(db);
      return detailFor(db, id);
    },

    updateJobStatus(id, status) {
      const db = loadDb();
      const job = db.jobs.find(j => j.id === id);
      if (!job) throw new Error('ไม่พบ Job_ID');
      job.jobStatus = status;
      if (status === 'ส่งมอบแล้ว' && calcJobTotals(job).remaining <= 0) job.payStatus = 'ชำระครบ';
      job.updatedAt = nowISO();
      addAudit(db, 'UPDATE_STATUS', id, `เปลี่ยนสถานะเป็น ${status}`);
      saveDb(db);
      return detailFor(db, id);
    },

    addJobPart(jobId, partData) {
      const db = loadDb();
      const job = db.jobs.find(j => j.id === jobId);
      if (!job) throw new Error('ไม่พบ Job_ID');
      let part = db.parts.find(p => p.id === partData.partId || p.partNo === partData.partNo);
      const row = part ? {
        partNo: part.partNo, name: part.name, type: part.type, qty: num(partData.qty || 1), unit: part.unit,
        costUnit: num(partData.costUnit || part.costUnit), sellUnit: num(partData.sellUnit || part.sellUnit), supplier: part.supplier,
      } : {
        partNo: partData.partNo || 'MANUAL', name: partData.name || 'รายการใหม่', type: partData.type || 'นอก', qty: num(partData.qty || 1), unit: partData.unit || 'ชิ้น', costUnit: num(partData.costUnit), sellUnit: num(partData.sellUnit), supplier: partData.supplier || '',
      };
      job.parts.push(row);
      if (part && part.type !== 'บริการ') part.stockQty = Math.max(0, num(part.stockQty) - row.qty);
      job.updatedAt = nowISO();
      addAudit(db, 'ADD_JOB_PART', jobId, `เพิ่มอะไหล่ ${row.name} x${row.qty}`);
      saveDb(db);
      return detailFor(db, jobId);
    },

    addNote(jobId, note) {
      const db = loadDb();
      const job = db.jobs.find(j => j.id === jobId);
      if (!job) throw new Error('ไม่พบ Job_ID');
      job.notes = job.notes || [];
      job.notes.unshift(`${thaiDate(todayISO())}: ${note}`);
      job.internalNote = [job.internalNote, note].filter(Boolean).join('\n');
      job.updatedAt = nowISO();
      addAudit(db, 'ADD_NOTE', jobId, note);
      saveDb(db);
      return detailFor(db, jobId);
    },

    savePayment(jobId, amount, accountId = 'KRCV', channel = 'โอน/QR') {
      const db = loadDb();
      const job = db.jobs.find(j => j.id === jobId);
      if (!job) throw new Error('ไม่พบ Job_ID');
      const pay = num(amount);
      job.financials = job.financials || {};
      job.financials.deposit = num(job.financials.deposit) + pay;
      const totals = calcJobTotals(job);
      job.payStatus = totals.remaining <= 0 ? 'ชำระครบ' : (job.financials.deposit > 0 ? 'ชำระบางส่วน' : 'ยังไม่ชำระ');
      db.cashflow.push({ id: nextSeq('CF', db.cashflow), date: todayISO(), accountId, type: 'in', category: 'รายรับ-ค่าซ่อม', refNo: job.reNo || nextReNo(db), jobId, description: `รับชำระ ${job.plate} ${job.customer}`, amount: pay, channel, createdAt: nowISO() });
      addAudit(db, 'SAVE_PAYMENT', jobId, `รับชำระ ${fmt.baht(pay)}`);
      saveDb(db);
      return detailFor(db, jobId);
    },

    savePart(partData) {
      const db = loadDb();
      let part = db.parts.find(p => p.id === partData.id);
      if (!part) {
        part = { id: nextSeq('PART', db.parts), partNo: '', name: '', type: 'แท้', unit: 'ชิ้น', costUnit: 0, sellUnit: 0, stockQty: 0, minStock: 0, supplier: '' };
        db.parts.push(part);
        addAudit(db, 'CREATE_PART', part.id, `เพิ่มอะไหล่ ${partData.name || ''}`);
      } else {
        addAudit(db, 'UPDATE_PART', part.id, `แก้ไขอะไหล่ ${partData.name || part.name}`);
      }
      Object.assign(part, {
        partNo: partData.partNo || part.partNo,
        name: partData.name || part.name,
        type: partData.type || part.type,
        unit: partData.unit || part.unit,
        costUnit: num(partData.costUnit),
        sellUnit: num(partData.sellUnit),
        stockQty: num(partData.stockQty),
        minStock: num(partData.minStock),
        supplier: partData.supplier || '',
      });
      saveDb(db);
      return clone(part);
    },

    adjustStock(partId, qtyChange, note = '') {
      const db = loadDb();
      const part = db.parts.find(p => p.id === partId);
      if (!part) throw new Error('ไม่พบอะไหล่');
      part.stockQty = num(part.stockQty) + num(qtyChange);
      addAudit(db, 'ADJUST_STOCK', partId, `${note || 'ปรับสต็อก'} (${qtyChange})`);
      saveDb(db);
      return clone(part);
    },

    saveCustomer(data) {
      const db = loadDb();
      const c = data.id ? db.customers.find(x => x.id === data.id) : null;
      if (c) Object.assign(c, { name: data.name, phone: data.phone, line: data.line, type: data.type || c.type });
      const customer = c || upsertCustomer(db, data);
      if (data.plate) upsertVehicle(db, customer.id, data);
      addAudit(db, c ? 'UPDATE_CUSTOMER' : 'CREATE_CUSTOMER', customer.id, `บันทึกลูกค้า ${customer.name}`);
      saveDb(db);
      return clone(customer);
    },

    addCashflow(data) {
      const db = loadDb();
      const row = { id: nextSeq('CF', db.cashflow), date: data.date || todayISO(), accountId: data.accountId || 'KRCV', type: data.type || 'in', category: data.category || '', refNo: data.refNo || '', jobId: data.jobId || '', description: data.description || '', amount: num(data.amount), channel: data.channel || 'โอน/QR', createdAt: nowISO() };
      db.cashflow.push(row);
      addAudit(db, 'ADD_CASHFLOW', row.id, `${row.type === 'in' ? 'รายรับ' : 'รายจ่าย'} ${row.category} ${fmt.baht(row.amount)}`);
      saveDb(db);
      return clone(row);
    },

    saveSettings(settings) {
      const db = loadDb();
      db.settings = { ...db.settings, ...settings };
      if (settings.bankAccounts) db.settings.bankAccounts = settings.bankAccounts;
      addAudit(db, 'UPDATE_SETTINGS', 'settings', 'แก้ไขตั้งค่าระบบ');
      saveDb(db);
      return clone(db.settings);
    },
  };
})();
