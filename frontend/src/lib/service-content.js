/**
 * Unique SEO content for each individual service page.
 * Each service has its own "whatIsContent" paragraphs and unique FAQs.
 */

import { LOCATION, CONTACT } from './seo-config';

const city = LOCATION.city;

export const SERVICE_CONTENT = {
  "screen-replacement": {
    whatIsContent: [
      `Phone screen replacement is the process of removing a cracked, shattered, or unresponsive display and installing a brand-new screen module. Whether your screen has a small crack, spider-web fractures, or has gone completely black, our technicians at Mobitel ${city} can restore it to perfect condition.`,
      `Common signs you need screen replacement include visible cracks, touch responsiveness issues, discoloration or dead pixels, flickering display, or a screen that has gone completely dark even though the phone vibrates or makes sounds. A damaged screen can also cut your fingers or let dust and moisture enter the phone, causing further damage.`,
      `At Mobitel, we use premium OEM-grade display assemblies that include the digitizer, LCD/OLED panel, and front glass — ensuring your phone looks and feels like new. Most screen replacements at our ${city} center are completed in under 60 minutes, and every replacement comes with a 90-day warranty.`,
    ],
    faqs: [
      { question: `How long does phone screen replacement take in ${city}?`, answer: `Most phone screen replacements at our ${city} center are completed within 30-60 minutes. For complex OLED screens like iPhone Pro Max or Samsung Ultra models, it may take up to 90 minutes. We offer same-day service for most models.` },
      { question: `How much does screen replacement cost for iPhone in ${city}?`, answer: `iPhone screen replacement at Mobitel ${city} ranges from ₹2,999 to ₹12,999 depending on the model. iPhone SE and older models start from ₹2,999, while iPhone 15 Pro Max can go up to ₹12,999. Book a free diagnosis for an exact quote.` },
      { question: "Do you use original screens or duplicate?", answer: `We use high-quality OEM-grade compatible screens that match original specifications. These screens offer the same touch sensitivity, color accuracy, and durability as original parts. For select iPhone models, we also offer genuine Apple displays at premium pricing.` },
      { question: "Will I lose my data during screen replacement?", answer: "No, screen replacement does not affect your data at all. Your photos, contacts, apps, and all data remain completely safe. We only replace the display module — the phone's storage and motherboard are not touched." },
      { question: `Is there warranty on screen replacement at Mobitel ${city}?`, answer: `Yes, every screen replacement at Mobitel comes with a full 90-day warranty. If the new screen develops any defects — dead pixels, touch issues, or discoloration — within 90 days, we replace it completely free of charge. Physical damage to the new screen is not covered.` },
      { question: "Can you replace just the glass without changing the full screen?", answer: "For most modern phones, we replace the entire display assembly (glass + digitizer + LCD/OLED) as a single unit. This ensures the best quality and reliability. Attempting to change just the glass risks damaging the underlying OLED panel." },
    ],
  },

  "battery-replacement": {
    whatIsContent: [
      `Phone battery replacement involves removing the worn-out or degraded battery from your smartphone and installing a new, high-capacity battery to restore your phone's original battery life. Over time, all lithium-ion batteries degrade — typically after 500-800 charge cycles (about 2 years), your battery retains only 70-80% of its original capacity.`,
      `Signs you need a battery replacement include the phone dying unexpectedly even with charge remaining, rapid battery drain (needing to charge 2-3 times a day), the phone getting unusually hot during normal use, the battery percentage jumping erratically, or worst case — a swollen battery that causes the back panel or screen to bulge outward.`,
      `At Mobitel ${city}, our technicians use certified, high-capacity batteries sourced from authorized suppliers. The replacement process takes just 20-30 minutes for most phones. We also run a full battery health diagnostic before and after replacement to ensure your phone is performing optimally.`,
    ],
    faqs: [
      { question: `How long does battery replacement take in ${city}?`, answer: `Battery replacement at Mobitel ${city} typically takes just 20-30 minutes. In some cases involving waterproof adhesive re-sealing (like iPhone and Samsung flagships), it may take up to 45 minutes. Walk-ins are welcome, or book an appointment online.` },
      { question: "How do I know if my phone battery needs replacement?", answer: "Check your battery health in Settings — if it's below 80%, replacement is recommended. Other signs include: phone dying before reaching 0%, sudden shutdowns, extremely slow charging, phone getting hot during normal use, or visible battery swelling." },
      { question: `How much does iPhone battery replacement cost in ${city}?`, answer: `iPhone battery replacement at Mobitel ${city} ranges from ₹1,999 (iPhone SE, 6/7/8 series) to ₹4,999 (iPhone 14/15 Pro Max). Samsung battery replacement starts from ₹999. Contact us for your exact model pricing.` },
      { question: "Will battery replacement make my old phone fast again?", answer: "Yes, in many cases! When batteries degrade, phones throttle their processor speed to prevent shutdowns. A new battery removes this throttling, making your phone noticeably faster. Combined with our free software optimization, your phone can feel nearly new again." },
      { question: "Is the replacement battery original?", answer: "We use high-quality batteries from certified manufacturers that match or exceed original specifications. These batteries offer the same capacity, voltage, and safety certifications as factory batteries. For iPhones, we also offer genuine Apple batteries at premium pricing." },
    ],
  },

  "charging-port-repair": {
    whatIsContent: [
      `Charging port repair involves fixing or replacing the USB-C, Lightning, or Micro-USB port on your smartphone when it stops charging properly. The charging port is one of the most used (and abused) components of any phone — plugging and unplugging the charger multiple times daily causes wear and tear over time.`,
      `Common charging port problems include: the charger cable falling out easily (loose connection), having to hold the cable at a specific angle to charge, very slow charging speeds, the phone not recognizing the cable at all, or error messages like "accessory not supported." Sometimes the issue is just lint and debris buildup inside the port, which we can clean professionally.`,
      `Our ${city} technicians first perform a thorough diagnosis to determine if the port needs cleaning, micro-soldering repair, or a complete replacement. Most charging port repairs at Mobitel are completed within 30-45 minutes, and we test with multiple cables and adapters to ensure perfect functionality before returning your device.`,
    ],
    faqs: [
      { question: "Why is my phone not charging even with a new cable?", answer: "If your phone doesn't charge with multiple cables, the issue is likely a damaged charging port. Causes include physical damage from forceful plugging, liquid exposure, or accumulated lint and debris. Visit Mobitel for a free diagnosis — sometimes a professional cleaning solves the problem without needing a replacement." },
      { question: `How much does charging port repair cost in ${city}?`, answer: `Charging port repair at Mobitel ${city} starts from just ₹499. Simple cleaning costs ₹499, while a full port replacement ranges from ₹999 to ₹2,999 depending on your phone brand and model. iPhone Lightning port repairs start from ₹1,499.` },
      { question: "Can a damaged charging port be repaired or does it need replacement?", answer: "It depends on the damage. If the port pins are bent, our technicians can sometimes straighten them. If the port is physically broken or the solder connections are damaged, we replace the entire port assembly. We always try the least invasive fix first to save you money." },
      { question: "Will charging port repair affect my phone's water resistance?", answer: "We take every precaution to maintain your phone's water resistance during repair. After replacing the charging port, we re-apply waterproof adhesive seals where applicable. However, we recommend being extra careful with water exposure after any port repair." },
      { question: "How long does charging port repair take?", answer: `Most charging port repairs at Mobitel ${city} are completed within 30-45 minutes. Port cleaning takes just 15-20 minutes. Complex repairs involving motherboard-level micro-soldering may take 1-2 hours. We offer same-day service for all charging port issues.` },
    ],
  },

  "water-damage-repair": {
    whatIsContent: [
      `Water damage repair is the process of rescuing a smartphone that has been exposed to water, moisture, or any liquid. Whether your phone fell into a pool, got caught in rain, or had a drink spilled on it, water damage requires immediate professional attention to prevent permanent damage to internal components.`,
      `When water enters your phone, it can cause short circuits on the motherboard, corrode metal contacts, damage the display, and cause the battery to malfunction. The biggest mistake people make is trying to turn on a water-damaged phone or using the "rice trick" — which actually doesn't work and can make things worse by introducing starch particles into the phone.`,
      `At Mobitel ${city}, our water damage repair process involves disassembly, professional ultrasonic cleaning of all components, component-level motherboard inspection, replacement of any damaged parts, and thorough reassembly and testing. The sooner you bring your phone to us after water exposure (ideally within 24 hours), the higher the chance of complete recovery including data preservation.`,
    ],
    faqs: [
      { question: "What should I do immediately after my phone falls in water?", answer: "Immediately turn it off (do NOT try to charge it), remove the SIM card and memory card, gently shake out excess water, and bring it to Mobitel as soon as possible. Do NOT put it in rice — this is a myth that doesn't help and can cause more damage." },
      { question: `How much does water damage repair cost in ${city}?`, answer: `Water damage repair at Mobitel ${city} starts from ₹999. The final cost depends on the extent of damage — simple cleaning and drying costs less, while component replacements (screen, battery, motherboard parts) add to the cost. We provide a full quote after diagnosis before proceeding.` },
      { question: "Can you recover data from a water damaged phone?", answer: "In many cases, yes! If you bring the phone to us quickly (within 24-48 hours) and haven't tried to turn it on, we have a high success rate for data recovery. Our technicians can often salvage photos, contacts, and files even from severely water-damaged devices." },
      { question: "How long does water damage repair take?", answer: "Water damage repair typically takes 2-4 hours for the cleaning and drying process, plus additional time if components need replacement. In severe cases, we may need to keep the phone for 24-48 hours for thorough drying and testing. We'll keep you updated at every step." },
      { question: "Is water damage covered under warranty?", answer: "Our 90-day repair warranty covers the parts we replace and the labor. However, if the phone gets water damaged again after our repair, that's new damage and not covered. We recommend using a waterproof case after repair to prevent future incidents." },
    ],
  },

  "camera-repair": {
    whatIsContent: [
      `Camera repair involves fixing or replacing the front (selfie) or rear camera modules of your smartphone. Modern phones have sophisticated multi-camera systems, and damage to any camera component — whether the lens glass, the sensor, or the image processing hardware — can significantly degrade your photo and video quality.`,
      `Common camera problems include blurry or out-of-focus photos, cracked camera lens glass, black screen when opening the camera app, purple or pink tint in photos, camera app crashing, autofocus not working, flashlight not functioning, or visible spots or lines on images. Physical damage from drops is the most common cause, but software issues and moisture exposure can also affect camera performance.`,
      `At Mobitel ${city}, we carry camera modules for all major smartphone brands. Our technicians carefully replace damaged camera hardware while preserving your phone's original image processing calibration. We also clean the camera housing and lens area to ensure crystal-clear photos after repair.`,
    ],
    faqs: [
      { question: "Why are my phone photos blurry after dropping my phone?", answer: "A drop can displace the camera lens, damage the optical image stabilization (OIS) mechanism, or crack the camera glass — all causing blurry photos. Even hairline cracks in the camera glass can scatter light and cause haziness. Visit Mobitel for a free camera diagnosis." },
      { question: `How much does camera repair cost in ${city}?`, answer: `Camera repair at Mobitel ${city} ranges from ₹799 for basic Android phones to ₹6,999 for premium iPhone Pro camera modules. The cost depends on your phone model and whether it's the front or rear camera. Rear camera modules with multiple lenses are typically more expensive.` },
      { question: "Can you replace just the camera glass without changing the whole camera?", answer: "Yes, if only the outer camera lens glass is cracked but the internal camera module is working fine, we can replace just the glass cover. This is a quicker and more affordable fix, typically costing ₹499-₹1,499 depending on the phone model." },
      { question: "How long does camera repair take?", answer: `Most camera repairs at Mobitel ${city} are completed within 30-60 minutes. We test the camera thoroughly after repair — checking focus, clarity, flash, video recording, and all camera modes to ensure everything works perfectly.` },
      { question: "Will the camera quality be the same after repair?", answer: "Yes! We use high-quality OEM-grade camera modules that match the original specifications. The photo and video quality will be identical to what your phone produced with the original camera. We test extensively to verify this before returning your phone." },
    ],
  },

  "speaker-repair": {
    whatIsContent: [
      `Speaker repair involves fixing the earpiece (call speaker) or the loudspeaker (media/ringtone speaker) of your smartphone. Most modern phones have multiple speakers — a top earpiece for phone calls and bottom-firing loudspeakers for music, videos, and speakerphone calls.`,
      `Common speaker problems include no sound during calls (earpiece issue), low or distorted ringtone/music volume (loudspeaker issue), crackling or buzzing sounds, speaker sounding muffled, or no sound at all. Causes include physical damage from drops, water exposure, dust and debris accumulation in the speaker grilles, or internal component failure.`,
      `Our technicians at Mobitel ${city} first diagnose whether the issue is hardware (damaged speaker) or software (audio settings, driver issues). For hardware problems, we replace the affected speaker module with a genuine replacement part. The repair is quick and restores full audio quality to your device.`,
    ],
    faqs: [
      { question: "Why can't I hear anything during phone calls?", answer: "If you can't hear the other person during calls but music/videos play fine through the loudspeaker, your earpiece speaker is likely damaged. This often happens due to drops, water exposure, or dust accumulation. Visit Mobitel for a quick diagnosis — it might be a simple cleaning or a speaker replacement." },
      { question: `How much does speaker repair cost in ${city}?`, answer: `Speaker repair at Mobitel ${city} starts from ₹499 for basic Android phones. iPhone earpiece replacement ranges from ₹1,499 to ₹2,999. Samsung speaker repairs start from ₹999. The cost varies by phone model — contact us with your model number for a precise quote.` },
      { question: "Can you fix distorted or crackling speaker sound?", answer: "Yes! Distorted sound is often caused by a partially damaged speaker cone or debris in the speaker grille. We can clean the speaker grille professionally, and if the speaker itself is damaged, we replace it with a new module. The repair restores clear, full-volume audio." },
      { question: "How long does speaker repair take?", answer: `Speaker repair at Mobitel ${city} typically takes 30-45 minutes. We test the repaired speaker with calls, music, and various volume levels to ensure perfect audio quality before returning your phone.` },
      { question: "My phone speaker works but the volume is very low. Can it be fixed?", answer: "Absolutely. Low speaker volume is often caused by debris clogging the speaker grille — we professionally clean it using specialized tools. If the speaker itself is degraded, a replacement will restore full volume. We also check for any software-level volume restrictions." },
    ],
  },

  "microphone-repair": {
    whatIsContent: [
      `Microphone repair involves fixing or replacing the microphone component of your smartphone so that people can hear you clearly during calls, voice messages, and video recordings. Most modern phones have multiple microphones — primary (bottom), secondary (top for noise cancellation), and sometimes a third mic near the camera for video audio.`,
      `Symptoms of a microphone problem include: people saying they can't hear you during calls, voice messages being silent or muffled, voice assistant not responding to your commands, video audio being absent or low quality, or the phone not working with hands-free/Bluetooth. Sometimes what seems like a microphone issue is actually a software problem or a blocked mic hole.`,
      `At Mobitel ${city}, we diagnose which microphone is affected and whether the issue is hardware or software. We then clean or replace the faulty microphone module. The repair is relatively quick and restores clear voice quality for calls and recordings.`,
    ],
    faqs: [
      { question: "Why can't people hear me during calls?", answer: "If callers can't hear you, your primary microphone (usually at the bottom of the phone) may be damaged or blocked. Common causes include physical damage, water exposure, lint/dust blockage, or a faulty flex cable. Visit Mobitel for a free diagnosis." },
      { question: `How much does microphone repair cost in ${city}?`, answer: `Microphone repair at Mobitel ${city} starts from ₹499 for most Android phones. iPhone microphone replacement ranges from ₹1,499 to ₹2,499. If only cleaning is needed, it costs even less. We provide an exact quote after diagnosis.` },
      { question: "How long does microphone repair take?", answer: `Microphone repair typically takes 30-45 minutes at Mobitel ${city}. We test the microphone thoroughly after repair — making test calls, recording voice memos, and testing video audio to ensure crystal-clear sound capture.` },
      { question: "My phone microphone works on calls but not on video recordings. Why?", answer: "Modern phones use different microphones for calls (bottom mic) and video recording (top/rear mic). If only video audio is affected, the secondary or tertiary microphone may be damaged. We diagnose which specific microphone needs attention and repair accordingly." },
      { question: "Can a microphone issue be a software problem?", answer: "Yes, sometimes! App permissions, software glitches, or system updates can cause microphone issues. We always check software settings first before recommending hardware repair. A simple app reset or system settings adjustment might solve the problem at no cost." },
    ],
  },

  "back-glass-replacement": {
    whatIsContent: [
      `Back glass replacement is the process of removing and replacing the cracked or shattered rear glass panel of your smartphone. Most premium and mid-range phones since 2017 feature glass backs for wireless charging support and premium aesthetics. Unfortunately, this glass is just as fragile as the front screen and breaks easily from drops.`,
      `While a cracked back glass doesn't directly affect your phone's functionality, it creates several problems: sharp edges can cut your fingers, moisture and dust can enter through the cracks causing internal damage, it reduces your phone's resale value, and it looks unsightly. Some phones with cracked back glass also lose their wireless charging capability.`,
      `At Mobitel ${city}, we carefully remove the damaged back glass using professional heating tools to preserve all internal components. We then install a new back panel that matches your phone's original color and finish. The process includes re-sealing for water resistance where applicable.`,
    ],
    faqs: [
      { question: "Is it necessary to replace a cracked back glass?", answer: "While your phone will still function, we strongly recommend replacing cracked back glass. Cracks allow dust, moisture, and bacteria to enter the phone, potentially damaging internal components over time. It also affects your phone's resale value and can cause minor injuries from sharp glass edges." },
      { question: `How much does back glass replacement cost in ${city}?`, answer: `Back glass replacement at Mobitel ${city} starts from ₹799 for basic models. iPhone back glass ranges from ₹2,499 to ₹5,999. Samsung Galaxy back panel replacement starts from ₹1,499. The cost depends on your phone model and color availability.` },
      { question: "How long does back glass replacement take?", answer: `Back glass replacement typically takes 45-90 minutes at Mobitel ${city}. The process involves careful heating to separate the old glass, cleaning the adhesive, installing the new panel, and re-sealing for water resistance. We test all functions including wireless charging before returning your phone.` },
      { question: "Will replacing the back glass affect wireless charging?", answer: "No, it will actually restore it if the cracks were causing issues! We use back glass panels that are compatible with wireless charging. After replacement, we test wireless charging to confirm it's working properly." },
      { question: "Can you match the exact color of my phone's back glass?", answer: "Yes, we stock back glass panels in all standard colors for popular phone models. For rare or discontinued colors, we may need 1-2 days to source the matching panel. We'll always confirm color availability before proceeding with the repair." },
    ],
  },

  "software-repair": {
    whatIsContent: [
      `Software repair encompasses all non-hardware fixes for your smartphone — from resolving system crashes and boot loops to removing viruses, fixing app issues, and reinstalling the operating system. When your phone's software malfunctions, it can feel just as broken as physical damage, making the device frustrating or impossible to use.`,
      `Common software problems include: phone stuck on boot logo (boot loop), extremely slow performance, random freezing and crashes, apps force-closing repeatedly, phone restarting on its own, storage full errors even after deleting files, "System UI has stopped" errors, and failed software updates that brick the phone.`,
      `At Mobitel ${city}, our software specialists can diagnose and fix virtually any software issue without affecting your personal data in most cases. We perform system diagnostics, clear corrupted caches, remove malware, repair the operating system, and optimize your phone's settings for the best performance. For severe cases, we can perform a clean OS reinstall while backing up your important data first.`,
    ],
    faqs: [
      { question: "My phone is stuck on the logo screen. Can it be fixed?", answer: "Yes! This is called a boot loop and it's usually a software problem. Our technicians can fix boot loops by accessing recovery mode, clearing system caches, or reflashing the operating system. In most cases, we can preserve your data during this process." },
      { question: `How much does software repair cost in ${city}?`, answer: `Software repair at Mobitel ${city} starts from just ₹499. Basic fixes like app troubleshooting and cache clearing are on the lower end. OS reinstallation and virus removal typically range from ₹999-₹1,999. Complex motherboard-related software issues may cost more.` },
      { question: "Will I lose my data during software repair?", answer: "In most cases, no. We always attempt data-preserving fixes first. However, if a complete OS reinstall is necessary, some data may need to be erased. We'll always inform you beforehand and help backup your important files, photos, and contacts before proceeding." },
      { question: "Can you remove viruses and malware from my phone?", answer: "Absolutely! We professionally remove all types of malware, adware, and potentially harmful apps from your phone. We also help you identify which apps or sources caused the infection and set up preventive measures to protect against future threats." },
      { question: "How long does software repair take?", answer: `Software repair at Mobitel ${city} typically takes 30-90 minutes depending on the issue. Simple fixes like cache clearing take 30 minutes, while a full OS reinstall may take 60-90 minutes. We run comprehensive tests afterward to ensure your phone is stable and fast.` },
    ],
  },

  "motherboard-repair": {
    whatIsContent: [
      `Motherboard repair is the most complex and advanced type of smartphone repair. The motherboard (also called the logic board or PCB) is the brain of your phone — it houses the processor, memory, storage, and all the integrated circuits that make your phone function. When the motherboard is damaged, the phone may become completely dead or exhibit severe malfunctions.`,
      `Signs of motherboard damage include: phone completely dead (won't turn on at all), random restarts, phone gets extremely hot in one specific area, no display even with a new screen, loss of specific functions like Wi-Fi or cellular, phone not recognized by computer when connected, or surviving a severe drop or water exposure but not working properly afterward.`,
      `At Mobitel ${city}, our expert micro-soldering technicians use advanced tools including hot air rework stations, precision soldering irons, and microscopes to perform component-level motherboard repairs. We can replace individual chips, reball BGA components, fix broken traces, and repair logic board connections that other shops would declare "unrepairable."`,
    ],
    faqs: [
      { question: "Is motherboard repair worth the cost?", answer: "It depends on your phone's value and the data on it. For flagship phones (iPhone Pro, Samsung Ultra, etc.), motherboard repair is often much cheaper than buying a new phone. If you have irreplaceable data on the phone, motherboard repair might be the only way to recover it. We provide a free diagnosis and honest advice." },
      { question: `How much does motherboard repair cost in ${city}?`, answer: `Motherboard repair at Mobitel ${city} starts from ₹1,999 for basic component replacements. iPhone motherboard repairs range from ₹3,999 to ₹9,999. Samsung and OnePlus motherboard repairs typically range from ₹2,999 to ₹7,999. The cost depends on the specific chip or component that needs repair.` },
      { question: "Can you recover data from a dead phone motherboard?", answer: "In many cases, yes! Since your phone's storage (NAND chip) is soldered on the motherboard, we need to repair the board enough to access the data, or in extreme cases, transfer the storage chip to a donor board. Our success rate for data recovery from motherboard failure is approximately 70-80%." },
      { question: "How long does motherboard repair take?", answer: `Motherboard repair at Mobitel ${city} typically takes 2-6 hours, depending on the complexity. Some cases involving chip reballing or trace repair may require 24-48 hours. We'll provide a time estimate after the initial diagnosis.` },
      { question: "Do other repair shops really not do motherboard repairs?", answer: "Most local repair shops only do basic part swaps (screen, battery, port). Motherboard repair requires specialized micro-soldering skills, expensive equipment (hot air stations, microscopes), and component-level knowledge. At Mobitel, our senior technicians are trained in advanced micro-soldering techniques." },
    ],
  },

  "data-recovery": {
    whatIsContent: [
      `Data recovery is the process of retrieving lost, deleted, or inaccessible data from a damaged, broken, or malfunctioning smartphone. Your phone holds irreplaceable memories — photos, videos, contacts, messages, documents, and more. When disaster strikes and you lose access to this data, professional recovery services can often save what seems lost forever.`,
      `Situations where you might need data recovery include: phone completely dead and won't turn on, water-damaged phone, accidentally deleted important files, phone dropped and screen shattered (can't unlock), storage corruption, failed factory reset, phone stolen but data backup needed from cloud, or switching phones and unable to transfer data.`,
      `At Mobitel ${city}, our data recovery process varies by the type of failure. For phones with screen damage, we can often access data by connecting to a computer through special methods. For dead phones, we attempt motherboard repair to access the storage. For severely damaged storage chips, we have advanced chip-level recovery techniques. We treat every recovery case with complete confidentiality and privacy.`,
    ],
    faqs: [
      { question: "Can you recover photos from a phone that won't turn on?", answer: "In most cases, yes! If the storage chip is intact (common even when the phone is dead), we can repair the motherboard enough to access storage, or use specialized tools to read data directly from the storage chip. The sooner you bring the phone, the better the chances." },
      { question: `How much does data recovery cost in ${city}?`, answer: `Data recovery at Mobitel ${city} starts from ₹999 for simple cases (screen damage preventing access). Complex recovery from dead motherboards or water-damaged phones ranges from ₹2,999 to ₹7,999 depending on the work required. We provide a quote after diagnosis — no recovery, no charge.` },
      { question: "How long does data recovery take?", answer: `Data recovery time varies from 1 hour (for simple screen-related access issues) to 24-48 hours (for complex motherboard or chip-level recovery) at Mobitel ${city}. We prioritize recovery speed for urgent cases. You'll be kept informed of progress throughout the process.` },
      { question: "Is my recovered data kept private?", answer: "Absolutely. We follow strict confidentiality protocols. Your data is transferred only to the device or storage medium you specify. We do not view, copy, or retain any personal data. Our technicians are trained in data privacy and handle every case with discretion." },
      { question: "Can you recover data from a water-damaged phone?", answer: "Yes, water-damaged phones are one of our most common recovery cases. The key is acting quickly — bring the phone to us within 24-48 hours (without trying to turn it on). We disassemble, clean, and stabilize the phone's components before attempting data extraction." },
    ],
  },

  "network-signal-repair": {
    whatIsContent: [
      `Network and signal repair addresses issues where your smartphone cannot connect to the cellular network, shows "No Signal" or "No Service," has extremely weak signal strength, cannot detect SIM cards, or has problems with Wi-Fi and Bluetooth connectivity. These problems prevent you from making calls, sending texts, and using mobile data.`,
      `Common network issues include: "No Service" or "No Signal" displayed permanently, SIM card not detected, calls dropping frequently, very slow mobile data despite good coverage area, phone stuck on "Searching for network," Wi-Fi not connecting or repeatedly disconnecting, and Bluetooth pairing failures. These problems can stem from damaged antenna flex cables, faulty network IC chips, SIM reader damage, or software configuration issues.`,
      `At Mobitel ${city}, we diagnose network issues by testing with known-good SIM cards, checking antenna connections, inspecting the network IC on the motherboard, and running software-level network diagnostics. Our repairs range from simple antenna flex cable replacement to advanced motherboard-level network IC reballing.`,
    ],
    faqs: [
      { question: "Why does my phone show 'No Signal' or 'No Service'?", answer: "This can be caused by a damaged antenna flex cable, faulty SIM reader, a problem with the baseband/modem IC on the motherboard, or software issues after a failed update. Sometimes it's as simple as a damaged SIM tray. Visit Mobitel for free diagnosis to identify the exact cause." },
      { question: `How much does network signal repair cost in ${city}?`, answer: `Network signal repair at Mobitel ${city} starts from ₹799. Antenna flex cable replacement is usually ₹799-₹1,499. SIM reader replacement ranges from ₹999-₹1,999. Network IC-level motherboard repair ranges from ₹1,999-₹3,999 depending on the phone model.` },
      { question: "My phone was working fine but suddenly lost network. What happened?", answer: "Sudden network loss can be caused by a software glitch (try restarting first), a loose antenna connection from an accidental drop, or network IC failure. If a restart doesn't fix it, and other phones work fine in your area with the same carrier, it's likely a hardware issue that needs professional repair." },
      { question: "Can you fix Wi-Fi and Bluetooth connectivity issues too?", answer: "Yes! Wi-Fi and Bluetooth issues are often related to the same network/connectivity hardware. We repair Wi-Fi antenna problems, Bluetooth module failures, and can fix the Wi-Fi/Bluetooth combo IC on the motherboard if needed." },
      { question: "How long does network signal repair take?", answer: `Network signal repair at Mobitel ${city} typically takes 1-3 hours. Simple fixes like antenna cable replacement take about an hour. Motherboard-level network IC repairs may take 3-4 hours. We test extensively with multiple carriers to confirm the fix.` },
    ],
  },
};
