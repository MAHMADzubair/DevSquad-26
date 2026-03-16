import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  size:  { type: String, required: true },   // e.g. "50g", "100g"
  label: { type: String, required: true },   // e.g. "50"
  type:  { type: String, enum: ['bag', 'tin', 'sampler'], default: 'bag' },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 }
});

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category:    { type: String, required: true },
  price:       { type: Number, required: true },   // base price (smallest variant)
  rating:      { type: Number, default: 0, min: 0, max: 5 },
  reviews:     { type: Number, default: 0 },
  flavor:      { type: String, default: '' },
  images:      [{ type: String }],
  origin:      { type: String, default: '' },
  qualities:   [{ type: String }],
  caffeine:    { type: String, default: 'Medium' },
  allergens:   [{ type: String }],
  organic:     { type: Boolean, default: false },
  vegan:       { type: Boolean, default: false },
  servingSize:  { type: String, default: '2 tsp per cup, 6 tsp per pot' },
  waterTemp:    { type: String, default: '100°C' },
  steepingTime: { type: String, default: '3 - 5 minutes' },
  colorAfter:   { type: String, default: '' },
  ingredients:  { type: String, default: '' },
  variants:    [variantSchema],
  stock:       { type: Number, required: true, default: 0 }
}, { timestamps: true });

// Text index for search
productSchema.index({ name: 'text', description: 'text', category: 'text' });

export default mongoose.model('Product', productSchema);
