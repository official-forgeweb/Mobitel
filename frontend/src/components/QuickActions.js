"use client";
import { useState, useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";

export default function QuickActions() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Data fetching states
  const [brands, setBrands] = useState([]);
  const [allModels, setAllModels] = useState([]);
  const [services, setServices] = useState([]);
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [priceDetails, setPriceDetails] = useState({ price: 0, priceMax: null });
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    brandId: "",
    modelId: "",
    serviceId: "",
    issue: "",
    serviceType: "", // "Home Service" or "Shop Visit"
    address: "",
    name: "",
    phone: "",
    email: "", // Needed for Razorpay
    payment_mode: "online_full", // default to online payment
  });



  // Initial Data Fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [bRes, mRes, sRes, pRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/brands`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/device-models`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/services`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/razorpay/payment-settings`)
        ]);
        setBrands(await bRes.json());
        setAllModels(await mRes.json());
        setServices(await sRes.json());
        setPaymentSettings(await pRes.json());
      } catch (err) {
        console.error("Failed to fetch form data", err);
      }
    };
    fetchInitialData();
  }, []);

  // Filter models based on selected brand
  const filteredModels = allModels.filter(m => m.brandId?._id === formData.brandId || m.brandId === formData.brandId);

  // Fetch Pricing when combo changes
  useEffect(() => {
    const fetchPricing = async () => {
      if (!formData.brandId || !formData.modelId || !formData.serviceId) {
        setPriceDetails({ price: 0, priceMax: null });
        return;
      }
      setIsLoadingPrice(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/pricing?brandId=${formData.brandId}&modelId=${formData.modelId}&serviceId=${formData.serviceId}`);
        const data = await res.json();
        if (data && data.length > 0) {
          setPriceDetails({ price: data[0].price, priceMax: data[0].priceMax });
        } else {
          setPriceDetails({ price: 0, priceMax: null });
        }
      } catch (err) {
        console.error("Error fetching pricing", err);
      } finally {
        setIsLoadingPrice(false);
      }
    };
    fetchPricing();
  }, [formData.brandId, formData.modelId, formData.serviceId]);

  const handleOpenModal = (serviceId = "") => {
    setFormData(prev => ({ ...prev, serviceId }));
    setStep(1);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setStep(1);
      setFormData({ brandId: "", modelId: "", serviceId: "", issue: "", serviceType: "", address: "", name: "", phone: "", email: "", payment_mode: "online_full" });
      setPriceDetails({ price: 0, priceMax: null });
    }, 300);
  };



  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.brandId || !formData.modelId || !formData.serviceId) {
         return alert("Please select Brand, Model, and Service.");
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.serviceType) {
        return alert("Please select a service type (Home Service or Shop Visit).");
      }
      const brandObj = brands.find(b => b._id === formData.brandId) || { name: "Unknown" };
      const modelObj = allModels.find(m => m._id === formData.modelId) || { name: "Unknown" };
      const serviceObj = services.find(s => s._id === formData.serviceId) || { name: "Unknown" };

      const params = new URLSearchParams({
        brand: brandObj.name,
        brandId: formData.brandId,
        model: modelObj.name,
        modelId: formData.modelId,
        serviceType: serviceObj.name,
        serviceId: formData.serviceId,
        visitType: formData.serviceType,
        issue: formData.issue,
        price: priceDetails.price || 0
      });

      console.log("Redirecting to checkout with params:", params.toString());
      handleCloseModal();
      router.push(`/booking/checkout?${params.toString()}`);
    }
  };

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isModalOpen]);


  return (
    <>
      {/* Desktop floating right panel */}
      <div className="hidden xl:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 flex-col bg-white shadow-2xl border border-border border-r-0 rounded-l-2xl overflow-hidden">
        <div className="bg-primary px-3 py-3">
          <p className="text-white text-[10px] font-bold uppercase tracking-widest text-center">Quick Fix</p>
        </div>
        {services.slice(0, 6).map((s) => (
          <button
            key={s._id}
            onClick={() => handleOpenModal(s._id)}
            className="group flex items-center gap-2 px-4 py-3 text-xs font-bold text-dark hover:bg-primary hover:text-white border-b border-border last:border-0 transition-all duration-300 whitespace-nowrap text-left"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-white transition-colors shrink-0" />
            {s.name}
          </button>
        ))}
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border shadow-[0_-8px_30px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted leading-none">Need your phone fixed?</p>
            <p className="text-sm font-bold text-dark mt-0.5">Book a quick repair</p>
          </div>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="bg-primary text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-dark transition-colors shrink-0 shadow-md"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Mobile Actions Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:px-4 xl:hidden">
          <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm transition-opacity" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-dark">Select Repair</h3>
              <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 rounded-full bg-surface flex items-center justify-center">
                <svg className="w-4 h-4 text-body" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
              {services.map((s) => (
                <button
                  key={s._id}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleOpenModal(s._id);
                  }}
                  className="flex items-center justify-between w-full px-4 py-3.5 bg-surface hover:bg-primary hover:text-white rounded-xl text-sm font-bold text-dark transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover:bg-white" />
                    {s.name}
                  </div>
                  <svg className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-dark/20 backdrop-blur-sm transition-opacity" onClick={handleCloseModal}></div>

          <div className="absolute bottom-0 right-0 w-full md:w-[450px] bg-white rounded-t-3xl md:rounded-tl-3xl md:rounded-tr-none md:rounded-l-3xl p-6 md:p-8 shadow-2xl animate-in slide-in-from-bottom md:slide-in-from-right duration-300 ease-out border-t md:border-t-0 md:border-l border-border h-[85vh] md:h-full md:max-h-screen flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6 shrink-0">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-primary-light text-primary text-[10px] font-bold tracking-wider uppercase mb-2">
                  Step {step} of 2 : {step === 1 ? "Details" : "Visit Type"}
                </span>
                <h3 className="text-xl font-bold text-dark tracking-tight leading-none">Book Repair</h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-body hover:bg-primary-light hover:text-primary transition-colors shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              
              {/* Step 1: Device Info */}
              {step === 1 && (
                <form id="step1form" className="space-y-4 animate-in fade-in" onSubmit={handleNextStep}>
                  <div>
                    <label className="block text-xs font-bold text-dark mb-1 ml-1 uppercase">Brand *</label>
                    <select required value={formData.brandId} onChange={e => setFormData({ ...formData, brandId: e.target.value, modelId: '' })} className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium">
                      <option value="">Select Brand</option>
                      {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-dark mb-1 ml-1 uppercase">Model *</label>
                    <select required value={formData.modelId} onChange={e => setFormData({ ...formData, modelId: e.target.value })} disabled={!formData.brandId} className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium disabled:opacity-50">
                      <option value="">Select Model</option>
                      {filteredModels.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-dark mb-1 ml-1 uppercase">Service *</label>
                    <select required value={formData.serviceId} onChange={e => setFormData({ ...formData, serviceId: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium">
                      <option value="">Select Service</option>
                      {services.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                  </div>

                  {formData.serviceId && (
                    <div className="space-y-4">
                      {/* Service Preview Card */}
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-200">
                          {services.find(s => s._id === formData.serviceId)?.icon ? (
                            <Image 
                              src={services.find(s => s._id === formData.serviceId).icon} 
                              alt="Service" 
                              fill 
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-xl opacity-20">🛠️</div>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-black text-muted uppercase tracking-widest">Selected Service</p>
                          <p className="text-sm font-bold text-dark">{services.find(s => s._id === formData.serviceId)?.name || 'Processing...'}</p>
                        </div>
                      </div>

                      {formData.brandId && formData.modelId && (
                        <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 shadow-sm">
                          {isLoadingPrice ? (
                            <div className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></div>
                              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
                              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
                              <span className="text-sm text-primary font-bold ml-1 italic">Analyzing Repair Cost...</span>
                            </div>
                          ) : (
                            <div>
                               <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-1.5">Estimated Cost</p>
                               <div className="flex items-baseline gap-2">
                                  <span className="text-3xl font-black text-dark tracking-tighter">
                                    ₹{priceDetails.price || services.find(s => s._id === formData.serviceId)?.defaultPrice || '0'}
                                  </span>
                                  {priceDetails.priceMax && (
                                    <span className="text-lg font-bold text-muted"> - ₹{priceDetails.priceMax}</span>
                                  )}
                               </div>
                               <p className="text-[10px] text-muted font-medium mt-1 italic">
                                 {priceDetails.price ? '* Personalized estimate for your model' : '* Baseline price for this service'}
                               </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-dark mb-1 ml-1 uppercase mt-4">Describe the Issue (Optional)</label>
                    <textarea rows="2" value={formData.issue} onChange={e => setFormData({ ...formData, issue: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:bg-white focus:border-primary outline-none transition-all text-sm font-medium resize-none"></textarea>
                  </div>
                </form>
              )}

              {/* Step 2: Location */}
              {step === 2 && (
                <form id="step2form" className="space-y-5 animate-in fade-in" onSubmit={handleNextStep}>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setFormData({ ...formData, serviceType: "Home Service" })} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${formData.serviceType === "Home Service" ? "border-primary bg-primary/5 text-primary" : "border-border bg-surface text-body hover:border-primary/40"}`}>
                      <span className="font-bold text-sm text-dark">Home Service</span>
                    </button>
                    <button type="button" onClick={() => setFormData({ ...formData, serviceType: "Shop Visit" })} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${formData.serviceType === "Shop Visit" ? "border-primary bg-primary/5 text-primary" : "border-border bg-surface text-body hover:border-primary/40"}`}>
                      <span className="font-bold text-sm text-dark">Shop Visit</span>
                    </button>
                  </div>
                </form>
              )}



            </div>

            {/* Footer Actions */}
            <div className="mt-4 pt-4 border-t border-border flex gap-3 shrink-0 bg-white">
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} disabled={isProcessing} className="px-4 py-3.5 rounded-xl border border-border text-dark font-bold hover:bg-surface disabled:opacity-50">Back</button>
              )}
              {step < 2 ? (
                <button form={`step${step}form`} type="submit" className="flex-1 bg-dark text-white font-bold rounded-xl py-3.5 hover:bg-primary transition-all">Continue</button>
              ) : (
                <button form={`step${step}form`} type="submit" disabled={isProcessing} className="flex-1 bg-primary text-white font-bold rounded-xl py-3.5 hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  Proceed to Checkout
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
