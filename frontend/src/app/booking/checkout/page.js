"use client";
import { useState, useEffect, useMemo, Suspense, useRef } from "react";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState(null);
  const autocompleteRef = useRef(null);
  const addressInputRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [shopDistances, setShopDistances] = useState({});
  const [googleReady, setGoogleReady] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    landmark: "",
    pincode: "",
    preferredDate: new Date().toLocaleDateString('en-CA'),
    preferredTime: "",
    shopId: "",
    payment_mode: "online_full"
  });

  const [shopLocations, setShopLocations] = useState([]);

  const timeSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];

  const filteredTimeSlots = useMemo(() => {
    const today = new Date().toLocaleDateString('en-CA');
    if (formData.preferredDate !== today) return timeSlots;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    return timeSlots.filter(slot => {
        const [time, period] = slot.split(' ');
        let [hour, minute] = time.split(':').map(Number);
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        
        // At least 1 hour buffer from now
        const slotTime = new Date();
        slotTime.setHours(hour, minute, 0, 0);
        
        const bufferTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour buffer
        return slotTime > bufferTime;
    });
  }, [formData.preferredDate]);

  // Reset time if selected time is no longer valid (e.g. day changed)
  useEffect(() => {
    if (formData.preferredTime && !filteredTimeSlots.includes(formData.preferredTime)) {
        setFormData(prev => ({ ...prev, preferredTime: "" }));
    }
  }, [filteredTimeSlots]);

  const queryDetails = {
    brand: searchParams.get('brand') || "",
    brandId: searchParams.get('brandId') || "",
    model: searchParams.get('model') || "",
    modelId: searchParams.get('modelId') || "",
    serviceType: searchParams.get('serviceType') || "",
    serviceId: searchParams.get('serviceId') || "",
    visitType: searchParams.get('visitType') || "Shop Visit",
    issue: searchParams.get('issue') || "",
    price: parseInt(searchParams.get('price')) || 0,
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://www.mobitel.in'}/api/razorpay/payment-settings`)
      .then(res => res.json())
      .then(data => setPaymentSettings(data))
      .catch(err => console.error("Error fetching settings:", err));

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://www.mobitel.in'}/api/shops?active=true`)
      .then(res => res.json())
      .then(data => {
          setShopLocations(data);
          if (data && data.length > 0 && searchParams.get('visitType') !== "Home Service") {
              setFormData(prev => ({ ...prev, shopId: data[0]._id || data[0].id }));
          }
      })
      .catch(err => console.error("Error fetching shops:", err));
  }, []);

  // Track Google Maps API readiness via custom event from Script onReady
  useEffect(() => {
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      setGoogleReady(true);
      return;
    }
    const handler = () => setGoogleReady(true);
    window.addEventListener('google-maps-ready', handler);
    // Also poll as fallback in case event was missed
    const interval = setInterval(() => {
      if (typeof window !== 'undefined' && window.google && window.google.maps) {
        setGoogleReady(true);
        clearInterval(interval);
      }
    }, 300);
    return () => {
      window.removeEventListener('google-maps-ready', handler);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // If price is 0, default to pay_at_store but let them see why
    if (queryDetails.price === 0) {
      setFormData(prev => ({ ...prev, payment_mode: "pay_at_store" }));
    } else {
      setFormData(prev => ({ ...prev, payment_mode: "online_full" }));
    }
  }, [queryDetails.price]);

  // Google Maps Autocomplete
  useEffect(() => {
    if (typeof window !== 'undefined' && window.google && addressInputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(addressInputRef.current, {
        componentRestrictions: { country: "in" },
        fields: ["formatted_address", "address_components", "geometry"],
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (place.formatted_address) {
          setFormData(prev => ({ ...prev, address: place.formatted_address }));
          
          // Extract pincode if available
          const pincodeComp = place.address_components?.find(c => c.types.includes("postal_code"));
          if (pincodeComp) {
            setFormData(prev => ({ ...prev, address: place.formatted_address, pincode: pincodeComp.long_name }));
          }
        }
      });
    }
  }, [addressInputRef.current]);

  // Status for distance calculation: 'idle', 'fetching-coords', 'calculating-dist', 'denied', 'failed'
  const [distanceStatus, setDistanceStatus] = useState('idle');
  const geoFetched = useRef(false);

  // Fetch coordinates implicitly to show distance to shops
  useEffect(() => {
    if (geoFetched.current) return;
    const visitType = searchParams.get('visitType') || 'Shop Visit';
    if (visitType === "Shop Visit" && "geolocation" in navigator) {
      geoFetched.current = true;
      setDistanceStatus('fetching-coords');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setDistanceStatus('calculating-dist');
        },
        (err) => {
          console.log('Location access denied for distance matrix calculation');
          setDistanceStatus(err.code === 1 ? 'denied' : 'failed');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else if (visitType === "Shop Visit") {
      setDistanceStatus('failed');
    }
  }, [searchParams]);

  // Timeout fallback: if distance is still calculating after 15s, fall back to showing address
  useEffect(() => {
    if (distanceStatus === 'fetching-coords' || distanceStatus === 'calculating-dist') {
      const timeout = setTimeout(() => {
        setDistanceStatus(prev => {
          if (prev === 'fetching-coords' || prev === 'calculating-dist') {
            console.warn('[Distance] Timed out waiting for distance calculation, falling back to address.');
            return 'failed';
          }
          return prev;
        });
      }, 15000);
      return () => clearTimeout(timeout);
    }
  }, [distanceStatus]);

  // Calculate Distance to all shops using Google Maps
  useEffect(() => {
    if (!userLocation || shopLocations.length === 0 || !googleReady) return;
    
    try {
      const service = new window.google.maps.DistanceMatrixService();
      const shopAddresses = shopLocations.map(shop => shop.address);
      const origin = new window.google.maps.LatLng(userLocation.lat, userLocation.lng);
      
      console.log('[Distance] Calculating distances from', userLocation, 'to', shopAddresses.length, 'shops');
      
      service.getDistanceMatrix({
        origins: [origin],
        destinations: shopAddresses,
        travelMode: window.google.maps.TravelMode.DRIVING,
      }, (response, status) => {
        console.log('[Distance] DistanceMatrix response status:', status);
        if (status === 'OK' && response?.rows?.[0]?.elements) {
          const distances = {};
          let hasAtLeastOne = false;
          response.rows[0].elements.forEach((element, index) => {
            if (element.status === 'OK' && element.distance) {
              const shopId = shopLocations[index]._id || shopLocations[index].id;
              distances[shopId] = element.distance.text + " away";
              hasAtLeastOne = true;
            }
          });
          setShopDistances(distances);
          setDistanceStatus(hasAtLeastOne ? 'idle' : 'failed');
        } else {
          console.error('[Distance] DistanceMatrix failed:', status, response);
          setDistanceStatus('failed');
        }
      });
    } catch (err) {
      console.error('[Distance] DistanceMatrix error:', err);
      setDistanceStatus('failed');
    }
  }, [userLocation, shopLocations, googleReady]);

  const advanceAmount = useMemo(() => {
    if (!paymentSettings || !queryDetails.price) return 0;
    if (paymentSettings.advance_type === "fixed") {
      return paymentSettings.advance_fixed_amount;
    } else {
      return Math.ceil(queryDetails.price * (paymentSettings.advance_percentage / 100));
    }
  }, [paymentSettings, queryDetails.price]);

  const fetchLocation = async () => {
    if (!("geolocation" in navigator)) {
      alert("GPS is currently unavailable.");
      return;
    }
    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://www.mobitel.in'}/api/location?lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.display_name) {
            let cleanAddress = data.display_name;
            // If it starts with a plus code like '87CQ+H58, ', remove it for a cleaner UI
            if (cleanAddress.match(/^[A-Z0-9]{4}\+[A-Z0-9]{2,3},\s/)) {
              cleanAddress = cleanAddress.replace(/^[A-Z0-9]{4}\+[A-Z0-9]{2,3},\s/, '');
            }
            setFormData(prev => ({ ...prev, address: cleanAddress }));
            
            // Extract pincode from google results if available
            if (data.results && data.results[0]) {
               const pincodeComp = data.results[0].address_components?.find(c => c.types.includes("postal_code"));
               if (pincodeComp) {
                 setFormData(prev => ({ ...prev, pincode: pincodeComp.long_name }));
               }
            }
          } else {
            alert("Could not detect exact street address.");
          }
        } catch (err) {
          console.error("Location error:", err);
          alert("Error fetching location from server.");
        } finally {
          setIsFetchingLocation(false);
        }
      },
      () => {
        alert("Location permissions denied.");
        setIsFetchingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const initializeRazorpay = (order, bookingId) => {
    if (typeof window === 'undefined' || !window.Razorpay) {
      alert("Razorpay SDK not loaded yet. Please wait a moment and try again.");
      setIsProcessing(false);
      console.error("Razorpay SDK missing from window object.");
      return;
    }

    const options = {
      key: order.key_id,
      amount: order.amount,
      currency: "INR",
      name: "Mobitel Repair",
      description: "Repair Booking Payment",
      order_id: order.order_id,
      prefill: {
        name: formData.name,
        contact: formData.phone,
        email: formData.email
      },
      theme: { color: "#2563eb" },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        }
      },
      handler: async function (response) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://www.mobitel.in'}/api/razorpay/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              booking_id: bookingId
            })
          });
          const data = await res.json();
          if (data.success) {
            router.push(`/booking/success?token=${data.trackingToken}`);
          } else {
            alert("Payment verification failed: " + (data.error || "Unknown error"));
            setIsProcessing(false);
          }
        } catch (err) {
          console.error("Verification error:", err);
          alert("Error verifying payment with server.");
          setIsProcessing(false);
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.error("Razorpay payment failure:", response.error);
        alert("Payment failed: " + response.error.description);
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err) {
      console.error("Error creating Razorpay instance:", err);
      alert("Failed to open Razorpay modal.");
      setIsProcessing(false);
    }
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (queryDetails.visitType === "Home Service" && !formData.address) {
      alert("Please enter your address for Home Service.");
      setIsProcessing(false);
      return;
    }

    try {
      const payload = {
        customerName: formData.name,
        phone: formData.phone,
        email: formData.email,
        brand: queryDetails.brand,
        model: queryDetails.model,
        serviceType: queryDetails.serviceType,
        issue: queryDetails.issue,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        address: queryDetails.visitType === "Home Service" ? formData.address : "Shop Visit",
        landmark: formData.landmark,
        pincode: formData.pincode,
        shopId: queryDetails.visitType === "Shop Visit" ? formData.shopId : "",
        payment_mode: formData.payment_mode,
        total_amount: queryDetails.price || 0,
        brandId: queryDetails.brandId,
        modelId: queryDetails.modelId,
        serviceId: queryDetails.serviceId
      };

      console.log("Submitting booking with payload:", payload);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://www.mobitel.in'}/api/razorpay/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Booking failed");
      }

      console.log("Booking response:", data);

      if (data.payment_mode === "pay_at_store") {
        router.push(`/booking/success?token=${data.trackingToken}`);
      } else if (data.order_id) {
        initializeRazorpay(data, data.booking_id);
      } else {
        throw new Error("Invalid response from server - No order_id for online payment");
      }
    } catch (err) {
      console.error("Booking submission error:", err);
      alert(err.message || "An error occurred during booking.");
      setIsProcessing(false);
    }
  };

  if (!queryDetails.brand || !queryDetails.model) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-surface">
            <p className="text-gray-500 font-bold">Invalid checkout session. Please return home.</p>
        </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-surface py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-black text-dark mb-8 text-center tracking-tight">Complete Your Booking</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Form */}
            <div className="flex-1 bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-border">
              <form id="checkoutform" onSubmit={submitBooking} className="space-y-6">
                
                {/* Contact Info */}
                <div>
                  <h3 className="text-lg font-bold text-dark mb-4 border-b pb-2">Contact Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-dark mb-1 ml-1 uppercase">Full Name *</label>
                      <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3.5 rounded-xl border border-border bg-surface outline-none text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" suppressHydrationWarning={true} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-dark mb-1 ml-1 uppercase">Phone Number *</label>
                      <input required type="tel" pattern="[0-9]{10}" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3.5 rounded-xl border border-border bg-surface outline-none text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" suppressHydrationWarning={true} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-dark mb-1 ml-1 uppercase">Email Address</label>
                      <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3.5 rounded-xl border border-border bg-surface outline-none text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" suppressHydrationWarning={true} />
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div>
                  <h3 className="text-lg font-bold text-dark mb-4 border-b pb-2">Appointment Schedule</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-dark mb-1 ml-1 uppercase">Preferred Date *</label>
                      <input required type="date" min={new Date().toLocaleDateString('en-CA')} value={formData.preferredDate} onChange={e => setFormData({ ...formData, preferredDate: e.target.value })} className="w-full px-4 py-3.5 rounded-xl border border-border bg-surface outline-none text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" suppressHydrationWarning={true} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-dark mb-1 ml-1 uppercase">Preferred Time *</label>
                      <select required value={formData.preferredTime} onChange={e => setFormData({ ...formData, preferredTime: e.target.value })} className="w-full px-4 py-3.5 rounded-xl border border-border bg-surface outline-none text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none" suppressHydrationWarning={true}>
                        <option value="">{filteredTimeSlots.length > 0 ? "Select Time Slot" : "No slots available for today"}</option>
                        {filteredTimeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Location Input */}
                {queryDetails.visitType === "Home Service" ? (
                    <div className="animate-in fade-in pt-4">
                      <h3 className="text-lg font-bold text-dark mb-4 border-b pb-2">Home Service Address</h3>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-bold text-dark uppercase ml-1">Street Address *</label>
                        <button type="button" onClick={fetchLocation} disabled={isFetchingLocation} className="text-[10px] font-bold text-primary hover:text-dark px-2 py-1 bg-primary/10 rounded-md">Auto Fetch Location</button>
                      </div>
                      <textarea 
                        ref={addressInputRef}
                        required 
                        rows="2" 
                        value={formData.address} 
                        onChange={e => setFormData({ ...formData, address: e.target.value })} 
                        placeholder="Search for your building, street or area..."
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface outline-none text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none mb-4"
                        suppressHydrationWarning={true}
                      ></textarea>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-dark mb-1 ml-1 uppercase">Landmark</label>
                          <input type="text" value={formData.landmark} onChange={e => setFormData({ ...formData, landmark: e.target.value })} placeholder="Near School, etc." className="w-full px-4 py-3.5 rounded-xl border border-border bg-surface outline-none text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-dark mb-1 ml-1 uppercase">Pincode *</label>
                          <input required type="text" value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} placeholder="123456" className="w-full px-4 py-3.5 rounded-xl border border-border bg-surface outline-none text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                        </div>
                      </div>
                    </div>
                ) : (
                  <div className="animate-in fade-in pt-4">
                    <h3 className="text-lg font-bold text-dark mb-4 border-b pb-2">Select Shop Location</h3>
                    <div className="space-y-3">
                      {shopLocations.map((shop) => (
                        <label key={shop._id || shop.id} className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${formData.shopId === (shop._id || shop.id) ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-100 bg-white hover:border-primary/30 hover:shadow-sm'}`}>
                          <input type="radio" name="shop" required value={shop._id || shop.id} checked={formData.shopId === (shop._id || shop.id)} onChange={() => setFormData({ ...formData, shopId: shop._id || shop.id })} className="mt-1 accent-primary" />
                          <div className="flex-1">
                            <h5 className="font-semibold text-dark text-sm">{shop.name}</h5>
                            <p className="text-xs text-primary font-medium mt-1">
                              {shopDistances[shop._id || shop.id] 
                                ? shopDistances[shop._id || shop.id] 
                                : (distanceStatus === 'fetching-coords' || distanceStatus === 'calculating-dist' 
                                    ? "Calculating distance..." 
                                    : shop.address)}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment Selection */}
                {paymentSettings && (
                    <div className="pt-4 animate-in fade-in ">
                        <h3 className="text-lg font-bold text-dark mb-4 border-b pb-2">Payment Option</h3>
                        {queryDetails.price === 0 && (
                          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-700 font-medium">
                            Note: Online payment is not available for services with &quot;Price on inspection&quot;. Please proceed with &quot;{queryDetails.visitType === "Home Service" ? "Cash On Delivery / Pay After Service" : "Pay After Service"}&quot;.
                          </div>
                        )}
                        <div className="space-y-3">
                            {paymentSettings?.full_payment_enabled && (
                            <label className={`cursor-pointer border-2 rounded-xl p-4 flex gap-3 transition-all ${queryDetails.price === 0 ? 'opacity-50 cursor-not-allowed border-border bg-gray-50' : (formData.payment_mode === 'online_full' ? 'border-primary bg-primary/5' : 'border-border bg-white')}`}>
                                <input type="radio" value="online_full" disabled={queryDetails.price === 0} checked={formData.payment_mode === 'online_full'} onChange={() => setFormData(prev => ({ ...prev, payment_mode: 'online_full' }))} className="mt-0.5 mt-1 accent-primary w-4 h-4" />
                                <div>
                                <p className="font-bold text-dark text-sm leading-none mb-1">Pay Full Online</p>
                                <p className="text-[11px] text-muted font-medium">Pay ₹{queryDetails.price} now via Razorpay</p>
                                </div>
                            </label>
                            )}

                            {paymentSettings?.advance_payment_enabled && (
                            <label className={`cursor-pointer border-2 rounded-xl p-4 flex gap-3 transition-all ${queryDetails.price === 0 ? 'opacity-50 cursor-not-allowed border-border bg-gray-50' : (formData.payment_mode === 'online_advance' ? 'border-primary bg-primary/5' : 'border-border bg-white')}`}>
                                <input type="radio" value="online_advance" disabled={queryDetails.price === 0} checked={formData.payment_mode === 'online_advance'} onChange={() => setFormData(prev => ({ ...prev, payment_mode: 'online_advance' }))} className="mt-0.5 mt-1 accent-primary w-4 h-4" />
                                <div>
                                <p className="font-bold text-dark text-sm leading-none mb-1">Pay Advance Online</p>
                                <p className="text-[11px] text-muted font-medium">Pay ₹{advanceAmount} now, pay ₹{queryDetails.price - advanceAmount} later</p>
                                </div>
                            </label>
                            )}

                            {paymentSettings?.pay_at_store_enabled && (
                            <label className={`cursor-pointer border-2 rounded-xl p-4 flex gap-3 transition-all ${formData.payment_mode === 'pay_at_store' ? 'border-primary bg-primary/5' : 'border-border bg-white'}`}>
                                <input type="radio" value="pay_at_store" checked={formData.payment_mode === 'pay_at_store'} onChange={() => setFormData(prev => ({ ...prev, payment_mode: 'pay_at_store' }))} className="mt-0.5 mt-1 accent-primary w-4 h-4" />
                                <div>
                                <p className="font-bold text-dark text-sm leading-none mb-1">
                                  {queryDetails.visitType === "Home Service" ? "Cash On Delivery (COD) / Pay After Service" : "Pay After Service (At Shop)"} {queryDetails.price === 0 && '(Recommended)'}
                                </p>
                                <p className="text-[11px] text-muted font-medium">
                                  {queryDetails.visitType === "Home Service" 
                                    ? `Confirm booking now, pay ${queryDetails.price > 0 ? `₹${queryDetails.price}` : 'after inspection'} when technician arrives`
                                    : `Confirm booking now, pay ${queryDetails.price > 0 ? `₹${queryDetails.price}` : 'after inspection'} after the service is completed`
                                  }
                                </p>
                                </div>
                            </label>
                            )}
                        </div>
                    </div>
                )}
              </form>
            </div>

            {/* Right: Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-border sticky top-8">
                <h3 className="text-lg font-bold text-dark mb-4 border-b pb-2">Order Summary</h3>
                
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Device</span>
                    <span className="font-bold text-dark text-right">{queryDetails.brand} {queryDetails.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Service</span>
                    <span className="font-bold text-dark text-right">{queryDetails.serviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Type</span>
                    <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md text-[11px]">{queryDetails.visitType}</span>
                  </div>
                </div>

                <div className="p-4 bg-surface rounded-2xl mb-6">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-muted font-bold uppercase tracking-wider">Total Amount</span>
                    </div>
                    <div className="text-3xl font-black text-dark">
                        {queryDetails.price > 0 ? `₹${queryDetails.price}` : 'TBD'}
                    </div>
                    {queryDetails.price === 0 && <p className="text-xs mt-1 text-muted">Price will be quoted upon inspection.</p>}
                </div>

                <div className="pt-2">
                    <button form="checkoutform" type="submit" disabled={isProcessing} className="w-full bg-primary text-white font-bold rounded-xl py-4 hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary/30" suppressHydrationWarning={true}>
                        {isProcessing ? "Processing..." : (
                            queryDetails.price === 0 || formData.payment_mode === 'pay_at_store' 
                            ? "Complete Booking" 
                            : `Pay ₹${formData.payment_mode === 'online_full' ? queryDetails.price : advanceAmount}`
                        )}
                    </button>
                    <p className="text-[10px] text-center text-muted mt-4 font-medium">By proceeding, you agree to our Terms of Service & Repair Conditions.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default function CheckoutPage() {
    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
            <Script 
              src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`} 
              strategy="afterInteractive"
              onReady={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new Event('google-maps-ready'));
                }
              }}
            />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div></div>}>
                <CheckoutContent />
            </Suspense>
        </>
    );
}
