const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

console.log('================================================================');
console.log('🛠️ AUDITING AND UPGRADING REGISTRATION SECTION ACROSS ALL ASSETS');
console.log('================================================================\n');

// 1. Enhanced HTML markup for the Doctor Registration form
const NEW_REGISTRATION_HTML = `<!-- SECTION A: DOCTOR REGISTRATION FORM -->
                <div id="auth-section-register">
                  <div class="form-header">
                    <h3>Doctor Registration</h3>
                    <p>Create your practitioner credentials to activate Medix clinical EHR</p>
                  </div>

                  <div id="register-error" class="login-error-toast hidden">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    <span id="register-error-text">Please fill in all required fields</span>
                  </div>

                  <!-- Doctor Profile Photo Upload (.jpg, .png, .jpeg, .webp) -->
                  <div class="clinical-input-group" style="text-align:center; margin-bottom:16px;">
                    <label style="display:block; margin-bottom:8px; font-weight:700; font-size:12px; color:var(--text-main);">
                      Doctor Profile Photo <span style="font-weight:600; color:#64748B; font-size:11px;">(.jpg, .png, .jpeg, etc.)</span>
                    </label>
                    <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
                      <div id="reg-photo-preview-wrap" style="width:84px; height:84px; border-radius:24px; background:linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%); border:2.5px dashed #93C5FD; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; cursor:pointer; box-shadow:0 6px 16px rgba(37,99,235,0.2); transition:all 0.2s ease;" onclick="document.getElementById('reg-photo-input').click()" title="Click to upload profile photo">
                        <img id="reg-photo-preview-img" src="" class="hidden" style="width:100%; height:100%; object-fit:cover;">
                        <div id="reg-photo-placeholder-icon" style="text-align:center; color:#FFFFFF;">
                          <i class="fa-solid fa-camera" style="font-size:24px; display:block; margin-bottom:2px;"></i>
                          <span style="font-size:9px; font-weight:900; letter-spacing:0.5px;">ADD PHOTO</span>
                        </div>
                      </div>
                      <input type="file" id="reg-photo-input" accept="image/jpeg,image/png,image/jpg,image/webp,image/*" style="display:none;" onchange="previewDoctorRegistrationPhoto(event)">
                      <div style="display:flex; gap:6px; align-items:center;">
                        <button type="button" onclick="document.getElementById('reg-photo-input').click()" style="background:#EFF6FF; color:#1D4ED8; border:1px solid #BFDBFE; font-size:11.5px; font-weight:700; padding:5px 14px; border-radius:9999px; cursor:pointer; display:flex; align-items:center; gap:6px;">
                          <i class="fa-solid fa-cloud-arrow-up"></i> Select Photo File
                        </button>
                        <button type="button" id="reg-photo-clear-btn" class="hidden" onclick="clearDoctorRegistrationPhoto()" style="background:#FEE2E2; color:#DC2626; border:1px solid #FECACA; font-size:11px; font-weight:700; padding:5px 10px; border-radius:9999px; cursor:pointer;">
                          <i class="fa-solid fa-trash"></i> Clear
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Full Practitioner Name -->
                  <div class="clinical-input-group">
                    <label>Full Practitioner Name <span style="color:#EF4444; font-weight:700;">*</span></label>
                    <div class="input-wrapper">
                      <i class="fa-solid fa-user-doctor"></i>
                      <input type="text" id="reg-name" placeholder="Enter Full Practitioner Name (e.g. Dr. Rajesh Kumar)" required>
                    </div>
                  </div>

                  <!-- Gender & Clinical Specialty (2 Columns) -->
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div class="clinical-input-group">
                      <label>Doctor Gender <span style="color:#EF4444; font-weight:700;">*</span></label>
                      <div class="input-wrapper">
                        <i class="fa-solid fa-venus-mars"></i>
                        <select id="reg-gender" required style="width:100%; border:none; background:transparent; font-size:13px; font-weight:600; color:var(--text-main); outline:none; cursor:pointer;">
                          <option value="" disabled selected>Select Gender *</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div class="clinical-input-group">
                      <label>Clinical Specialty <span style="color:#EF4444; font-weight:700;">*</span></label>
                      <div class="input-wrapper">
                        <i class="fa-solid fa-stethoscope"></i>
                        <select id="reg-specialty" required style="width:100%; border:none; background:transparent; font-size:13px; font-weight:600; color:var(--text-main); outline:none; cursor:pointer;">
                          <option value="" disabled selected>Select Specialty *</option>
                          <option value="General Medicine">General Medicine</option>
                          <option value="Cardiology">Cardiology</option>
                          <option value="General Surgery">General Surgery</option>
                          <option value="Pediatrics & Child Health">Pediatrics & Child Health</option>
                          <option value="Orthopedics">Orthopedics</option>
                          <option value="Gynecology & Obstetrics">Gynecology & Obstetrics</option>
                          <option value="Neurology & Neurosurgery">Neurology & Neurosurgery</option>
                          <option value="Dermatology & Cosmetology">Dermatology & Cosmetology</option>
                          <option value="Ophthalmology">Ophthalmology</option>
                          <option value="ENT (Ear, Nose & Throat)">ENT (Ear, Nose & Throat)</option>
                          <option value="Pulmonology / Chest Medicine">Pulmonology / Chest Medicine</option>
                          <option value="Gastroenterology">Gastroenterology</option>
                          <option value="Nephrology & Urology">Nephrology & Urology</option>
                          <option value="Psychiatry & Mental Health">Psychiatry & Mental Health</option>
                          <option value="Critical Care & Emergency">Critical Care & Emergency</option>
                          <option value="Other Clinical Specialty">Other Clinical Specialty</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <!-- Medical Council Reg No & Qualifications (2 Columns) -->
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div class="clinical-input-group">
                      <label>Medical Reg. No. / NMC <span style="color:#EF4444; font-weight:700;">*</span></label>
                      <div class="input-wrapper">
                        <i class="fa-solid fa-id-card-clip"></i>
                        <input type="text" id="reg-council-no" placeholder="e.g. WBMC-78921" required>
                      </div>
                    </div>

                    <div class="clinical-input-group">
                      <label>Qualifications <span style="color:#EF4444; font-weight:700;">*</span></label>
                      <div class="input-wrapper">
                        <i class="fa-solid fa-graduation-cap"></i>
                        <input type="text" id="reg-qualification" placeholder="e.g. MBBS, MD" value="MBBS, MD" required>
                      </div>
                    </div>
                  </div>

                  <!-- Official Phone & Experience (2 Columns) -->
                  <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 10px;">
                    <div class="clinical-input-group">
                      <label>Official Mobile Phone <span style="color:#EF4444; font-weight:700;">*</span></label>
                      <div class="input-wrapper">
                        <i class="fa-solid fa-phone"></i>
                        <input type="tel" id="reg-phone" placeholder="e.g. 98042 22142" required maxlength="15">
                      </div>
                    </div>

                    <div class="clinical-input-group">
                      <label>Experience <span style="color:#EF4444; font-weight:700;">*</span></label>
                      <div class="input-wrapper">
                        <i class="fa-solid fa-business-time"></i>
                        <input type="number" id="reg-experience" placeholder="Years" value="8" min="0" max="60" required>
                      </div>
                    </div>
                  </div>

                  <!-- Chamber Address -->
                  <div class="clinical-input-group">
                    <label>Chamber Address & Clinic Location <span style="color:#EF4444; font-weight:700;">*</span></label>
                    <div class="input-wrapper">
                      <i class="fa-solid fa-hospital-user"></i>
                      <input type="text" id="reg-chamber-address" placeholder="Enter Chamber Address & Clinic Location" required>
                    </div>
                  </div>

                  <!-- PIN Code, District & State (Smart 2 Columns with Datalist & Auto-lookup) -->
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div class="clinical-input-group">
                      <label>Pin Code <span style="color:#EF4444; font-weight:700;">*</span></label>
                      <div class="input-wrapper">
                        <i class="fa-solid fa-location-dot"></i>
                        <input type="text" id="reg-pincode" placeholder="Enter 6-digit PIN" required maxlength="10" oninput="handlePincodeAutoLookup(this.value)">
                      </div>
                    </div>

                    <div class="clinical-input-group">
                      <label>District <span style="color:#EF4444; font-weight:700;">*</span></label>
                      <div class="input-wrapper">
                        <i class="fa-solid fa-map-location-dot"></i>
                        <input type="text" id="reg-district" list="reg-district-datalist" placeholder="Enter District" required>
                        <datalist id="reg-district-datalist">
                          <option value="Kolkata">
                          <option value="Howrah">
                          <option value="North 24 Parganas">
                          <option value="South 24 Parganas">
                          <option value="Hooghly">
                          <option value="Purba Bardhaman">
                          <option value="Paschim Bardhaman">
                          <option value="Nadia">
                          <option value="Murshidabad">
                          <option value="Malda">
                          <option value="Darjeeling">
                          <option value="Jalpaiguri">
                          <option value="Paschim Medinipur">
                          <option value="Purba Medinipur">
                          <option value="Birbhum">
                          <option value="Bankura">
                          <option value="Purulia">
                          <option value="Cooch Behar">
                          <option value="Alipurduar">
                          <option value="Kalimpong">
                          <option value="Jhargram">
                          <option value="Uttar Dinajpur">
                          <option value="Dakshin Dinajpur">
                        </datalist>
                      </div>
                    </div>
                  </div>

                  <!-- State -->
                  <div class="clinical-input-group">
                    <label>State <span style="color:#EF4444; font-weight:700;">*</span></label>
                    <div class="input-wrapper">
                      <i class="fa-solid fa-landmark"></i>
                      <input type="text" id="reg-state" list="reg-state-datalist" placeholder="Enter State (e.g. West Bengal)" value="West Bengal" required>
                      <datalist id="reg-state-datalist">
                        <option value="West Bengal">
                        <option value="Delhi">
                        <option value="Maharashtra">
                        <option value="Karnataka">
                        <option value="Tamil Nadu">
                        <option value="Bihar">
                        <option value="Jharkhand">
                        <option value="Odisha">
                        <option value="Assam">
                        <option value="Uttar Pradesh">
                        <option value="Kerala">
                        <option value="Gujarat">
                        <option value="Telangana">
                        <option value="Andhra Pradesh">
                        <option value="Rajasthan">
                        <option value="Madhya Pradesh">
                        <option value="Punjab">
                        <option value="Haryana">
                      </datalist>
                    </div>
                  </div>

                  <!-- Consultation Fee & Reference ID (2 Columns) -->
                  <div style="display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 10px;">
                    <div class="clinical-input-group">
                      <label>OPD Fee (₹) <span style="color:#EF4444; font-weight:700;">*</span></label>
                      <div class="input-wrapper">
                        <i class="fa-solid fa-indian-rupee-sign"></i>
                        <input type="number" id="reg-fee" placeholder="800" value="800" min="100" step="50" required>
                      </div>
                    </div>

                    <div class="clinical-input-group">
                      <label>Reference ID <span style="color:#EF4444; font-weight:700;">* (Mandatory)</span></label>
                      <div class="input-wrapper" style="border: 1.5px solid rgba(239, 68, 68, 0.45); background: rgba(239, 68, 68, 0.04);">
                        <i class="fa-solid fa-asterisk text-rose" style="color:#EF4444;"></i>
                        <input type="text" id="reg-reference-id" placeholder="Reference ID / Code" required>
                      </div>
                    </div>
                  </div>
                  <small style="color: #94A3B8; font-size: 11px; margin-top: -6px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
                    <span><i class="fa-solid fa-shield-halved" style="color:#10B981;"></i> Reference ID is mandatory.</span>
                    <a href="javascript:void(0)" onclick="quickFillDoctorReferenceId()" style="color:#2563EB; font-weight:700; text-decoration:underline;">Auto-Generate ID</a>
                  </small>

                  <!-- Official Email -->
                  <div class="clinical-input-group">
                    <label>Official Doctor Email <span style="color:#EF4444; font-weight:700;">*</span></label>
                    <div class="input-wrapper">
                      <i class="fa-regular fa-envelope"></i>
                      <input type="email" id="reg-email" placeholder="e.g. dr.rajesh@medix.hospital" required>
                    </div>
                  </div>

                  <!-- Create Master Password & Confirm Password (2 Columns with Eye Toggle) -->
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div class="clinical-input-group">
                      <label>Create Password <span style="color:#EF4444; font-weight:700;">*</span></label>
                      <div class="input-wrapper" style="position:relative;">
                        <i class="fa-solid fa-lock"></i>
                        <input type="password" id="reg-password" placeholder="Create password" required style="padding-right:32px;">
                        <i class="fa-regular fa-eye" onclick="toggleRegPasswordVisibility('reg-password', this)" style="position:absolute; right:12px; top:50%; transform:translateY(-50%); cursor:pointer; color:#94A3B8; font-size:13px;" title="Show/Hide Password"></i>
                      </div>
                    </div>

                    <div class="clinical-input-group">
                      <label>Confirm Password <span style="color:#EF4444; font-weight:700;">*</span></label>
                      <div class="input-wrapper" style="position:relative;">
                        <i class="fa-solid fa-shield-halved"></i>
                        <input type="password" id="reg-confirm-password" placeholder="Confirm password" required style="padding-right:32px;">
                        <i class="fa-regular fa-eye" onclick="toggleRegPasswordVisibility('reg-confirm-password', this)" style="position:absolute; right:12px; top:50%; transform:translateY(-50%); cursor:pointer; color:#94A3B8; font-size:13px;" title="Show/Hide Password"></i>
                      </div>
                    </div>
                  </div>

                  <!-- Clinical Declaration Checkbox -->
                  <div style="margin: 12px 0 16px 0; display:flex; align-items:flex-start; gap:8px;">
                    <input type="checkbox" id="reg-declaration" checked style="margin-top:3px; accent-color:#2563EB; cursor:pointer;">
                    <label for="reg-declaration" style="font-size:11.5px; color:var(--text-sub); line-height:1.4; cursor:pointer;">
                      I certify that I am an authorized medical practitioner holding valid clinical registration with NMC / State Medical Council.
                    </label>
                  </div>

                  <!-- Register Submit Button -->
                  <button class="btn-clinical-primary" id="btn-register" onclick="handleRegister()">
                    <span id="btn-register-text"><i class="fa-solid fa-user-check"></i> Register & Open Medix Portal</span>
                    <div id="btn-register-spinner" class="spinner-dot-ring hidden"></div>
                  </button>

                  <div class="auth-footer-toggle">
                    Already registered doctor? <a onclick="switchAuthMode('login')">Sign In directly</a>
                  </div>
                </div>`;

// 2. Enhanced JavaScript handlers for registration
const NEW_REGISTRATION_JS = `let regDoctorPhotoBase64 = null;

function previewDoctorRegistrationPhoto(event) {
  const input = (event && event.target) ? event.target : document.getElementById('reg-photo-input');
  const file = (input && input.files && input.files[0]) ? input.files[0] : null;
  if (!file) return;

  if (file.size > 10 * 1024 * 1024) {
    showToast('Image file size too large (max 10MB)', 'warning');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    regDoctorPhotoBase64 = dataUrl;

    const previewImg = document.getElementById('reg-photo-preview-img');
    const placeholder = document.getElementById('reg-photo-placeholder-icon');
    const clearBtn = document.getElementById('reg-photo-clear-btn');
    const previewWrap = document.getElementById('reg-photo-preview-wrap');

    if (previewImg) {
      previewImg.src = dataUrl;
      previewImg.style.display = 'block';
      previewImg.style.position = 'absolute';
      previewImg.style.top = '0';
      previewImg.style.left = '0';
      previewImg.style.width = '100%';
      previewImg.style.height = '100%';
      previewImg.style.objectFit = 'cover';
      previewImg.classList.remove('hidden');
    }
    if (placeholder) {
      placeholder.style.display = 'none';
      placeholder.classList.add('hidden');
    }
    if (clearBtn) {
      clearBtn.style.display = 'inline-flex';
      clearBtn.classList.remove('hidden');
    }
    if (previewWrap) {
      previewWrap.style.borderStyle = 'solid';
      previewWrap.style.borderColor = '#2563EB';
      previewWrap.style.background = '#0F172A';
    }

    showToast('Doctor photo selected & uploaded', 'success');
  };
  reader.readAsDataURL(file);
}

function clearDoctorRegistrationPhoto() {
  regDoctorPhotoBase64 = null;
  const input = document.getElementById('reg-photo-input');
  if (input) input.value = '';
  const previewImg = document.getElementById('reg-photo-preview-img');
  const placeholder = document.getElementById('reg-photo-placeholder-icon');
  const clearBtn = document.getElementById('reg-photo-clear-btn');
  const previewWrap = document.getElementById('reg-photo-preview-wrap');
  if (previewImg) {
    previewImg.src = '';
    previewImg.style.display = 'none';
    previewImg.classList.add('hidden');
  }
  if (placeholder) {
    placeholder.style.display = 'block';
    placeholder.classList.remove('hidden');
  }
  if (clearBtn) {
    clearBtn.style.display = 'none';
    clearBtn.classList.add('hidden');
  }
  if (previewWrap) {
    previewWrap.style.borderStyle = 'dashed';
    previewWrap.style.borderColor = '#93C5FD';
    previewWrap.style.background = 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)';
  }
}

function handlePincodeAutoLookup(pin) {
  if (!pin || pin.length < 3) return;
  const clean = pin.trim().replace(/\\D/g, '');
  const districtEl = document.getElementById('reg-district');
  const stateEl = document.getElementById('reg-state');

  if (clean.startsWith('700') || clean.startsWith('7000')) {
    if (districtEl) districtEl.value = 'Kolkata';
    if (stateEl) stateEl.value = 'West Bengal';
  } else if (clean.startsWith('711')) {
    if (districtEl) districtEl.value = 'Howrah';
    if (stateEl) stateEl.value = 'West Bengal';
  } else if (clean.startsWith('712')) {
    if (districtEl) districtEl.value = 'Hooghly';
    if (stateEl) stateEl.value = 'West Bengal';
  } else if (clean.startsWith('743')) {
    if (districtEl) districtEl.value = 'North 24 Parganas';
    if (stateEl) stateEl.value = 'West Bengal';
  } else if (clean.startsWith('741')) {
    if (districtEl) districtEl.value = 'Nadia';
    if (stateEl) stateEl.value = 'West Bengal';
  } else if (clean.startsWith('742')) {
    if (districtEl) districtEl.value = 'Murshidabad';
    if (stateEl) stateEl.value = 'West Bengal';
  } else if (clean.startsWith('734')) {
    if (districtEl) districtEl.value = 'Darjeeling';
    if (stateEl) stateEl.value = 'West Bengal';
  } else if (clean.startsWith('713')) {
    if (districtEl) districtEl.value = 'Purba Bardhaman';
    if (stateEl) stateEl.value = 'West Bengal';
  } else if (clean.startsWith('721')) {
    if (districtEl) districtEl.value = 'Paschim Medinipur';
    if (stateEl) stateEl.value = 'West Bengal';
  } else if (clean.startsWith('110')) {
    if (districtEl) districtEl.value = 'New Delhi';
    if (stateEl) stateEl.value = 'Delhi';
  } else if (clean.startsWith('400')) {
    if (districtEl) districtEl.value = 'Mumbai';
    if (stateEl) stateEl.value = 'Maharashtra';
  } else if (clean.startsWith('560')) {
    if (districtEl) districtEl.value = 'Bengaluru';
    if (stateEl) stateEl.value = 'Karnataka';
  } else if (clean.startsWith('600')) {
    if (districtEl) districtEl.value = 'Chennai';
    if (stateEl) stateEl.value = 'Tamil Nadu';
  }
}

function quickFillDoctorReferenceId() {
  const refInput = document.getElementById('reg-reference-id');
  if (refInput) {
    const code = 'REF-MEDIX-' + Math.floor(1000 + Math.random() * 9000);
    refInput.value = code;
    showToast('Generated Reference ID: ' + code, 'success');
  }
}

function toggleRegPasswordVisibility(id, iconEl) {
  const input = document.getElementById(id);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (iconEl) {
      iconEl.classList.remove('fa-eye');
      iconEl.classList.add('fa-eye-slash');
    }
  } else {
    input.type = 'password';
    if (iconEl) {
      iconEl.classList.remove('fa-eye-slash');
      iconEl.classList.add('fa-eye');
    }
  }
}

async function handleRegister() {
  const nameEl = document.getElementById('reg-name');
  const genderEl = document.getElementById('reg-gender');
  const specialtyEl = document.getElementById('reg-specialty');
  const councilNoEl = document.getElementById('reg-council-no');
  const qualificationEl = document.getElementById('reg-qualification');
  const phoneEl = document.getElementById('reg-phone');
  const experienceEl = document.getElementById('reg-experience');
  const chamberEl = document.getElementById('reg-chamber-address');
  const pincodeEl = document.getElementById('reg-pincode');
  const districtEl = document.getElementById('reg-district');
  const stateEl = document.getElementById('reg-state');
  const feeEl = document.getElementById('reg-fee');
  const refIdEl = document.getElementById('reg-reference-id');
  const emailEl = document.getElementById('reg-email');
  const passwordEl = document.getElementById('reg-password');
  const confirmPassEl = document.getElementById('reg-confirm-password');
  const declarationEl = document.getElementById('reg-declaration');

  const name = nameEl ? nameEl.value.trim() : '';
  const gender = genderEl ? genderEl.value : 'Male';
  const specialty = specialtyEl && specialtyEl.value ? specialtyEl.value : 'General Medicine';
  const councilNo = councilNoEl ? councilNoEl.value.trim() : ('WBMC-' + Math.floor(10000 + Math.random() * 90000));
  const qualification = qualificationEl && qualificationEl.value.trim() ? qualificationEl.value.trim() : 'MBBS, MD';
  const phone = phoneEl ? phoneEl.value.trim() : '';
  const experience = experienceEl ? Number(experienceEl.value) || 8 : 8;
  const chamberAddress = chamberEl ? chamberEl.value.trim() : '';
  const pincode = pincodeEl ? pincodeEl.value.trim() : '';
  const district = districtEl ? districtEl.value.trim() : '';
  const state = stateEl ? stateEl.value.trim() : '';
  const consultFee = feeEl ? (Number(feeEl.value) || 800) : 800;
  const refId = refIdEl ? refIdEl.value.trim() : '';
  const email = emailEl ? emailEl.value.trim() : '';
  const password = passwordEl ? passwordEl.value : '';
  const confirmPassword = confirmPassEl ? confirmPassEl.value : '';
  const isDeclared = declarationEl ? declarationEl.checked : true;

  const errBox = document.getElementById('register-error') || document.getElementById('reg-error');
  const errText = document.getElementById('register-error-text') || document.getElementById('reg-error-text');
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

  // Validations
  if (!name) return showRegErr('Full Practitioner Name is required.');
  if (!gender) return showRegErr('Doctor gender selection is required.');
  if (!specialty) return showRegErr('Clinical specialty selection is required.');
  if (!councilNo) return showRegErr('Medical Council Registration No. is required.');
  if (!qualification) return showRegErr('Medical qualification is required (e.g. MBBS, MD).');
  if (!phone || phone.replace(/\\D/g, '').length < 10) return showRegErr('Valid 10-digit official mobile number is required.');
  if (!chamberAddress) return showRegErr('Chamber Address & Clinic Location is required.');
  if (!pincode) return showRegErr('Postal Pin Code is required.');
  if (!district) return showRegErr('District is required.');
  if (!state) return showRegErr('State is required.');
  if (!refId) return showRegErr('Reference ID is mandatory.');
  if (!email || !email.includes('@')) return showRegErr('Valid official doctor email is required.');
  if (!password || password.length < 8) return showRegErr('Password must be at least 8 characters with letters and numbers.');
  if (confirmPassword && password !== confirmPassword) return showRegErr('Password and Confirm Password do not match.');
  if (!isDeclared) return showRegErr('Please accept the practitioner registration declaration to proceed.');

  if (btnText) btnText.textContent = 'Registering on Secure Server...';
  if (spinner) spinner.classList.remove('hidden');
  if (errBox) errBox.classList.add('hidden');

  // Format clean standardized phone number
  const cleanDigits = phone.replace(/\\D/g, '');
  const formattedPhone = cleanDigits.length === 10 ? ('+91 ' + cleanDigits) : (phone.startsWith('+') ? phone : ('+' + phone));

  try {
    const apiBase = (typeof MEDIX_API_BASE !== 'undefined' && MEDIX_API_BASE) ? MEDIX_API_BASE : '';
    const res = await fetch(apiBase + '/api/v1/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.startsWith('Dr.') || name.startsWith('Dr ') ? name : ('Dr. ' + name),
        email: email,
        phone: formattedPhone,
        password: password,
        confirmPassword: password,
        role: 'doctor',
        branchId: 1,
        details: {
          specialty: specialty,
          department: specialty,
          qualification: qualification,
          registrationNumber: councilNo,
          experienceYears: experience,
          fee: consultFee,
          consultFee: consultFee,
          chamberAddress: chamberAddress,
          pincode: pincode,
          district: district,
          state: state,
          referenceId: refId,
          gender: gender,
          avatarUrl: regDoctorPhotoBase64 || ''
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
}`;

// Update HTML files
const htmlFiles = [
  'public/doctor-app/index.html',
  'public/doctor-app/offline.html',
  'public/doctor-app/HMS_Doctor_Offline_App.html',
  'Hospital_Android_Application/doctor-android/app/src/main/assets/medix/index.html'
];

htmlFiles.forEach(rel => {
  const fullPath = path.join(rootDir, rel);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');

  // Replace auth-section-register in HTML
  const startTag = '<div id="auth-section-register">';
  const endTag = '<!-- SECTION B: EXISTING DOCTOR SIGN IN FORM -->';

  const sIdx = content.indexOf(startTag);
  const eIdx = content.indexOf(endTag);

  if (sIdx !== -1 && eIdx !== -1) {
    content = content.slice(0, sIdx) + NEW_REGISTRATION_HTML + '\n\n                ' + content.slice(eIdx);
    console.log('✅ Updated registration form HTML markup in:', rel);
  } else {
    console.log('⚠️ Could not locate registration form block in:', rel);
  }

  // Also update inline JS if present
  const jsStart = 'let regDoctorPhotoBase64 = null;';
  const jsEnd = 'function togglePasswordVisibility()';
  const jsSIdx = content.indexOf(jsStart);
  const jsEIdx = content.indexOf(jsEnd);

  if (jsSIdx !== -1 && jsEIdx !== -1) {
    // Find where validateServerSession starts inside that block
    const vSessionStart = content.indexOf('async function validateServerSession()', jsSIdx);
    if (vSessionStart !== -1 && vSessionStart < jsEIdx) {
      // Find where handleRegister starts
      const handleRegStart = content.indexOf('async function handleRegister()', vSessionStart);
      if (handleRegStart !== -1 && handleRegStart < jsEIdx) {
        const preSession = content.slice(jsSIdx, vSessionStart);
        const sessionCode = content.slice(vSessionStart, handleRegStart);
        content = content.slice(0, jsSIdx) + NEW_REGISTRATION_JS.split('async function validateServerSession()')[0] + sessionCode + NEW_REGISTRATION_JS.slice(NEW_REGISTRATION_JS.indexOf('async function handleRegister()')) + '\n\n' + content.slice(jsEIdx);
        console.log('✅ Updated inline registration JavaScript in:', rel);
      }
    }
  }

  fs.writeFileSync(fullPath, content, 'utf8');
});

// Update standalone app.js files
const jsFiles = [
  'public/doctor-app/app.js',
  'Hospital_Android_Application/doctor-android/app/src/main/assets/medix/app.js'
];

jsFiles.forEach(rel => {
  const fullPath = path.join(rootDir, rel);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');

  const jsStart = 'let regDoctorPhotoBase64 = null;';
  const jsEnd = 'function togglePasswordVisibility()';
  const jsSIdx = content.indexOf(jsStart);
  const jsEIdx = content.indexOf(jsEnd);

  if (jsSIdx !== -1 && jsEIdx !== -1) {
    const vSessionStart = content.indexOf('async function validateServerSession()', jsSIdx);
    const handleRegStart = content.indexOf('async function handleRegister()', vSessionStart);
    if (vSessionStart !== -1 && handleRegStart !== -1 && handleRegStart < jsEIdx) {
      const sessionCode = content.slice(vSessionStart, handleRegStart);
      const newJsCombined = NEW_REGISTRATION_JS.split('async function handleRegister()')[0] + sessionCode + NEW_REGISTRATION_JS.slice(NEW_REGISTRATION_JS.indexOf('async function handleRegister()')) + '\n\n';
      content = content.slice(0, jsSIdx) + newJsCombined + content.slice(jsEIdx);
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log('✅ Updated standalone registration JavaScript in:', rel);
    }
  }
});

console.log('\n🎉 ALL REGISTRATION SECTIONS AUDITED & UPGRADED SUCCESSFULLY.');
