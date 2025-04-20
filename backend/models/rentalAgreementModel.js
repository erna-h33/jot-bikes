import mongoose from 'mongoose';

const rentalAgreementSchema = mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Booking',
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    bike: {
      name: { type: String, required: true },
      model: { type: String, required: true },
      serialNumber: { type: String, required: true },
    },
    rentalTerms: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      totalPrice: { type: Number, required: true },
    },
    pdfUrl: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ['active', 'completed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const RentalAgreement = mongoose.model('RentalAgreement', rentalAgreementSchema);

export default RentalAgreement;
