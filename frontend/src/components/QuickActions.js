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
    window.dispatchEvent(new Event('openBookingModal'));
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
            onClick={() => window.dispatchEvent(new Event('openBookingModal'))}
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

      {/* Modal removed to use global QuickBookingModal */}
    </>
  );
}
