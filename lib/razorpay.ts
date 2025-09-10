import Razorpay from 'razorpay';

// Only initialize Razorpay if environment variables are available
export const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

export const RAZORPAY_CONFIG = {
  key_id: process.env.RAZORPAY_KEY_ID!,
  currency: 'INR',
  name: 'LeadX',
  description: 'Sales Intelligence Platform',
  theme: {
    color: '#111827'
  }
};
