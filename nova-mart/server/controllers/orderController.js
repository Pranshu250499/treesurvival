import Order from '../models/Order.js';
import Product from '../models/Product.js';
import crypto from 'crypto';

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, paymentId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items provided for order checkout.',
      });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.pinCode) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required.',
      });
    }

    // Verify prices & calculate financials securely on server
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.name} is no longer available.`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient inventory for ${product.name}. Available: ${product.stock}`,
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        product: product._id,
        name: product.name,
        image: item.image || product.images[0],
        price: product.price,
        quantity: item.quantity,
        selectedColor: item.selectedColor || '',
        selectedSize: item.selectedSize || '',
      });

      // Decrement stock
      product.stock -= item.quantity;
      await product.save();
    }

    const shipping = subtotal > 999 ? 0 : 99;
    const discount = req.body.discount ? Number(req.body.discount) : 0;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Math.round(taxableAmount * 0.18); // 18% GST
    const total = taxableAmount + shipping + tax;

    const order = new Order({
      user: req.user._id,
      items: validatedItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'Razorpay' && paymentId ? 'Completed' : 'Pending',
      paymentId: paymentId || '',
      orderStatus: 'Processing',
      subtotal,
      discount,
      shipping,
      tax,
      total,
      statusTimeline: [
        {
          status: 'Processing',
          timestamp: new Date(),
          note: paymentMethod === 'COD' ? 'Order placed via Cash on Delivery.' : 'Payment initiated and order created.',
        },
      ],
    });

    const createdOrder = await order.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: createdOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Razorpay Order / Payment intent
// @route   POST /api/orders/create-payment
// @access  Private
export const createPaymentIntent = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount specified.',
      });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check if live razorpay credentials exist
    if (keyId && keySecret && keyId !== 'rzp_test_placeholder_key') {
      try {
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const response = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            amount: Math.round(amount * 100), // amount in paise
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`,
          }),
        });

        const data = await response.json();
        return res.json({
          success: true,
          isMock: false,
          razorpayOrderId: data.id,
          amount: data.amount,
          currency: 'INR',
          keyId,
        });
      } catch (err) {
        console.warn('Razorpay API error, falling back to instant sandbox simulation:', err.message);
      }
    }

    // High quality mock payment intent for testing & demonstration
    const mockOrderId = `order_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    res.json({
      success: true,
      isMock: true,
      razorpayOrderId: mockOrderId,
      amount: Math.round(amount * 100),
      currency: 'INR',
      keyId: 'rzp_test_mock_mode',
      message: 'Development Sandbox Payment Gateway Active',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/orders/verify-payment
// @access  Private
export const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    let isVerified = false;

    if (keySecret && keySecret !== 'rzp_test_placeholder_secret' && razorpaySignature) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      isVerified = generatedSignature === razorpaySignature;
    } else {
      // Sandbox mode verification
      isVerified = true;
    }

    if (isVerified) {
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order) {
          order.paymentStatus = 'Completed';
          order.paymentId = razorpayPaymentId || `pay_mock_${Date.now()}`;
          order.statusTimeline.push({
            status: 'Confirmed',
            timestamp: new Date(),
            note: 'Payment verified and order confirmed.',
          });
          order.orderStatus = 'Confirmed';
          await order.save();
        }
      }

      return res.json({
        success: true,
        message: 'Payment verified successfully.',
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment verification signature mismatch.',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    // Verify ownership or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order.',
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this order.',
      });
    }

    if (['Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled in '${order.orderStatus}' status.`,
      });
    }

    order.orderStatus = 'Cancelled';
    order.statusTimeline.push({
      status: 'Cancelled',
      timestamp: new Date(),
      note: 'Order was cancelled by the customer.',
    });

    // Restock items
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: 'Order has been successfully cancelled.',
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};
