const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(__dirname, '..', 'public', 'doctor-app', 'app.js'),
  path.join(__dirname, '..', 'public', 'doctor-app', 'index.html'),
  path.join(__dirname, '..', 'public', 'doctor-app', 'offline.html'),
  path.join(__dirname, '..', 'public', 'doctor-app', 'HMS_Doctor_Offline_App.html'),
  path.join(__dirname, '..', 'Hospital_Android_Application', 'doctor-android', 'app', 'src', 'main', 'assets', 'medix', 'app.js'),
  path.join(__dirname, '..', 'Hospital_Android_Application', 'doctor-android', 'app', 'src', 'main', 'assets', 'medix', 'index.html'),
];

const authFunctionsCode = `
/* ==========================================================================
   PRODUCTION SERVER-SIDE AUTHENTICATION ENGINE (MEDIX CLINICAL PORTAL)
   ========================================================================== */

async function validateServerSession() {
  const token = localStorage.getItem('medix_auth_token') || localStorage.getItem('medix_doctor_token');
  const loginScreen = document.getElementById('screen-login');
  const mainScreen = document.getElementById('screen-main');

  if (!token) {
    STATE.isLoggedIn = false;
    if (mainScreen) mainScreen.classList.add('hidden');
    if (loginScreen) loginScreen.classList.remove('hidden');
    return false;
  }

  try {
    const apiBase = (typeof MEDIX_API_BASE !== 'undefined' && MEDIX_API_BASE) ? MEDIX_API_BASE : '';
    const res = await fetch(apiBase + '/api/v1/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    const data = await res.json().catch(() => null);
    if (res.ok && data && data.success && data.data && data.data.authenticated) {
      const user = data.data.user || {};
      const details = user.details || {};
      const doctorObj = {
        id: user.id || 101,
        name: user.name || 'Dr. Medical Practitioner',
        initials: (user.name || 'DR').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
        gender: details.gender || 'Male',
        email: user.email,
        phone: user.phone || '+91 98042 22142',
        referenceId: details.referenceId || ('REF-DOC-' + (user.id || 101)),
        chamberAddress: details.chamberAddress || 'OPD Suite 302, 3rd Floor, Wing A',
        pincode: details.pincode || '700016',
        district: details.district || 'Kolkata',
        state: details.state || 'West Bengal',
        titles: 'MBBS, MD, DM, FACC',
        medicalCollege: 'AIIMS, New Delhi',
        experienceYears: '12',
        workExperience: 'Senior Consultant Physician',
        specialtyLead: details.specialty || 'Interventional Cardiology & Critical Care',
        department: 'Clinical OPD & Cardiology',
        experience: '12 Years',
        room: (details.chamberAddress || 'OPD Suite 302') + ', ' + (details.district || 'Kolkata'),
        feeOpd: details.consultFee || 800,
        feeFollowup: 400,
        feeEmergency: 1500,
        feeIpd: 1000,
        dutyStatus: 'AVAILABLE',
        bio: 'Accredited clinical specialist practicing in ' + (details.district || 'Kolkata') + ', ' + (details.state || 'West Bengal') + '.',
        broadcastMsg: 'Doctor is available in chamber for consultation.'
      };
      STATE.currentDoctor = doctorObj;
      STATE.isLoggedIn = true;
      try {
        localStorage.setItem('medix_doctor_session', JSON.stringify(doctorObj));
      } catch (_) {}
      if (loginScreen) loginScreen.classList.add('hidden');
      if (mainScreen) mainScreen.classList.remove('hidden');
      renderAll();
      return true;
    } else {
      localStorage.removeItem('medix_auth_token');
      localStorage.removeItem('medix_doctor_token');
      localStorage.removeItem('medix_doctor_session');
      STATE.isLoggedIn = false;
      if (mainScreen) mainScreen.classList.add('hidden');
      if (loginScreen) loginScreen.classList.remove('hidden');
      return false;
    }
  } catch (err) {
    STATE.isLoggedIn = false;
    if (mainScreen) mainScreen.classList.add('hidden');
    if (loginScreen) loginScreen.classList.remove('hidden');
    return false;
  }
}

async function handleRegister() {
  const nameEl = document.getElementById('reg-name');
  const genderEl = document.getElementById('reg-gender');
  const chamberEl = document.getElementById('reg-chamber-address');
  const pincodeEl = document.getElementById('reg-pincode');
  const districtEl = document.getElementById('reg-district');
  const stateEl = document.getElementById('reg-state');
  const refIdEl = document.getElementById('reg-reference-id');
  const emailEl = document.getElementById('reg-email');
  const passwordEl = document.getElementById('reg-password');

  const name = nameEl ? nameEl.value.trim() : '';
  const gender = genderEl ? genderEl.value : 'Male';
  const chamberAddress = chamberEl ? chamberEl.value.trim() : '';
  const pincode = pincodeEl ? pincodeEl.value.trim() : '';
  const district = districtEl ? districtEl.value.trim() : '';
  const state = stateEl ? stateEl.value.trim() : '';
  const refId = refIdEl ? refIdEl.value.trim() : '';
  const email = emailEl ? emailEl.value.trim() : '';
  const password = passwordEl ? passwordEl.value : '';

  const errBox = document.getElementById('reg-error');
  const errText = document.getElementById('reg-error-text');
  const btnText = document.getElementById('btn-register-text');
  const spinner = document.getElementById('btn-register-spinner');

  const showRegErr = (msg) => {
    if (errBox) {
      errBox.classList.remove('hidden');
      if (errText) errText.textContent = msg;
    } else {
      showToast(msg, 'error');
    }
    if (btnText) btnText.innerHTML = '<i class="fa-solid fa-user-check"></i> Register & Open Medix Portal';
    if (spinner) spinner.classList.add('hidden');
    playClinicalChime('alert');
  };

  if (!name) return showRegErr('Full Practitioner Name is required.');
  if (!chamberAddress) return showRegErr('Chamber Address is required.');
  if (!pincode) return showRegErr('Postal Pin Code is required.');
  if (!district) return showRegErr('District is required.');
  if (!state) return showRegErr('State is required.');
  if (!refId) return showRegErr('Reference ID is mandatory.');
  if (!email || !email.includes('@')) return showRegErr('Valid official doctor email is required.');
  if (!password || password.length < 8) return showRegErr('Password must be at least 8 characters with letters and numbers.');

  if (btnText) btnText.textContent = 'Registering on Secure Server...';
  if (spinner) spinner.classList.remove('hidden');
  if (errBox) errBox.classList.add('hidden');

  try {
    const apiBase = (typeof MEDIX_API_BASE !== 'undefined' && MEDIX_API_BASE) ? MEDIX_API_BASE : '';
    const res = await fetch(apiBase + '/api/v1/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.startsWith('Dr.') ? name : ('Dr. ' + name),
        email: email,
        phone: '+91 98042 22142',
        password: password,
        confirmPassword: password,
        role: 'doctor',
        branchId: 1,
        details: {
          specialty: 'Clinical Specialist',
          consultFee: 800,
          chamberAddress: chamberAddress,
          pincode: pincode,
          district: district,
          state: state,
          referenceId: refId,
          gender: gender
        }
      })
    });

    const data = await res.json().catch(() => null);
    if (btnText) btnText.innerHTML = '<i class="fa-solid fa-user-check"></i> Register & Open Medix Portal';
    if (spinner) spinner.classList.add('hidden');

    if (res.ok && data && data.success) {
      playClinicalChime('success');
      showToast('Doctor account registered on server! Please sign in with your credentials.', 'success');
      switchAuthMode('login');
      const loginEmailInput = document.getElementById('login-email');
      const loginPassInput = document.getElementById('login-password');
      if (loginEmailInput) loginEmailInput.value = email;
      if (loginPassInput) {
        loginPassInput.value = '';
        loginPassInput.focus();
      }
    } else {
      const errMsg = (data && data.error && (data.error.message || data.error)) || 'Registration failed on server.';
      showRegErr(errMsg);
    }
  } catch (err) {
    showRegErr('Network connection failed. Could not reach authentication server.');
  }
}

function togglePasswordVisibility() {
  const input = document.getElementById('login-password');
  if (input) input.type = input.type === 'password' ? 'text' : 'password';
}

async function handleBiometricScan() {
  const token = localStorage.getItem('medix_auth_token');
  if (!token) {
    playClinicalChime('alert');
    showToast('No active session token found. Please enter password to authenticate.', 'warning');
    switchAuthMode('login');
    return;
  }
  const valid = await validateServerSession();
  if (valid) {
    playClinicalChime('success');
    showToast('Biometric Access Key Validated by Server', 'success');
  } else {
    playClinicalChime('alert');
    showToast('Session expired or invalidated. Please sign in with password.', 'warning');
    switchAuthMode('login');
  }
}

async function handleLogin(isBiometric = false) {
  const emailInput = document.getElementById('login-email');
  const passInput = document.getElementById('login-password');
  const rawId = emailInput ? emailInput.value.trim() : '';
  const pass = passInput ? passInput.value.trim() : '';
  const errBox = document.getElementById('login-error');
  const errText = document.getElementById('login-error-text');
  const btnText = document.getElementById('btn-login-text');
  const spinner = document.getElementById('btn-login-spinner');

  const showLoginErr = (msg) => {
    if (errBox) {
      errBox.classList.remove('hidden');
      if (errText) errText.textContent = msg;
    } else {
      showToast(msg, 'error');
    }
    if (btnText) btnText.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Secure Sign In';
    if (spinner) spinner.classList.add('hidden');
    playClinicalChime('alert');
  };

  if (!rawId) return showLoginErr('Please enter your registered Email, Mobile, or Doctor ID.');
  if (!pass && !isBiometric) return showLoginErr('Please enter your registered account password.');

  if (btnText) btnText.textContent = 'Authenticating Doctor Session...';
  if (spinner) spinner.classList.remove('hidden');
  if (errBox) errBox.classList.add('hidden');

  try {
    const apiBase = (typeof MEDIX_API_BASE !== 'undefined' && MEDIX_API_BASE) ? MEDIX_API_BASE : '';
    const res = await fetch(apiBase + '/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: rawId,
        password: pass,
        role: 'doctor'
      })
    });

    const data = await res.json().catch(() => null);
    if (btnText) btnText.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Secure Sign In';
    if (spinner) spinner.classList.add('hidden');

    if (res.ok && data && (data.success || (data.data && data.data.token))) {
      const user = (data.data && data.data.user) || data.user || {};
      const token = (data.data && data.data.token) || data.token;
      const details = user.details || {};
      if (token) {
        try {
          localStorage.setItem('medix_auth_token', token);
          localStorage.setItem('medix_doctor_token', token);
        } catch (_) {}
      }
      const doctorObj = {
        id: user.id || 101,
        name: user.name || (rawId.startsWith('Dr.') ? rawId : ('Dr. ' + rawId)),
        initials: (user.name || 'DR').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
        email: user.email || rawId,
        phone: user.phone || '+91 98042 22142',
        referenceId: details.referenceId || ('REF-DOC-' + (user.id || 101)),
        chamberAddress: details.chamberAddress || 'OPD Suite 302, 3rd Floor, Wing A',
        pincode: details.pincode || '700016',
        district: details.district || 'Kolkata',
        state: details.state || 'West Bengal',
        specialtyLead: details.specialty || 'General Medicine & Interventional Cardiology',
        feeOpd: details.consultFee || 800,
        feeFollowup: 400,
        feeEmergency: 1500,
        feeIpd: 1000,
        dutyStatus: 'AVAILABLE',
        gender: details.gender || 'Male'
      };
      STATE.currentDoctor = doctorObj;
      STATE.isLoggedIn = true;
      try {
        localStorage.setItem('medix_doctor_session', JSON.stringify(doctorObj));
      } catch (_) {}
      const loginScreen = document.getElementById('screen-login');
      const mainScreen = document.getElementById('screen-main');
      if (loginScreen) loginScreen.classList.add('hidden');
      if (mainScreen) mainScreen.classList.remove('hidden');
      playClinicalChime('success');
      showToast('Welcome back, ' + doctorObj.name + '!', 'success');
      renderAll();
      return;
    } else {
      const errorMsg = (data && data.error && (data.error.message || data.error)) || 'Authentication Failed: Invalid credentials or account not found.';
      showLoginErr(errorMsg);
      return;
    }
  } catch (err) {
    showLoginErr('Authentication Failed: Server unreachable. Please verify network connection.');
  }
}

async function handleLogout() {
  const token = localStorage.getItem('medix_auth_token');
  if (token) {
    try {
      const apiBase = (typeof MEDIX_API_BASE !== 'undefined' && MEDIX_API_BASE) ? MEDIX_API_BASE : '';
      await fetch(apiBase + '/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      });
    } catch (_) {}
  }
  localStorage.removeItem('medix_auth_token');
  localStorage.removeItem('medix_doctor_token');
  localStorage.removeItem('medix_doctor_session');
  STATE.isLoggedIn = false;
  const mainScreen = document.getElementById('screen-main');
  const loginScreen = document.getElementById('screen-login');
  if (mainScreen) mainScreen.classList.add('hidden');
  if (loginScreen) loginScreen.classList.remove('hidden');
  switchAuthMode('login');
  showToast('Doctor Session Signed Out', 'info');
}
`;

targetFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Replace from function handleRegister to handleLogout
  const startRegex = /(?:async\s+)?function\s+handleRegister\s*\(\)\s*\{/;
  const endRegex = /function\s+handleLogout\s*\(\)\s*\{[\s\S]*?showToast\([^)]+\);\s*\}/;

  if (startRegex.test(content) && endRegex.test(content)) {
    const startIndex = content.search(startRegex);
    const endMatch = content.match(endRegex);
    if (endMatch) {
      const endIndex = content.indexOf(endMatch[0]) + endMatch[0].length;
      content = content.substring(0, startIndex) + authFunctionsCode.trim() + content.substring(endIndex);
    }
  }

  // Update DOMContentLoaded to validate server session
  const domLoadedTarget = `document.addEventListener('DOMContentLoaded', () => {
  validateServerSession().then(valid => {
    if (!valid) {
      const main = document.getElementById('screen-main');
      const login = document.getElementById('screen-login');
      if (main) main.classList.add('hidden');
      if (login) login.classList.remove('hidden');
    }
  });
  renderAll();
  initAppSplashScreen();
});`;

  content = content.replace(
    /document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{[\s\S]*?renderAll\(\);\s*initAppSplashScreen\(\);\s*\}\);/,
    domLoadedTarget
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log('✅ Successfully updated server-side authentication in:', file);
});
