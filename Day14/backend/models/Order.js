import mongoose from 'mongoose';

const shippingAddressSchema = new mongoose.Schema({
  fullName:   { type: String, required: true },
  email:      { type: String, required: true },
  phone:      { type: String },
  address:    { type: String, required: true },
  city:       { type: String, required: true },
  postalCode: { type: String, required: true },
  country:    { type: String, required: true, default: 'Netherlands' },
}, { _id: false });

const orderItemSchema = new mongoose.Schema({
  product:     { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:        { type: String, required: true },
  variantSize: { type: String },
  price:       { type: Number, required: true },
  quantity:    { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:           [orderItemSchema],
  shippingAddress: { type: shippingAddressSchema, required: true },
  subtotal:        { type: Number, required: true },
  deliveryFee:     { type: Number, default: 3.95 },
  total:           { type: Number, required: true },
  status:          { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
