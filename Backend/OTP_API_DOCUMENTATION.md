# OTP Service API Documentation

## Overview
The OTP (One-Time Password) service provides secure authentication through email and SMS verification. This service is designed for user registration, login, and password reset functionality.

## Base URL
```
http://localhost:5000/api/otp
```

## Endpoints

### 1. Health Check
**GET** `/health`

Check if the OTP service is running properly.

**Response:**
```json
{
  "success": true,
  "message": "OTP service is healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "OTP Service",
  "version": "1.0.0",
  "features": [
    "Email OTP",
    "SMS OTP", 
    "OTP Verification",
    "Rate Limiting",
    "Auto Expiry"
  ]
}
```

### 2. Send OTP
**POST** `/send`

Send an OTP to the specified email or phone number.

**Request Body:**
```json
{
  "identifier": "user@example.com",
  "purpose": "registration"
}
```

**Parameters:**
- `identifier` (required): Email address or phone number
- `purpose` (optional): Purpose of OTP - "registration", "login", or "password_reset" (default: "registration")

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully to email",
  "data": {
    "identifier": "user@example.com",
    "type": "email",
    "purpose": "registration",
    "expiresAt": "2024-01-15T10:40:00.000Z"
  }
}
```

**Rate Limit:** 3 requests per 5 minutes per IP

### 3. Verify OTP
**POST** `/verify`

Verify the OTP entered by the user.

**Request Body:**
```json
{
  "identifier": "user@example.com",
  "otp": "123456",
  "purpose": "registration"
}
```

**Parameters:**
- `identifier` (required): Email address or phone number
- `otp` (required): 6-digit OTP code
- `purpose` (optional): Purpose of OTP (default: "registration")

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "identifier": "user@example.com",
    "purpose": "registration",
    "verifiedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

**Rate Limit:** 5 verification attempts per 10 minutes per IP

### 4. Resend OTP
**POST** `/resend`

Resend OTP to the same identifier.

**Request Body:**
```json
{
  "identifier": "user@example.com",
  "purpose": "registration"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully to email",
  "data": {
    "identifier": "user@example.com",
    "type": "email",
    "purpose": "registration",
    "expiresAt": "2024-01-15T10:45:00.000Z"
  }
}
```

**Rate Limit:** 3 requests per 5 minutes per IP

### 5. Get OTP Status
**GET** `/status?identifier=user@example.com&purpose=registration`

Get the current status of an OTP (for debugging/demo purposes).

**Query Parameters:**
- `identifier` (required): Email address or phone number
- `purpose` (optional): Purpose of OTP (default: "registration")

**Response:**
```json
{
  "success": true,
  "data": {
    "exists": true,
    "isVerified": false,
    "isExpired": false,
    "attempts": 1,
    "maxAttempts": 3,
    "expiresAt": "2024-01-15T10:40:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Identifier (email or phone) is required"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Too many OTP requests. Please wait 5 minutes before trying again."
}
```

## Usage Examples

### cURL Examples

**Send OTP via Email:**
```bash
curl -X POST http://localhost:5000/api/otp/send \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "user@example.com",
    "purpose": "registration"
  }'
```

**Send OTP via Phone:**
```bash
curl -X POST http://localhost:5000/api/otp/send \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "+1234567890",
    "purpose": "login"
  }'
```

**Verify OTP:**
```bash
curl -X POST http://localhost:5000/api/otp/verify \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "user@example.com",
    "otp": "123456",
    "purpose": "registration"
  }'
```

**Resend OTP:**
```bash
curl -X POST http://localhost:5000/api/otp/resend \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "user@example.com",
    "purpose": "registration"
  }'
```

### JavaScript/Fetch Examples

**Send OTP:**
```javascript
const sendOTP = async (identifier, purpose = 'registration') => {
  try {
    const response = await fetch('http://localhost:5000/api/otp/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, purpose })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
};
```

**Verify OTP:**
```javascript
const verifyOTP = async (identifier, otp, purpose = 'registration') => {
  try {
    const response = await fetch('http://localhost:5000/api/otp/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, otp, purpose })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying OTP:', error);
  }
};
```

## Features

### Security Features
- **Rate Limiting**: Prevents abuse with configurable limits
- **OTP Expiry**: OTPs expire after 10 minutes
- **Attempt Limiting**: Maximum 3 verification attempts per OTP
- **Auto Cleanup**: Expired OTPs are automatically removed from database

### Supported Identifiers
- **Email**: Standard email format validation
- **Phone**: International phone number format support

### OTP Purposes
- **Registration**: New user account creation
- **Login**: Two-factor authentication
- **Password Reset**: Account recovery

## Integration Notes

### For Production Use
To integrate with real OTP providers, update the `sendOTP` method in `otpService.js`:

**Twilio (SMS):**
```javascript
// Install: npm install twilio
import twilio from 'twilio';
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// In sendOTP method:
if (type === 'phone') {
  await client.messages.create({
    body: `Your OTP is: ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: identifier
  });
}
```

**SendGrid (Email):**
```javascript
// Install: npm install @sendgrid/mail
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// In sendOTP method:
if (type === 'email') {
  await sgMail.send({
    to: identifier,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}`,
    html: `<p>Your OTP is: <strong>${otp}</strong></p>`
  });
}
```

### Environment Variables
Add these to your `.env` file for production:

```env
# Twilio (for SMS)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# SendGrid (for Email)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender_email

# OTP Configuration
OTP_EXPIRY_MINUTES=10
OTP_MAX_ATTEMPTS=3
```

## Demo Instructions

For your 3-minute demo video, you can:

1. **Show the API endpoints** using Postman or cURL
2. **Demonstrate the flow**:
   - Send OTP to email/phone
   - Show the mock service response
   - Verify the OTP
   - Show rate limiting in action
3. **Highlight security features**:
   - Rate limiting
   - OTP expiry
   - Attempt limiting
4. **Show the database** (MongoDB) storing OTP records
5. **Explain the integration points** for real providers

The mock service will log OTPs to the console, making it easy to demonstrate the flow during your demo. 