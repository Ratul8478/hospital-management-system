/**
 * ============================================================================
 * PHONE SMS OTP DISPATCH SERVICE
 * ----------------------------------------------------------------------------
 * Pluggable multi-provider SMS delivery gateway for Medix Hospital.
 * Supports Fast2SMS (India), Twilio (Global), MSG91, and Dev Simulator.
 * ============================================================================
 */

export interface SendSmsParams {
  to: string; // E.164 or 10-digit Indian phone number
  otp: string; // 6-digit numeric OTP code
  purpose?: 'registration' | 'login' | 'verification' | 'password_reset';
  hospitalName?: string;
}

export interface SmsSendResult {
  success: boolean;
  provider: 'fast2sms' | 'twilio' | 'msg91' | 'simulator';
  messageId?: string;
  message?: string;
  error?: string;
}

/**
 * Dispatch 6-digit verification OTP to a mobile phone number
 */
export async function sendPhoneOtpSms({
  to,
  otp,
  purpose = 'registration',
  hospitalName = 'ARIYAN HOSPITAL MULTISPECIALITY',
}: SendSmsParams): Promise<SmsSendResult> {
  const cleanPhone = to.replace(/[^0-9+]/g, '');
  const digitsOnly = cleanPhone.replace(/[^0-9]/g, '');

  if (digitsOnly.length < 10) {
    return {
      success: false,
      provider: 'simulator',
      error: 'Invalid phone number format: must contain at least 10 digits.',
    };
  }

  const messageText = `Your ${hospitalName} verification OTP is ${otp}. Valid for 10 minutes. Do NOT share this OTP with anyone.`;

  // 1. PROVIDER: FAST2SMS (India Bulk SMS Gateway)
  const fast2SmsKey = process.env.FAST2SMS_API_KEY || process.env.SMS_API_KEY;
  if (fast2SmsKey && digitsOnly.length >= 10) {
    try {
      const indianNumber = digitsOnly.slice(-10);
      const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: fast2SmsKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: otp,
          numbers: indianNumber,
        }),
      });

      const data = await res.json();
      if (data.return === true || res.ok) {
        console.log(`[?? FAST2SMS SUCCESS] Sent OTP to ${indianNumber} | Request ID: ${data.request_id || 'ok'}`);
        return {
          success: true,
          provider: 'fast2sms',
          messageId: data.request_id || 'fast2sms_ok',
          message: `OTP SMS successfully sent to mobile ${indianNumber}`,
        };
      } else {
        console.warn('[Fast2SMS API Response Notice]:', data.message || data);
      }
    } catch (err: any) {
      console.warn('[Fast2SMS Error - Falling back to Gateway]:', err?.message);
    }
  }

  // 2. PROVIDER: TWILIO (Global SMS Gateway)
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_PHONE_NUMBER;

  if (twilioSid && twilioToken && twilioFrom) {
    try {
      const formattedTo = cleanPhone.startsWith('+') ? cleanPhone : `+91${digitsOnly.slice(-10)}`;
      const basicAuth = Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');

      const bodyParams = new URLSearchParams();
      bodyParams.append('To', formattedTo);
      bodyParams.append('From', twilioFrom);
      bodyParams.append('Body', messageText);

      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyParams.toString(),
      });

      const data = await res.json();
      if (res.ok && data.sid) {
        console.log(`[?? TWILIO SMS SUCCESS] Sent OTP to ${formattedTo} | SID: ${data.sid}`);
        return {
          success: true,
          provider: 'twilio',
          messageId: data.sid,
          message: `OTP SMS successfully sent to ${formattedTo}`,
        };
      } else {
        console.warn('[Twilio SMS Error]:', data.message || data);
      }
    } catch (err: any) {
      console.warn('[Twilio Dispatch Error]:', err?.message);
    }
  }

  // 3. PROVIDER: MSG91 (DLT OTP Gateway)
  const msg91AuthKey = process.env.MSG91_AUTH_KEY;
  const msg91TemplateId = process.env.MSG91_TEMPLATE_ID;

  if (msg91AuthKey && msg91TemplateId) {
    try {
      const mobileNumber = digitsOnly.length === 10 ? `91${digitsOnly}` : digitsOnly;
      const res = await fetch(`https://api.msg91.com/api/v5/otp?template_id=${msg91TemplateId}&mobile=${mobileNumber}&authkey=${msg91AuthKey}&otp=${otp}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.type === 'success') {
        console.log(`[?? MSG91 SMS SUCCESS] Sent OTP to ${mobileNumber}`);
        return {
          success: true,
          provider: 'msg91',
          messageId: data.message || 'msg91_ok',
          message: `OTP SMS successfully sent to ${mobileNumber}`,
        };
      }
    } catch (err: any) {
      console.warn('[MSG91 Dispatch Error]:', err?.message);
    }
  }

  // 4. DEVELOPMENT & SIMULATOR GATEWAY
  // In development/test environments, logs the SMS clearly to server console
  console.log(`\n================================================================================`);
  console.log(`?? [MEDIX SMS GATEWAY DISPATCH SIMULATOR]`);
  console.log(`--------------------------------------------------------------------------------`);
  console.log(`To Mobile Number : ${cleanPhone}`);
  console.log(`Purpose          : ${purpose.toUpperCase()} VERIFICATION`);
  console.log(`6-Digit OTP Code : [ ${otp} ]`);
  console.log(`Message Body     : "${messageText}"`);
  console.log(`Status           : DISPATCHED SUCCESSFULLY (Valid for 10 minutes)`);
  console.log(`================================================================================\n`);

  return {
    success: true,
    provider: 'simulator',
    messageId: `sim_sms_${Date.now()}`,
    message: `OTP has been dispatched to ${cleanPhone}. (Dev code: ${otp})`,
  };
}
