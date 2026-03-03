"use client";

import { useState, useEffect } from "react";

export default function CmsEditorPage() {
    const [cmsData, setCmsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState("bannerCarousel");
    const [pageSlug, setPageSlug] = useState("home");

    const fetchCmsData = (slug) => {
        setLoading(true);
        fetch(`http://localhost:5000/api/cms/${slug}`)
            .then(res => res.json())
            .then(data => {
                setCmsData(data || {});
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load CMS data", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCmsData(pageSlug);
    }, [pageSlug]);

    const getTabsForPage = (slug) => {
        switch (slug) {
            case "home":
                return [
                    { id: "bannerCarousel", label: "Hero Banners" },
                    { id: "howItWorks", label: "How It Works" },
                    { id: "brandCategories", label: "Brands" },
                    { id: "popularServices", label: "Services" },
                    { id: "whyChooseUs", label: "Why Choose Us" },
                    { id: "appDownload", label: "App Download" },
                    { id: "faq", label: "FAQ" },
                ];
            case "about":
                return [
                    { id: "hero", label: "Hero Section" },
                    { id: "story", label: "Our Story" },
                    { id: "promises", label: "Promises" },
                    { id: "stats", label: "Global Stats" }
                ];
            case "services":
                return [
                    { id: "hero", label: "Hero Section" },
                    { id: "servicesList", label: "Services List" }
                ];
            case "track-repair":
                return [
                    { id: "hero", label: "Hero Section" },
                    { id: "features", label: "Features Grid" }
                ];
            default:
                return [];
        }
    };

    const tabs = getTabsForPage(pageSlug);

    useEffect(() => {
        if (tabs.length > 0 && !tabs.find(t => t.id === activeTab)) {
            setActiveTab(tabs[0].id);
        }
    }, [pageSlug, tabs, activeTab]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`http://localhost:5000/api/cms/${pageSlug}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cmsData),
            });
            if (res.ok) {
                alert("Saved successfully!");
            } else {
                alert("Failed to save.");
            }
        } catch (err) {
            console.error(err);
            alert("Error saving.");
        } finally {
            setSaving(false);
        }
    };

    // Generalized handlers
    const ensureSection = (section) => {
        if (!cmsData[section]) {
            setCmsData(prev => ({ ...prev, [section]: {} }));
        }
    };

    const handleRootChange = (section, field, value) => {
        setCmsData(prev => ({
            ...prev,
            [section]: {
                ...(prev[section] || {}),
                [field]: value
            }
        }));
    };

    const handleArrayChange = (section, arrayField, index, field, value) => {
        setCmsData(prev => {
            const newData = { ...prev };
            if (!newData[section]) newData[section] = {};
            const newArray = [...(newData[section][arrayField] || [])];
            newArray[index] = { ...newArray[index], [field]: value };
            newData[section] = { ...newData[section], [arrayField]: newArray };
            return newData;
        });
    };

    const handleRootArrayChange = (section, index, field, value) => {
        setCmsData(prev => {
            const newArray = [...(prev[section] || [])];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...prev, [section]: newArray };
        });
    };

    const addRootArrayItem = (section, template) => {
        setCmsData(prev => ({
            ...prev,
            [section]: [...(prev[section] || []), template]
        }));
    };

    const removeRootArrayItem = (section, index) => {
        setCmsData(prev => ({
            ...prev,
            [section]: (prev[section] || []).filter((_, i) => i !== index)
        }));
    };

    const addArrayItem = (section, arrayField, template) => {
        setCmsData(prev => {
            const newData = { ...prev };
            if (!newData[section]) newData[section] = {};
            const currentArray = newData[section][arrayField] || [];
            newData[section] = { ...newData[section], [arrayField]: [...currentArray, template] };
            return newData;
        });
    };

    const removeArrayItem = (section, arrayField, index) => {
        setCmsData(prev => {
            const newData = { ...prev };
            if (!newData[section]) newData[section] = {};
            const currentArray = newData[section][arrayField] || [];
            newData[section] = { ...newData[section], [arrayField]: currentArray.filter((_, i) => i !== index) };
            return newData;
        });
    };

    const handleImageUpload = async (file, section, arrayField, index, field, isRootArray = false) => {
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch("http://localhost:5000/api/upload", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (data.secure_url) {
                if (isRootArray) {
                    handleRootArrayChange(section, index, field, data.secure_url);
                } else if (arrayField) {
                    handleArrayChange(section, arrayField, index, field, data.secure_url);
                } else {
                    handleRootChange(section, field, data.secure_url);
                }
            } else {
                alert("Upload failed: " + (data.error || "Unknown error"));
            }
        } catch (err) {
            console.error(err);
            alert("Error uploading image");
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex justify-center items-center h-full min-h-[500px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!cmsData) return <div className="p-8 text-red-500">Failed to load CMS configuration.</div>;

    const renderImageInput = (label, section, arrayField, index, field, isRootArray, value) => (
        <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">{label} / Upload</label>
            <div className="flex gap-2">
                <input
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                    placeholder="https://"
                    value={value || ""}
                    onChange={(e) => {
                        if (isRootArray) handleRootArrayChange(section, index, field, e.target.value);
                        else if (arrayField) handleArrayChange(section, arrayField, index, field, e.target.value);
                        else handleRootChange(section, field, e.target.value);
                    }}
                />
                <label className={`border border-gray-300 rounded px-3 py-2 text-sm font-medium flex items-center justify-center transition-colors ${uploading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 cursor-pointer text-gray-700'}`}>
                    <span>{uploading ? "..." : "Upload File"}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0], section, arrayField, index, field, isRootArray)} disabled={uploading} />
                </label>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">CMS Editor</h1>
                    <p className="text-sm text-gray-500">Manage all application content dynamically.</p>
                </div>

                <div className="flex items-center gap-4">
                    <select
                        value={pageSlug}
                        onChange={(e) => setPageSlug(e.target.value)}
                        className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="home">Home Page</option>
                        <option value="about">About Us</option>
                        <option value="services">Services</option>
                        <option value="track-repair">Track Repair</option>
                    </select>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                {/* Sidebar Tabs */}
                <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 p-4 shrink-0 flex flex-col gap-1 overflow-y-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Editor Content */}
                <div className="p-6 md:p-8 flex-1 overflow-y-auto bg-white">

                    {/* SHARED COMPONENT: HERO SECTION */}
                    {activeTab === "hero" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800">Hero Section</h2>
                            <p className="text-sm text-gray-500 mb-4">Manage the top header of the page.</p>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                                <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none mb-4" value={cmsData.hero?.title || ""} onChange={(e) => handleRootChange("hero", "title", e.target.value)} />
                                <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle / Description</label>
                                <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none resize-none" rows="3" value={cmsData.hero?.subtitle || ""} onChange={(e) => handleRootChange("hero", "subtitle", e.target.value)}></textarea>
                            </div>
                        </div>
                    )}

                    {/* --- HOME PAGE TABS --- */}
                    {activeTab === "bannerCarousel" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800">Hero Banners</h2>
                            <p className="text-sm text-gray-500 mb-6">Manage homepage carousel banners.</p>
                            <div className="space-y-4">
                                {(cmsData.bannerCarousel || []).map((slide, i) => (
                                    <div key={i} className="border border-gray-200 rounded-lg p-5 bg-gray-50 relative">
                                        <button onClick={() => removeRootArrayItem("bannerCarousel", i)} className="absolute top-3 right-3 text-red-500 hover:text-red-700">Delete</button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Title</label>
                                                <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none" value={slide.title || ""} onChange={(e) => handleRootArrayChange("bannerCarousel", i, "title", e.target.value)} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subtitle</label>
                                                <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none" value={slide.subtitle || ""} onChange={(e) => handleRootArrayChange("bannerCarousel", i, "subtitle", e.target.value)} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">CTA Text</label>
                                                <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none" value={slide.cta || ""} onChange={(e) => handleRootArrayChange("bannerCarousel", i, "cta", e.target.value)} />
                                            </div>
                                            {renderImageInput("Image", "bannerCarousel", null, i, "image", true, slide.image)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => addRootArrayItem("bannerCarousel", { title: "", subtitle: "", cta: "", image: "" })} className="mt-4 text-sm font-semibold text-primary hover:underline">+ Add Banner</button>
                        </div>
                    )}

                    {activeTab === "howItWorks" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800">How It Works</h2>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Section Title</label>
                                <input className="w-full max-w-md border border-gray-300 rounded px-3 py-2 text-sm outline-none" value={cmsData.howItWorks?.title || ""} onChange={(e) => handleRootChange("howItWorks", "title", e.target.value)} />
                            </div>
                            <h3 className="font-semibold text-gray-800 mt-6 mb-3">Steps</h3>
                            <div className="space-y-4">
                                {(cmsData.howItWorks?.steps || []).map((step, i) => (
                                    <div key={i} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex gap-4">
                                        <div className="flex-1">
                                            <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3 outline-none" placeholder="Title" value={step.title || ""} onChange={(e) => handleArrayChange("howItWorks", "steps", i, "title", e.target.value)} />
                                            <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none resize-none" placeholder="Description" rows="2" value={step.description || ""} onChange={(e) => handleArrayChange("howItWorks", "steps", i, "description", e.target.value)}></textarea>
                                        </div>
                                        <button onClick={() => removeArrayItem("howItWorks", "steps", i)} className="text-red-500 hover:bg-red-50 p-2 rounded">Delete</button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => addArrayItem("howItWorks", "steps", { title: "", description: "" })} className="mt-4 text-sm font-semibold text-primary hover:underline">+ Add Step</button>
                        </div>
                    )}

                    {activeTab === "brandCategories" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800">Brand Categories</h2>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                                <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none mb-4" value={cmsData.brandCategories?.title || ""} onChange={(e) => handleRootChange("brandCategories", "title", e.target.value)} />
                                <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle</label>
                                <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none" rows="2" value={cmsData.brandCategories?.subtitle || ""} onChange={(e) => handleRootChange("brandCategories", "subtitle", e.target.value)} />
                            </div>
                        </div>
                    )}

                    {activeTab === "popularServices" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800">Popular Services</h2>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                                <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none mb-4" value={cmsData.popularServices?.title || ""} onChange={(e) => handleRootChange("popularServices", "title", e.target.value)} />
                                <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle / Badge</label>
                                <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none" value={cmsData.popularServices?.subtitle || ""} onChange={(e) => handleRootChange("popularServices", "subtitle", e.target.value)} />
                            </div>
                        </div>
                    )}

                    {activeTab === "whyChooseUs" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800">Why Choose Us</h2>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                                <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none mb-4" value={cmsData.whyChooseUs?.title || ""} onChange={(e) => handleRootChange("whyChooseUs", "title", e.target.value)} />
                                <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle</label>
                                <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none mb-4" value={cmsData.whyChooseUs?.subtitle || ""} onChange={(e) => handleRootChange("whyChooseUs", "subtitle", e.target.value)} />
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none" rows="2" value={cmsData.whyChooseUs?.desc || ""} onChange={(e) => handleRootChange("whyChooseUs", "desc", e.target.value)} />
                            </div>
                            <h3 className="font-semibold text-gray-800 mt-6 mb-3">Features</h3>
                            <div className="space-y-4">
                                {(cmsData.whyChooseUs?.features || []).map((feat, i) => (
                                    <div key={i} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex gap-4">
                                        <div className="flex-1">
                                            <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3 outline-none" value={feat.title || ""} onChange={(e) => handleArrayChange("whyChooseUs", "features", i, "title", e.target.value)} />
                                            <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none" rows="2" value={feat.description || feat.desc || ""} onChange={(e) => handleArrayChange("whyChooseUs", "features", i, "desc", e.target.value)}></textarea>
                                        </div>
                                        <button onClick={() => removeArrayItem("whyChooseUs", "features", i)} className="text-red-500 hover:bg-red-50 p-2 rounded">Delete</button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => addArrayItem("whyChooseUs", "features", { title: "", desc: "" })} className="mt-4 text-sm font-semibold text-primary hover:underline">+ Add Feature</button>
                        </div>
                    )}

                    {activeTab === "appDownload" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800">App Download</h2>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                                <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4" value={cmsData.appDownload?.title || ""} onChange={(e) => handleRootChange("appDownload", "title", e.target.value)} />
                                <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle</label>
                                <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4" value={cmsData.appDownload?.subtitle || ""} onChange={(e) => handleRootChange("appDownload", "subtitle", e.target.value)} />
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4" rows="3" value={cmsData.appDownload?.desc || ""} onChange={(e) => handleRootChange("appDownload", "desc", e.target.value)} />
                            </div>
                        </div>
                    )}

                    {activeTab === "faq" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800">F.A.Q</h2>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                                <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4" value={cmsData.faq?.title || ""} onChange={(e) => handleRootChange("faq", "title", e.target.value)} />
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm" rows="2" value={cmsData.faq?.desc || ""} onChange={(e) => handleRootChange("faq", "desc", e.target.value)}></textarea>
                            </div>
                            <h3 className="font-semibold text-gray-800 mt-6 mb-3">Questions</h3>
                            <div className="space-y-4">
                                {(cmsData.faq?.items || []).map((item, i) => (
                                    <div key={i} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex gap-4">
                                        <div className="flex-1">
                                            <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3" placeholder="Question" value={item.q || item.question || ""} onChange={(e) => handleArrayChange("faq", "items", i, "q", e.target.value)} />
                                            <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="Answer" rows="2" value={item.a || item.answer || ""} onChange={(e) => handleArrayChange("faq", "items", i, "a", e.target.value)}></textarea>
                                        </div>
                                        <button onClick={() => removeArrayItem("faq", "items", i)} className="text-red-500 hover:bg-red-50 p-2 rounded">Delete</button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => addArrayItem("faq", "items", { q: "", a: "" })} className="mt-4 text-sm font-semibold text-primary hover:underline">+ Add FAQ</button>
                        </div>
                    )}


                    {/* --- ABOUT PAGE TABS --- */}
                    {activeTab === "story" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800">Our Story</h2>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Section Title</label>
                                <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4" value={cmsData.story?.title || ""} onChange={(e) => handleRootChange("story", "title", e.target.value)} />
                                <label className="block text-sm font-bold text-gray-700 mb-1">Paragraph 1</label>
                                <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4" rows="3" value={cmsData.story?.p1 || ""} onChange={(e) => handleRootChange("story", "p1", e.target.value)}></textarea>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Paragraph 2</label>
                                <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4" rows="3" value={cmsData.story?.p2 || ""} onChange={(e) => handleRootChange("story", "p2", e.target.value)}></textarea>

                                <h3 className="font-semibold text-gray-800 mt-6 mb-3">Images</h3>
                                {renderImageInput("Image 1", "story", null, null, "img1", false, cmsData.story?.img1)}
                                <div className="mt-4">
                                    {renderImageInput("Image 2", "story", null, null, "img2", false, cmsData.story?.img2)}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "promises" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800">Promises (Core Values)</h2>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                                <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4" value={cmsData.promises?.title || ""} onChange={(e) => handleRootChange("promises", "title", e.target.value)} />
                                <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle</label>
                                <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-4" rows="2" value={cmsData.promises?.subtitle || ""} onChange={(e) => handleRootChange("promises", "subtitle", e.target.value)}></textarea>
                            </div>
                            <h3 className="font-semibold text-gray-800 mt-6 mb-3">Values List</h3>
                            <div className="space-y-4">
                                {(cmsData.promises?.items || []).map((item, i) => (
                                    <div key={i} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex gap-4">
                                        <div className="flex-1">
                                            <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3" placeholder="Value Title" value={item.title || ""} onChange={(e) => handleArrayChange("promises", "items", i, "title", e.target.value)} />
                                            <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="Description" rows="2" value={item.desc || ""} onChange={(e) => handleArrayChange("promises", "items", i, "desc", e.target.value)}></textarea>
                                        </div>
                                        <button onClick={() => removeArrayItem("promises", "items", i)} className="text-red-500 hover:bg-red-50 p-2 rounded">Delete</button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => addArrayItem("promises", "items", { title: "", desc: "" })} className="mt-4 text-sm font-semibold text-primary hover:underline">+ Add Value</button>
                        </div>
                    )}

                    {activeTab === "stats" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800">Global Stats</h2>
                            <div className="space-y-4">
                                {(cmsData.stats || []).map((stat, i) => (
                                    <div key={i} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex gap-4 items-center">
                                        <input className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" placeholder="Label (e.g. Happy Customers)" value={stat.label || ""} onChange={(e) => handleRootArrayChange("stats", i, "label", e.target.value)} />
                                        <input className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" placeholder="Value (e.g. 98%)" value={stat.value || ""} onChange={(e) => handleRootArrayChange("stats", i, "value", e.target.value)} />
                                        <button onClick={() => removeRootArrayItem("stats", i)} className="text-red-500 hover:bg-red-50 p-2 rounded">Delete</button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => addRootArrayItem("stats", { label: "", value: "" })} className="mt-4 text-sm font-semibold text-primary hover:underline">+ Add Stat</button>
                        </div>
                    )}


                    {/* --- SERVICES PAGE TABS --- */}
                    {activeTab === "servicesList" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800">Services List</h2>
                            <p className="text-sm text-gray-500 mb-6">Manage the services offered.</p>
                            <div className="space-y-4">
                                {(cmsData.servicesList || []).map((svc, i) => (
                                    <div key={i} className="border border-gray-200 rounded-lg p-5 bg-gray-50 relative">
                                        <button onClick={() => removeRootArrayItem("servicesList", i)} className="absolute top-3 right-3 text-red-500 hover:text-red-700">Delete</button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Title</label>
                                                <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none" value={svc.title || ""} onChange={(e) => handleRootArrayChange("servicesList", i, "title", e.target.value)} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Short text</label>
                                                <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none" value={svc.short || ""} onChange={(e) => handleRootArrayChange("servicesList", i, "short", e.target.value)} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Starting Price</label>
                                                <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none" value={svc.price || ""} onChange={(e) => handleRootArrayChange("servicesList", i, "price", e.target.value)} />
                                            </div>
                                            {renderImageInput("Icon Image", "servicesList", null, i, "image", true, svc.image)}
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                                                <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none resize-none" rows="2" value={svc.desc || ""} onChange={(e) => handleRootArrayChange("servicesList", i, "desc", e.target.value)}></textarea>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => addRootArrayItem("servicesList", { title: "", short: "", desc: "", price: "", image: "" })} className="mt-4 text-sm font-semibold text-primary hover:underline">+ Add Service</button>
                        </div>
                    )}


                    {/* --- TRACK REPAIR TABS --- */}
                    {activeTab === "features" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800">Features Grid</h2>
                            <div className="space-y-4">
                                {(cmsData.features || []).map((feat, i) => (
                                    <div key={i} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex gap-4">
                                        <div className="flex-1">
                                            <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3" placeholder="Title" value={feat.title || ""} onChange={(e) => handleRootArrayChange("features", i, "title", e.target.value)} />
                                            <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="Description" rows="2" value={feat.desc || ""} onChange={(e) => handleRootArrayChange("features", i, "desc", e.target.value)}></textarea>
                                        </div>
                                        <button onClick={() => removeRootArrayItem("features", i)} className="text-red-500 hover:bg-red-50 p-2 rounded">Delete</button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => addRootArrayItem("features", { title: "", desc: "" })} className="mt-4 text-sm font-semibold text-primary hover:underline">+ Add Feature</button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
