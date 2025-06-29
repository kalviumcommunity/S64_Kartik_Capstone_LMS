# OTP Service Implementation

## Overview
This implementation provides a complete OTP (One-Time Password) service for user authentication in the LMS project. The service supports both email and SMS verification with comprehensive security features.

## 🚀 Quick Start

### 1. Start the Backend Server
```bash
cd Backend
npm install
npm run dev
```

### 2. Test the OTP Service
```bash
# Run the test script
node test-otp.js
```

### 3. Access the Demo
- **API Health Check**: http://localhost:5000/api/otp/health
- **Frontend Demo**: Add OTPDemoPage to your React app

## 📁 File Structure

```
Backend/
├── models/
│   └── OTP.js                 # OTP database model
├── services/
│   └── otpService.js          # OTP business logic
├── controllers/
│   └── otpController.js       # HTTP request handlers
├── routes/
│   └── otp.js                 # API routes
├── test-otp.js               # Test script
├── OTP_API_DOCUMENTATION.md  # Complete API docs
└── OTP_README.md             # This file

client/src/
├── components/
│   └── OTPDemo.jsx           # React demo component
└── pages/
    └── OTPDemoPage.jsx       # Demo page
```

## 🔧 API Endpoints

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| GET | `/api/otp/health` | Health check | None |
| POST | `/api/otp/send` | Send OTP | 3/5min |
| POST | `/api/otp/verify` | Verify OTP | 5/10min |
| POST | `/api/otp/resend` | Resend OTP | 3/5min |
| GET | `/api/otp/status` | Get OTP status | None |

## 🛡️ Security Features

### Rate Limiting
- **Send OTP**: 3 requests per 5 minutes per IP
- **Verify OTP**: 5 attempts per 10 minutes per IP
- **Resend OTP**: 3 requests per 5 minutes per IP

### OTP Security
- **Expiry**: 10 minutes automatic expiry
- **Attempt Limiting**: Maximum 3 verification attempts per OTP
- **Auto Cleanup**: Expired OTPs automatically removed from database
- **Input Validation**: Email and phone number format validation

### Database Security
- **TTL Index**: Automatic cleanup of expired OTPs
- **Encryption**: OTPs stored securely in database
- **Audit Trail**: Timestamps and attempt tracking

## 📱 Supported Identifiers

### Email Format
```
user@example.com
admin@company.org
test.user+tag@domain.co.uk
```

### Phone Format
```
+1234567890
+44 20 7946 0958
+1 (555) 123-4567
```

## 🎯 OTP Purposes

1. **Registration**: New user account creation
2. **Login**: Two-factor authentication
3. **Password Reset**: Account recovery

## 🔄 Complete Flow Example

### 1. Send OTP
```bash
curl -X POST http://localhost:5000/api/otp/send \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "user@example.com",
    "purpose": "registration"
  }'
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
    "expiresAt": "2024-01-15T10:40:00.000Z"
  }
}
```

### 2. Check Server Console
The mock service logs the actual OTP to the console:
```
📱 Mock OTP Service: 123456 sent to user@example.com (email)
```

### 3. Verify OTP
```bash
curl -X POST http://localhost:5000/api/otp/verify \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "user@example.com",
    "otp": "123456",
    "purpose": "registration"
  }'
```

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

## 🧪 Testing

### Automated Test
```bash
cd Backend
node test-otp.js
```

### Manual Testing with cURL
```bash
# 1. Health check
curl http://localhost:5000/api/otp/health

# 2. Send OTP
curl -X POST http://localhost:5000/api/otp/send \
  -H "Content-Type: application/json" \
  -d '{"identifier": "test@example.com", "purpose": "registration"}'

# 3. Get status
curl "http://localhost:5000/api/otp/status?identifier=test@example.com&purpose=registration"

# 4. Verify OTP (use the code from server console)
curl -X POST http://localhost:5000/api/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"identifier": "test@example.com", "otp": "123456", "purpose": "registration"}'
```

## 🎬 Demo Video Script

### 3-Minute Demo Structure

**0:00 - 0:30: Introduction**
- Show the project structure
- Explain OTP service purpose
- Highlight security features

**0:30 - 1:30: API Demonstration**
- Show health check endpoint
- Send OTP via email
- Show server console with generated OTP
- Verify OTP successfully
- Demonstrate rate limiting

**1:30 - 2:15: Security Features**
- Show database structure
- Demonstrate attempt limiting
- Show OTP expiry functionality
- Display rate limiting in action

**2:15 - 3:00: Integration & Conclusion**
- Show frontend demo component
- Explain production integration points
- Highlight key benefits and features

### Key Points to Highlight
1. **RESTful API Design**: Clean, consistent endpoints
2. **Security**: Rate limiting, expiry, attempt limiting
3. **Flexibility**: Email and SMS support
4. **Scalability**: Database storage with auto-cleanup
5. **Production Ready**: Easy integration with real providers

## 🔧 Production Integration

### Replace Mock Service

**For SMS (Twilio):**
```javascript
// Install: npm install twilio
import twilio from 'twilio';
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// In otpService.js sendOTP method:
if (type === 'phone') {
  await client.messages.create({
    body: `Your OTP is: ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: identifier
  });
}
```

**For Email (SendGrid):**
```javascript
// Install: npm install @sendgrid/mail
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// In otpService.js sendOTP method:
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
```env
# Twilio (SMS)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# SendGrid (Email)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender_email

# OTP Configuration
OTP_EXPIRY_MINUTES=10
OTP_MAX_ATTEMPTS=3
```

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```bash
# Ensure MongoDB is running
mongod
```

**2. Rate Limiting Error**
```bash
# Wait for rate limit window to reset
# Check rate limit headers in response
```

**3. OTP Not Found**
```bash
# Check if OTP has expired
# Verify identifier and purpose match
# Check server console for generated OTP
```

**4. Invalid Identifier**
```bash
# Ensure email format: user@domain.com
# Ensure phone format: +1234567890
```

## 📊 Monitoring & Logging

### Server Logs
The service logs important events:
```
📱 Mock OTP Service: 123456 sent to user@example.com (email)
✅ OTP verified successfully for user@example.com
❌ Invalid OTP attempt for user@example.com
```

### Database Monitoring
```javascript
// Check OTP collection
db.otps.find().sort({createdAt: -1}).limit(10)

// Check expired OTPs
db.otps.find({expiresAt: {$lt: new Date()}})
```

## 🎯 Next Steps

1. **Integration**: Connect with real SMS/Email providers
2. **Frontend**: Integrate OTP flow into registration/login pages
3. **Security**: Add CAPTCHA for repeated failures
4. **Analytics**: Add OTP usage metrics
5. **Testing**: Add comprehensive unit and integration tests

## 📞 Support

For questions or issues:
1. Check the API documentation
2. Review the test script
3. Check server logs for errors
4. Verify MongoDB connection

---

**Happy Coding! 🚀** 