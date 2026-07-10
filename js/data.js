const AppData = {
    users: ["Puma", "Cheetah", "Scout", "Antelope", "Lion", "Elephant"],
    vaccines: [
        { id: "yellow_fever", label: "Yellow Fever (if transiting risk countries)" },
        { id: "typhoid", label: "Typhoid" },
        { id: "hepa", label: "Hepatitis A" },
        { id: "polio", label: "Polio Booster" },
        { id: "cholera", label: "Cholera" },
        { id: "rabies", label: "Rabies (optional)" },
        { id: "hepb", label: "Hepatitis B" },
        { id: "mmr", label: "MMR (Routine)" },
        { id: "tdap", label: "Tdap (Routine)" }
    ],
    packing: {
        safari: [
            { id: "s_binocs", label: "Binoculars" },
            { id: "s_repellent", label: "Insect Repellent (DEET/Picaridin)" },
            { id: "s_neutral", label: "Neutral Colored Clothing (khaki, olive, brown)" },
            { id: "s_layers", label: "Fleece/Jacket for cold mornings" },
            { id: "s_hat", label: "Wide-brimmed Hat" },
            { id: "s_shoes", label: "Closed-toe walking shoes" },
            { id: "s_camera", label: "Camera & extra batteries" }
        ],
        zanzibar: [
            { id: "z_swim", label: "Swimwear (multiple)" },
            { id: "z_sunscreen", label: "Reef-safe Sunscreen" },
            { id: "z_sandals", label: "Sandals / Flip-flops" },
            { id: "z_sunglasses", label: "Sunglasses" },
            { id: "z_coverup", label: "Beach Cover-up" },
            { id: "z_drybag", label: "Small Dry Bag" }
        ],
        general: [
            { id: "g_passport", label: "Passport (valid 6+ months)" },
            { id: "g_visa", label: "Tanzania eVisa / Cash for visa" },
            { id: "g_meds", label: "Antimalarials & Prescription Meds" },
            { id: "g_adapter", label: "Type G Power Adapter" },
            { id: "g_powerbank", label: "Power Bank" },
            { id: "g_cash", label: "Crisp USD bills (2013 or newer)" }
        ]
    },
    wildlife: {
        bigFive: [
            { id: "w_lion", label: "Lion" },
            { id: "w_leopard", label: "Leopard" },
            { id: "w_elephant", label: "Elephant" },
            { id: "w_rhino", label: "Rhino" },
            { id: "w_buffalo", label: "Cape Buffalo" }
        ],
        bonus: [
            { id: "w_cheetah", label: "Cheetah" },
            { id: "w_giraffe", label: "Giraffe" },
            { id: "w_hippo", label: "Hippo" },
            { id: "w_zebra", label: "Zebra" },
            { id: "w_wildebeest", label: "Wildebeest" },
            { id: "w_hyena", label: "Hyena" },
            { id: "w_warthog", label: "Warthog" }
        ]
    },
    swahili: [
        { eng: "Hello", swa: "Jambo / Hujambo" },
        { eng: "Thank you (very much)", swa: "Asante (sana)" },
        { eng: "Please", swa: "Tafadhali" },
        { eng: "Yes / No", swa: "Ndiyo / Hapana" },
        { eng: "Cheers", swa: "Maisha marefu!" },
        { eng: "No worries / Hakuna Matata", swa: "Hakuna Matata" },
        { eng: "Goodbye", swa: "Kwa heri" },
        { eng: "How much?", swa: "Bei gani?" }
    ],
    zanzibarHotels: [
        { id: "riu_jambo", name: "Hotel Riu Jambo", link: "https://www.riu.com/en/hotel/tanzania/zanzibar/hotel-riu-jambo", note: "Option 1 — all-inclusive" },
        { id: "the_mora", name: "The Mora Zanzibar", link: "https://www.themora.com/zanzibar/", note: "Option 2" }
    ],
    zanzibarActivities: [
        { title: "Snorkeling", desc: "Mnemba Atoll or Safari Blue for incredible marine life." },
        { title: "Spice Tour", desc: "Walk through farms to see, smell, and taste fresh spices." },
        { title: "Stone Town Walking Tour", desc: "Historic streets, carved doors, and local markets." },
        { title: "Sunset Dhow Cruise", desc: "Classic wooden boat sailing at sunset." },
        { title: "Swimming with Dolphins", desc: "Usually in the south near Kizimkazi." }
    ],
    restaurants: [
        { title: "The Rock Restaurant", desc: "Iconic restaurant on a rock in the ocean (book in advance!)." },
        { title: "Forodhani Gardens", desc: "Night market in Stone Town - great for street food like Zanzibar pizza." },
        { title: "Lukmaan Restaurant", desc: "Authentic local food in Stone Town." }
    ]
};
