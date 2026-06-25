'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [network, setNetwork] = useState('mtn');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock listing data
  const listing = {
    title: 'MacBook Pro M2 2023',
    price: 1850000,
    fee: 92500, // 5% Gura Fee
    total: 1942500,
  };

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate API call to process mobile money
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3); // Move to success step
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-heading font-bold text-midnight-ink mb-8 text-center">Secure Checkout</h1>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Column: Form Flow */}
        <div className="flex-1 bg-white p-8 rounded-2xl border border-slate-tint shadow-sm">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-heading font-bold text-midnight-ink mb-6 pb-4 border-b border-slate-tint">
                Step 1: Payment Method
              </h2>
              
              <div className="space-y-4 mb-8">
                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${network === 'mtn' ? 'border-gura-orange bg-gura-orange/5' : 'border-slate-tint hover:border-gura-orange'}`}>
                  <input 
                    type="radio" 
                    name="network" 
                    value="mtn" 
                    checked={network === 'mtn'} 
                    onChange={(e) => setNetwork(e.target.value)}
                    className="w-5 h-5 text-gura-orange focus:ring-gura-orange"
                  />
                  <div>
                    <p className="font-heading font-bold text-midnight-ink">MTN Mobile Money</p>
                    <p className="font-body text-sm text-slate">Pay securely via MTN MoMo</p>
                  </div>
                </label>

                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${network === 'airtel' ? 'border-gura-orange bg-gura-orange/5' : 'border-slate-tint hover:border-gura-orange'}`}>
                  <input 
                    type="radio" 
                    name="network" 
                    value="airtel" 
                    checked={network === 'airtel'} 
                    onChange={(e) => setNetwork(e.target.value)}
                    className="w-5 h-5 text-gura-orange focus:ring-gura-orange"
                  />
                  <div>
                    <p className="font-heading font-bold text-midnight-ink">Airtel Money</p>
                    <p className="font-body text-sm text-slate">Pay securely via Airtel</p>
                  </div>
                </label>
              </div>

              <div className="mb-8">
                <label className="block font-heading font-bold text-midnight-ink mb-2">Mobile Number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-tint bg-slate-tint/30 text-slate font-body">
                    +250
                  </span>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="78X XXX XXX"
                    className="flex-1 p-3 rounded-r-xl border border-slate-tint focus:border-gura-orange focus:ring-1 focus:ring-gura-orange font-body text-midnight-ink outline-none transition-all"
                  />
                </div>
                <p className="mt-2 text-sm font-body text-slate">A prompt will be sent to this phone to confirm payment.</p>
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={phone.length < 8}
                className="w-full bg-midnight-ink text-white font-heading font-bold py-4 rounded-xl hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Review
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-heading font-bold text-midnight-ink mb-6 pb-4 border-b border-slate-tint">
                Step 2: Await Prompt
              </h2>
              <div className="bg-warm-linen p-6 rounded-xl border border-slate-tint mb-8 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-midnight-ink mb-2">Check your phone</h3>
                <p className="font-body text-slate">
                  We have sent a payment request to <span className="font-bold text-midnight-ink">+250 {phone}</span>. Please enter your PIN to authorize the payment of {listing.total.toLocaleString()} RWF.
                </p>
              </div>

              <button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-gura-orange text-white font-heading font-bold py-4 rounded-xl hover:bg-[#d94d00] transition-colors disabled:opacity-70 flex justify-center items-center"
              >
                {isProcessing ? 'Processing Payment...' : 'I have authorized the payment'}
              </button>
              
              <button 
                onClick={() => setStep(1)}
                className="w-full mt-4 text-slate font-heading hover:text-midnight-ink transition-colors py-2"
              >
                Go back
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-malachite/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-malachite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-heading font-bold text-midnight-ink mb-2">Payment Successful!</h2>
              <p className="font-body text-slate mb-8">
                Your order for the {listing.title} has been placed. The seller has been notified.
              </p>
              <Link href="/" className="inline-block bg-midnight-ink text-white font-heading font-bold py-4 px-8 rounded-xl hover:bg-black transition-colors">
                Return to Home
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="w-full md:w-80 flex-shrink-0">
          <div className="bg-slate-tint/20 p-6 rounded-2xl border border-slate-tint sticky top-24">
            <h3 className="font-heading font-bold text-lg text-midnight-ink mb-6 pb-4 border-b border-slate-tint/50">
              Order Summary
            </h3>
            
            <div className="space-y-4 mb-6 pb-6 border-b border-slate-tint/50">
              <div className="flex justify-between">
                <span className="font-body text-slate">{listing.title}</span>
                <span className="font-mono text-midnight-ink">{listing.price.toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between">
                <span className="font-body text-slate">Buyer Protection Fee (5%)</span>
                <span className="font-mono text-midnight-ink">{listing.fee.toLocaleString()} RWF</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <span className="font-heading font-bold text-midnight-ink">Total</span>
              <span className="font-mono font-bold text-2xl text-gura-orange">{listing.total.toLocaleString()} RWF</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-tint">
              <div className="flex items-start gap-3">
                <span className="text-savanna-gold mt-0.5">🛡️</span>
                <div>
                  <h4 className="font-heading font-bold text-sm text-midnight-ink">Gura Protected</h4>
                  <p className="font-body text-xs text-slate mt-1">Your payment is held securely until you receive the item as described.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
