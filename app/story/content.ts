import type { LegalLang } from "@/lib/legal";

/**
 * Personal narrative — one voice, no sections. Deliberately not
 * `LegalPageCopy`: privacy/support are documents, this is a letter.
 *
 * Seven short paragraphs, broken up by six clippings (STORY_CLIPPINGS, in
 * order) and one pull quote after paragraphs[1]. See StoryView.tsx for the
 * exact interleaving. Drafted with GPT-5.4 (the same "strong" model tier the
 * content pipeline in ../../../mobile/functions uses), then hand-reviewed —
 * every factual claim (dates, titles, biographical/historical details) was
 * checked for accuracy since this names real, specific works and thinkers.
 * Kept deliberately short: named examples appear as quick touches inside one
 * flowing paragraph, not as standalone essays per figure.
 */
export interface StoryCopy {
  title: string;
  /** PageIntro's hand-written (Caveat) line under the title. */
  intro: string;
  paragraphs: [string, string, string, string, string, string, string];
  /** The turn in the argument, set once in Instrument Serif italic. */
  pullQuote: string;
  signoff: string;
  /** Hand-written captions, one per STORY_CLIPPINGS entry, same order. */
  captions: [string, string, string, string, string, string];
}

/** Language-independent: which clippings, in reading order, and how far
 * each is tilted. */
export const STORY_CLIPPINGS = [
  {
    src: "/story/dante-michelino.webp",
    alt: "Domenico di Michelino, Dante and the Three Kingdoms (1465)",
    width: 800,
    height: 627,
    rotate: -1.4,
  },
  {
    src: "/story/vermeer-woman-reading-a-letter.webp",
    alt: "Johannes Vermeer, Woman Reading a Letter (c. 1663)",
    width: 670,
    height: 800,
    rotate: 1.3,
  },
  {
    src: "/story/starry-night.webp",
    alt: "Vincent van Gogh, The Starry Night (1889)",
    width: 800,
    height: 633,
    rotate: -1.6,
  },
  {
    src: "/story/proust-portrait.webp",
    alt: "Jacques-Émile Blanche, Portrait de Marcel Proust (1892)",
    width: 657,
    height: 800,
    rotate: 1.5,
  },
  {
    src: "/story/school-of-athens.webp",
    alt: "Raphael, The School of Athens (1509–1511)",
    width: 800,
    height: 558,
    rotate: -1.2,
  },
  {
    src: "/story/van-gogh-almond-blossom.webp",
    alt: "Vincent van Gogh, Almond Blossom (1890)",
    width: 800,
    height: 632,
    rotate: 1.6,
  },
] as const;

export const STORY_CONTENT: Record<LegalLang, StoryCopy> = {
  en: {
    title: "The story",
    intro: "why I made this",
    paragraphs: [
      "Not so long ago, learning a language meant entering another mind. You learned Italian to read Dante, French to hear Proust in his own rhythm, German to meet Goethe without a translator in the room.",
      "Somehow that idea shrank. Language learning became a hobby, then a streak, then a way to ask for the train station or order coffee with perfect efficiency.",
      "I wanted something else. I wanted to learn a language by getting closer to art, literature, philosophy, and film—but material like that, in a form a learner could actually read, was strangely hard to find. At the beginner level, what you mostly got was practical dialogues, travel phrases, and flat little texts that taught the language without opening any door into culture.",
      "Any Text is my attempt to make that door real: Van Gogh's restless sky in The Starry Night, Kandinsky leaving objects behind altogether, Proust catching lost time in an ordinary sensation, Tarkovsky stretching cinema until it feels like prayer, Spinoza calmly identifying God with nature, all rewritten across six CEFR levels so they stay readable from A1 to fluent.",
      "Nothing in the app is there because an algorithm thought it might perform well. The selection comes from years of my own reading and watching, mixed with museums, film history, and the literary tradition; if I don't genuinely care about something, it doesn't go in. I even use the heart button myself while reading: the films I save become a small watchlist I actually return to, and the books become my own reading list. That's also why each piece has a short note in Editorial on why it matters.",
      "The mechanic itself is simple: tap a word, see what it means, and keep reading.",
      "I built this for myself first, because I wanted this exact thing and couldn't find it. It's been my dream app for a long time, and if any part of this speaks to you, I'd be very glad for you to try it too.",
    ],
    pullQuote: "I didn't want simpler content. I wanted real culture, made readable.",
    signoff: "— Musti",
    captions: ["a map of beyond", "news held in daylight", "the sky won't settle", "memory in a dark coat", "where minds gather", "spring, almost weightless"],
  },
  tr: {
    title: "Hikâyesi",
    intro: "bunu neden yaptım",
    paragraphs: [
      "Çok uzun zaman önce değil, bir dil öğrenmek başka bir zihne girmek demekti. İtalyancayı Dante’yi okumak için, Fransızcayı Proust’u kendi ritmi içinde duymak için, Almancayı Goethe’yle arada bir çevirmen olmadan karşılaşmak için öğrenirdin.",
      "Bir şekilde bu fikir küçüldü. Dil öğrenmek önce bir hobiye, sonra bir seriye, sonra da tren istasyonunu sormanın ya da kahveyi kusursuz bir verimlilikle sipariş etmenin yoluna dönüştü.",
      "Ben başka bir şey istiyordum. Dili, sanata, edebiyata, felsefeye ve sinemaya yaklaşarak öğrenmek istiyordum—ama böyle malzemeyi, bir öğrencinin gerçekten okuyabileceği bir biçimde bulmak garip şekilde zordu. Başlangıç seviyesinde önüne daha çok pratik diyaloglar, seyahat kalıpları ve dili öğreten ama kültüre hiçbir kapı açmayan dümdüz küçük metinler çıkıyordu.",
      "Any Text, o kapıyı gerçekten var etmeye çalışma denemem: Van Gogh’un Yıldızlı Gece’deki huzursuz göğü, Kandinsky’nin nesneleri bütünüyle geride bırakışı, Proust’un sıradan bir duyumda kayıp zamanı yakalayışı, Tarkovski’nin sinemayı neredeyse dua gibi hissettirene kadar esnetişi, Spinoza’nın Tanrı’yı doğayla sakince özdeşleştirişi; hepsi A1’den akıcı seviyeye kadar okunabilir kalsın diye altı CEFR düzeyinde yeniden yazıldı.",
      "Uygulamadaki hiçbir şey, bir algoritma iyi performans gösterebilir diye orada değil. Seçki, yıllardır okuduklarımdan ve izlediklerimden, müzelerden, sinema tarihinden ve edebiyat geleneğinden geliyor; bir şeyle gerçekten ilgim yoksa uygulamaya girmiyor. Ben de okurken kalp tuşunu gerçekten kullanıyorum: işaretlediğim filmler dönüp baktığım küçük bir izleme listesine, kitaplar da kendi okuma listeme dönüşüyor. Her metinde, bu yüzden, Editörden kısmında neden önemli olduğuna dair kısa bir not da var.",
      "Mekaniğin kendisi basit: bir kelimeye dokun, anlamını gör ve okumaya devam et.",
      "Bunu önce kendim için yaptım; çünkü tam olarak böyle bir şey istiyordum ve bulamıyordum. Uzun zamandır hayalimdeki uygulama buydu; eğer sende de bir karşılığı varsa, denemeni gerçekten çok isterim.",
    ],
    pullQuote: "Daha basit içerik istemiyordum. Gerçek kültür istiyordum; okunabilir hale getirilmiş.",
    signoff: "— Musti",
    captions: ["öte dünyanın haritası", "gün ışığında bir haber", "gökyüzü durulmuyor", "koyu bir palto içinde hafıza", "zihinlerin buluştuğu yer", "neredeyse ağırlıksız bahar"],
  },
  fr: {
    title: "L’histoire",
    intro: "pourquoi je l’ai créée",
    paragraphs: [
      "Il n’y a pas si longtemps, apprendre une langue, c’était entrer dans un autre esprit. On apprenait l’italien pour lire Dante, le français pour entendre Proust dans son propre rythme, l’allemand pour rencontrer Goethe sans traducteur dans la pièce.",
      "D’une manière ou d’une autre, cette idée s’est rétrécie. L’apprentissage des langues est devenu un loisir, puis une série à maintenir, puis un moyen de demander où est la gare ou de commander un café avec une efficacité parfaite.",
      "Je voulais autre chose. Je voulais apprendre une langue en me rapprochant de l’art, de la littérature, de la philosophie et du cinéma—mais des textes de ce genre, dans une forme qu’un apprenant puisse réellement lire, étaient étrangement difficiles à trouver. Au niveau débutant, on tombait surtout sur des dialogues pratiques, des phrases de voyage et de petits textes plats qui enseignaient la langue sans ouvrir la moindre porte vers la culture.",
      "Any Text est ma tentative pour rendre cette porte réelle : le ciel agité de Van Gogh dans La Nuit étoilée, Kandinsky laissant complètement les objets derrière lui, Proust retrouvant le temps perdu dans une sensation ordinaire, Tarkovski étirant le cinéma jusqu’à ce qu’il ressemble à une prière, Spinoza identifiant calmement Dieu à la nature, le tout réécrit sur six niveaux du CECR pour rester lisible de A1 jusqu’à l’aisance.",
      "Rien dans l’app n’est là parce qu’un algorithme a pensé que cela pourrait bien marcher. La sélection vient d’années de lectures et de films vus, mêlées aux musées, à l’histoire du cinéma et à la tradition littéraire ; si quelque chose ne m’importe pas vraiment, cela n’entre pas. J’utilise même moi-même le bouton cœur en lisant : les films que j’enregistre deviennent une petite liste à voir à laquelle je reviens vraiment, et les livres ma propre liste de lecture. C’est aussi pour cela que chaque texte a une courte note dans Édito sur ce qui le rend important.",
      "Le principe lui-même est simple : touchez un mot, voyez ce qu’il veut dire, et continuez à lire.",
      "Je l’ai d’abord construite pour moi, parce que je voulais exactement cela et que je ne le trouvais nulle part. C’est l’app dont je rêvais depuis longtemps, et si cette idée vous parle un peu, j’aimerais beaucoup que vous l’essayiez aussi.",
    ],
    pullQuote: "Je ne voulais pas d’un contenu plus simple. Je voulais de la vraie culture, rendue lisible.",
    signoff: "— Musti",
    captions: ["une carte de l’au-delà", "une nouvelle dans la lumière", "le ciel ne se calme pas", "la mémoire en manteau sombre", "là où les esprits se rencontrent", "un printemps presque sans poids"],
  },
  it: {
    title: "La storia",
    intro: "perché l’ho creata",
    paragraphs: [
      "Non molto tempo fa, imparare una lingua significava entrare in un’altra mente. Si imparava l’italiano per leggere Dante, il francese per sentire Proust nel suo ritmo, il tedesco per incontrare Goethe senza un traduttore nella stanza.",
      "In qualche modo quell’idea si è ristretta. Imparare le lingue è diventato un hobby, poi una streak, poi un modo per chiedere dov’è la stazione o ordinare un caffè con perfetta efficienza.",
      "Io volevo altro. Volevo imparare una lingua avvicinandomi all’arte, alla letteratura, alla filosofia e al cinema—ma materiali di questo tipo, in una forma che uno studente potesse davvero leggere, erano stranamente difficili da trovare. A livello principiante si trovavano soprattutto dialoghi pratici, frasi da viaggio e piccoli testi piatti che insegnavano la lingua senza aprire nessuna porta verso la cultura.",
      "Any Text è il mio tentativo di rendere reale quella porta: il cielo inquieto di Van Gogh nella Notte stellata, Kandinsky che lascia del tutto indietro gli oggetti, Proust che coglie il tempo perduto in una sensazione ordinaria, Tarkovskij che tende il cinema fino a farlo sembrare una preghiera, Spinoza che identifica con calma Dio con la natura, tutto riscritto in sei livelli QCER perché resti leggibile da A1 fino alla piena scioltezza.",
      "Nulla nell’app è lì perché un algoritmo ha pensato che potesse andare bene. La selezione nasce da anni delle mie letture e visioni, mescolati a musei, storia del cinema e tradizione letteraria; se qualcosa non mi interessa davvero, non entra. Uso io stesso anche il tasto col cuore mentre leggo: i film che salvo diventano una piccola watchlist a cui torno davvero, e i libri la mia lista di lettura. È anche per questo che ogni pezzo ha una breve nota nell’Editoriale sul perché conta.",
      "Il meccanismo in sé è semplice: tocchi una parola, vedi cosa significa, e continui a leggere.",
      "L’ho costruita prima di tutto per me, perché volevo esattamente una cosa così e non riuscivo a trovarla. È l’app che ho sognato per tanto tempo, e se senti che potrebbe essere anche un po’ tua, mi farebbe davvero piacere che la provassi.",
    ],
    pullQuote: "Non volevo contenuti più semplici. Volevo cultura vera, resa leggibile.",
    signoff: "— Musti",
    captions: ["una mappa dell’aldilà", "una notizia nella luce", "il cielo non si posa", "memoria in cappotto scuro", "dove si incontrano le menti", "primavera quasi senza peso"],
  },
  es: {
    title: "La historia",
    intro: "por qué la hice",
    paragraphs: [
      "No hace tanto, aprender un idioma significaba entrar en otra mente. Uno aprendía italiano para leer a Dante, francés para oír a Proust en su propio ritmo, alemán para encontrarse con Goethe sin un traductor en la habitación.",
      "De algún modo, esa idea se encogió. Aprender idiomas se convirtió en un pasatiempo, luego en una racha, y después en una forma de preguntar por la estación o pedir un café con perfecta eficiencia.",
      "Yo quería otra cosa. Quería aprender un idioma acercándome al arte, la literatura, la filosofía y el cine—pero materiales así, en una forma que un estudiante realmente pudiera leer, eran extrañamente difíciles de encontrar. En el nivel inicial, lo que solías encontrar eran diálogos prácticos, frases de viaje y textitos planos que enseñaban la lengua sin abrir ninguna puerta a la cultura.",
      "Any Text es mi intento de hacer real esa puerta: el cielo inquieto de Van Gogh en La noche estrellada, Kandinsky dejando atrás los objetos por completo, Proust atrapando el tiempo perdido en una sensación corriente, Tarkovski estirando el cine hasta que parece una oración, Spinoza identificando con calma a Dios con la naturaleza, todo reescrito en seis niveles del MCER para que siga siendo legible desde A1 hasta la fluidez.",
      "Nada en la app está ahí porque un algoritmo pensó que podría funcionar bien. La selección viene de años de mis propias lecturas y películas vistas, mezclados con museos, historia del cine y tradición literaria; si algo no me importa de verdad, no entra. Yo mismo uso el botón del corazón mientras leo: las películas que guardo se vuelven una pequeña lista de pendientes a la que sí vuelvo, y los libros mi propia lista de lectura. Por eso también cada texto tiene una nota breve en Editorial sobre por qué importa.",
      "La mecánica en sí es simple: toca una palabra, mira qué significa y sigue leyendo.",
      "Primero la hice para mí, porque quería exactamente esto y no lograba encontrarlo. Ha sido la app con la que soñaba desde hace mucho, y si algo de todo esto te toca de cerca, me encantaría que la probaras también.",
    ],
    pullQuote: "No quería contenido más simple. Quería cultura real, hecha legible.",
    signoff: "— Musti",
    captions: ["un mapa del más allá", "noticias bajo la luz", "el cielo no se aquieta", "memoria con abrigo oscuro", "donde se reúnen las mentes", "primavera casi ingrávida"],
  },
  de: {
    title: "Die Geschichte",
    intro: "warum ich es gemacht habe",
    paragraphs: [
      "Noch gar nicht so lange her bedeutete das Lernen einer Sprache, einen anderen Geist zu betreten. Man lernte Italienisch, um Dante zu lesen, Französisch, um Proust in seinem eigenen Rhythmus zu hören, Deutsch, um Goethe zu begegnen, ohne dass ein Übersetzer im Raum saß.",
      "Irgendwie ist diese Vorstellung kleiner geworden. Sprachenlernen wurde erst ein Hobby, dann eine Serie, dann eine Möglichkeit, nach dem Bahnhof zu fragen oder mit perfekter Effizienz einen Kaffee zu bestellen.",
      "Ich wollte etwas anderes. Ich wollte eine Sprache lernen, indem ich Kunst, Literatur, Philosophie und Film näherkomme—doch Material dieser Art, in einer Form, die Lernende tatsächlich lesen können, war seltsam schwer zu finden. Auf Anfängerniveau bekam man meist praktische Dialoge, Reisesätze und kleine flache Texte, die die Sprache vermittelten, ohne irgendeine Tür zur Kultur zu öffnen.",
      "Any Text ist mein Versuch, diese Tür wirklich zu machen: Van Goghs unruhiger Himmel in Die Sternennacht, Kandinsky, der die Gegenstände ganz hinter sich lässt, Proust, der verlorene Zeit in einer gewöhnlichen Empfindung festhält, Tarkowski, der das Kino so weit dehnt, bis es wie ein Gebet wirkt, Spinoza, der Gott ruhig mit der Natur gleichsetzt—alles über sechs GER-Stufen hinweg neu geschrieben, damit es von A1 bis fließend lesbar bleibt.",
      "Nichts in der App ist dort, weil ein Algorithmus dachte, es könnte gut performen. Die Auswahl kommt aus Jahren meines eigenen Lesens und Schauens, vermischt mit Museen, Filmgeschichte und literarischer Tradition; wenn mir etwas nicht wirklich wichtig ist, kommt es nicht hinein. Ich benutze beim Lesen sogar selbst den Herz-Button: Die Filme, die ich speichere, werden zu einer kleinen Watchlist, zu der ich tatsächlich zurückkehre, und die Bücher zu meiner eigenen Leseliste. Deshalb hat jeder Text auch eine kurze Notiz in Redaktion dazu, warum er wichtig ist.",
      "Die Mechanik selbst ist einfach: Tippe auf ein Wort, sieh nach, was es bedeutet, und lies weiter.",
      "Ich habe das zuerst für mich gebaut, weil ich genau so etwas wollte und es nicht finden konnte. Es ist seit Langem meine Traum-App, und wenn dich dieser Gedanke anspricht, würde ich mich sehr freuen, wenn du sie auch ausprobierst.",
    ],
    pullQuote: "Ich wollte keine einfacheren Inhalte. Ich wollte echte Kultur, lesbar gemacht.",
    signoff: "— Musti",
    captions: ["eine karte des jenseits", "nachricht im tageslicht", "der himmel beruhigt sich nicht", "erinnerung im dunklen mantel", "wo gedanken zusammenkommen", "frühling, fast schwerelos"],
  },
  nl: {
    title: "Het verhaal",
    intro: "waarom ik dit heb gemaakt",
    paragraphs: [
      "Nog niet zo lang geleden betekende een taal leren dat je een andere geest binnenging. Je leerde Italiaans om Dante te lezen, Frans om Proust in zijn eigen ritme te horen, Duits om Goethe te ontmoeten zonder een vertaler in de kamer.",
      "Op de een of andere manier werd dat idee kleiner. Talen leren werd een hobby, daarna een streak, en daarna een manier om naar het station te vragen of met perfecte efficiëntie koffie te bestellen.",
      "Ik wilde iets anders. Ik wilde een taal leren door dichter bij kunst, literatuur, filosofie en film te komen—maar materiaal van dat soort, in een vorm die een leerling echt kon lezen, was vreemd moeilijk te vinden. Op beginnersniveau kreeg je meestal praktische dialogen, reiszinnen en vlakke kleine teksten die de taal leerden zonder een deur naar cultuur open te zetten.",
      "Any Text is mijn poging om die deur echt te maken: Van Goghs onrustige lucht in De sterrennacht, Kandinsky die voorwerpen helemaal achter zich laat, Proust die verloren tijd vangt in een alledaagse gewaarwording, Tarkovski die cinema oprekt tot het als een gebed voelt, Spinoza die God rustig met de natuur vereenzelvigt, allemaal herschreven over zes ERK-niveaus zodat het leesbaar blijft van A1 tot vloeiend.",
      "Niets in de app staat erin omdat een algoritme dacht dat het goed zou kunnen presteren. De selectie komt uit jaren van mijn eigen lezen en kijken, gemengd met musea, filmgeschiedenis en de literaire traditie; als ik ergens niet oprecht om geef, komt het er niet in. Ik gebruik zelf tijdens het lezen ook de hartknop: de films die ik bewaar worden een kleine kijklijst waar ik echt op terugkom, en de boeken mijn eigen leeslijst. Daarom heeft elk stuk ook een korte noot in Redactie over waarom het ertoe doet.",
      "De werking zelf is eenvoudig: tik op een woord, zie wat het betekent, en lees verder.",
      "Ik heb dit eerst voor mezelf gebouwd, omdat ik precies dit wilde en het nergens kon vinden. Dit is al heel lang mijn droom-app, en als dit je ook maar een beetje aanspreekt, zou ik het heel fijn vinden als je het probeert.",
    ],
    pullQuote: "Ik wilde geen eenvoudigere inhoud. Ik wilde echte cultuur, leesbaar gemaakt.",
    signoff: "— Musti",
    captions: ["een kaart van het hiernamaals", "nieuws in daglicht", "de lucht komt niet tot rust", "herinnering in een donkere jas", "waar geesten samenkomen", "lente, bijna gewichtloos"],
  },
};
