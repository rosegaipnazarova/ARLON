const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    // 'original' = limited edition, 'echo' = mass produced
    type: { type: String, enum: ['original', 'echo'], required: true },
    price: { type: Number, required: true, min: 0 },
    totalQuantity: { type: Number, required: true, min: 1 },
    remainingQuantity: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    model3DUrl: { type: String, default: '' }, // URL to .glb / .gltf file
    artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
    museumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }, // Museums share Artist model
    dropDate: { type: Date }, // For countdown timer
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Virtual: scarcity percentage
productSchema.virtual('scarcityPercent').get(function () {
  return Math.round((this.remainingQuantity / this.totalQuantity) * 100);
});

productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
