import mongoose from "mongoose";
import { config } from "dotenv";
import { resolve } from "path";
import { existsSync } from "fs";

// Load environment variables from .env.local or .env
const envLocalPath = resolve(process.cwd(), ".env.local");
const envPath = resolve(process.cwd(), ".env");

if (existsSync(envLocalPath)) {
  config({ path: envLocalPath });
  console.log(" Loaded environment variables from .env.local");
} else if (existsSync(envPath)) {
  config({ path: envPath });
  console.log(" Loaded environment variables from .env");
} else {
  console.warn(
    " No .env.local or .env file found. Make sure MONGODB_URI is set."
  );
}

import connectDB from "../lib/mongodb";
import Place from "../models/Place";
import Category from "../models/Category";
import User from "../models/User";
import bcrypt from "bcryptjs";

const placesData = [
  // World Wonders
  {
    name: "Great Wall of China",
    country: "China",
    category: "World Wonders",
    description:
      "The Great Wall of China is one of the most iconic structures in the world, stretching over 13,000 miles across northern China. This ancient fortification system was built to protect Chinese states from invasions.",
    shortDescription: "Ancient marvel stretching over 13,000 miles",
    bestTime: "April to June, September to November",
    whySpecial:
      "It's the longest wall in the world and a symbol of Chinese civilization. Walking along this ancient wonder offers breathtaking views of the surrounding mountains and countryside.",
    thingsToDo: [
      "Walk along the Mutianyu or Badaling sections",
      "Visit the Jinshanling section for hiking",
      "See the sunset over the wall",
      "Visit the Great Wall Museum",
      "Take a cable car for panoramic views",
    ],
    images: [
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=800",
      "https://images.unsplash.com/photo-1515555230216-82228b88ea98?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3043.372339926797!2d116.57037531537324!3d40.43190807937838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35f121d7687f2ccf%3A0xd040259b950522df!2sGreat%20Wall%20of%20China!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$50-150/day",
    safety:
      "China is generally safe for tourists. Be cautious with personal belongings in crowded areas. Follow local laws and regulations. Get travel insurance before your trip.",
    tips: [
      "Book tickets in advance during peak season",
      "Wear comfortable walking shoes",
      "Bring water and snacks",
      "Avoid visiting during Chinese holidays",
      "Consider hiring a local guide",
    ],
    rating: 4.8,
    isWorldWonder: true,
    isFeatured: true,
  },
  {
    name: "Taj Mahal",
    country: "India",
    category: "World Wonders",
    description:
      "The Taj Mahal is a stunning ivory-white marble mausoleum built by Mughal Emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal. It's considered one of the most beautiful buildings in the world.",
    shortDescription: "Monument of eternal love in white marble",
    bestTime: "October to March",
    whySpecial:
      "This architectural masterpiece is a symbol of eternal love and one of the New Seven Wonders of the World. The intricate marble inlay work and perfect symmetry make it breathtaking.",
    thingsToDo: [
      "Watch the sunrise over Taj Mahal",
      "Explore the Mughal gardens",
      "Visit the Agra Fort nearby",
      "See the Taj Museum",
      "Take a boat ride on Yamuna River",
    ],
    images: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3549.400402075927!2d78.04206851534045!3d27.175015283015037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39747121d702ff6d%3A0xdd2ae4803f767dde!2sTaj%20Mahal!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$30-80/day",
    safety:
      "India is generally safe, but be cautious with food and water. Drink only bottled water. Be aware of your surroundings, especially in crowded areas.",
    tips: [
      "Visit early morning to avoid crowds",
      "Book tickets online in advance",
      "Respect the dress code",
      "Hire a local guide for better experience",
      "Bargain when shopping",
    ],
    rating: 4.9,
    isWorldWonder: true,
    isFeatured: true,
  },
  {
    name: "Christ the Redeemer",
    country: "Brazil",
    category: "World Wonders",
    description:
      "Christ the Redeemer is an iconic statue of Jesus Christ in Rio de Janeiro, Brazil. Standing 98 feet tall on Corcovado Mountain, it overlooks the entire city with outstretched arms.",
    shortDescription: "Iconic statue overlooking Rio de Janeiro",
    bestTime: "May to October (dry season)",
    whySpecial:
      "This Art Deco statue is one of the New Seven Wonders and offers panoramic views of Rio de Janeiro, including Sugarloaf Mountain, Copacabana Beach, and the city skyline.",
    thingsToDo: [
      "Take the train to the summit",
      "Enjoy panoramic city views",
      "Visit at sunset for stunning photos",
      "Explore Tijuca National Park nearby",
      "Combine with Sugarloaf Mountain visit",
    ],
    images: [
      "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=800",
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.296041360489!2d-43.21267588503443!3d-22.951916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997fd5984aa13f%3A0x9a51b6b5d99c03cb!2sChrist%20the%20Redeemer!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$80-180/day",
    safety:
      "Rio can be safe but be cautious in certain areas. Avoid displaying expensive items. Stay in tourist areas and use registered taxis. Be careful with your belongings on beaches.",
    tips: [
      "Buy tickets in advance online",
      "Go early to avoid crowds",
      "Check weather forecast",
      "Bring camera for amazing photos",
      "Wear comfortable shoes",
    ],
    rating: 4.7,
    isWorldWonder: true,
  },
  {
    name: "Petra",
    country: "Jordan",
    category: "World Wonders",
    description:
      "Petra is an ancient archaeological city carved into red sandstone cliffs in southern Jordan. This Nabataean capital is famous for its rock-cut architecture and water conduit system.",
    shortDescription: "The rose-red city carved in rock",
    bestTime: "March to May, September to November",
    whySpecial:
      'Known as the "Rose City" due to the color of the stone, Petra is a UNESCO World Heritage Site and one of the New Seven Wonders. The Treasury (Al-Khazneh) is one of the most photographed monuments in the world.',
    thingsToDo: [
      "Walk through the Siq canyon",
      "Visit the Treasury (Al-Khazneh)",
      "Climb to the Monastery",
      "See the Royal Tombs",
      "Explore the Roman Theater",
    ],
    images: [
      "https://images.unsplash.com/photo-1559854036-24057c027077?w=800",
      "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.7288572787817!2d35.44304731515696!3d30.328456081782593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1501698c7b86f7bd%3A0xa5c5c1a0c7e2c1d3!2sPetra!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$80-150/day",
    safety:
      "Jordan is one of the safest countries in the Middle East. Respect local customs and dress modestly. Follow guidance from local authorities.",
    tips: [
      "Arrive early to avoid crowds",
      "Wear comfortable walking shoes",
      "Bring plenty of water",
      "Hire a local guide",
      "Spend at least 2 days exploring",
    ],
    rating: 4.9,
    isWorldWonder: true,
  },
  {
    name: "Colosseum",
    country: "Italy",
    category: "World Wonders",
    description:
      "The Colosseum is an ancient Roman amphitheater in the center of Rome. This massive stone structure could hold up to 80,000 spectators and hosted gladiatorial contests and public spectacles.",
    shortDescription: "Ancient Rome's iconic amphitheatre",
    bestTime: "April to June, September to October",
    whySpecial:
      "It's the largest amphitheater ever built and a symbol of the Roman Empire's engineering prowess. Walking through this ancient structure transports you back to ancient Rome.",
    thingsToDo: [
      "Take a guided tour of the arena floor",
      "Visit the underground chambers",
      "Explore the Roman Forum nearby",
      "See the Arch of Constantine",
      "Take a night tour",
    ],
    images: [
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800",
      "https://images.unsplash.com/photo-1515542690570-985b500b0e3f?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2969.247414818738!2d12.49223091537067!3d41.89021427922146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f61b6532013ad%3A0x28f1c82e908503c4!2sColosseum!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$100-200/day",
    safety:
      "Rome is generally safe, but beware of pickpockets in crowded tourist areas. Keep your belongings secure and be cautious in public transport.",
    tips: [
      "Book skip-the-line tickets in advance",
      "Visit early morning or late afternoon",
      "Combine with Roman Forum visit",
      "Wear comfortable shoes",
      "Bring water bottle",
    ],
    rating: 4.7,
    isWorldWonder: true,
    isFeatured: true,
  },
  {
    name: "Machu Picchu",
    country: "Peru",
    category: "World Wonders",
    description:
      'Machu Picchu is a 15th-century Inca citadel located high in the Andes Mountains. This "Lost City of the Incas" was built around 1450 and abandoned a century later, remaining unknown to the outside world until 1911.',
    shortDescription: "Lost city of the Incas in the clouds",
    bestTime: "May to September (dry season)",
    whySpecial:
      "This ancient Incan city sits dramatically on a mountain ridge at 7,970 feet above sea level. The sophisticated dry-stone construction and stunning mountain views make it an unforgettable experience.",
    thingsToDo: [
      "Hike the Inca Trail (4-day trek)",
      "Watch sunrise over Machu Picchu",
      "Climb Huayna Picchu mountain",
      "Visit the Temple of the Sun",
      "Explore the agricultural terraces",
    ],
    images: [
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800",
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.398565778637!2d-72.54505928516696!3d-13.163016990668776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x916d9a5f89555555%3A0x3a10370ea4a01a27!2sMachu%20Picchu!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$100-200/day",
    safety:
      "Peru is generally safe, but altitude sickness can be an issue. Acclimatize in Cusco before visiting. Be cautious with food and water. Use registered tour operators.",
    tips: [
      "Book tickets 3-4 months in advance",
      "Acclimatize to altitude first",
      "Start Inca Trail training early",
      "Bring layers for changing weather",
      "Consider hiring a guide",
    ],
    rating: 4.9,
    isWorldWonder: true,
    isFeatured: true,
    isTrending: true,
  },
  {
    name: "Chichen Itza",
    country: "Mexico",
    category: "World Wonders",
    description:
      "Chichen Itza is a large pre-Columbian archaeological site built by the Maya civilization. The pyramid known as El Castillo (The Castle) is one of the most recognizable structures in the world.",
    shortDescription: "Ancient Maya pyramid of wonder",
    bestTime: "November to April",
    whySpecial:
      "This ancient Mayan city showcases advanced Mayan architecture and astronomy. During spring and autumn equinoxes, the pyramid creates a shadow serpent that appears to slither down the steps.",
    thingsToDo: [
      "Climb El Castillo pyramid",
      "See the Great Ball Court",
      "Visit the Temple of the Warriors",
      "Explore the Sacred Cenote",
      "Watch the light and sound show",
    ],
    images: [
      "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800",
      "https://images.unsplash.com/photo-1534314229170-96b47189f95c?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3734.497090358554!2d-88.56882568509873!3d20.684284986213397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f5138c6e391c0e7%3A0x7c1ea0a168994d9a!2sChichen%20Itza!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$60-120/day",
    safety:
      "Mexico is generally safe for tourists in Yucatan. Stay in tourist areas and use registered transportation. Be cautious with street food initially.",
    tips: [
      "Arrive early to avoid crowds",
      "Visit during equinox for special effect",
      "Hire a local guide",
      "Bring hat and sunscreen",
      "Stay hydrated",
    ],
    rating: 4.6,
    isWorldWonder: true,
  },
  // Romantic Places
  {
    name: "Paris",
    country: "France",
    category: "Romance",
    description:
      "The City of Light is one of the most romantic destinations in the world. With its charming streets, world-class cuisine, iconic landmarks, and beautiful architecture, Paris captures hearts like no other city.",
    shortDescription: "The City of Light and Love",
    bestTime: "April to June, September to October",
    whySpecial:
      "Paris exudes romance at every turn - from cozy cafés to the Eiffel Tower sparkling at night, from Seine River cruises to intimate art galleries. It's the perfect backdrop for love.",
    thingsToDo: [
      "Visit the Eiffel Tower at sunset",
      "Take a Seine River cruise",
      "Stroll through Montmartre",
      "Enjoy a romantic dinner at a bistro",
      "Visit the Louvre Museum",
      "Walk along Champs-Élysées",
    ],
    images: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
      "https://images.unsplash.com/photo-1549144511-f099e773c147?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d83998.75769393834!2d2.2770197738396143!3d48.858950681172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1f06e2b70f%3A0x40b82c3688c9460!2sParis%2C%20France!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$150-300/day",
    safety:
      "Paris is generally safe, but beware of pickpockets in tourist areas. Keep belongings secure, especially on the metro. Stay alert in crowded places.",
    tips: [
      "Book museums in advance",
      "Learn basic French phrases",
      "Walk as much as possible",
      "Try local pastries and wine",
      "Use metro for easy transportation",
    ],
    rating: 4.8,
    isTrending: true,
    isFeatured: true,
  },
  {
    name: "Santorini",
    country: "Greece",
    category: "Romance",
    description:
      "Santorini is a stunning Greek island known for its white-washed buildings, blue domes, and breathtaking sunsets. Perched on volcanic cliffs, it offers unparalleled views of the Aegean Sea.",
    shortDescription: "Whitewashed paradise with stunning sunsets",
    bestTime: "May to June, September to October",
    whySpecial:
      "Santorini's iconic sunsets, luxurious cave hotels, and romantic atmosphere make it a top honeymoon destination. The caldera views are simply magical.",
    thingsToDo: [
      "Watch sunset in Oia",
      "Stay in a cave hotel",
      "Wine tasting in vineyards",
      "Visit Red and Black beaches",
      "Take a catamaran cruise",
      "Explore ancient Akrotiri",
    ],
    images: [
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20165.27336793937!2d25.37666469357989!3d36.39320981640625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1499cdce05e3bce9%3A0x9f4e193d8b8d8f4f!2sSantorini!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$150-350/day",
    safety:
      "Santorini is very safe. Be careful on the cliffs and when swimming. Follow local guidelines for volcanic areas.",
    tips: [
      "Book hotels 6+ months in advance",
      "Rent an ATV or car",
      "Reserve sunset viewing spots early",
      "Try local Greek cuisine",
      "Bring comfortable walking shoes",
    ],
    rating: 4.9,
    isTrending: true,
    isFeatured: true,
  },
  {
    name: "Venice",
    country: "Italy",
    category: "Romance",
    description:
      'Venice is a unique city built on 118 small islands connected by canals and bridges. Known as the "City of Water," it\'s one of the most romantic destinations in the world.',
    shortDescription: "Floating city of canals and romance",
    bestTime: "April to May, September to November",
    whySpecial:
      "Gondola rides through narrow canals, stunning Renaissance architecture, and the absence of cars create an enchanting atmosphere perfect for romance.",
    thingsToDo: [
      "Gondola ride through canals",
      "Visit St. Mark's Square and Basilica",
      "Climb the Campanile for views",
      "Explore Doge's Palace",
      "Walk the Rialto Bridge",
      "Take a day trip to Burano",
    ],
    images: [
      "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800",
      "https://images.unsplash.com/photo-1534314229170-96b47189f95c?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d89726.76157069624!2d12.31551508647228!3d45.43719084708533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x477e1a1c4e5b4f5b%3A0x4c8e4e5c5c5c5c5c!2sVenice%2C%20Italy!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$150-300/day",
    safety:
      "Venice is safe, but beware of pickpockets in crowded areas. Be careful when walking near canals. Watch your step on bridges.",
    tips: [
      "Book gondola rides in advance",
      "Get lost in the narrow streets",
      "Avoid tourist trap restaurants",
      "Buy a Venice Card for transport",
      "Visit early morning for fewer crowds",
    ],
    rating: 4.8,
    isTrending: true,
  },
  // Beaches
  {
    name: "Maldives",
    country: "Maldives",
    category: "Beaches",
    description:
      "The Maldives is a tropical nation in the Indian Ocean composed of 26 ring-shaped atolls, featuring overwater bungalows and crystal-clear turquoise waters.",
    shortDescription: "Paradise of overwater villas and turquoise lagoons",
    bestTime: "November to April",
    whySpecial:
      "Ultimate luxury destination with crystal-clear waters and exclusive overwater bungalows perfect for honeymoons.",
    thingsToDo: [
      "Stay in overwater villa",
      "Snorkeling with mantas",
      "Sunset dolphin cruise",
      "Underwater dining",
      "Private sandbank picnic",
    ],
    images: [
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4085959.234567890!2d73.0!3d3.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x24b599bfaafb7bbd%3A0x414509e181956289!2sMaldives!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$300-1000/day",
    safety: "Very safe. Follow marine guidelines.",
    tips: [
      "Book all-inclusive",
      "Visit local islands too",
      "Best for honeymoons",
      "Bring reef-safe sunscreen",
    ],
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: "Bali",
    country: "Indonesia",
    category: "Beaches",
    description:
      "Bali is an Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs. It's home to religious sites such as cliffside Uluwatu Temple.",
    shortDescription: "Island of Gods with temples and rice terraces",
    bestTime: "April to October",
    whySpecial:
      "A perfect blend of spiritual culture, stunning landscapes, and world-class beaches.",
    thingsToDo: [
      "Tegallalang Rice Terraces",
      "Uluwatu Temple sunset",
      "Surfing at Kuta",
      "Ubud Monkey Forest",
      "Tirta Empul Temple",
    ],
    images: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.60912412467!2d115.188916!3d-8.409518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd22f7520fca7d3%3A0x2872b62cc456cd84!2sBali!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$50-150/day",
    safety: "Very safe. Respect temple dress codes.",
    tips: [
      "Rent a scooter",
      "Visit Ubud for culture",
      "Try local warungs",
      "Book activities directly",
    ],
    rating: 4.7,
    isFeatured: true,
    isTrending: true,
  },
  {
    name: "Bora Bora",
    country: "French Polynesia",
    category: "Beaches",
    description:
      "Bora Bora is a small South Pacific island northwest of Tahiti in French Polynesia. Surrounded by sand-fringed motus and a turquoise lagoon protected by a coral reef, it's known for its scuba diving.",
    shortDescription: "Ultimate tropical paradise with overwater bungalows",
    bestTime: "May to October",
    whySpecial:
      "The most beautiful island in the world with stunning overwater bungalows and crystal-clear lagoon.",
    thingsToDo: [
      "Stay in overwater bungalow",
      "Snorkel in the lagoon",
      "Climb Mount Otemanu",
      "Shark and ray feeding",
      "Sunset cruise",
    ],
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4085959.234567890!2d-151.75!3d-16.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x76bdbd188a4a98ab%3A0x160a089e92d5ce61!2sBora%20Bora!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$400-1200/day",
    safety: "Very safe. Follow water safety guidelines.",
    tips: [
      "Book well in advance",
      "Try local Polynesian cuisine",
      "Bring underwater camera",
      "Respect local customs",
    ],
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: "Seychelles",
    country: "Seychelles",
    category: "Beaches",
    description:
      "Seychelles is an archipelago of 115 islands in the Indian Ocean, off East Africa. It's home to numerous beaches, coral reefs and nature reserves, as well as rare animals such as giant Aldabra tortoises.",
    shortDescription: "Pristine beaches and unique granite boulders",
    bestTime: "April to May, October to November",
    whySpecial:
      "Some of the world's most beautiful beaches with unique granite boulder formations and pristine white sand.",
    thingsToDo: [
      "Anse Source d'Argent beach",
      "Vallee de Mai nature reserve",
      "Aldabra Atoll",
      "Snorkeling and diving",
      "Island hopping",
    ],
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4085959.234567890!2d55.5!3d-4.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x22786950e5e5b5b5%3A0x1a3b3b3b3b3b3b3b!2sSeychelles!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$200-500/day",
    safety: "Very safe. Follow marine park rules.",
    tips: [
      "Rent a car for flexibility",
      "Book accommodations early",
      "Try Creole cuisine",
      "Visit multiple islands",
    ],
    rating: 4.8,
    isFeatured: true,
  },
  // Mountains
  {
    name: "Swiss Alps",
    country: "Switzerland",
    category: "Mountains",
    description:
      "The Swiss Alps are the portion of the Alps mountain range that lies within Switzerland. They constitute a major natural feature of the country and are central to Swiss history and identity.",
    shortDescription: "Majestic peaks and pristine alpine beauty",
    bestTime: "June to September (summer), December to March (skiing)",
    whySpecial:
      "Home to the Matterhorn and some of the world's most spectacular mountain scenery.",
    thingsToDo: [
      "Jungfraujoch visit",
      "Zermatt and Matterhorn",
      "Glacier Express train",
      "Skiing in Verbier",
      "Hiking in Lauterbrunnen",
    ],
    images: [
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2819641.234567890!2d8.0!3d46.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c64ef6f596d61%3A0x5c56b5110fcb7b15!2sSwiss%20Alps!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$200-400/day",
    safety: "Very safe. Follow mountain safety guidelines.",
    tips: [
      "Get Swiss Travel Pass",
      "Book mountain excursions early",
      "Layer clothing",
      "Try fondue",
    ],
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: "Mount Everest Base Camp",
    country: "Nepal",
    category: "Mountains",
    description:
      "Mount Everest Base Camp is the starting point for climbers attempting to summit Mount Everest. The trek to base camp is one of the world's most famous and challenging hikes.",
    shortDescription: "Trek to the base of the world's highest mountain",
    bestTime: "March to May, September to November",
    whySpecial:
      "Experience the journey to the base of the world's highest peak, surrounded by the majestic Himalayas.",
    thingsToDo: [
      "Trek to Base Camp",
      "Visit Tengboche Monastery",
      "See Khumbu Icefall",
      "Acclimatization hikes",
      "Experience Sherpa culture",
    ],
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2819641.234567890!2d86.9250!3d28.0026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e85464c6b8f8e5%3A0x4c56b5110fcb7b15!2sMount%20Everest%20Base%20Camp!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$1500-3000 for 12-14 day trek",
    safety:
      "Altitude sickness is a serious risk. Acclimatize properly. Use experienced guides.",
    tips: [
      "Train for months beforehand",
      "Acclimatize properly",
      "Hire experienced guides",
      "Bring proper gear",
      "Get travel insurance",
    ],
    rating: 4.9,
    isFeatured: true,
  },
  // Cities
  {
    name: "Tokyo",
    country: "Japan",
    category: "Cities",
    description:
      "Tokyo is Japan's busy capital, mixing ultramodern and traditional. It's known for its temples, neon-lit skyscrapers, anime culture, and exceptional cuisine.",
    shortDescription: "Where tradition meets futuristic innovation",
    bestTime: "March to May, September to November",
    whySpecial:
      "A mesmerizing blend of ancient traditions and cutting-edge technology.",
    thingsToDo: [
      "Shibuya Crossing",
      "Senso-ji Temple",
      "Tsukiji fish market",
      "Robot Restaurant",
      "Mount Fuji day trip",
    ],
    images: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
      "https://images.unsplash.com/photo-1490806843957-31f4c9ef91d5?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d207446.234567890!2d139.6917!3d35.6762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b857628235d%3A0xcdd8aef6a7e8f8e5!2sTokyo!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$100-250/day",
    safety: "Extremely safe at all hours.",
    tips: [
      "Get a JR Pass",
      "Learn basic Japanese",
      "Try 7-Eleven food",
      "Visit teamLab",
    ],
    rating: 4.8,
    isFeatured: true,
    isTrending: true,
  },
  {
    name: "New York City",
    country: "USA",
    category: "Cities",
    description:
      "New York City comprises 5 boroughs sitting where the Hudson River meets the Atlantic Ocean. At its core is Manhattan, a densely populated borough that's among the world's major commercial, financial and cultural centers.",
    shortDescription: "The city that never sleeps",
    bestTime: "April to June, September to November",
    whySpecial:
      "The cultural capital of the world with iconic landmarks and endless entertainment.",
    thingsToDo: [
      "Statue of Liberty",
      "Central Park",
      "Times Square",
      "Broadway show",
      "Brooklyn Bridge walk",
    ],
    images: [
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.234567890!2d-74.0060!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$150-350/day",
    safety: "Generally safe. Stay aware in crowded areas.",
    tips: [
      "Walk everywhere possible",
      "Get CityPASS",
      "Try pizza and bagels",
      "Explore boroughs beyond Manhattan",
    ],
    rating: 4.7,
    isFeatured: true,
  },
  {
    name: "Dubai",
    country: "UAE",
    category: "Cities",
    description:
      "Dubai is a city of superlatives, with the world's tallest building, largest mall, and most luxurious hotels. It combines ultramodern architecture with traditional Arabian culture.",
    shortDescription: "City of superlatives and luxury",
    bestTime: "November to March",
    whySpecial:
      "A playground of architectural marvels and luxury experiences in the desert.",
    thingsToDo: [
      "Burj Khalifa",
      "Desert safari",
      "Dubai Mall",
      "Palm Jumeirah",
      "Dubai Marina cruise",
    ],
    images: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462562.234567890!2d55.2708!3d25.2048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$150-500/day",
    safety: "Extremely safe. Follow local customs.",
    tips: [
      "Dress modestly outside resorts",
      "Visit old Dubai",
      "Book Burj Khalifa in advance",
      "Try Arabic cuisine",
    ],
    rating: 4.6,
    isTrending: true,
  },
  {
    name: "London",
    country: "United Kingdom",
    category: "Cities",
    description:
      "London, the capital of England and the United Kingdom, is a 21st-century city with history stretching back to Roman times. At its centre stand the imposing Houses of Parliament, the iconic Big Ben clock tower and Westminster Abbey.",
    shortDescription: "Historic capital with royal heritage",
    bestTime: "May to September",
    whySpecial:
      "A perfect blend of historic landmarks, royal heritage, world-class museums, and modern culture.",
    thingsToDo: [
      "Big Ben and Parliament",
      "Tower of London",
      "British Museum",
      "Buckingham Palace",
      "Westminster Abbey",
    ],
    images: [
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d317718.234567890!2d-0.1276!3d51.5074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$150-300/day",
    safety: "Very safe. Watch for pickpockets in tourist areas.",
    tips: [
      "Get Oyster card",
      "Book attractions online",
      "Try fish and chips",
      "Visit free museums",
    ],
    rating: 4.7,
    isFeatured: true,
  },
  {
    name: "Barcelona",
    country: "Spain",
    category: "Cities",
    description:
      "Barcelona, the cosmopolitan capital of Spain's Catalonia region, is known for its art and architecture. The fantastical Sagrada Família church and other modernist landmarks designed by Antoni Gaudí dot the city.",
    shortDescription: "Artistic city with Gaudí architecture",
    bestTime: "May to June, September to October",
    whySpecial:
      "Unique architecture by Gaudí, vibrant culture, beautiful beaches, and world-class cuisine.",
    thingsToDo: [
      "Sagrada Família",
      "Park Güell",
      "La Rambla",
      "Gothic Quarter",
      "Beach activities",
    ],
    images: [
      "https://images.unsplash.com/photo-1539037116277-4b2087b4d5a0?w=800",
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d95777.234567890!2d2.1734!3d41.3851!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a49816718e30e5%3A0x44b0fb3d4db476fe!2sBarcelona!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$100-250/day",
    safety: "Generally safe. Beware of pickpockets.",
    tips: [
      "Book Sagrada Família in advance",
      "Try tapas",
      "Visit during festivals",
      "Use public transport",
    ],
    rating: 4.8,
    isTrending: true,
  },
  // Adventure
  {
    name: "Queenstown",
    country: "New Zealand",
    category: "Adventure",
    description:
      "Queenstown is the adventure capital of the world, set against a backdrop of dramatic mountains and crystal-clear Lake Wakatipu.",
    shortDescription: "Adventure capital of the world",
    bestTime: "December to February (summer), June to August (skiing)",
    whySpecial:
      "The ultimate destination for thrill-seekers with every adventure sport imaginable.",
    thingsToDo: [
      "Bungee jumping",
      "Skydiving",
      "Milford Sound cruise",
      "Skiing at Remarkables",
      "Jet boating",
    ],
    images: [
      "https://images.unsplash.com/photo-1589871973318-9ca1258faa5d?w=800",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2819641.234567890!2d168.6626!3d-45.0312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa9d51df1d7a8e5fd%3A0x500ef868479a1f00!2sQueenstown!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$150-300/day",
    safety: "Very safe. All activities are well-regulated.",
    tips: [
      "Book activities in advance",
      "Rent a car for flexibility",
      "Try fergburger",
      "Visit Glenorchy",
    ],
    rating: 4.8,
    isFeatured: true,
  },
  {
    name: "Iceland",
    country: "Iceland",
    category: "Nature",
    description:
      "Iceland is a Nordic island nation defined by its dramatic landscape with volcanoes, geysers, hot springs and lava fields. It's one of the best places to see the Northern Lights.",
    shortDescription: "Land of fire, ice, and Northern Lights",
    bestTime:
      "June to August (midnight sun), September to March (Northern Lights)",
    whySpecial:
      "Otherworldly landscapes unlike anywhere else on Earth, from glaciers to geothermal wonders.",
    thingsToDo: [
      "Golden Circle",
      "Blue Lagoon",
      "Northern Lights",
      "Glacier hiking",
      "Whale watching",
    ],
    images: [
      "https://images.unsplash.com/photo-1520769669658-f07657a87fae?w=800",
      "https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2819641.234567890!2d-19.0!3d64.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48d674b9eced61c7%3A0x1f7b7b7b7b7b7b7b!2sIceland!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$200-400/day",
    safety: "Very safe. Weather can change rapidly.",
    tips: [
      "Rent a 4x4 for flexibility",
      "Layer clothing",
      "Book in advance in summer",
      "Try hot dogs and skyr",
    ],
    rating: 4.9,
    isFeatured: true,
    isTrending: true,
  },
  {
    name: "Patagonia",
    country: "Argentina/Chile",
    category: "Nature",
    description:
      "Patagonia is a sparsely populated region at the southern end of South America, shared by Argentina and Chile. It's known for dramatic scenery including the Andes mountains, glaciers, and grasslands.",
    shortDescription: "End of the world wilderness",
    bestTime: "October to April",
    whySpecial:
      "Raw, untamed wilderness at the end of the world with stunning glaciers and peaks.",
    thingsToDo: [
      "Torres del Paine",
      "Perito Moreno Glacier",
      "Fitz Roy trek",
      "Puerto Natales",
      "Tierra del Fuego",
    ],
    images: [
      "https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2819641.234567890!2d-73.0!3d-50.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xbdca6e5e8b8b8b8b%3A0x1f7b7b7b7b7b7b7b!2sPatagonia!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$100-250/day",
    safety: "Very safe. Prepare for extreme weather.",
    tips: [
      "Book refugios early",
      "Bring all weather gear",
      "Rent car in Argentina",
      "Start from El Calafate",
    ],
    rating: 4.9,
    isFeatured: true,
  },
  // Indian Places
  {
    name: "Jaipur",
    country: "India",
    category: "Indian Places",
    description:
      "Jaipur, the Pink City, is the capital of Rajasthan. It's known for its stunning palaces, vibrant bazaars, and rich cultural heritage.",
    shortDescription: "The magnificent Pink City of India",
    bestTime: "October to March",
    whySpecial:
      "A UNESCO World Heritage city showcasing Rajputana grandeur and colorful culture.",
    thingsToDo: [
      "Amber Fort",
      "Hawa Mahal",
      "City Palace",
      "Jantar Mantar",
      "Shopping in bazaars",
    ],
    images: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.234567890!2d75.7873!3d26.9124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09d!2sJaipur!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$30-80/day",
    safety: "Safe for tourists. Use registered guides.",
    tips: [
      "Bargain in markets",
      "Hire a guide for forts",
      "Try local thalis",
      "Visit early morning",
    ],
    rating: 4.6,
    isTrending: true,
  },
  {
    name: "Kerala Backwaters",
    country: "India",
    category: "Indian Places",
    description:
      "Kerala's backwaters are a network of brackish lagoons and lakes lying parallel to the Arabian Sea coast. It's best experienced on a traditional houseboat.",
    shortDescription: "Serene waterways and lush green paradise",
    bestTime: "September to March",
    whySpecial:
      "Unique houseboat experience through palm-fringed canals in God's Own Country.",
    thingsToDo: [
      "Houseboat cruise",
      "Ayurvedic spa",
      "Tea plantations of Munnar",
      "Kathakali performance",
      "Periyar Wildlife Sanctuary",
    ],
    images: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4016734.234567890!2d76.2!3d10.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0812ffd49cf55b%3A0x64bd90fbed387c99!2sKerala!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$40-100/day",
    safety: "Very safe. Respect local customs.",
    tips: [
      "Book houseboats in advance",
      "Try Kerala cuisine",
      "Visit during Onam festival",
      "Combine with Munnar",
    ],
    rating: 4.8,
    isFeatured: true,
  },
  {
    name: "Varanasi",
    country: "India",
    category: "Indian Places",
    description:
      "Varanasi, also known as Benares, is one of the world's oldest living cities. Situated on the banks of the Ganges, it's the spiritual capital of India.",
    shortDescription: "The eternal spiritual heart of India",
    bestTime: "October to March",
    whySpecial:
      "One of the oldest inhabited cities, offering profound spiritual experiences.",
    thingsToDo: [
      "Ganga Aarti ceremony",
      "Sunrise boat ride",
      "Walk the ghats",
      "Sarnath visit",
      "Silk weaving",
    ],
    images: [
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.234567890!2d83.0!3d25.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e2db76febcf4d%3A0x681b5b5b5b5b5b5b!2sVaranasi!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$25-60/day",
    safety: "Safe. Respect religious customs.",
    tips: [
      "Wake early for sunrise",
      "Dress modestly",
      "Use registered boats",
      "Try banarasi paan",
    ],
    rating: 4.7,
  },
  {
    name: "Ladakh",
    country: "India",
    category: "Indian Places",
    description:
      "Ladakh is a high-altitude desert region in the Indian Himalayas, known for its remote mountain beauty, Buddhist culture, and stunning landscapes.",
    shortDescription: "Land of high passes and Buddhist monasteries",
    bestTime: "June to September",
    whySpecial:
      "Surreal landscapes that feel like another planet, with ancient Buddhist heritage.",
    thingsToDo: [
      "Pangong Lake",
      "Nubra Valley",
      "Thiksey Monastery",
      "Khardung La pass",
      "Magnetic Hill",
    ],
    images: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2819641.234567890!2d77.6!3d34.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38fd78650e5b5b5b%3A0x1f7b7b7b7b7b7b7b!2sLadakh!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$50-120/day",
    safety: "Acclimatize to altitude. Carry permits.",
    tips: [
      "Acclimatize for 2 days in Leh",
      "Carry cash",
      "Book permits in advance",
      "Rent a bike for adventure",
    ],
    rating: 4.9,
    isFeatured: true,
    isTrending: true,
  },
  // Hidden Gems
  {
    name: "Faroe Islands",
    country: "Denmark",
    category: "Nature",
    description:
      "The Faroe Islands are a self-governing archipelago between Norway and Iceland. The islands are characterized by their steep cliffs, grass-roofed houses, and rugged landscapes.",
    shortDescription: "Dramatic cliffs and untouched Nordic beauty",
    bestTime: "May to September",
    whySpecial:
      "Remote Nordic paradise with dramatic landscapes and unique grass-roofed architecture.",
    thingsToDo: [
      "Múlafossur waterfall",
      "Saksun village",
      "Bird watching",
      "Hiking Slættaratindur",
      "Boat to Mykines",
    ],
    images: [
      "https://images.unsplash.com/photo-1578675935836-3c94d5efbba1?w=800",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2819641.234567890!2d-7.0!3d62.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48bc159bc4b5b5b5%3A0x1f7b7b7b7b7b7b7b!2sFaroe%20Islands!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$150-300/day",
    safety: "Very safe. Weather is unpredictable.",
    tips: [
      "Rent a car essential",
      "Book ferries in advance",
      "Pack waterproof gear",
      "Try fermented fish",
    ],
    rating: 4.8,
    isFeatured: true,
  },
  {
    name: "Cappadocia",
    country: "Turkey",
    category: "Adventure",
    description:
      "Cappadocia is a semi-arid region in central Turkey, known for its distinctive fairy chimneys, underground cities, and hot air balloon rides at sunrise.",
    shortDescription: "Fairytale landscape of hot air balloons",
    bestTime: "April to June, September to October",
    whySpecial:
      "Surreal landscape of fairy chimneys and the world's most magical hot air balloon experience.",
    thingsToDo: [
      "Hot air balloon ride",
      "Göreme Open Air Museum",
      "Underground cities",
      "Valley hikes",
      "Cave hotel stay",
    ],
    images: [
      "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=800",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2819641.234567890!2d34.8!3d38.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x152a23833fb8d955%3A0x1f7b7b7b7b7b7b7b!2sCappadocia!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$80-200/day",
    safety: "Very safe. Book reputable balloon companies.",
    tips: [
      "Book balloons 3+ days out",
      "Stay in cave hotel",
      "Explore on ATV",
      "Visit pottery workshops",
    ],
    rating: 4.9,
    isFeatured: true,
    isTrending: true,
  },
  // More Romantic Places
  {
    name: "Venice",
    country: "Italy",
    category: "Romance",
    description:
      "Venice is a city in northeastern Italy built on a group of 118 small islands separated by canals and linked by bridges. It's known for its romantic gondola rides.",
    shortDescription: "Floating city of canals and romance",
    bestTime: "April to June, September to October",
    whySpecial:
      "The most romantic city in the world with gondola rides through historic canals.",
    thingsToDo: [
      "Gondola ride",
      "St. Mark's Square",
      "Doge's Palace",
      "Rialto Bridge",
      "Murano glass factory",
    ],
    images: [
      "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800",
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.234567890!2d12.3155!3d45.4408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x477eb1daf1d63d89%3A0x7ba3c6f7bd345d87!2sVenice!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$150-300/day",
    safety: "Safe. Watch for pickpockets.",
    tips: [
      "Book gondola in advance",
      "Get lost in alleys",
      "Try cicchetti",
      "Visit islands",
    ],
    rating: 4.8,
    isFeatured: true,
  },
  {
    name: "Kyoto",
    country: "Japan",
    category: "Romance",
    description:
      "Kyoto is Japan's former imperial capital, known for its thousands of temples, traditional wooden houses, and beautiful gardens.",
    shortDescription: "Ancient capital of temples and cherry blossoms",
    bestTime:
      "March to May (cherry blossoms), October to November (fall colors)",
    whySpecial:
      "Timeless beauty with traditional architecture, serene temples, and seasonal beauty.",
    thingsToDo: [
      "Fushimi Inari Shrine",
      "Arashiyama Bamboo Grove",
      "Kiyomizu-dera Temple",
      "Gion district",
      "Golden Pavilion",
    ],
    images: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
      "https://images.unsplash.com/photo-1490806843957-31f4c9ef91d5?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d207446.234567890!2d135.7681!3d35.0116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6001a8d6cd3cc3f1%3A0xc0961d44b6c78372!2sKyoto!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$100-200/day",
    safety: "Extremely safe.",
    tips: [
      "Visit early morning",
      "Try kaiseki dining",
      "Rent kimono",
      "Use JR Pass",
    ],
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: "Amalfi Coast",
    country: "Italy",
    category: "Romance",
    description:
      "The Amalfi Coast is a 50-kilometer stretch of coastline along the southern edge of Italy's Sorrentine Peninsula, known for its dramatic cliffs and colorful fishing villages.",
    shortDescription: "Dramatic coastline with colorful cliffside villages",
    bestTime: "May to September",
    whySpecial:
      "One of the world's most beautiful coastlines with stunning views and romantic atmosphere.",
    thingsToDo: [
      "Positano visit",
      "Amalfi town",
      "Ravello gardens",
      "Path of the Gods hike",
      "Boat tour",
    ],
    images: [
      "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800",
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.234567890!2d14.6!3d40.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133b9f4d8f5a8b8b%3A0x1f7b7b7b7b7b7b7b!2sAmalfi%20Coast!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$200-400/day",
    safety: "Very safe.",
    tips: [
      "Rent a car or use buses",
      "Book hotels early",
      "Try limoncello",
      "Visit Capri",
    ],
    rating: 4.9,
    isFeatured: true,
  },
  // More Beaches
  {
    name: "Mauritius",
    country: "Mauritius",
    category: "Beaches",
    description:
      "Mauritius is an island nation in the Indian Ocean, known for its beaches, lagoons and reefs. The mountainous interior includes Black River Gorges National Park.",
    shortDescription: "Tropical paradise with diverse culture",
    bestTime: "May to December",
    whySpecial:
      "Stunning beaches, diverse culture, and excellent water sports.",
    thingsToDo: [
      "Seven Colored Earths",
      "Chamarel Waterfall",
      "Underwater waterfall view",
      "Dolphin watching",
      "Casela Nature Park",
    ],
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4085959.234567890!2d57.5!3d-20.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x217c50449e6e5c5b%3A0x1f7b7b7b7b7b7b7b!2sMauritius!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$150-350/day",
    safety: "Very safe.",
    tips: [
      "Rent a car",
      "Try local street food",
      "Visit botanical gardens",
      "Book water activities",
    ],
    rating: 4.7,
  },
  {
    name: "Phuket",
    country: "Thailand",
    category: "Beaches",
    description:
      "Phuket is Thailand's largest island, known for its beaches, nightlife, and water sports. It's a gateway to the Phi Phi Islands.",
    shortDescription: "Tropical island with vibrant nightlife",
    bestTime: "November to April",
    whySpecial: "Beautiful beaches, excellent diving, and vibrant culture.",
    thingsToDo: [
      "Phi Phi Islands tour",
      "Big Buddha",
      "Old Phuket Town",
      "Snorkeling",
      "Night markets",
    ],
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.234567890!2d98.3!3d7.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30503ae4b2c7b5b5%3A0x1f7b7b7b7b7b7b7b!2sPhuket!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$50-150/day",
    safety: "Very safe. Use registered tour operators.",
    tips: [
      "Book island tours",
      "Try Thai massage",
      "Visit during Songkran",
      "Bargain in markets",
    ],
    rating: 4.6,
    isTrending: true,
  },
  // More Cities
  {
    name: "Paris",
    country: "France",
    category: "Cities",
    description:
      "Paris, France's capital, is a major European city and a global center for art, fashion, gastronomy and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine.",
    shortDescription: "City of Light and romance",
    bestTime: "April to June, September to October",
    whySpecial:
      "The world's most romantic city with iconic landmarks and world-class culture.",
    thingsToDo: [
      "Eiffel Tower",
      "Louvre Museum",
      "Notre-Dame",
      "Champs-Élysées",
      "Montmartre",
    ],
    images: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.234567890!2d2.3522!3d48.8566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1f06e2b70f%3A0x40b82c3688c9460!2sParis!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$150-300/day",
    safety: "Generally safe. Watch for pickpockets.",
    tips: [
      "Get museum pass",
      "Walk along Seine",
      "Try patisseries",
      "Visit during spring",
    ],
    rating: 4.8,
    isFeatured: true,
  },
  {
    name: "Singapore",
    country: "Singapore",
    category: "Cities",
    description:
      "Singapore is a global financial center with a tropical climate and multicultural population. Its colonial core centers on the Padang, a cricket field since the 1830s.",
    shortDescription: "Modern city-state with diverse culture",
    bestTime: "Year-round (avoid monsoon Nov-Jan)",
    whySpecial:
      "A perfect blend of cultures, world-class food, and futuristic architecture.",
    thingsToDo: [
      "Marina Bay Sands",
      "Gardens by the Bay",
      "Sentosa Island",
      "Chinatown",
      "Little India",
    ],
    images: [
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800",
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63836.234567890!2d103.8198!3d1.3521!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da11238a8b9375%3A0x887869cf52abf5c4!2sSingapore!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$100-250/day",
    safety: "Extremely safe.",
    tips: [
      "Try hawker centers",
      "Use MRT",
      "Visit during festivals",
      "Try chili crab",
    ],
    rating: 4.7,
    isTrending: true,
  },
  {
    name: "Sydney",
    country: "Australia",
    category: "Cities",
    description:
      "Sydney is Australia's most populous city, known for its harborfront Sydney Opera House, with a distinctive sail-like design. Massive Darling Harbour and the smaller Circular Quay port are hubs of waterside life.",
    shortDescription: "Harbor city with iconic Opera House",
    bestTime: "September to November, March to May",
    whySpecial:
      "Stunning harbor setting with iconic architecture and beautiful beaches.",
    thingsToDo: [
      "Sydney Opera House",
      "Harbour Bridge climb",
      "Bondi Beach",
      "Royal Botanic Gardens",
      "Blue Mountains day trip",
    ],
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d424146.234567890!2d151.2!3d-33.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b129838f39a743f%3A0x3017d681632aac0!2sSydney!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$150-300/day",
    safety: "Very safe.",
    tips: [
      "Get Opal card",
      "Visit during Vivid Sydney",
      "Try seafood",
      "Take ferry rides",
    ],
    rating: 4.7,
    isFeatured: true,
  },
  // More Mountains
  {
    name: "Banff National Park",
    country: "Canada",
    category: "Mountains",
    description:
      "Banff National Park is Canada's oldest national park, set in Alberta's Rocky Mountains, with numerous glaciers and ice fields, dense coniferous forest, and alpine landscapes.",
    shortDescription: "Canadian Rockies paradise",
    bestTime: "June to September",
    whySpecial:
      "Stunning mountain scenery with pristine lakes and world-class hiking.",
    thingsToDo: [
      "Lake Louise",
      "Moraine Lake",
      "Icefields Parkway",
      "Sulphur Mountain",
      "Johnston Canyon",
    ],
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2819641.234567890!2d-115.6!3d51.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5370ca45910c4afd%3A0xcaafaebcac9d4c03!2sBanff%20National%20Park!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$150-300/day",
    safety: "Very safe. Watch for wildlife.",
    tips: [
      "Book hotels early",
      "Get park pass",
      "Visit early morning",
      "Bring bear spray",
    ],
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: "Yosemite National Park",
    country: "USA",
    category: "Mountains",
    description:
      "Yosemite National Park is in California's Sierra Nevada mountains. It's famed for its giant, ancient sequoia trees, and for Tunnel View, the iconic vista of towering Bridalveil Fall and the granite cliffs of El Capitan and Half Dome.",
    shortDescription: "Iconic granite cliffs and giant sequoias",
    bestTime: "May to September",
    whySpecial:
      "Iconic granite formations and some of the world's most famous rock climbing.",
    thingsToDo: [
      "Half Dome hike",
      "El Capitan",
      "Yosemite Falls",
      "Glacier Point",
      "Mariposa Grove",
    ],
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2819641.234567890!2d-119.5!3d37.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8096f09df58aecc5%3A0x1f7b7b7b7b7b7b7b!2sYosemite%20National%20Park!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$100-200/day",
    safety: "Very safe. Follow park rules.",
    tips: [
      "Reserve campsites early",
      "Arrive early",
      "Bring bear canisters",
      "Check road conditions",
    ],
    rating: 4.9,
    isFeatured: true,
  },
  // More Adventure
  {
    name: "Interlaken",
    country: "Switzerland",
    category: "Adventure",
    description:
      "Interlaken is a traditional resort town in the mountainous Bernese Oberland region of central Switzerland. Built on a narrow stretch of valley, between the emerald-colored waters of Lake Thun and Lake Brienz.",
    shortDescription: "Adventure hub between two lakes",
    bestTime: "June to September",
    whySpecial:
      "Adventure capital of Switzerland with every extreme sport available.",
    thingsToDo: [
      "Paragliding",
      "Skydiving",
      "Canyoning",
      "Jungfraujoch",
      "Harder Kulm",
    ],
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2819641.234567890!2d7.9!3d46.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c64ef6f596d61%3A0x5c56b5110fcb7b15!2sInterlaken!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$150-350/day",
    safety: "Very safe. All activities regulated.",
    tips: [
      "Book activities in advance",
      "Get Swiss Travel Pass",
      "Try local cheese",
      "Visit nearby towns",
    ],
    rating: 4.8,
  },
  // More Indian Places
  {
    name: "Goa",
    country: "India",
    category: "Beaches",
    description:
      "Goa is a state in western India with coastlines stretching along the Arabian Sea. Its long history as a Portuguese colony prior to 1961 is evident in its preserved 17th-century churches and the area's tropical spice plantations.",
    shortDescription: "Beach paradise with Portuguese heritage",
    bestTime: "November to February",
    whySpecial:
      "India's party capital with beautiful beaches and unique Portuguese-Indian culture.",
    thingsToDo: [
      "Beach hopping",
      "Old Goa churches",
      "Spice plantations",
      "Water sports",
      "Nightlife",
    ],
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4016734.234567890!2d73.8!3d15.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfba1063b5f3e7%3A0x1f7b7b7b7b7b7b7b!2sGoa!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$30-100/day",
    safety: "Very safe. Use registered taxis.",
    tips: [
      "Rent a scooter",
      "Try seafood",
      "Visit during Christmas",
      "Explore both North and South",
    ],
    rating: 4.6,
    isTrending: true,
  },
  {
    name: "Taj Mahal",
    country: "India",
    category: "Historical",
    description:
      "The Taj Mahal is an ivory-white marble mausoleum on the right bank of the Yamuna river in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favorite wife, Mumtaz Mahal.",
    shortDescription: "Monument of eternal love",
    bestTime: "October to March",
    whySpecial:
      "One of the New Seven Wonders of the World and a symbol of eternal love.",
    thingsToDo: [
      "Taj Mahal visit",
      "Agra Fort",
      "Fatehpur Sikri",
      "Itmad-ud-Daulah",
      "Mehtab Bagh",
    ],
    images: [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.234567890!2d78.0!3d27.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39747121d702ff6d%3A0xdd2ae4803f767dde!2sTaj%20Mahal!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$40-80/day",
    safety: "Safe. Use registered guides.",
    tips: [
      "Visit at sunrise",
      "Book tickets online",
      "Hire a guide",
      "Combine with Delhi",
    ],
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: "Rishikesh",
    country: "India",
    category: "Adventure",
    description:
      "Rishikesh is a city in India's northern state of Uttarakhand, in the Himalayan foothills beside the Ganges River. It's known as a center for studying yoga and meditation.",
    shortDescription: "Yoga capital and adventure hub",
    bestTime: "March to April, September to November",
    whySpecial: "World's yoga capital and adventure sports hub on the Ganges.",
    thingsToDo: [
      "White water rafting",
      "Yoga and meditation",
      "Lakshman Jhula",
      "Beatles Ashram",
      "Bungee jumping",
    ],
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.234567890!2d78.3!3d30.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3909e6b5b5b5b5b5%3A0x1f7b7b7b7b7b7b7b!2sRishikesh!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$30-80/day",
    safety: "Safe. Use registered operators.",
    tips: [
      "Book rafting in advance",
      "Try yoga retreats",
      "Visit during Ganga Aarti",
      "Stay in ashrams",
    ],
    rating: 4.7,
  },
  // More Nature
  {
    name: "Norwegian Fjords",
    country: "Norway",
    category: "Nature",
    description:
      "Norway's fjords are deep, narrow inlets of the sea between high cliffs, created by glacial erosion. They offer some of the world's most spectacular scenery.",
    shortDescription: "Dramatic fjords and Northern Lights",
    bestTime: "May to September (fjords), September to March (Northern Lights)",
    whySpecial:
      "Some of the world's most dramatic and beautiful fjord landscapes.",
    thingsToDo: [
      "Geirangerfjord cruise",
      "Northern Lights",
      "Trolltunga hike",
      "Bergen visit",
      "Flam Railway",
    ],
    images: [
      "https://images.unsplash.com/photo-1520769669658-f07657a87fae?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2819641.234567890!2d7.0!3d62.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x461268458f4de5bf%3A0xa1b03b9db864d02b!2sNorwegian%20Fjords!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$200-400/day",
    safety: "Very safe.",
    tips: [
      "Rent a car",
      "Book cruises early",
      "Pack for all weather",
      "Try local salmon",
    ],
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: "Galapagos Islands",
    country: "Ecuador",
    category: "Nature",
    description:
      "The Galápagos Islands are a volcanic archipelago in the Pacific Ocean. They're considered one of the world's foremost destinations for wildlife-viewing.",
    shortDescription: "Unique wildlife and volcanic islands",
    bestTime: "December to May",
    whySpecial:
      "Unique wildlife found nowhere else, where animals have no fear of humans.",
    thingsToDo: [
      "Giant tortoises",
      "Marine iguana watching",
      "Snorkeling with sea lions",
      "Blue-footed boobies",
      "Island hopping",
    ],
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2819641.234567890!2d-90.0!3d-0.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9a4b7b7b7b7b7b7b%3A0x1f7b7b7b7b7b7b7b!2sGalapagos%20Islands!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$200-500/day",
    safety: "Very safe. Follow park rules strictly.",
    tips: [
      "Book cruises early",
      "Bring underwater camera",
      "Respect wildlife distance",
      "Get travel insurance",
    ],
    rating: 4.9,
    isFeatured: true,
  },
  // Additional places to reach 100+
  {
    name: "Santorini",
    country: "Greece",
    category: "Romance",
    description:
      "Santorini is one of the Cyclades islands in the southern Aegean Sea. It's famous for its dramatic views, stunning sunsets, white-washed buildings, and beautiful beaches.",
    shortDescription: "Iconic Greek island with blue domes",
    bestTime: "May to October",
    whySpecial:
      "The most photographed Greek island with iconic sunsets and unique architecture.",
    thingsToDo: [
      "Oia sunset",
      "Red Beach",
      "Wine tasting",
      "Ancient Akrotiri",
      "Fira town",
    ],
    images: [
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2819641.234567890!2d25.4!3d36.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1499cdce05e3bce9%3A0x9f4e192b8b8b8b8b!2sSantorini!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$150-400/day",
    safety: "Very safe.",
    tips: [
      "Book hotels early",
      "Rent ATV",
      "Try local wine",
      "Visit during shoulder season",
    ],
    rating: 4.8,
    isFeatured: true,
    isTrending: true,
  },
  {
    name: "Petra",
    country: "Jordan",
    category: "Historical",
    description:
      "Petra is a famous archaeological site in Jordan's southwestern desert. Dating to around 300 B.C., it was the capital of the Nabatean Kingdom. Accessed via a narrow canyon called Al Siq, it contains tombs and temples carved into pink sandstone cliffs.",
    shortDescription: "Rose-red city carved in stone",
    bestTime: "March to May, September to November",
    whySpecial:
      "One of the New Seven Wonders, an ancient city carved entirely from rock.",
    thingsToDo: [
      "Treasury (Al-Khazneh)",
      "Monastery (Ad-Deir)",
      "Royal Tombs",
      "High Place of Sacrifice",
      "Petra by Night",
    ],
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2819641.234567890!2d35.4!3d30.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x150134231634b5d7%3A0x1f7b7b7b7b7b7b7b!2sPetra!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$100-200/day",
    safety: "Very safe.",
    tips: [
      "Arrive early",
      "Wear comfortable shoes",
      "Hire a guide",
      "Stay for Petra by Night",
    ],
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: "Angkor Wat",
    country: "Cambodia",
    category: "Historical",
    description:
      "Angkor Wat is a temple complex in Cambodia and the largest religious monument in the world. It was originally constructed as a Hindu temple dedicated to the god Vishnu for the Khmer Empire.",
    shortDescription: "Largest religious monument in the world",
    bestTime: "November to March",
    whySpecial:
      "The world's largest religious monument and a masterpiece of Khmer architecture.",
    thingsToDo: [
      "Angkor Wat sunrise",
      "Bayon Temple",
      "Ta Prohm",
      "Angkor Thom",
      "Banteay Srei",
    ],
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.234567890!2d103.9!3d13.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3110168aea9a272d%3A0x1f7b7b7b7b7b7b7b!2sAngkor%20Wat!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$30-80/day",
    safety: "Very safe.",
    tips: [
      "Buy 3-day pass",
      "Visit at sunrise",
      "Hire a tuk-tuk driver",
      "Try local food",
    ],
    rating: 4.9,
    isFeatured: true,
  },
  {
    name: "Dubrovnik",
    country: "Croatia",
    category: "Cities",
    description:
      "Dubrovnik is a city on the Adriatic Sea in southern Croatia. It's known for its distinctive Old Town, encircled with massive stone walls completed in the 16th century.",
    shortDescription: "Pearl of the Adriatic",
    bestTime: "May to June, September",
    whySpecial:
      "A stunning walled city on the Adriatic, featured in Game of Thrones.",
    thingsToDo: [
      "Walk the city walls",
      "Old Town exploration",
      "Lokrum Island",
      "Cable car to Mount Srd",
      "Beach at Banje",
    ],
    images: [
      "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800",
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.234567890!2d18.1!3d42.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x134c8c08a8647d9d%3A0x1f7b7b7b7b7b7b7b!2sDubrovnik!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$80-200/day",
    safety: "Very safe.",
    tips: [
      "Walk walls early morning",
      "Try seafood",
      "Visit Lokrum",
      "Book restaurants",
    ],
    rating: 4.8,
    isTrending: true,
  },
  {
    name: "Cinque Terre",
    country: "Italy",
    category: "Romance",
    description:
      "Cinque Terre is a string of centuries-old seaside villages on the rugged Italian Riviera coastline. In each of the 5 towns, colorful houses and vineyards cling to steep terraces.",
    shortDescription: "Five colorful cliffside villages",
    bestTime: "May to September",
    whySpecial:
      "Five stunningly beautiful villages perched on cliffs above the Mediterranean.",
    thingsToDo: [
      "Hike between villages",
      "Vernazza harbor",
      "Manarola sunset",
      "Monterosso beach",
      "Local wine tasting",
    ],
    images: [
      "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800",
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.234567890!2d9.7!3d44.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12d4fe82448dd203%3A0x1f7b7b7b7b7b7b7b!2sCinque%20Terre!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$100-250/day",
    safety: "Very safe.",
    tips: [
      "Get Cinque Terre card",
      "Wear good shoes",
      "Try pesto",
      "Book hotels early",
    ],
    rating: 4.8,
    isFeatured: true,
  },
  {
    name: "Maui",
    country: "USA",
    category: "Beaches",
    description:
      "Maui is an island in the Central Pacific, part of the Hawaiian archipelago. Sprawling Haleakala National Park encompasses the island's highest peak, volcanic Haleakala, as well as the pools and waterfalls of Ohe'o Gulch.",
    shortDescription: "Hawaiian island paradise",
    bestTime: "April to May, September to November",
    whySpecial:
      "The most beautiful Hawaiian island with diverse landscapes and world-class beaches.",
    thingsToDo: [
      "Road to Hana",
      "Haleakala sunrise",
      "Snorkeling at Molokini",
      "Lahaina town",
      "Beach hopping",
    ],
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2819641.234567890!2d-156.3!3d20.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x79552c78b4b5b5b5%3A0x1f7b7b7b7b7b7b7b!2sMaui!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$150-400/day",
    safety: "Very safe.",
    tips: [
      "Rent a car",
      "Start Road to Hana early",
      "Book Haleakala sunrise",
      "Try local poke",
    ],
    rating: 4.8,
    isFeatured: true,
  },
  {
    name: "Zanzibar",
    country: "Tanzania",
    category: "Beaches",
    description:
      "Zanzibar is a semi-autonomous region of Tanzania. It's composed of the Zanzibar Archipelago in the Indian Ocean, 25–50 kilometers off the coast of the mainland.",
    shortDescription: "Spice island with pristine beaches",
    bestTime: "June to October",
    whySpecial:
      "Exotic spice island with stunning beaches and rich Swahili culture.",
    thingsToDo: [
      "Stone Town",
      "Spice tour",
      "Prison Island",
      "Jozani Forest",
      "Beach relaxation",
    ],
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4085959.234567890!2d39.2!3d-6.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4bae169bd6f1%3A0x1f7b7b7b7b7b7b7b!2sZanzibar!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$80-200/day",
    safety: "Very safe.",
    tips: [
      "Combine with safari",
      "Try local food",
      "Visit Stone Town",
      "Book beach resorts",
    ],
    rating: 4.7,
  },
  {
    name: "Banff",
    country: "Canada",
    category: "Mountains",
    description:
      "Banff is a resort town in the province of Alberta, located within Banff National Park. The peaks of Mt. Rundle and Mt. Cascade, part of the Rocky Mountains, dominate its skyline.",
    shortDescription: "Mountain resort in Canadian Rockies",
    bestTime: "June to September",
    whySpecial:
      "Stunning mountain town surrounded by some of Canada's most beautiful scenery.",
    thingsToDo: [
      "Sulphur Mountain gondola",
      "Banff Upper Hot Springs",
      "Bow Falls",
      "Cascade Gardens",
      "Nearby Lake Louise",
    ],
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2819641.234567890!2d-115.6!3d51.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5370ca45910c4afd%3A0xcaafaebcac9d4c03!2sBanff!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$150-300/day",
    safety: "Very safe.",
    tips: [
      "Book hotels early",
      "Get park pass",
      "Visit hot springs",
      "Try local restaurants",
    ],
    rating: 4.8,
  },
  {
    name: "Salar de Uyuni",
    country: "Bolivia",
    category: "Nature",
    description:
      "Salar de Uyuni is the world's largest salt flat, at 10,582 square kilometers. It's in southwest Bolivia, in the Andes mountains, at 3,656 meters above sea level.",
    shortDescription: "World's largest salt flat",
    bestTime: "May to November",
    whySpecial:
      "The world's largest salt flat creates surreal mirror effects during the rainy season.",
    thingsToDo: [
      "Salt flat tour",
      "Isla Incahuasi",
      "Train cemetery",
      "Colchani salt factory",
      "Stargazing",
    ],
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2819641.234567890!2d-67.5!3d-20.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915584e4c5b5b5b5%3A0x1f7b7b7b7b7b7b7b!2sSalar%20de%20Uyuni!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$50-150/day",
    safety: "Safe. Acclimatize to altitude.",
    tips: [
      "Acclimatize in La Paz",
      "Book tours in advance",
      "Bring sunglasses",
      "Visit during dry season",
    ],
    rating: 4.8,
    isFeatured: true,
  },
  {
    name: "Victoria Falls",
    country: "Zambia/Zimbabwe",
    category: "Nature",
    description:
      'Victoria Falls is a waterfall on the Zambezi River at the border between Zambia and Zimbabwe. It\'s known locally as Mosi-oa-Tunya, or "The Smoke That Thunders".',
    shortDescription: "The smoke that thunders",
    bestTime: "February to May",
    whySpecial:
      "One of the world's largest waterfalls, creating a spectacular natural wonder.",
    thingsToDo: [
      "Devil's Pool",
      "Helicopter flight",
      "White water rafting",
      "Bungee jumping",
      "Zambezi sunset cruise",
    ],
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2819641.234567890!2d25.8!3d-17.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x194ff8b5b5b5b5b5%3A0x1f7b7b7b7b7b7b7b!2sVictoria%20Falls!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$100-250/day",
    safety: "Very safe.",
    tips: [
      "Visit from both sides",
      "Book activities early",
      "Bring raincoat",
      "Combine with safari",
    ],
    rating: 4.8,
    isFeatured: true,
  },
  {
    name: "Halong Bay",
    country: "Vietnam",
    category: "Nature",
    description:
      "Halong Bay is a UNESCO World Heritage site in Quang Ninh Province, in northeast Vietnam. The bay features thousands of limestone karsts and isles in various shapes and sizes.",
    shortDescription: "Thousands of limestone islands",
    bestTime: "March to May, September to November",
    whySpecial:
      "A stunning seascape of thousands of limestone karsts rising from emerald waters.",
    thingsToDo: [
      "Overnight cruise",
      "Kayaking",
      "Sung Sot Cave",
      "Ti Top Island",
      "Fishing village visit",
    ],
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.234567890!2d107.0!3d20.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a5845b5b5b5b5%3A0x1f7b7b7b7b7b7b7b!2sHalong%20Bay!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$80-200/day",
    safety: "Very safe.",
    tips: [
      "Book cruise in advance",
      "Choose 2-night cruise",
      "Bring camera",
      "Try local seafood",
    ],
    rating: 4.7,
    isTrending: true,
  },
  {
    name: "Marrakech",
    country: "Morocco",
    category: "Cities",
    description:
      "Marrakech is a major city of the Kingdom of Morocco. It's the fourth largest city in the country, after Casablanca, Fes and Tangier. It's the capital of the mid-southwestern region of Marrakesh-Safi.",
    shortDescription: "Red city with vibrant souks",
    bestTime: "March to May, September to November",
    whySpecial:
      "A vibrant city of souks, palaces, and gardens with a unique blend of cultures.",
    thingsToDo: [
      "Jemaa el-Fnaa square",
      "Bahia Palace",
      "Majorelle Garden",
      "Souk shopping",
      "Atlas Mountains day trip",
    ],
    images: [
      "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800",
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.234567890!2d-8.0!3d31.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafee8d9240e1fd%3A0x1f7b7b7b7b7b7b7b!2sMarrakech!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$50-150/day",
    safety: "Generally safe. Bargain in souks.",
    tips: [
      "Bargain in souks",
      "Try tagine",
      "Visit during festivals",
      "Stay in riad",
    ],
    rating: 4.6,
  },
  {
    name: "Rio de Janeiro",
    country: "Brazil",
    category: "Cities",
    description:
      "Rio de Janeiro is a huge seaside city in Brazil, famed for its Copacabana and Ipanema beaches, 38m Christ the Redeemer statue atop Mount Corcovado and for Sugarloaf Mountain.",
    shortDescription: "Cidade Maravilhosa with iconic beaches",
    bestTime: "December to March",
    whySpecial:
      "A vibrant city with stunning beaches, iconic landmarks, and infectious energy.",
    thingsToDo: [
      "Christ the Redeemer",
      "Sugarloaf Mountain",
      "Copacabana Beach",
      "Ipanema Beach",
      "Lapa Steps",
    ],
    images: [
      "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800",
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.234567890!2d-43.2!3d-22.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997f58a6a00a9d%3A0x3f251d85272f76f7!2sRio%20de%20Janeiro!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$80-200/day",
    safety: "Be cautious. Stay in safe areas.",
    tips: [
      "Use Uber",
      "Visit during Carnival",
      "Try feijoada",
      "Stay in Zona Sul",
    ],
    rating: 4.6,
  },
  {
    name: "Amsterdam",
    country: "Netherlands",
    category: "Cities",
    description:
      "Amsterdam is the Netherlands' capital, known for its artistic heritage, elaborate canal system and narrow houses with gabled facades, legacies of the city's 17th-century Golden Age.",
    shortDescription: "City of canals and museums",
    bestTime: "April to May, September",
    whySpecial:
      "A beautiful canal city with world-class museums and a unique culture.",
    thingsToDo: [
      "Anne Frank House",
      "Van Gogh Museum",
      "Canal cruise",
      "Rijksmuseum",
      "Jordaan district",
    ],
    images: [
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.234567890!2d4.9!3d52.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c63fb5949a7755%3A0x1f7b7b7b7b7b7b7b!2sAmsterdam!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$120-250/day",
    safety: "Very safe.",
    tips: [
      "Book museums early",
      "Rent a bike",
      "Try stroopwafels",
      "Visit during tulip season",
    ],
    rating: 4.7,
    isTrending: true,
  },
  {
    name: "Prague",
    country: "Czech Republic",
    category: "Cities",
    description:
      'Prague, capital city of the Czech Republic, is bisected by the Vltava River. Nicknamed "the City of a Hundred Spires," it\'s known for its Old Town Square, the heart of its historic core.',
    shortDescription: "City of a hundred spires",
    bestTime: "May to September",
    whySpecial:
      "A fairy-tale city with stunning architecture and rich history.",
    thingsToDo: [
      "Prague Castle",
      "Charles Bridge",
      "Old Town Square",
      "Astronomical Clock",
      "Beer tasting",
    ],
    images: [
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.234567890!2d14.4!3d50.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470b939c0970798b%3A0x1f7b7b7b7b7b7b7b!2sPrague!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$60-150/day",
    safety: "Very safe.",
    tips: [
      "Try local beer",
      "Walk everywhere",
      "Visit castle early",
      "Try trdelník",
    ],
    rating: 4.7,
  },
  {
    name: "Seoul",
    country: "South Korea",
    category: "Cities",
    description:
      "Seoul, the capital of South Korea, is a huge metropolis where modern skyscrapers, high-tech subways and pop culture meet Buddhist temples, palaces and street markets.",
    shortDescription: "Dynamic city of K-pop and tradition",
    bestTime: "March to May, September to November",
    whySpecial:
      "A fascinating blend of ancient traditions and cutting-edge modernity.",
    thingsToDo: [
      "Gyeongbokgung Palace",
      "N Seoul Tower",
      "Myeongdong shopping",
      "Bukchon Hanok Village",
      "DMZ tour",
    ],
    images: [
      "https://images.unsplash.com/photo-1490806843957-31f4c9ef91d5?w=800",
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d207446.234567890!2d127.0!3d37.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca2012d5c39cf%3A0x7e0b9efce29308a7!2sSeoul!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$80-200/day",
    safety: "Extremely safe.",
    tips: [
      "Try Korean BBQ",
      "Use T-money card",
      "Visit palaces",
      "Try street food",
    ],
    rating: 4.7,
    isTrending: true,
  },
  {
    name: "Hong Kong",
    country: "China",
    category: "Cities",
    description:
      "Hong Kong is a special administrative region of China. It's a vibrant city known for its skyline, shopping, and food scene.",
    shortDescription: "Dynamic city of skyscrapers",
    bestTime: "October to April",
    whySpecial:
      "A unique blend of East and West with stunning skyline and world-class food.",
    thingsToDo: [
      "Victoria Peak",
      "Star Ferry",
      "Temple Street Night Market",
      "Big Buddha",
      "Dim sum",
    ],
    images: [
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800",
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63836.234567890!2d114.2!3d22.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3404005b8b5b5b5b%3A0x1f7b7b7b7b7b7b7b!2sHong%20Kong!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$100-300/day",
    safety: "Very safe.",
    tips: [
      "Get Octopus card",
      "Try dim sum",
      "Visit during festivals",
      "Take Star Ferry",
    ],
    rating: 4.7,
  },
  {
    name: "Bangkok",
    country: "Thailand",
    category: "Cities",
    description:
      "Bangkok is the capital and most populous city of Thailand. It's known for ornate shrines and vibrant street life.",
    shortDescription: "City of temples and street food",
    bestTime: "November to March",
    whySpecial:
      "A vibrant city with incredible food, beautiful temples, and exciting nightlife.",
    thingsToDo: [
      "Grand Palace",
      "Wat Pho",
      "Chatuchak Market",
      "Floating markets",
      "Street food tours",
    ],
    images: [
      "https://images.unsplash.com/photo-1490806843957-31f4c9ef91d5?w=800",
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.234567890!2d100.5!3d13.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29e63e5b5b5b5%3A0x1f7b7b7b7b7b7b7b!2sBangkok!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$40-120/day",
    safety: "Generally safe.",
    tips: [
      "Try street food",
      "Use BTS/MRT",
      "Visit temples early",
      "Bargain in markets",
    ],
    rating: 4.6,
    isTrending: true,
  },
  {
    name: "Istanbul",
    country: "Turkey",
    category: "Cities",
    description:
      "Istanbul is a major city in Turkey that straddles Europe and Asia across the Bosphorus Strait. Its Old City reflects cultural influences of the many empires that once ruled here.",
    shortDescription: "City spanning two continents",
    bestTime: "April to May, September to October",
    whySpecial:
      "A unique city spanning two continents with incredible history and culture.",
    thingsToDo: [
      "Hagia Sophia",
      "Blue Mosque",
      "Topkapi Palace",
      "Grand Bazaar",
      "Bosphorus cruise",
    ],
    images: [
      "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800",
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.234567890!2d28.9!3d41.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa7040068086b%3A0x1f7b7b7b7b7b7b7b!2sIstanbul!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$60-150/day",
    safety: "Generally safe.",
    tips: [
      "Try Turkish delight",
      "Visit mosques respectfully",
      "Bargain in bazaar",
      "Try hammam",
    ],
    rating: 4.7,
    isFeatured: true,
  },
  {
    name: "Cairo",
    country: "Egypt",
    category: "Historical",
    description:
      "Cairo is Egypt's sprawling capital, set on the Nile River. At its heart is Tahrir Square and the vast Egyptian Museum, a trove of antiquities including royal mummies and gilded King Tutankhamun artifacts.",
    shortDescription: "Ancient capital on the Nile",
    bestTime: "October to April",
    whySpecial:
      "Gateway to ancient Egypt with the Pyramids and world-class museums.",
    thingsToDo: [
      "Pyramids of Giza",
      "Egyptian Museum",
      "Khan el-Khalili",
      "Islamic Cairo",
      "Nile cruise",
    ],
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.234567890!2d31.2!3d30.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583fa60b21beeb%3A0x1f7b7b7b7b7b7b7b!2sCairo!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$50-120/day",
    safety: "Generally safe. Use registered guides.",
    tips: [
      "Visit pyramids early",
      "Hire a guide",
      "Bargain in markets",
      "Try koshary",
    ],
    rating: 4.6,
    isFeatured: true,
  },
  {
    name: "Rome",
    country: "Italy",
    category: "Historical",
    description:
      "Rome is the capital city of Italy. It's also the capital of the Lazio region, the centre of the Metropolitan City of Rome Capital, and a special comune named Comune di Roma Capitale.",
    shortDescription: "Eternal City with ancient history",
    bestTime: "April to June, September to October",
    whySpecial:
      "The Eternal City with thousands of years of history and incredible art.",
    thingsToDo: [
      "Colosseum",
      "Vatican City",
      "Trevi Fountain",
      "Pantheon",
      "Roman Forum",
    ],
    images: [
      "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800",
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d207446.234567890!2d12.5!3d41.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f6196f9928ebb%3A0x1f7b7b7b7b7b7b7b!2sRome!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$100-250/day",
    safety: "Generally safe. Watch for pickpockets.",
    tips: [
      "Book Colosseum early",
      "Try gelato",
      "Visit Vatican early",
      "Walk everywhere",
    ],
    rating: 4.8,
    isFeatured: true,
  },
  {
    name: "Athens",
    country: "Greece",
    category: "Historical",
    description:
      "Athens is the capital of Greece. It was also at the heart of Ancient Greece, a powerful civilization and empire. The city is still dominated by 5th-century BC landmarks.",
    shortDescription: "Birthplace of democracy",
    bestTime: "April to June, September to October",
    whySpecial:
      "The birthplace of Western civilization with incredible ancient ruins.",
    thingsToDo: [
      "Acropolis",
      "Parthenon",
      "Ancient Agora",
      "Plaka district",
      "National Archaeological Museum",
    ],
    images: [
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d207446.234567890!2d23.7!3d37.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1bd1f067043f1%3A0x1f7b7b7b7b7b7b7b!2sAthens!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$80-200/day",
    safety: "Generally safe.",
    tips: [
      "Visit Acropolis early",
      "Try Greek food",
      "Visit museums",
      "Combine with islands",
    ],
    rating: 4.7,
  },
  {
    name: "Jerusalem",
    country: "Israel",
    category: "Historical",
    description:
      "Jerusalem is a city in Western Asia, on a plateau in the Judaean Mountains between the Mediterranean and the Dead Sea. It is one of the oldest cities in the world.",
    shortDescription: "Holy city of three religions",
    bestTime: "March to May, September to November",
    whySpecial:
      "One of the world's oldest cities, sacred to three major religions.",
    thingsToDo: [
      "Western Wall",
      "Church of the Holy Sepulchre",
      "Dome of the Rock",
      "Via Dolorosa",
      "Mount of Olives",
    ],
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.234567890!2d35.2!3d31.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d17ca68e5b5b5b%3A0x1f7b7b7b7b7b7b7b!2sJerusalem!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$100-250/day",
    safety: "Generally safe. Check current situation.",
    tips: [
      "Dress modestly",
      "Respect religious sites",
      "Visit early morning",
      "Try local food",
    ],
    rating: 4.7,
  },
  {
    name: "Mumbai",
    country: "India",
    category: "Cities",
    description:
      "Mumbai is the capital city of the Indian state of Maharashtra. It's the most populous city in India and the financial capital of the country.",
    shortDescription: "Bollywood and financial capital",
    bestTime: "November to February",
    whySpecial:
      "The vibrant heart of India with Bollywood, beaches, and incredible food.",
    thingsToDo: [
      "Gateway of India",
      "Marine Drive",
      "Elephanta Caves",
      "Dharavi tour",
      "Bollywood tour",
    ],
    images: [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4016734.234567890!2d72.8!3d19.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce6c6b5b5b5b%3A0x1f7b7b7b7b7b7b7b!2sMumbai!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$40-120/day",
    safety: "Generally safe.",
    tips: [
      "Try street food",
      "Use local trains",
      "Visit during festivals",
      "Try vada pav",
    ],
    rating: 4.5,
  },
  {
    name: "Delhi",
    country: "India",
    category: "Cities",
    description:
      "Delhi is the capital of India and a territory. It's home to numerous museums, historic forts and monuments, including India Gate, the Red Fort and the Jama Masjid mosque.",
    shortDescription: "Capital with Mughal heritage",
    bestTime: "October to March",
    whySpecial:
      "India's capital with incredible Mughal heritage and diverse culture.",
    thingsToDo: [
      "Red Fort",
      "India Gate",
      "Jama Masjid",
      "Lotus Temple",
      "Qutub Minar",
    ],
    images: [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4016734.234567890!2d77.2!3d28.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x1f7b7b7b7b7b7b7b!2sDelhi!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$30-100/day",
    safety: "Generally safe.",
    tips: [
      "Use metro",
      "Try street food carefully",
      "Visit monuments early",
      "Try chaat",
    ],
    rating: 4.4,
  },
  {
    name: "Udaipur",
    country: "India",
    category: "Romance",
    description:
      "Udaipur is a city in the western Indian state of Rajasthan. It's set around a series of artificial lakes and is known for its lavish royal residences.",
    shortDescription: "City of Lakes and palaces",
    bestTime: "October to March",
    whySpecial:
      "The most romantic city in India with stunning lakes and palaces.",
    thingsToDo: [
      "City Palace",
      "Lake Pichola boat ride",
      "Jag Mandir",
      "Jagdish Temple",
      "Monsoon Palace",
    ],
    images: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800",
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.234567890!2d73.7!3d24.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09d!2sUdaipur!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$40-120/day",
    safety: "Very safe.",
    tips: [
      "Take boat ride",
      "Stay in palace hotel",
      "Visit during festivals",
      "Try Rajasthani food",
    ],
    rating: 4.7,
    isFeatured: true,
  },
  {
    name: "Shimla",
    country: "India",
    category: "Mountains",
    description:
      "Shimla is the capital of the northern Indian state of Himachal Pradesh. It's a popular hill station, surrounded by green hills with a cool climate.",
    shortDescription: "Queen of the Hills",
    bestTime: "March to June, September to November",
    whySpecial:
      "A charming hill station with colonial architecture and mountain views.",
    thingsToDo: [
      "Mall Road",
      "Jakhu Temple",
      "Christ Church",
      "Kufri",
      "Toy train ride",
    ],
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.234567890!2d77.2!3d31.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39049b5b5b5b5b5b%3A0x1f7b7b7b7b7b7b7b!2sShimla!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$30-80/day",
    safety: "Very safe.",
    tips: [
      "Take toy train",
      "Try local food",
      "Visit during summer",
      "Walk Mall Road",
    ],
    rating: 4.5,
  },
  {
    name: "Darjeeling",
    country: "India",
    category: "Mountains",
    description:
      "Darjeeling is a town in India's West Bengal state, in the Himalayan foothills. Once a summer resort for the British Raj elite, it remains the terminus of the narrow-gauge Darjeeling Himalayan Railway.",
    shortDescription: "Tea gardens and mountain views",
    bestTime: "March to May, October to November",
    whySpecial:
      "Famous for its tea gardens and stunning views of Kanchenjunga.",
    thingsToDo: [
      "Tiger Hill sunrise",
      "Tea garden tour",
      "Toy train",
      "Peace Pagoda",
      "Himalayan Mountaineering Institute",
    ],
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.234567890!2d88.3!3d27.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e6b5b5b5b5b5b5%3A0x1f7b7b7b7b7b7b7b!2sDarjeeling!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$30-80/day",
    safety: "Very safe.",
    tips: [
      "Wake early for sunrise",
      "Try local tea",
      "Take toy train",
      "Visit tea gardens",
    ],
    rating: 4.6,
  },
  {
    name: "Manali",
    country: "India",
    category: "Mountains",
    description:
      "Manali is a high-altitude Himalayan resort town in India's northern Himachal Pradesh state. It has a reputation as a backpacking center and honeymoon destination.",
    shortDescription: "Adventure hub in the Himalayas",
    bestTime: "March to June, October to November",
    whySpecial:
      "A popular hill station and adventure sports hub in the Himalayas.",
    thingsToDo: [
      "Solang Valley",
      "Rohtang Pass",
      "Hadimba Temple",
      "Paragliding",
      "River rafting",
    ],
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.234567890!2d77.2!3d32.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39049b5b5b5b5b5b%3A0x1f7b7b7b7b7b7b7b!2sManali!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$40-100/day",
    safety: "Very safe.",
    tips: [
      "Book activities early",
      "Acclimatize to altitude",
      "Try local food",
      "Visit during summer",
    ],
    rating: 4.6,
    isTrending: true,
  },
  {
    name: "Hampi",
    country: "India",
    category: "Historical",
    description:
      "Hampi is an ancient village in the south Indian state of Karnataka. It's dotted with numerous ruined temple complexes from the Vijayanagara Empire.",
    shortDescription: "Ruins of a lost empire",
    bestTime: "October to March",
    whySpecial:
      "A UNESCO World Heritage site with incredible ruins of the Vijayanagara Empire.",
    thingsToDo: [
      "Virupaksha Temple",
      "Vittala Temple",
      "Hampi Bazaar",
      "Matanga Hill sunrise",
      "Coracle ride",
    ],
    images: [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4016734.234567890!2d76.5!3d15.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb77e5b5b5b5b5b%3A0x1f7b7b7b7b7b7b7b!2sHampi!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$25-60/day",
    safety: "Very safe.",
    tips: [
      "Rent a bike",
      "Visit early morning",
      "Hire a guide",
      "Stay in Hampi Bazaar",
    ],
    rating: 4.7,
  },
  {
    name: "Mysore",
    country: "India",
    category: "Historical",
    description:
      "Mysore is a city in India's southwestern Karnataka state. It's known for the opulent Mysore Palace, the seat of the former Wodeyar maharajas.",
    shortDescription: "City of palaces",
    bestTime: "October to March",
    whySpecial: "Famous for its magnificent palace and rich cultural heritage.",
    thingsToDo: [
      "Mysore Palace",
      "Chamundi Hill",
      "Brindavan Gardens",
      "St. Philomena's Church",
      "Mysore Zoo",
    ],
    images: [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4016734.234567890!2d76.6!3d12.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baf70381d572ef9%3A0x1f7b7b7b7b7b7b7b!2sMysore!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$30-80/day",
    safety: "Very safe.",
    tips: [
      "Visit during Dasara",
      "See palace lighting",
      "Try Mysore pak",
      "Visit nearby temples",
    ],
    rating: 4.6,
  },
  {
    name: "Kochi",
    country: "India",
    category: "Indian Places",
    description:
      "Kochi is a major port city on the west coast of India in the state of Kerala. It's known for its Chinese fishing nets, spice markets, and colonial architecture.",
    shortDescription: "Port city with colonial heritage",
    bestTime: "October to March",
    whySpecial:
      "A charming port city with unique Chinese fishing nets and colonial history.",
    thingsToDo: [
      "Chinese fishing nets",
      "Fort Kochi",
      "Jewish Synagogue",
      "Spice markets",
      "Kathakali performance",
    ],
    images: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4016734.234567890!2d76.3!3d9.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0812ffd49cf55b%3A0x64bd90fbed387c99!2sKochi!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$35-90/day",
    safety: "Very safe.",
    tips: [
      "Try seafood",
      "Visit spice markets",
      "Watch Kathakali",
      "Explore Fort Kochi",
    ],
    rating: 4.6,
  },
  {
    name: "Pondicherry",
    country: "India",
    category: "Indian Places",
    description:
      "Puducherry, formerly known as Pondicherry, is a union territory of India. It's known for its French colonial architecture and beaches.",
    shortDescription: "French colonial charm",
    bestTime: "October to March",
    whySpecial:
      "A unique blend of French and Indian cultures with beautiful colonial architecture.",
    thingsToDo: [
      "Promenade Beach",
      "French Quarter",
      "Auroville",
      "Paradise Beach",
      "Sri Aurobindo Ashram",
    ],
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4016734.234567890!2d79.8!3d11.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5361919b5b5b5b%3A0x1f7b7b7b7b7b7b7b!2sPondicherry!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$30-80/day",
    safety: "Very safe.",
    tips: [
      "Walk French Quarter",
      "Visit Auroville",
      "Try French pastries",
      "Relax on beaches",
    ],
    rating: 4.5,
  },
  {
    name: "Munnar",
    country: "India",
    category: "Nature",
    description:
      "Munnar is a town and hill station located in the Idukki district of the southwestern Indian state of Kerala. It's known for its tea plantations.",
    shortDescription: "Tea gardens in the mountains",
    bestTime: "September to May",
    whySpecial: "Stunning tea plantations set in the Western Ghats mountains.",
    thingsToDo: [
      "Tea garden tours",
      "Eravikulam National Park",
      "Mattupetty Dam",
      "Top Station",
      "Tea Museum",
    ],
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4016734.234567890!2d77.1!3d10.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0812ffd49cf55b%3A0x64bd90fbed387c99!2sMunnar!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$35-90/day",
    safety: "Very safe.",
    tips: [
      "Visit tea gardens",
      "Try local tea",
      "Visit during monsoon",
      "Stay in tea estate",
    ],
    rating: 4.7,
  },
  {
    name: "Ooty",
    country: "India",
    category: "Mountains",
    description:
      "Ooty is a resort town in the Western Ghats mountains, in the south Indian state of Tamil Nadu. Founded as a British Raj summer resort, it retains a working steam railway line.",
    shortDescription: "Queen of Hill Stations",
    bestTime: "April to June, September to November",
    whySpecial:
      "A charming hill station with colonial architecture and beautiful gardens.",
    thingsToDo: [
      "Nilgiri Mountain Railway",
      "Botanical Gardens",
      "Ooty Lake",
      "Doddabetta Peak",
      "Tea gardens",
    ],
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4016734.234567890!2d76.7!3d11.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b04f2b5b5b5b5b5%3A0x1f7b7b7b7b7b7b7b!2sOoty!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$30-80/day",
    safety: "Very safe.",
    tips: [
      "Take toy train",
      "Visit gardens",
      "Try local chocolates",
      "Visit during summer",
    ],
    rating: 4.6,
  },
  {
    name: "Kodaikanal",
    country: "India",
    category: "Mountains",
    description:
      "Kodaikanal is a hill town in the southern Indian state of Tamil Nadu. It's set in an area of granite cliffs, forested valleys, lakes, waterfalls and grassy hills.",
    shortDescription: "Princess of Hill Stations",
    bestTime: "April to June, September to October",
    whySpecial:
      "A beautiful hill station with lakes, waterfalls, and stunning views.",
    thingsToDo: [
      "Kodaikanal Lake",
      "Coaker's Walk",
      "Pillar Rocks",
      "Bear Shola Falls",
      "Bryant Park",
    ],
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4016734.234567890!2d77.5!3d10.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b04f2b5b5b5b5b5%3A0x1f7b7b7b7b7b7b7b!2sKodaikanal!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$30-80/day",
    safety: "Very safe.",
    tips: [
      "Visit lake",
      "Walk Coaker's Walk",
      "Try local chocolates",
      "Visit during summer",
    ],
    rating: 4.6,
  },
  {
    name: "Rajasthan",
    country: "India",
    category: "Indian Places",
    description:
      "Rajasthan is a state in northern India. It's known for its palaces, forts, and the Thar Desert. The state capital, Jaipur, is part of the Golden Triangle tourist circuit.",
    shortDescription: "Land of Kings and deserts",
    bestTime: "October to March",
    whySpecial: "A state of incredible palaces, forts, and desert landscapes.",
    thingsToDo: [
      "Desert safari",
      "Palace hotels",
      "Camel rides",
      "Folk performances",
      "Shopping",
    ],
    images: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
    ],
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4016734.234567890!2d73.0!3d27.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09d!2sRajasthan!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus",
    budget: "$40-120/day",
    safety: "Very safe.",
    tips: [
      "Visit multiple cities",
      "Try Rajasthani food",
      "Stay in palace hotels",
      "Visit during festivals",
    ],
    rating: 4.7,
  },
];

const categoriesData = [
  {
    title: "World Wonders",
    description:
      "Discover the New Seven Wonders and ancient architectural marvels that have stood the test of time.",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=800",
    slug: "world-wonders",
  },
  {
    title: "Romance",
    description:
      "Perfect destinations for couples seeking romantic getaways and unforgettable honeymoon experiences.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
    slug: "romance",
  },
  {
    title: "Adventure",
    description:
      "Thrilling destinations for adrenaline junkies and adventure seekers looking for exciting experiences.",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
    slug: "adventure",
  },
  {
    title: "Beaches",
    description:
      "Beautiful beaches and coastal destinations perfect for relaxation and water activities.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    slug: "beaches",
  },
  {
    title: "Mountains",
    description:
      "Majestic mountain ranges and peaks offering stunning views and outdoor activities.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    slug: "mountains",
  },
  {
    title: "Cities",
    description:
      "Vibrant urban destinations with rich culture, architecture, and modern amenities.",
    image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800",
    slug: "cities",
  },
  {
    title: "Nature",
    description:
      "Pristine natural landscapes, national parks, and wilderness areas for nature lovers.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    slug: "nature",
  },
  {
    title: "Historical",
    description:
      "Historical sites and ancient civilizations that offer insights into the past.",
    image: "https://images.unsplash.com/photo-1515542690570-985b500b0e3f?w=800",
    slug: "historical",
  },
  {
    title: "Budget Travel",
    description:
      "Affordable destinations that offer amazing experiences without breaking the bank.",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
    slug: "budget-travel",
  },
  {
    title: "Luxury Travel",
    description:
      "Premium destinations offering world-class accommodations and exclusive experiences.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
    slug: "luxury-travel",
  },
  {
    title: "Indian Places",
    description:
      "Explore the diverse and beautiful destinations across India, from palaces to temples.",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
    slug: "indian-places",
  },
];

async function seed() {
  try {
    console.log(" Connecting to MongoDB...");
    await connectDB();
    console.log(" Successfully connected to MongoDB!");

    // Clear existing data
    console.log(" Clearing existing data...");
    await Place.deleteMany({});
    await Category.deleteMany({});
    console.log(" Cleared existing data");

    // Create categories
    console.log(" Creating categories...");
    const categories = await Category.insertMany(categoriesData);
    console.log(` Created ${categories.length} categories`);

    // Create places
    console.log(" Creating places...");
    const places = await Place.insertMany(placesData);
    console.log(` Created ${places.length} places`);

    // Create admin user
    console.log(" Creating admin user...");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser = await User.findOneAndUpdate(
      { email: "admin@tripnowa.com" },
      {
        name: "Admin User",
        email: "admin@tripnowa.com",
        password: hashedPassword,
        role: "admin",
      },
      { upsert: true, new: true }
    );
    console.log(" Created admin user");
    console.log("    Email: admin@tripnowa.com");
    console.log("    Password: admin123");

    console.log(" Seeding completed successfully!");
    console.log(` Summary:`);
    console.log(`   - ${categories.length} categories`);
    console.log(`   - ${places.length} places`);
    console.log(`   - 1 admin user`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
