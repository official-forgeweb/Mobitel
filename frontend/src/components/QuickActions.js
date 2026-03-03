"use client";
import { useState, useEffect } from "react";

const actions = [
  { label: "Screen Repair" },
  { label: "Battery Replace" },
  { label: "Water Damage" },
  { label: "Charging Port" },
  { label: "Camera Fix" },
  { label: "Other Repair" },
];

export default function QuickActions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    model: "",
    issue: "",
    serviceType: "", // "Home Service" or "Shop Visit"
    address: "",
    name: "",
    phone: ""
  });
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const handleOpenModal = (serviceLabel) => {
    setSelectedService(serviceLabel);
    setStep(1);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedService("");
      setStep(1);
      setFormData({ model: "", issue: "", serviceType: "", address: "", name: "", phone: "" });
    }, 300); // Wait for transition out
  };

  const fetchLocation = async () => {
    if (!("geolocation" in navigator)) {
      alert("GPS is currently unavailable.");
      return;
    }

    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/location?lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.display_name) {
            // Get a clean street address from the reverse geocode
            const parts = data.display_name.split(", ").slice(0, 4);
            setFormData(prev => ({ ...prev, address: parts.join(", ") }));
          } else {
            alert("Could not detect exact street address.");
          }
        } catch {
          alert("Error fetching location from server.");
        } finally {
          setIsFetchingLocation(false);
        }
      },
      () => {
        alert("Location permissions denied.");
        setIsFetchingLocation(false);
      }
    );
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) setStep(2);
    else if (step === 2) {
      if (formData.serviceType === "Home Service" && !formData.address) {
        alert("Please enter or fetch your address for Home Service.");
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate submission
    setTimeout(() => {
      alert(`Booking confirmed for ${selectedService} (${formData.serviceType}). We'll call you at ${formData.phone}`);
      handleCloseModal();
    }, 500);
  };

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  return (
    <>
      {/* Desktop floating right panel */}
      <div className="hidden xl:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 flex-col bg-white shadow-2xl border border-border border-r-0 rounded-l-2xl overflow-hidden">
        <div className="bg-primary px-3 py-3">
          <p className="text-white text-[10px] font-bold uppercase tracking-widest text-center">Quick Fix</p>
        </div>
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={() => handleOpenModal(a.label)}
            className="group flex items-center gap-2 px-4 py-3 text-xs font-bold text-dark hover:bg-primary hover:text-white border-b border-border last:border-0 transition-all duration-300 whitespace-nowrap text-left"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-white transition-colors shrink-0" />
            {a.label}
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

      {/* Mobile Actions Menu (BottomSheet style) */}
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
            <div className="flex flex-col gap-2">
              {actions.map((a) => (
                <button
                  key={a.label}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleOpenModal(a.label);
                  }}
                  className="flex items-center justify-between w-full px-4 py-3.5 bg-surface hover:bg-primary hover:text-white rounded-xl text-sm font-bold text-dark transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover:bg-white" />
                    {a.label}
                  </div>
                  <svg className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Corner 2-Step Form Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <div
            className="absolute inset-0 bg-dark/20 backdrop-blur-sm transition-opacity"
            onClick={handleCloseModal}
          ></div>

          {/* Bottom right panel */}
          <div className="absolute bottom-0 right-0 w-full sm:w-[400px] bg-white rounded-t-3xl sm:rounded-tl-3xl sm:rounded-tr-none sm:rounded-l-3xl p-6 sm:p-8 shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-right duration-300 ease-out border-t sm:border-t-0 sm:border-l border-border h-[85vh] sm:h-auto sm:max-h-[85vh] flex flex-col">

            {/* Header / Dismiss */}
            <div className="flex items-center justify-between mb-6 shrink-0">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-primary-light text-primary text-[10px] font-bold tracking-wider uppercase mb-2">
                  Step {step} of 3 : {step === 1 ? "Details" : step === 2 ? "Location" : "Contact"}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-dark tracking-tight leading-none">
                  {selectedService}
                </h3>
              </div>

              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-body hover:bg-primary-light hover:text-primary transition-colors shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form Content Scrolling Area */}
            <div className="flex-1 overflow-y-auto pr-1">

              {/* Step 1: Device Info */}
              {step === 1 && (
                <form id="step1form" className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-300" onSubmit={handleNextStep}>
                  <p className="text-sm text-body leading-relaxed">
                    Tell us about your device to help us give you the fastest service.
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-dark mb-1.5 ml-1 uppercase tracking-wide">Brand & Model <span className="text-red-500">*</span></label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. iPhone 13 Pro, Samsung S23"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-border bg-surface focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-dark mb-1.5 ml-1 uppercase tracking-wide">Describe the Issue <span className="text-muted font-normal normal-case">(Optional)</span></label>
                    <textarea
                      rows="3"
                      placeholder="e.g. Screen is completely shattered but touch works."
                      value={formData.issue}
                      onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium resize-none"
                    ></textarea>
                  </div>
                </form>
              )}

              {/* Step 2: Service Preference */}
              {step === 2 && (
                <form id="step2form" className="space-y-5 animate-in fade-in slide-in-from-right-4 md:slide-in-from-right-8 duration-300" onSubmit={handleNextStep}>
                  <p className="text-sm text-body leading-relaxed">
                    How would you like to get this repaired?
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, serviceType: "Home Service" })}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${formData.serviceType === "Home Service"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-surface text-body hover:border-primary/40 hover:bg-surface-hover"
                        }`}
                    >
                      <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                      </svg>
                      <span className="font-bold text-sm text-dark">Home Service</span>
                      <span className="text-[10px] opacity-70 mt-1">We come to you</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, serviceType: "Shop Visit" })}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${formData.serviceType === "Shop Visit"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-surface text-body hover:border-primary/40 hover:bg-surface-hover"
                        }`}
                    >
                      <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                      </svg>
                      <span className="font-bold text-sm text-dark">Shop Visit</span>
                      <span className="text-[10px] opacity-70 mt-1">You come to us</span>
                    </button>
                  </div>

                  {formData.serviceType === "Home Service" && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center justify-between mb-1.5 ml-1">
                        <label className="block text-xs font-bold text-dark uppercase tracking-wide">Street Address <span className="text-red-500">*</span></label>
                        <button
                          type="button"
                          onClick={fetchLocation}
                          disabled={isFetchingLocation}
                          className="text-[10px] font-bold text-primary hover:text-dark flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md transition-colors"
                        >
                          <svg className={`w-3 h-3 ${isFetchingLocation ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                          {isFetchingLocation ? "Locating..." : "Auto Fetch"}
                        </button>
                      </div>
                      <textarea
                        required
                        rows="2"
                        placeholder="House/Flat No, Street, Landmark"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium resize-none"
                      ></textarea>
                    </div>
                  )}

                  {formData.serviceType === "Shop Visit" && (
                    <div className="mt-4 p-4 bg-primary/10 rounded-xl border border-primary/20 flex gap-3 items-start animate-in fade-in slide-in-from-top-2 duration-300">
                      <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                      </svg>
                      <p className="text-[12px] text-dark/80 font-medium leading-relaxed">
                        Great! During the next step, we'll confirm your details. Feel free to visit any of our nearby service centers at your convenience.
                      </p>
                    </div>
                  )}
                </form>
              )}

              {/* Step 3: Contact Info */}
              {step === 3 && (
                <form id="step3form" className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300" onSubmit={handleSubmit}>
                  <p className="text-sm text-body leading-relaxed">
                    Where should we reach you to confirm your repair?
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-dark mb-1.5 ml-1 uppercase tracking-wide">Full Name <span className="text-red-500">*</span></label>
                    <input
                      required
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-border bg-surface focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-dark mb-1.5 ml-1 uppercase tracking-wide">Phone Number <span className="text-red-500">*</span></label>
                    <input
                      required
                      type="tel"
                      placeholder="9876543210"
                      pattern="[0-9]{10}"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-border bg-surface focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium"
                    />
                    <p className="text-[10px] text-muted mt-1.5 ml-1">We'll call this number to confirm your booking.</p>
                  </div>
                </form>
              )}
            </div>

            {/* Footer / Progression Actions */}
            <div className="mt-6 pt-4 border-t border-border flex items-center gap-3 shrink-0">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-3.5 rounded-xl border border-border bg-surface text-body font-bold text-sm hover:bg-border/50 hover:text-dark transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
              )}

              {step < 3 ? (
                <button
                  form={`step${step}form`}
                  type="submit"
                  disabled={step === 2 && !formData.serviceType}
                  className="flex-1 bg-dark text-white font-bold text-sm rounded-xl py-3.5 hover:bg-primary transition-all duration-300 shadow-md group flex justify-center items-center gap-2 disabled:opacity-50 disabled:hover:bg-dark disabled:cursor-not-allowed"
                >
                  Continue
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              ) : (
                <button
                  form="step2form"
                  type="submit"
                  className="flex-1 bg-primary text-white font-bold text-sm rounded-xl py-3.5 hover:bg-primary-dark transition-all duration-300 shadow-md shadow-primary/20"
                >
                  Confirm Booking
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
