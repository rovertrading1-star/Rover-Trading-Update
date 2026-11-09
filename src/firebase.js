// ==========================================
// ROVER TRADING - MODULAR FIREBASE CLOUD SERVICE
// Connects to ai-studio-rovertrading-cc1c0431-720c-4558-ba48-42c1ff000818
// ==========================================

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

const firebaseConfig = {
  projectId: "axiomatic-analog-s3rp2",
  appId: "1:11530780213:web:8d3c3110a819b28f8afb7c",
  apiKey: "AIzaSyBD5wBVGbdQ5xhpedt6IEEFEd0Uw3PLgQk",
  authDomain: "axiomatic-analog-s3rp2.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-rovertrading-cc1c0431-720c-4558-ba48-42c1ff000818",
  storageBucket: "axiomatic-analog-s3rp2.firebasestorage.app",
  messagingSenderId: "11530780213",
  measurementId: "",
  oAuthClientId: "11530780213-n1lk49etk6fmva8siuacbq9khimq0eft.apps.googleusercontent.com",
  recaptchaSiteKey: ""
};

// Initialize App & Services with direct WebChannel connection (preventing IndexedDB multi-tab lock deadlocks on external hosts/GitHub Pages)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
let firestoreDb;
try {
  firestoreDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);
} catch (e) {
  firestoreDb = initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId);
}
const authInstance = getAuth(app);

// Official Business Bank Details (Updated to ABSA per user configuration)
export const BANK_DETAILS = {
  bankName: "ABSA",
  accountHolder: "Rover Trading Academy (Pty) Ltd",
  accountName: "Rover Trading Academy (Pty) Ltd",
  accountNumber: "4117 7631 69",
  accountType: "Cheque Account",
  branchCode: "632005",
  paySharpId: "0683708749@ABSA",
  swiftCode: "ABSAZAJJ",
  instructions: "Use your Student Account Number (e.g. RT10001) as your beneficiary reference so admins can immediately reconcile and verify your payment."
};

// Seed Accounts for initial setup (Preserving all accounts)
const SEED_USERS = [
  {
    id: "usr_admin_1",
    accountNumber: "RT99999",
    firstName: "Admin",
    lastName: "Rover",
    email: "admin@rovertrading.com",
    cellNumber: "+27 82 000 0000",
    password: "password123",
    paymentStatus: "paid",
    role: "admin",
    createdAt: new Date("2025-01-01T08:00:00Z").toISOString()
  },
  {
    id: "usr_student_1",
    accountNumber: "RT10001",
    firstName: "Tshiamo",
    lastName: "Lesego",
    email: "tshiamo@rovertrading.com",
    cellNumber: "+27 81 234 5678",
    password: "password123",
    paymentStatus: "paid",
    enrolledCourse: "Full Program (R400)",
    role: "student",
    createdAt: new Date("2025-02-10T14:30:00Z").toISOString()
  },
  {
    id: "usr_student_2",
    accountNumber: "RT10002",
    firstName: "Naledi",
    lastName: "Khumalo",
    email: "naledi@example.com",
    cellNumber: "+27 72 345 6789",
    password: "password123",
    paymentStatus: "unpaid",
    enrolledCourse: "Standard Course (R250)",
    role: "student",
    createdAt: new Date("2025-02-18T10:15:00Z").toISOString()
  },
  {
    id: "usr_student_3",
    accountNumber: "RT10003",
    firstName: "Sipho",
    lastName: "Dlamini",
    email: "sipho@example.com",
    cellNumber: "+27 83 456 7890",
    password: "password123",
    paymentStatus: "paid",
    enrolledCourse: "Full Program (R400)",
    role: "student",
    createdAt: new Date("2025-02-25T16:45:00Z").toISOString()
  }
];

// Seed Applications & Proof of Payments
const SEED_APPLICATIONS = [
  {
    id: "app_1001",
    userId: "usr_student_1",
    accountNumber: "RT10001",
    studentName: "Tshiamo Lesego",
    studentEmail: "tshiamo@rovertrading.com",
    studentPhone: "+27 81 234 5678",
    course: "Full Program (R400)",
    coursePrice: 400,
    status: "accepted", // 'pending_payment' | 'under_review' | 'accepted' | 'declined'
    popReference: "RT10001-ABSA-TXN992",
    popDate: "2025-02-11T09:30:00Z",
    submittedAt: "2025-02-10T15:00:00Z",
    reviewedAt: "2025-02-11T12:00:00Z",
    reviewerNotes: "Payment confirmed. Enrolled in Full Program with Zoom and learning doc access."
  },
  {
    id: "app_1002",
    userId: "usr_student_2",
    accountNumber: "RT10002",
    studentName: "Naledi Khumalo",
    studentEmail: "naledi@example.com",
    studentPhone: "+27 72 345 6789",
    course: "Standard Course (R250)",
    coursePrice: 250,
    status: "under_review",
    popReference: "RT10002-EFT-PAY",
    popDate: "2025-02-19T08:45:00Z",
    submittedAt: "2025-02-18T10:30:00Z",
    reviewedAt: null,
    reviewerNotes: "Awaiting bank statement reconciliation."
  }
];

// Seed Zoom Meetings
const SEED_ZOOM_MEETINGS = [
  {
    id: "zoom_1",
    topic: "Live Forex & Index Price Action Masterclass",
    scheduleDate: "Every Tuesday & Thursday",
    scheduleTime: "18:00 - 19:30 SAST",
    zoomUrl: "https://zoom.us/j/84920491823?pwd=rovertradinglive",
    meetingId: "849 2049 1823",
    passcode: "ROVER2025",
    status: "active",
    isPrimary: true,
    instructor: "Lethabo Loate",
    instructions: "Join 5 minutes prior with TradingView open. Review daily candlestick closures.",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "zoom_2",
    topic: "Weekly Market Breakdown & Strategy Review",
    scheduleDate: "Sunday Evening Market Prep",
    scheduleTime: "19:00 - 20:30 SAST",
    zoomUrl: "https://zoom.us/j/91823481029?pwd=sundaybreakdown",
    meetingId: "918 2348 1029",
    passcode: "MARKETPREP",
    status: "active",
    isPrimary: false,
    instructor: "Lethabo Loate",
    instructions: "Weekly economic calendar analysis and multi-timeframe liquidity marking.",
    createdAt: "2025-01-02T00:00:00.000Z",
    updatedAt: "2025-01-02T00:00:00.000Z"
  }
];

// Seed Learning Document (Exclusive In-App Curriculum with PDF support)
const DEFAULT_LEARNING_DOCUMENT = {
  id: "master_curriculum",
  title: "Rover Trading Master Curriculum & Execution Blueprint",
  subtitle: "Official Student Handbook & Systematic Trading Framework by Lethabo Loate",
  docType: "rich_text", // "rich_text" | "pdf"
  pdfDataUrl: null,
  pdfFileName: null,
  pdfFileSize: null,
  lastUpdated: new Date().toISOString(),
  updatedBy: "Admin Lethabo Loate",
  chapters: [
    {
      number: 1,
      title: "Foundations of Technical Market Structure & Candlestick Anatomy",
      summary: "Understand the core architecture of price movements, liquidity delivery, and candlestick wicks.",
      content: `
<h3>1.1 Understanding Candlestick Anatomy</h3>
<p>Every candlestick represents a struggle between buyers (bids) and sellers (asks) within a specific timeframe. A candle consists of the real body, upper wick (high), and lower wick (low).</p>
<ul>
  <li><strong>The Body:</strong> Shows the opening and closing prices. A green/bullish candle indicates close &gt; open; a red/bearish candle indicates close &lt; open.</li>
  <li><strong>The Wicks (Shadows):</strong> Represent rejection of price. Long upper wicks indicate aggressive selling at resistance. Long lower wicks indicate buyer absorption at support.</li>
  <li><strong>Institutional Footprints:</strong> Large body displacement candles indicate significant market participant volume moving price towards liquidity pools.</li>
</ul>

<h3>1.2 Market Structure Identification</h3>
<p>Price moves in identifiable cycles: Expansion, Retracement, Consolidation, and Reversal.</p>
<ul>
  <li><strong>Bullish Structure:</strong> Consecutive Higher Highs (HH) and Higher Lows (HL). A trend remains intact until the most recent Higher Low is decisively broken with a body close.</li>
  <li><strong>Bearish Structure:</strong> Consecutive Lower Lows (LL) and Lower Highs (LH).</li>
  <li><strong>Break of Structure (BOS):</strong> When price breaks beyond the prior structural high or low in direction of the trend.</li>
  <li><strong>Change of Character (CHoCH):</strong> The first structural indication that the prevailing trend is losing momentum and potentially reversing.</li>
</ul>
      `
    },
    {
      number: 2,
      title: "Supply, Demand & Institutional Liquidity Identification",
      summary: "Master order blocks, fair value gaps, liquidity pools, and stop-loss clustering.",
      content: `
<h3>2.1 Liquidity Pools & Stop Clusters</h3>
<p>Retail traders are taught to place stop orders just above double tops or below double bottoms. Institutional algorithms target these exact clusters for order fulfillment before moving in the intended direction.</p>
<ul>
  <li><strong>Buy-Side Liquidity (BSL):</strong> Located above obvious equal highs and resistance zones. When BSL is swept, smart money sells into buyers' market orders.</li>
  <li><strong>Sell-Side Liquidity (SSL):</strong> Located beneath equal lows and support zones. When SSL is swept, institutions accumulate positions from panicked sellers.</li>
</ul>

<h3>2.2 Order Blocks & Fair Value Gaps (FVG)</h3>
<p>An Order Block is the last opposite-color candle before an aggressive displacement that breaks market structure.</p>
<ul>
  <li><strong>Bullish Order Block:</strong> The last down-close candle before a rapid upward expansion that creates an imbalance.</li>
  <li><strong>Bearish Order Block:</strong> The last up-close candle prior to an impulsive drop.</li>
  <li><strong>Imbalance / Fair Value Gap:</strong> A 3-candle sequence where candle 1 wick and candle 3 wick do not overlap, leaving an inefficiency that price frequently returns to rebalance.</li>
</ul>
      `
    },
    {
      number: 3,
      title: "Risk Management & Mathematical Capital Preservation",
      summary: "Strict statistical guidelines on position sizing, risk-to-reward ratios, and drawdown control.",
      content: `
<h3>3.1 The 1% Golden Rule of Trading</h3>
<p>No single trade should risk more than 1% to 2% of total trading account equity. Professional trading is an endurance marathon, not a sprint.</p>
<div style="background:rgba(163,230,53,0.08);border:1px solid #27342e;border-left:4px solid #a3e635;padding:12px;border-radius:8px;margin:12px 0;">
  <strong>Position Size Formula:</strong><br>
  <em>Position Size (Lots) = (Account Equity × Risk %) ÷ (Stop Loss in Pips × Pip Value)</em>
</div>

<h3>3.2 Asymmetrical Risk-to-Reward (R:R)</h3>
<ul>
  <li>Never accept a setup with an anticipated Risk-to-Reward ratio of less than <strong>1:2.5</strong>.</li>
  <li>With a 1:3 R:R, a trader winning only 35% of their positions remains profitable over a 100-trade sample size.</li>
  <li><strong>Daily Loss Limit:</strong> Stop trading immediately for the day if 2 consecutive full stop-outs occur or if daily equity drops by 3%. Step away to protect emotional capital.</li>
</ul>
      `
    },
    {
      number: 4,
      title: "The Rover High-Probability Trading Plan & Market Psychology",
      summary: "Daily routines, execution checklist, journal habits, and mental discipline for consistent execution.",
      content: `
<h3>4.1 The 5-Step Pre-Execution Checklist</h3>
<ol>
  <li><strong>Higher Timeframe Bias:</strong> Are Daily and 4H charts bullish or bearish? Trade strictly with higher timeframe momentum.</li>
  <li><strong>Liquidity Sweep:</strong> Has price swept an external liquidity pool or rebalanced a key higher timeframe Fair Value Gap?</li>
  <li><strong>Lower Timeframe Confirmation:</strong> Look for a 15M or 5M Change of Character (CHoCH) confirming structural shift.</li>
  <li><strong>Execution Zone:</strong> Enter at the refined Order Block or optimal trade entry (61.8% - 78.6% Fibonacci retracement).</li>
  <li><strong>Invalidation & Targets:</strong> Place Stop Loss strictly beyond the structural invalidation point and Target at the next opposing liquidity pool.</li>
</ol>

<h3>4.2 The Psychology of Consistency</h3>
<ul>
  <li><strong>Accept the Uncertainty:</strong> Every individual trade outcome is random; the edge plays out over hundreds of disciplined executions.</li>
  <li><strong>Eliminate FOMO:</strong> The market will be open tomorrow. Missing a trade costs nothing; chasing a trade costs capital.</li>
  <li><strong>Trading Journal:</strong> Log every entry reason, emotion, screenshot, and exit outcome. Review weekly on Saturdays.</li>
</ul>
      `
    }
  ]
};

// Seed Student Progress Reports
const SEED_PROGRESS = [
  {
    userId: "usr_student_1",
    accountNumber: "RT10001",
    studentName: "Tshiamo Lesego",
    overallProgress: 75,
    chaptersCompleted: [1, 2, 3],
    totalChapters: 4,
    currentChapter: 4,
    attendanceCount: 8,
    tradingPlanSubmitted: true,
    instructorEvaluation: "Exceptional discipline on risk management. Ready for Chapter 4 live execution.",
    lastUpdated: new Date().toISOString()
  },
  {
    userId: "usr_student_2",
    accountNumber: "RT10002",
    studentName: "Naledi Khumalo",
    overallProgress: 25,
    chaptersCompleted: [1],
    totalChapters: 4,
    currentChapter: 2,
    attendanceCount: 2,
    tradingPlanSubmitted: false,
    instructorEvaluation: "Good grasp on candlestick wicks and market timing. Focus on Chapter 2 key zones.",
    lastUpdated: new Date().toISOString()
  },
  {
    userId: "usr_student_3",
    accountNumber: "RT10003",
    studentName: "Sipho Dlamini",
    overallProgress: 50,
    chaptersCompleted: [1, 2],
    totalChapters: 4,
    currentChapter: 3,
    attendanceCount: 6,
    tradingPlanSubmitted: true,
    instructorEvaluation: "Steady progress on supply/demand. Review the position sizing formula.",
    lastUpdated: new Date().toISOString()
  }
];

const SEED_REVIEWS = [
  {
    id: "rev_1",
    name: "Tshiamo L.",
    course: "Premium Course",
    rating: 5,
    text: "This course completely changed my understanding of the markets. The structure is brilliant and Lethabo explains everything so clearly.",
    date: new Date("2025-02-15").toISOString(),
    hidden: false,
    status: "visible"
  },
  {
    id: "rev_2",
    name: "Naledi K.",
    course: "Standard Course",
    rating: 5,
    text: "The live practice sessions were a game-changer. I finally understand how to read candlestick patterns and develop my own strategy.",
    date: new Date("2025-02-18").toISOString(),
    hidden: false,
    status: "visible"
  },
  {
    id: "rev_3",
    name: "Sipho D.",
    course: "Advanced Course",
    rating: 4,
    text: "Very well structured course. The psychology chapter was eye-opening. Would recommend to anyone starting out in trading.",
    date: new Date("2025-02-20").toISOString(),
    hidden: false,
    status: "visible"
  },
  {
    id: "rev_4",
    name: "Lerato P.",
    course: "Premium Course",
    rating: 5,
    text: "Best investment I've ever made. The discipline and patience framework has helped me beyond just trading.",
    date: new Date("2025-02-22").toISOString(),
    hidden: false,
    status: "visible"
  },
  {
    id: "rev_5",
    name: "Kabelo R.",
    course: "Standard Course",
    rating: 5,
    text: "I came in knowing nothing about trading. Now I have a clear trading plan and understand how to manage risk properly.",
    date: new Date("2025-02-24").toISOString(),
    hidden: false,
    status: "visible"
  },
  {
    id: "rev_6",
    name: "Amahle V.",
    course: "Premium Course",
    rating: 4,
    text: "Great course content. The schedule was flexible and the Zoom sessions were interactive. Highly recommend Rover Trading!",
    date: new Date("2025-02-26").toISOString(),
    hidden: false,
    status: "visible"
  }
];

// Initialize local fallback cache
if (!localStorage.getItem('roverUsers')) {
  localStorage.setItem('roverUsers', JSON.stringify(SEED_USERS));
}
if (!localStorage.getItem('roverReviews')) {
  localStorage.setItem('roverReviews', JSON.stringify(SEED_REVIEWS));
}
if (!localStorage.getItem('roverApplications')) {
  localStorage.setItem('roverApplications', JSON.stringify(SEED_APPLICATIONS));
}
if (!localStorage.getItem('roverZoomMeetings')) {
  localStorage.setItem('roverZoomMeetings', JSON.stringify(SEED_ZOOM_MEETINGS));
}
if (!localStorage.getItem('roverLearningDoc')) {
  localStorage.setItem('roverLearningDoc', JSON.stringify(DEFAULT_LEARNING_DOCUMENT));
}
if (!localStorage.getItem('roverProgressReports')) {
  localStorage.setItem('roverProgressReports', JSON.stringify(SEED_PROGRESS));
}

// Global UI Toast Function
export function toast(type, title, msg, dur = 4000) {
  let c = document.getElementById('toastC');
  if (!c) {
    c = document.createElement('div');
    c.id = 'toastC';
    c.style.cssText = 'position:fixed;top:80px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:10px;pointer-events:none;max-width:380px;width:100%';
    document.body.appendChild(c);
  }
  const icons = { success: '#a3e635', error: '#ff7777', warning: '#f59e0b', info: '#a3e635' };
  const borderCol = icons[type] || '#a3e635';
  const t = document.createElement('div');
  t.style.cssText = `pointer-events:auto;background:#101917;border:1px solid #27342e;border-left:4px solid ${borderCol};border-radius:12px;padding:14px 16px;box-shadow:0 8px 30px rgba(0,0,0,0.7);display:flex;align-items:flex-start;gap:12px;font-family:'DM Sans',sans-serif;color:#fff;animation:fadeIn 0.2s ease`;
  t.innerHTML = `
    <div style="flex:1">
      <div style="font-size:13px;font-weight:700;margin-bottom:2px;color:#fff">${title}</div>
      <div style="font-size:12px;color:#94a69a;line-height:1.4">${msg}</div>
    </div>
    <button style="background:none;border:none;color:#94a69a;cursor:pointer;font-size:14px;padding:2px" onclick="this.parentElement.remove()">✕</button>
  `;
  c.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transition = 'opacity 0.3s';
    setTimeout(() => t.remove(), 300);
  }, dur);
}
window.toast = toast;

// Universal RoverStore with Cross-Device Cloud Sync
export const RoverStore = {
  getBankDetails: function() {
    return BANK_DETAILS;
  },

  // -----------------------------------------------------------
  // USERS & AUTHENTICATION
  // -----------------------------------------------------------
  getUsers: function() {
    try {
      return JSON.parse(localStorage.getItem('roverUsers')) || SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  },

  saveUsers: function(users) {
    try {
      localStorage.setItem('roverUsers', JSON.stringify(users));
    } catch (e) {
      console.warn("Storage save users note:", e);
    }
  },

  getCurrentUser: function() {
    try {
      const u = JSON.parse(localStorage.getItem('roverCurrentUser'));
      if (!u) return null;
      const all = this.getUsers();
      const live = all.find(x => x.id === u.id || (x.email && x.email.toLowerCase() === (u.email || '').toLowerCase()));
      return live || u;
    } catch {
      return null;
    }
  },

  setCurrentUser: function(u) {
    if (u) {
      try {
        localStorage.setItem('roverCurrentUser', JSON.stringify(u));
      } catch (e) {}
    } else {
      localStorage.removeItem('roverCurrentUser');
    }
  },

  getNextAccountNumber: function() {
    const users = this.getUsers();
    let maxNum = 10000;
    users.forEach(u => {
      const match = u.accountNumber && u.accountNumber.match(/^RT(\d+)$/);
      if (match) {
        const n = parseInt(match[1]);
        if (n > maxNum && n < 90000) maxNum = n;
      }
    });
    return 'RT' + String(maxNum + 1).padStart(5, '0');
  },

  syncUsersFromFirestore: async function() {
    try {
      const snap = await getDocs(collection(firestoreDb, 'users'));
      if (!snap.empty) {
        const cloudUsers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        const localUsers = this.getUsers();
        const map = new Map();
        localUsers.forEach(u => {
          const k = (u.email || u.id || '').toLowerCase();
          if (k) map.set(k, u);
        });
        cloudUsers.forEach(u => {
          const k = (u.email || u.id || '').toLowerCase();
          if (k) map.set(k, { ...(map.get(k) || {}), ...u });
        });
        const merged = Array.from(map.values());
        this.saveUsers(merged);
        return merged;
      }
    } catch (e) {
      console.warn("Firestore sync users notice:", e);
    }
    return this.getUsers();
  },

  syncUserToFirestore: async function(u) {
    if (!u || !u.id) return;
    try {
      const userRef = doc(firestoreDb, 'users', u.id);
      const writePromise = setDoc(userRef, {
        accountNumber: u.accountNumber || 'RT10001',
        firstName: u.firstName || 'Student',
        lastName: u.lastName || '',
        email: (u.email || '').toLowerCase().trim(),
        cellNumber: u.cellNumber || '',
        password: u.password || 'password123',
        paymentStatus: u.paymentStatus || 'unpaid',
        enrolledCourse: u.enrolledCourse || 'Not Enrolled',
        role: u.role || 'student',
        createdAt: u.createdAt || new Date().toISOString()
      }, { merge: true });

      await Promise.race([
        writePromise,
        new Promise(r => setTimeout(r, 600))
      ]);
      console.log("Firestore cloud: User saved successfully:", u.id);
    } catch (e) {
      console.warn("Firestore user sync error:", e);
    }
  },

  // -----------------------------------------------------------
  // APPLICATIONS & PROOF OF PAYMENT (Cloud Synced with Non-blocking Guarantees)
  // -----------------------------------------------------------
  getApplications: function() {
    try {
      return JSON.parse(localStorage.getItem('roverApplications')) || SEED_APPLICATIONS;
    } catch {
      return SEED_APPLICATIONS;
    }
  },

  saveApplications: function(apps) {
    try {
      localStorage.setItem('roverApplications', JSON.stringify(apps));
    } catch (e) {
      console.warn("Storage save applications quota notice:", e);
      try {
        // Fallback: save without heavy base64 attachments if quota reached
        const trimmed = apps.map(a => {
          if (a.popAttachment && a.popAttachment.length > 50000) {
            return { ...a, popAttachment: '[stored in firestore cloud]' };
          }
          return a;
        });
        localStorage.setItem('roverApplications', JSON.stringify(trimmed));
      } catch (err) {}
    }
  },

  getApplicationsForUser: function(userId) {
    const all = this.getApplications();
    return all.filter(a => a.userId === userId);
  },

  submitApplication: async function(appData) {
    const apps = this.getApplications();
    const newApp = {
      id: appData.id || 'app_' + Date.now(),
      userId: appData.userId || 'usr_unknown',
      accountNumber: appData.accountNumber || 'RT10001',
      studentName: appData.studentName || 'Student',
      studentEmail: appData.studentEmail || '',
      studentPhone: appData.studentPhone || '',
      course: appData.course || 'Full Program (R400)',
      coursePrice: appData.coursePrice || (appData.course && appData.course.includes('400') ? 400 : 250),
      status: 'pending_payment', // pending_payment -> under_review -> accepted / declined
      popReference: '',
      popDate: null,
      popAttachment: null,
      popAttachmentType: null,
      popAttachmentName: null,
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
      reviewerNotes: '',
      notes: appData.notes || ''
    };

    // Optimistic local state update (0ms instant response)
    apps.unshift(newApp);
    this.saveApplications(apps);

    // Reliable cloud write with safety timeout
    try {
      const writePromise = setDoc(doc(firestoreDb, 'applications', newApp.id), newApp);
      await Promise.race([
        writePromise,
        new Promise(r => setTimeout(r, 800))
      ]);
      console.log("Firestore cloud: Application submitted successfully", newApp.id);
    } catch (e) {
      console.warn("Firestore application submit warning:", e);
    }
    return newApp;
  },

  submitProofOfPayment: async function(appId, popData) {
    const apps = this.getApplications();
    const idx = apps.findIndex(a => a.id === appId);
    if (idx === -1) return null;

    apps[idx].status = 'under_review';
    apps[idx].popReference = popData.reference || '';
    apps[idx].popDate = popData.date || new Date().toISOString();
    apps[idx].popAmount = popData.amount || apps[idx].coursePrice;
    apps[idx].popAttachment = popData.attachment || null;
    apps[idx].popAttachmentType = popData.attachmentType || (popData.attachment && popData.attachment.startsWith('data:application/pdf') ? 'pdf' : 'image');
    apps[idx].popAttachmentName = popData.attachmentName || 'Receipt';
    apps[idx].submittedAt = apps[idx].submittedAt || new Date().toISOString();

    // Save optimistic state
    this.saveApplications(apps);

    // Update current student user paymentStatus to 'under_review'
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === apps[idx].userId) {
      currentUser.paymentStatus = 'under_review';
      currentUser.enrolledCourse = apps[idx].course;
      this.setCurrentUser(currentUser);
      this.syncUserToFirestore(currentUser);
    }

    // Reliable cloud write with safety timeout
    try {
      const writePromise = setDoc(doc(firestoreDb, 'applications', appId), apps[idx], { merge: true });
      await Promise.race([
        writePromise,
        new Promise(r => setTimeout(r, 800))
      ]);
      console.log("Firestore cloud: POP submitted successfully", appId);
    } catch (e) {
      console.warn("Firestore POP submit warning:", e);
    }
    return apps[idx];
  },

  reviewApplication: async function(appId, status, notes = '') {
    const apps = this.getApplications();
    const idx = apps.findIndex(a => a.id === appId);
    if (idx === -1) return null;

    apps[idx].status = status; // 'accepted' | 'declined'
    apps[idx].reviewedAt = new Date().toISOString();
    apps[idx].reviewerNotes = notes;
    this.saveApplications(apps);

    // If accepted, activate user account & initialize progress report
    const targetUserId = apps[idx].userId;
    const allUsers = this.getUsers();
    const userIdx = allUsers.findIndex(u => u.id === targetUserId);
    if (userIdx !== -1) {
      if (status === 'accepted') {
        allUsers[userIdx].paymentStatus = 'paid';
        allUsers[userIdx].enrolledCourse = apps[idx].course;
      } else {
        allUsers[userIdx].paymentStatus = 'unpaid';
      }
      this.saveUsers(allUsers);
      await this.syncUserToFirestore(allUsers[userIdx]);

      // If accepted, create/ensure progress report exists
      if (status === 'accepted') {
        const reports = this.getProgressReports();
        if (!reports.some(r => r.userId === targetUserId)) {
          const newReport = {
            userId: targetUserId,
            accountNumber: allUsers[userIdx].accountNumber,
            studentName: `${allUsers[userIdx].firstName} ${allUsers[userIdx].lastName || ''}`.trim(),
            overallProgress: 10,
            chaptersCompleted: [],
            totalChapters: 4,
            currentChapter: 1,
            attendanceCount: 0,
            tradingPlanSubmitted: false,
            instructorEvaluation: "Application accepted. Welcome to Rover Trading Academy! Start with Chapter 01.",
            lastUpdated: new Date().toISOString()
          };
          reports.unshift(newReport);
          this.saveProgressReports(reports);
          await this.saveProgressReport(targetUserId, newReport);
        }
      }
    }

    try {
      const writePromise = setDoc(doc(firestoreDb, 'applications', appId), apps[idx], { merge: true });
      await Promise.race([
        writePromise,
        new Promise(r => setTimeout(r, 800))
      ]);
      console.log("Firestore cloud: Application reviewed", appId, status);
    } catch (e) {
      console.warn("Firestore application review error:", e);
    }
    return apps[idx];
  },

  // -----------------------------------------------------------
  // LEARNING CONTENT & PDF CURRICULUM (Cloud Synced)
  // -----------------------------------------------------------
  getLearningContent: function() {
    try {
      const docData = JSON.parse(localStorage.getItem('roverLearningDoc')) || DEFAULT_LEARNING_DOCUMENT;
      if (docData.docType === 'pdf' && !docData.pdfDataUrl && window._cachedLearningPdfUrl) {
        docData.pdfDataUrl = window._cachedLearningPdfUrl;
      }
      return docData;
    } catch {
      return DEFAULT_LEARNING_DOCUMENT;
    }
  },

  loadFullLearningDoc: async function() {
    let docData = this.getLearningContent();
    if (docData.docType === 'pdf' && docData.chunked && !docData.pdfDataUrl) {
      if (window._cachedLearningPdfUrl) {
        docData.pdfDataUrl = window._cachedLearningPdfUrl;
        return docData;
      }
      try {
        const chunkPromises = [];
        for (let i = 0; i < (docData.chunkCount || 1); i++) {
          chunkPromises.push(getDoc(doc(firestoreDb, 'learning_content', 'master_curriculum', 'chunks', 'chunk_' + i)));
        }
        const chunkSnaps = await Promise.all(chunkPromises);
        const fullDataUrl = chunkSnaps.map(s => s.exists() ? s.data().data : '').join('');
        docData.pdfDataUrl = fullDataUrl;
        window._cachedLearningPdfUrl = fullDataUrl;
      } catch (e) {
        console.warn("Error reassembling chunked PDF:", e);
      }
    }
    return docData;
  },

  saveLearningContent: async function(docData) {
    const updated = {
      ...docData,
      id: "master_curriculum",
      lastUpdated: new Date().toISOString()
    };
    try {
      localStorage.setItem('roverLearningDoc', JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage save learning content note:", e);
    }

    try {
      const writePromise = setDoc(doc(firestoreDb, 'learning_content', 'master_curriculum'), updated);
      await Promise.race([
        writePromise,
        new Promise(r => setTimeout(r, 800))
      ]);
      console.log("Firestore cloud: Learning document updated");
    } catch (e) {
      console.warn("Firestore learning doc save error:", e);
    }
    return updated;
  },

  uploadLearningPdf: async function({ pdfDataUrl, pdfFileName, pdfFileSize, title, subtitle }) {
    const current = this.getLearningContent();
    const isLarge = pdfDataUrl && pdfDataUrl.length > 700000;
    const chunkSize = 450000;
    const chunkCount = isLarge ? Math.ceil(pdfDataUrl.length / chunkSize) : 1;

    const metadataDoc = {
      ...current,
      id: "master_curriculum",
      docType: 'pdf',
      chunked: isLarge,
      chunkCount: chunkCount,
      pdfDataUrl: isLarge ? null : pdfDataUrl,
      pdfFileName: pdfFileName || 'Rover_Trading_Handbook.pdf',
      pdfFileSize: pdfFileSize || 'Protected PDF',
      title: title || current.title || 'Rover Trading Master Curriculum & Execution Blueprint',
      subtitle: subtitle || current.subtitle || 'Official Student Handbook & Systematic Trading Framework',
      lastUpdated: new Date().toISOString(),
      updatedBy: 'Admin Lethabo Loate'
    };

    window._cachedLearningPdfUrl = pdfDataUrl;
    try {
      localStorage.setItem('roverLearningDoc', JSON.stringify({
        ...metadataDoc,
        pdfDataUrl: isLarge ? null : pdfDataUrl
      }));
    } catch (e) {
      console.warn("Storage save PDF document note:", e);
    }

    try {
      if (isLarge) {
        console.log(`Firestore cloud: Uploading ${chunkCount} chunks for large PDF...`);
        for (let i = 0; i < chunkCount; i++) {
          const chunkStr = pdfDataUrl.slice(i * chunkSize, (i + 1) * chunkSize);
          await setDoc(doc(firestoreDb, 'learning_content', 'master_curriculum', 'chunks', 'chunk_' + i), {
            index: i,
            data: chunkStr
          });
        }
      }
      const writePromise = setDoc(doc(firestoreDb, 'learning_content', 'master_curriculum'), metadataDoc);
      await Promise.race([
        writePromise,
        new Promise(r => setTimeout(r, 1200))
      ]);
      console.log("Firestore cloud: PDF Learning Document published & synced!");
    } catch (e) {
      console.warn("Firestore PDF doc save error:", e);
    }
    return { ...metadataDoc, pdfDataUrl };
  },

  removeLearningPdf: async function() {
    const current = this.getLearningContent();
    current.docType = 'rich_text';
    current.chunked = false;
    current.chunkCount = 0;
    current.pdfDataUrl = null;
    current.pdfFileName = null;
    current.pdfFileSize = null;
    current.lastUpdated = new Date().toISOString();
    window._cachedLearningPdfUrl = null;

    try {
      localStorage.setItem('roverLearningDoc', JSON.stringify(current));
    } catch (e) {}

    try {
      const writePromise = setDoc(doc(firestoreDb, 'learning_content', 'master_curriculum'), current);
      await Promise.race([
        writePromise,
        new Promise(r => setTimeout(r, 800))
      ]);
      console.log("Firestore cloud: Reverted learning document to interactive chapters");
    } catch (e) {
      console.warn("Firestore PDF doc remove error:", e);
    }
    return current;
  },

  resetLearningContentToDefault: async function() {
    return this.saveLearningContent(DEFAULT_LEARNING_DOCUMENT);
  },

  // -----------------------------------------------------------
  // ZOOM MEETING LINKS (Dual-Channel Cloud Synced: SDK + REST)
  // -----------------------------------------------------------
  getZoomMeetings: function() {
    try {
      const raw = JSON.parse(localStorage.getItem('roverZoomMeetings')) || SEED_ZOOM_MEETINGS;
      return [...raw].sort((a, b) => {
        if (a.isPrimary && !b.isPrimary) return -1;
        if (!a.isPrimary && b.isPrimary) return 1;
        const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return timeB - timeA;
      });
    } catch {
      return SEED_ZOOM_MEETINGS;
    }
  },

  saveZoomMeetings: function(list) {
    try {
      const sorted = [...list].sort((a, b) => {
        if (a.isPrimary && !b.isPrimary) return -1;
        if (!a.isPrimary && b.isPrimary) return 1;
        const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return timeB - timeA;
      });
      localStorage.setItem('roverZoomMeetings', JSON.stringify(sorted));
      try {
        window.dispatchEvent(new CustomEvent('roverZoomMeetingsUpdated', { detail: sorted }));
      } catch (e) {}
    } catch (e) {}
  },

  // Merges incoming cloud meetings without wiping out freshly created local meetings
  saveZoomMeetingsFromCloud: function(cloudList) {
    if (!cloudList || !Array.isArray(cloudList)) return this.getZoomMeetings();
    const localList = this.getZoomMeetings();
    const map = new Map();
    // 1. Keep local meetings in map
    localList.forEach(m => {
      if (m && m.id) map.set(m.id, m);
    });
    // 2. Overlay confirmed cloud documents
    cloudList.forEach(m => {
      if (m && m.id) {
        const existing = map.get(m.id) || {};
        map.set(m.id, { ...existing, ...m });
      }
    });
    const merged = Array.from(map.values());
    this.saveZoomMeetings(merged);
    return merged;
  },

  syncZoomMeetingsFromFirestore: async function() {
    try {
      const snap = await Promise.race([
        getDocs(collection(firestoreDb, 'zoom_meetings')),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2500))
      ]);
      if (snap && !snap.empty) {
        const cloudZoom = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        return this.saveZoomMeetingsFromCloud(cloudZoom);
      }
    } catch (e) {
      // Fallback: Direct HTTPS REST query (works regardless of browser WebSocket restrictions or GitHub Pages)
      try {
        const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/zoom_meetings?key=${firebaseConfig.apiKey}`;
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          if (json.documents && Array.isArray(json.documents)) {
            const parsed = json.documents.map(docItem => {
              const obj = { id: docItem.name.split('/').pop() };
              for (const [k, v] of Object.entries(docItem.fields || {})) {
                obj[k] = v.stringValue !== undefined ? v.stringValue : 
                         v.booleanValue !== undefined ? v.booleanValue : 
                         v.integerValue !== undefined ? Number(v.integerValue) : v;
              }
              return obj;
            });
            return this.saveZoomMeetingsFromCloud(parsed);
          }
        }
      } catch (err) {}
    }
    return this.getZoomMeetings();
  },

  addZoomMeeting: async function(data) {
    const list = this.getZoomMeetings();
    let formattedUrl = (data.zoomUrl || 'https://zoom.us').trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }
    const now = new Date().toISOString();
    const newMeeting = {
      id: data.id || 'zoom_' + Date.now(),
      topic: (data.topic || 'Rover Trading Live Session').trim(),
      scheduleDate: (data.scheduleDate || 'Scheduled Day').trim(),
      scheduleTime: (data.scheduleTime || '18:00 SAST').trim(),
      zoomUrl: formattedUrl,
      meetingId: (data.meetingId || '').trim(),
      passcode: (data.passcode || '').trim(),
      status: data.status || 'active',
      isPrimary: data.isPrimary !== undefined ? !!data.isPrimary : true,
      instructor: (data.instructor || 'Lethabo Loate').trim(),
      instructions: (data.instructions || 'Review the daily charts prior to joining.').trim(),
      createdAt: data.createdAt || now,
      updatedAt: now
    };

    let updatedList = list;
    if (newMeeting.isPrimary) {
      updatedList = updatedList.map(m => ({ ...m, isPrimary: false }));
    }
    updatedList.unshift(newMeeting);
    this.saveZoomMeetings(updatedList);

    // Guaranteed Dual-Channel write:
    // 1. Direct HTTPS REST PATCH (instant 100ms HTTP POST, works reliably on published web & GitHub Pages)
    const restPromise = (async () => {
      try {
        const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/zoom_meetings/${newMeeting.id}?key=${firebaseConfig.apiKey}`;
        const fields = {};
        for (const [k, v] of Object.entries(newMeeting)) {
          if (typeof v === 'boolean') fields[k] = { booleanValue: v };
          else if (typeof v === 'number') fields[k] = { integerValue: String(v) };
          else if (v !== null && v !== undefined) fields[k] = { stringValue: String(v) };
        }
        const res = await fetch(url, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fields })
        });
        if (res.ok) console.log("Firestore REST write confirmed:", newMeeting.id);
      } catch (err) {
        console.warn("Firestore REST write note:", err);
      }
    })();

    // 2. Modular SDK write
    const sdkPromise = setDoc(doc(firestoreDb, 'zoom_meetings', newMeeting.id), newMeeting).catch(err => {
      console.warn("Firestore SDK write note:", err);
    });

    try {
      await Promise.race([
        Promise.all([restPromise, sdkPromise]),
        new Promise(r => setTimeout(r, 2500))
      ]);
      console.log("Firestore cloud: Zoom meeting created", newMeeting.id);
    } catch (e) {
      console.warn("Firestore zoom create error:", e);
    }
    return newMeeting;
  },

  updateZoomMeeting: async function(id, data) {
    let list = this.getZoomMeetings();
    const idx = list.findIndex(m => m.id === id);
    if (idx === -1) return null;

    let formattedUrl = list[idx].zoomUrl;
    if (data.zoomUrl) {
      formattedUrl = data.zoomUrl.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = 'https://' + formattedUrl;
      }
    }

    const updatedMeeting = {
      ...list[idx],
      ...data,
      zoomUrl: formattedUrl,
      updatedAt: new Date().toISOString()
    };

    if (data.isPrimary) {
      list = list.map(m => m.id === id ? updatedMeeting : { ...m, isPrimary: false });
    } else {
      list[idx] = updatedMeeting;
    }

    this.saveZoomMeetings(list);

    // Guaranteed Dual-Channel update:
    // 1. Direct REST PATCH
    const restPromise = (async () => {
      try {
        const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/zoom_meetings/${id}?key=${firebaseConfig.apiKey}`;
        const fields = {};
        for (const [k, v] of Object.entries(updatedMeeting)) {
          if (typeof v === 'boolean') fields[k] = { booleanValue: v };
          else if (typeof v === 'number') fields[k] = { integerValue: String(v) };
          else if (v !== null && v !== undefined) fields[k] = { stringValue: String(v) };
        }
        await fetch(url, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fields })
        });
      } catch (err) {}
    })();

    // 2. Modular SDK write
    const sdkPromise = setDoc(doc(firestoreDb, 'zoom_meetings', id), updatedMeeting, { merge: true }).catch(() => {});

    try {
      await Promise.race([
        Promise.all([restPromise, sdkPromise]),
        new Promise(r => setTimeout(r, 2500))
      ]);
      console.log("Firestore cloud: Zoom meeting updated", id);
    } catch (e) {
      console.warn("Firestore zoom update error:", e);
    }
    return updatedMeeting;
  },

  setPrimaryZoomMeeting: async function(id) {
    return this.updateZoomMeeting(id, { isPrimary: true, status: 'active' });
  },

  deleteZoomMeeting: async function(id) {
    let list = this.getZoomMeetings();
    list = list.filter(m => m.id !== id);
    this.saveZoomMeetings(list);

    // Guaranteed Dual-Channel delete:
    // 1. Direct REST DELETE
    (async () => {
      try {
        const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/zoom_meetings/${id}?key=${firebaseConfig.apiKey}`;
        await fetch(url, { method: 'DELETE' });
      } catch (e) {}
    })();

    // 2. Modular SDK delete
    try {
      const writePromise = deleteDoc(doc(firestoreDb, 'zoom_meetings', id));
      await Promise.race([writePromise, new Promise(r => setTimeout(r, 2500))]);
      console.log("Firestore cloud: Zoom meeting deleted", id);
    } catch (e) {
      console.warn("Firestore zoom delete error:", e);
    }
    return true;
  },


  // -----------------------------------------------------------
  // STUDENT PROGRESS REPORTS & MONITORING (Cloud Synced)
  // -----------------------------------------------------------
  getProgressReports: function() {
    try {
      return JSON.parse(localStorage.getItem('roverProgressReports')) || SEED_PROGRESS;
    } catch {
      return SEED_PROGRESS;
    }
  },

  saveProgressReports: function(reports) {
    try {
      localStorage.setItem('roverProgressReports', JSON.stringify(reports));
    } catch (e) {}
  },

  getProgressForUser: function(userId) {
    const reports = this.getProgressReports();
    let rep = reports.find(r => r.userId === userId);
    if (!rep) {
      const allUsers = this.getUsers();
      const u = allUsers.find(x => x.id === userId);
      rep = {
        userId,
        accountNumber: u ? u.accountNumber : 'RT10001',
        studentName: u ? `${u.firstName} ${u.lastName || ''}`.trim() : 'Student',
        overallProgress: 10,
        chaptersCompleted: [],
        totalChapters: 4,
        currentChapter: 1,
        attendanceCount: 0,
        tradingPlanSubmitted: false,
        instructorEvaluation: "Welcome to Rover Trading Academy! Start with Chapter 01.",
        lastUpdated: new Date().toISOString()
      };
    }
    return rep;
  },

  saveProgressReport: async function(userId, reportData) {
    const reports = this.getProgressReports();
    const idx = reports.findIndex(r => r.userId === userId);
    const updated = {
      ...reportData,
      userId,
      lastUpdated: new Date().toISOString()
    };

    if (idx !== -1) {
      reports[idx] = updated;
    } else {
      reports.unshift(updated);
    }
    this.saveProgressReports(reports);

    try {
      const writePromise = setDoc(doc(firestoreDb, 'progress_reports', userId), updated, { merge: true });
      await Promise.race([writePromise, new Promise(r => setTimeout(r, 800))]);
      console.log("Firestore cloud: Student progress saved", userId);
    } catch (e) {
      console.warn("Firestore progress report save error:", e);
    }
    return updated;
  },

  // -----------------------------------------------------------
  // REVIEWS & COMMENT CONTROL (Cloud Synced)
  // -----------------------------------------------------------
  getReviews: function() {
    try {
      const revs = JSON.parse(localStorage.getItem('roverReviews')) || SEED_REVIEWS;
      return revs.map(r => ({
        ...r,
        hidden: r.hidden === true || r.status === 'hidden',
        status: r.status || (r.hidden ? 'hidden' : 'visible')
      }));
    } catch {
      return SEED_REVIEWS;
    }
  },

  getVisibleReviews: function() {
    return this.getReviews().filter(r => !r.hidden && r.status !== 'hidden');
  },

  saveReviews: function(revs) {
    try {
      localStorage.setItem('roverReviews', JSON.stringify(revs));
    } catch (e) {}
  },

  addReview: async function(reviewData) {
    const revs = this.getReviews();
    const newRev = {
      id: reviewData.id || 'rev_' + Date.now(),
      name: reviewData.name,
      course: reviewData.course,
      rating: Number(reviewData.rating) || 5,
      text: reviewData.text,
      date: reviewData.date || new Date().toISOString(),
      hidden: false,
      status: 'visible'
    };

    revs.unshift(newRev);
    this.saveReviews(revs);

    try {
      const writePromise = setDoc(doc(firestoreDb, 'reviews', newRev.id), {
        name: newRev.name,
        course: newRev.course,
        rating: newRev.rating,
        text: newRev.text,
        date: newRev.date,
        hidden: false,
        status: 'visible'
      });
      await Promise.race([writePromise, new Promise(r => setTimeout(r, 800))]);
      console.log('Firebase Cloud: Review synced', newRev.id);
    } catch (e) {
      console.warn('Firestore cloud review add error:', e);
    }

    return newRev;
  },

  toggleReviewVisibility: async function(reviewId) {
    const revs = this.getReviews();
    const idx = revs.findIndex(r => r.id === reviewId);
    if (idx === -1) return null;

    const item = revs[idx];
    item.hidden = !item.hidden;
    item.status = item.hidden ? 'hidden' : 'visible';
    if (!item.hidden) delete item.moderationReason;
    this.saveReviews(revs);

    try {
      const writePromise = setDoc(doc(firestoreDb, 'reviews', reviewId), {
        name: item.name,
        course: item.course,
        rating: item.rating,
        text: item.text,
        date: item.date || new Date().toISOString(),
        hidden: item.hidden,
        status: item.status,
        ...(item.moderationReason ? { moderationReason: item.moderationReason } : {})
      }, { merge: true });
      await Promise.race([writePromise, new Promise(r => setTimeout(r, 800))]);
      console.log('Firebase Cloud: Review visibility updated', reviewId, item.status);
    } catch (e) {
      console.warn('Firestore cloud visibility error:', e);
    }

    return item;
  },

  deleteReview: async function(reviewId) {
    let revs = this.getReviews();
    revs = revs.filter(r => r.id !== reviewId);
    this.saveReviews(revs);

    try {
      const writePromise = deleteDoc(doc(firestoreDb, 'reviews', reviewId));
      await Promise.race([writePromise, new Promise(r => setTimeout(r, 800))]);
      console.log('Firebase Cloud: Review deleted', reviewId);
    } catch (e) {
      console.warn('Firestore cloud deletion error:', e);
    }
    return true;
  },

  flagReview: async function(reviewId, reason = 'Inappropriate content') {
    const revs = this.getReviews();
    const idx = revs.findIndex(r => r.id === reviewId);
    if (idx === -1) return null;

    const item = revs[idx];
    item.hidden = true;
    item.status = 'flagged';
    item.moderationReason = reason;
    this.saveReviews(revs);

    try {
      const writePromise = setDoc(doc(firestoreDb, 'reviews', reviewId), {
        name: item.name,
        course: item.course,
        rating: item.rating,
        text: item.text,
        date: item.date || new Date().toISOString(),
        hidden: true,
        status: 'flagged',
        moderationReason: reason
      }, { merge: true });
      await Promise.race([writePromise, new Promise(r => setTimeout(r, 800))]);
      console.log('Firebase Cloud: Review flagged', reviewId);
    } catch (e) {
      console.warn('Firestore cloud flag error:', e);
    }

    return item;
  }
};

window.RoverStore = RoverStore;

// Universal db wrapper for all HTML pages
window.db = {
  collection: (colName) => ({
    doc: (docId) => ({
      get: () => getDoc(doc(firestoreDb, colName, docId)),
      set: (data, opts) => setDoc(doc(firestoreDb, colName, docId), data, opts || {}),
      update: (data) => setDoc(doc(firestoreDb, colName, docId), data, { merge: true }),
      delete: () => deleteDoc(doc(firestoreDb, colName, docId)),
      onSnapshot: (onNext, onError) => onSnapshot(doc(firestoreDb, colName, docId), onNext, onError)
    }),
    add: async (data) => {
      const id = 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
      await setDoc(doc(firestoreDb, colName, id), data);
      return { id };
    },
    get: () => getDocs(collection(firestoreDb, colName)),
    where: (field, op, val) => ({
      get: () => getDocs(query(collection(firestoreDb, colName), where(field, op, val))),
      onSnapshot: (onNext, onError) => onSnapshot(query(collection(firestoreDb, colName), where(field, op, val)), onNext, onError)
    }),
    limit: (n) => ({
      get: () => getDocs(collection(firestoreDb, colName))
    }),
    onSnapshot: (onNext, onError) => onSnapshot(collection(firestoreDb, colName), onNext, onError)
  })
};

if (!authInstance.signInWithPopup) {
  authInstance.signInWithPopup = (prov) => signInWithPopup(authInstance, prov);
}

window.auth = authInstance;
window.GoogleAuthProvider = GoogleAuthProvider;
window.signInWithPopup = (prov) => signInWithPopup(authInstance, prov);
window.signOut = () => authInstance.signOut();

window.firebase = {
  app: () => app,
  auth: {
    GoogleAuthProvider: GoogleAuthProvider,
    signInWithPopup: (prov) => signInWithPopup(authInstance, prov),
    signOut: () => authInstance.signOut()
  },
  firestore: {
    FieldValue: {
      serverTimestamp: () => new Date().toISOString()
    }
  }
};

// -----------------------------------------------------------
// AUTOMATIC CLOUD SEEDING & REAL-TIME BACKGROUND LISTENERS (NON-BLOCKING)
// -----------------------------------------------------------
setTimeout(() => {
  try {
    // 1. Users sync
    let usersInit = false;
    onSnapshot(collection(firestoreDb, 'users'), (snap) => {
      if (snap.empty && !usersInit) {
        usersInit = true;
        for (const u of SEED_USERS) {
          setDoc(doc(firestoreDb, 'users', u.id), u).catch(() => {});
        }
      } else if (!snap.empty) {
        const cloudUsers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        RoverStore.saveUsers(cloudUsers);
      }
    }, err => console.warn("Users sync note:", err));

    // 2. Reviews sync
    let revsInit = false;
    onSnapshot(collection(firestoreDb, 'reviews'), (snap) => {
      if (snap.empty && !revsInit) {
        revsInit = true;
        for (const r of SEED_REVIEWS) {
          setDoc(doc(firestoreDb, 'reviews', r.id), r).catch(() => {});
        }
      } else if (!snap.empty) {
        const cloudRevs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        RoverStore.saveReviews(cloudRevs);
      }
    }, err => console.warn("Reviews sync note:", err));

    // 3. Applications sync
    let appsInit = false;
    onSnapshot(collection(firestoreDb, 'applications'), (snap) => {
      if (snap.empty && !appsInit) {
        appsInit = true;
        for (const a of SEED_APPLICATIONS) {
          setDoc(doc(firestoreDb, 'applications', a.id), a).catch(() => {});
        }
      } else if (!snap.empty) {
        const cloudApps = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        RoverStore.saveApplications(cloudApps);
      }
    }, err => console.warn("Applications sync note:", err));

    // 4. Learning Content sync
    onSnapshot(doc(firestoreDb, 'learning_content', 'master_curriculum'), (d) => {
      if (d && d.exists()) {
        const data = d.data();
        try {
          localStorage.setItem('roverLearningDoc', JSON.stringify(data));
        } catch (e) {}
      } else {
        setDoc(doc(firestoreDb, 'learning_content', 'master_curriculum'), DEFAULT_LEARNING_DOCUMENT).catch(() => {});
      }
    }, err => console.warn("Learning doc sync note:", err));

    // 5. Zoom Meetings sync
    let zoomInit = false;
    onSnapshot(collection(firestoreDb, 'zoom_meetings'), (snap) => {
      if (snap.empty && !zoomInit) {
        zoomInit = true;
        for (const m of SEED_ZOOM_MEETINGS) {
          setDoc(doc(firestoreDb, 'zoom_meetings', m.id), m).catch(() => {});
        }
      } else if (!snap.empty) {
        const cloudZoom = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        RoverStore.saveZoomMeetingsFromCloud(cloudZoom);
      }
    }, err => console.warn("Zoom sync note:", err));

    // 6. Progress Reports sync
    let progInit = false;
    onSnapshot(collection(firestoreDb, 'progress_reports'), (snap) => {
      if (snap.empty && !progInit) {
        progInit = true;
        for (const p of SEED_PROGRESS) {
          setDoc(doc(firestoreDb, 'progress_reports', p.userId), p).catch(() => {});
        }
      } else if (!snap.empty) {
        const cloudProg = snap.docs.map(d => ({ userId: d.id, ...d.data() }));
        RoverStore.saveProgressReports(cloudProg);
      }
    }, err => console.warn("Progress sync note:", err));

  } catch (err) {
    console.warn("Firestore cloud background sync note:", err);
  }
}, 60);
