const ORGAN_DEFINITIONS = {
  "Serce": { price: 1e5, decayBody: 3.3, decayFridge: 0.3 },
  "P\u0142uca": { price: 6e4, decayBody: 3.3, decayFridge: 0.2 },
  "W\u0105troba": { price: 5e4, decayBody: 1.6, decayFridge: 0.11 },
  "Trzustka": { price: 3e4, decayBody: 1.6, decayFridge: 0.09 },
  "Nerka": { price: 25e3, decayBody: 0.8, decayFridge: 0.04 },
  "Jelito cienkie": { price: 2e4, decayBody: 3.3, decayFridge: 0.15 },
  "Szpik kostny": { price: 12e3, decayBody: 5, decayFridge: 0.07 },
  "Rog\xF3wka oka": { price: 2e3, decayBody: 0.13, decayFridge: 1e-3 },
  "Sk\xF3ra (p\u0142at)": { price: 1e3, decayBody: 0.06, decayFridge: 1e-4 }
};
const CITIES = [
  {
    name: "Warszawa",
    pop: 1800190,
    crime: 2.58,
    schools: ["Liceum im. Batorego", "Technikum \u0141\u0105czno\u015Bci", "Liceum im. Staszica", "Zesp\xF3\u0142 Szk\xF3\u0142 nr 5", "Uniwersytet Warszawski", "Politechnika Warszawska"],
    workplaces: ["Varso Tower", "Z\u0142ote Tarasy", "Stadion Narodowy", "Ministerstwo Finans\xF3w", "Szpital MSWiA", "S\u0105d Okr\u0119gowy"],
    coords: { lat: 52.2297, lon: 21.0122 }
  },
  {
    name: "Krak\xF3w",
    pop: 769354,
    crime: 2.45,
    schools: ["Liceum Nowodworskiego", "Technikum \u0141\u0105czno\u015Bci nr 14", "Uniwersytet Jagiello\u0144ski", "AGH"],
    workplaces: ["Biurowiec K1", "Galeria Krakowska", "Szpital Uniwersytecki", "Urz\u0105d Miasta Krakowa"],
    coords: { lat: 50.0647, lon: 19.945 }
  },
  {
    name: "\u0141\xF3d\u017A",
    pop: 644873,
    crime: 2.81,
    schools: ["I LO im. Kopernika", "Politechnika \u0141\xF3dzka", "Uniwersytet Medyczny", "Szko\u0142a Filmowa"],
    workplaces: ["Manufaktura", "Monopolis", "Atlas Arena", "Dell Polska", "Indesit"],
    coords: { lat: 51.7592, lon: 19.456 }
  },
  {
    name: "Wroc\u0142aw",
    pop: 642099,
    crime: 3.05,
    schools: ["Liceum nr 3", "Technikum nr 10", "Politechnika Wroc\u0142awska", "Uniwersytet Wroc\u0142awski"],
    workplaces: ["Sky Tower", "Wroc\u0142awski Park Technologiczny", "Volvo Polska", "Credit Suisse"],
    coords: { lat: 51.1079, lon: 17.0385 }
  },
  {
    name: "Pozna\u0144",
    pop: 515784,
    crime: 2.79,
    schools: ["Marcinek", "\u0141\u0105czno\u015B\u0107", "UAM", "Politechnika Pozna\u0144ska"],
    workplaces: ["Ba\u0142tyk Tower", "Stary Browar", "Volkswagen Pozna\u0144", "Allegro"],
    coords: { lat: 52.4064, lon: 16.9252 }
  },
  {
    name: "Gda\u0144sk",
    pop: 465486,
    crime: 2.62,
    schools: ["Topol\xF3wka", "Conradinum", "Politechnika Gda\u0144ska", "Uniwersytet Gda\u0144ski"],
    workplaces: ["Olivia Star", "Stocznia Gda\u0144ska", "Rafineria Gda\u0144ska", "Port Lotniczy"],
    coords: { lat: 54.352, lon: 18.6466 }
  },
  {
    name: "Szczecin",
    pop: 395737,
    crime: 2.76,
    schools: ["LO nr 13", "Zachodniopomorski Uniwersytet Technologiczny", "Pomorski Uniwersytet Medyczny"],
    workplaces: ["Pazim", "Stocznia Szczeci\u0144ska", "Galaxy Centrum", "Amazon Ko\u0142baskowo"],
    coords: { lat: 53.4285, lon: 14.5528 }
  },
  {
    name: "Bydgoszcz",
    pop: 337052,
    crime: 2.31,
    schools: ["I LO im. Cypriana Kamila Norwida", "Uniwersytet Kazimierza Wielkiego", "Collegium Medicum UMK"],
    workplaces: ["Pesa Bydgoszcz", "Atos Poland", "Wojskowe Zak\u0142ady Lotnicze", "Zielone Arkady"],
    coords: { lat: 53.1235, lon: 18.0084 }
  },
  {
    name: "Lublin",
    pop: 325344,
    crime: 1.92,
    schools: ["I LO im. Stanis\u0142awa Staszica", "Katolicki Uniwersytet Lubelski", "Uniwersytet Marii Curie-Sk\u0142odowskiej"],
    workplaces: ["Lubelski W\u0119giel Bogdanka", "Ursus", "Per\u0142a Browary Lubelskie", "Vivo! Lublin"],
    coords: { lat: 51.2465, lon: 22.5684 }
  },
  {
    name: "Bia\u0142ystok",
    pop: 297585,
    crime: 1.85,
    schools: ["I LO im. Adama Mickiewicza", "Politechnika Bia\u0142ostocka", "Uniwersytet Medyczny w Bia\u0142ymstoku"],
    workplaces: ["Mlekovita", "Polmos Bia\u0142ystok", "Galeria Jurowiecka", "Kampus UwB"],
    coords: { lat: 53.1325, lon: 23.1688 }
  },
  {
    name: "Katowice",
    pop: 291774,
    crime: 3.12,
    schools: ["III LO im. Adama Mickiewicza", "Uniwersytet \u015Al\u0105ski", "Uniwersytet Ekonomiczny"],
    workplaces: ["Spodek", "Silesia City Center", "Kopalnia Wujek", "IBM Katowice"],
    coords: { lat: 50.2649, lon: 19.0238 }
  }
];
const COMPANY_NAMES = [
  "\u017Babka Sp. z o.o.",
  "Biedronka",
  "Orlen S.A.",
  "Netflix Services",
  "Spotify AB",
  "Uber Rides",
  "Pyszne.pl",
  "Czynsz",
  "Operator Gazu",
  "PGE Obr\xF3t",
  "T-Mobile Polska",
  "Orange Polska",
  "Play",
  "Plus",
  "Vectra",
  "UPC",
  "IKEA",
  "Castorama",
  "Leroy Merlin",
  "Obi",
  "Media Markt",
  "RTV Euro AGD",
  "Rossmann",
  "Hebe",
  "Super-Pharm",
  "Empik",
  "H&M",
  "Zara",
  "Reserved",
  "McDonald's",
  "KFC",
  "Burger King",
  "Pizza Hut",
  "Starbucks",
  "Costa Coffee",
  "Cinema City",
  "Multikino",
  "Helios",
  "Si\u0142ownia CityFit",
  "Zdrofit",
  "PZU",
  "Warta",
  "Allianz",
  "Link4",
  "Generali",
  "LuxMed",
  "Medicover"
];
const SHOPS = [
  "Biedronka", "Lidl", "Żabka", "Kaufland", "Carrefour", "Auchan", "Stokrotka", "Dino", "Netto", "Społem"
];
const BARS = [
  "Bar u Zdzicha", "Cocktail Bar", "Pub Pod Kapslem", "Shot Bar", "Pijalnia Wódki i Piwa", "Irish Pub", "Piwiarnia", "Cybermachina"
];
const CLUBS = [
  "Klub Nocny", "Energy 2000", "Luzztro", "Smolna", "SQ", "Czekolada", "Pacha", "Lordi's", "Teatro Cubano", "Grizzly"
];
const GYMS = [
  "Zdrofit", "CityFit", "McFIT", "Fitness Club", "Fabryka Formy", "Just GYM", "Calypso", "Jatomi", "BeActive"
];
const RESTAURANTS = [
  "Restauracja pod Różą", "Bistro Smak", "Pizzeria Napoli", "Kawiarnia Mokka", "SteakHouse", "Trattoria", "Sushi Bar", "Burger Joint", "Kebab u Aliego"
];
const HOBBIES = [
  "Fotografia", "Gry komputerowe", "Bieganie", "Sztuki walki", "Gotowanie", "Kino", "Kolarstwo", "Wędkarstwo", "Książki", "Podróże", "Taniec", "Motoryzacja"
];
const STREETS = ["1 Maja", "3 Maja", "Akacjowa", "Armii Krajowej", "Asnyka", "Bankowa", "Batalion\xF3w Ch\u0142opskich", "Bema", "Bia\u0142a", "Boczna", "Boles\u0142awa Chrobrego", "Bramkowa", "Brzozowa", "Bukowa", "Ceglana", "Chopina", "Cicha", "Cmentarna", "Czarnieckiego", "D\u0119bowa", "D\u0142uga", "Dobra", "Dolna", "Dworcowa", "Fabryczna", "Franciszka\u0144ska", "Gajowa", "Gda\u0144ska", "G\u0142owackiego", "G\u0142\xF3wna", "G\xF3rna", "Graniczna", "Grunwaldzka", "Hallera", "Jagiello\u0144ska", "Jana Paw\u0142a II", "Jarz\u0119binowa", "Jasna", "Javovowa", "Jelenia", "Jesionowa", "Jod\u0142owa", "Kalinowa", "Kasprowicza", "Kasztanowa", "Kili\u0144skiego", "Klonowa", "Kniaziewicza", "Kochanowskiego", "Kolejowa", "Konopnickiej", "Konstytucji 3 Maja", "Kopernika", "Ko\u015Bcielna", "Ko\u015Bciuszki", "Krakowska", "Krasi\u0144skiego", "Kr\xF3tka", "Krzywa", "Kwiatowa", "Lazurowa", "Letnia", "Le\u015Bna", "Lipowa", "Lotnicza", "Lwowska", "\u0141\u0105kowa", "Matejki", "Mazowiecka", "Mickiewicza", "Miodowa", "M\u0142y\u0144ska", "Modrzewiowa", "Moniuszki", "Mostowa", "Narutowicza", "Niepodleg\u0142o\u015Bci", "Norwida", "Nowa", "Nowowiejska", "Ogrodowa", "Okulickiego", "Okr\u0119\u017Cna", "Paderewskiego", "Parkowa", "Partyzant\xF3w", "Piaskowa", "Piastowska", "Pi\u0142sudskiego", "Piotrkowska", "Plac Wolno\u015Bci", "Pocztowa", "Podwale", "Polna", "Poniatowskiego", "Poprzeczna", "Prosta", "Prusa", "Przemys\u0142owa", "Przyja\u017Ani", "Pu\u0142askiego", "Reja", "Reymonta", "Robotnicza", "Rolna", "R\xF3\u017Cana", "Rynek", "Sienkiewicza", "Sikorskiego", "Sk\u0142adowa", "Sk\u0142odowskiej-Curie", "S\u0142oneczna", "S\u0142owackiego", "Sobieskiego", "Sosnowa", "Spacerowa", "Sp\xF3\u0142dzielcza", "Sportowa", "Stary Rynek", "Staszica", "Stawowa", "Stycznia", "Szkolna", "Szeroka", "\u015Al\u0105ska", "\u015Awi\u0119tokrzyska", "Targowa", "Topolowa", "Traugutta", "Tuwima", "Tysi\u0105clecia", "Urocza", "Wary\u0144skiego", "Warszawska", "Weso\u0142a", "Wiatraczna", "Widokowa", "Wiejska", "Wierzbowa", "Wilcza", "Wile\u0144ska", "Wiosenna", "Wi\u015Bniowa", "Witosa", "Wodna", "Wojska Polskiego", "Wolno\u015Bci", "Wroc\u0142awska", "Wsp\xF3lna", "Wybickiego", "Wyspia\u0144skiego", "Wyszy\u0144skiego", "Zaj\u0119cza", "Zamkowa", "Zapolskiej", "Zau\u0142ek", "Zielona", "Z\u0142ota", "\u0179r\xF3dlana", "\u017Beromskiego", "\u017Bwirki i Wigury"];
const MALE_NAMES = ["Adam", "Adrian", "Aleksander", "Andrzej", "Antoni", "Arkadiusz", "Artur", "Bartosz", "B\u0142a\u017Cej", "Bogdan", "Borys", "Cezary", "Czes\u0142aw", "Damian", "Daniel", "Dariusz", "Dominik", "Edward", "Emil", "Eugeniusz", "Fabian", "Filip", "Franciszek", "Gabriel", "Grzegorz", "Henryk", "Hubert", "Ignacy", "Igor", "Ireneusz", "Jacek", "Jakub", "Jan", "Jaros\u0142aw", "Jerzy", "J\xF3zef", "Julian", "Kacper", "Kajetan", "Kamil", "Karol", "Kazimierz", "Konrad", "Krystian", "Krzysztof", "Leon", "Leszek", "\u0141ukasz", "Maciej", "Marcin", "Marek", "Marian", "Mariusz", "Mateusz", "Micha\u0142", "Miko\u0142aj", "Mi\u0142osz", "Miros\u0142aw", "Nikodem", "Norbert", "Oliwier", "Oskar", "Patryk", "Pawe\u0142", "Piotr", "Przemys\u0142aw", "Rados\u0142aw", "Rafa\u0142", "Robert", "Ryszard", "Sebastian", "S\u0142awomir", "Stanis\u0142aw", "Stefan", "Szymon", "Tadeusz", "Tomasz", "Tymon", "Tymoteusz", "Wac\u0142aw", "Waldemar", "Wies\u0142aw", "Wiktor", "Witold", "W\u0142adys\u0142aw", "Wojciech", "Zbigniew", "Zdzis\u0142aw", "Zygmunt"];
const FEMALE_NAMES = ["Adela", "Adrianna", "Agnieszka", "Aleksandra", "Alicja", "Amelia", "Anastazja", "Aneta", "Aniela", "Anna", "Antonina", "Barbara", "Beata", "Bogumi\u0142a", "Bo\u017Cena", "Danuta", "Daria", "Dominika", "Dorota", "Edyta", "Eliza", "El\u017Cbieta", "Emilia", "Ewa", "Gabriela", "Gra\u017Cyna", "Halina", "Hanna", "Helena", "Iga", "Ilona", "Iwona", "Iza", "Izabela", "Jadwiga", "Janina", "Joanna", "Jolanta", "Julia", "Justyna", "Kamila", "Karolina", "Katarzyna", "Kinga", "Klaudia", "Krystyna", "Laura", "Lena", "Lidia", "Liliana", "Lucyna", "\u0141ucja", "Magdalena", "Ma\u0142gorzata", "Malwina", "Maria", "Mariola", "Marlena", "Marta", "Martyna", "Marzena", "Miros\u0142awa", "Monika", "Nadia", "Natalia", "Nina", "Oksana", "Olga", "Oliwia", "Patrycja", "Paulina", "Renata", "Roksana", "R\xF3\u017Ca", "Sabina", "Sandra", "Sylwia", "Teresa", "Urszula", "Wanda", "Weronika", "Wies\u0142awa", "Wiktoria", "Zofia", "Zuzanna"];
const LAST_NAMES = ["Nowak", "Kowalski", "Wi\u015Bniewski", "W\xF3jcik", "Kowalczyk", "Kami\u0144ski", "Lewandowski", "Zieli\u0144ski", "Szyma\u0144ski", "Wo\u017Aniak", "D\u0105browski", "Koz\u0142owski", "Jankowski", "Mazur", "Wojciechowski", "Kwiatkowski", "Krawczyk", "Kaczmarek", "Piotrowski", "Grabowski", "Zaj\u0105c", "Paw\u0142owski", "Michalski", "Kr\xF3l", "Wieczorek", "Jab\u0142o\u0144ski", "Wr\xF3bel", "Nowakowski", "Majewski", "Olszewski", "St\u0119pie\u0144", "Malinowski", "Jaworski", "Adamczyk", "Dudek", "Nowicki", "Pawlak", "G\xF3rski", "Witkowski", "Walczak", "Sikora", "Baran", "Rutkowski", "Michalak", "Szewczyk", "Ostrowski", "Tomaszewski", "Pietrzak", "Zalewski", "Wr\xF3blewski", "Jasi\u0144ski", "Marciniak", "Sadowski", "B\u0105k", "Zawadzki", "Duda", "Jakubowski", "Wilk"];
const HAIR_COLORS = ["Blond", "Ciemny Blond", "Jasny Br\u0105z", "Ciemny Br\u0105z", "Czarny", "Rudy", "Siwy", "\u0141ysy"];
const EYE_COLORS = ["Niebieskie", "Szare", "Zielone", "Piwne", "Br\u0105zowe", "Czarne"];
const CRIMES_MINOR = ["Przekroczenie pr\u0119dko\u015Bci", "Z\u0142e parkowanie", "Zak\u0142\xF3canie ciszy nocnej", "Spo\u017Cywanie alkoholu w miejscu publicznym", "Drobna kradzie\u017C", "Wandalizm", "Nielegalne zgromadzenie", "Palenie w miejscu niedozwolonym", "Za\u015Bmiecanie", "Niep\u0142acenie aliment\xF3w", "Jazda bez biletu", "Obraza funkcjonariusza", "Niszczenie mienia", "Utrudnianie ruchu", "Fa\u0142szywy alarm", "\u017Bebractwo", "Nagi w miejscu publicznym", "Posiadanie nielegalnego oprogramowania"];
const CRIMES_MAJOR = ["Pobicie", "Pobicie ze skutkiem \u015Bmiertelnym", "Udzia\u0142 w b\xF3jce", "Rozb\xF3j", "Napa\u015B\u0107 z broni\u0105 w r\u0119ku", "Usi\u0142owanie zab\xF3jstwa", "Gwa\u0142t", "Molestowanie", "Pedofilia", "Str\u0119czycielstwo", "Posiadanie pornografii dzieci\u0119cej", "Posiadanie narkotyk\xF3w", "Handel narkotykami", "Produkcja \u015Brodk\xF3w odurzaj\u0105cych", "Oszustwo podatkowe", "Pranie brudnych pieni\u0119dzy", "Wy\u0142udzenie kredytu", "Kradzie\u017C to\u017Csamo\u015Bci", "Kradzie\u017C z w\u0142amaniem", "Jazda pod wp\u0142ywem", "Ucieczka z miejsca wypadku", "Zab\xF3jstwo", "Porwanie"];
const DISEASES = ["Nadci\u015Bnienie", "Cukrzyca Typ 1", "Cukrzyca Typ 2", "Astma", "Alergia", "Migrena", "B\xF3l plec\xF3w", "Wada wzroku", "Oty\u0142o\u015B\u0107", "Niewydolno\u015B\u0107 serca", "Arytmia", "Zakrzepica", "Padaczka", "Anemia", "Bezsenno\u015B\u0107", "Depresja", "Hashimoto", "Refluks", "ZZSK", "Jaskra", "\u0141uszczyca"];
const ADDICTIONS = ["Nikotyna", "Alkohol", "Kofeina", "Hazard", "Leki przeciwb\xF3lowe", "Gry komputerowe", "Marihuana", "Amfetamina", "Media spo\u0142eczno\u015Bciowe", "Zakupy", "Pornografia", "Jedzenie (Kompulsywne)", "Praca", "Kokaina", "Opioidy", "Sterydy", "Klej/Rozpuszczalniki"];
const PSYCH_TRAITS_PAIRS = [["Religijny", "Ateista"], ["Nerwowy", "Spokojny"], ["Pracoholik", "Leniwy"], ["Ekstrawertyk", "Introwertyk"], ["Imprezowy", "Domator"], ["Optymista", "Pesymista"], ["Ba\u0142aganiarz", "Pedant"], ["Impulsywny", "Opanowany"], ["Hojny", "Sk\u0105py"], ["Lojalny", "Zdradliwy"], ["Odwa\u017Cny", "Tch\xF3rzliwy"], ["Uczciwy", "Manipulant"], ["Ciekawski", "Oboj\u0119tny"], ["Romantyk", "Cynik"], ["Naiwny", "Podejrzliwy"], ["Agresywny", "Uleg\u0142y"]];
const BANKS = { "1010": "Narodowy Bank Polski", "1020": "PKO BP", "1050": "ING Bank \u015Al\u0105ski", "1090": "Santander Bank Polska", "1140": "mBank", "1160": "Bank Millennium", "1240": "Bank Pekao", "2490": "Alior Bank", "1600": "BNP Paribas" };
const CAR_COLORS = ["Czarny", "Bia\u0142y", "Srebrny", "Szary", "Granatowy", "Czerwony", "Niebieski", "Zielony", "Bordowy", "Be\u017Cowy", "Br\u0105zowy"];
const CAR_MODELS = [{ name: "Fiat Seicento", price: 2500 }, { name: "Daewoo Matiz", price: 2e3 }, { name: "Opel Corsa C", price: 4500 }, { name: "VW Golf IV", price: 6e3 }, { name: "Audi A3 (8L)", price: 7e3 }, { name: "Ford Focus Mk1", price: 3500 }, { name: "Fiat Punto II", price: 3e3 }, { name: "Skoda Fabia I", price: 5e3 }, { name: "Renault Clio II", price: 4e3 }, { name: "Peugeot 206", price: 3500 }, { name: "Opel Astra J", price: 25e3 }, { name: "Ford Focus Mk3", price: 28e3 }, { name: "VW Golf VI", price: 22e3 }, { name: "Skoda Octavia II FL", price: 18e3 }, { name: "Toyota Auris I", price: 19e3 }, { name: "Honda Civic VIII", price: 21e3 }, { name: "Kia Ceed II", price: 26e3 }, { name: "Hyundai i30", price: 24e3 }, { name: "Audi A4 B7", price: 15e3 }, { name: "BMW E90", price: 2e4 }, { name: "Volvo V50", price: 14e3 }, { name: "Mazda 6 GH", price: 17e3 }, { name: "VW Passat B8", price: 65e3 }, { name: "Skoda Superb III", price: 75e3 }, { name: "Toyota Corolla Hybrid", price: 8e4 }, { name: "Mazda 6 GJ", price: 55e3 }, { name: "Audi A6 C7", price: 7e4 }, { name: "BMW Seria 5 F10", price: 6e4 }, { name: "Volvo XC60 I", price: 55e3 }, { name: "Ford Mondeo Mk5", price: 45e3 }, { name: "Kia Sportage IV", price: 65e3 }, { name: "Nissan Qashqai II", price: 5e4 }, { name: "BMW Seria 5 G30", price: 15e4 }, { name: "Audi A7 C8", price: 25e4 }, { name: "Mercedes E-Klasa W213", price: 18e4 }, { name: "Porsche Cayenne", price: 22e4 }, { name: "Volvo XC90 II", price: 19e4 }, { name: "Lexus RX", price: 2e5 }, { name: "Tesla Model 3", price: 16e4 }, { name: "Mercedes S-Klasa", price: 3e5 }];
const SCHOOL_TYPES = ["Liceum Og\xF3lnokszta\u0142c\u0105ce", "Technikum", "Szko\u0142a Bran\u017Cowa"];
const JOBS_DB = [
  ["Programista|Programistka", 8e3, 25e3, 9, 17, ["TechSoft", "CodeLab", "DevSolutions", "NetSystems", "ByteCorp"]],
  ["Grafik Komputerowy|Graficzka Komputerowa", 4e3, 9e3, 9, 17, ["PixelArt", "DesignStudio", "CreativeMind", "VisualsPro", "ArtWorks"]],
  ["Ksi\u0119gowy|Ksi\u0119gowa", 5e3, 1e4, 8, 16, ["FinTax", "Biuro Rachunkowe Plus", "AccountPro", "Ksi\u0119gowo\u015B\u0107 24", "TaxExpert"]],
  ["Specjalista HR|Specjalistka HR", 5e3, 9e3, 9, 17, ["HR Partners", "TalentAcquire", "PeopleFirst", "WorkForce", "HR Solutions"]],
  ["Manager Projektu|Managerka Projektu", 9e3, 18e3, 9, 18, ["AgileMinds", "ProjectPro", "ManageIt", "LeadCorp", "TaskMasters"]],
  ["Dyrektor Finansowy|Dyrektor Finansowa", 15e3, 35e3, 8, 18, ["GlobalFinance", "CapitalGroup", "WealthCorp", "FinCorp", "MoneyMakers"]],
  ["Recepcjonista|Recepcjonistka", 3500, 5e3, 8, 16, ["Hotel Grand", "Biuro Centrum", "Recepcja Pro", "WelcomeDesk", "FrontOffice"]],
  ["Analityk Danych|Analityczka Danych", 7e3, 14e3, 9, 17, ["DataMinds", "StatPro", "InfoMetrics", "DataCorp", "AnalyticsGroup"]],
  ["Prawnik (Korporacja)|Prawniczka (Korporacja)", 1e4, 25e3, 9, 19, ["Kancelaria Prawna Lex", "LawPartners", "LegalPro", "Kancelaria Kowalski", "IusCorp"]],
  ["Sprzedawca (Sklep Spo\u017Cywczy)|Sprzedawczyni (Sklep Spo\u017Cywczy)", 3200, 4e3, 6, 14, ["Biedronka", "Lidl", "\u017Babka", "Kaufland", "Carrefour"]],
  ["Sprzedawca (Galeria)|Sprzedawczyni (Galeria)", 3500, 4500, 10, 21, ["Zara", "H&M", "Reserved", "CCC", "Empik"]],
  ["Kelner|Kelnerka", 3200, 6e3, 12, 22, ["Restauracja pod R\xF3\u017C\u0105", "Bistro Smak", "Pizzeria Napoli", "Kawiarnia Mokka", "SteakHouse"]],
  ["Barman|Barmanka", 3500, 7e3, 18, 2, ["Klub Nocny", "Bar u Zdzicha", "Cocktail Bar", "Pub Pod Kapslem", "Shot Bar"]],
  ["Kucharz|Kucharka", 4500, 8e3, 10, 22, ["Restauracja pod R\xF3\u017C\u0105", "Bistro Smak", "Pizzeria Napoli", "Kawiarnia Mokka", "SteakHouse"]],
  ["Kurier|Kurierka", 4e3, 6e3, 7, 17, ["InPost", "DPD", "DHL", "GLS", "Poczta Polska"]],
  ["Fryzjer|Fryzjerka", 3500, 7e3, 10, 18, ["Salon Fryzjerski", "Barber Shop", "Studio Urody", "HairStylist", "Ci\u0119cie i Kolor"]],
  ["Taks\xF3wkarz|Taks\xF3wkarka", 4e3, 8e3, 16, 4, ["Uber", "Bolt", "FreeNow", "Radio Taxi", "Eco Taxi"]],
  ["Mechanik Samochodowy|Mechaniczka Samochodowa", 4500, 9e3, 8, 16, ["Auto Serwis", "Warsztat u Janka", "CarFix", "Moto Serwis", "Auto Naprawa"]],
  ["Elektryk|Elektryczka", 5e3, 1e4, 7, 15, ["Elektro Instal", "Volt Serwis", "Kable i Przewody", "Elektryk 24h", "Instalator"]],
  ["Hydraulik|Hydrauliczka", 4500, 9500, 7, 15, ["Wodo Kan", "Rura Serwis", "Hydraulik 24h", "Instalacje Sanitarne", "Pogotowie Hydrauliczne"]],
  ["Pracownik Budowlany|Pracownica Budowlana", 4e3, 7e3, 6, 14, ["Bud-Max", "Firma Budowlana", "Konstruktor", "Budujemy Dom", "Remonty i Wyko\u0144czenia"]],
  ["Magazynier|Magazynierka", 3500, 5e3, 6, 14, ["Amazon", "Allegro", "Magazyn Centralny", "Logistyka Plus", "Centrum Dystrybucji"]],
  ["Kierowca Ci\u0119\u017Car\xF3wki|Kierowczyni Ci\u0119\u017Car\xF3wki", 6e3, 11e3, 5, 17, ["Trans-Pol", "Logistics", "Firma Transportowa", "TIR Serwis", "Spedycja"]],
  ["Lekarz|Lekarka", 8e3, 2e4, 8, 16, ["Szpital Wojew\xF3dzki", "Klinika Prywatna", "Przychodnia Rodzinna", "Centrum Medyczne", "Szpital Kliniczny"]],
  ["Piel\u0119gniarz|Piel\u0119gniarka", 4500, 7e3, 7, 19, ["Szpital Wojew\xF3dzki", "Klinika Prywatna", "Przychodnia Rodzinna", "Centrum Medyczne", "Szpital Kliniczny"]],
  ["Ratownik Medyczny|Ratowniczka Medyczna", 4e3, 6500, 19, 7, ["Pogotowie Ratunkowe", "Szpitalny Oddzia\u0142 Ratunkowy", "Stacja Pogotowia", "Lotnicze Pogotowie", "Prywatny Transport Medyczny"]],
  ["Nauczyciel|Nauczycielka", 3800, 5500, 8, 15, ["Szko\u0142a Podstawowa", "Liceum Og\xF3lnokszta\u0142c\u0105ce", "Technikum", "Szko\u0142a J\u0119zykowa", "Przedszkole"]],
  ["Policjant|Policjantka", 4500, 7500, 6, 14, ["Komenda G\u0142\xF3wna Policji", "Komenda Wojew\xF3dzka", "Komisariat Policji", "Wydzia\u0142 Kryminalny", "Drog\xF3wka"]],
  ["Stra\u017Cak|Stra\u017Caczka", 4500, 7500, 8, 8, ["Pa\u0144stwowa Stra\u017C Po\u017Carna", "Ochotnicza Stra\u017C Po\u017Carna", "Jednostka Ratowniczo-Ga\u015Bnicza", "Stra\u017C Po\u017Carna", "Centrum Powiadamiania Ratunkowego"]],
  ["Urz\u0119dnik|Urz\u0119dniczka", 4e3, 6e3, 8, 16, ["Urz\u0105d Miasta", "Urz\u0105d Skarbowy", "ZUS", "Urz\u0105d Wojew\xF3dzki", "Ministerstwo"]],
  ["Ochroniarz|Ochroniarka", 3200, 4e3, 22, 6, ["Solid Security", "Konsalnet", "Juventas", "Securitas", "Agencja Ochrony"]],
  ["Trener Personalny|Trenerka Personalna", 4e3, 1e4, 6, 20, ["Zdrofit", "CityFit", "McFIT", "Fitness Club", "Si\u0142ownia"]],
  ["Dziennikarz|Dziennikarka", 4e3, 9e3, 9, 17, ["Gazeta Wyborcza", "TVN", "Polsat", "Onet", "Radio Zet"]],
  ["Architekt|Architektka", 6e3, 12e3, 9, 18, ["Biuro Architektoniczne", "Studio Projektowe", "Arch-Design", "Bud-Projekt", "Urbanistyka"]]
];
export {
  ADDICTIONS,
  BANKS,
  CAR_COLORS,
  CAR_MODELS,
  CITIES,
  COMPANY_NAMES,
  CRIMES_MAJOR,
  CRIMES_MINOR,
  DISEASES,
  EYE_COLORS,
  FEMALE_NAMES,
  HAIR_COLORS,
  JOBS_DB,
  LAST_NAMES,
  MALE_NAMES,
  ORGAN_DEFINITIONS,
  PSYCH_TRAITS_PAIRS,
  SCHOOL_TYPES,
  STREETS,
  SHOPS,
  BARS,
  CLUBS,
  GYMS,
  RESTAURANTS,
  HOBBIES
};
