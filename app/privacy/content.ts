import type { LegalLang, LegalPageCopy } from "@/lib/legal";

/**
 * Privacy policy copy, one entry per legal language. English is the
 * authoritative source; the other six are careful human-quality
 * translations, not machine-literal ones. Section count/order (13) is the
 * same in every language.
 */
export const PRIVACY_CONTENT: Record<LegalLang, LegalPageCopy> = {
  en: {
    title: `Privacy Policy`,
    intro: `Any Text ("the app", "we", "us") is a language-learning reading app for iPhone. This page explains what information the app collects, why, and how you can control it. We've tried to write it in plain language rather than dense legal boilerplate — if anything is unclear, just email us.`,
    sections: [
      {
        heading: `Who we are`,
        body: [
          `Any Text is built and operated by an individual developer, Mustafa Gül, based in the European Union. If you have any question about this policy or your data, write to mstfgul00@gmail.com — that inbox is read by the person who actually builds the app, not a support team.`,
        ],
      },
      {
        heading: `What we collect, and why`,
        body: [
          `If you sign in (optional — with Apple or Google; there's no separate account/password system), we receive the email address, display name, and a unique account ID that Apple or Google give us. We store these to know it's you when you come back, and to keep your subscription and preferences tied to your account.`,
          `Your reading preferences — your reading language, the language you want translations in, and your current CEFR level (A1–C2) — are stored against your account (if you're signed in) so they follow you across devices, and otherwise stay only on your device.`,
          `Subscription status: purchases are handled entirely by Apple through the App Store, and we use RevenueCat to check whether you have an active subscription. This is done anonymously — we never link your purchase history to your Apple ID, email, or account. RevenueCat never sees your card details; Apple handles payment directly.`,
          `We do not require you to sign in or subscribe to browse what's available in the app — an account and a subscription are only needed to actually open and read the full text of an article, book chapter, or video transcript.`,
        ],
      },
      {
        heading: `What we don't collect`,
        body: [
          `We don't use any analytics, advertising, or crash-reporting tools. There is no tracking of any kind, and the app never shows Apple's "Allow Tracking" prompt because it has nothing to ask permission for — we don't track you across apps or websites, full stop.`,
        ],
      },
      {
        heading: `What stays only on your device`,
        body: [
          `Your saved words, your reading progress, your favorites, your reading-size and theme preferences, and your flashcard review history are all stored locally on your iPhone and are never sent to our servers. If you delete the app, this data is gone; we never had a copy.`,
        ],
      },
      {
        heading: `Push notifications`,
        body: [
          `If you allow notifications, your device subscribes to a daily-reminder topic based on your chosen native language (for example, a topic for Turkish speakers, a separate one for German speakers). This is a broadcast topic, not a message addressed to you personally — we don't keep a list of which individual devices are subscribed.`,
        ],
      },
      {
        heading: `The "favorited by" counter`,
        body: [
          `When you favorite a piece of content, we increase a simple global counter for that specific item, so everyone can see how many times it's been favorited across all users. This counter is anonymous and cumulative — we don't keep any record of who favorited what, only a running total per item.`,
        ],
      },
      {
        heading: `Third parties we work with`,
        body: [
          `Google Firebase (Authentication, Cloud Firestore database, Cloud Messaging for push, Cloud Storage) hosts our sign-in, database, and content delivery, in an EU data region.`,
          `Apple provides Sign in with Apple, App Store billing, and push notification delivery. Google provides Google Sign-In, as an alternative to Apple. RevenueCat handles subscription/entitlement management, used anonymously as described above.`,
          `Video content in the app is embedded using YouTube's privacy-enhanced mode (youtube-nocookie.com), which avoids setting tracking cookies until you actually interact with a video.`,
          `We don't sell your data to anyone, and we don't share it with advertisers.`,
        ],
      },
      {
        heading: `Data retention and deletion`,
        body: [
          `If you're signed in, you can delete your account at any time from Settings → Account → Delete Account in the app. This permanently deletes your profile from our database, revokes your Sign in with Apple authorization (if applicable), deletes your Firebase authentication record, and wipes all locally-stored data (saved words, progress, favorites) from your device. This can't be undone.`,
          `If you never sign in, there's no account data to delete — everything is already local to your device, and uninstalling the app removes it.`,
        ],
      },
      {
        heading: `Your rights`,
        body: [
          `If you're in the European Economic Area (or anywhere with similar data-protection law), you have the right to access, correct, export, or delete your personal data, and to object to how it's processed. In-app account deletion covers most of this automatically; for anything else, email mstfgul00@gmail.com and we'll sort it out directly. You also have the right to lodge a complaint with your local data protection authority.`,
        ],
      },
      {
        heading: `Children's privacy`,
        body: [
          `Any Text is not directed at children, and we don't knowingly collect personal information from children. If you believe a child has provided us with personal data, contact us and we'll delete it.`,
        ],
      },
      {
        heading: `Security`,
        body: [
          `All communication between the app and our servers uses standard HTTPS/TLS encryption. Payment information is never handled by us or seen by us — it's handled entirely by Apple through StoreKit.`,
        ],
      },
      {
        heading: `Changes to this policy`,
        body: [
          `If this policy changes in a meaningful way, we'll update the date at the top of this page. We'd encourage checking back occasionally, but we won't make changes that reduce your rights without making that clear.`,
        ],
      },
      {
        heading: `Contact`,
        body: [`Questions, requests, or just feedback: mstfgul00@gmail.com`],
      },
    ],
  },
  tr: {
    title: `Gizlilik Politikası`,
    intro: `Any Text ("uygulama", "biz") iPhone için bir dil öğrenme ve okuma uygulamasıdır. Bu sayfa uygulamanın hangi bilgileri, neden topladığını ve bunları nasıl kontrol edebileceğinizi anlatır. Ağır bir hukuk diliyle değil, sade bir dille yazmaya çalıştık — anlaşılmayan bir şey olursa bize e-posta atmanız yeterli.`,
    sections: [
      {
        heading: `Kim olduğumuz`,
        body: [
          `Any Text, Avrupa Birliği merkezli bağımsız bir geliştirici olan Mustafa Gül tarafından geliştirilir ve işletilir. Bu politika ya da verileriniz hakkında herhangi bir sorunuz olursa mstfgul00@gmail.com adresine yazabilirsiniz — bu kutuyu bir destek ekibi değil, uygulamayı bizzat geliştiren kişi okur.`,
        ],
      },
      {
        heading: `Neyi, neden topluyoruz`,
        body: [
          `Oturum açarsanız (isteğe bağlı — Apple veya Google ile; ayrı bir hesap/şifre sistemi yoktur), Apple veya Google'ın bize verdiği e-posta adresini, görünen adınızı ve benzersiz bir hesap kimliğini alırız. Bunları, geri döndüğünüzde sizi tanımak ve aboneliğinizle tercihlerinizi hesabınıza bağlı tutmak için saklarız.`,
          `Okuma tercihleriniz — okuma diliniz, çevirileri hangi dilde görmek istediğiniz ve güncel CEFR seviyeniz (A1–C2) — oturum açıksanız hesabınıza kaydedilir, böylece tüm cihazlarınızda sizi takip eder; oturum açık değilseniz yalnızca cihazınızda kalır.`,
          `Abonelik durumu: satın almalar tamamen Apple tarafından App Store üzerinden yürütülür; aktif bir aboneliğiniz olup olmadığını kontrol etmek için RevenueCat kullanırız. Bu tamamen anonim şekilde yapılır — satın alma geçmişinizi hiçbir zaman Apple ID'nize, e-postanıza ya da hesabınıza bağlamayız. RevenueCat kart bilgilerinizi asla görmez; ödemeyi doğrudan Apple yönetir.`,
          `Uygulamada nelerin bulunduğuna göz atmak için oturum açmanızı ya da abone olmanızı istemeyiz — bir hesap ve abonelik yalnızca bir haberin, kitap bölümünün ya da video metninin tam içeriğini açıp okumak için gereklidir.`,
        ],
      },
      {
        heading: `Neyi toplamıyoruz`,
        body: [
          `Herhangi bir analiz, reklam ya da çökme raporlama aracı kullanmıyoruz. Hiçbir türde takip yoktur ve uygulama, Apple'ın izleme izni istemini hiçbir zaman göstermez, çünkü izin isteyecek bir şeyimiz yoktur — sizi başka uygulamalar ya da web siteleri arasında takip etmiyoruz, nokta.`,
        ],
      },
      {
        heading: `Yalnızca cihazınızda kalanlar`,
        body: [
          `Kaydettiğiniz kelimeler, okuma ilerlemeniz, favorileriniz, okuma boyutu ve tema tercihleriniz ile kelime tekrarı geçmişiniz tamamen iPhone'unuzda saklanır ve sunucularımıza hiçbir zaman gönderilmez. Uygulamayı silerseniz bu veriler de gider; zaten bir kopyasını hiç tutmadık.`,
        ],
      },
      {
        heading: `Push bildirimleri`,
        body: [
          `Bildirimlere izin verirseniz cihazınız, seçtiğiniz ana dile göre günlük hatırlatma konusuna abone olur (örneğin Türkçe konuşanlar için bir konu, Almanca konuşanlar için ayrı bir konu). Bu, size özel gönderilen bir mesaj değil, yayın konusudur — hangi cihazların abone olduğuna dair bir liste tutmayız.`,
        ],
      },
      {
        heading: `"Kaç kişi favoriledi" sayacı`,
        body: [
          `Bir içeriği favorilediğinizde, o içeriğe ait basit, genel bir sayacı bir artırırız; böylece herkes o içeriğin tüm kullanıcılar arasında kaç kez favorilendiğini görebilir. Bu sayaç anonim ve toplamdır — kimin neyi favorilediğine dair hiçbir kayıt tutmayız, yalnızca öğe başına bir toplam sayı vardır.`,
        ],
      },
      {
        heading: `Birlikte çalıştığımız üçüncü taraflar`,
        body: [
          `Google Firebase (Authentication, Cloud Firestore veritabanı, push için Cloud Messaging, Cloud Storage) oturum açma, veritabanı ve içerik teslimimizi bir AB veri bölgesinde barındırır.`,
          `Apple; Apple ile Oturum Aç, App Store faturalandırması ve push bildirim teslimini sağlar. Google ise Apple'a alternatif olarak kendi oturum açma seçeneğini sunar. RevenueCat, yukarıda açıklandığı gibi anonim olarak kullanılan abonelik/yetki yönetimini üstlenir.`,
          `Uygulamadaki video içerikleri, bir videoyla gerçekten etkileşime geçene kadar takip çerezi koymayan YouTube'un gizlilik odaklı modu (youtube-nocookie.com) ile gömülür.`,
          `Verilerinizi kimseye satmıyoruz ve reklamverenlerle paylaşmıyoruz.`,
        ],
      },
      {
        heading: `Veri saklama ve silme`,
        body: [
          `Oturum açıksanız hesabınızı istediğiniz zaman uygulama içinde Ayarlar → Hesap → Hesabı sil yolundan silebilirsiniz. Bu işlem profilinizi veritabanımızdan kalıcı olarak siler, Apple ile Oturum Aç yetkilendirmenizi (varsa) iptal eder, Firebase kimlik doğrulama kaydınızı siler ve cihazınızda yerel olarak tutulan tüm verileri (kaydedilen kelimeler, ilerleme, favoriler) temizler. Bu işlem geri alınamaz.`,
          `Hiç oturum açmadıysanız silinecek bir hesap verisi yoktur — her şey zaten yalnızca cihazınızdadır ve uygulamayı kaldırmak bunları da kaldırır.`,
        ],
      },
      {
        heading: `Haklarınız`,
        body: [
          `Avrupa Ekonomik Alanı'nda (ya da benzer bir veri koruma mevzuatının geçerli olduğu herhangi bir yerde) bulunuyorsanız, kişisel verilerinize erişme, bunları düzeltme, dışa aktarma ya da silme ve işlenme biçimine itiraz etme hakkına sahipsiniz. Uygulama içi hesap silme bunun büyük kısmını otomatik olarak karşılar; geri kalan her şey için mstfgul00@gmail.com adresine e-posta gönderin, doğrudan hallederiz. Ayrıca yerel veri koruma otoritenize şikâyette bulunma hakkına da sahipsiniz.`,
        ],
      },
      {
        heading: `Çocukların gizliliği`,
        body: [
          `Any Text çocuklara yönelik değildir ve bilerek çocuklardan kişisel bilgi toplamayız. Bir çocuğun bize kişisel veri sağladığını düşünüyorsanız bizimle iletişime geçin, verileri sileriz.`,
        ],
      },
      {
        heading: `Güvenlik`,
        body: [
          `Uygulama ile sunucularımız arasındaki tüm iletişim standart HTTPS/TLS şifrelemesi kullanır. Ödeme bilgileri bizim tarafımızdan hiçbir zaman işlenmez ya da görülmez — bu işlem tamamen Apple tarafından StoreKit aracılığıyla yürütülür.`,
        ],
      },
      {
        heading: `Bu politikadaki değişiklikler`,
        body: [
          `Bu politika anlamlı bir şekilde değişirse, bu sayfanın en üstündeki tarihi güncelleriz. Ara sıra tekrar kontrol etmenizi öneririz, ama haklarınızı azaltan değişiklikleri bunu açıkça belirtmeden yapmayız.`,
        ],
      },
      {
        heading: `İletişim`,
        body: [`Sorularınız, talepleriniz ya da yalnızca geri bildiriminiz için: mstfgul00@gmail.com`],
      },
    ],
  },
  fr: {
    title: `Politique de confidentialité`,
    intro: `Any Text (« l'application », « nous ») est une application de lecture pour apprendre les langues, sur iPhone. Cette page explique quelles informations l'application collecte, pourquoi, et comment vous pouvez les contrôler. Nous avons essayé de l'écrire dans un langage clair plutôt que dans un jargon juridique dense — si quelque chose n'est pas clair, écrivez-nous simplement par e-mail.`,
    sections: [
      {
        heading: `Qui nous sommes`,
        body: [
          `Any Text est conçue et exploitée par un développeur indépendant, Mustafa Gül, basé dans l'Union européenne. Pour toute question sur cette politique ou vos données, écrivez à mstfgul00@gmail.com — cette adresse est lue par la personne qui développe réellement l'application, pas par une équipe support.`,
        ],
      },
      {
        heading: `Ce que nous collectons, et pourquoi`,
        body: [
          `Si vous vous connectez (facultatif — avec Apple ou Google ; il n'existe pas de système de compte/mot de passe séparé), nous recevons l'adresse e-mail, le nom affiché et un identifiant de compte unique que nous transmet Apple ou Google. Nous les conservons pour vous reconnaître à votre retour et pour garder votre abonnement et vos préférences liés à votre compte.`,
          `Vos préférences de lecture — votre langue de lecture, la langue dans laquelle vous souhaitez voir les traductions, et votre niveau CEFR actuel (A1–C2) — sont enregistrées sur votre compte (si vous êtes connecté), afin de vous suivre sur tous vos appareils ; sinon, elles restent uniquement sur votre appareil.`,
          `Statut de l'abonnement : les achats sont gérés entièrement par Apple via l'App Store, et nous utilisons RevenueCat pour vérifier si vous avez un abonnement actif. Cela se fait de manière anonyme — nous ne relions jamais votre historique d'achat à votre identifiant Apple, votre e-mail ou votre compte. RevenueCat ne voit jamais vos coordonnées bancaires ; le paiement est géré directement par Apple.`,
          `Nous ne vous demandons pas de vous connecter ou de vous abonner pour parcourir ce que propose l'application — un compte et un abonnement ne sont nécessaires que pour ouvrir et lire le texte complet d'un article, d'un chapitre de livre ou d'une transcription vidéo.`,
        ],
      },
      {
        heading: `Ce que nous ne collectons pas`,
        body: [
          `Nous n'utilisons aucun outil d'analyse, de publicité ou de rapport de plantage. Il n'y a aucun suivi d'aucune sorte, et l'application n'affiche jamais la demande d'autorisation de suivi d'Apple, car elle n'a rien à demander comme autorisation — nous ne vous suivons pas d'une application ou d'un site à l'autre, un point c'est tout.`,
        ],
      },
      {
        heading: `Ce qui reste uniquement sur votre appareil`,
        body: [
          `Vos mots enregistrés, votre progression de lecture, vos favoris, vos préférences de taille de texte et de thème, ainsi que votre historique de révision des cartes mémoire sont tous stockés localement sur votre iPhone et ne sont jamais envoyés à nos serveurs. Si vous supprimez l'application, ces données disparaissent ; nous n'en avons jamais eu de copie.`,
        ],
      },
      {
        heading: `Notifications push`,
        body: [
          `Si vous autorisez les notifications, votre appareil s'abonne à un thème de rappel quotidien basé sur la langue maternelle que vous avez choisie (par exemple, un thème pour les locuteurs turcophones, un autre pour les germanophones). Il s'agit d'un thème de diffusion, pas d'un message qui vous est adressé personnellement — nous ne conservons pas de liste des appareils individuellement abonnés.`,
        ],
      },
      {
        heading: `Le compteur « mis en favori par »`,
        body: [
          `Lorsque vous mettez un contenu en favori, nous incrémentons un simple compteur global pour cet élément précis, afin que tout le monde puisse voir combien de fois il a été mis en favori par l'ensemble des utilisateurs. Ce compteur est anonyme et cumulatif — nous ne conservons aucune trace de qui a mis quoi en favori, seulement un total courant par élément.`,
        ],
      },
      {
        heading: `Les tiers avec lesquels nous travaillons`,
        body: [
          `Google Firebase (Authentication, base de données Cloud Firestore, Cloud Messaging pour les notifications, Cloud Storage) héberge notre connexion, notre base de données et la diffusion de nos contenus, dans une région de données située dans l'UE.`,
          `Apple fournit la connexion avec Apple, la facturation via l'App Store et la distribution des notifications push. Google fournit la connexion avec Google, comme alternative à Apple. RevenueCat gère les abonnements et les droits d'accès, utilisé de manière anonyme comme décrit ci-dessus.`,
          `Le contenu vidéo de l'application est intégré via le mode renforcé de confidentialité de YouTube (youtube-nocookie.com), qui évite de déposer des cookies de suivi tant que vous n'interagissez pas réellement avec une vidéo.`,
          `Nous ne vendons vos données à personne, et nous ne les partageons pas avec des annonceurs.`,
        ],
      },
      {
        heading: `Conservation et suppression des données`,
        body: [
          `Si vous êtes connecté, vous pouvez supprimer votre compte à tout moment depuis Réglages → Compte → Supprimer le compte dans l'application. Cela supprime définitivement votre profil de notre base de données, révoque votre autorisation de connexion avec Apple (le cas échéant), supprime votre enregistrement d'authentification Firebase, et efface toutes les données stockées localement (mots enregistrés, progression, favoris) de votre appareil. Cette action est irréversible.`,
          `Si vous ne vous connectez jamais, il n'y a aucune donnée de compte à supprimer — tout est déjà local à votre appareil, et désinstaller l'application les supprime.`,
        ],
      },
      {
        heading: `Vos droits`,
        body: [
          `Si vous vous trouvez dans l'Espace économique européen (ou dans tout endroit disposant d'une législation similaire sur la protection des données), vous avez le droit d'accéder à vos données personnelles, de les corriger, de les exporter ou de les supprimer, et de vous opposer à la façon dont elles sont traitées. La suppression de compte dans l'application couvre automatiquement l'essentiel de cela ; pour tout le reste, écrivez à mstfgul00@gmail.com et nous nous en occuperons directement. Vous avez également le droit de déposer une plainte auprès de votre autorité locale de protection des données.`,
        ],
      },
      {
        heading: `Confidentialité des enfants`,
        body: [
          `Any Text ne s'adresse pas aux enfants, et nous ne collectons pas sciemment d'informations personnelles auprès d'enfants. Si vous pensez qu'un enfant nous a fourni des données personnelles, contactez-nous et nous les supprimerons.`,
        ],
      },
      {
        heading: `Sécurité`,
        body: [
          `Toutes les communications entre l'application et nos serveurs utilisent un chiffrement HTTPS/TLS standard. Les informations de paiement ne sont jamais traitées ni consultées par nous — elles sont gérées entièrement par Apple via StoreKit.`,
        ],
      },
      {
        heading: `Modifications de cette politique`,
        body: [
          `Si cette politique change de manière significative, nous mettrons à jour la date en haut de cette page. Nous vous encourageons à revenir de temps en temps, mais nous n'apporterons pas de changements réduisant vos droits sans le préciser clairement.`,
        ],
      },
      {
        heading: `Contact`,
        body: [`Questions, demandes, ou simplement un retour : mstfgul00@gmail.com`],
      },
    ],
  },
  it: {
    title: `Informativa sulla privacy`,
    intro: `Any Text ("l'app", "noi") è un'app di lettura per l'apprendimento delle lingue, per iPhone. Questa pagina spiega quali informazioni raccoglie l'app, perché, e come puoi controllarle. Abbiamo cercato di scriverla in un linguaggio semplice invece che nel solito gergo legale — se qualcosa non è chiaro, scrivici pure una email.`,
    sections: [
      {
        heading: `Chi siamo`,
        body: [
          `Any Text è creata e gestita da uno sviluppatore indipendente, Mustafa Gül, con sede nell'Unione Europea. Per qualsiasi domanda su questa informativa o sui tuoi dati, scrivi a mstfgul00@gmail.com — quella casella di posta è letta dalla persona che sviluppa davvero l'app, non da un team di assistenza.`,
        ],
      },
      {
        heading: `Cosa raccogliamo, e perché`,
        body: [
          `Se accedi (facoltativo — con Apple o Google; non esiste un sistema separato di account/password), riceviamo l'indirizzo email, il nome visualizzato e un ID account univoco che ci forniscono Apple o Google. Li conserviamo per riconoscerti quando torni e per mantenere il tuo abbonamento e le tue preferenze collegati al tuo account.`,
          `Le tue preferenze di lettura — la lingua di lettura, la lingua in cui vuoi vedere le traduzioni e il tuo livello CEFR attuale (A1–C2) — vengono salvate sul tuo account (se hai effettuato l'accesso), così ti seguono su tutti i dispositivi; altrimenti restano solo sul tuo dispositivo.`,
          `Stato dell'abbonamento: gli acquisti sono gestiti interamente da Apple tramite l'App Store, e usiamo RevenueCat per verificare se hai un abbonamento attivo. Questo avviene in modo anonimo — non colleghiamo mai la cronologia dei tuoi acquisti al tuo Apple ID, alla tua email o al tuo account. RevenueCat non vede mai i dati della tua carta; il pagamento è gestito direttamente da Apple.`,
          `Non ti chiediamo di accedere o abbonarti per sfogliare i contenuti disponibili nell'app — un account e un abbonamento servono solo per aprire e leggere per intero un articolo, un capitolo di libro o la trascrizione di un video.`,
        ],
      },
      {
        heading: `Cosa non raccogliamo`,
        body: [
          `Non usiamo alcuno strumento di analisi, pubblicità o segnalazione di arresti anomali. Non c'è alcun tipo di tracciamento, e l'app non mostra mai la richiesta di autorizzazione al tracciamento di Apple, perché non ha nulla per cui chiedere il permesso — non ti tracciamo tra app o siti web, punto.`,
        ],
      },
      {
        heading: `Cosa resta solo sul tuo dispositivo`,
        body: [
          `Le parole salvate, i tuoi progressi di lettura, i tuoi preferiti, le preferenze di dimensione del testo e tema, e la cronologia delle ripetizioni con le flashcard sono tutti salvati localmente sul tuo iPhone e non vengono mai inviati ai nostri server. Se elimini l'app, questi dati spariscono; non ne abbiamo mai avuto una copia.`,
        ],
      },
      {
        heading: `Notifiche push`,
        body: [
          `Se consenti le notifiche, il tuo dispositivo si iscrive a un argomento di promemoria giornaliero basato sulla lingua madre che hai scelto (ad esempio un argomento per chi parla turco, uno separato per chi parla tedesco). Si tratta di un argomento broadcast, non di un messaggio indirizzato personalmente a te — non teniamo un elenco di quali singoli dispositivi sono iscritti.`,
        ],
      },
      {
        heading: `Il contatore "nei preferiti di"`,
        body: [
          `Quando aggiungi un contenuto ai preferiti, aumentiamo un semplice contatore globale per quell'elemento specifico, così tutti possono vedere quante volte è stato aggiunto ai preferiti da tutti gli utenti. Questo contatore è anonimo e cumulativo — non conserviamo alcuna registrazione di chi ha aggiunto cosa ai preferiti, solo un totale progressivo per elemento.`,
        ],
      },
      {
        heading: `Terze parti con cui collaboriamo`,
        body: [
          `Google Firebase (Authentication, database Cloud Firestore, Cloud Messaging per le notifiche push, Cloud Storage) ospita il nostro accesso, il nostro database e la distribuzione dei contenuti, in una regione dati dell'UE.`,
          `Apple fornisce l'accesso con Apple, la fatturazione tramite App Store e la consegna delle notifiche push. Google fornisce l'accesso con Google, come alternativa ad Apple. RevenueCat gestisce abbonamenti e diritti d'uso, utilizzato in modo anonimo come descritto sopra.`,
          `I contenuti video nell'app vengono incorporati usando la modalità di YouTube potenziata per la privacy (youtube-nocookie.com), che evita di impostare cookie di tracciamento finché non interagisci realmente con un video.`,
          `Non vendiamo i tuoi dati a nessuno, e non li condividiamo con inserzionisti pubblicitari.`,
        ],
      },
      {
        heading: `Conservazione ed eliminazione dei dati`,
        body: [
          `Se hai effettuato l'accesso, puoi eliminare il tuo account in qualsiasi momento da Impostazioni → Account → Elimina account nell'app. Questo elimina definitivamente il tuo profilo dal nostro database, revoca la tua autorizzazione di accesso con Apple (se applicabile), elimina il tuo record di autenticazione Firebase e cancella tutti i dati salvati localmente (parole salvate, progressi, preferiti) dal tuo dispositivo. Questa operazione non può essere annullata.`,
          `Se non accedi mai, non ci sono dati di account da eliminare — tutto è già locale sul tuo dispositivo, e disinstallare l'app li rimuove.`,
        ],
      },
      {
        heading: `I tuoi diritti`,
        body: [
          `Se ti trovi nello Spazio Economico Europeo (o in un luogo con una legislazione simile sulla protezione dei dati), hai il diritto di accedere ai tuoi dati personali, correggerli, esportarli o eliminarli, e di opporti al modo in cui vengono trattati. L'eliminazione dell'account dall'app copre automaticamente gran parte di questo; per tutto il resto, scrivi a mstfgul00@gmail.com e ce ne occuperemo direttamente. Hai anche il diritto di presentare un reclamo alla tua autorità locale di protezione dei dati.`,
        ],
      },
      {
        heading: `Privacy dei minori`,
        body: [
          `Any Text non è rivolta ai minori, e non raccogliamo consapevolmente informazioni personali da minori. Se ritieni che un minore ci abbia fornito dati personali, contattaci e li elimineremo.`,
        ],
      },
      {
        heading: `Sicurezza`,
        body: [
          `Tutte le comunicazioni tra l'app e i nostri server usano la normale crittografia HTTPS/TLS. Le informazioni di pagamento non sono mai gestite né viste da noi — sono gestite interamente da Apple tramite StoreKit.`,
        ],
      },
      {
        heading: `Modifiche a questa informativa`,
        body: [
          `Se questa informativa cambia in modo sostanziale, aggiorneremo la data in cima a questa pagina. Ti consigliamo di controllare ogni tanto, ma non apporteremo modifiche che riducono i tuoi diritti senza renderlo chiaro.`,
        ],
      },
      {
        heading: `Contatti`,
        body: [`Domande, richieste, o semplicemente un feedback: mstfgul00@gmail.com`],
      },
    ],
  },
  es: {
    title: `Política de privacidad`,
    intro: `Any Text ("la app", "nosotros") es una aplicación de lectura para aprender idiomas, para iPhone. Esta página explica qué información recopila la app, por qué, y cómo puedes controlarla. Hemos intentado escribirla en un lenguaje claro en lugar de en la típica jerga legal — si algo no queda claro, escríbenos por correo.`,
    sections: [
      {
        heading: `Quiénes somos`,
        body: [
          `Any Text está creada y operada por un desarrollador independiente, Mustafa Gül, con sede en la Unión Europea. Si tienes alguna pregunta sobre esta política o tus datos, escribe a mstfgul00@gmail.com — ese correo lo lee la persona que realmente desarrolla la app, no un equipo de soporte.`,
        ],
      },
      {
        heading: `Qué recopilamos, y por qué`,
        body: [
          `Si inicias sesión (opcional — con Apple o Google; no existe un sistema independiente de cuenta/contraseña), recibimos el correo electrónico, el nombre visible y un ID de cuenta único que nos proporciona Apple o Google. Los guardamos para reconocerte cuando vuelvas y para mantener tu suscripción y tus preferencias vinculadas a tu cuenta.`,
          `Tus preferencias de lectura — tu idioma de lectura, el idioma en el que quieres ver las traducciones, y tu nivel CEFR actual (A1–C2) — se guardan en tu cuenta (si has iniciado sesión), de modo que te acompañan en todos tus dispositivos; si no, permanecen solo en tu dispositivo.`,
          `Estado de la suscripción: las compras las gestiona Apple por completo a través de la App Store, y usamos RevenueCat para comprobar si tienes una suscripción activa. Esto se hace de forma anónima — nunca vinculamos tu historial de compras con tu Apple ID, tu correo electrónico o tu cuenta. RevenueCat nunca ve los datos de tu tarjeta; el pago lo gestiona Apple directamente.`,
          `No es necesario iniciar sesión ni suscribirte para explorar lo que ofrece la app — una cuenta y una suscripción solo son necesarias para abrir y leer el texto completo de un artículo, un capítulo de libro o la transcripción de un vídeo.`,
        ],
      },
      {
        heading: `Qué no recopilamos`,
        body: [
          `No usamos ninguna herramienta de analítica, publicidad o informes de fallos. No hay ningún tipo de seguimiento, y la app nunca muestra el aviso de permiso de seguimiento de Apple, porque no tiene nada para lo que pedir permiso — no te seguimos entre aplicaciones ni sitios web, punto.`,
        ],
      },
      {
        heading: `Qué permanece solo en tu dispositivo`,
        body: [
          `Tus palabras guardadas, tu progreso de lectura, tus favoritos, tus preferencias de tamaño de texto y tema, y tu historial de repaso de tarjetas se guardan localmente en tu iPhone y nunca se envían a nuestros servidores. Si eliminas la app, estos datos desaparecen; nunca tuvimos una copia de ellos.`,
        ],
      },
      {
        heading: `Notificaciones push`,
        body: [
          `Si permites las notificaciones, tu dispositivo se suscribe a un tema de recordatorio diario según el idioma nativo que hayas elegido (por ejemplo, un tema para hablantes de turco, otro distinto para hablantes de alemán). Es un tema de difusión general, no un mensaje dirigido personalmente a ti — no llevamos una lista de qué dispositivos concretos están suscritos.`,
        ],
      },
      {
        heading: `El contador "en favoritos de"`,
        body: [
          `Cuando marcas un contenido como favorito, aumentamos un simple contador global para ese elemento en concreto, para que todo el mundo pueda ver cuántas veces se ha marcado como favorito entre todos los usuarios. Este contador es anónimo y acumulativo — no guardamos ningún registro de quién marcó qué como favorito, solo un total acumulado por elemento.`,
        ],
      },
      {
        heading: `Terceros con los que trabajamos`,
        body: [
          `Google Firebase (Authentication, base de datos Cloud Firestore, Cloud Messaging para notificaciones push, Cloud Storage) aloja nuestro inicio de sesión, nuestra base de datos y la entrega de contenido, en una región de datos de la UE.`,
          `Apple proporciona el inicio de sesión con Apple, la facturación de la App Store y la entrega de notificaciones push. Google proporciona el inicio de sesión con Google, como alternativa a Apple. RevenueCat gestiona las suscripciones y los derechos de acceso, utilizado de forma anónima como se describe arriba.`,
          `El contenido en vídeo de la app se incorpora usando el modo de privacidad reforzada de YouTube (youtube-nocookie.com), que evita colocar cookies de seguimiento hasta que realmente interactúas con un vídeo.`,
          `No vendemos tus datos a nadie, y no los compartimos con anunciantes.`,
        ],
      },
      {
        heading: `Conservación y eliminación de datos`,
        body: [
          `Si has iniciado sesión, puedes eliminar tu cuenta en cualquier momento desde Ajustes → Cuenta → Eliminar cuenta dentro de la app. Esto elimina permanentemente tu perfil de nuestra base de datos, revoca tu autorización de inicio de sesión con Apple (si corresponde), elimina tu registro de autenticación de Firebase, y borra todos los datos guardados localmente (palabras guardadas, progreso, favoritos) de tu dispositivo. Esto no se puede deshacer.`,
          `Si nunca inicias sesión, no hay datos de cuenta que eliminar — todo está ya solo en tu dispositivo, y desinstalar la app los elimina.`,
        ],
      },
      {
        heading: `Tus derechos`,
        body: [
          `Si te encuentras en el Espacio Económico Europeo (o en cualquier lugar con una legislación de protección de datos similar), tienes derecho a acceder a tus datos personales, corregirlos, exportarlos o eliminarlos, y a oponerte a cómo se procesan. La eliminación de cuenta dentro de la app cubre automáticamente la mayor parte de esto; para cualquier otra cosa, escribe a mstfgul00@gmail.com y lo resolveremos directamente. También tienes derecho a presentar una reclamación ante tu autoridad local de protección de datos.`,
        ],
      },
      {
        heading: `Privacidad de los menores`,
        body: [
          `Any Text no está dirigida a menores, y no recopilamos conscientemente información personal de menores. Si crees que un menor nos ha proporcionado datos personales, contáctanos y los eliminaremos.`,
        ],
      },
      {
        heading: `Seguridad`,
        body: [
          `Toda la comunicación entre la app y nuestros servidores usa cifrado HTTPS/TLS estándar. Nosotros nunca gestionamos ni vemos la información de pago — la gestiona Apple por completo a través de StoreKit.`,
        ],
      },
      {
        heading: `Cambios en esta política`,
        body: [
          `Si esta política cambia de forma significativa, actualizaremos la fecha en la parte superior de esta página. Te animamos a revisarla de vez en cuando, pero no haremos cambios que reduzcan tus derechos sin dejarlo claro.`,
        ],
      },
      {
        heading: `Contacto`,
        body: [`Preguntas, solicitudes, o simplemente algún comentario: mstfgul00@gmail.com`],
      },
    ],
  },
  de: {
    title: `Datenschutzerklärung`,
    intro: `Any Text („die App", „wir") ist eine Lese-App zum Sprachenlernen für iPhone. Diese Seite erklärt, welche Informationen die App sammelt, warum, und wie Sie das kontrollieren können. Wir haben versucht, das in klarer Sprache zu schreiben statt in dichtem Juristendeutsch — falls etwas unklar ist, schreiben Sie uns einfach eine E-Mail.`,
    sections: [
      {
        heading: `Wer wir sind`,
        body: [
          `Any Text wird von einem einzelnen Entwickler, Mustafa Gül, mit Sitz in der Europäischen Union entwickelt und betrieben. Bei Fragen zu dieser Erklärung oder Ihren Daten schreiben Sie an mstfgul00@gmail.com — dieses Postfach liest die Person, die die App tatsächlich baut, kein Support-Team.`,
        ],
      },
      {
        heading: `Was wir sammeln, und warum`,
        body: [
          `Wenn Sie sich anmelden (optional — mit Apple oder Google; es gibt kein separates Konto-/Passwort-System), erhalten wir die E-Mail-Adresse, den Anzeigenamen und eine eindeutige Konto-ID, die uns Apple oder Google mitteilen. Wir speichern diese, um Sie bei Ihrer Rückkehr wiederzuerkennen und Ihr Abonnement sowie Ihre Einstellungen an Ihr Konto zu binden.`,
          `Ihre Leseeinstellungen — Ihre Lesesprache, die Sprache, in der Sie Übersetzungen sehen möchten, und Ihr aktuelles CEFR-Niveau (A1–C2) — werden, wenn Sie angemeldet sind, an Ihr Konto gebunden gespeichert, sodass sie Sie über alle Geräte hinweg begleiten; andernfalls bleiben sie nur auf Ihrem Gerät.`,
          `Abonnementstatus: Käufe werden vollständig von Apple über den App Store abgewickelt, und wir nutzen RevenueCat, um zu prüfen, ob Sie ein aktives Abonnement haben. Das geschieht anonym — wir verknüpfen Ihren Kaufverlauf niemals mit Ihrer Apple-ID, E-Mail-Adresse oder Ihrem Konto. RevenueCat sieht Ihre Zahlungsdaten nie; die Zahlung wird direkt von Apple abgewickelt.`,
          `Wir verlangen weder eine Anmeldung noch ein Abonnement, um zu sehen, was die App bietet — ein Konto und ein Abonnement werden erst benötigt, um den vollständigen Text eines Artikels, Buchkapitels oder Videotranskripts tatsächlich zu öffnen und zu lesen.`,
        ],
      },
      {
        heading: `Was wir nicht sammeln`,
        body: [
          `Wir verwenden keinerlei Analyse-, Werbe- oder Absturzbericht-Tools. Es gibt keinerlei Tracking, und die App zeigt niemals Apples Abfrage zur Tracking-Erlaubnis, weil sie nichts gibt, wofür sie um Erlaubnis fragen müsste — wir verfolgen Sie nicht über andere Apps oder Websites hinweg, Punkt.`,
        ],
      },
      {
        heading: `Was ausschließlich auf Ihrem Gerät bleibt`,
        body: [
          `Ihre gespeicherten Wörter, Ihr Lesefortschritt, Ihre Favoriten, Ihre Einstellungen für Textgröße und Design sowie Ihr Karteikarten-Wiederholungsverlauf werden ausschließlich lokal auf Ihrem iPhone gespeichert und niemals an unsere Server gesendet. Wenn Sie die App löschen, sind diese Daten weg — wir hatten nie eine Kopie davon.`,
        ],
      },
      {
        heading: `Push-Benachrichtigungen`,
        body: [
          `Wenn Sie Benachrichtigungen erlauben, abonniert Ihr Gerät ein tägliches Erinnerungs-Thema basierend auf Ihrer gewählten Muttersprache (zum Beispiel ein Thema für türkischsprachige Nutzer, ein separates für deutschsprachige). Das ist ein Broadcast-Thema, keine persönlich an Sie adressierte Nachricht — wir führen keine Liste darüber, welche einzelnen Geräte abonniert sind.`,
        ],
      },
      {
        heading: `Der „Favorisiert von"-Zähler`,
        body: [
          `Wenn Sie einen Inhalt favorisieren, erhöhen wir einen einfachen, globalen Zähler für genau dieses Element, sodass alle sehen können, wie oft es über alle Nutzer hinweg favorisiert wurde. Dieser Zähler ist anonym und kumulativ — wir führen keine Aufzeichnung darüber, wer was favorisiert hat, nur eine laufende Gesamtzahl pro Element.`,
        ],
      },
      {
        heading: `Drittanbieter, mit denen wir arbeiten`,
        body: [
          `Google Firebase (Authentication, Cloud-Firestore-Datenbank, Cloud Messaging für Push, Cloud Storage) hostet unsere Anmeldung, Datenbank und Inhaltsauslieferung in einer EU-Datenregion.`,
          `Apple stellt die Funktion „Mit Apple anmelden", die Abrechnung über den App Store und die Zustellung von Push-Benachrichtigungen bereit. Google stellt als Alternative zu Apple die Google-Anmeldung bereit. RevenueCat übernimmt die Verwaltung von Abonnements und Berechtigungen, wie oben beschrieben anonym genutzt.`,
          `Videoinhalte in der App werden über YouTubes datenschutzfreundlichen Modus (youtube-nocookie.com) eingebettet, der das Setzen von Tracking-Cookies vermeidet, bis Sie tatsächlich mit einem Video interagieren.`,
          `Wir verkaufen Ihre Daten an niemanden, und wir geben sie nicht an Werbetreibende weiter.`,
        ],
      },
      {
        heading: `Datenspeicherung und -löschung`,
        body: [
          `Wenn Sie angemeldet sind, können Sie Ihr Konto jederzeit über Einstellungen → Konto → Konto löschen in der App löschen. Dadurch wird Ihr Profil dauerhaft aus unserer Datenbank gelöscht, Ihre „Mit Apple anmelden"-Berechtigung widerrufen (falls zutreffend), Ihr Firebase-Authentifizierungseintrag gelöscht und alle lokal gespeicherten Daten (gespeicherte Wörter, Fortschritt, Favoriten) von Ihrem Gerät entfernt. Das kann nicht rückgängig gemacht werden.`,
          `Wenn Sie sich nie anmelden, gibt es keine Kontodaten zu löschen — alles ist bereits ausschließlich lokal auf Ihrem Gerät, und das Deinstallieren der App entfernt es.`,
        ],
      },
      {
        heading: `Ihre Rechte`,
        body: [
          `Wenn Sie sich im Europäischen Wirtschaftsraum befinden (oder an einem Ort mit ähnlichem Datenschutzrecht), haben Sie das Recht, auf Ihre personenbezogenen Daten zuzugreifen, sie zu berichtigen, zu exportieren oder zu löschen, sowie der Art ihrer Verarbeitung zu widersprechen. Die Kontolöschung in der App deckt das meiste davon automatisch ab; für alles andere schreiben Sie an mstfgul00@gmail.com, und wir kümmern uns direkt darum. Sie haben außerdem das Recht, sich bei Ihrer zuständigen Datenschutzbehörde zu beschweren.`,
        ],
      },
      {
        heading: `Datenschutz für Kinder`,
        body: [
          `Any Text richtet sich nicht an Kinder, und wir sammeln nicht wissentlich personenbezogene Daten von Kindern. Wenn Sie glauben, dass ein Kind uns personenbezogene Daten übermittelt hat, kontaktieren Sie uns — wir löschen sie.`,
        ],
      },
      {
        heading: `Sicherheit`,
        body: [
          `Die gesamte Kommunikation zwischen der App und unseren Servern erfolgt über die übliche HTTPS/TLS-Verschlüsselung. Zahlungsinformationen werden von uns niemals verarbeitet oder eingesehen — sie werden vollständig von Apple über StoreKit abgewickelt.`,
        ],
      },
      {
        heading: `Änderungen dieser Erklärung`,
        body: [
          `Wenn sich diese Erklärung wesentlich ändert, aktualisieren wir das Datum oben auf dieser Seite. Wir empfehlen, gelegentlich vorbeizuschauen, aber wir werden keine Änderungen vornehmen, die Ihre Rechte einschränken, ohne das deutlich zu machen.`,
        ],
      },
      {
        heading: `Kontakt`,
        body: [`Fragen, Anliegen oder einfach Feedback: mstfgul00@gmail.com`],
      },
    ],
  },
  nl: {
    title: `Privacybeleid`,
    intro: `Any Text ("de app", "wij") is een leesapp voor het leren van talen, voor iPhone. Deze pagina legt uit welke informatie de app verzamelt, waarom, en hoe je dat kunt beheren. We hebben geprobeerd dit in duidelijke taal te schrijven in plaats van dichte juridische taal — is iets onduidelijk, mail ons dan gewoon.`,
    sections: [
      {
        heading: `Wie we zijn`,
        body: [
          `Any Text wordt gebouwd en beheerd door een individuele ontwikkelaar, Mustafa Gül, gevestigd in de Europese Unie. Heb je een vraag over dit beleid of je gegevens, mail dan naar mstfgul00@gmail.com — die inbox wordt gelezen door de persoon die de app daadwerkelijk bouwt, niet door een supportteam.`,
        ],
      },
      {
        heading: `Wat we verzamelen, en waarom`,
        body: [
          `Als je inlogt (optioneel — met Apple of Google; er is geen apart account-/wachtwoordsysteem), ontvangen we het e-mailadres, de weergavenaam en een uniek account-ID dat Apple of Google ons geven. We bewaren deze om je te herkennen wanneer je terugkomt, en om je abonnement en voorkeuren aan je account te koppelen.`,
          `Je leesvoorkeuren — je leestaal, de taal waarin je vertalingen wilt zien, en je huidige CEFR-niveau (A1–C2) — worden, als je bent ingelogd, opgeslagen bij je account, zodat ze je op al je apparaten volgen; anders blijven ze alleen op je apparaat.`,
          `Abonnementsstatus: aankopen worden volledig door Apple afgehandeld via de App Store, en we gebruiken RevenueCat om te controleren of je een actief abonnement hebt. Dit gebeurt anoniem — we koppelen je aankoopgeschiedenis nooit aan je Apple ID, e-mailadres of account. RevenueCat ziet je kaartgegevens nooit; de betaling wordt rechtstreeks door Apple afgehandeld.`,
          `Je hoeft niet in te loggen of te abonneren om te bekijken wat er in de app beschikbaar is — een account en een abonnement zijn alleen nodig om de volledige tekst van een artikel, boekhoofdstuk of videotranscript daadwerkelijk te openen en te lezen.`,
        ],
      },
      {
        heading: `Wat we niet verzamelen`,
        body: [
          `We gebruiken geen analyse-, advertentie- of crashrapportagetools. Er is op geen enkele manier sprake van tracking, en de app toont nooit Apples toestemmingsvraag voor tracking, omdat er niets is waarvoor toestemming gevraagd moet worden — we volgen je niet tussen apps of websites, punt uit.`,
        ],
      },
      {
        heading: `Wat alleen op je apparaat blijft`,
        body: [
          `Je opgeslagen woorden, je leesvoortgang, je favorieten, je voorkeuren voor leesgrootte en thema, en je flashcard-herhalingsgeschiedenis worden allemaal lokaal op je iPhone opgeslagen en nooit naar onze servers verzonden. Als je de app verwijdert, is deze data weg; we hebben er nooit een kopie van gehad.`,
        ],
      },
      {
        heading: `Pushmeldingen`,
        body: [
          `Als je meldingen toestaat, abonneert je apparaat zich op een dagelijks herinneringsonderwerp gebaseerd op de moedertaal die je hebt gekozen (bijvoorbeeld een onderwerp voor Turkstalige gebruikers, een apart onderwerp voor Duitstalige gebruikers). Dit is een broadcastonderwerp, geen bericht dat persoonlijk aan jou is gericht — we houden geen lijst bij van welke individuele apparaten geabonneerd zijn.`,
        ],
      },
      {
        heading: `De teller "favoriet van"`,
        body: [
          `Wanneer je iets als favoriet markeert, verhogen we een eenvoudige, globale teller voor dat specifieke item, zodat iedereen kan zien hoe vaak het door alle gebruikers samen als favoriet is gemarkeerd. Deze teller is anoniem en cumulatief — we houden geen enkele registratie bij van wie wat als favoriet heeft gemarkeerd, alleen een lopend totaal per item.`,
        ],
      },
      {
        heading: `Derde partijen waarmee we samenwerken`,
        body: [
          `Google Firebase (Authentication, Cloud Firestore-database, Cloud Messaging voor pushmeldingen, Cloud Storage) host onze login, database en contentlevering, in een EU-dataregio.`,
          `Apple levert Inloggen met Apple, App Store-facturering en de bezorging van pushmeldingen. Google levert Inloggen met Google, als alternatief voor Apple. RevenueCat verzorgt het beheer van abonnementen en rechten, hierboven beschreven anoniem gebruikt.`,
          `Video-inhoud in de app wordt ingesloten met behulp van YouTube's privacyvriendelijke modus (youtube-nocookie.com), die voorkomt dat er trackingcookies worden geplaatst totdat je daadwerkelijk met een video interacteert.`,
          `We verkopen je gegevens aan niemand, en we delen ze niet met adverteerders.`,
        ],
      },
      {
        heading: `Bewaren en verwijderen van gegevens`,
        body: [
          `Als je bent ingelogd, kun je je account op elk moment verwijderen via Instellingen → Account → Account verwijderen in de app. Dit verwijdert je profiel permanent uit onze database, trekt je Inloggen met Apple-autorisatie in (indien van toepassing), verwijdert je Firebase-authenticatiegegevens, en wist alle lokaal opgeslagen data (opgeslagen woorden, voortgang, favorieten) van je apparaat. Dit kan niet ongedaan worden gemaakt.`,
          `Als je nooit inlogt, is er geen accountdata om te verwijderen — alles staat al alleen lokaal op je apparaat, en het verwijderen van de app verwijdert dit ook.`,
        ],
      },
      {
        heading: `Jouw rechten`,
        body: [
          `Als je je in de Europese Economische Ruimte bevindt (of ergens met vergelijkbare gegevensbeschermingswetgeving), heb je het recht om je persoonsgegevens in te zien, te corrigeren, te exporteren of te verwijderen, en om bezwaar te maken tegen de manier waarop ze worden verwerkt. Accountverwijdering in de app dekt hiervan automatisch het grootste deel; voor al het overige mail je naar mstfgul00@gmail.com en lossen we het rechtstreeks op. Je hebt ook het recht om een klacht in te dienen bij je lokale gegevensbeschermingsautoriteit.`,
        ],
      },
      {
        heading: `Privacy van kinderen`,
        body: [
          `Any Text is niet gericht op kinderen, en we verzamelen niet bewust persoonlijke informatie van kinderen. Als je denkt dat een kind ons persoonsgegevens heeft verstrekt, neem dan contact met ons op, dan verwijderen we deze.`,
        ],
      },
      {
        heading: `Beveiliging`,
        body: [
          `Alle communicatie tussen de app en onze servers gebruikt standaard HTTPS/TLS-versleuteling. Betaalgegevens worden nooit door ons verwerkt of gezien — deze worden volledig door Apple afgehandeld via StoreKit.`,
        ],
      },
      {
        heading: `Wijzigingen in dit beleid`,
        body: [
          `Als dit beleid op een betekenisvolle manier verandert, werken we de datum bovenaan deze pagina bij. We raden aan af en toe terug te checken, maar we zullen geen wijzigingen doorvoeren die je rechten beperken zonder dat duidelijk te maken.`,
        ],
      },
      {
        heading: `Contact`,
        body: [`Vragen, verzoeken, of gewoon feedback: mstfgul00@gmail.com`],
      },
    ],
  },
};
