// exportFavoritesToPDF.js
// Matches the Islamic Names Database PDF style (dark-green + gold card layout)
// Dependencies: jspdf, jspdf-autotable, arabic-reshaper, bidi-js

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import arabicReshaper from 'arabic-reshaper';
import bidiFactory from 'bidi-js';

// ─── Constants ────────────────────────────────────────────────────────────────
const COLORS = {
  darkGreen : [27,  67, 50],   // #1B4332
  teal      : [45, 106, 79],   // #2D6A4F
  gold      : [201, 168, 76],  // #C9A84C
  lightGold : [245, 230, 192], // #F5E6C0
  lightGreen: [216, 243, 220], // #D8F3DC
  cream     : [253, 250, 243], // #FDFAF3
  lightTeal : [234, 244, 239], // #EAF4EF
  darkText  : [26,  26,  46],  // #1A1A2E
  midGray   : [107, 114, 128], // #6B7280
  border    : [209, 213, 219], // #D1D5DB
  white     : [255, 255, 255],
  boy       : [30,  64, 175],  // #1E40AF
  girl      : [157, 23, 93],   // #9D174D
};

const PAGE = { W: 210, H: 297 };          // A4 mm
const MARGIN = 14;
const CARD_W = PAGE.W - MARGIN * 2;
const PAD    = 5;
const INNER  = CARD_W - PAD * 2;

// ─── Arabic reshaping ─────────────────────────────────────────────────────────
const bidi = bidiFactory();

function shapeArabic(text) {
  if (!text || typeof text !== 'string') return '';
  try {
    const reshaped = arabicReshaper.reshape(text);
    return bidi.getReorderedText(reshaped);
  } catch (err) {
    console.error('[PDF] Reshaping error:', err);
    return text;
  }
}

// ─── Font loading (Amiri via CDN) ─────────────────────────────────────────────
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

async function loadArabicFont(doc) {
  try {
    // Amiri TTF is better for jsPDF embedding
    const url = 'https://cdn.jsdelivr.net/npm/@fontsource/amiri@5.0.8/files/amiri-arabic-400-normal.ttf';
    const res  = await fetch(url);
    if (!res.ok) throw new Error('Font fetch failed');
    const buf  = await res.arrayBuffer();
    const b64  = arrayBufferToBase64(buf);
    
    doc.addFileToVFS('Amiri-Regular.ttf', b64);
    doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
    return true;
  } catch (err) {
    console.warn('[PDF] Arabic font load failed:', err.message);
    return false;
  }
}

// ─── Drawing helpers ──────────────────────────────────────────────────────────
function setFill(doc, rgb)   { doc.setFillColor(...rgb); }
function setDraw(doc, rgb)   { doc.setDrawColor(...rgb); }
function setTxt(doc, rgb)    { doc.setTextColor(...rgb); }

function hrule(doc, x, y, w, color = COLORS.gold, lw = 0.3) {
  setDraw(doc, color);
  doc.setLineWidth(lw);
  doc.line(x, y, x + w, y);
}

function sectionLabel(doc, text, x, y) {
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  setTxt(doc, COLORS.teal);
  doc.text(text, x, y);
  return y + 3.5;
}

// Page header & footer drawn on every page
function decoratePage(doc, pageNum) {
  setFill(doc, COLORS.darkGreen);
  doc.rect(0, 0, PAGE.W, 9, 'F');
  setFill(doc, COLORS.gold);
  doc.rect(0, 9, PAGE.W, 1.2, 'F');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  setTxt(doc, COLORS.white);
  doc.text('IslamicNames Database', MARGIN, 6);
  doc.setFont('helvetica', 'normal');
  doc.text(`Page ${pageNum}`, PAGE.W - MARGIN, 6, { align: 'right' });

  setFill(doc, COLORS.darkGreen);
  doc.rect(0, PAGE.H - 8, PAGE.W, 8, 'F');
  setFill(doc, COLORS.gold);
  doc.rect(0, PAGE.H - 8.8, PAGE.W, 0.8, 'F');
  doc.setFontSize(7.5);
  setTxt(doc, COLORS.white);
  doc.text('My Favourite Names', PAGE.W / 2, PAGE.H - 3.5, { align: 'center' });
}

// ─── Cover page ───────────────────────────────────────────────────────────────
function buildCover(doc, totalCount, arabicEnabled) {
  setFill(doc, COLORS.darkGreen);
  doc.rect(0, 0, PAGE.W, PAGE.H, 'F');
  setFill(doc, COLORS.gold);
  doc.rect(0, PAGE.H / 2 - 55, PAGE.W, 3, 'F');
  doc.rect(0, PAGE.H / 2 + 30, PAGE.W, 3, 'F');

  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  setTxt(doc, COLORS.white);
  doc.text('IslamicNames', PAGE.W / 2, PAGE.H / 2 - 28, { align: 'center' });

  doc.setFontSize(28);
  setTxt(doc, COLORS.gold);
  doc.text('Database', PAGE.W / 2, PAGE.H / 2 - 14, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  setTxt(doc, [200, 200, 200]);
  doc.text('My Favourite Names Collection', PAGE.W / 2, PAGE.H / 2 + 4, { align: 'center' });

  if (arabicEnabled) {
    doc.setFont('Amiri', 'normal');
    doc.setFontSize(16);
    setTxt(doc, COLORS.gold);
    doc.text(shapeArabic('قاعدة بيانات نور للأسماء'),
             PAGE.W / 2, PAGE.H / 2 + 14, { align: 'center' });
  }

  const bx = PAGE.W / 2 - 40, by = PAGE.H / 2 + 22;
  setFill(doc, [20, 50, 38]);
  doc.roundedRect(bx, by, 80, 16, 2, 2, 'F');
  setDraw(doc, COLORS.gold);
  doc.setLineWidth(0.5);
  doc.roundedRect(bx, by, 80, 16, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  setTxt(doc, COLORS.gold);
  doc.text(String(totalCount), PAGE.W / 2, by + 8, { align: 'center' });
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  setTxt(doc, [200, 200, 200]);
  doc.text('Saved Names', PAGE.W / 2, by + 13, { align: 'center' });

  doc.setFontSize(8);
  setTxt(doc, [150, 150, 150]);
  const today = new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
  doc.text(`Generated on ${today}`, PAGE.W / 2, PAGE.H - 20, { align: 'center' });
}

// ─── Single name card ─────────────────────────────────────────────────────────
function drawNameCard(doc, name, cardX, startY, arabicEnabled) {
  const x     = cardX;
  const ix    = x + PAD;           // inner content X
  const iw    = INNER;             // inner content width
  let   y     = startY;

  // Card header (dark green accent bar)
  setFill(doc, COLORS.darkGreen);
  doc.rect(x, y, CARD_W, 4, 'F');
  y += 4;

  const bodyStartY = y;
  y += PAD;

  // Name header: English & Arabic on the same baseline
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  setTxt(doc, COLORS.darkGreen);
  doc.text(name.nameEnglish || '', ix, y + 6);

  if (arabicEnabled && name.nameArabic) {
    doc.setFont('Amiri', 'normal');
    doc.setFontSize(18);
    setTxt(doc, COLORS.gold);
    doc.text(shapeArabic(name.nameArabic), ix + iw, y + 6, { align: 'right' });
    // Switch back to Helvetica for subsequent English text
    doc.setFont('helvetica', 'normal');
  }
  y += 9;

  // Pronunciation
  if (name.pronunciation) {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'italic');
    setTxt(doc, COLORS.midGray);
    doc.text(`/${name.pronunciation}/`, ix, y);
    y += 5;
  } else {
    y += 2;
  }

  // Meta row: gender | origin | plan badge
  const gender = (name.gender || 'Unknown').toLowerCase();
  const isGirl = gender === 'girl';
  const badgeColor = isGirl ? COLORS.girl : COLORS.boy;
  const genderText = isGirl ? 'Female' : 'Male';

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  setTxt(doc, badgeColor);
  doc.text(genderText, ix, y);

  if (name.origin) {
    doc.setFont('helvetica', 'normal');
    setTxt(doc, COLORS.midGray);
    doc.text(`Origin: ${name.origin}`, ix + 18, y);
  }

  // Plan badge
  const planLbl = name.isPremium ? '★ PRO' : 'FREE';
  const planColor = name.isPremium ? COLORS.darkGreen : COLORS.teal;
  const badgeW = 16, badgeH = 5;
  const bx = ix + iw - badgeW;
  setFill(doc, planColor);
  doc.roundedRect(bx, y - 4, badgeW, badgeH, 1, 1, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  setTxt(doc, COLORS.white);
  doc.text(planLbl, bx + badgeW / 2, y - 0.5, { align: 'center' });
  y += 6;

  hrule(doc, ix, y, iw, COLORS.gold, 0.6);
  y += 5;

  // Meaning
  if (name.meaning) {
    y = sectionLabel(doc, 'MEANING', ix, y);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bolditalic');
    setTxt(doc, COLORS.darkText);
    const lines = doc.splitTextToSize(`"${name.meaning}"`, iw);
    doc.text(lines, ix, y);
    y += lines.length * 5 + 3;
  }

  // Quranic reference
  const quran = name.quranReference || {};
  if (name.isQuranic && quran.surah) {
    hrule(doc, ix, y, iw, COLORS.lightGold, 0.3);
    y += 4;
    y = sectionLabel(doc, 'QURANIC REFERENCE', ix, y);
    const refStr = `Surah ${quran.surah}${quran.verse ? ` — Ayah ${quran.verse}` : ''}`;
    
    // Estimate box height for Arabic text
    let arabicLines = [];
    if (arabicEnabled && quran.text) {
      doc.setFont('Amiri', 'normal');
      doc.setFontSize(11);
      arabicLines = doc.splitTextToSize(shapeArabic(quran.text), iw - 8);
    }
    const boxH = Math.max(10, 8 + (arabicLines.length * 6));
    
    setFill(doc, COLORS.lightGreen);
    doc.rect(ix, y, iw, boxH, 'F');
    setFill(doc, COLORS.darkGreen);
    doc.rect(ix + iw - 2.5, y, 2.5, boxH, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    setTxt(doc, COLORS.teal);
    doc.text(refStr, ix + 3, y + 5);

    if (arabicLines.length > 0) {
      doc.setFont('Amiri', 'normal');
      doc.setFontSize(11);
      setTxt(doc, COLORS.darkGreen);
      doc.text(arabicLines, ix + iw - 5, y + 12, { align: 'right' });
    }
    
    doc.setFont('helvetica', 'normal');
    y += boxH + 4;
  }

  // Historical bearers
  const holders = name.famousPersonalities || [];
  if (holders.length > 0) {
    hrule(doc, ix, y, iw, COLORS.lightGold, 0.3);
    y += 4;
    y = sectionLabel(doc, 'NOTABLE HISTORICAL BEARERS', ix, y);
    
    holders.slice(0, 3).forEach((p, idx) => {
      const pName = p.name || 'Unknown';
      const pDesc = p.description || '';
      const dLines = doc.splitTextToSize(pDesc, iw - 12);
      const rowH = 10 + (Math.min(dLines.length, 2) * 4);
      
      const rowBg = idx % 2 === 0 ? COLORS.cream : COLORS.lightTeal;
      setFill(doc, rowBg);
      doc.rect(ix, y, iw, rowH, 'F');

      setFill(doc, COLORS.lightGold);
      doc.circle(ix + 4, y + 5, 3.5, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      setTxt(doc, COLORS.gold);
      doc.text(String(idx + 1), ix + 4, y + 6.5, { align: 'center' });

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      setTxt(doc, COLORS.darkText);
      doc.text(pName, ix + 10, y + 5);

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.text(dLines.slice(0, 2), ix + 10, y + 9);
      
      y += rowH + 1.5;
    });
    y += 2;
  }

  // Birth guidance
  if (name.birthGuidance) {
    hrule(doc, ix, y, iw, COLORS.lightGold, 0.3);
    y += 4;
    y = sectionLabel(doc, 'BIRTH GUIDANCE', ix, y);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    setTxt(doc, COLORS.darkText);
    const bLines = doc.splitTextToSize(name.birthGuidance, iw);
    doc.text(bLines, ix, y);
    y += bLines.length * 4 + 3;
  }

  y += PAD;
  setDraw(doc, COLORS.border);
  doc.setLineWidth(0.4);
  doc.rect(x, bodyStartY, CARD_W, y - bodyStartY, 'S');

  return y + 8;
}

export const exportFavoritesToPDF = async (favorites) => {
  if (!favorites || favorites.length === 0) return;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const arabicEnabled = await loadArabicFont(doc);
  buildCover(doc, favorites.length, arabicEnabled);

  let pageNum = 1;
  const CONTENT_TOP = 13, CONTENT_BOTTOM = PAGE.H - 11;
  doc.addPage();
  pageNum++;
  decoratePage(doc, pageNum);
  let currentY = CONTENT_TOP + 3;

  for (const name of favorites) {
    const estH = 70 + (name.famousPersonalities?.length ? 30 : 0);
    if (currentY + estH > CONTENT_BOTTOM) {
      doc.addPage();
      pageNum++;
      decoratePage(doc, pageNum);
      currentY = CONTENT_TOP + 3;
    }
    currentY = drawNameCard(doc, name, MARGIN, currentY, arabicEnabled);
  }

  doc.save(`Islamic_Names_Database_${new Date().toISOString().slice(0, 10)}.pdf`);
};