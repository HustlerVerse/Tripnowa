import Place from '@/models/Place';
import Category from '@/models/Category';

export interface EvaMessage {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
}

const GREETING_PATTERNS = [
  /^(hi|hello|hey|hola|good morning|good evening|good afternoon|sup|yo)\b/i,
  /^how are you/i,
];

const HELP_PATTERNS = [
  /what can you do/i,
  /how can you help/i,
  /help me/i,
  /^help$/i,
];

const ITINERARY_PATTERNS = [
  /itinerary|plan my trip|trip plan|schedule|3 day|3-day|weekend trip/i,
];

const WEATHER_PATTERNS = [
  /weather|climate|temperature|rainy season|monsoon/i,
];

const BUDGET_PATTERNS = [
  /budget|cheap|affordable|luxury|cost|expensive|price/i,
];

const TRENDING_PATTERNS = [
  /trending|popular|hot destination|most visited/i,
];

const WONDER_PATTERNS = [
  /world wonder|seven wonder|ancient wonder|wonders of the world/i,
];

const CATEGORY_PATTERNS = [
  /categor(y|ies)|type of trip|travel style|beach|mountain|adventure|romantic|city break/i,
];

const BEST_TIME_PATTERNS = [
  /best time|when to visit|when should i go|season to visit/i,
];

const TIPS_PATTERNS = [
  /travel tip|packing|safety tip|advice|recommendation/i,
];

function matchesAny(text: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(text));
}

function formatPlaceSummary(place: {
  name: string;
  country: string;
  shortDescription?: string;
  description: string;
  bestTime: string;
  budget: string;
  rating?: number;
}) {
  const summary = place.shortDescription || place.description.slice(0, 140);
  const ratingText = place.rating ? ` ⭐ ${place.rating}/5` : '';
  return `**${place.name}, ${place.country}**${ratingText}\n${summary}...\n• Best time: ${place.bestTime}\n• Budget: ${place.budget}`;
}

function buildSuggestions(items: string[]) {
  return items.slice(0, 4);
}

export async function generateEvaResponse(message: string): Promise<EvaMessage> {
  const input = message.trim();

  if (!input) {
    return {
      role: 'assistant',
      content: 'Please type a message and I will help you plan your next adventure!',
      suggestions: buildSuggestions([
        'Recommend destinations',
        'Show trending places',
        'Plan a 3-day itinerary',
        'Best time to visit Bali',
      ]),
    };
  }

  if (matchesAny(input, GREETING_PATTERNS)) {
    return {
      role: 'assistant',
      content:
        "Hello! I'm Eva, your AI travel assistant on Tripnowa. I can recommend destinations, suggest itineraries, share travel tips, and help you discover amazing places around the world. Where would you like to go?",
      suggestions: buildSuggestions([
        'Recommend romantic destinations',
        'Show world wonders',
        'Budget-friendly trips',
        'What can you do?',
      ]),
    };
  }

  if (matchesAny(input, HELP_PATTERNS)) {
    return {
      role: 'assistant',
      content:
        'I can help you with:\n\n• Destination recommendations based on your interests\n• Simple travel itineraries\n• Best time to visit popular places\n• Budget and safety tips\n• Trending destinations and world wonders\n• Category-based travel ideas (beach, adventure, romantic, etc.)\n\nJust ask me anything about travel planning!',
      suggestions: buildSuggestions([
        'Recommend beach destinations',
        'Plan a weekend trip',
        'Show trending places',
        'Travel tips for Europe',
      ]),
    };
  }

  if (matchesAny(input, WONDER_PATTERNS)) {
    const wonders = await Place.find({ isWorldWonder: true }).limit(7);
    if (wonders.length === 0) {
      return {
        role: 'assistant',
        content:
          'Our world wonders collection is being updated. In the meantime, ask me about trending or featured destinations!',
      };
    }

    const list = wonders
      .map((place, index) => `${index + 1}. **${place.name}** (${place.country})`)
      .join('\n');

    return {
      role: 'assistant',
      content: `Here are the world's most iconic wonders on Tripnowa:\n\n${list}\n\nTap any destination on our site to explore photos, tips, and things to do!`,
      suggestions: buildSuggestions(wonders.map((place) => `Tell me about ${place.name}`)),
    };
  }

  if (matchesAny(input, TRENDING_PATTERNS)) {
    const trending = await Place.find({ isTrending: true }).limit(5);
    if (trending.length === 0) {
      const featured = await Place.find({ isFeatured: true }).limit(5);
      const list = featured.map((place) => formatPlaceSummary(place)).join('\n\n');
      return {
        role: 'assistant',
        content: `These featured destinations are traveler favorites right now:\n\n${list}`,
        suggestions: buildSuggestions(featured.map((place) => `Plan trip to ${place.name}`)),
      };
    }

    const list = trending.map((place) => formatPlaceSummary(place)).join('\n\n');
    return {
      role: 'assistant',
      content: `These destinations are trending on Tripnowa right now:\n\n${list}`,
      suggestions: buildSuggestions(trending.map((place) => `Best time for ${place.name}`)),
    };
  }

  if (matchesAny(input, CATEGORY_PATTERNS)) {
    const categories = await Category.find().limit(8);
    const categoryMatch = categories.find((category) =>
      input.toLowerCase().includes(category.title.toLowerCase()) ||
      input.toLowerCase().includes(category.slug.toLowerCase())
    );

    if (categoryMatch) {
      const places = await Place.find({
        category: { $regex: categoryMatch.title, $options: 'i' },
      }).limit(4);

      if (places.length === 0) {
        return {
          role: 'assistant',
          content: `${categoryMatch.title} trips are a great choice! Browse our **${categoryMatch.title}** category for curated destinations.`,
          suggestions: ['Show all categories', 'Recommend destinations'],
        };
      }

      const list = places.map((place) => formatPlaceSummary(place)).join('\n\n');
      return {
        role: 'assistant',
        content: `Top **${categoryMatch.title}** picks for you:\n\n${list}`,
        suggestions: buildSuggestions(places.map((place) => `Itinerary for ${place.name}`)),
      };
    }

    const list = categories.map((category) => `• **${category.title}** — ${category.description.slice(0, 80)}...`).join('\n');
    return {
      role: 'assistant',
      content: `Explore trips by category:\n\n${list}\n\nTell me a style you like, such as beach, adventure, or romantic!`,
      suggestions: buildSuggestions(categories.slice(0, 4).map((category) => `${category.title} destinations`)),
    };
  }

  if (matchesAny(input, ITINERARY_PATTERNS)) {
    const destinationMatch = input.match(/(?:in|to|for)\s+([a-zA-Z\s]+?)(?:\?|$|\.|,)/i);
    const searchTerm = destinationMatch?.[1]?.trim();

    const place = searchTerm
      ? await Place.findOne({
          $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { country: { $regex: searchTerm, $options: 'i' } },
          ],
        })
      : await Place.findOne({ isFeatured: true });

    if (!place) {
      return {
        role: 'assistant',
        content:
          'I can build a simple itinerary for you! Tell me a destination, for example: "Plan a 3-day itinerary for Paris".',
        suggestions: buildSuggestions(['Itinerary for Tokyo', 'Weekend in Bali', 'Plan trip to Rome']),
      };
    }

    const activities = place.thingsToDo.slice(0, 3);
    const dayPlan = activities.length
      ? activities.map((item, index) => `**Day ${index + 1}:** ${item}`).join('\n')
      : `**Day 1:** Explore the city center and local landmarks\n**Day 2:** Visit top attractions and try local cuisine\n**Day 3:** Relax and discover hidden gems`;

    return {
      role: 'assistant',
      content: `Here is a sample 3-day itinerary for **${place.name}, ${place.country}**:\n\n${dayPlan}\n\n**Best time to visit:** ${place.bestTime}\n**Estimated budget:** ${place.budget}\n\nWant more details? Visit the destination page on Tripnowa!`,
      suggestions: buildSuggestions([
        `Best time for ${place.name}`,
        `Budget tips for ${place.country}`,
        'Show similar destinations',
      ]),
    };
  }

  if (matchesAny(input, BEST_TIME_PATTERNS) || matchesAny(input, WEATHER_PATTERNS)) {
    const destinationMatch = input.match(/(?:visit|in|to|for|at)\s+([a-zA-Z\s]+?)(?:\?|$|\.|,)/i);
    const searchTerm = destinationMatch?.[1]?.trim() || input.replace(/best time|weather|when to visit|climate/gi, '').trim();

    const place = searchTerm
      ? await Place.findOne({
          $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { country: { $regex: searchTerm, $options: 'i' } },
          ],
        })
      : null;

    if (place) {
      return {
        role: 'assistant',
        content: `For **${place.name}, ${place.country}**, the best time to visit is **${place.bestTime}**.\n\n${place.whySpecial}\n\n**Safety note:** ${place.safety}`,
        suggestions: buildSuggestions([
          `Itinerary for ${place.name}`,
          `Things to do in ${place.name}`,
          'Show similar destinations',
        ]),
      };
    }

    return {
      role: 'assistant',
      content:
        'Tell me which destination you are interested in, and I will share the best season to visit. For example: "Best time to visit Japan".',
      suggestions: buildSuggestions(['Best time for Bali', 'Weather in Paris', 'When to visit Thailand']),
    };
  }

  if (matchesAny(input, BUDGET_PATTERNS)) {
    const budgetLevel = /luxury|premium|high-end/i.test(input)
      ? 'luxury'
      : /cheap|budget|affordable|backpack/i.test(input)
        ? 'budget'
        : null;

    const query = budgetLevel
      ? { budget: { $regex: budgetLevel, $options: 'i' } }
      : {};

    const places = await Place.find(query).limit(4);
    if (places.length === 0) {
      return {
        role: 'assistant',
        content:
          'Most destinations on Tripnowa include budget guidance. Ask about a specific place, like "Budget for Bali" or "Affordable destinations in Europe".',
      };
    }

    const list = places.map((place) => formatPlaceSummary(place)).join('\n\n');
    return {
      role: 'assistant',
      content: `Here are some ${budgetLevel || 'great'} travel options:\n\n${list}`,
      suggestions: buildSuggestions(places.map((place) => `Plan trip to ${place.name}`)),
    };
  }

  if (matchesAny(input, TIPS_PATTERNS)) {
    const featured = await Place.findOne({ isFeatured: true });
    const tips = featured?.tips?.slice(0, 4) || [
      'Book flights early for better prices',
      'Check visa requirements before you travel',
      'Keep digital and physical copies of important documents',
      'Learn a few local phrases — locals appreciate the effort',
    ];

    return {
      role: 'assistant',
      content: `Here are helpful travel tips${featured ? ` for **${featured.name}**` : ''}:\n\n${tips.map((tip) => `• ${tip}`).join('\n')}`,
      suggestions: buildSuggestions(['Recommend destinations', 'Show trending places', 'Plan a weekend trip']),
    };
  }

  const destinationQuery = input
    .replace(/tell me about|recommend|suggest|show me|what about|plan trip to|trip to/gi, '')
    .trim();

  const matchedPlaces = await Place.find({
    $or: [
      { name: { $regex: destinationQuery || input, $options: 'i' } },
      { country: { $regex: destinationQuery || input, $options: 'i' } },
      { category: { $regex: destinationQuery || input, $options: 'i' } },
      { description: { $regex: destinationQuery || input, $options: 'i' } },
    ],
  }).limit(4);

  if (matchedPlaces.length > 0) {
    if (matchedPlaces.length === 1) {
      const place = matchedPlaces[0];
      const thingsToDo = place.thingsToDo.slice(0, 3).map((item) => `• ${item}`).join('\n');
      return {
        role: 'assistant',
        content: `**${place.name}, ${place.country}**\n\n${place.description.slice(0, 220)}...\n\n**Why it's special:** ${place.whySpecial}\n\n**Things to do:**\n${thingsToDo || '• Explore local culture and landmarks'}\n\n**Best time:** ${place.bestTime} | **Budget:** ${place.budget}`,
        suggestions: buildSuggestions([
          `Itinerary for ${place.name}`,
          `Best time for ${place.name}`,
          'Show similar destinations',
        ]),
      };
    }

    const list = matchedPlaces.map((place) => formatPlaceSummary(place)).join('\n\n');
    return {
      role: 'assistant',
      content: `I found these destinations matching your request:\n\n${list}`,
      suggestions: buildSuggestions(matchedPlaces.map((place) => `Tell me about ${place.name}`)),
    };
  }

  const featured = await Place.find({ isFeatured: true }).limit(3);
  const featuredList = featured.map((place) => `• **${place.name}** (${place.country})`).join('\n');

  return {
    role: 'assistant',
    content: `I couldn't find an exact match, but here are some popular picks on Tripnowa:\n\n${featuredList}\n\nTry asking about a country, category, or destination name!`,
    suggestions: buildSuggestions([
      'Recommend destinations',
      'Show trending places',
      'World wonders',
      'Travel tips',
    ]),
  };
}
