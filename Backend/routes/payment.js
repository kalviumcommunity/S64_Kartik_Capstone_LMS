import express from 'express';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import { isAuthenticated } from '../middleware/auth.js';
import paypal, { convertToUSD } from '../config/paypal.js';

const router = express.Router();

// Create PayPal order
router.post('/create-order', isAuthenticated, async (req, res) => {
  try {
    const { courseId } = req.body;
    
    // Get course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      studentId: req.user._id,
      courseId: courseId
    });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Convert price to USD
    const usdAmount = convertToUSD(course.price);

    // Create PayPal order
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: usdAmount
        },
        description: `Enrollment for course: ${course.title}`
      }]
    });

    const order = await paypal.client().execute(request);
    
    res.status(200).json({
      orderId: order.result.id,
      amount: course.price, // Return original INR amount
      usdAmount, // Return converted USD amount
      currency: 'USD'
    });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    if (error.statusCode === 401) {
      return res.status(401).json({ message: 'Invalid PayPal credentials' });
    }
    if (error.statusCode === 400) {
      return res.status(400).json({ message: 'Invalid request parameters' });
    }
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Capture PayPal payment and create enrollment
router.post('/capture', isAuthenticated, async (req, res) => {
  try {
    const { orderId, courseId } = req.body;

    // Capture the payment
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    const capture = await paypal.client().execute(request);

    if (capture.result.status !== 'COMPLETED') {
      return res.status(400).json({ 
        message: 'Payment not successful',
        status: capture.result.status 
      });
    }

    // Create enrollment
    const course = await Course.findById(courseId);
    const enrollment = await Enrollment.create({
      studentId: req.user._id,
      courseId: courseId,
      paymentId: capture.result.id,
      orderId: orderId,
      amount: course.price,
      status: 'completed',
      progress: []
    });

    res.status(201).json({
      message: 'Enrollment successful',
      enrollment
    });
  } catch (error) {
    console.error('Error capturing payment:', error);
    if (error.statusCode === 404) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (error.statusCode === 400) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    res.status(500).json({ message: 'Error capturing payment' });
  }
});

export default router; 