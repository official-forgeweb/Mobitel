"use client";

import { useState, useEffect, memo, useCallback } from "react";

// Memoized Brand Item for performance
const BrandItem = memo(({ brand, onClick }) => {
  return (
    <button
      onClick={() => onClick(brand)}
      className="group flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-[border-color,box-shadow,transform] duration-200 outline-none w-full cursor-pointer will-change-transform"
    >
      <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl bg-surface group-hover:bg-primary/5 transition-colors overflow-hidden">
        <BrandLogo brand={brand} />
      </div>
      <span className="text-[11px] sm:text-sm font-medium text-dark group-hover:text-primary transition-colors text-center w-full truncate">
        {brand.name}
      </span>
    </button>
  );
});

// Fallback: render brand initial when image fails
function BrandLogo({ brand }) {
  const [imgError, setImgError] = useState(false);

  if (imgError || !brand.logo) {
    return (
      <div className="w-full h-full rounded-xl bg-primary/10 flex items-center justify-center border border-primary/5">
        <span className="text-primary font-bold text-xl uppercase">
          {brand.name?.charAt(0) || 'B'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={brand.logo}
      alt={brand.name}
      className="w-full h-full object-contain p-1"
      onError={() => setImgError(true)}
    />
  );
}

// Memoized Model Item for performance improvement
const ModelItem = memo(({ model, idx, onClick }) => {
  return (
    <button
      onClick={() => onClick(model)}
      className="flex flex-col items-center justify-start p-3 sm:p-4 rounded-xl border border-gray-100 bg-white hover:border-primary/40 hover:bg-primary/5 transition-[border-color,background-color] duration-200 group gap-2 sm:gap-3"
    >
      <div className="w-full aspect-[3/4] max-h-20 sm:max-h-32 bg-surface rounded-lg flex items-center justify-center mb-1 group-hover:bg-white transition-colors border border-transparent group-hover:border-primary/10 overflow-hidden relative">
        <ModelImage model={model} />
      </div>
      <span className="text-[11px] sm:text-sm font-medium text-dark text-center line-clamp-2 w-full group-hover:text-primary transition-colors">
        {model.name}
      </span>
    </button>
  );
});

// Memoized Other Model Item
const OtherModelItem = memo(({ onClick }) => {
  return (
    <button
      onClick={() => onClick({ name: 'Other / Unlisted Model' })}
      className="flex flex-col items-center justify-start p-3 sm:p-4 rounded-xl border border-gray-100 bg-white hover:border-primary/40 hover:bg-primary/5 transition-[border-color,background-color] duration-200 group gap-2 sm:gap-3"
    >
      <div className="w-full aspect-[3/4] max-h-20 sm:max-h-32 bg-surface rounded-lg flex items-center justify-center p-2 mb-1 group-hover:bg-white transition-colors border border-transparent group-hover:border-primary/10">
        <div className="w-8 h-8 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-primary/10 transition-colors">
          <svg className="w-4 h-4 sm:w-6 sm:h-6 text-gray-500 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      </div>
      <span className="text-[11px] sm:text-sm font-medium text-dark text-center line-clamp-2 w-full group-hover:text-primary transition-colors">Other Model</span>
    </button>
  );
});

// Fallback: render model placeholder when image fails
function ModelImage({ model }) {
  const [imgError, setImgError] = useState(false);

  if (imgError || !model.image) {
    return (
      <div className="w-full h-full bg-surface flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <span className="text-[10px] text-gray-400 font-medium text-center px-2 truncate w-full">{model.name}</span>
      </div>
    );
  }

  return (
    <img
      src={model.image}
      alt={model.name}
      loading="lazy"
      className="w-full h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
      onError={() => setImgError(true)}
    />
  );
}

export default function BrandCategories({ data }) {
  const title = data?.title || "Select Your Brand";
  const subtitle = data?.subtitle || "Choose your phone brand to explore repair services";

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [serviceType, setServiceType] = useState(null); // 'home' | 'shop'
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '', phone: '', email: '', date: '', time: '', address: '', landmark: '', pincode: '', selectedShop: '',
  });

  const [brandsList, setBrandsList] = useState([]);
  const [modelsList, setModelsList] = useState([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [repairIssuesList, setRepairIssuesList] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/brands?active=true`).then(r => r.json()).then(setBrandsList).catch(console.error);
  }, []);

  // Fetch specific services for the selected model
  useEffect(() => {
    if (selectedModel) {
      if (selectedModel._id) {
        setIsLoadingModels(true); // Re-use loading state for issues
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/pricing/model/${selectedBrand._id}/${selectedModel._id}`)
          .then(r => r.json())
          .then(data => {
            if (data && data.length > 0) {
              const modelServices = data.map(p => ({
                ...p.serviceId,
                price: p.priceMax ? `₹${p.price} - ₹${p.priceMax}` : (p.price > 0 ? `₹${p.price}` : 'Upon Inspection'),
                time: p.estimatedTime || '45-60 Mins'
              }));
              setRepairIssuesList(modelServices);
            } else {
              // Fallback to default services if no specific pricing exists
              fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/services?active=true`)
                .then(r => r.json())
                .then(setRepairIssuesList);
            }
            setIsLoadingModels(false);
          })
          .catch(err => {
            console.error(err);
            setIsLoadingModels(false);
          });
      } else {
        // "Other Model" selected - show all services
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/services?active=true`)
          .then(r => r.json())
          .then(setRepairIssuesList);
      }
    }
  }, [selectedModel, selectedBrand]);

  const shopLocations = [
    { id: 'shop1', name: 'Mobitel - Connaught Place', address: 'Shop No. 12, Block A, Connaught Place, New Delhi - 110001', hours: '10:00 AM - 8:00 PM', phone: '+91 98765 43210' },
    { id: 'shop2', name: 'Mobitel - Laxmi Nagar', address: 'Plot No. 5, Main Market, Laxmi Nagar, New Delhi - 110092', hours: '10:00 AM - 9:00 PM', phone: '+91 98765 43211' },
    { id: 'shop3', name: 'Mobitel - Nehru Place', address: '2nd Floor, Shop 204, Nehru Place, New Delhi - 110019', hours: '11:00 AM - 8:00 PM', phone: '+91 98765 43212' },
  ];

  const timeSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];

  useEffect(() => {
    if (selectedBrand) {
      if (selectedBrand._id) {
        setIsLoadingModels(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/device-models?brandId=${selectedBrand._id}&active=true`)
          .then(r => r.json())
          .then(data => {
            setModelsList(data);
            setIsLoadingModels(false);
          })
          .catch(err => {
            console.error(err);
            setIsLoadingModels(false);
          });
      } else {
        setModelsList([]);
      }
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedBrand]);

  const handleSelectBrand = useCallback((brand) => {
    setSelectedBrand(brand);
  }, []);

  const handleSelectModel = useCallback((model) => {
    setSelectedModel(model);
  }, []);

  const resetAll = useCallback(() => {
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedIssue(null);
    setServiceType(null);
    setBookingSubmitted(false);
    setBookingForm({ name: '', phone: '', email: '', date: '', time: '', address: '', landmark: '', pincode: '', selectedShop: '' });
  }, []);

  const handleBack = useCallback(() => {
    if (bookingSubmitted) { setBookingSubmitted(false); return; }
    if (serviceType) { setServiceType(null); setBookingForm({ name: '', phone: '', email: '', date: '', time: '', address: '', landmark: '', pincode: '', selectedShop: '' }); return; }
    if (selectedIssue) { setSelectedIssue(null); return; }
    if (selectedModel) { setSelectedModel(null); return; }
  }, [bookingSubmitted, serviceType, selectedIssue, selectedModel]);

  // Determine current step for header
  const getCurrentStep = () => {
    if (bookingSubmitted) return { title: 'Booking Confirmed!', subtitle: 'Your repair has been booked successfully' };
    if (serviceType) return { title: serviceType === 'home' ? 'Home Service Booking' : 'Visit Shop Booking', subtitle: 'Fill in your details to book' };
    if (selectedIssue) return { title: selectedIssue.name, subtitle: 'How would you like to get it repaired?' };
    if (selectedModel) return { title: selectedModel.name, subtitle: 'Select the issue you are facing' };
    return { title: `${selectedBrand?.name} Models`, subtitle: 'Select your device model to continue' };
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    const requestPayload = {
      brand: selectedBrand?.name,
      model: selectedModel?.name,
      issue: selectedIssue?.name,
      serviceType: serviceType,
      customerName: bookingForm.name,
      phone: bookingForm.phone,
      email: bookingForm.email,
      preferredDate: bookingForm.date,
      preferredTime: bookingForm.time,
      address: bookingForm.address,
      landmark: bookingForm.landmark,
      pincode: bookingForm.pincode,
      shopId: bookingForm.selectedShop
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload)
      });
      if (res.ok) {
        setBookingSubmitted(true);
      } else {
        alert("Failed to submit request.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting request.");
    }
  };

  const stepInfo = selectedBrand ? getCurrentStep() : {};

  // Get today's date in YYYY-MM-DD for the date input min
  const today = new Date().toISOString().split('T')[0];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-dark">{title}</h2>
          <p className="text-muted text-sm mt-1">{subtitle}</p>
        </div>
        <a href="#" className="hidden sm:inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline">
          View All
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </a>
      </div>

      {/* Brand Grid */}
      <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
        {(brandsList && Array.isArray(brandsList) ? brandsList : []).map((brand) => (
          <BrandItem key={brand._id || brand.name} brand={brand} onClick={handleSelectBrand} />
        ))}
      </div>

      {/* Mobile View All */}
      <div className="flex sm:hidden justify-center mt-6">
        <a href="#" className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline">
          View All Brands
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </a>
      </div>

      {/* ===== MODAL ===== */}
      {selectedBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" onClick={resetAll}></div>

          <div className="relative bg-white border border-border w-full max-w-4xl h-full sm:h-auto max-h-[100vh] sm:max-h-[85vh] rounded-none sm:rounded-3xl shadow-2xl flex flex-col z-10">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border bg-surface/50 rounded-t-3xl shrink-0">
              <div className="flex items-center gap-4">
                {(selectedModel || selectedIssue || serviceType || bookingSubmitted) ? (
                  <button onClick={bookingSubmitted ? resetAll : handleBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-dark hover:bg-gray-100 transition-colors focus:outline-none border border-border shadow-sm">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={bookingSubmitted ? "M6 18L18 6M6 6l12 12" : "M10 19l-7-7m0 0l7-7m-7 7h18"} />
                    </svg>
                  </button>
                ) : (
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-border shrink-0">
                    <BrandLogo brand={selectedBrand} />
                  </div>
                )}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-dark">{stepInfo.title}</h3>
                  <p className="text-sm text-muted">{stepInfo.subtitle}</p>
                </div>
              </div>
              <button onClick={resetAll} className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-muted hover:bg-red-50 hover:text-red-500 transition-colors focus:outline-none shrink-0 border border-transparent hover:border-red-100 shadow-sm">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 min-h-0">

              {/* ── STEP 1: Model Selection ── */}
              {!selectedModel && (
                isLoadingModels ? (
                  <div className="flex flex-col items-center justify-center py-24 w-full">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-sm font-medium text-muted animate-pulse">Loading {selectedBrand?.name} models...</p>
                  </div>
                ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
                  {(modelsList && Array.isArray(modelsList) ? modelsList : []).map((model, idx) => (
                    <ModelItem key={model._id || idx} model={model} idx={idx} onClick={handleSelectModel} />
                  ))}
                  <OtherModelItem onClick={handleSelectModel} />
                </div>
                )
              )}

              {/* ── STEP 2: Issue Selection ── */}
              {selectedModel && !selectedIssue && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {(repairIssuesList && Array.isArray(repairIssuesList) ? repairIssuesList : []).map((issue) => (
                    <button key={issue._id || issue.name} onClick={() => setSelectedIssue(issue)} className="flex flex-col text-left p-5 rounded-2xl border border-gray-100 bg-white hover:border-primary/40 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 group">
                      <div className="flex items-start justify-between w-full mb-3">
                        <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center group-hover:bg-white group-hover:text-primary text-gray-500 transition-colors shadow-sm">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={issue.icon || 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'} />
                          </svg>
                        </div>
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full whitespace-nowrap">{issue.time || '45-60 Mins'}</span>
                      </div>
                      <h4 className="font-semibold text-dark text-base mb-1 group-hover:text-primary transition-colors">{issue.name}</h4>
                      <div className="mt-auto pt-3 flex items-center justify-between w-full border-t border-gray-50 group-hover:border-primary/10">
                        <span className="text-xs text-muted">Est. Cost</span>
                        <span className="font-bold text-dark text-sm">{issue.price || 'Upon Inspection'}</span>
                      </div>
                    </button>
                  ))}
                  <button onClick={() => setSelectedIssue({ id: 'other', name: 'Other Issue', price: 'Upon Inspection', time: 'Varies' })} className="flex flex-col text-left p-5 rounded-2xl border border-gray-100 bg-white hover:border-primary/40 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 group">
                    <div className="flex items-start justify-between w-full mb-3">
                      <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center group-hover:bg-white group-hover:text-primary text-gray-500 transition-colors shadow-sm">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">Varies</span>
                    </div>
                    <h4 className="font-semibold text-dark text-base mb-1 group-hover:text-primary transition-colors">Other Issue</h4>
                    <div className="mt-auto pt-3 flex items-center justify-between w-full border-t border-gray-50 group-hover:border-primary/10">
                      <span className="text-xs text-muted">Est. Cost</span>
                      <span className="font-bold text-dark text-sm">Upon Inspection</span>
                    </div>
                  </button>
                </div>
              )}

              {/* ── STEP 3: Service Type Selection ── */}
              {selectedIssue && !serviceType && !bookingSubmitted && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  {/* Home Service */}
                  <button onClick={() => setServiceType('home')} className="flex flex-col items-center text-center p-8 rounded-2xl border-2 border-gray-100 bg-white hover:border-primary hover:bg-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group">
                    <div className="w-20 h-20 rounded-2xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center mb-5 transition-colors">
                      <svg className="w-10 h-10 text-blue-500 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-dark mb-2 group-hover:text-primary transition-colors">Home Service</h4>
                    <p className="text-sm text-muted mb-4">Our technician will come to your doorstep for the repair</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full font-medium">Free Pickup</span>
                      <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">Convenient</span>
                    </div>
                  </button>

                  {/* Visit Shop */}
                  <button onClick={() => setServiceType('shop')} className="flex flex-col items-center text-center p-8 rounded-2xl border-2 border-gray-100 bg-white hover:border-primary hover:bg-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group">
                    <div className="w-20 h-20 rounded-2xl bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center mb-5 transition-colors">
                      <svg className="w-10 h-10 text-orange-500 group-hover:text-orange-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-dark mb-2 group-hover:text-primary transition-colors">Visit Shop</h4>
                    <p className="text-sm text-muted mb-4">Walk in to our nearest service center for instant repair</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <span className="text-xs bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-medium">Instant Service</span>
                      <span className="text-xs bg-purple-50 text-purple-600 px-3 py-1 rounded-full font-medium">Expert Techs</span>
                    </div>
                  </button>
                </div>
              )}

              {/* ── STEP 4: Booking Form ── */}
              {serviceType && !bookingSubmitted && (
                <form onSubmit={handleBookingSubmit} className="max-w-2xl mx-auto space-y-5">
                  {/* Summary Card */}
                  <div className="bg-surface/80 rounded-2xl p-4 flex flex-wrap items-center gap-4 text-sm border border-border">
                    <div className="flex items-center gap-2">
                      <span className="text-muted">Brand:</span>
                      <span className="font-semibold text-dark">{selectedBrand.name}</span>
                    </div>
                    <div className="w-px h-4 bg-border hidden sm:block"></div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted">Model:</span>
                      <span className="font-semibold text-dark">{selectedModel.name}</span>
                    </div>
                    <div className="w-px h-4 bg-border hidden sm:block"></div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted">Issue:</span>
                      <span className="font-semibold text-dark">{selectedIssue.name}</span>
                    </div>
                  </div>

                  {/* Name, Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark mb-1.5">Full Name <span className="text-red-500">*</span></label>
                      <input type="text" required value={bookingForm.name} onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })} placeholder="Enter your full name" className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                      <input type="tel" required value={bookingForm.phone} onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-dark mb-1.5">Email Address</label>
                      <input type="email" value={bookingForm.email} onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })} placeholder="your@email.com (For repair updates)" className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all" />
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark mb-1.5">Preferred Date <span className="text-red-500">*</span></label>
                      <input type="date" required min={today} value={bookingForm.date} onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark mb-1.5">Preferred Time <span className="text-red-500">*</span></label>
                      <select required value={bookingForm.time} onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all appearance-none">
                        <option value="">Select a time slot</option>
                        {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* HOME SERVICE: Address Fields */}
                  {serviceType === 'home' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-dark mb-1.5">Full Address <span className="text-red-500">*</span></label>
                        <textarea required rows={2} value={bookingForm.address} onChange={(e) => setBookingForm({ ...bookingForm, address: e.target.value })} placeholder="House/Flat no., Street, Area, City" className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all resize-none"></textarea>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-dark mb-1.5">Landmark</label>
                          <input type="text" value={bookingForm.landmark} onChange={(e) => setBookingForm({ ...bookingForm, landmark: e.target.value })} placeholder="Near School, Temple etc." className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-dark mb-1.5">Pincode <span className="text-red-500">*</span></label>
                          <input type="text" required value={bookingForm.pincode} onChange={(e) => setBookingForm({ ...bookingForm, pincode: e.target.value })} placeholder="110001" className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all" />
                        </div>
                      </div>
                    </>
                  )}

                  {/* VISIT SHOP: Shop Selection */}
                  {serviceType === 'shop' && (
                    <div>
                      <label className="block text-sm font-medium text-dark mb-3">Select a Shop <span className="text-red-500">*</span></label>
                      <div className="space-y-3">
                        {shopLocations.map((shop) => (
                          <label key={shop.id} className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${bookingForm.selectedShop === shop.id ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-100 bg-white hover:border-primary/30 hover:shadow-sm'}`}>
                            <input type="radio" name="shop" required value={shop.id} checked={bookingForm.selectedShop === shop.id} onChange={() => setBookingForm({ ...bookingForm, selectedShop: shop.id })} className="mt-1 accent-primary" />
                            <div className="flex-1">
                              <h5 className="font-semibold text-dark text-sm">{shop.name}</h5>
                              <p className="text-xs text-muted mt-1">{shop.address}</p>
                              <div className="flex flex-wrap gap-3 mt-2">
                                <span className="text-xs text-green-600 flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                  {shop.hours}
                                </span>
                                <span className="text-xs text-blue-600 flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                  {shop.phone}
                                </span>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button type="submit" className="w-full py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/20 text-base">
                    {serviceType === 'home' ? '📍 Book Home Service' : '🏪 Book Shop Appointment'}
                  </button>
                </form>
              )}

              {/* ── STEP 5: Confirmation ── */}
              {bookingSubmitted && (
                <div className="text-center max-w-lg mx-auto py-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-dark mb-2">Booking Confirmed!</h3>
                  <p className="text-muted mb-6">Your repair request has been submitted successfully</p>

                  {/* Booking Details */}
                  <div className="bg-surface rounded-2xl p-5 text-left space-y-3 border border-border mb-6">
                    <div className="flex justify-between text-sm"><span className="text-muted">Brand & Model</span><span className="font-semibold text-dark">{selectedBrand.name} — {selectedModel.name}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted">Issue</span><span className="font-semibold text-dark">{selectedIssue.name}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted">Service Type</span><span className="font-semibold text-dark">{serviceType === 'home' ? 'Home Service' : 'Visit Shop'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted">Name</span><span className="font-semibold text-dark">{bookingForm.name}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted">Phone</span><span className="font-semibold text-dark">{bookingForm.phone}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted">Date & Time</span><span className="font-semibold text-dark">{bookingForm.date} at {bookingForm.time}</span></div>
                    {serviceType === 'home' && (
                      <div className="flex justify-between text-sm"><span className="text-muted">Address</span><span className="font-semibold text-dark text-right max-w-[60%]">{bookingForm.address}{bookingForm.landmark ? `, Near ${bookingForm.landmark}` : ''} - {bookingForm.pincode}</span></div>
                    )}
                    {serviceType === 'shop' && (
                      <div className="flex justify-between text-sm"><span className="text-muted">Shop</span><span className="font-semibold text-dark text-right max-w-[60%]">{shopLocations.find(s => s.id === bookingForm.selectedShop)?.name}</span></div>
                    )}
                  </div>

                  <p className="text-xs text-muted mb-4">We will contact you shortly to confirm your appointment.</p>

                  <button onClick={resetAll} className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all">
                    Done
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </section>
  );
}
