"use client";

import { useState, useEffect } from "react";

const brands = [
  {
    name: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    models: [
      { name: "iPhone 15 Pro Max", image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro-max.jpg" },
      { name: "iPhone 15 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro.jpg" },
      { name: "iPhone 15 Plus", image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-plus-.jpg" },
      { name: "iPhone 15", image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15.jpg" },
      { name: "iPhone 14 Pro Max", image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-pro-max-.jpg" },
      { name: "iPhone 14 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-pro.jpg" },
      { name: "iPhone 14 Plus", image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-plus.jpg" },
      { name: "iPhone 14", image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14.jpg" },
      { name: "iPhone 13 Pro Max", image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13-pro-max.jpg" },
      { name: "iPhone 13 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13-pro.jpg" },
      { name: "iPhone 13", image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13.jpg" },
      { name: "iPhone 13 mini", image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13-mini.jpg" },
      { name: "iPhone 12 Pro Max", image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-12-pro-max-.jpg" },
      { name: "iPhone 12 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-12-pro--.jpg" },
      { name: "iPhone 12", image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-12.jpg" },
      { name: "iPhone 11", image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-11.jpg" },
    ]
  },
  {
    name: "Samsung",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
    models: [
      { name: "Galaxy S24 Ultra", image: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-ultra-5g-sm-s928-u1.jpg" },
      { name: "Galaxy S24+", image: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-plus-5g-sm-s926.jpg" },
      { name: "Galaxy S24", image: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-5g-sm-s921.jpg" },
      { name: "Galaxy Z Fold 5", image: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold5-5g.jpg" },
      { name: "Galaxy Z Flip 5", image: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-flip5-5g.jpg" },
      { name: "Galaxy S23 Ultra", image: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-ultra-5g.jpg" },
      { name: "Galaxy S23+", image: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-plus-5g.jpg" },
      { name: "Galaxy S23", image: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-5g.jpg" },
      { name: "Galaxy A54 5G", image: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a54.jpg" },
      { name: "Galaxy A34 5G", image: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a34.jpg" },
      { name: "Galaxy S22 Ultra", image: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s22-ultra-5g.jpg" },
      { name: "Galaxy S22", image: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s22-5g.jpg" },
      { name: "Galaxy Z Fold 4", image: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold4-5g.jpg" },
      { name: "Galaxy Z Flip 4", image: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-flip4-5g.jpg" },
    ]
  },
  {
    name: "OnePlus",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/9e/OnePlus_logo.svg",
    models: [
      { name: "OnePlus 12", image: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-12.jpg" },
      { name: "OnePlus 12R", image: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-12r.jpg" },
      { name: "OnePlus Open", image: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-open.jpg" },
      { name: "OnePlus 11 5G", image: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-11.jpg" },
      { name: "OnePlus 11R", image: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-11r-5g.jpg" },
      { name: "OnePlus 10 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-10-pro.jpg" },
      { name: "OnePlus 10T", image: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-10t.jpg" },
      { name: "OnePlus 10R", image: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-10r.jpg" },
      { name: "OnePlus 9 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-9-pro-.jpg" },
      { name: "OnePlus 9", image: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-9-.jpg" },
      { name: "OnePlus 9RT", image: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-9rt-5g.jpg" },
      { name: "OnePlus Nord 3", image: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-3-5g.jpg" },
      { name: "OnePlus Nord CE 3", image: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-ce-3-5g.jpg" },
      { name: "OnePlus 8T", image: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-8t.jpg" },
      { name: "OnePlus 8 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-8-pro.jpg" },
    ]
  },
  {
    name: "Xiaomi",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg",
    models: [
      { name: "Xiaomi 14 Ultra", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14-ultra.jpg" },
      { name: "Xiaomi 14 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14-pro.jpg" },
      { name: "Xiaomi 14", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14.jpg" },
      { name: "Xiaomi 13 Ultra", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-13-ultra.jpg" },
      { name: "Xiaomi 13 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-13-pro-new.jpg" },
      { name: "Xiaomi 13", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-13.jpg" },
      { name: "Xiaomi 12 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-12-pro.jpg" },
      { name: "Xiaomi 12", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-12.jpg" },
      { name: "Xiaomi 11T Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-11t-pro.jpg" },
      { name: "Xiaomi 11 Ultra", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-mi11-ultra-5g-k1.jpg" },
      { name: "Redmi Note 13 Pro+", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-13-pro-plus.jpg" },
      { name: "Redmi Note 13 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-13-pro.jpg" },
      { name: "Redmi Note 13", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-13-5g.jpg" },
      { name: "Redmi Note 12 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-12-pro.jpg" },
      { name: "Redmi Note 12", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-12-mxgwq.jpg" },
    ]
  },
  {
    name: "Vivo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/13/Vivo_logo_2019.svg",
    models: [
      { name: "Vivo X100 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x100-pro.jpg" },
      { name: "Vivo X100", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x100.jpg" },
      { name: "Vivo X90 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x90-pro.jpg" },
      { name: "Vivo X90", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x90.jpg" },
      { name: "Vivo V30 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v30-pro.jpg" },
      { name: "Vivo V30", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v30.jpg" },
      { name: "Vivo V29 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v29-pro.jpg" },
      { name: "Vivo V29", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v29-5g.jpg" },
      { name: "Vivo V27 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v27-pro.jpg" },
      { name: "Vivo V27", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v27-5g.jpg" },
      { name: "Vivo T2 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-t2-pro.jpg" },
      { name: "Vivo T2", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-t2-5g-india.jpg" },
      { name: "Vivo Y200e", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y200e.jpg" },
      { name: "Vivo Y200", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y200-.jpg" },
      { name: "Vivo Y100", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y100.jpg" },
    ]
  },
  {
    name: "Oppo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a2/OPPO_LOGO_2019.svg",
    models: [
      { name: "Oppo Find X7 Ultra", image: "https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x7-ultra.jpg" },
      { name: "Oppo Find X7", image: "https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x7.jpg" },
      { name: "Oppo Find N3", image: "https://fdn2.gsmarena.com/vv/bigpic/oppo-find-n3.jpg" },
      { name: "Oppo Find N3 Flip", image: "https://fdn2.gsmarena.com/vv/bigpic/oppo-find-n3-flip.jpg" },
      { name: "Oppo Reno 11 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/oppo-reno11-pro-international.jpg" },
      { name: "Oppo Reno 11", image: "https://fdn2.gsmarena.com/vv/bigpic/oppo-reno11-international.jpg" },
      { name: "Oppo Reno 10 Pro+", image: "https://fdn2.gsmarena.com/vv/bigpic/oppo-reno10-pro-plus.jpg" },
      { name: "Oppo Reno 10 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/oppo-reno10-pro-international.jpg" },
      { name: "Oppo Reno 10", image: "https://fdn2.gsmarena.com/vv/bigpic/oppo-reno10-international.jpg" },
      { name: "Oppo Find X6 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x6-pro.jpg" },
      { name: "Oppo Reno 8 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/oppo-reno8-pro.jpg" },
      { name: "Oppo Reno 8", image: "https://fdn2.gsmarena.com/vv/bigpic/oppo-reno8-5g.jpg" },
      { name: "Oppo F25 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/oppo-f25-pro.jpg" },
      { name: "Oppo F23 5G", image: "https://fdn2.gsmarena.com/vv/bigpic/oppo-f23-5g.jpg" },
      { name: "Oppo F21s Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/oppo-f21s-pro.jpg" },
    ]
  },
  {
    name: "Realme",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Realme_logo.svg",
    models: [
      { name: "Realme 12 Pro+", image: "https://fdn2.gsmarena.com/vv/bigpic/realme-12-pro-plus.jpg" },
      { name: "Realme 12 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/realme-12-pro.jpg" },
      { name: "Realme GT 5 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/realme-gt5-pro.jpg" },
      { name: "Realme GT Neo 3", image: "https://fdn2.gsmarena.com/vv/bigpic/realme-gt-neo3.jpg" },
      { name: "Realme 11 Pro+", image: "https://fdn2.gsmarena.com/vv/bigpic/realme-11-pro-plus-.jpg" },
      { name: "Realme 11 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/realme-11-pro.jpg" },
      { name: "Realme 11 5G", image: "https://fdn2.gsmarena.com/vv/bigpic/realme-11-5g.jpg" },
      { name: "Realme 11x 5G", image: "https://fdn2.gsmarena.com/vv/bigpic/realme-11x.jpg" },
      { name: "Realme Narzo 60 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/realme-narzo-60-pro.jpg" },
      { name: "Realme Narzo 60", image: "https://fdn2.gsmarena.com/vv/bigpic/realme-narzo-60.jpg" },
      { name: "Realme C67 5G", image: "https://fdn2.gsmarena.com/vv/bigpic/realme-c67-5g.jpg" },
      { name: "Realme C55", image: "https://fdn2.gsmarena.com/vv/bigpic/realme-c55.jpg" },
      { name: "Realme C53", image: "https://fdn2.gsmarena.com/vv/bigpic/realme-c53.jpg" },
      { name: "Realme GT 2 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/realme-gt2-pro.jpg" },
      { name: "Realme 10 Pro+", image: "https://fdn2.gsmarena.com/vv/bigpic/realme-10-pro-plus-.jpg" },
    ]
  },
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    models: [
      { name: "Pixel 8 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8-pro.jpg" },
      { name: "Pixel 8", image: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8.jpg" },
      { name: "Pixel 7a", image: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-7a.jpg" },
      { name: "Pixel 7 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel7-pro-new.jpg" },
      { name: "Pixel 7", image: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-7-1.jpg" },
      { name: "Pixel 6a", image: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-6a.jpg" },
      { name: "Pixel 6 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-6-pro.jpg" },
      { name: "Pixel 6", image: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-6.jpg" },
      { name: "Pixel Fold", image: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-fold.jpg" },
      { name: "Pixel 5a", image: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-5a-5g.jpg" },
      { name: "Pixel 5", image: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-5-5g.jpg" },
      { name: "Pixel 4a 5G", image: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-4a-5g.jpg" },
      { name: "Pixel 4 XL", image: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-4-xl-1.jpg" },
      { name: "Pixel 4", image: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-4-1.jpg" },
      { name: "Pixel 3a XL", image: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-3a-xl-.jpg" },
    ]
  },
  {
    name: "Motorola",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Motorola-logo.svg",
    models: [
      { name: "Edge 50 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/motorola-edge-50-pro.jpg" },
      { name: "Edge 40 Neo", image: "https://fdn2.gsmarena.com/vv/bigpic/motorola-edge-40-neo.jpg" },
      { name: "Edge 40", image: "https://fdn2.gsmarena.com/vv/bigpic/motorola-edge-40.jpg" },
      { name: "Edge 30 Ultra", image: "https://fdn2.gsmarena.com/vv/bigpic/motorola-edge-30-ultra.jpg" },
      { name: "Edge 30 Fusion", image: "https://fdn2.gsmarena.com/vv/bigpic/motorola-edge-30-fusion.jpg" },
      { name: "Edge 30 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/motorola-edge-30-pro.jpg" },
      { name: "Moto G84", image: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g84.jpg" },
      { name: "Moto G54", image: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g54.jpg" },
      { name: "Moto G34", image: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g34.jpg" },
      { name: "Moto G82", image: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g82.jpg" },
      { name: "Moto G62", image: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g62-5g.jpg" },
      { name: "Moto G52", image: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g52.jpg" },
      { name: "Razr 40 Ultra", image: "https://fdn2.gsmarena.com/vv/bigpic/motorola-razr-40-ultra.jpg" },
      { name: "Razr 40", image: "https://fdn2.gsmarena.com/vv/bigpic/motorola-razr-40.jpg" },
      { name: "Edge 20 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/motorola-edge-20-pro.jpg" },
    ]
  },
  {
    name: "Nothing",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Nothing_logo.svg",
    models: [
      { name: "Phone (2a)", image: "https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-2a.jpg" },
      { name: "Phone (2)", image: "https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-2.jpg" },
      { name: "Phone (1)", image: "https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-1.jpg" },
      { name: "CMF Phone 1", image: "https://fdn2.gsmarena.com/vv/bigpic/nothing-cmf-phone-1.jpg" },
    ]
  },
  {
    name: "iQOO",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/00/IQOO_Logo.svg",
    models: [
      { name: "iQOO 12", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-12.jpg" },
      { name: "iQOO 11", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-11.jpg" },
      { name: "iQOO 9 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-9-pro.jpg" },
      { name: "iQOO 9T", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-9t.jpg" },
      { name: "iQOO 9", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-9.jpg" },
      { name: "iQOO Neo 9 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-neo9-pro-.jpg" },
      { name: "iQOO Neo 7 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-neo-7-pro.jpg" },
      { name: "iQOO Neo 7", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-neo7.jpg" },
      { name: "iQOO Neo 6", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-neo6-india.jpg" },
      { name: "iQOO Z9", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-z9.jpg" },
      { name: "iQOO Z7 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-z7-pro.jpg" },
      { name: "iQOO Z7", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-z7.jpg" },
      { name: "iQOO Z6 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-z6-pro.jpg" },
      { name: "iQOO Z6 Lite", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-z6-lite.jpg" },
      { name: "iQOO Z6", image: "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-z6.jpg" },
    ]
  },
  {
    name: "Poco",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/6c/POCO_brand_logo.svg",
    models: [
      { name: "Poco X6 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-x6-pro.jpg" },
      { name: "Poco X6", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-x6.jpg" },
      { name: "Poco M6 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-m6-pro.jpg" },
      { name: "Poco M6 5G", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-m6-5g.jpg" },
      { name: "Poco F5 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-f5-pro-1.jpg" },
      { name: "Poco F5", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-f5.jpg" },
      { name: "Poco X5 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-x5-pro-5g.jpg" },
      { name: "Poco X5", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-x5.jpg" },
      { name: "Poco M5", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-m5.jpg" },
      { name: "Poco F4 5G", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-f4-5g.jpg" },
      { name: "Poco X4 Pro 5G", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-x4-pro.jpg" },
      { name: "Poco M4 Pro 5G", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-m4-pro-5g-1.jpg" },
      { name: "Poco M4 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-m4-pro.jpg" },
      { name: "Poco C65", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-c65.jpg" },
      { name: "Poco C55", image: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-c55.jpg" },
    ]
  },
  {
    name: "Nokia",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/02/Nokia_wordmark.svg",
    models: [
      { name: "Nokia G42", image: "https://fdn2.gsmarena.com/vv/bigpic/nokia-g42.jpg" },
      { name: "Nokia X30", image: "https://fdn2.gsmarena.com/vv/bigpic/nokia-x30-5g.jpg" },
      { name: "Nokia G60", image: "https://fdn2.gsmarena.com/vv/bigpic/nokia-g60-5g.jpg" },
      { name: "Nokia C32", image: "https://fdn2.gsmarena.com/vv/bigpic/nokia-c32.jpg" },
      { name: "Nokia C22", image: "https://fdn2.gsmarena.com/vv/bigpic/nokia-c22.jpg" },
      { name: "Nokia C12", image: "https://fdn2.gsmarena.com/vv/bigpic/nokia-c12.jpg" },
      { name: "Nokia G21", image: "https://fdn2.gsmarena.com/vv/bigpic/nokia-g21.jpg" },
      { name: "Nokia XR20", image: "https://fdn2.gsmarena.com/vv/bigpic/nokia-xr20-.jpg" },
      { name: "Nokia G20", image: "https://fdn2.gsmarena.com/vv/bigpic/nokia-g20.jpg" },
      { name: "Nokia 5.4", image: "https://fdn2.gsmarena.com/vv/bigpic/nokia-54.jpg" },
      { name: "Nokia 5.3", image: "https://fdn2.gsmarena.com/vv/bigpic/nokia-53.jpg" },
      { name: "Nokia 8.3 5G", image: "https://fdn2.gsmarena.com/vv/bigpic/nokia-83-5g.jpg" },
      { name: "Nokia 7.2", image: "https://fdn2.gsmarena.com/vv/bigpic/nokia-72-.jpg" },
      { name: "Nokia 6.2", image: "https://fdn2.gsmarena.com/vv/bigpic/nokia-62-.jpg" },
      { name: "Nokia 3.4", image: "https://fdn2.gsmarena.com/vv/bigpic/nokia-34.jpg" },
    ]
  },
  {
    name: "Sony",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg",
    models: [
      { name: "Xperia 1 V", image: "https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-1-v-new.jpg" },
      { name: "Xperia 5 V", image: "https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-5-v.jpg" },
      { name: "Xperia 10 V", image: "https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-10-v.jpg" },
      { name: "Xperia 1 IV", image: "https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-1-iv.jpg" },
      { name: "Xperia 5 IV", image: "https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-5-iv-.jpg" },
      { name: "Xperia 10 IV", image: "https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-10-iv-.jpg" },
      { name: "Xperia PRO-I", image: "https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-pro-i.jpg" },
      { name: "Xperia 1 III", image: "https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-1-iii.jpg" },
      { name: "Xperia 5 III", image: "https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-5-iii.jpg" },
      { name: "Xperia 10 III", image: "https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-10-iii.jpg" },
      { name: "Xperia PRO", image: "https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-pro.jpg" },
      { name: "Xperia 1 II", image: "https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-1-ii.jpg" },
      { name: "Xperia 5 II", image: "https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-5-ii-.jpg" },
      { name: "Xperia 10 II", image: "https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-10-ii-.jpg" },
      { name: "Xperia 1", image: "https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-1.jpg" },
    ]
  },
  {
    name: "Asus",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg",
    models: [
      { name: "ROG Phone 8 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/asus-rog-phone-8-pro.jpg" },
      { name: "ROG Phone 8", image: "https://fdn2.gsmarena.com/vv/bigpic/asus-rog-phone-8.jpg" },
      { name: "Zenfone 11 Ultra", image: "https://fdn2.gsmarena.com/vv/bigpic/asus-zenfone-11-ultra.jpg" },
      { name: "Zenfone 10", image: "https://fdn2.gsmarena.com/vv/bigpic/asus-zenfone10-.jpg" },
      { name: "ROG Phone 7 Ultimate", image: "https://fdn2.gsmarena.com/vv/bigpic/asus-rog-phone-7-ultimate.jpg" },
      { name: "ROG Phone 7", image: "https://fdn2.gsmarena.com/vv/bigpic/asus-rog-phone-7.jpg" },
      { name: "Zenfone 9", image: "https://fdn2.gsmarena.com/vv/bigpic/asus-zenfone-9.jpg" },
      { name: "ROG Phone 6 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/asus-rog-phone6-pro.jpg" },
      { name: "ROG Phone 6", image: "https://fdn2.gsmarena.com/vv/bigpic/asus-rog-phone6.jpg" },
      { name: "ROG Phone 6D Ultimate", image: "https://fdn2.gsmarena.com/vv/bigpic/asus-rog-phone-6d-ultimate.jpg" },
      { name: "Zenfone 8 Flip", image: "https://fdn2.gsmarena.com/vv/bigpic/asus-zenfone-8-flip-1.jpg" },
      { name: "Zenfone 8", image: "https://fdn2.gsmarena.com/vv/bigpic/asus-zenfone-8-1.jpg" },
      { name: "ROG Phone 5s Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/asus-rog-phone-5s-pro.jpg" },
      { name: "ROG Phone 5s", image: "https://fdn2.gsmarena.com/vv/bigpic/asus-rog-phone-5s.jpg" },
      { name: "ROG Phone 5 Ultimate", image: "https://fdn2.gsmarena.com/vv/bigpic/asus-rog-phone-5-ultimate.jpg" },
    ]
  },
  {
    name: "Huawei",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e8/HUAWEI_Logo.svg",
    models: [
      { name: "Mate 60 Pro+", image: "https://fdn2.gsmarena.com/vv/bigpic/huawei-mate60-pro-plus.jpg" },
      { name: "Mate 60 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/huawei-mate-60-pro.jpg" },
      { name: "Mate 60", image: "https://fdn2.gsmarena.com/vv/bigpic/huawei-mate-60.jpg" },
      { name: "P60 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/huawei-p60-pro.jpg" },
      { name: "P60 Art", image: "https://fdn2.gsmarena.com/vv/bigpic/huawei-p60-art.jpg" },
      { name: "P60", image: "https://fdn2.gsmarena.com/vv/bigpic/huawei-p60.jpg" },
      { name: "Mate X5", image: "https://fdn2.gsmarena.com/vv/bigpic/huawei-mate-x5.jpg" },
      { name: "Mate X3", image: "https://fdn2.gsmarena.com/vv/bigpic/huawei-mate-x3.jpg" },
      { name: "Nova 12 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/huawei-nova-12-pro.jpg" },
      { name: "Nova 12", image: "https://fdn2.gsmarena.com/vv/bigpic/huawei-nova-12.jpg" },
      { name: "Nova 11 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/huawei-nova-11-pro.jpg" },
      { name: "Nova 11", image: "https://fdn2.gsmarena.com/vv/bigpic/huawei-nova-11.jpg" },
      { name: "P50 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/huawei-p50-pro.jpg" },
      { name: "P50 Pocket", image: "https://fdn2.gsmarena.com/vv/bigpic/huawei-p50-pocket.jpg" },
      { name: "Mate 50 Pro", image: "https://fdn2.gsmarena.com/vv/bigpic/huawei-mate-50-pro-1.jpg" },
    ]
  },
];

// Fallback: render brand initial when image fails
function BrandLogo({ brand }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="text-primary font-bold text-lg">
          {brand.name.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={brand.logo}
      alt={brand.name}
      className="w-12 h-12 object-contain"
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

  const repairIssues = [
    { id: 'screen', name: 'Screen Replacement', price: '₹2,499 - ₹8,999', time: '45-60 Mins', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { id: 'battery', name: 'Battery Replacement', price: '₹999 - ₹2,499', time: '30-45 Mins', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'charging', name: 'Charging Port Issue', price: '₹799 - ₹1,499', time: '45-60 Mins', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'camera', name: 'Camera Repair', price: '₹1,299 - ₹4,499', time: '60-90 Mins', icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z' },
    { id: 'speaker', name: 'Speaker Not Working', price: '₹699 - ₹1,499', time: '30-45 Mins', icon: 'M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  const shopLocations = [
    { id: 'shop1', name: 'Mobitel - Connaught Place', address: 'Shop No. 12, Block A, Connaught Place, New Delhi - 110001', hours: '10:00 AM - 8:00 PM', phone: '+91 98765 43210' },
    { id: 'shop2', name: 'Mobitel - Laxmi Nagar', address: 'Plot No. 5, Main Market, Laxmi Nagar, New Delhi - 110092', hours: '10:00 AM - 9:00 PM', phone: '+91 98765 43211' },
    { id: 'shop3', name: 'Mobitel - Nehru Place', address: '2nd Floor, Shop 204, Nehru Place, New Delhi - 110019', hours: '11:00 AM - 8:00 PM', phone: '+91 98765 43212' },
  ];

  const timeSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];

  useEffect(() => {
    if (selectedBrand) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedBrand]);

  const resetAll = () => {
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedIssue(null);
    setServiceType(null);
    setBookingSubmitted(false);
    setBookingForm({ name: '', phone: '', email: '', date: '', time: '', address: '', landmark: '', pincode: '', selectedShop: '' });
  };

  const handleBack = () => {
    if (bookingSubmitted) { setBookingSubmitted(false); return; }
    if (serviceType) { setServiceType(null); setBookingForm({ name: '', phone: '', email: '', date: '', time: '', address: '', landmark: '', pincode: '', selectedShop: '' }); return; }
    if (selectedIssue) { setSelectedIssue(null); return; }
    if (selectedModel) { setSelectedModel(null); return; }
  };

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/requests`, {
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
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {brands.map((brand) => (
          <button key={brand.name} onClick={() => setSelectedBrand(brand)} className="group flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 outline-none w-full cursor-pointer">
            <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-surface group-hover:bg-primary/5 transition-colors">
              <BrandLogo brand={brand} />
            </div>
            <span className="text-xs sm:text-sm font-medium text-dark group-hover:text-primary transition-colors text-center w-full truncate">{brand.name}</span>
          </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" onClick={resetAll}></div>

          <div className="relative bg-white border border-border w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col z-10">
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {selectedBrand.models?.map((model, idx) => (
                    <button key={idx} onClick={() => setSelectedModel(model)} className="flex flex-col items-center justify-start p-4 rounded-xl border border-gray-100 bg-white hover:border-primary/40 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 group gap-3">
                      <div className="w-full aspect-[3/4] max-h-24 sm:max-h-32 bg-surface rounded-lg flex items-center justify-center mb-1 group-hover:bg-white transition-colors border border-transparent group-hover:border-primary/10 overflow-hidden">
                        <img src={model.image} alt={model.name} className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-dark text-center line-clamp-2 w-full group-hover:text-primary transition-colors">{model.name}</span>
                    </button>
                  ))}
                  <button onClick={() => setSelectedModel({ name: 'Other / Unlisted Model' })} className="flex flex-col items-center justify-start p-4 rounded-xl border border-gray-100 bg-white hover:border-primary/40 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 group gap-3">
                    <div className="w-full aspect-[3/4] max-h-24 sm:max-h-32 bg-surface rounded-lg flex items-center justify-center p-2 mb-1 group-hover:bg-white transition-colors border border-transparent group-hover:border-primary/10">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-primary/10 transition-colors">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-dark text-center line-clamp-2 w-full group-hover:text-primary transition-colors">Other Model</span>
                  </button>
                </div>
              )}

              {/* ── STEP 2: Issue Selection ── */}
              {selectedModel && !selectedIssue && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {repairIssues.map((issue) => (
                    <button key={issue.id} onClick={() => setSelectedIssue(issue)} className="flex flex-col text-left p-5 rounded-2xl border border-gray-100 bg-white hover:border-primary/40 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 group">
                      <div className="flex items-start justify-between w-full mb-3">
                        <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center group-hover:bg-white group-hover:text-primary text-gray-500 transition-colors shadow-sm">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={issue.icon} />
                          </svg>
                        </div>
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full whitespace-nowrap">{issue.time}</span>
                      </div>
                      <h4 className="font-semibold text-dark text-base mb-1 group-hover:text-primary transition-colors">{issue.name}</h4>
                      <div className="mt-auto pt-3 flex items-center justify-between w-full border-t border-gray-50 group-hover:border-primary/10">
                        <span className="text-xs text-muted">Est. Cost</span>
                        <span className="font-bold text-dark text-sm">{issue.price}</span>
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
