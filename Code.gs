/**
 * Code.gs — Maztech Garage Web App API
 * ใช้แทนไฟล์เดิมได้ทั้งก้อนได้เลย
 * ------------------------------------------------------------
 * อิงตามโครงสร้างไฟล์จริง:
 * - Job_Header      : header row 2, data row 4
 * - Job_detail      : header row 2, data row 4
 * - Job_Parts       : header row 2, data row 4
 * - Cust_Master     : header row 2, data row 4
 * - Vehicle         : header row 2, data row 4
 * - Parts_Master    : header row 2, data row 4
 * - DAILY_CASHFLOW  : header row 4, data row 5
 * - DASHBOARD_DATA  : header row 1, data row 2
 * ------------------------------------------------------------
 * สำคัญ:
 * 1) เปลี่ยน SPREADSHEET_ID ให้เป็นของคุณ
 * 2) Deploy ใหม่ทุกครั้งหลังแก้โค้ด
 */

// ==============================
// CONFIG
// ==============================
const SPREADSHEET_ID = '1BqCOyX1E6L--ZCRPeNgqrapKh7eZ-0LVxHRbrkw-au4';

const SHEET = {
  JOB_HEADER: 'Job_Header',
  JOB_DETAIL: 'Job_detail',
  JOB_PARTS: 'Job_Parts',
  CUST_MASTER: 'Cust_Master',
  VEHICLE: 'Vehicle',
  CASHFLOW: 'DAILY_CASHFLOW',
  PARTS_MASTER: 'Parts_Master',
  DASHBOARD_DATA: 'DASHBOARD_DATA',
};

const HEADER_ROW = {
  JOB_HEADER: 2,
  JOB_DETAIL: 2,
  JOB_PARTS: 2,
  CUST_MASTER: 2,
  VEHICLE: 2,
  PARTS_MASTER: 2,
  CASHFLOW: 4,
  DASHBOARD_DATA: 1,
};

const DATA_ROW = {
  JOB_HEADER: 4,
  JOB_DETAIL: 4,
  JOB_PARTS: 4,
  CUST_MASTER: 4,
  VEHICLE: 4,
  PARTS_MASTER: 4,
  CASHFLOW: 5,
  DASHBOARD_DATA: 2,
};

// ==============================
// ROUTER
// ==============================
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) ? String(e.parameter.action) : '';
    const id = (e && e.parameter && e.parameter.id) ? String(e.parameter.id) : '';

    let data;

    switch (action) {
      case 'getDashboard':
        data = getDashboard();
        break;

      case 'getMonthlyRevenue':
        data = getMonthlyRevenue();
        break;

      case 'getMonthlyCars':
        data = getMonthlyCars();
        break;

      case 'getRevenueCategory':
        data = getRevenueCategory();
        break;

      case 'getAlerts':
        data = getAlerts();
        break;

      case 'getJobs':
        data = getJobs();
        break;

      case 'getJobSummary':
        data = getJobSummary();
        break;

      case 'getJobDetail':
        data = getJobDetail(id);
        break;

      case 'healthCheck':
        data = healthCheck();
        break;

      default:
        throw new Error('Unknown action: ' + action);
    }

    return jsonOk(data);
  } catch (err) {
    return jsonError(err.message);
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || '{}');
    const action = String(payload.action || '');

    let result;

    switch (action) {
      case 'createJob':
        result = createJob(payload.data || payload);
        break;

      case 'updateStatus':
        result = updateJobStatus(payload.id, payload.status);
        break;

      case 'addPayment':
        result = addPayment(payload.id, payload.amount, payload.channel, payload.note);
        break;

      default:
        throw new Error('Unknown action: ' + action);
    }

    return jsonOk(result);
  } catch (err) {
    return jsonError(err.message);
  }
}

// ==============================
// CORE HELPERS
// ==============================
function getSpreadsheet_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getSheetObj(key) {
  const ss = getSpreadsheet_();
  const sh = ss.getSheetByName(SHEET[key]);
  if (!sh) throw new Error('Sheet not found: ' + SHEET[key]);
  return sh;
}

function getHeaders_(key) {
  const sh = getSheetObj(key);
  const hRow = HEADER_ROW[key];
  const lastCol = sh.getLastColumn();

  const headers = sh.getRange(hRow, 1, 1, lastCol).getValues()[0].map(function (h) {
    return String(h || '').split('\n')[0].trim();
  });

  return headers;
}

function getHeaderMap_(key) {
  const headers = getHeaders_(key);
  const map = {};
  headers.forEach(function (h, i) {
    if (h && !map[h]) map[h] = i + 1;
  });
  return map;
}

function readSheet(key) {
  const sh = getSheetObj(key);
  const hRow = HEADER_ROW[key];
  const dRow = DATA_ROW[key];
  const lastRow = sh.getLastRow();
  const lastCol = sh.getLastColumn();

  if (lastRow < dRow || lastCol < 1) return [];

  const headers = sh.getRange(hRow, 1, 1, lastCol).getValues()[0].map(function (h) {
    return String(h || '').split('\n')[0].trim();
  });

  const values = sh.getRange(dRow, 1, lastRow - dRow + 1, lastCol).getValues();

  return values
    .map(function (row, idx) {
      const obj = {};

      headers.forEach(function (h, i) {
        // ถ้ามีหัวคอลัมน์ซ้ำ ให้ใช้ค่าจากคอลัมน์แรกเท่านั้น
        // ป้องกัน Total_Sell / Total_Parts / Total_Margin ด้านขวาทับค่าหลัก
        if (h && obj[h] === undefined) {
          obj[h] = row[i];
        }
      });

      obj.__rowNumber = dRow + idx;
      return obj;
    })
    .filter(function (obj) {
      return Object.keys(obj).some(function (key) {
        return key !== '__rowNumber' && obj[key] !== '' && obj[key] !== null;
      });
    });
}

function getNextDataRowByColumn(key, headerName) {
  const sh = getSheetObj(key);
  const hRow = HEADER_ROW[key];
  const dRow = DATA_ROW[key];
  const lastRow = sh.getLastRow();
  const lastCol = sh.getLastColumn();

  const headers = sh.getRange(hRow, 1, 1, lastCol).getValues()[0].map(function (h) {
    return String(h || '').split('\n')[0].trim();
  });

  const colIndex = headers.indexOf(headerName) + 1;
  if (colIndex < 1) throw new Error('Header not found: ' + headerName);

  const numRows = Math.max(lastRow - dRow + 1, 1);
  const values = sh.getRange(dRow, colIndex, numRows, 1).getValues();

  for (let i = 0; i < values.length; i++) {
    if (String(values[i][0] || '').trim() === '') {
      return dRow + i;
    }
  }

  return lastRow + 1;
}

function setValueByHeader_(key, rowNumber, headerName, value) {
  const sh = getSheetObj(key);
  const headerMap = getHeaderMap_(key);
  const col = headerMap[headerName];
  if (!col) throw new Error('Header not found: ' + headerName);
  sh.getRange(rowNumber, col).setValue(value);
}

function getCellValueByHeader_(key, rowNumber, headerName) {
  const sh = getSheetObj(key);
  const headerMap = getHeaderMap_(key);
  const col = headerMap[headerName];
  if (!col) throw new Error('Header not found: ' + headerName);
  return sh.getRange(rowNumber, col).getValue();
}

function findRowByHeaderValue_(key, headerName, lookupValue) {
  const rows = readSheet(key);
  const target = String(lookupValue || '').trim();
  const found = rows.find(function (r) {
    return String(r[headerName] || '').trim() === target;
  });
  return found ? found.__rowNumber : 0;
}

function num(v) {
  if (v === null || v === undefined || v === '') return 0;
  if (typeof v === 'number') return isNaN(v) ? 0 : v;

  const cleaned = String(v)
    .replace(/,/g, '')
    .replace(/฿/g, '')
    .replace(/\s/g, '')
    .replace(/[^\d.-]/g, '');

  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

function toDate_(v) {
  if (!v) return null;
  if (Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v.getTime())) return v;

  const d = new Date(v);
  if (!isNaN(d.getTime())) return d;

  return null;
}

function thaiDate(d) {
  const date = toDate_(d);
  if (!date) return String(d || '');

  const m = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  return date.getDate() + ' ' + m[date.getMonth()] + ' ' + String(date.getFullYear() + 543).slice(2);
}

function monthLabelFromDate_(d) {
  const date = toDate_(d);
  if (!date) return '';
  const m = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  return m[date.getMonth()];
}

function jsonOk(data) {
  return ContentService
    .createTextOutput(JSON.stringify({
      ok: true,
      ts: new Date().toISOString(),
      data: data
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonError(message) {
  return ContentService
    .createTextOutput(JSON.stringify({
      ok: false,
      ts: new Date().toISOString(),
      error: String(message || 'Unknown error')
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ==============================
// DASHBOARD
// ==============================
function getDashboard() {
  var jobs = readSheet('JOB_HEADER').filter(function (j) {
    return j['RE_No'];
  });

  var cashRows = readSheet('CASHFLOW');

  // ==============================
  // Helper: ดึงตัวเลขจากชื่อคอลัมน์แบบยืดหยุ่น
  // ==============================
  function getAmountByKeyword_(row, keyword) {
    var keys = Object.keys(row);

    for (var i = 0; i < keys.length; i++) {
      var key = String(keys[i] || '').trim();

      if (key.indexOf(keyword) >= 0) {
        return num(row[key]);
      }
    }

    return 0;
  }

  function getDateFromRow_(row) {
    return row['วันที่'] || row['Date'] || row['Transaction_Date'] || '';
  }

  // ==============================
  // รายรับ-รายจ่ายเฉพาะเดือนปัจจุบัน
  // ==============================
  var now = new Date();
  var currentYear = now.getFullYear();
  var currentMonth = now.getMonth();

  function isCurrentMonth_(value) {
    var d = toDate_(value);
    if (!d) return false;
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  }

  var revenueMonth = 0;
  var expenseMonth = 0;

  cashRows.forEach(function (r) {
    var type = String(r['ประเภท'] || '').trim();

    // ยอดยกมาไม่ถือเป็นรายรับเดือนนี้
    if (type === 'ยอดยกมา' || type === '') {
      return;
    }

    var rowDate = getDateFromRow_(r);

    // ถ้าไม่มีวันที่ ไม่เอามานับเป็นรายรับ/รายจ่ายเดือนนี้
    if (!isCurrentMonth_(rowDate)) {
      return;
    }

    revenueMonth += getAmountByKeyword_(r, 'รับ');
    expenseMonth += getAmountByKeyword_(r, 'จ่าย');
  });

  var netProfit = revenueMonth - expenseMonth;
  var gpPct = revenueMonth > 0 ? (netProfit / revenueMonth) * 100 : 0;

  // ==============================
  var cashBalance = getLatestCashBalance_();

  // ==============================
  // สถานะงานซ่อม
  // ==============================
  var inProgress = jobs.filter(function (j) {
    var s = String(j['Job_Status'] || '').trim();

    return s === '' ||
      s === 'กำลังซ่อม' ||
      s === 'รออะไหล่' ||
      s === 'รอชิ้นส่วน' ||
      s === 'ตรวจเช็ก' ||
      s === 'รับรถเข้า';
  }).length;

  var waitParts = jobs.filter(function (j) {
    var s = String(j['Job_Status'] || '').trim();
    return s === 'รออะไหล่' || s === 'รอชิ้นส่วน';
  }).length;

  var readyDeliver = jobs.filter(function (j) {
    var s = String(j['Job_Status'] || '').trim();
    return s === 'พร้อมส่งมอบ';
  }).length;

  // ==============================
  // ลูกหนี้คงค้าง
  // ==============================
  var arJobs = jobs.filter(function (j) {
    var s = String(j['Job_Status'] || '').trim();

    return s !== 'ส่งมอบแล้ว' &&
      s !== 'เสร็จแล้ว' &&
      s !== 'ยกเลิก' &&
      num(j['Total_Sell']) > 0;
  });

  var arTotal = arJobs.reduce(function (sum, j) {
    return sum + num(j['Total_Sell']);
  }, 0);

  return {
    cashBalance: Math.round(cashBalance),
    revenueMonth: Math.round(revenueMonth),
    expenseMonth: Math.round(expenseMonth),
    netProfitMonth: Math.round(netProfit),
    gpPercent: Math.round(gpPct * 10) / 10,
    carsInProgress: inProgress,
    carsWaitingParts: waitParts,
    carsReadyToDeliver: readyDeliver,
    arOverdue: Math.round(arTotal),
    arOverdueCount: arJobs.length,
    revenueChange: 0,
    expenseChange: 0,
    carsChange: 0
  };
}
function getLatestCashBalance_() {
  const key = 'CASHFLOW';
  const sh = getSheetObj(key);
  const hRow = HEADER_ROW[key];
  const dRow = DATA_ROW[key];
  const lastRow = sh.getLastRow();
  const lastCol = sh.getLastColumn();

  if (lastRow < dRow) return 0;

  const headers = sh.getRange(hRow, 1, 1, lastCol).getValues()[0].map(function (h) {
    return String(h || '').split('\n')[0].trim();
  });

  function findCol_(keywords) {
    for (var i = 0; i < headers.length; i++) {
      var h = String(headers[i] || '').trim();
      var ok = keywords.every(function (kw) {
        return h.indexOf(kw) >= 0;
      });
      if (ok) return i + 1;
    }
    return 0;
  }

  const dateCol = findCol_(['วันที่']) || findCol_(['Date']);
  const refCol = findCol_(['Ref']);
  const typeCol = findCol_(['ประเภท']);
  const detailCol = findCol_(['รายละเอียด']);
  const inCol = findCol_(['รับ']);
  const outCol = findCol_(['จ่าย']);
  const balanceCol = findCol_(['ยอดคงเหลือ']) || findCol_(['Running']);

  if (!balanceCol) return 0;

  const values = sh.getRange(dRow, 1, lastRow - dRow + 1, lastCol).getValues();

  for (var r = values.length - 1; r >= 0; r--) {
    var row = values[r];

    var dateVal = dateCol ? row[dateCol - 1] : '';
    var refVal = refCol ? String(row[refCol - 1] || '').trim() : '';
    var typeVal = typeCol ? String(row[typeCol - 1] || '').trim() : '';
    var detailVal = detailCol ? String(row[detailCol - 1] || '').trim() : '';
    var inAmount = inCol ? num(row[inCol - 1]) : 0;
    var outAmount = outCol ? num(row[outCol - 1]) : 0;
    var balanceRaw = row[balanceCol - 1];

    var hasRealTransaction =
      dateVal !== '' ||
      refVal !== '' ||
      typeVal !== '' ||
      detailVal !== '' ||
      inAmount !== 0 ||
      outAmount !== 0;

    if (hasRealTransaction && balanceRaw !== '' && balanceRaw !== null && balanceRaw !== undefined) {
      return num(balanceRaw);
    }
  }

  return 0;
}
function getMonthlyRevenue() {
  const rows = readSheet('DASHBOARD_DATA')
    .filter(function (r) {
      return num(r['Revenue_Jobs']) > 0 || num(r['Other_Income']) > 0 || num(r['OpEx']) > 0;
    })
    .slice(-6);

  return rows.map(function (r) {
    return {
      month: monthLabelFromDate_(r['Month_Date']) || String(r['Month_Display_BE'] || ''),
      revenue: Math.round(num(r['Revenue_Jobs']) + num(r['Other_Income'])),
      expense: Math.round(num(r['OpEx']))
    };
  });
}

function getMonthlyCars() {
  const rows = readSheet('DASHBOARD_DATA')
    .filter(function (r) {
      return num(r['Jobs']) > 0;
    })
    .slice(-6);

  return rows.map(function (r) {
    return {
      month: monthLabelFromDate_(r['Month_Date']) || String(r['Month_Display_BE'] || ''),
      count: Math.round(num(r['Jobs']))
    };
  });
}

function getRevenueCategory() {
  const details = readSheet('JOB_DETAIL').filter(function (r) {
    return r['RE_No'] && (num(r['Sell_Price']) > 0);
  });

  const catMap = {};
  details.forEach(function (row) {
    const group = String(row['SVC_Group'] || row['Item_Type'] || 'อื่นๆ').trim() || 'อื่นๆ';
    const amount = num(row['Sell_Price']);
    if (!catMap[group]) catMap[group] = 0;
    catMap[group] += amount;
  });

  const total = Object.keys(catMap).reduce(function (sum, k) {
    return sum + catMap[k];
  }, 0) || 1;

  const colors = ['#1e6fc4', '#059669', '#f59e0b', '#7c3aed', '#e24b4a', '#64748b'];

  return Object.keys(catMap)
    .map(function (k) {
      return { label: k, amount: catMap[k] };
    })
    .sort(function (a, b) {
      return b.amount - a.amount;
    })
    .slice(0, 6)
    .map(function (item, i) {
      return {
        label: item.label,
        percent: Math.round((item.amount / total) * 100),
        color: colors[i] || '#999999'
      };
    });
}

function getAlerts() {
  const jobs = readSheet('JOB_HEADER').filter(function (j) { return j['RE_No']; });
  const dash = getDashboard();
  const alerts = [];

  const waitingParts = jobs.filter(function (j) {
    return String(j['Job_Status'] || '').trim() === 'รออะไหล่';
  });

  if (waitingParts.length > 0) {
    alerts.push({
      level: 'danger',
      tag: 'เร่งด่วน',
      text: 'รถรออะไหล่ ' + waitingParts.length + ' คัน'
    });
  }

  const readyDeliver = jobs.filter(function (j) {
    return String(j['Job_Status'] || '').trim() === 'พร้อมส่งมอบ';
  });

  if (readyDeliver.length > 0) {
    alerts.push({
      level: 'warning',
      tag: 'แจ้งเตือน',
      text: 'รถพร้อมส่งมอบ ' + readyDeliver.length + ' คัน'
    });
  }

  if (dash.gpPercent > 0) {
    alerts.push({
      level: dash.gpPercent >= 40 ? 'success' : 'warning',
      tag: dash.gpPercent >= 40 ? 'ปกติ' : 'ระวัง',
      text: 'GP% เดือนนี้ ' + dash.gpPercent + '%'
    });
  }

  if (dash.arOverdue > 0) {
    alerts.push({
      level: 'warning',
      tag: 'ค้างชำระ',
      text: 'ยอดลูกหนี้คงค้าง ' + dash.arOverdue.toLocaleString('th-TH') + ' บาท'
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      level: 'info',
      tag: 'ปกติ',
      text: 'ไม่มีแจ้งเตือนสำคัญ'
    });
  }

  return alerts;
}

// ==============================
// JOBS
// ==============================
function getJobs() {
  const jobs = readSheet('JOB_HEADER')
    .filter(function (j) { return j['RE_No']; })
    .map(function (j) {
      return {
        id: String(j['RE_No'] || ''),
        date: j['Job_Date'] ? thaiDate(j['Job_Date']) : '',
        dateRaw: toDate_(j['Job_Date']) ? toDate_(j['Job_Date']).getTime() : 0,
        plate: String(j['License_Plate'] || ''),
        model: String(j['Car_Model'] || ''),
        customer: String(j['Cust_Name'] || ''),
        phone: String(j['Phone'] || ''),
        symptom: String(j['Remark'] || ''),
        estimated: num(j['Total_Sell']),
        actual: num(j['Total_Sell']),
        jobStatus: String(j['Job_Status'] || ''),
        payStatus: '',
        assignee: '',
        appointDate: '—'
      };
    })
    .sort(function (a, b) {
      return b.dateRaw - a.dateRaw;
    });

  return jobs;
}

function getJobSummary() {
  const jobs = readSheet('JOB_HEADER').filter(function (j) { return j['RE_No']; });

  function countStatus(statusName) {
    return jobs.filter(function (j) {
      return String(j['Job_Status'] || '').trim() === statusName;
    }).length;
  }

  return {
    total: jobs.length,
    waitParts: countStatus('รออะไหล่'),
    inProgress: countStatus('กำลังซ่อม'),
    readyDeliver: countStatus('พร้อมส่งมอบ'),
    delivered: countStatus('ส่งมอบแล้ว'),
    arOverdue: 0
  };
}

function getJobDetail(reNo) {
  if (!reNo) throw new Error('id (RE_No) is required');

  const jobs = readSheet('JOB_HEADER');
  const details = readSheet('JOB_DETAIL');
  const jobParts = readSheet('JOB_PARTS');
  const custs = readSheet('CUST_MASTER');
  const vehicles = readSheet('VEHICLE');

  const job = jobs.find(function (j) {
    return String(j['RE_No'] || '').trim() === String(reNo).trim();
  });

  if (!job) throw new Error('Job not found: ' + reNo);

  const cust = custs.find(function (c) {
    return String(c['Phone'] || '').trim() !== '' &&
           String(c['Phone'] || '').trim() === String(job['Phone'] || '').trim();
  }) || {};

  const vehicle = vehicles.find(function (v) {
    return String(v['License_Plate'] || '').trim() !== '' &&
           String(v['License_Plate'] || '').trim() === String(job['License_Plate'] || '').trim();
  }) || {};

  const serviceItems = details
    .filter(function (d) {
      return String(d['RE_No'] || '').trim() === String(reNo).trim();
    })
    .map(function (d) {
      return {
        type: String(d['Item_Type'] || ''),
        code: String(d['SVC_Code'] || ''),
        name: String(d['Item_Name'] || d['Free_Item'] || ''),
        group: String(d['SVC_Group'] || ''),
        sellPrice: num(d['Sell_Price']),
        discount: num(d['Discount']),
        laborCost: num(d['Labor_Cost']),
        partsCost: num(d['Parts_Cost']),
        margin: num(d['Line_Margin']),
        remark: String(d['Remark'] || '')
      };
    });

  const partsItems = jobParts
    .filter(function (p) {
      return String(p['RE_No'] || '').trim() === String(reNo).trim() &&
             String(p['Part_Code'] || '').trim() !== '';
    })
    .map(function (p) {
      return {
        partNo: String(p['Part_Code'] || ''),
        name: String(p['Part_Name'] || ''),
        type: 'อะไหล่',
        qty: num(p['Qty']) || 1,
        unit: String(p['Unit'] || 'ชิ้น'),
        costUnit: num(p['Unit_Cost']),
        sellUnit: num(p['Unit_Sell']),
        lineCost: num(p['Line_Cost']),
        lineSell: num(p['Line_Sell']),
        margin: num(p['Margin']),
        supplier: '—',
        remark: String(p['Remark'] || '')
      };
    });

  const history = jobs
    .filter(function (j) {
      return String(j['License_Plate'] || '').trim() === String(job['License_Plate'] || '').trim() &&
             String(j['RE_No'] || '').trim() !== String(reNo).trim();
    })
    .sort(function (a, b) {
      const ad = toDate_(a['Job_Date']) ? toDate_(a['Job_Date']).getTime() : 0;
      const bd = toDate_(b['Job_Date']) ? toDate_(b['Job_Date']).getTime() : 0;
      return bd - ad;
    })
    .slice(0, 5)
    .map(function (j) {
      return {
        jobId: String(j['RE_No'] || ''),
        date: thaiDate(j['Job_Date']),
        work: String(j['Remark'] || ''),
        amount: num(j['Total_Sell']),
        status: String(j['Job_Status'] || '')
      };
    });

  return {
    id: String(job['RE_No'] || ''),
    openDate: thaiDate(job['Job_Date']),
    appointDate: '—',
    daysOpen: 0,
    jobStatus: String(job['Job_Status'] || ''),
    payStatus: '',
    assignee: '',
    technician: '',
    urgency: 3,
    customer: {
      name: String(job['Cust_Name'] || cust['Cust_Name'] || ''),
      phone: String(job['Phone'] || cust['Phone'] || ''),
      line: String(cust['Line_ID'] || ''),
      type: 'ลูกค้าทั่วไป'
    },
    vehicle: {
      plate: String(job['License_Plate'] || ''),
      model: String(job['Car_Model'] || vehicle['Car_Model'] || ''),
      mileage: num(job['Mileage']),
      color: String(vehicle['Color'] || ''),
      vin: String(vehicle['VIN'] || ''),
      owner: String(job['Cust_Name'] || '')
    },
    symptoms: {
      customer: String(job['Remark'] || ''),
      tech: serviceItems.map(function (x) { return x.name; }).filter(Boolean).join(', '),
      internal: ''
    },
    services: serviceItems,
    parts: partsItems,
    financials: {
      totalSell: num(job['Total_Sell']),
      partsTotal: num(job['Total_Parts']),
      laborMain: num(job['Total_Labor']),
      totalMargin: num(job['Total_Margin']),
      marginPct: num(job['Margin_Pct'])
    },
    timeline: buildTimeline(job['Job_Status']),
    history: history
  };
}

function buildTimeline(currentStatus) {
  const steps = [
    'รับรถเข้า',
    'ตรวจเช็ก',
    'เสนอราคา',
    'ลูกค้าอนุมัติ',
    'รออะไหล่',
    'กำลังซ่อม',
    'ตรวจคุณภาพ',
    'พร้อมส่งมอบ',
    'ส่งมอบแล้ว'
  ];

  const statusMap = {
    'รับรถเข้า': 0,
    'ตรวจเช็ก': 1,
    'เสนอราคา': 2,
    'รออนุมัติ': 3,
    'ลูกค้าอนุมัติ': 3,
    'รออะไหล่': 4,
    'กำลังซ่อม': 5,
    'ตรวจซ้ำ': 6,
    'ตรวจคุณภาพ': 6,
    'พร้อมส่งมอบ': 7,
    'ส่งมอบแล้ว': 8
  };

  const activeIdx = (statusMap[String(currentStatus || '').trim()] !== undefined)
    ? statusMap[String(currentStatus || '').trim()]
    : 0;

  return steps.map(function (step, i) {
    return {
      step: step,
      status: i < activeIdx ? 'done' : (i === activeIdx ? 'active' : 'pending'),
      time: i < activeIdx ? '✓' : (i === activeIdx ? 'กำลังดำเนินการ' : '—')
    };
  });
}

// ==============================
// WRITE ACTIONS
// ==============================
function createJob(data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const sh = getSheetObj('JOB_HEADER');
    const nextRow = getNextDataRowByColumn('JOB_HEADER', 'RE_No');
    const jobDate = toDate_(data.jobDate) || new Date();

    const existingJobs = readSheet('JOB_HEADER')
      .map(function (r) { return String(r['RE_No'] || ''); })
      .filter(function (v) { return /^RE\d+$/i.test(v); });

    let maxNum = 0;
    existingJobs.forEach(function (re) {
      const n = parseInt(String(re).replace(/RE/i, ''), 10);
      if (!isNaN(n) && n > maxNum) maxNum = n;
    });

    const newReNo = (data.reNo && String(data.reNo).trim() !== '')
      ? String(data.reNo).trim()
      : ('RE' + ('0000' + (maxNum + 1)).slice(-4));

    // เขียนเฉพาะช่อง input เพื่อไม่ทับสูตรที่มีอยู่แล้วใน template
    setValueByHeader_('JOB_HEADER', nextRow, 'RE_No', newReNo);
    setValueByHeader_('JOB_HEADER', nextRow, 'Job_Date', jobDate);

    if (hasHeader_('JOB_HEADER', 'Cust_ID')) {
      setValueByHeader_('JOB_HEADER', nextRow, 'Cust_ID', String(data.custId || ''));
    }

    setValueByHeader_('JOB_HEADER', nextRow, 'Cust_Name', String(data.custName || ''));
    setValueByHeader_('JOB_HEADER', nextRow, 'Phone', String(data.phone || ''));
    setValueByHeader_('JOB_HEADER', nextRow, 'License_Plate', String(data.plate || ''));
    setValueByHeader_('JOB_HEADER', nextRow, 'Car_Model', String(data.model || ''));
    setValueByHeader_('JOB_HEADER', nextRow, 'Mileage', num(data.mileage));
    setValueByHeader_('JOB_HEADER', nextRow, 'Job_Status', String(data.jobStatus || 'รับรถเข้า'));
    setValueByHeader_('JOB_HEADER', nextRow, 'Remark', String(data.symptom || data.remark || ''));

    SpreadsheetApp.flush();

    const jobHeaderId = getCellValueByHeader_('JOB_HEADER', nextRow, 'Job_Header_ID');

    return {
      ok: true,
      id: newReNo,
      row: nextRow,
      jobHeaderId: jobHeaderId
    };
  } finally {
    lock.releaseLock();
  }
}

function updateJobStatus(reNo, newStatus) {
  if (!reNo) throw new Error('RE_No is required');
  if (!newStatus) throw new Error('newStatus is required');

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const rowNumber = findRowByHeaderValue_('JOB_HEADER', 'RE_No', reNo);
    if (!rowNumber) throw new Error('Job not found: ' + reNo);

    setValueByHeader_('JOB_HEADER', rowNumber, 'Job_Status', String(newStatus).trim());
    SpreadsheetApp.flush();

    return {
      ok: true,
      id: reNo,
      row: rowNumber,
      newStatus: String(newStatus).trim()
    };
  } finally {
    lock.releaseLock();
  }
}

function addPayment(reNo, amount, channel, note) {
  if (!reNo) throw new Error('RE_No is required');
  if (num(amount) <= 0) throw new Error('Amount must be greater than 0');

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const nextRow = getNextDataRowByColumn('CASHFLOW', 'ประเภท');

    // DAILY_CASHFLOW row structure:
    // A วันที่
    // B Ref_ID
    // C ประเภท
    // D รายละเอียด
    // E เงินเข้า/ออก
    // F รับ (฿)
    // G จ่าย (฿)
    // H ยอดคงเหลือ (สูตร)
    // I ช่องทาง
    // J หมวดหมู่
    // K เดือน (สูตร)
    // L หมายเหตุ

    setValueByHeader_('CASHFLOW', nextRow, 'วันที่', new Date());
    setValueByHeader_('CASHFLOW', nextRow, 'Ref_ID', String(reNo));
    setValueByHeader_('CASHFLOW', nextRow, 'ประเภท', 'รายรับงานซ่อม');
    setValueByHeader_('CASHFLOW', nextRow, 'รายละเอียด', 'รับชำระค่าซ่อม ' + reNo);
    setValueByHeader_('CASHFLOW', nextRow, 'เงินเข้า/ออก', 'เงินเข้า');
    setValueByHeader_('CASHFLOW', nextRow, 'รับ (฿)', num(amount));
    setValueByHeader_('CASHFLOW', nextRow, 'จ่าย (฿)', '');
    setValueByHeader_('CASHFLOW', nextRow, 'ช่องทาง', String(channel || 'โอนธนาคาร'));
    setValueByHeader_('CASHFLOW', nextRow, 'หมวดหมู่', 'รายรับ-ค่าซ่อม');

    if (hasHeader_('CASHFLOW', 'หมายเหตุ')) {
      setValueByHeader_('CASHFLOW', nextRow, 'หมายเหตุ', String(note || ''));
    }

    SpreadsheetApp.flush();

    return {
      ok: true,
      id: reNo,
      amount: num(amount),
      row: nextRow
    };
  } finally {
    lock.releaseLock();
  }
}

function hasHeader_(key, headerName) {
  const headerMap = getHeaderMap_(key);
  return !!headerMap[headerName];
}

// ==============================
// HEALTH CHECK
// ==============================
function healthCheck() {
  const ss = getSpreadsheet_();
  const result = {
    spreadsheetName: ss.getName(),
    spreadsheetId: ss.getId(),
    sheets: {},
    dashboardPreview: null
  };

  Object.keys(SHEET).forEach(function (key) {
    try {
      const sh = ss.getSheetByName(SHEET[key]);
      if (!sh) {
        result.sheets[SHEET[key]] = { ok: false, error: 'Sheet not found' };
        return;
      }

      const rows = readSheet(key);
      result.sheets[SHEET[key]] = {
        ok: true,
        rows: rows.length,
        headerRow: HEADER_ROW[key],
        dataRow: DATA_ROW[key]
      };
    } catch (err) {
      result.sheets[SHEET[key]] = {
        ok: false,
        error: err.message
      };
    }
  });

  try {
    result.dashboardPreview = getDashboard();
  } catch (err) {
    result.dashboardPreview = { error: err.message };
  }

  return result;
}