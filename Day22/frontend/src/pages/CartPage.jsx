import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, ChevronRight, Trash2 } from 'lucide-react';
import RecommendedProducts from '../components/product/RecommendedProducts';
import { getCart, updateCartItem, removeFromCart } from '../services/cartService';
import { placeOrder } from '../services/orderService';
import toast from 'react-hot-toast';

const CartItem = ({ item, onUpdate, onRemove }) => {
  const image = item.product?.images?.[0] || "https://images.unsplash.com/photo-1594631252845-29fc4e8c7efc?q=80&w=200&auto=format&fit=crop";

  return (
    <div className="flex justify-between py-6 border-b border-gray-100 last:border-0 items-start">
      <div className="flex gap-6">
        <div className="w-20 h-20 bg-[#F4F4F4] overflow-hidden">
          <img src={image} alt="tea" className="w-full h-full object-cover mix-blend-multiply" />
        </div>
        <div className="flex flex-col justify-between py-1">
          <div>
            <h4 className="text-[12px] font-medium text-[var(--color-brand-primary)] leading-snug">{item.product?.name}</h4>
            <p className="text-[12px] font-medium text-gray-500 leading-snug">{item.variantSize ? `${item.variantSize} bag` : 'Standard'}</p>
          </div>
          <button 
            onClick={() => onRemove(item._id)}
            className="flex items-center gap-1 text-[10px] font-bold tracking-[0.5px] uppercase text-gray-400 hover:text-red-600 self-start mt-4 transition-colors"
          >
            <Trash2 size={12} />
            REMOVE
          </button>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-5 py-1">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onUpdate(item._id, item.quantity - 1)} 
            disabled={item.quantity <= 1}
            className="text-gray-400 hover:text-black disabled:opacity-30"
          >
            <Minus size={12} strokeWidth={2} />
          </button>
          <span className="text-[12px] font-semibold w-4 text-center">{item.quantity}</span>
          <button 
            onClick={() => onUpdate(item._id, item.quantity + 1)} 
            className="text-gray-400 hover:text-black"
          >
            <Plus size={12} strokeWidth={2} />
          </button>
        </div>
        <span className="text-[12px] font-bold text-[var(--color-brand-primary)]">
          €{(item.price * item.quantity).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

const PaymentIcon = ({ bg, text, colors }) => (
  <div className={`w-10 h-6 rounded flex items-center justify-center text-[8px] font-bold text-white ${bg} relative overflow-hidden`}>
    {colors ? (
       <div className="flex items-center justify-center w-full h-full space-x-[-4px]">
         <div className="w-3.5 h-3.5 rounded-full bg-red-500 mix-blend-multiply flex-shrink-0 z-10"></div>
         <div className="w-3.5 h-3.5 rounded-full bg-yellow-500 mix-blend-multiply flex-shrink-0"></div>
       </div>
    ) : text}
  </div>
);

const CartPage = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [step, setStep] = useState(1); // 1: Bag, 2: Delivery, 3: Review
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Netherlands'
  });

  const fetchCart = async () => {
    try {
      const data = await getCart();
      if (data.success) setCart(data.cart);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQty = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      const data = await updateCartItem(itemId, newQty);
      if (data.success) setCart(data.cart);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating quantity');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      const data = await removeFromCart(itemId);
      if (data.success) setCart(data.cart);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error removing item');
    }
  };

  const handleShipingChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    try {
      const data = await placeOrder(shippingAddress);
      if (data.success) {
        setOrderPlaced(true);
        setCart({ items: [], total: 0 });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    }
  };

  if (loading) return <div className="p-20 text-center">Loading cart...</div>;

  if (orderPlaced) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-20 bg-white">
        <h2 className="text-3xl font-bold mb-4 text-green-600">ORDER PLACED!</h2>
        <p className="text-gray-600 mb-8 text-center">Thank you for your purchase. We've received your order and are processing it.</p>
        <Link to="/collection" className="bg-black text-white px-8 py-3 font-semibold uppercase tracking-widest text-[11px]">Continue Shopping</Link>
      </main>
    );
  }

  const deliveryFee = cart.items.length > 0 ? 3.95 : 0;
  const finalTotal = cart.total + deliveryFee;

  return (
    <main className="flex-1 flex flex-col w-full bg-[#FEFEFE]">
      <div className="max-w-[1200px] w-full mx-auto px-8 lg:px-12 py-16">
        
        {/* Stepper Header */}
        <div className="flex items-center justify-between w-full mb-16 text-[12px] font-semibold tracking-[0.5px] uppercase text-[var(--color-brand-primary)]">
          <div className={`flex items-center gap-6 w-full ${step >= 1 ? 'text-black' : 'text-gray-300'}`}>
            <span>1. MY BAG</span>
            <div className={`flex-1 h-[1px] ${step > 1 ? 'bg-black' : 'bg-gray-200'}`}></div>
          </div>
          <div className={`flex items-center gap-6 w-full px-6 ${step >= 2 ? 'text-black' : 'text-gray-300'}`}>
            <span>2. DELIVERY</span>
            <div className={`flex-1 h-[1px] ${step > 2 ? 'bg-black' : 'bg-gray-200'}`}></div>
          </div>
          <div className={`flex items-center justify-end w-auto shrink-0 ${step >= 3 ? 'text-black' : 'text-gray-300'}`}>
            <span>3. REVIEW & PAYMENT</span>
          </div>
        </div>

        {/* Two Columns */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-20">
          
          {/* Left Column */}
          <div className="flex-1 flex flex-col">
            
            {step === 1 && (
              <>
                <div className="flex flex-col border-t border-gray-100 mb-6">
                  {cart.items.length === 0 ? (
                    <div className="py-20 text-center text-gray-500 uppercase tracking-widest text-[11px]">Your bag is empty</div>
                  ) : (
                    cart.items.map((item) => (
                      <CartItem 
                        key={item._id} 
                        item={item} 
                        onUpdate={handleUpdateQty}
                        onRemove={handleRemove}
                      />
                    ))
                  )}
                </div>
                {cart.items.length > 0 && (
                  <div className="flex justify-between items-center py-4 border-t border-gray-200 mb-8">
                    <span className="text-[13px] font-semibold text-gray-600">Subtotal</span>
                    <span className="text-[13px] font-bold text-[var(--color-brand-primary)] text-right pr-1">€{cart.total.toFixed(2)}</span>
                  </div>
                )}
                <Link to="/collection" className="w-[200px] h-12 border border-gray-300 flex items-center justify-center text-[11px] font-semibold tracking-[0.5px] text-gray-600 uppercase hover:bg-gray-50 transition-colors">
                  BACK TO SHOPPING
                </Link>
              </>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-8">
                <h3 className="text-xl font-bold text-[var(--color-brand-primary)] uppercase tracking-widest">Shipping Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Full Name</label>
                    <input name="fullName" value={shippingAddress.fullName} onChange={handleShipingChange} placeholder="John Doe" className="p-3 border border-gray-100 bg-[#F8F8F8] text-[13px] outline-none focus:border-black transition-colors" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Email Address</label>
                    <input name="email" value={shippingAddress.email} onChange={handleShipingChange} placeholder="john@example.com" className="p-3 border border-gray-100 bg-[#F8F8F8] text-[13px] outline-none focus:border-black transition-colors" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Phone Number</label>
                    <input name="phone" value={shippingAddress.phone} onChange={handleShipingChange} placeholder="+31 6 12345678" className="p-3 border border-gray-100 bg-[#F8F8F8] text-[13px] outline-none focus:border-black transition-colors" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Address</label>
                    <input name="address" value={shippingAddress.address} onChange={handleShipingChange} placeholder="Street Name 123" className="p-3 border border-gray-100 bg-[#F8F8F8] text-[13px] outline-none focus:border-black transition-colors" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">City</label>
                    <input name="city" value={shippingAddress.city} onChange={handleShipingChange} placeholder="Amsterdam" className="p-3 border border-gray-100 bg-[#F8F8F8] text-[13px] outline-none focus:border-black transition-colors" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Postal Code</label>
                    <input name="postalCode" value={shippingAddress.postalCode} onChange={handleShipingChange} placeholder="1234 AB" className="p-3 border border-gray-100 bg-[#F8F8F8] text-[13px] outline-none focus:border-black transition-colors" />
                  </div>
                </div>
                <button onClick={() => setStep(1)} className="text-[11px] font-bold uppercase text-gray-400 hover:text-black self-start">← Back to Bag</button>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-8">
                <h3 className="text-xl font-bold text-[var(--color-brand-primary)] uppercase tracking-widest">Review your order</h3>
                <div className="bg-[#F8F8F8] p-6 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-[11px] font-bold uppercase text-gray-400 mb-2">Shipping to</h4>
                      <p className="text-[13px] font-medium">{shippingAddress.fullName}</p>
                      <p className="text-[13px] text-gray-600">{shippingAddress.address}, {shippingAddress.city}</p>
                      <p className="text-[13px] text-gray-600">{shippingAddress.postalCode}, {shippingAddress.country}</p>
                    </div>
                    <button onClick={() => setStep(2)} className="text-[10px] font-bold uppercase text-gray-400 hover:text-black">Edit</button>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="text-[11px] font-bold uppercase text-gray-400">Items ({cart.items.length})</h4>
                  {cart.items.map(item => (
                    <div key={item._id} className="flex justify-between items-center text-[13px]">
                      <span>{item.quantity}x {item.product?.name}</span>
                      <span className="font-bold">€{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setStep(2)} className="text-[11px] font-bold uppercase text-gray-400 hover:text-black self-start">← Back to Delivery</button>
              </div>
            )}

          </div>

          {/* Right Column - Summaries */}
          <div className="w-full lg:w-[380px] flex flex-col gap-6 shrink-0">
            
            {/* Order Summary */}
            <div className="bg-[#F8F8F8] p-8">
              <h3 className="text-lg font-medium text-[var(--color-brand-primary)] mb-6">Order summery</h3>
              <div className="flex justify-between text-[12px] font-medium text-gray-600 mb-4">
                <span>Subtotal</span>
                <span className="font-bold text-gray-800">€{cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[12px] font-medium text-gray-600 mb-6">
                <span>Delivery</span>
                <span className="font-bold text-gray-800">€{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[13px] border-t border-gray-300 pt-6 mb-4">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-bold text-gray-800">€{finalTotal.toFixed(2)}</span>
              </div>
              <div className="text-[11px] font-medium text-gray-500 mb-8">
                Estimated shipping time: 2 days
              </div>
              
              {step === 1 && (
                <button 
                  onClick={() => setStep(2)}
                  disabled={cart.items.length === 0}
                  className="w-full h-12 bg-[#222] text-white text-[11px] font-medium tracking-[0.5px] uppercase hover:bg-black transition-colors disabled:opacity-50"
                >
                  GO TO DELIVERY
                </button>
              )}

              {step === 2 && (
                <button 
                  onClick={() => {
                    if(!shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
                      return toast.error("Please fill in all required shipping fields");
                    }
                    setStep(3);
                  }}
                  className="w-full h-12 bg-[#222] text-white text-[11px] font-medium tracking-[0.5px] uppercase hover:bg-black transition-colors"
                >
                  GO TO REVIEW
                </button>
              )}

              {step === 3 && (
                <button 
                  onClick={handleCheckout}
                  className="w-full h-12 bg-black text-white text-[11px] font-bold tracking-[1px] uppercase hover:bg-gray-800 transition-colors"
                >
                  PURCHASE €{finalTotal.toFixed(2)}
                </button>
              )}
            </div>


            {/* Payment Type */}
            <div className="bg-[#F8F8F8] p-8">
              <h3 className="text-[15px] font-medium text-[var(--color-brand-primary)] mb-6">Payment type</h3>
              <div className="flex gap-3">
                <PaymentIcon bg="bg-[#1A1F71]" text="VISA" />
                <PaymentIcon bg="bg-gray-800" text="" colors={true} />
                <PaymentIcon bg="bg-blue-600" text="Pay" />
                <PaymentIcon bg="bg-[#E40046]" text="iDEAL" />
                <PaymentIcon bg="bg-[#002f5a]" text="Ban" />
              </div>
            </div>

            {/* Delivery and Retour */}
            <div className="bg-[#F8F8F8] p-8">
              <h3 className="text-[15px] font-medium text-[var(--color-brand-primary)] mb-6">Delivery and retour</h3>
              <ul className="space-y-4">
                {[
                  "Order before 12:00 and we will ship the same day.",
                  "Orders made after Friday 12:00 are processed on Monday.",
                  "To return your articles, please contact us first.",
                  "Postal charges for retour are not reimbursed."
                ].map((text, i) => (
                  <li key={i} className="flex gap-3 items-start text-[10px] font-medium leading-relaxed text-gray-600">
                    <ChevronRight size={12} className="shrink-0 mt-0.5" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </div>
      <RecommendedProducts title="Popular this season" />
    </main>
  );
};

export default CartPage;
