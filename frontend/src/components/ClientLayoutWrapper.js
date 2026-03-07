"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import QuickActions from "@/components/QuickActions";
import Footer from "@/components/Footer";

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();

  // Check if we are inside the admin or partner panel
  const isAdminRoute = pathname?.startsWith('/admin');
  const isPartnerRoute = pathname?.startsWith('/worker');

  if (isAdminRoute || isPartnerRoute) {
    return <div className="flex-1 flex flex-col">{children}</div>;
  }

  // Consumer site layout
  return (
    <React.Fragment>
      <Navbar />
      <QuickActions />
      <div className="flex-1 flex flex-col">{children}</div>
      <Footer />
    </React.Fragment>
  );
}
