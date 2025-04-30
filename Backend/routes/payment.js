// import express from 'express';
// import crypto from 'crypto';
// import Course from '../models/Course.js';
// import Enrollment from '../models/Enrollment.js';
// import { isAuthenticated } from '../middleware/auth.js';
// import razorpay from '../config/razorpay.js';

// const router = express.Router();

// // Create Razorpay order
// router.post('/create-razorpay-order', isAuthenticated, async (req, res) => {
//   try {
//     const { courseId, amount } = req.body;
    
//     // Get course details
//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }

//     // Check if already enrolled
//     const existingEnrollment = await Enrollment.findOne({
//       studentId: req.user._id,
//       courseId: courseId
//     });
//     if (existingEnrollment) {
//       return res.status(400).json({ message: 'Already enrolled in this course' });
//     }

//     // Create Razorpay order
//     const options = {
//       amount: amount, // amount in paise
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//       notes: {
//         courseId: courseId,
//         userId: req.user._id.toString()
//       }
//     };

//     const order = await razorpay.orders.create(options);
    
//     res.status(200).json(order);
//   } catch (error) {
//     console.error('Error creating Razorpay order:', error);
//     res.status(500).json({ 
//       message: 'Error creating order',
//       error: error.message 
//     });
//   }
// });

// // Verify Razorpay payment and create enrollment
// router.post('/verify-razorpay-payment', isAuthenticated, async (req, res) => {
//   try {
//     const {
//       orderCreationId,
//       razorpayPaymentId,
//       razorpayOrderId,
//       razorpaySignature,
//       courseId
//     } = req.body;

//     // Verify payment signature
//     const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
//     shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
//     const digest = shasum.digest('hex');

//     if (digest !== razorpaySignature) {
//       return res.status(400).json({ 
//         message: 'Transaction not legit!' 
//       });
//     }

//     // Get payment details
//     const payment = await razorpay.payments.fetch(razorpayPaymentId);
    
//     // Create enrollment
//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }

//     const enrollment = await Enrollment.create({
//       studentId: req.user._id,
//       courseId: courseId,
//       paymentId: razorpayPaymentId,
//       orderId: razorpayOrderId,
//       amount: payment.amount / 100, // Convert paise to rupees
//       status: 'completed',
//       progress: []
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Payment verified and enrollment created successfully',
//       enrollment
//     });
//   } catch (error) {
//     console.error('Error verifying payment:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Error verifying payment',
//       error: error.message 
//     });
//   }
// });

// // Get payment details (optional, for verification purposes)
// router.get('/payment/:paymentId', isAuthenticated, async (req, res) => {
//   try {
//     const payment = await razorpay.payments.fetch(req.params.paymentId);
//     res.json(payment);
//   } catch (error) {
//     res.status(500).json({ 
//       message: 'Error fetching payment details',
//       error: error.message 
//     });
//   }
// });

// export default router; 