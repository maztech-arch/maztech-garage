/**
 * app.js — Shared Utilities & Components
 * Maztech Garage Admin System
 * =========================================================
 * ฟังก์ชันกลางที่ทุกหน้าใช้ร่วมกัน
 * =========================================================
 */

'use strict';

// ── Number Formatting ──────────────────────────────────────
const fmt = {
  /** 521800 → "521,800" */
  number: (n) => Math.round(n).toLocaleString('th-TH'),

  /** 521800 → "฿521,800" */
  baht: (n) => '฿' + Math.round(n).toLocaleString('th-TH'),

  /** 0.581 → "58.1%" */
  percent: (n) => n.toFixed(1) + '%',

  /** "positive" / "negative" / "neutral" suffix for change indicators */
  changeClass: (n) => n > 0 ? 'up' : n < 0 ? 'down' : 'neutral',

  /** "+12.4%" or "-5.1%" */
  changeText: (n) => (n > 0 ? '▲ ' : n < 0 ? '▼ ' : '') + Math.abs(n).toFixed(1) + '%',
};

// ── Current Thai Buddhist Era Date ────────────────────────
function thaiDateToday() {
  const d   = new Date();
  const day = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'][d.getDay()];
  const mon = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.',
               'ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'][d.getMonth()];
  const be  = d.getFullYear() + 543;
  const dayOfMonth = d.getDate();
  // Short: "จ. 20 เม.ย. 2568"
  const abbr = ['จ.','อ.','พ.','พฤ.','ศ.','ส.','อา.'][d.getDay()];
  return {
    short: `${abbr} ${dayOfMonth} ${mon} ${be}`,
    long:  `${day}ที่ ${dayOfMonth} ${mon} ${be}`,
  };
}

// ── Badge HTML Helpers ─────────────────────────────────────
const jobStatusBadge = {
  'รับรถเข้า':       '<span class="badge badge-teal">รับรถเข้า</span>',
  'ตรวจเช็ก':        '<span class="badge badge-teal">ตรวจเช็ก</span>',
  'รออะไหล่':        '<span class="badge badge-blue">รออะไหล่</span>',
  'กำลังซ่อม':       '<span class="badge badge-orange">กำลังซ่อม</span>',
  'ตรวจซ้ำ':         '<span class="badge badge-purple">ตรวจซ้ำ</span>',
  'พร้อมส่งมอบ':    '<span class="badge badge-green">พร้อมส่งมอบ</span>',
  'ส่งมอบแล้ว':     '<span class="badge badge-gray">ส่งมอบแล้ว</span>',
  'ยกเลิก':          '<span class="badge badge-red">ยกเลิก</span>',
};

const payStatusBadge = {
  'ยังไม่ชำระ':      '<span class="badge badge-red">ยังไม่ชำระ</span>',
  'มัดจำแล้ว':       '<span class="badge badge-yellow">มัดจำแล้ว</span>',
  'ชำระบางส่วน':     '<span class="badge badge-yellow">ชำระบางส่วน</span>',
  'ชำระครบ':         '<span class="badge badge-green">ชำระครบ</span>',
  'ค้างชำระ':        '<span class="badge badge-red">ค้างชำระ</span>',
};

const partTypePill = {
  'แท้':         '<span class="type-pill type-genuine">แท้</span>',
  'OEM':         '<span class="type-pill type-oem">OEM</span>',
  'นอก':         '<span class="type-pill type-aftermarket">นอก</span>',
  'บริการ':      '<span class="type-pill type-service">บริการ</span>',
};

const alertColors = {
  danger:  { dot: '#e24b4a', tag: 'background:#fee2e2;color:#991b1b;' },
  warning: { dot: '#f59e0b', tag: 'background:#fef3c7;color:#92400e;' },
  info:    { dot: '#1e6fc4', tag: 'background:#dbeafe;color:#1e40af;' },
  success: { dot: '#059669', tag: 'background:#d1fae5;color:#065f46;' },
};

// ── Sidebar HTML (shared across all pages) ─────────────────
function renderSidebar(activePage) {
  const navItems = [
    { id: 'dashboard',  icon: '📊', label: 'Dashboard',           href: 'dashboard.html' },
    { id: 'jobs',       icon: '📋', label: 'งานซ่อมทั้งหมด',      href: 'jobs.html', badge: 13 },
    { id: 'new-job',    icon: '➕', label: 'รับรถเข้า / เปิดจ๊อบ', href: '#' },
    { section: 'คลัง & บัญชี' },
    { id: 'parts',      icon: '📦', label: 'อะไหล่ / คลัง',       href: '#' },
    { id: 'customers',  icon: '👥', label: 'ลูกค้า / รถ',          href: '#' },
    { id: 'finance',    icon: '💳', label: 'รายรับ-รายจ่าย',      href: '#' },
    { id: 'reports',    icon: '📑', label: 'รายงาน / Export',     href: '#' },
    { section: 'ระบบ' },
    { id: 'users',      icon: '👤', label: 'ผู้ใช้งาน / Role',    href: '#' },
    { id: 'audit',      icon: '🔍', label: 'Audit Log',            href: '#' },
    { id: 'settings',   icon: '⚙️', label: 'ตั้งค่าระบบ',         href: '#' },
  ];

  const items = navItems.map(item => {
    if (item.section) {
      return `<div class="nav-section">${item.section}</div>`;
    }
    const isActive = item.id === activePage ? 'active' : '';
    const badge    = item.badge ? `<span class="nav-badge">${item.badge}</span>` : '';
    return `
      <a href="${item.href}" class="nav-item ${isActive}">
        <span class="nav-icon">${item.icon}</span>
        ${item.label}
        ${badge}
      </a>`;
  }).join('');

  return `
    <aside class="sidebar">
      <a href="dashboard.html" class="sidebar-logo">
        <div class="logo-icon">MZ</div>
        <div class="logo-title">Maztech Garage</div>
        <div class="logo-sub">ระบบจัดการอู่ซ่อมรถ Mazda</div>
      </a>
      <nav class="sidebar-nav">${items}</nav>
      <div class="sidebar-user">
        <div class="user-avatar">เอ</div>
        <div>
          <div class="user-name">เอ · Owner</div>
          <div class="user-role">MazTech Garage</div>
        </div>
      </div>
    </aside>`;
}

// ── Topbar HTML ────────────────────────────────────────────
function renderTopbar(breadcrumbs) {
  const date  = thaiDateToday();
  const crumbs = breadcrumbs.map((b, i) => {
    const isLast = i === breadcrumbs.length - 1;
    if (isLast) return `<span class="current">${b.label}</span>`;
    const link = b.href ? `<a href="${b.href}" style="color:inherit;text-decoration:none;">${b.label}</a>` : b.label;
    return `${link}<span class="sep">›</span>`;
  }).join('');

  return `
    <header class="topbar">
      <div class="breadcrumb">${crumbs}</div>
      <div class="topbar-search">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="ค้นหาทะเบียน, ชื่อลูกค้า, Job No..." />
      </div>
      <div class="topbar-right">
        <span class="date-badge">${date.short}</span>
        <div class="icon-btn">🔔<div class="notif-dot"></div></div>
        <div class="icon-btn">☀️</div>
        <div class="icon-btn avatar-btn">เอ</div>
      </div>
    </header>`;
}

// ── Chart.js defaults (Thai font) ─────────────────────────
function chartDefaults() {
  if (typeof Chart === 'undefined') return;
  Chart.defaults.font.family = "'Sarabun', 'Noto Sans Thai', sans-serif";
  Chart.defaults.font.size   = 11;
  Chart.defaults.color       = '#64748b';
}

// ── GP% calculator ─────────────────────────────────────────
function calcGP(costUnit, sellUnit, qty = 1) {
  const cost = costUnit * qty;
  const sell = sellUnit * qty;
  if (sell === 0) return { cost, sell, gp: 0, gpPct: 0 };
  const gp    = sell - cost;
  const gpPct = (gp / sell) * 100;
  return { cost, sell, gp, gpPct };
}

// ── Financial totals for job detail ───────────────────────
function calcFinancials(fin, parts) {
  const partsTotal = parts.reduce((s, p) => s + p.sellUnit * p.qty, 0);
  const subtotal   = partsTotal + fin.laborMain + fin.laborExtra + fin.specialService;
  const afterDisc  = subtotal - fin.discount;
  const vat        = Math.round(afterDisc * fin.vatRate);
  const grand      = afterDisc + vat;
  const remaining  = grand - fin.deposit;
  return { partsTotal, subtotal, afterDisc, vat, grand, remaining };
}

// ── Urgency stars HTML ─────────────────────────────────────
function renderUrgencyStars(level, max = 5) {
  let html = '<div class="urgency-stars">';
  for (let i = 1; i <= max; i++) {
    html += i <= level ? '<span class="star-filled">★</span>' : '<span class="star-empty">☆</span>';
  }
  html += '</div>';
  return html;
}
