import React, { useState } from 'react';

interface ContactViewProps {
  onShowToast: (msg: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onShowToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    purpose: 'general',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    onShowToast('Message received! Our family concierge will contact you within 2 hours.');
  };

  return (
    <div id="contact-view" className="w-full py-12 lg:py-16 bg-[#fff8f2]">
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs text-[#af1820] uppercase tracking-widest font-bold block mb-2">
            WE ARE ALWAYS DELIGHTED TO TALK SPICES
          </span>
          <h1 className="font-headline-lg text-4xl sm:text-5xl text-[#241a04] mb-3">
            Courtyard Concierge
          </h1>
          <p className="text-base text-[#5b403e]">
            Have a question regarding heirloom spice recipes, custom wedding gifting hampers, or wholesale bulk shipments?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-[#fff2df] rounded-2xl border border-[#ebd3aa] shadow-xs">
              <h3 className="font-headline-sm text-2xl text-[#241a04] mb-4">
                Instant WhatsApp Order
              </h3>
              <p className="text-xs sm:text-sm text-[#5b403e] mb-4 leading-relaxed">
                Connect directly with our courtyard team for instantaneous custom packing, courier tracking, and regional queries.
              </p>
              <a
                href="https://wa.me/917396311063?text=Namaste%20Kamala%20Ruchi,%20I%20would%20like%20to%20place%20an%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#876c45] text-[#fff4eb] px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#6d542f] transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                WhatsApp: +91 73963 11063
              </a>
            </div>

            <div className="p-6 bg-[#ffebcb] rounded-2xl border border-[#ebd3aa] shadow-xs space-y-4 text-xs text-[#5b403e]">
              <div>
                <span className="font-bold text-[#241a04] block text-sm mb-1">
                  Courtyard Roastery &amp; Packing:
                </span>
                <p>
                  Kamala Ruchi Heritage Spice Sanctum, <br />
                  Amma Vari Veedhi, Srikakulam District, <br />
                  Andhra Pradesh, 532001, India.
                </p>
              </div>

              <div className="pt-2 border-t border-[#ebd3aa]">
                <span className="font-bold text-[#241a04] block text-sm mb-1">
                  Daily Roasting Hours:
                </span>
                <p>Monday to Saturday: 6:00 AM – 7:30 PM (IST)</p>
                <p>Sunday: 7:00 AM – 1:00 PM (Special Sambar batch)</p>
              </div>

              <div className="pt-2 border-t border-[#ebd3aa]">
                <span className="font-bold text-[#241a04] block text-sm mb-1">
                  Wedding &amp; Festive Hampers:
                </span>
                <p>Custom brass jars and jute gift boxes available with customized family seal.</p>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 bg-white rounded-2xl border border-[#ebd3aa] shadow-md">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#ffebcb] text-[#af1820] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#ebd3aa]">
                  <span className="material-symbols-outlined text-3xl">mark_email_read</span>
                </div>
                <h3 className="font-headline-sm text-2xl text-[#241a04] mb-2">
                  Message Dispatched
                </h3>
                <p className="text-sm text-[#5b403e] mb-6 max-w-sm mx-auto">
                  Thank you for reaching out to Kamala Ruchi. Kamala Garu or our roastery team will get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-[#af1820] text-white px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
                  type="button"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-headline-sm text-2xl text-[#241a04] mb-2">
                  Send a Note to Our Roastery
                </h3>
                <p className="text-xs text-[#5b403e] mb-4">
                  Fill in your requirements below and we will get back to you promptly.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5b403e] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Venkat Reddy"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[#fff8f2] text-[#241a04] rounded-lg text-xs border border-[#ebd3aa] focus:outline-none focus:ring-1 focus:ring-[#af1820]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5b403e] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="WhatsApp contact"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-[#fff8f2] text-[#241a04] rounded-lg text-xs border border-[#ebd3aa] focus:outline-none focus:ring-1 focus:ring-[#af1820]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5b403e] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-[#fff8f2] text-[#241a04] rounded-lg text-xs border border-[#ebd3aa] focus:outline-none focus:ring-1 focus:ring-[#af1820]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5b403e] mb-1">
                      Inquiry Nature
                    </label>
                    <select
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      className="w-full px-3 py-2 bg-[#fff8f2] text-[#241a04] rounded-lg text-xs border border-[#ebd3aa] focus:outline-none focus:ring-1 focus:ring-[#af1820]"
                    >
                      <option value="general">Personal Order Query</option>
                      <option value="wedding">Wedding / Festive Gifting</option>
                      <option value="wholesale">Wholesale / NRI Shipment</option>
                      <option value="recipe">Grandmother Recipe Advice</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5b403e] mb-1">
                    Your Message / Spice Requirements *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what you're looking for..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 bg-[#fff8f2] text-[#241a04] rounded-lg text-xs border border-[#ebd3aa] focus:outline-none focus:ring-1 focus:ring-[#af1820]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#af1820] hover:bg-[#d23435] text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-xs hover:shadow cursor-pointer"
                >
                  Transmit Message to Kamala Ruchi
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
