/**
 * Curated public-domain artworks for anytext.art (ST-103).
 *
 * Two kinds of entry:
 *   - `qid`: the work lives in the app backend's famous-paintings pool
 *     (../mobile/functions/pipeline/art-famous-data.js — 1540 human-reviewed
 *     works); fetch-gallery.mjs reads title/artist/year/museum/commonsFile
 *     from there so this list never drifts from the pool.
 *   - `commonsFile`: works outside the pool (prints, panels, 20th-century
 *     works the pool's oil/tempera filter excludes), named after a live
 *     Commons API lookup on 2026-09-18 with the licence checked by hand.
 *
 * The script re-verifies every file's licence (extmetadata) before it
 * downloads anything; a non-PD/CC0 file is skipped with a warning, never
 * silently shipped. Fields used by the site:
 *   id     — stable kebab-case key, also the file stem in public/gallery/
 *   wall   — true: candidate for the hero art wall (10-12 are used)
 *   kind   — which "kind of text" tile in the homepage grid may use it
 *   tilt   — the clipping's resting angle on the paper desk (deg)
 */
export const GALLERY_LIST = [
  // — Van Gogh
  { id: "starry-night", qid: "Q45585", wall: true, tilt: -2, kind: "art" },
  { id: "almond-blossom", qid: "Q1432536", wall: true, tilt: 1.5, kind: "story" },
  { id: "wheatfield-crows", qid: "Q634122" },
  { id: "cafe-terrace", commonsFile: "Vincent Willem van Gogh - Cafe Terrace at Night (Yorck).jpg",
    title: "Café Terrace at Night", artist: "Vincent van Gogh", year: "1888", museum: "Kröller-Müller Museum", wall: true, tilt: -1.5 },
  { id: "bedroom", commonsFile: "Vincent van Gogh - De slaapkamer - Google Art Project.jpg",
    title: "The Bedroom", artist: "Vincent van Gogh", year: "1888", museum: "Van Gogh Museum" },
  { id: "sunflowers", commonsFile: "Vincent van Gogh - Sunflowers (1888, National Gallery London).jpg",
    title: "Sunflowers", artist: "Vincent van Gogh", year: "1888", museum: "National Gallery, London" },
  // — Klimt
  { id: "the-kiss", qid: "Q698487", wall: true, tilt: 2 },
  { id: "adele-bloch-bauer", commonsFile: "Gustav Klimt - Porträt der Adele Bloch-Bauer I (1907).jpg",
    title: "Portrait of Adele Bloch-Bauer I", artist: "Gustav Klimt", year: "1907", museum: "Neue Galerie New York" },
  // — Dutch Golden Age
  { id: "milkmaid", qid: "Q167605", wall: true, tilt: -1 },
  { id: "woman-reading-letter", commonsFile: "Brieflezende vrouw, SK-C-251.jpg",
    title: "Woman Reading a Letter", artist: "Johannes Vermeer", year: "c. 1663", museum: "Rijksmuseum", kind: "book" },
  { id: "girl-pearl-earring", commonsFile: "1665 Girl with a Pearl Earring.jpg",
    title: "Girl with a Pearl Earring", artist: "Johannes Vermeer", year: "c. 1665", museum: "Mauritshuis", wall: true, tilt: 1 },
  { id: "night-watch", qid: "Q219831" },
  { id: "winter-skaters", qid: "Q3373691", kind: "culture" },
  // — Renaissance / Northern
  { id: "birth-of-venus", qid: "Q151047", wall: true, tilt: 1.5 },
  { id: "primavera", qid: "Q549847" },
  { id: "arnolfini", qid: "Q220859" },
  { id: "hunters-in-snow", qid: "Q500985", kind: "history" },
  { id: "tower-of-babel", qid: "Q15293656", kind: "culture" },
  { id: "las-meninas", qid: "Q208758" },
  { id: "school-of-athens", commonsFile: "The School of Athens by Raffaello Sanzio da Urbino.jpg",
    title: "The School of Athens", artist: "Raphael", year: "1509–1511", museum: "Vatican Museums", kind: "essay" },
  { id: "dante-michelino", commonsFile: "Domenico-Di-Michelino-Dante-and-the-Three-Kingdoms.jpg",
    title: "Dante and the Three Kingdoms", artist: "Domenico di Michelino", year: "1465", museum: "Florence Cathedral", kind: "book" },
  // — 18th century
  { id: "young-girl-reading", qid: "Q2629423", wall: true, tilt: -1.5, kind: "word" },
  { id: "vigee-straw-hat", qid: "Q18719540" },
  { id: "labille-guiard-pupils", qid: "Q19904842" },
  // — Romantic / 19th century
  { id: "wanderer-fog", commonsFile: "Caspar David Friedrich - Wanderer above the sea of fog.jpg",
    title: "Wanderer above the Sea of Fog", artist: "Caspar David Friedrich", year: "c. 1818", museum: "Hamburger Kunsthalle", wall: true, tilt: 1 },
  { id: "fighting-temeraire", qid: "Q257580" },
  { id: "liberty-leading", commonsFile: "Eugène Delacroix - La liberté guidant le peuple.jpg",
    title: "Liberty Leading the People", artist: "Eugène Delacroix", year: "1830", museum: "Musée du Louvre", kind: "history" },
  { id: "ophelia", qid: "Q1065493" },
  { id: "lady-of-shalott", qid: "Q2445726", kind: "quote" },
  { id: "horse-fair", qid: "Q40432" },
  // — Impressionism and after
  { id: "moulin-galette", qid: "Q683274" },
  { id: "woman-parasol", qid: "Q2395218", wall: true, tilt: -2 },
  { id: "impression-sunrise", commonsFile: "Monet - Impression, Sunrise.jpg",
    title: "Impression, Sunrise", artist: "Claude Monet", year: "1872", museum: "Musée Marmottan Monet" },
  { id: "water-lilies", qid: "Q7973309" },
  { id: "paris-rainy-day", qid: "Q1452762", kind: "news" },
  { id: "dance-class", qid: "Q18758802" },
  { id: "grande-jatte", qid: "Q1044742", wall: true, tilt: 1.5 },
  { id: "the-cradle", qid: "Q5966403" },
  { id: "childs-bath", qid: "Q3172226" },
  { id: "boulevard-montmartre-night", qid: "Q3643151", kind: "news" },
  { id: "mont-sainte-victoire", qid: "Q6903107" },
  { id: "rousseau-dream", qid: "Q548141", wall: true, tilt: -1 },
  { id: "rousseau-tiger", qid: "Q960447" },
  // — Beyond Europe / prints
  { id: "great-wave", commonsFile: "「富嶽三十六景 神奈川沖浪裏」-Under the Wave off Kanagawa (Kanagawa oki nami ura), or The Great Wave, from the series Thirty-six Views of Mount Fuji (Fugaku sanjūrokkei) MET DP141042.jpg",
    title: "Under the Wave off Kanagawa (The Great Wave)", artist: "Katsushika Hokusai", year: "c. 1830–32", museum: "The Metropolitan Museum of Art", wall: true, tilt: -1.5, kind: "culture" },
  // — Early 20th century (all public domain: artist died before 1955, work pre-1929)
  { id: "the-scream", commonsFile: "Edvard Munch, 1893, The Scream, oil, tempera and pastel on cardboard, 91 x 73 cm, National Gallery of Norway.jpg",
    title: "The Scream", artist: "Edvard Munch", year: "1893", museum: "National Museum, Oslo" },
  { id: "composition-viii", commonsFile: "Kandinsky - Composition 8, July 1923.jpg",
    title: "Composition VIII", artist: "Wassily Kandinsky", year: "1923", museum: "Solomon R. Guggenheim Museum" },
  { id: "yellow-cow", commonsFile: "Franz Marc-The Yellow Cow-1911.jpg",
    title: "The Yellow Cow", artist: "Franz Marc", year: "1911", museum: "Solomon R. Guggenheim Museum" },
  { id: "af-klint-ten-largest-7", commonsFile: "Hilma af Klint - The Ten Largest No. 7 - Adulthood - 1907.jpg",
    title: "The Ten Largest, No. 7, Adulthood", artist: "Hilma af Klint", year: "1907", museum: "Hilma af Klint Foundation" },
  { id: "harmony-in-red", qid: "Q921429" },
  // — Portraits and stills the site already used (story page, kinds grid)
  { id: "proust-portrait", commonsFile: "Jacques-Emile Blanche Portrait de Marcel Proust 1892.jpg",
    title: "Portrait de Marcel Proust", artist: "Jacques-Émile Blanche", year: "1892", museum: "Musée d'Orsay", kind: "quote" },
  { id: "great-train-robbery", commonsFile: "Great train robbery still.jpg",
    title: "The Great Train Robbery (film still)", artist: "Edwin S. Porter", year: "1903", museum: "Edison Manufacturing Company", kind: "film" },
];
