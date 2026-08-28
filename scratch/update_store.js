const fs = require('fs');

let code = fs.readFileSync('src/lib/store.tsx', 'utf8');

// 1. Add firebase imports at the top
code = code.replace(
  `import React, { createContext, useContext, useState } from 'react';`,
  `import React, { createContext, useContext, useState } from 'react';\nimport { db } from './firebase';\nimport { doc, setDoc, onSnapshot } from 'firebase/firestore';`
);

// 2. Add useFirestoreSync hook inside AppProvider
const hookCode = `
  // Helper to sync state with Firestore instantly
  function useFirestoreSync<T>(key: string, state: T, setState: React.Dispatch<React.SetStateAction<T>>, initialFallback: T) {
    const lastRemoteStateStr = React.useRef<string>('');
    const initialized = React.useRef(false);

    // Read from Firestore (Real-time listener)
    React.useEffect(() => {
      const unsub = onSnapshot(doc(db, "medix_realtime_db", key), (snap) => {
        if (snap.exists()) {
          const remoteData = snap.data().data;
          const remoteStr = JSON.stringify(remoteData);
          lastRemoteStateStr.current = remoteStr;
          
          setState((prev: any) => {
            if (JSON.stringify(prev) === remoteStr) return prev;
            return remoteData;
          });
        } else {
          // Initialize document if missing with the zero-state fallback
          const initialStr = JSON.stringify(initialFallback);
          lastRemoteStateStr.current = initialStr;
          setDoc(doc(db, "medix_realtime_db", key), { data: initialFallback });
          setState(initialFallback);
        }
        initialized.current = true;
      });
      return () => unsub();
    }, [key, initialFallback]);

    // Write to DB on local changes
    React.useEffect(() => {
      if (!isLoadedRef.current || !initialized.current) return;
      const localStr = JSON.stringify(state);
      if (localStr !== lastRemoteStateStr.current) {
        // State changed locally, push to Firestore
        setDoc(doc(db, "medix_realtime_db", key), { data: state });
        lastRemoteStateStr.current = localStr;
      }
    }, [state, key]);
  }
`;

code = code.replace(
  `const toggleMobileSidebar = () => setIsMobileSidebarOpen(prev => !prev);`,
  `const toggleMobileSidebar = () => setIsMobileSidebarOpen(prev => !prev);\n\n${hookCode}`
);

// 3. Replace the entire initial load and all localStorage React.useEffect blocks
// We need to cut out everything from `// 1. Initial Load` down to `// Direct Super Admin Hire Action`
const startMarker = `// 1. Initial Load from localStorage`;
const endMarker = `// Direct Super Admin Hire Action`;

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const replacementCode = `
  // Initialize and mark app loaded
  React.useEffect(() => {
    isLoadedRef.current = true;
  }, []);

  // Real-time Firestore synchronizations
  useFirestoreSync('superAdminProfile', superAdminProfile, setSuperAdminProfile, DEFAULT_SUPER_ADMIN_PROFILE);
  useFirestoreSync('branches', branches, setBranches, INITIAL_BRANCHES);
  useFirestoreSync('branchAdmins', branchAdmins, setBranchAdmins, INITIAL_BRANCH_ADMINS);
  useFirestoreSync('adminApplications', adminApplications, setAdminApplications, INITIAL_ADMIN_APPLICATIONS);
  useFirestoreSync('marketingRepresentatives', marketingRepresentatives, setMarketingRepresentatives, INITIAL_MARKETING_REPRESENTATIVES);
  useFirestoreSync('marketingJoinRequests', marketingJoinRequests, setMarketingJoinRequests, INITIAL_MARKETING_JOIN_REQUESTS);
  useFirestoreSync('marketingEmailLogs', marketingEmailLogs, setMarketingEmailLogs, INITIAL_MARKETING_EMAIL_LOGS);
  useFirestoreSync('doctors', doctors, setDoctors, INITIAL_DOCTORS);
  useFirestoreSync('patients', patients, setPatients, INITIAL_PATIENTS);
  useFirestoreSync('beds', beds, setBeds, INITIAL_BEDS);
  useFirestoreSync('medicines', medicines, setMedicines, INITIAL_MEDICINES);
  useFirestoreSync('labRequests', labRequests, setLabRequests, INITIAL_LAB_REQUESTS);
  useFirestoreSync('invoices', invoices, setInvoices, INITIAL_INVOICES);
  useFirestoreSync('appointments', appointments, setAppointments, INITIAL_APPOINTMENTS);
  useFirestoreSync('auditLogs', auditLogs, setAuditLogs, INITIAL_AUDIT_LOGS);
  useFirestoreSync('hospitalReferrals', hospitalReferrals, setHospitalReferrals, INITIAL_HOSPITAL_REFERRALS);

  // Sync role and landing concept locally (doesn't need cloud sync)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('medix_user_role') as UserRole;
      if (savedRole) setUserRole(savedRole);
      const concept = localStorage.getItem('medix_landing_concept');
      if (concept) setSelectedLandingConceptIdState(parseInt(concept, 10) || 7);
    }
  }, []);
  
  React.useEffect(() => {
    if (isLoadedRef.current && typeof window !== 'undefined') {
      localStorage.setItem('medix_user_role', userRole);
    }
  }, [userRole]);

  // Dispatch events for IFrames (Legacy support if still needed)
  React.useEffect(() => {
    if (isLoadedRef.current && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('medix_database_updated', { detail: { branches, doctors } }));
      document.querySelectorAll('iframe').forEach(frame => {
        try {
          frame.contentWindow?.postMessage({ type: 'MEDIX_DB_SYNC', branches, doctors }, '*');
        } catch (_) {}
      });
    }
  }, [branches, doctors]);

  `;

  code = code.substring(0, startIndex) + replacementCode + code.substring(endIndex);
}

fs.writeFileSync('src/lib/store.tsx', code);
console.log('Successfully updated store.tsx');
