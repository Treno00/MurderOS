export const DARK_WEB_ITEMS = [
  // --- BROŃ ---
  { id: 'w1', name: 'Nóż Kuchenny', category: 'Broń', subcategory: 'Biała', price: 100, tags: ['Cięte', 'Kłute'], attackModes: ['Cięcie', 'Pchnięcie'] },
  { id: 'w2', name: 'Garota', category: 'Broń', subcategory: 'Biała', price: 300, tags: ['Duszące'], attackModes: ['Duszenie'] },
  { id: 'w3', name: 'Młotek', category: 'Broń', subcategory: 'Biała', price: 80, tags: ['Obuchowe', 'Miażdżące'], attackModes: ['Zamach Obuchowy'] },
  { id: 'w4', name: 'Kij Bejsbolowy', category: 'Broń', subcategory: 'Biała', price: 160, tags: ['Obuchowe', 'Obalenie'], attackModes: ['Zamach Obuchowy'] },
  { id: 'w5', name: 'Siekiera', category: 'Broń', subcategory: 'Biała', price: 240, tags: ['Rąbiące', 'Cięte', 'Masywne'], attackModes: ['Rąbanie', 'Amputacja'] },
  { id: 'w6', name: 'Łom', category: 'Broń', subcategory: 'Biała', price: 120, tags: ['Obuchowe', 'Kłute'], attackModes: ['Zamach Obuchowy', 'Pchnięcie'] },
  { id: 'w7', name: 'Katana', category: 'Broń', subcategory: 'Biała', price: 3000, tags: ['Tnące', 'Cięte', 'Długie Ostrze'], attackModes: ['Płytkie Cięcie', 'Głębokie Rąbanie', 'Pchnięcie'] },
  { id: 'w7b', name: 'Maczeta', category: 'Broń', subcategory: 'Biała', price: 500, tags: ['Rąbiące', 'Cięte'], attackModes: ['Rąbanie', 'Cięcie'] },

  { id: 'w8', name: 'Pistolet z Tłumikiem', category: 'Broń', subcategory: 'Palna', price: 10000, tags: ['Strzeleckie', 'Ciche', 'Penetrujące'], attackModes: ['Strzał'] },
  { id: 'w9', name: 'Kusza', category: 'Broń', subcategory: 'Palna', price: 2400, tags: ['Strzeleckie', 'Ciche', 'Kłute', 'Penetrujące'], attackModes: ['Strzał', 'Przebicie'] },
  { id: 'w10', name: 'Karabin Snajperski', category: 'Broń', subcategory: 'Palna', price: 30000, tags: ['Strzeleckie', 'Głośne', 'Wysoka Penetracja'], attackModes: ['Strzał Krytyczny'] },

  // --- NARZĘDZIA ---
  { id: 't1', name: 'Strzykawka z Cyjankiem', category: 'Narzędzia', subcategory: 'Śmiercionośne', price: 1600 },
  { id: 't2', name: 'Insulina (Pen)', category: 'Narzędzia', subcategory: 'Śmiercionośne', price: 300, description: 'Dla diabetyków ratunek, dla zdrowych śmierć w konwulsjach.' },
  { id: 't3', name: 'Chlorek Potasu (KCL)', category: 'Narzędzia', subcategory: 'Śmiercionośne', price: 600, description: 'Powoduje nagłe zatrzymanie akcji serca. Trudne do wykrycia.' },

  { id: 't4', name: 'Chloroform (500ml)', category: 'Narzędzia', subcategory: 'Obezwładniające', price: 600, description: 'Szybkie uśpienie ofiary. Wymaga szmatki.', capacity: 500, unit: 'ml' },
  { id: 't5', name: 'Paralizator', category: 'Narzędzia', subcategory: 'Obezwładniające', price: 800 },
  { id: 't6', name: 'Wytrychy', category: 'Narzędzia', subcategory: 'Włamaniowe', price: 400 },
  { id: 't7', name: 'Zagłuszacz GSM', category: 'Narzędzia', subcategory: 'Włamaniowe', price: 2400, description: 'Opóźnia wezwanie policji.' },
  { id: 't8', name: 'Skaner Policyjny', category: 'Narzędzia', subcategory: 'Włamaniowe', price: 5000, description: 'Pozwala monitorować zbliżające się patrole (widoczny czas).' },

  // --- NARZĘDZIA (TORTURY) ---
  { id: 'tt1', name: 'Obcęgi', category: 'Narzędzia', subcategory: 'Tortury', price: 80, description: 'Do wyrywania paznokci lub zębów.' },
  { id: 'tt2', name: 'Palnik Gazowy', category: 'Narzędzia', subcategory: 'Tortury', price: 240, description: 'Precyzyjne oparzenia III stopnia.' },
  { id: 'tt3', name: 'Wiadro (Zestaw)', category: 'Narzędzia', subcategory: 'Tortury', price: 60, description: 'Wiadro, szmata, woda. Do podtapiania.' },
  { id: 'tt4', name: 'Akumulator + Kable', category: 'Narzędzia', subcategory: 'Tortury', price: 600, description: 'Rażenie prądem.' },
  { id: 'tt5', name: 'Zestaw Chirurgiczny', category: 'Narzędzia', subcategory: 'Tortury', price: 1000, description: 'Skalpele, rozwieracze. Niezbędny do pobierania organów.' },

  // --- MEDYCZNE (NOWE) ---
  { id: 'm_bandage', name: 'Bandaże', category: 'Medyczne', price: 40, description: 'Tamowanie krwotoków. +15 HP.', capacity: 5, unit: 'szt' },
  { id: 'm_sewing', name: 'Zestaw do Szycia', category: 'Medyczne', price: 200, description: 'Zamykanie głębokich ran. +30 HP.', capacity: 3, unit: 'użyć' },
  { id: 'm_adrenaline', name: 'Adrenalina (EpiPen)', category: 'Medyczne', price: 500, description: 'Natychmiastowe wybudzenie. +50 Przytomność, +20 Stres.', capacity: 1, unit: 'szt' },
  { id: 'm_salts', name: 'Sole Trzeźwiące', category: 'Medyczne', price: 100, description: 'Wybudzanie z omdlenia. +20 Przytomność.', capacity: 10, unit: 'użyć' },
  { id: 'm_antibiotics', name: 'Antybiotyki', category: 'Medyczne', price: 300, description: 'Zapobieganie sepsie po inwazyjnych torturach.', capacity: 10, unit: 'tabl' },
  { id: 'm_heparin', name: 'Heparyna', category: 'Medyczne', price: 400, description: 'Silny środek przeciwzakrzepowy. Powoduje niekontrolowane krwawienie.', capacity: 2, unit: 'dawki' },
  { id: 'm_digoxin', name: 'Digoksyna', category: 'Medyczne', price: 500, description: 'Lek nasercowy. W nadmiarze powoduje migotanie komór.', capacity: 5, unit: 'tabl' },

  // --- UBIÓR (BHP i Kamuflaż) ---
  { id: 'c1', name: 'Kominiarka', category: 'Ubiór', subcategory: 'Głowa', price: 60, description: 'Ukrywa tożsamość, ale zostawia włosy.' },
  { id: 'c2', name: 'Czepek Chirurgiczny', category: 'Ubiór', subcategory: 'Głowa', price: 20, description: 'Zapobiega pozostawianiu włosów na miejscu zbrodni.' },
  { id: 'c3', name: 'Maska P.Gazowa', category: 'Ubiór', subcategory: 'Głowa', price: 500, description: 'Chroni przed oparami chemicznymi i biologicznymi.' },

  { id: 'c4', name: 'Garnitur', category: 'Ubiór', subcategory: 'Tułów', price: 1200, description: 'Kamuflaż w biurach.' },
  { id: 'c5', name: 'Kombinezon Tyvek', category: 'Ubiór', subcategory: 'Tułów', price: 160, description: 'BHP. Chroni przed krwią.' },
  { id: 'c6', name: 'Strój Kuriera', category: 'Ubiór', subcategory: 'Tułów', price: 300, description: 'Idealny do podejścia pod drzwi.' },
  { id: 'c7', name: 'Ubranie Robocze', category: 'Ubiór', subcategory: 'Tułów', price: 200, description: 'Nie rzuca się w oczy.' },

  { id: 'c8', name: 'Spodnie Jeansowe', category: 'Ubiór', subcategory: 'Nogi', price: 200 },
  { id: 'c9', name: 'Spodnie Dresowe', category: 'Ubiór', subcategory: 'Nogi', price: 160 },
  { id: 'c10', name: 'Spodnie od garnituru', category: 'Ubiór', subcategory: 'Nogi', price: 400, description: 'Eleganckie.' },
  { id: 'c11', name: 'Spodnie Kuriera', category: 'Ubiór', subcategory: 'Nogi', price: 240, description: 'Wytrzymałe.' },
  { id: 'c12', name: 'Spodnie robocze', category: 'Ubiór', subcategory: 'Nogi', price: 300, description: 'Wzmocnione kolana.' },

  { id: 'c13', name: 'Rękawiczki Lateksowe', category: 'Ubiór', subcategory: 'Dłonie', price: 20, description: 'Podstawa. Zapobiega zostawianiu odcisków palców.' },
  { id: 'c14', name: 'Skórzane Rękawiczki', category: 'Ubiór', subcategory: 'Dłonie', price: 160 },

  { id: 'c15', name: 'Buty Sportowe', category: 'Ubiór', subcategory: 'Stopy', price: 400 },
  { id: 'c16', name: 'Ochraniacze na buty', category: 'Ubiór', subcategory: 'Stopy', price: 40, description: 'Foliowe nakładki. Zapobiegają zostawianiu śladów podeszwy i błota.' },
  { id: 'c17', name: 'Mokasyny', category: 'Ubiór', subcategory: 'Stopy', price: 600, description: 'Ciche, ale zostawiają charakterystyczny ślad.' },
  { id: 'c18', name: 'Buty robocze', category: 'Ubiór', subcategory: 'Stopy', price: 500, description: 'Gruba podeszwa, trudna do identyfikacji.' },

  // --- SPRZĘT ---
  { id: 'e1', name: 'Piła Ręczna', category: 'Sprzęt', price: 140, description: 'Do ćwiartowania zwłok i utylizacji kości.' },
  { id: 'e2', name: 'Folia Malarska (Rolka)', category: 'Sprzęt', price: 50, description: 'Rozłożona PRZED akcją drastycznie skraca czas sprzątania krwi.' },
  { id: 'e3', name: 'Worek na Zwłoki (Czarny)', category: 'Sprzęt', price: 180, description: 'Hermetyczny transport ciała. Wymagany do transportu.' },
  { id: 'e4', name: 'Wózek Transportowy', category: 'Sprzęt', price: 500, description: 'Ułatwia przemieszczanie ciężkich ładunków.' },
  { id: 'e5', name: 'Mop Przemysłowy', category: 'Sprzęt', price: 240, description: 'Zmywanie podłóg. Wymaga Wody.' },
  { id: 'e6', name: 'Agregat Ozonowy', category: 'Sprzęt', price: 3000, description: 'Neutralizacja zapachu rozkładu i chloru po sprzątaniu.' },
  { id: 'e7', name: 'Wentylator Przemysłowy', category: 'Sprzęt', price: 600, description: 'Wymusza cyrkulację powietrza, usuwając zapachy.' },
  { id: 'e8', name: 'Lampa UV', category: 'Sprzęt', price: 240, description: 'Wykrywanie niedoczyszczonych śladów biologicznych.' },
  { id: 'e9', name: 'Odkurzacz Przemysłowy', category: 'Sprzęt', price: 800, description: 'Do usuwania włosów, włókien, prochu i nasyconego sorbentu.' },
  { id: 'e10', name: 'Beczka HDPE (200L)', category: 'Sprzęt', price: 400, description: 'Kwasoodporna. Niezbędna do chemicznej utylizacji.' },
  { id: 'e11', name: 'Saperka', category: 'Sprzęt', price: 100, description: 'Kompaktowa łopata do prac ziemnych.' },
  { id: 'e12', name: 'Myjka Parowa', category: 'Sprzęt', price: 1200, description: 'Gorąca para pod ciśnieniem sterylizuje dywany z mikrośladów i zapachów.' },
  { id: 'e13', name: 'Ekstraktor Powietrza HEPA', category: 'Sprzęt', price: 1700, description: 'Przenośny filtr oczyszcza środowisko z lotnych cząsteczek DNA i oparów.' },

  // --- CHEMIA ---
  { id: 'ch1', name: 'H₂O₂ (Perhydrol 30%)', category: 'Chemia', price: 80, description: 'Reaguje z enzymami we krwi (pieni się). 500ml.', capacity: 500, unit: 'ml' },
  { id: 'ch2', name: 'NaClO (Podchloryn Sodu)', category: 'Chemia', price: 30, description: 'Przemysłowy wybielacz. Niszczy strukturę DNA. 1000ml.', capacity: 1000, unit: 'ml' },
  { id: 'ch3', name: 'C₃H₈O (IPA 99%)', category: 'Chemia', price: 60, description: 'Alkohol izopropylowy. Do usuwania tłustych plam. 500ml.', capacity: 500, unit: 'ml' },
  { id: 'ch4', name: 'NaOH (Soda Kaustyczna)', category: 'Chemia', price: 40, description: 'Rozpuszcza naskórek i tkanki miękkie. 500g.', capacity: 500, unit: 'g' },
  { id: 'ch5', name: 'Luminol (Zestaw)', category: 'Chemia', price: 400, description: 'Ujawnia zmyte plamy krwi. 10 dawek.', capacity: 10, unit: 'szt' },
  { id: 'ch6', name: 'H₂SO₄ (Kwas Siarkowy)', category: 'Chemia', price: 300, description: 'Silnie żrący. 500ml.', capacity: 500, unit: 'ml' },
  { id: 'ch7', name: 'C₃H₆O (Aceton)', category: 'Chemia', price: 50, description: 'Rozpuszczalnik organiczny. 500ml.', capacity: 500, unit: 'ml' },
  { id: 'ch8', name: 'SiO₂ (Dwutlenek Krzemu)', category: 'Chemia', price: 120, description: 'Sorbent. Wiąże rozlane płyny. 2000g.', capacity: 2000, unit: 'g' },
  { id: 'ch9', name: 'Kanister Benzyny', category: 'Chemia', price: 160, description: 'Łatwopalna substancja.', capacity: 5, unit: 'L' },
  { id: 'ch10', name: 'Zapalniczka Sztormowa', category: 'Chemia', price: 80, description: 'Niezawodne źródło ognia w każdych warunkach.' },
  { id: 'ch11', name: 'Pianka Enzymatyczna', category: 'Chemia', price: 180, description: 'Rozbija łańcuchy białkowe utajonej krwi w głębokich porach. 500ml.', capacity: 500, unit: 'ml' },

  // --- POJAZDY ---
  { id: 'v1', name: 'Fiat Uno (Gruz)', category: 'Pojazdy', price: 5000, description: 'Tani, rdzewiejący, ale jeździ. Niezauważalny na blokowiskach.' },
  { id: 'v2', name: 'Stare Kombi', category: 'Pojazdy', price: 7000, description: 'Duży bagażnik, niskie koszty. Idealny do przewozu.' },
  { id: 'v3', name: 'Stary Sedan', category: 'Pojazdy', price: 5600, description: 'Klasyczny grat. Nie rzuca się w oczy, mały bagażnik.' },
  { id: 'v4', name: 'Stary Van Dostawczy', category: 'Pojazdy', price: 10000, description: 'Anonimowy, duża paka. Idealny do transportu ładunków wielkogabarytowych. Zarejestrowany na słupa.' },
  { id: 'v5', name: 'Sedan z dużym bagażnikiem', category: 'Pojazdy', price: 16000, description: 'Dyskretny w mieście. Bagażnik mieści 2 dorosłe osoby.' },
  { id: 'v6', name: 'Terenowy SUV 4x4', category: 'Pojazdy', price: 30000, description: 'Niezbędny do wywozu "odpadów" w głęboki las lub na bagna.' },
];
