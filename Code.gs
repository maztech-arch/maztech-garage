/**
 * Code.gs — Google Apps Script Backend Template for Maztech Garage
 * ---------------------------------------------------------------
 * เวอร์ชันนี้เตรียมไว้สำหรับเชื่อม GitHub Pages ↔ Google Sheets ภายหลัง
 * Frontend เรียกด้วย action เช่น ?action=getJobs, ?action=getDashboard
 *
 * Sheet names ที่แนะนำ:
 * Job_Header, Job_Detail, Parts_Master, Customer_Master, Vehicle_Master,
 * Daily_Cashflow, Settings, Audit_Log
 */

const SPREADSHEET_ID = 'PUT_YOUR_SPREADSHEET_ID_HERE';
const DATA_ROW = {
  JOB_HEADER: 4,
  JOB_DETAIL: 4,
  PARTS_MASTER: 4,
  CUSTOMER_MASTER: 4,
  VEHICLE_MASTER: 4,
  CASHFLOW: 6,
  SETTINGS: 2,
  AUDIT_LOG: 2,
};

const SHEETS = {
  JOB_HEADER: 'Job_Header',
  JOB_DETAIL: 'Job_Detail',
  PARTS_MASTER: 'Parts_Master',
  CUSTOMER_MASTER: 'Customer_Master',
  VEHICLE_MASTER: 'Vehicle_Master',
  CASHFLOW: 'Daily_Cashflow',
  SETTINGS: 'Settings',
  AUDIT_LOG: 'Audit_Log',
};

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'ping';
    const p = (e && e.parameter) || {};
    const routes = {
      ping: () => ({ ok: true, message: 'Maztech Garage API is ready', at: new Date().toISOString() }),
      getJobs,
      getJobSummary,
      getJobDetail: () => getJobDetail(p.id),
      getParts,
      getCustomers,
      getVehicles,
      getCashflow,
      getDashboard,
      getMonthlyRevenue,
      getMonthlyCars,
      getRevenueCategory,
      getAlerts,
      getAudit,
      getSettings,
    };
    if (!routes[action]) throw new Error('Unknown action: ' + action);
    return jsonOut({ ok: true, data: routes[action]() });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function jsonOut(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

function ss() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID === 'PUT_YOUR_SPREADSHEET_ID_HERE') {
    throw new Error('Please set SPREADSHEET_ID in Code.gs first.');
  }
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function sh(name) {
  const sheet = ss().getSheetByName(name);
  if (!sheet) throw new Error('Sheet not found: ' + name);
  return sheet;
}

function readRows(sheetName, headerRow) {
  const sheet = sh(sheetName);
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < headerRow || lastCol < 1) return [];
  const values = sheet.getRange(headerRow, 1, lastRow - headerRow + 1, lastCol).getDisplayValues();
  const headers = values.shift().map(h => String(h).trim());
  return values
    .filter(r => r.some(c => String(c).trim() !== ''))
    .map(row => {
      const obj = {};
      headers.forEach((h, i) => { if (h) obj[h] = row[i]; });
      return obj;
    });
}

function n(v) {
  return Number(String(v || '').replace(/[^0-9.-]/g, '')) || 0;
}

function normalizeJob(row) {
  return {
    id: row.Job_ID || row.job_id || row.ID || '',
    reNo: row.RE_No || row.RE_NO || '',
    date: row.Date || row.Open_Date || row['วันรับรถ'] || '',
    openDate: row.Open_Date || row.Date || '',
    appointDate: row.Appoint_Date || row['นัดรับรถ'] || '',
    plate: row.Plate || row.License_Plate || row['ทะเบียน'] || '',
    model: row.Model || row.Vehicle_Model || row['รุ่นรถ'] || '',
    customer: row.Customer_Name || row.Customer || row['ลูกค้า'] || '',
    phone: row.Phone || row['เบอร์โทร'] || '',
    symptom: row.Symptom || row['อาการ'] || '',
    estimated: n(row.Estimated || row['ยอดประเมิน']),
    actual: n(row.Grand_Total || row.Actual || row['ยอดจริง']),
    remaining: n(row.Remaining || row['ค้างชำระ']),
    jobStatus: row.Job_Status || row.Status || row['สถานะงาน'] || 'รับรถเข้า',
    payStatus: row.Pay_Status || row.Payment_Status || row['ชำระเงิน'] || 'ยังไม่ชำระ',
    assignee: row.Assignee || row.Owner || row['ผู้รับผิดชอบ'] || '',
  };
}

function getJobs() {
  return readRows(SHEETS.JOB_HEADER, DATA_ROW.JOB_HEADER).map(normalizeJob);
}

function getJobSummary() {
  const jobs = getJobs();
  return {
    total: jobs.length,
    waitParts: jobs.filter(j => j.jobStatus === 'รออะไหล่').length,
    inProgress: jobs.filter(j => ['รับรถเข้า','ตรวจเช็ก','เสนอราคา','รออะไหล่','กำลังซ่อม','ตรวจซ้ำ'].indexOf(j.jobStatus) >= 0).length,
    readyDeliver: jobs.filter(j => j.jobStatus === 'พร้อมส่งมอบ').length,
    delivered: jobs.filter(j => j.jobStatus === 'ส่งมอบแล้ว').length,
    arOverdue: jobs.filter(j => j.remaining > 0 && j.payStatus !== 'ชำระครบ').length,
  };
}

function getJobDetail(id) {
  const job = getJobs().filter(j => j.id === id)[0] || getJobs()[0];
  if (!job) return null;
  const partsRows = readRows(SHEETS.JOB_DETAIL, DATA_ROW.JOB_DETAIL).filter(r => (r.Job_ID || r.job_id) === job.id);
  const parts = partsRows.map(r => ({
    partNo: r.Part_No || r.PartNo || '',
    name: r.Part_Name || r.Name || r['รายการ'] || '',
    type: r.Type || r['ประเภท'] || 'แท้',
    qty: n(r.Qty || r['จำนวน']),
    unit: r.Unit || r['หน่วย'] || 'ชิ้น',
    costUnit: n(r.Cost_Unit || r['ต้นทุน/หน่วย']),
    sellUnit: n(r.Sell_Unit || r['ขาย/หน่วย']),
    supplier: r.Supplier || '',
  }));
  return {
    id: job.id,
    reNo: job.reNo,
    openDate: job.date,
    appointDate: job.appointDate,
    daysOpen: 0,
    jobStatus: job.jobStatus,
    payStatus: job.payStatus,
    assignee: job.assignee,
    technician: job.assignee,
    urgency: 2,
    customer: { name: job.customer, phone: job.phone, line: '', type: 'ลูกค้า' },
    vehicle: { plate: job.plate, model: job.model, mileage: 0, color: '', vin: '', owner: job.customer },
    symptoms: { customer: job.symptom, tech: '', internal: '' },
    parts,
    financials: { laborMain: n(job.actual), laborExtra: 0, specialService: 0, discount: 0, vatRate: 0, deposit: Math.max(0, n(job.actual) - n(job.remaining)) },
    timeline: [],
    history: [],
  };
}

function getParts() { return readRows(SHEETS.PARTS_MASTER, DATA_ROW.PARTS_MASTER); }
function getCustomers() { return readRows(SHEETS.CUSTOMER_MASTER, DATA_ROW.CUSTOMER_MASTER); }
function getVehicles() { return readRows(SHEETS.VEHICLE_MASTER, DATA_ROW.VEHICLE_MASTER); }
function getCashflow() { return readRows(SHEETS.CASHFLOW, DATA_ROW.CASHFLOW); }
function getAudit() { return readRows(SHEETS.AUDIT_LOG, DATA_ROW.AUDIT_LOG); }
function getSettings() { return readRows(SHEETS.SETTINGS, DATA_ROW.SETTINGS); }

function getDashboard() {
  const jobs = getJobs();
  const cf = getCashflow();
  const revenue = cf.filter(r => String(r.Type || r.type || r['ประเภท']).indexOf('รับ') >= 0 || String(r.In || '').trim()).reduce((s, r) => s + n(r.Amount || r.In || r['รับเข้า']), 0);
  const expense = cf.filter(r => String(r.Type || r.type || r['ประเภท']).indexOf('จ่าย') >= 0 || String(r.Out || '').trim()).reduce((s, r) => s + n(r.Amount || r.Out || r['จ่ายออก']), 0);
  return {
    cashBalance: revenue - expense,
    revenueMonth: revenue,
    expenseMonth: expense,
    netProfitMonth: revenue - expense,
    gpPercent: 0,
    carsInProgress: jobs.filter(j => j.jobStatus !== 'ส่งมอบแล้ว').length,
    carsWaitingParts: jobs.filter(j => j.jobStatus === 'รออะไหล่').length,
    carsReadyToDeliver: jobs.filter(j => j.jobStatus === 'พร้อมส่งมอบ').length,
    arOverdue: jobs.reduce((s, j) => s + n(j.remaining), 0),
    arOverdueCount: jobs.filter(j => n(j.remaining) > 0).length,
    revenueChange: 0,
    expenseChange: 0,
    carsChange: 0,
  };
}

function getMonthlyRevenue() { return [{ month: 'เดือนนี้', revenue: getDashboard().revenueMonth, expense: getDashboard().expenseMonth }]; }
function getMonthlyCars() { return [{ month: 'เดือนนี้', count: getJobs().length }]; }
function getRevenueCategory() { return [{ label: 'รายรับรวม', percent: 100, color: '#1e6fc4' }]; }
function getAlerts() { return [{ level: 'info', text: 'เชื่อมต่อ Apps Script แล้ว', tag: 'GAS' }]; }
