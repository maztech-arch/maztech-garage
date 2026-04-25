/**
 * app.js — Shared Utilities & Components
 * Maztech Garage Admin System
 * ใช้ร่วมกันทุกหน้า / คงดีไซน์เดิมไว้ แต่เพิ่ม helper สำหรับ MVP
 */

'use strict';

// ── Number Formatting ──────────────────────────────────────
const fmt = {
  number: (n) => Math.round(Number(n || 0)).toLocaleString('th-TH'),
  baht: (n) => '฿' + Math.round(Number(n || 0)).toLocaleString('th-TH'),
  percent: (n) => Number(n || 0).toFixed(1) + '%',
  changeClass: (n) => n > 0 ? 'up' : n < 0 ? 'down' : 'neutral',
  changeText: (n) => (n > 0 ? '▲ ' : n < 0 ? '▼ ' : '') + Math.abs(Number(n || 0)).toFixed(1) + '%',
};

// ── Common helpers ──────────────────────────────────────────
const App = {
  qs: (sel, root = document) => root.querySelector(sel),
  qsa: (sel, root = document) => Array.from(root.querySelectorAll(sel)),
  num: (v) => Number(String(v ?? '').replace(/[^0-9.-]/g, '')) || 0,
  text: (v) => String(v ?? '').trim(),
  esc: (v) => String(v ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;'),
  todayISO: () => new Date().toISOString().slice(0, 10),
  monthKey: (date = new Date()) => {
    const d = date instanceof Date ? date : new Date(date || Date.now());
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  },
  redirect: (href) => { window.location.href = href; },
  debounce(fn, wait = 160) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  },
};

// ── Current Thai Buddhist Era Date ────────────────────────
function thaiDateToday() {
  const d   = new Date();
  const day = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'][d.getDay()];
  const mon = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.',
               'ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'][d.getMonth()];
  const be  = d.getFullYear() + 543;
  const dayOfMonth = d.getDate();
  const abbr = ['อา.','จ.','อ.','พ.','พฤ.','ศ.','ส.'][d.getDay()];
  return {
    short: `${abbr} ${dayOfMonth} ${mon} ${be}`,
    long:  `${day}ที่ ${dayOfMonth} ${mon} ${be}`,
  };
}

function thaiDate(dateLike, fallback = '—') {
  if (!dateLike) return fallback;
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return String(dateLike);
  const mon = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'][d.getMonth()];
  return `${d.getDate()} ${mon} ${String(d.getFullYear() + 543).slice(-2)}`;
}

// ── Badge HTML Helpers ─────────────────────────────────────
const jobStatusBadge = {
  'รับรถเข้า':       '<span class="badge badge-teal">รับรถเข้า</span>',
  'ตรวจเช็ก':        '<span class="badge badge-teal">ตรวจเช็ก</span>',
  'เสนอราคา':        '<span class="badge badge-blue">เสนอราคา</span>',
  'รออนุมัติ':       '<span class="badge badge-yellow">รออนุมัติ</span>',
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
    { id: 'jobs',       icon: '📋', label: 'งานซ่อมทั้งหมด',      href: 'jobs.html', badge: getJobBadgeSafe() },
    { id: 'new-job',    icon: '➕', label: 'รับรถเข้า / เปิดจ๊อบ', href: 'new-job.html' },
    { id: 'job-detail', icon: '🧾', label: 'รายละเอียดงานซ่อม',   href: 'jobs.html' },
    { section: 'คลัง & บัญชี' },
    { id: 'parts',      icon: '📦', label: 'อะไหล่ / คลัง',       href: 'parts.html' },
    { id: 'customers',  icon: '👥', label: 'ลูกค้า / รถ',          href: 'customers.html' },
    { id: 'finance',    icon: '💳', label: 'รายรับ-รายจ่าย',      href: 'finance.html' },
    { id: 'reports',    icon: '📑', label: 'รายงาน / Export',     href: 'reports.html' },
    { section: 'ระบบ' },
    { id: 'audit',      icon: '🔍', label: 'Audit Log',            href: 'audit-log.html' },
    { id: 'settings',   icon: '⚙️', label: 'ตั้งค่าระบบ',         href: 'settings.html' },
  ];

  const items = navItems.map(item => {
    if (item.section) return `<div class="nav-section">${item.section}</div>`;
    const isActive = item.id === activePage ? 'active' : '';
    const badge = item.badge ? `<span class="nav-badge">${item.badge}</span>` : '';
    return `<a href="${item.href}" class="nav-item ${isActive}" data-nav="${item.id}">
      <span class="nav-icon">${item.icon}</span>${item.label}${badge}</a>`;
  }).join('');

  return `<aside class="sidebar">
    <a href="dashboard.html" class="sidebar-logo">
      <div class="logo-icon">MZ</div>
      <div class="logo-title">Maztech Garage</div>
      <div class="logo-sub">ระบบจัดการอู่ซ่อมรถ Mazda</div>
    </a>
    <nav class="sidebar-nav">${items}</nav>
    <div class="sidebar-user">
      <div class="user-avatar">เอ</div>
      <div><div class="user-name">เอ · Owner</div><div class="user-role">MazTech Garage</div></div>
    </div>
  </aside>`;
}

function getJobBadgeSafe() {
  try {
    if (!window.MockData || !MockData.peekSummary) return 0;
    return MockData.peekSummary().activeJobs || 0;
  } catch (_) { return 0; }
}

// ── Topbar HTML ────────────────────────────────────────────
function renderTopbar(breadcrumbs) {
  const date = thaiDateToday();
  const crumbs = breadcrumbs.map((b, i) => {
    const isLast = i === breadcrumbs.length - 1;
    if (isLast) return `<span class="current">${App.esc(b.label)}</span>`;
    const link = b.href ? `<a href="${b.href}" style="color:inherit;text-decoration:none;">${App.esc(b.label)}</a>` : App.esc(b.label);
    return `${link}<span class="sep">›</span>`;
  }).join('');

  return `<header class="topbar">
    <div class="breadcrumb">${crumbs}</div>
    <div class="topbar-search">
      <span class="search-icon">🔍</span>
      <input type="text" id="global-search" placeholder="ค้นหาทะเบียน, ชื่อลูกค้า, Job No..." />
    </div>
    <div class="topbar-right">
      <span class="date-badge">${date.short}</span>
      <button class="icon-btn" type="button" onclick="App.redirect('audit-log.html')">🔔<div class="notif-dot"></div></button>
      <button class="icon-btn" type="button" onclick="document.body.classList.toggle('compact-mode')">☀️</button>
      <button class="icon-btn avatar-btn" type="button" onclick="App.redirect('settings.html')">เอ</button>
    </div>
  </header>`;
}

function wireGlobalSearch() {
  const input = document.getElementById('global-search');
  if (!input) return;
  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && input.value.trim()) {
      window.location.href = `jobs.html?q=${encodeURIComponent(input.value.trim())}`;
    }
  });
}

// ── Chart.js defaults (Thai font) ─────────────────────────
function chartDefaults() {
  if (typeof Chart === 'undefined') return;
  Chart.defaults.font.family = "'Sarabun', 'Noto Sans Thai', sans-serif";
  Chart.defaults.font.size = 11;
  Chart.defaults.color = '#64748b';
}

// ── GP% calculator ─────────────────────────────────────────
function calcGP(costUnit, sellUnit, qty = 1) {
  const cost = Number(costUnit || 0) * Number(qty || 0);
  const sell = Number(sellUnit || 0) * Number(qty || 0);
  if (sell === 0) return { cost, sell, gp: 0, gpPct: 0 };
  const gp = sell - cost;
  const gpPct = (gp / sell) * 100;
  return { cost, sell, gp, gpPct };
}

// ── Financial totals for job detail ───────────────────────
function calcFinancials(fin = {}, parts = []) {
  const partsTotal = parts.reduce((s, p) => s + Number(p.sellUnit || 0) * Number(p.qty || 0), 0);
  const partsCost = parts.reduce((s, p) => s + Number(p.costUnit || 0) * Number(p.qty || 0), 0);
  const subtotal = partsTotal + Number(fin.laborMain || 0) + Number(fin.laborExtra || 0) + Number(fin.specialService || 0);
  const afterDisc = Math.max(0, subtotal - Number(fin.discount || 0));
  const vat = Math.round(afterDisc * Number(fin.vatRate || 0));
  const grand = afterDisc + vat;
  const remaining = Math.max(0, grand - Number(fin.deposit || 0));
  const gp = afterDisc - partsCost;
  const gpPct = afterDisc ? (gp / afterDisc) * 100 : 0;
  return { partsTotal, partsCost, subtotal, afterDisc, vat, grand, remaining, gp, gpPct };
}

// ── Urgency stars HTML ─────────────────────────────────────
function renderUrgencyStars(level, max = 5) {
  let html = '<div class="urgency-stars">';
  for (let i = 1; i <= max; i++) html += i <= level ? '<span class="star-filled">★</span>' : '<span class="star-empty">☆</span>';
  return html + '</div>';
}

// ── Toast / Modal / Export / Print helpers ─────────────────
function toast(message, type = 'info') {
  let wrap = document.getElementById('toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'toast-wrap';
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = message;
  wrap.appendChild(el);
  setTimeout(() => el.classList.add('show'), 10);
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 220); }, 2800);
}

function openModal(title, bodyHtml, footerHtml = '') {
  closeModal();
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.id = 'app-modal';
  modal.innerHTML = `<div class="modal-card">
    <div class="modal-head"><div class="modal-title">${title}</div><button class="modal-close" type="button" data-close-modal>×</button></div>
    <div class="modal-body">${bodyHtml}</div>
    ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
  </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', (ev) => {
    if (ev.target === modal || ev.target.matches('[data-close-modal]')) closeModal();
  });
  return modal;
}

function closeModal() {
  const old = document.getElementById('app-modal');
  if (old) old.remove();
}

function downloadCSV(filename, rows) {
  if (!rows || !rows.length) { toast('ไม่มีข้อมูลสำหรับ Export', 'warning'); return; }
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(',')]
    .concat(rows.map(row => headers.map(h => `"${String(row[h] ?? '').replaceAll('"', '""')}"`).join(',')))
    .join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(a.href);
  a.remove();
}

function printPage(title = 'Maztech Garage') {
  document.title = title;
  window.print();
}

function formValue(form, name, fallback = '') {
  const el = form.elements[name];
  return el ? el.value.trim() : fallback;
}

function formNumber(form, name, fallback = 0) {
  return App.num(formValue(form, name, String(fallback)));
}

window.addEventListener('DOMContentLoaded', () => setTimeout(wireGlobalSearch, 0));
