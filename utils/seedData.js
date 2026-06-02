const User = require("../models/User");
const Package = require("../models/Package");
const Testimonial = require("../models/Testimonial");
const BlogPost = require("../models/BlogPost");

const seedData = async () => {
  try {
    // --- Admin User ---
    const adminExists = await User.findOne({ email: "admin@antigravity.com" });
    if (!adminExists) {
      const admin = new User({
        name: "Admin",
        email: "admin@antigravity.com",
        password: "admin123",
        phone: "+91 9876543210",
        role: "admin",
      });
      await admin.save();
      console.log("Admin user created.");
    } else {
      console.log("Admin user already exists.");
    }

    // --- Regular User ---
    const userExists = await User.findOne({ email: "user@antigravity.com" });
    if (!userExists) {
      const user = new User({
        name: "Rahul Sharma",
        email: "user@antigravity.com",
        password: "user123",
        phone: "+91 9998887776",
      });
      await user.save();
      console.log("Regular user created.");
    } else {
      console.log("Regular user already exists.");
    }

    // --- Tour Packages ---
    const packageCount = await Package.countDocuments();
    if (packageCount === 0) {
      const packages = [
        {
          title: "Japan Alpine Trail",
          slug: "japan-alpine-trail",
          category: "international",
          region: "Japan",
          duration: { days: 8, nights: 7 },
          price: { amount: 285000, currency: "INR", perPerson: true },
          validity: "Valid until March 2026",
          description:
            "Embark on an unforgettable journey through Japan's breathtaking Alpine route. Traverse the Tateyama Kurobe Alpine Route, witness stunning snow walls, turquoise reservoirs, and serene mountain vistas. Experience traditional Japanese hospitality in ryokans, explore the historic villages of Takayama, and marvel at the iconic Matsumoto Castle. This tour blends natural wonder with cultural immersion for the adventure seeker.",
          highlights: [
            "Tateyama Kurobe Alpine Route traversal",
            "Matsumoto Castle visit",
            "Traditional ryokan stay in Takayama",
            "Snow Wall experience (April-June)",
            "Guided tour of Kanazawa's Kenroku-en Garden",
            "Bullet train ride Tokyo to Nagano",
          ],
          itinerary: [
            { day: 1, title: "Arrival in Tokyo", description: "Arrive at Narita/Haneda Airport. Transfer to hotel. Evening orientation briefing." },
            { day: 2, title: "Tokyo to Nagano", description: "Board the Shinkansen bullet train. Arrive Nagano, visit Zenko-ji Temple." },
            { day: 3, title: "Tateyama Alpine Route", description: "Experience the full Alpine Route — cable cars, ropeways, and the famous Snow Corridor." },
            { day: 4, title: "Kurobe Dam & Omachi", description: "Visit Kurobe Lake. Travel to Omachi, explore local hot springs." },
            { day: 5, title: "Transfer to Matsumoto", description: "Morning at leisure. Afternoon visit to Matsumoto Castle, one of Japan's most beautiful castles." },
            { day: 6, title: "Takayama", description: "Explore Takayama's old town. Visit morning markets, sake breweries, and Hida Folk Village." },
            { day: 7, title: "Kanazawa", description: "Discover Kanazawa's Kenroku-en Garden, samurai districts, and the 21st Century Museum." },
            { day: 8, title: "Departure", description: "Transfer to Komatsu Airport for departure. Tour ends." },
          ],
          images: [],
          thumbnail: "",
          inclusions: ["7 nights accommodation", "Daily breakfast", "JR Pass (7-day)", "All transfers as per itinerary", "English-speaking guide", "Airport transfers"],
          exclusions: ["International airfare", "Travel insurance", "Personal expenses", "Meals not mentioned"],
          isFeatured: true,
          isActive: true,
        },
        {
          title: "Kerala Magic",
          slug: "kerala-magic",
          category: "domestic",
          region: "Kerala",
          duration: { days: 6, nights: 5 },
          price: { amount: 42500, currency: "INR", perPerson: true },
          validity: "Valid year-round",
          description:
            "Discover the enchanting beauty of Kerala — God's Own Country. Cruise the serene backwaters of Alleppey on a traditional houseboat, relax on the pristine beaches of Varkala, and explore the lush tea plantations of Munnar. This tour offers a perfect blend of nature, culture, and Ayurvedic wellness treatments that will rejuvenate your body and soul.",
          highlights: [
            "Alleppey houseboat backwater cruise",
            "Munnar tea plantation walk",
            "Kathakali dance performance",
            "Ayurvedic spa treatment",
            "Varkala cliff beach visit",
            "Spice garden tour in Thekkady",
          ],
          itinerary: [
            { day: 1, title: "Arrival in Cochin", description: "Airport pickup. Transfer to hotel in Fort Kochi. Evening Chinese fishing nets visit." },
            { day: 2, title: "Cochin to Munnar", description: "Drive to Munnar (4 hrs). En route visit waterfalls and spice plantations. Afternoon tea garden walk." },
            { day: 3, title: "Munnar Sightseeing", description: "Visit Eravikulam National Park, Tea Museum, Mattupetty Dam. Evening free for leisure." },
            { day: 4, title: "Munnar to Alleppey", description: "Drive to Alleppey (5 hrs). Board houseboat for overnight backwater cruise." },
            { day: 5, title: "Alleppey to Varkala", description: "Morning disembark from houseboat. Drive to Varkala. Relax at Papanasam Beach." },
            { day: 6, title: "Departure via Trivandrum", description: "Ayurvedic massage morning. Transfer to Trivandrum Airport for departure." },
          ],
          images: [],
          thumbnail: "",
          inclusions: ["5 nights accommodation", "Houseboat stay (1 night)", "All transfers by AC vehicle", "Driver-guide", "Ayurvedic massage session"],
          exclusions: ["Airfare/train tickets", "Personal expenses", "Camera fees at monuments", "Tips and gratuities"],
          isFeatured: true,
          isActive: true,
        },
        {
          title: "Royal Rajasthan",
          slug: "royal-rajasthan",
          category: "domestic",
          region: "Rajasthan",
          duration: { days: 7, nights: 6 },
          price: { amount: 55000, currency: "INR", perPerson: true },
          validity: "October - March",
          description:
            "Step into a world of kings, forts, and desert landscapes on this Royal Rajasthan tour. Marvel at the Amber Fort in Jaipur, the blue streets of Jodhpur, golden sand dunes in Jaisalmer, and the romantic lakes of Udaipur. Experience the vibrant Rajasthani culture through folk music, traditional cuisine, and camel safaris under starlit skies.",
          highlights: [
            "Amber Fort elephant/jeep safari",
            "Camel safari in Jaisalmer desert",
            "Lake Pichola boat ride in Udaipur",
            "Street food tour in Jaipur",
            "Patwon Ki Haveli visit in Jaisalmer",
            "Sunset at Jodhpur's Mehrangarh Fort",
          ],
          itinerary: [
            { day: 1, title: "Arrival in Jaipur", description: "Drive from Delhi to Jaipur (5 hrs). Evening free for local bazaar exploration." },
            { day: 2, title: "Jaipur Sightseeing", description: "Morning at Amber Fort. City Palace, Hawa Mahal, Jantar Mantar. Evening street food walk." },
            { day: 3, title: "Jaipur to Jodhpur", description: "Drive to Jodhpur (5.5 hrs). Visit Mehrangarh Fort at sunset. Explore Clock Tower market." },
            { day: 4, title: "Jodhpur to Jaisalmer", description: "Drive to Jaisalmer through desert landscape (5.5 hrs). Evening visit to Gadisar Lake." },
            { day: 5, title: "Jaisalmer Desert Experience", description: "Morning at Jaisalmer Fort & havelis. Afternoon camel safari and desert camp dinner under stars." },
            { day: 6, title: "Jaisalmer to Udaipur", description: "Morning desert jeep safari. Overnight journey or flight to Udaipur." },
            { day: 7, title: "Udaipur & Departure", description: "City Palace, Jagdish Temple, Saheliyon Ki Bari. Evening Lake Pichola boat ride. Tour ends." },
          ],
          images: [],
          thumbnail: "",
          inclusions: ["6 nights heritage hotel stays", "All transfers by AC cab", "Camel safari & desert camp", "Boat ride in Udaipur", "Daily breakfast", "Driver-guide throughout"],
          exclusions: ["Airfare to Jaipur/from Udaipur", "Travel insurance", "Camera fees", "Meals not mentioned"],
          isFeatured: true,
          isActive: true,
        },
        {
          title: "Bhutan — Last Shangri-La",
          slug: "bhutan-last-shangri-la",
          category: "international",
          region: "Bhutan",
          duration: { days: 5, nights: 4 },
          price: { amount: 78000, currency: "INR", perPerson: true },
          validity: "October - May",
          description:
            "Journey to the mystical kingdom of Bhutan — the Land of the Thunder Dragon. Trek to the iconic Tiger's Nest Monastery perched on a cliff edge, explore ancient dzongs and vibrant markets, and experience the unique philosophy of Gross National Happiness. Bhutan's pristine landscapes and deep Buddhist traditions create an experience like no other.",
          highlights: [
            "Tiger's Nest Monastery (Paro Taktsang) hike",
            "Punakha Dzong visit",
            "Thimphu weekend market",
            "Traditional Bhutanese hot stone bath",
            "Chey Pass trek (optional)",
            "Gross National Happiness talk with local",
          ],
          itinerary: [
            { day: 1, title: "Fly to Paro", description: "Scenic flight to Paro over the Himalayas. Transfer to Thimphu (2 hrs). Evening stroll at Memorial Chorten." },
            { day: 2, title: "Thimphu", description: "Visit Buddha Dordenma, Tashichho Dzong, Motithang Takin Preserve. Afternoon at Folk Heritage Museum." },
            { day: 3, title: "Thimphu to Punakha", description: "Cross Dochula Pass with 108 Chortens. Visit Punakha Dzong at the confluence of two rivers." },
            { day: 4, title: "Tiger's Nest Monastery", description: "Drive to Paro. Early morning hike to Tiger's Nest (3-4 hrs round trip). Evening hot stone bath." },
            { day: 5, title: "Departure", description: "Morning at leisure. Transfer to Paro International Airport for departure." },
          ],
          images: [],
          thumbnail: "",
          inclusions: ["4 nights boutique hotels", "Bhutan visa facilitation", "All internal transport", "Licensed English-speaking guide", "Sustainable Development Fee", "Hot stone bath experience"],
          exclusions: ["Airfare to Bhutan", "Travel insurance", "Personal shopping", "Meals not specified"],
          isFeatured: true,
          isActive: true,
        },
        {
          title: "Do Dham by Helicopter — Sky Pilgrimage",
          slug: "do-dham-by-helicopter",
          category: "domestic",
          region: "Uttarakhand",
          duration: { days: 2, nights: 1 },
          price: { amount: 175000, currency: "INR", perPerson: true },
          validity: "May - October",
          description:
            "Undertake the sacred Do Dham Yatra — to the holy temples of Kedarnath and Badrinath — by helicopter, offering a seamless and breathtaking pilgrimage experience. Witness the majestic Himalayan peaks from the sky, receive blessings at these ancient shrines of Lord Shiva and Lord Vishnu, and complete a lifetime spiritual journey in just two days without the physical strain of trekking.",
          highlights: [
            "Helicopter rides to Kedarnath & Badrinath",
            "VIP darshan at both temples",
            "Snow-capped Himalayan aerial views",
            "Dehradun luxury resort stay",
            "Ganga Aarti at Rishikesh",
            "Spiritual guide throughout",
          ],
          itinerary: [
            { day: 1, title: "Kedarnath Darshan", description: "Early morning helicopter flight from Dehradun to Kedarnath. VIP darshan at the temple. Return to Dehradun by afternoon. Evening visit to Rishikesh for Ganga Aarti. Overnight at luxury resort." },
            { day: 2, title: "Badrinath Darshan & Return", description: "Morning helicopter to Badrinath. VIP darshan, visit Mana Village (last village before Tibet). Return to Dehradun by afternoon. Tour concludes with blessings." },
          ],
          images: [],
          thumbnail: "",
          inclusions: ["1 night luxury resort accommodation", "Both helicopter flights", "VIP temple darshan", "All ground transfers", "Spiritual guide", "Meals at resort & Siddhaprasad"],
          exclusions: ["Airfare to Dehradun", "Personal donations at temples", "Travel insurance", "Helicopter offloading charges (if any)"],
          isFeatured: false,
          isActive: true,
        },
        {
          title: "Green Paradise — Meghalaya Explorer",
          slug: "green-paradise-meghalaya",
          category: "adventure",
          region: "Meghalaya",
          duration: { days: 5, nights: 4 },
          price: { amount: 38500, currency: "INR", perPerson: true },
          validity: "Year-round",
          description:
            "Discover Meghalaya, the abode of clouds, a land of emerald green forests, cascading waterfall, and living root bridges. Trek to the famous Double Decker Root Bridge in Nongriat, explore the crystal-clear waters of Umngot River in Dawki, and experience the unique Khasi culture. This offbeat adventure takes you through some of the most pristine landscapes in Northeast India.",
          highlights: [
            "Double Decker Living Root Bridge trek",
            "Dawki river boating on Umngot",
            "Mawphlang Sacred Forest exploration",
            "Caving adventure in Mawsmai",
            "Nohkalikai Falls visit",
            "Homestay with Khasi family experience",
          ],
          itinerary: [
            { day: 1, title: "Guwahati to Shillong", description: "Pickup from Guwahati Airport (3.5 hrs to Shillong). Visit Umiam Lake (Barapani). Evening Police Bazaar walk." },
            { day: 2, title: "Shillong Sightseeing", description: "Shillong Peak, Elephant Falls, Mawphlang Sacred Forest, Cathedral of Mary. Evening cultural dinner." },
            { day: 3, title: "Cherrapunji Excursion", description: "Drive to Cherrapunji. Seven Sisters Falls, Mawsmai Caves, Nohkalikai Falls. Return to Shillong." },
            { day: 4, title: "Nongriat Trek", description: "Drive to Tyrnah. Trek down 3,500 steps to Double Decker Living Root Bridge. Swim in natural pools. Return and drive to Dawki." },
            { day: 5, title: "Dawki & Departure", description: "Early morning Umngot River boating. Drive to Guwahati Airport for departure (4 hrs). Tour ends." },
          ],
          images: [],
          thumbnail: "",
          inclusions: ["4 nights accommodation", "All transfers by AC vehicle", "Local guide for trek", "Dawki boating", "Daily breakfast & dinner"],
          exclusions: ["Airfare to Guwahati", "Travel insurance", "Meals not mentioned", "Camera fees"],
          isFeatured: true,
          isActive: true,
        },
      ];

      await Package.insertMany(packages);
      console.log("6 tour packages created.");
    } else {
      console.log("Tour packages already exist, skipping.");
    }

    // --- Testimonials ---
    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      const testimonials = [
        {
          name: "Priya Menon",
          text: "Our family trip to Kerala organized by Multifly was nothing short of magical. The houseboat experience on the Alleppey backwaters was incredibly serene, and the Ayurvedic massage session was the highlight. The team was professional, responsive, and went above and beyond to make our vacation special. Highly recommend!",
          tour: "Kerala Magic",
          isVisible: true,
          order: 1,
        },
        {
          name: "Amit Verma",
          text: "The Rajasthan tour was a dream come true. From the golden deserts of Jaisalmer to the romantic lakes of Udaipur, every moment was picture-perfect. Our guide knew the history and culture intimately, and the heritage hotels were atmospheric. Multifly took care of everything — we just had to show up and enjoy!",
          tour: "Royal Rajasthan",
          isVisible: true,
          order: 2,
        },
        {
          name: "Sarah Williams",
          text: "I've traveled to 30 countries, and the Bhutan trip with Multifly is still the most spiritual and rejuvenating experience I've ever had. The Tiger's Nest hike, the stunning dzongs, and the philosophy of Gross National Happiness left a deep impression. Thank you for the meticulously planned journey!",
          tour: "Bhutan — Last Shangri-La",
          isVisible: true,
          order: 3,
        },
        {
          name: "Rajesh Iyer",
          text: "The Do Dham by Helicopter was a life-changing spiritual journey. Receiving blessings at Kedarnath and Badrinath without the physical strain of trekking was a blessing in itself, especially for my elderly parents. The aerial views of the Himalayas were breathtaking. Multifly made our pilgrimage seamless.",
          tour: "Do Dham by Helicopter",
          isVisible: true,
          order: 4,
        },
        {
          name: "Meera Kapoor",
          text: "Meghalaya was an unexplored gem! The trek to the Double Decker Root Bridge was challenging but so worth it. The turquoise waters of Umngot at Dawki felt unreal. Multifly's local connections made all the difference — from the homestay experience to knowing the best hidden spots. Planning my next trip already!",
          tour: "Green Paradise — Meghalaya Explorer",
          isVisible: true,
          order: 5,
        },
      ];

      await Testimonial.insertMany(testimonials);
      console.log("5 testimonials created.");
    } else {
      console.log("Testimonials already exist, skipping.");
    }

    // --- Blog Posts ---
    const blogCount = await BlogPost.countDocuments();
    if (blogCount === 0) {
      const posts = [
        {
          title: "10 Must-Visit Hidden Gems in Northeast India",
          slug: "10-must-visit-hidden-gems-in-northeast-india",
          content: `
<p>Northeast India remains one of the least explored yet most stunning regions of the country. From the living root bridges of Meghalaya to the floating islands of Loktak Lake in Manipur, this region is a treasure trove of natural wonders and cultural richness.</p>

<p>Here are 10 hidden gems that deserve a spot on every traveler's bucket list:</p>

<h3>1. Nongriat, Meghalaya</h3>
<p>The Double Decker Living Root Bridge in Nongriat is a marvel of bio-engineering. Created by the Khasi people over generations by guiding the roots of rubber trees across streams, these bridges can support the weight of 50 people and get stronger with age.</p>

<h3>2. Tawang, Arunachal Pradesh</h3>
<p>Home to the second-largest monastery in the world, Tawang sits at 10,000 feet with views of snow-capped peaks in every direction. The journey there crossing the Sela Pass at 13,700 feet is an adventure in itself.</p>

<h3>3. Majuli, Assam</h3>
<p>The world's largest river island on the Brahmaputra, Majuli is a center of Neo-Vaishnavite culture with ancient Satras (monasteries) and unique mask-making traditions.</p>

<h3>4. Ziro, Arunachal Pradesh</h3>
<p>A UNESCO World Heritage Site nominee, Ziro Valley is home to the Apatani tribe with their unique wet rice cultivation practices and facial tattoos. It also hosts the famous Ziro Music Festival.</p>

<h3>5. Phawngpui, Mizoram</h3>
<p>Known as the Blue Mountain, Phawngpui is the highest peak in Mizoram and offers panoramic views of the surrounding hills and valleys. It's considered a sacred mountain by the local Mizo people.</p>

<p>Whether you're an adventure seeker, culture enthusiast, or nature lover, Northeast India has something extraordinary waiting for you.</p>
          `,
          excerpt:
            "From living root bridges to ancient monasteries, discover ten incredible destinations in Northeast India that most travelers have never heard of.",
          coverImage: "",
          tags: ["northeast-india", "travel-guide", "hidden-gems", "adventure"],
          isPublished: true,
          publishedAt: new Date("2024-03-15"),
        },
        {
          title: "Ultimate Guide to Planning Your Wedding in Udaipur",
          slug: "ultimate-guide-to-planning-wedding-in-udaipur",
          content: `
<p>Udaipur, the City of Lakes, has firmly established itself as the world's premier destination wedding location. With its opulent palaces, shimmering lakes, and romantic architecture, there's no better place to say "I Do."</p>

<h3>Why Udaipur?</h3>
<p>The city offers a perfect blend of grandeur and intimacy. From the iconic Lake Palace to the City Palace complex, every venue tells a story. The golden hour light reflecting off Lake Pichola creates a photographer's paradise.</p>

<h3>Top Wedding Venues</h3>
<p><strong>Oberoi Udaivilas</strong>: Spread over 30 acres with a grand dome architecture inspired by ancient palaces.</p>
<p><strong>Taj Lake Palace</strong>: A floating palace in the middle of Lake Pichola — truly one of the world's most romantic venues.</p>
<p><strong>The Leela Palace</strong>: Overlooking Lake Pichola, with opulent décor and world-class services.</p>

<h3>Planning Timeline</h3>
<p>Start planning at least 6-8 months in advance, especially for peak season (October to March). Consider hiring a local wedding planner who understands the logistics of hosting events at heritage properties.</p>

<h3>Budget Considerations</h3>
<p>A destination wedding in Udaipur can range from ₹50 lakhs to several crores depending on the guest count, venue, and level of extravagance. Factor in accommodation, local transport, and vendor travel costs for out-of-town services.</p>

<p>With the right planning, your Udaipur wedding will be an unforgettable celebration that your guests will talk about for years.</p>
          `,
          excerpt:
            "Everything you need to know about planning the perfect destination wedding in the City of Lakes — from venues to budget tips.",
          coverImage: "",
          tags: ["destination-wedding", "udaipur", "honeymoon", "travel-guide"],
          isPublished: true,
          publishedAt: new Date("2024-02-20"),
        },
      ];

      await BlogPost.insertMany(posts);
      console.log("2 blog posts created.");
    } else {
      console.log("Blog posts already exist, skipping.");
    }

    console.log("\n✅ Seed data completed successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

module.exports = seedData;
