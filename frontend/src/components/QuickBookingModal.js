"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function QuickBookingModal({ isOpen, onClose }) {
  const router = useRouter();
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);

  // Data states
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [pricing, setPricing] = useState([]);

  // Selection states
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [visitType, setVisitType] = useState("Shop Visit");

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedBrandId("");
      setSelectedModelId("");
      setSelectedServiceId("");
      setVisitType("Shop Visit");
      fetchBrands();
    }
  }, [isOpen]);

  const fetchBrands = async () => {
    setLoadingBrands(true);
    try {
      const res = await fetch(`${API}/api/brands`);
      const data = await res.json();
      setBrands(data.filter(b => b.isActive));
    } catch (err) {
      console.error("Error fetching brands:", err);
    } finally {
      setLoadingBrands(false);
    }
  };

  const fetchModels = async (brandId) => {
    setLoadingModels(true);
    try {
      const res = await fetch(`${API}/api/device-models?brandId=${brandId}&active=true`);
      const data = await res.json();
      setModels([...data, { _id: 'other', name: 'Other / Unlisted Model' }]);
    } catch (err) {
      console.error("Error fetching models:", err);
    } finally {
      setLoadingModels(false);
    }
  };

  const fetchPricing = async (brandId, modelId) => {
    setLoadingServices(true);
    try {
      let data = [];
      if (modelId !== 'other') {
        const res = await fetch(`${API}/api/pricing/model/${brandId}/${modelId}`);
        if (res.ok) data = await res.json();
      }
      
      if (data && data.length > 0) {
        setPricing(data);
      } else {
        // Fallback to default services if no specific pricing
        const svcRes = await fetch(`${API}/api/services?active=true`);
        const svcs = await svcRes.json();
        const fallback = svcs.map(s => ({
          _id: s._id,
          serviceId: s,
          price: s.defaultPrice || 0,
          estimatedTime: '45-60 Mins'
        }));
        
        fallback.push({
          _id: 'other_issue',
          serviceId: { _id: 'other', name: 'Other Issue' },
          price: 0,
          estimatedTime: 'Varies'
        });
        
        setPricing(fallback);
      }
    } catch (err) {
      console.error("Error fetching pricing:", err);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleBrandChange = (e) => {
    const brandId = e.target.value;
    setSelectedBrandId(brandId);
    setSelectedModelId("");
    setSelectedServiceId("");
    setModels([]);
    setPricing([]);
    if (brandId) {
      fetchModels(brandId);
    }
  };

  const handleModelChange = (e) => {
    const modelId = e.target.value;
    setSelectedModelId(modelId);
    setSelectedServiceId("");
    setPricing([]);
    if (modelId && selectedBrandId) {
      fetchPricing(selectedBrandId, modelId);
    }
  };

  const handleServiceChange = (e) => {
    setSelectedServiceId(e.target.value);
  };

  const handleComplete = () => {
    if (!selectedBrandId || !selectedModelId || !selectedServiceId) {
      return alert("Please select a brand, model, and service.");
    }
    
    const selectedBrand = brands.find(b => b._id === selectedBrandId);
    const selectedModel = models.find(m => m._id === selectedModelId);
    const selectedService = pricing.find(p => p._id === selectedServiceId);

    if (!selectedBrand || !selectedModel || !selectedService) return;

    const params = new URLSearchParams({
      brand: selectedBrand.name,
      brandId: selectedBrand._id,
      model: selectedModel.name,
      modelId: selectedModel._id,
      serviceType: selectedService.serviceId.name,
      serviceId: selectedService.serviceId._id,
      price: selectedService.price,
      visitType: visitType
    });
    router.push(`/booking/checkout?${params.toString()}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-dark/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-[450px] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-xl font-bold text-dark">Book a Repair</h3>
            <p className="text-xs text-muted font-medium mt-0.5">Quick & easy scheduling</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Brand Dropdown */}
          <div>
            <label className="block text-xs font-bold text-dark mb-1.5 ml-1 uppercase">Select Brand *</label>
            <div className="relative">
              <select 
                value={selectedBrandId} 
                onChange={handleBrandChange} 
                className="w-full px-4 py-3.5 rounded-xl border border-border bg-surface outline-none text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
              >
                <option value="">Choose a brand...</option>
                {brands.map(brand => (
                  <option key={brand._id} value={brand._id}>{brand.name}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                {loadingBrands ? (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                )}
              </div>
            </div>
          </div>

          {/* Model Dropdown */}
          <div>
            <label className="block text-xs font-bold text-dark mb-1.5 ml-1 uppercase">Select Model *</label>
            <div className="relative">
              <select 
                value={selectedModelId} 
                onChange={handleModelChange} 
                disabled={!selectedBrandId || models.length === 0}
                className="w-full px-4 py-3.5 rounded-xl border border-border bg-surface outline-none text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none disabled:opacity-50 disabled:bg-gray-50"
              >
                <option value="">{models.length > 0 ? "Choose a model..." : (selectedBrandId ? "No models found" : "Select brand first")}</option>
                {models.map(model => (
                  <option key={model._id} value={model._id}>{model.name}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                {loadingModels ? (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                )}
              </div>
            </div>
          </div>

          {/* Service Dropdown */}
          <div>
            <label className="block text-xs font-bold text-dark mb-1.5 ml-1 uppercase">Select Service *</label>
            <div className="relative">
              <select 
                value={selectedServiceId} 
                onChange={handleServiceChange} 
                disabled={!selectedModelId || pricing.length === 0}
                className="w-full px-4 py-3.5 rounded-xl border border-border bg-surface outline-none text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none disabled:opacity-50 disabled:bg-gray-50"
              >
                <option value="">{pricing.length > 0 ? "Choose a service..." : (selectedModelId ? "No services found" : "Select model first")}</option>
                {pricing.map(p => {
                  const resolvedPrice = p.price || p.serviceId?.defaultPrice || 0;
                  const priceText = parseInt(resolvedPrice) === 0 ? "Upon Inspection" : `₹${resolvedPrice}`;
                  return (
                    <option key={p._id} value={p._id}>
                      {p.serviceId?.name || "Service"} | {priceText} | {p.estimatedTime || '1-2 hrs'}
                    </option>
                  );
                })}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                {loadingServices ? (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                )}
              </div>
            </div>
          </div>

          {/* Visit Type */}
          {(selectedBrandId && selectedModelId && selectedServiceId) && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-xs font-bold text-dark mb-2 ml-1 uppercase">Visit Type *</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => setVisitType("Home Service")}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center ${visitType === "Home Service" ? "border-primary bg-primary/5" : "border-gray-100 hover:border-primary/20"}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${visitType === "Home Service" ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                  </div>
                  <span className="text-xs font-bold text-dark">Home Service</span>
                </button>

                <button 
                  type="button"
                  onClick={() => setVisitType("Shop Visit")}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center ${visitType === "Shop Visit" ? "border-primary bg-primary/5" : "border-gray-100 hover:border-primary/20"}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${visitType === "Shop Visit" ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21V10.5m0 10.5h4.5A2.25 2.25 0 0020.25 18.75V10.5m-6.75 10.5h-4.5A2.25 2.25 0 016.75 18.75V10.5m6.75 0V3.75c0-.621-.504-1.125-1.125-1.125h-2.25c-.621 0-1.125.504-1.125 1.125V10.5m6.75 0h3.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H16.5M10.5 10.5H7.125c-.621 0-1.125.504-1.125 1.125v2.25c0 .621.504 1.125 1.125 1.125H10.5" /></svg>
                  </div>
                  <span className="text-xs font-bold text-dark">Shop Visit</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-gray-100 bg-gray-50/50">
          <button 
            onClick={handleComplete}
            disabled={!selectedBrandId || !selectedModelId || !selectedServiceId}
            className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
