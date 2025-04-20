import asyncHandler from 'express-async-handler';
import RentalAgreement from '../models/rentalAgreementModel.js';
import Booking from '../models/bookingModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import { generateSerialNumber } from '../utils/serialNumberGenerator.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Create a rental agreement for a booking
// @route   POST /api/rental-agreements
// @access  Private
const createRentalAgreement = asyncHandler(async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      res.status(400);
      throw new Error('Booking ID is required');
    }

    // Find the booking
    const booking = await Booking.findById(bookingId).populate('product user');

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    console.log('Booking data:', {
      bookingId,
      user: booking.user,
      product: booking.product,
      startDate: booking.startDate,
      endDate: booking.endDate,
      totalPrice: booking.totalPrice,
    });

    // Check if agreement already exists
    const existingAgreement = await RentalAgreement.findOne({ booking: bookingId });
    if (existingAgreement) {
      res.status(400);
      throw new Error('Rental agreement already exists for this booking');
    }

    // Generate a random serial number for the bike
    const serialNumber = generateSerialNumber();

    // Create PDF directory if it doesn't exist
    const pdfDir = path.join(__dirname, '../../uploads/agreements');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    // Generate PDF filename
    const pdfFilename = `agreement-${bookingId}.pdf`;
    const pdfPath = path.join(pdfDir, pdfFilename);

    // Create PDF
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // Add content to PDF
    doc.fontSize(20).text('Rental Agreement', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text('Customer Information:');
    doc.fontSize(10).text(`Name: ${booking.user.name}`);
    doc.text(`Email: ${booking.user.email}`);
    doc.text(`Phone: ${booking.user.phone || 'N/A'}`);
    doc.moveDown();

    doc.fontSize(12).text('Bike Details:');
    doc.fontSize(10).text(`Name: ${booking.product.name}`);
    doc.text(`Model: ${booking.product.brand || 'N/A'}`);
    doc.text(`Serial Number: ${serialNumber}`);
    doc.moveDown();

    doc.fontSize(12).text('Rental Terms:');
    doc.fontSize(10).text(`Start Date: ${new Date(booking.startDate).toLocaleDateString()}`);
    doc.text(`End Date: ${new Date(booking.endDate).toLocaleDateString()}`);
    doc.text(`Total Price: $${booking.totalPrice}`);
    doc.moveDown();

    doc.fontSize(12).text('Terms and Conditions:');
    doc.fontSize(10).text('1. The renter is responsible for the bike during the rental period.');
    doc.text('2. The bike must be returned in the same condition as received.');
    doc.text('3. Any damage will be charged to the renter.');
    doc.text('4. The rental period cannot be extended without prior approval.');
    doc.text('5. The bike must be returned on or before the end date.');

    // Finalize PDF
    doc.end();

    // Wait for the stream to finish
    await new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    // Create the rental agreement
    const rentalAgreement = await RentalAgreement.create({
      booking: bookingId,
      customer: {
        name: booking.user.username || booking.user.name,
        email: booking.user.email,
        phone: booking.user.phone || 'N/A',
      },
      bike: {
        name: booking.product.name,
        model: booking.product.brand || 'N/A',
        serialNumber,
      },
      rentalTerms: {
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalPrice: booking.totalPrice,
      },
      pdfUrl: `/uploads/agreements/${pdfFilename}`,
    });

    res.status(201).json(rentalAgreement);
  } catch (error) {
    console.error('Error creating rental agreement:', error);
    res.status(500).json({
      message: error.message || 'Error creating rental agreement',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

// @desc    Get rental agreement by booking ID
// @route   GET /api/rental-agreements/booking/:bookingId
// @access  Private
const getRentalAgreementByBooking = asyncHandler(async (req, res) => {
  try {
    const rentalAgreement = await RentalAgreement.findOne({ booking: req.params.bookingId });

    if (!rentalAgreement) {
      res.status(404);
      throw new Error('Rental agreement not found');
    }

    res.json(rentalAgreement);
  } catch (error) {
    console.error('Error getting rental agreement:', error);
    res.status(500).json({
      message: error.message || 'Error getting rental agreement',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

export { createRentalAgreement, getRentalAgreementByBooking };
