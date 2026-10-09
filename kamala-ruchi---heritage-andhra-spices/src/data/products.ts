import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'koora-karaam',
    name: 'Koora Karaam',
    teluguName: 'కూర కారం',
    category: 'spice-powders',
    categoryLabel: 'Spice Powders',
    basePrice: 50,
    largePrice: 150,
    badges: [
      { text: 'Bestseller', variant: 'primary' },
      { text: 'Authentic Andhra Recipe', variant: 'surface' }
    ],
    description: 'Traditional Andhra-style spice blend with a perfect kick. Sun-dried Guntur chillies balanced with garlic and cumin.',
    fullDescription: 'Koora Karaam is the undisputed crown jewel of Andhra kitchens. Hand-pounded using sun-drenched fiery Guntur Teja chillies, toasted cumin, roasted coriander seeds, and whole pink garlic pods. This versatile masala elevates everyday stir-fries, gravies, and lentil curries with deep aromatic warmth and balanced pungency.',
    ingredients: ['Guntur Chillies', 'Roasted Cumin', 'Whole Coriander Seeds', 'Pink Mountain Garlic', 'Rock Salt', 'Cold-Pressed Sesame Oil'],
    benefits: ['Boosts metabolic warmth', 'Natural antimicrobial garlic oils', 'Stone pounded for essential oil retention'],
    heatLevel: 4,
    packagingNote: 'Sun-Sealed Craft Pouch',
    bestPairedWith: 'Bendakaya Vepudu (Okra Fry), Potato Roast, Gutti Vankaya Gravy',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_J-0mo-yZrma1H5b3pc-r4rsV52yRBs1g35h0SDB33Dg1tELiPMSmBb_5MjwBdz7l7BrRYVdRDpA9e8M8YDslVB6Y6YtCPE3H7jlCkEn8m7qxwndi35SBQPLxDyH4nEx4Vo7veYL5S0ikYFolvawxaJ3cY3XjCyK0rni1kkfS10OGA4i55MyXbmojF1d0nt4iXTyUIXXPoqfSOAR8GMCGZexgYTtNgTdGX4aTdi7uvrnG7KMmMfBX',
    isBestseller: true
  },
  {
    id: 'kandi-podi',
    name: 'Kandi Podi',
    teluguName: 'కంది పొడి',
    category: 'spice-powders',
    categoryLabel: 'Spice Powders',
    basePrice: 50,
    largePrice: 150,
    badges: [
      { text: 'Daily Essential', variant: 'primary' },
      { text: 'Slow Roasted Dal', variant: 'surface' }
    ],
    description: 'Roasted dal and spice powder for everyday meals. Best enjoyed mixed into hot steamed rice with a dollop of pure desi ghee.',
    fullDescription: 'Revered across Telugu households as the quintessential soul food. Selected unpolished native toor dal and chana dal are slow-roasted over low wood flame in cast iron pans until nutty and fragrant, then stone-crushed with sun-dried red chillies, cumin, and hing.',
    ingredients: ['Native Toor Dal', 'Roasted Chana Dal', 'Sun-Dried Red Chillies', 'Cumin Seeds', 'Compounded Hing (Asafoetida)', 'Sea Salt'],
    benefits: ['High natural plant protein', 'Gentle on digestion', 'Pure comfort comfort food for all ages'],
    heatLevel: 2,
    packagingNote: 'Aromatically Sealed Jar',
    bestPairedWith: 'Piping hot Sona Masoori rice with a generous spoonful of warm A2 Desi Cow Ghee',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ7H5Isjm4d84cN6ynr2QAydQZ_UmPW_AvZ3Qk1aq-NUqpfahpEKdyjKBlEIq5mI8lO5tkLsnYamYN8T4sJGuEMC-s-2zKaJKD0S2MP94eRNXi-uohN_BjFldlUqMPgXXEeeQMBxL0FR99kNFxiSJ6Aw33C5TyhcPaO05MrI6U8Gmc0OCSS3aHeogvl-nNm9liEhPBHiOrxaVy51VJMUyZBoTV-wf7agCfVFmPkbEagukNH1QZRwz2',
    isBestseller: true
  },
  {
    id: 'sonti-podi',
    name: 'Sonti Podi',
    teluguName: 'సొంటి పొడి',
    category: 'spice-powders',
    categoryLabel: 'Spice Powders',
    basePrice: 40,
    largePrice: 80,
    badges: [
      { text: 'Digestive Heritage', variant: 'secondary' }
    ],
    description: 'Aromatic dry ginger powder with a warm traditional flavour. Concocted with hand-crushed peppercorns and roasted cumin.',
    fullDescription: 'Handcrafted according to ancestral Ayurvedic principles, Sonti Podi uses sun-dried ginger rhizomes (sonti) roasted carefully with Malabar black peppercorns and aromatic cumin seeds. A therapeutic everyday accompaniment that calms the tummy and ignites digestive agni.',
    ingredients: ['Sun-Dried Ginger Rhizome (Sonti)', 'Malabar Black Peppercorns', 'Cumin Seeds', 'Rock Salt', 'Roasted Lentils'],
    benefits: ['Stimulates digestive fire', 'Alleviates winter cold & throat stiffness', 'Anti-inflammatory properties'],
    heatLevel: 3,
    packagingNote: 'Moisture-Proof Tin',
    bestPairedWith: 'Warm rice mixed with sesame oil or hot rasam broth',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoMfAMz-QZ5Oby_BKhQvxL1DzgttCQ1NLXVQ76X4HUDJlx9Y47KP7ftnXnuQ7FILwVYvf2s0N6dZYj-aJSNp33Ktp96I7QCutSYKxTeOV42G3UPWtNP6Q3X67ca5jnHCXvo0jNPBN0eLSumtDgJmgvmflg_cw4hK_vHd9Ifn1f-UzHkkf0c9EFKj8DqcB2oc428BzCXhkR25R0bSOuwBIgod3i_iSNcQaW578kwEsYi1_Ne8L71QIk'
  },
  {
    id: 'karivepaku-podi',
    name: 'Karivepaku Podi',
    teluguName: 'కరివేపాకు పొడి',
    category: 'spice-powders',
    categoryLabel: 'Spice Powders',
    basePrice: 50,
    largePrice: 150,
    badges: [
      { text: 'Superfood Blend', variant: 'primary' }
    ],
    description: 'Fragrant curry leaf powder with a rich earthy taste. Prepared with farm-fresh organic curry foliage slowly roasted in iron kadai.',
    fullDescription: 'Fresh dark green curry leaves handpicked from organic farm groves at dawn, washed and dried in courtyard shade, then pan-roasted with roasted lentils, coriander seeds, and dry red chillies. Crisp, fragrant, and packed with plant-based iron.',
    ingredients: ['Shade-Dried Curry Leaves', 'Roasted Urad Dal', 'Chana Dal', 'Whole Red Chillies', 'Coriander Seeds', 'Tamarind Pulp', 'Sea Salt'],
    benefits: ['Dense source of iron & folic acid', 'Supports lustrous hair and eye health', 'Antioxidant powerhouse'],
    heatLevel: 2,
    packagingNote: 'Preserved Aroma Packet',
    bestPairedWith: 'Crispy dosas, hot idlis, or sprinkled over curd rice',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsxfrE9Q6JvlW-LgmT3j47vIz18j7S0CImPn59dHQ13V3rT6QwR5fJW4feBQllWFzvxZQj07DfLmqCQauO0TK0jfJJWQ639JZ5AjQJDqNC9Y8qHjOoOiIBFUaA-xtmSjQY87r4VoKzC9vEeOlbytMCx9GStPS40jEL9wDsqiZi81hJj0Kt0n1pSf9izyCZQbhdepTCJYQ67qejBFHIatkEDF28ksCqcAQ7RwXKqPyn4nkJDb8apmtt'
  },
  {
    id: 'rasam-powder',
    name: 'Rasam Powder',
    teluguName: 'చారు పొడి / రసం పొడి',
    category: 'spice-powders',
    categoryLabel: 'Spice Powders',
    basePrice: 50,
    largePrice: 150,
    badges: [
      { text: 'Ancestral Pantry', variant: 'secondary' }
    ],
    description: 'Aromatic traditional blend for comforting South Indian rasam. Infused with coarse coriander seed oils and tellicherry pepper.',
    fullDescription: 'Nothing heals the soul like a bowl of steaming pepper rasam. Our blend relies on coarse crushed Tellicherry peppercorns, coriander seeds, roasted cumin, and heirloom turmeric from Duggirala. Delivers that comforting courtyard fragrance right into your soup pan.',
    ingredients: ['Tellicherry Black Pepper', 'Coriander Seeds', 'Cumin Seeds', 'Kandahar Hing', 'Duggirala Turmeric', 'Curry Foliage'],
    benefits: ['Quick relief for throat tickles', 'Digestive restoration after heavy feasts', 'Rich in natural piperine'],
    heatLevel: 3,
    packagingNote: 'Fresh Roasted Batch Jar',
    bestPairedWith: 'Simmered with ripe crushed tomatoes, tamarind water, and fresh cilantro',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUa7PHTbW_MToAzFwbPkJq-CC0kQjMPk7m34q4igIWbGa7HJhTtjZyZY0htoxigsMoYKqWsaW7s69wEfpRrfO8KZ5sCpPTx5OuyOql0GIP4SWzko6fFASdLv9iWn0ELvdfFbLrkK1g6A6Q-mCtBnt3EMeM5b5jKA6s4JWTEBWUfKXXEieGFdhemxVlrrxkOPIF1VX5jCKiSu54oiQvv9QVo4rUEjlREIqs7JVmj1IBBfz8EuilLnvJ'
  },
  {
    id: 'nuvvula-podi',
    name: 'Nuvvula Podi',
    teluguName: 'నువ్వుల పొడి',
    category: 'spice-powders',
    categoryLabel: 'Spice Powders',
    basePrice: 50,
    largePrice: 150,
    badges: [
      { text: 'Rich in Calcium', variant: 'primary' }
    ],
    description: 'Nutty roasted sesame powder full of flavour. Hand-toasted in unpolished iron kadai with crisp red chillies and sea salt.',
    fullDescription: 'Whole unpolished white and brown sesame seeds slowly roasted in iron skillets until they pop with rich sesame oil goodness. Lightly spiced with roasted chillies and garlic for a deeply satisfying, calcium-dense sprinkle.',
    ingredients: ['Native Unpolished Sesame Seeds', 'Roasted Garlic', 'Red Chillies', 'Cumin', 'Rock Salt'],
    benefits: ['Exceptional natural bioavailable calcium', 'Strengthens bone density', 'Rich nutty mouthfeel'],
    heatLevel: 2,
    packagingNote: 'Nutty Freshness Tin',
    bestPairedWith: 'Hot rice, stuffed brinjal curries, or sprinkled on vegetable roasts',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkJrj7qB6ef3rmT9_Do3GccARmGHDkqhFYAxxXL26b9deWkhcFM9Z8cvyd2GJchfczdkwWhNNMSi8KQyDsbmut1oC6vfIiaKRq0J7OOIHXi-9WeLJJ2CF924ThOitQ8yj-_o-8y597nlIdZlsHrj8Mom_y3B_PipJEipjod_TonCLyB1nDDTWJiTwQ1FypleHI8SXYCoM1LFFMZpOTbtwaJ6PthUn6i43LSP8fRbKpd_yG85G4HIjG'
  },
  {
    id: 'sambar-powder',
    name: 'Sambar Powder',
    teluguName: 'సాంబారు పొడి',
    category: 'spice-powders',
    categoryLabel: 'Spice Powders',
    basePrice: 50,
    largePrice: 150,
    badges: [
      { text: 'Sunday Lunch Classic', variant: 'surface' }
    ],
    description: 'Traditional roasted spice blend for authentic Andhra sambar. Crafted with stone-ground coriander, fenugreek, and fragrant asafoetida.',
    fullDescription: 'The pride of South Indian celebratory lunches. Roasted lentils, roasted fenugreek (methi) for signature bitterness, fragrant coriander, and sun-dried chillies create a broth with unparalleled body, thickness, and courtyard aroma.',
    ingredients: ['Roasted Chana Dal', 'Toor Dal', 'Coriander Seeds', 'Fenugreek Seeds (Menthulu)', 'Red Chillies', 'Turmeric', 'Pure Hing'],
    benefits: ['Full spectrum whole spice nutrition', 'Harmonizes bitter, sweet, and tangy flavors', 'No artificial thickeners'],
    heatLevel: 2,
    packagingNote: 'Artisan Heritage Pack',
    bestPairedWith: 'Drumstick & shallot sambar served with fluffy hot idlis or ghee rice',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM-teEnu24QgfChKRwXIOm5qfZJ0dAnTkp0FUeJ1nRHrXNvfO0VwzG2QBpa0vQ_K3fZgXQPfLUsr3r8kTVyCO-SIJ50LOmhpSwTNJww_XChO49788l4xEKli0tLcYizmeow9Qccdudh-hPaeBrSSHGeCfNGB3x5joZt7DiPvycPMH7_lcS4FHso1E0SZCrO_kqfFcvXVNU6WYANA7CERFc59bpLFXKWufr0l_11eywooJKFlj-NwIN'
  },
  {
    id: 'munagaku-powder',
    name: 'Munagaku Powder',
    teluguName: 'మునగాకు పొడి',
    category: 'spice-powders',
    categoryLabel: 'Spice Powders',
    basePrice: 50,
    largePrice: 150,
    badges: [
      { text: 'Iron Rich', variant: 'primary' }
    ],
    description: 'Traditional moringa leaf powder. Packed with ancient wellness nutrients, freshly shade-dried and gently spiced.',
    fullDescription: 'Moringa (drumstick) tree leaves hold legendary status in Telugu folklore as the tree of vitality. We tenderly pluck young green leaflets, dry them in shaded breeze, and gently stone-pound them with garlic and mild spices to make wellness delicious.',
    ingredients: ['Tender Shade-Dried Moringa Leaves', 'Roasted Garlic', 'Cumin Seeds', 'Coriander Seeds', 'Red Chillies', 'Sea Salt'],
    benefits: ['Plant-based vitamin A, C, and iron', 'Supports natural immunity', 'Gentle earthy taste without bitterness'],
    heatLevel: 2,
    packagingNote: 'Nutrient-Shield Pouch',
    bestPairedWith: 'Warm millet rotis, brown rice with ghee, or beaten curd',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8VRE6tM9KbStpb8ES-CxYOgp6BeF77mPikOF2B_g51MgjTAnJ6nCtu1zzATR-55_BimFLtNMAKH6BeyMtvu-h16ffPi5rjK9I8CnDv9vEAoAVNlwW0Robky0jNpXtJqeb5d68XLERFj7DR412LPUe-2E157qT0SBYnsp-25_J1Y2YGg5e0IX8VuGgMg7ImAI4NnhkY3wyliEFb3LiX5P7kGtmWtzANyv_DlvSbv3lgxK7jx9gotl5'
  },
  {
    id: 'palli-chutney-premix',
    name: 'Palli Chutney Premix',
    teluguName: 'పల్లీ చట్నీ పొడి',
    category: 'premixes',
    categoryLabel: 'Premixes',
    basePrice: 50,
    largePrice: 150,
    badges: [
      { text: 'Instant Breakfast', variant: 'primary' }
    ],
    description: 'Roasted peanut-based chutney premix for quick, tasty meals. Just stir into warm water or curd for instant tiffin chutney.',
    fullDescription: 'Morning rush solved with grandmother wisdom. Crisp-roasted red skin peanuts ground with dry green chillies, roasted garlic, tamarind, and tempering spices. Simply add 2 spoons of powder to lukewarm water or yogurt for cafe-style tiffin chutney in 10 seconds.',
    ingredients: ['Slow-Roasted Groundnuts', 'Roasted Garlic Pods', 'Green Chilli Flakes', 'Tamarind', 'Cumin', 'Rock Salt', 'Mustard Seeds'],
    benefits: ['Ready in 10 seconds without blender', 'High protein energy start', 'Zero preservatives or hydrogenated fats'],
    heatLevel: 3,
    packagingNote: 'Quick Tiffin Jar',
    bestPairedWith: 'Hot steamed Idlis, Medu Vada, Crispy Dosa, Pesarattu',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJecfRy4q8r1RmECIyZtSf3O9XaqTMwkVqSnFtYOomaFnzQq3qXGbSPm68lkLtACgAU7czbx0KHeKFdLDCHIaBmTs8XToXGrETYkmJzpdZdmOJkMXzSzK-mPR_5HBJNJFMWJdv0jvGo1RRM051KxRoQHH83-QSeZCLNsR87akrSLA6txuUq4096PVYQCBd2sHkK3BvjTC-DHnesegMM8y1hWnkNxRAvENG4yJyObuIM-hWHHVcV4x2'
  },
  {
    id: 'avisaginjala-podi',
    name: 'Avisaginjala Podi',
    teluguName: 'అవిసెగింజల పొడి',
    category: 'spice-powders',
    categoryLabel: 'Spice Powders',
    basePrice: 40,
    largePrice: 80,
    badges: [
      { text: 'Omega-3 Rich', variant: 'secondary' }
    ],
    description: 'Traditional flaxseed podi with a nutty roasted flavour. Perfect condiment for hot idlis, crispy dosas, and warm jowar rotis.',
    fullDescription: 'Alsi / Flaxseeds lightly toasted till nutty and aromatic, blended with garlic, jeera, and dry red chillies. A healthy daily accompaniment celebrated for heart wellness and silky hair.',
    ingredients: ['Roasted Flax Seeds (Avisaginjalu)', 'Roasted Garlic', 'Red Chillies', 'Jeera', 'Hing', 'Sea Salt'],
    benefits: ['Abundant plant Omega-3 ALA fatty acids', 'Heart-healthy dietary fiber', 'Distinctive toasty aroma'],
    heatLevel: 2,
    packagingNote: 'Freshness Lock Tin',
    bestPairedWith: 'Warm jowar rotis, ragi mudde, or mixed into breakfast upma',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgl--0avNQirPkskrKc9G_v4FP_SR9YRMROlb5qB_Xq-z6031cJK8WJ7_NE0KZWWSlIQcthYiQ5GSrtuLRexqMPehyFaUvc3-A6NS3hvk6VuaxUxU2r_FZdDgCqOq9nef7AdHCsjGYvkPkmb9wQK-ZyztV8y_F7JpQciLoeBb4_b3w1xYUj0_iqdLVKAxsCILDHgTqTC0qRPvrZ7ojy8jnurgFEnSeA3LwZJ3W2Od47RJ0u360eXm_'
  },
  {
    id: 'kozhambu-podi',
    name: 'Kozhambu Podi',
    teluguName: 'పులుసు పొడి',
    category: 'spice-powders',
    categoryLabel: 'Spice Powders',
    basePrice: 120,
    largePrice: 285,
    badges: [
      { text: 'Heritage Stew', variant: 'secondary' }
    ],
    description: 'Ancestral blend for rich, tangy vatha kuzhambu and Andhra pulusu stews. Stone ground with sundried spices.',
    fullDescription: 'Crafted with toasted coriander, Bengal gram, red chillies, black pepper, and fenugreek. Yields a dark, glistening tangy gravy when cooked with shallots, garlic, and tamarind extract.',
    ingredients: ['Coriander Seeds', 'Red Chillies', 'Chana Dal', 'Toor Dal', 'Black Peppercorns', 'Fenugreek', 'Curry Leaves'],
    benefits: ['Deep caramelized flavor notes', 'Digestive fenugreek infusion', 'Thickens stews without cornstarch'],
    heatLevel: 3,
    packagingNote: 'Stone Ground • 250g Jar',
    bestPairedWith: 'Poondu (Garlic) Kuzhambu or Sundakkai Vathal Stew',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUa7PHTbW_MToAzFwbPkJq-CC0kQjMPk7m34q4igIWbGa7HJhTtjZyZY0htoxigsMoYKqWsaW7s69wEfpRrfO8KZ5sCpPTx5OuyOql0GIP4SWzko6fFASdLv9iWn0ELvdfFbLrkK1g6A6Q-mCtBnt3EMeM5b5jKA6s4JWTEBWUfKXXEieGFdhemxVlrrxkOPIF1VX5jCKiSu54oiQvv9QVo4rUEjlREIqs7JVmj1IBBfz8EuilLnvJ'
  },
  {
    id: 'chettinad-pepper-masala',
    name: 'Chettinad Pepper Masala',
    teluguName: 'మిరియాల మసాలా',
    category: 'spice-powders',
    categoryLabel: 'Spice Powders',
    basePrice: 140,
    largePrice: 320,
    badges: [
      { text: 'Slow Roasted', variant: 'primary' }
    ],
    description: 'Bold black pepper, star anise, fennel, and stone-roasted spices creating an intoxicating smoky depth.',
    fullDescription: 'From the mansion courtyards of Chettinad, this robust blend features sun-cured Malabar pepper, stone flower (kalpasi), star anise, cinnamon, and roasted coconut flakes.',
    ingredients: ['Tellicherry Black Pepper', 'Kalpasi (Stone Flower)', 'Star Anise', 'Fennel Seeds', 'Cloves', 'Cardamom', 'Cinnamon'],
    benefits: ['Rich in whole-spice phytonutrients', 'Deep smoky warmth', 'Signature restaurant grade aroma at home'],
    heatLevel: 4,
    packagingNote: 'Slow Roasted • 200g Tin',
    bestPairedWith: 'Mushroom pepper roast, paneer sukka, or spicy potato fry',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoMfAMz-QZ5Oby_BKhQvxL1DzgttCQ1NLXVQ76X4HUDJlx9Y47KP7ftnXnuQ7FILwVYvf2s0N6dZYj-aJSNp33Ktp96I7QCutSYKxTeOV42G3UPWtNP6Q3X67ca5jnHCXvo0jNPBN0eLSumtDgJmgvmflg_cw4hK_vHd9Ifn1f-UzHkkf0c9EFKj8DqcB2oc428BzCXhkR25R0bSOuwBIgod3i_iSNcQaW578kwEsYi1_Ne8L71QIk'
  },
  {
    id: 'avakaya-pickle',
    name: 'Andhra Avakaya Mango Pickle',
    teluguName: 'ఆవకాయ పచ్చడి',
    category: 'instant-pickles',
    categoryLabel: 'Instant Pickles',
    basePrice: 95,
    largePrice: 195,
    badges: [
      { text: 'Courtyard Cured', variant: 'primary' }
    ],
    description: 'Crisp raw Ramkela mango pieces drenched in stone-ground mustard, Guntur red chilli powder, and pure cold-pressed sesame oil.',
    fullDescription: 'The soul of Andhra culinary pride. Prepared during peak summer using hand-cut firm green mangoes, sharp brown mustard powder (aava pindi), pure Guntur chilli, and cold-pressed gingelly oil.',
    ingredients: ['Raw Green Mangoes', 'Mustard Seed Powder (Aava Pindi)', 'Guntur Red Chilli', 'Cold-Pressed Gingelly Oil', 'Fenugreek', 'Garlic Pods', 'Rock Salt'],
    benefits: ['Natural probiotic fermentation', 'Traditional digestive spices', 'Zero vinegar or synthetic acid'],
    heatLevel: 5,
    packagingNote: 'Ceramic Jaadi Sealed Glass Jar',
    bestPairedWith: 'Hot rice, desi ghee, and mudda pappu (thick plain dal)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_J-0mo-yZrma1H5b3pc-r4rsV52yRBs1g35h0SDB33Dg1tELiPMSmBb_5MjwBdz7l7BrRYVdRDpA9e8M8YDslVB6Y6YtCPE3H7jlCkEn8m7qxwndi35SBQPLxDyH4nEx4Vo7veYL5S0ikYFolvawxaJ3cY3XjCyK0rni1kkfS10OGA4i55MyXbmojF1d0nt4iXTyUIXXPoqfSOAR8GMCGZexgYTtNgTdGX4aTdi7uvrnG7KMmMfBX'
  },
  {
    id: 'gongura-pachadi',
    name: 'Heirloom Gongura Pachadi',
    teluguName: 'గోంగూర పచ్చడి',
    category: 'instant-pickles',
    categoryLabel: 'Instant Pickles',
    basePrice: 85,
    largePrice: 180,
    badges: [
      { text: 'Andhra Shakahaaram', variant: 'secondary' }
    ],
    description: 'Tangy red-stem sorrel leaves wilted slowly with roasted chillies, coriander seeds, and whole garlic in wooden pestles.',
    fullDescription: 'Known as the Andhra Matha, gongura (red sorrel leaf) brings unmatched tartness and mineral richness. Wilted in sesame oil and stone-pounded with crushed garlic, it is a culinary masterpiece.',
    ingredients: ['Red Stem Gongura Leaves', 'Dry Red Chillies', 'Whole Coriander Seeds', 'Garlic Pods', 'Gingelly Oil', 'Fenugreek', 'Mustard'],
    benefits: ['Rich in vitamin C and dietary iron', 'Distinctive appetizing tanginess', 'Aids mineral absorption'],
    heatLevel: 4,
    packagingNote: 'Courtyard Harvest Jar',
    bestPairedWith: 'Hot rice with sliced raw shallots and a dollop of butter',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsxfrE9Q6JvlW-LgmT3j47vIz18j7S0CImPn59dHQ13V3rT6QwR5fJW4feBQllWFzvxZQj07DfLmqCQauO0TK0jfJJWQ639JZ5AjQJDqNC9Y8qHjOoOiIBFUaA-xtmSjQY87r4VoKzC9vEeOlbytMCx9GStPS40jEL9wDsqiZi81hJj0Kt0n1pSf9izyCZQbhdepTCJYQ67qejBFHIatkEDF28ksCqcAQ7RwXKqPyn4nkJDb8apmtt'
  }
];
