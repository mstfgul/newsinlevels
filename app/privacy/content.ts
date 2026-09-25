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
          `Your account. The first time you finish setup, the app creates an anonymous account for you — a random ID with no name or email. Your preferences, your favorites' votes, your reading streak and the time you spend in the app are saved in it, so your streak and time can be restored if you reinstall the app. If you later sign in with Apple or Google, that same account is linked to your Apple or Google identity — nothing is duplicated — and signing in on another phone brings your streak and time there too.`,
          `If you sign in (optional — with Apple or Google; there's no separate account/password system), we receive the email address, display name, and a unique account ID that Apple or Google give us. We store these to know it's you when you come back, and to keep your subscription and preferences tied to your account.`,
          `Your reading preferences — your reading language, the language you want translations in, and your current CEFR level (A1–C2) — are saved in your account as part of your profile.`,
          `Your study continuity. To help you keep your study going, we store in your account the days in the last 12 weeks on which you completed readings and how many (only the date and the number, not what you read), your current and longest streak, the total time you have spent in the app, and the time of your last activity. We use these only to show you your own statistics, to keep your streak correct across devices and reinstalls, and to restore them if you come back. They are never used for advertising or profiling and are never shared.`,
          `Subscription status: purchases are handled entirely by Apple through the App Store, and we use RevenueCat to check whether you have an active subscription. This is done anonymously — we never link your purchase history to your Apple ID, email, or account. RevenueCat never sees your card details; Apple handles payment directly.`,
          `We do not require you to sign in or subscribe to browse what's available in the app — an account and a subscription are only needed to actually open and read the full text of an article, book chapter, or video transcript.`,
        ],
      },
      {
        heading: `What we don't collect`,
        body: [
          `We don't use third-party analytics, advertising or crash-reporting SDKs, and we don't track you across apps or websites; the app never shows Apple's "Allow Tracking" prompt. The reading statistics described above live in your own account and exist for your benefit, not for advertising.`,
        ],
      },
      {
        heading: `What stays only on your device`,
        body: [
          `Your saved words, the list of exactly which texts you have read, your favorites list, your reading-size and theme preferences and your flashcard review history stay on your iPhone. Only your reading preferences, day-level reading activity, the time you spend in the app and one vote per favorited item are stored in your account, as described above.`,
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
          `When you favorite an item, the app records one vote for it in your account and raises that item's public counter by one; removing the favorite removes the vote and lowers the counter. Counters are public totals with no names attached; the vote records are visible only to you and are deleted together with your data.`,
        ],
      },
      {
        heading: `Third parties we work with`,
        body: [
          `Google Firebase (Authentication, Cloud Firestore database, Cloud Functions, Cloud Messaging for push, Cloud Storage, and App Check, which uses Apple's App Attest to confirm that requests come from the genuine app) hosts our sign-in, database, and content delivery, in an EU data region.`,
          `Apple provides Sign in with Apple, App Store billing, and push notification delivery. Google provides Google Sign-In, as an alternative to Apple. RevenueCat handles subscription/entitlement management, used anonymously as described above.`,
          `Video content in the app is embedded using YouTube's privacy-enhanced mode (youtube-nocookie.com), which avoids setting tracking cookies until you actually interact with a video.`,
          `We don't sell your data to anyone, and we don't share it with advertisers.`,
        ],
      },
      {
        heading: `Data retention and deletion`,
        body: [
          `You can delete your data at any time from Settings → Account: "Delete my data" if you never signed in, "Delete account" if you did. This permanently deletes your profile, statistics and votes from our database, revokes your Sign in with Apple authorization (if applicable), deletes your authentication record, and wipes all locally stored data from your device. This can't be undone.`,
          `Uninstalling the app removes the local data; the account data is removed only via the deletion control above (or by writing to us).`,
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
          `Hesabınız. Kurulumu ilk kez tamamladığınızda uygulama sizin için anonim bir hesap oluşturur — adı ya da e-postası olmayan, rastgele bir kimlik. Tercihleriniz, favori oylarınız, okuma seriniz ve uygulamada geçirdiğiniz süre bu hesapta saklanır; böylece uygulamayı yeniden yüklediğinizde seriniz ve süreniz geri gelir. Daha sonra Apple veya Google ile oturum açarsanız aynı hesap Apple veya Google kimliğinize bağlanır — ikinci bir hesap oluşmaz — ve başka bir telefonda oturum açtığınızda seriniz ile süreniz oraya da gelir.`,
          `Oturum açarsanız (isteğe bağlı — Apple veya Google ile; ayrı bir hesap/şifre sistemi yoktur), Apple veya Google'ın bize verdiği e-posta adresini, görünen adınızı ve benzersiz bir hesap kimliğini alırız. Bunları, geri döndüğünüzde sizi tanımak ve aboneliğinizle tercihlerinizi hesabınıza bağlı tutmak için saklarız.`,
          `Okuma tercihleriniz — okuma diliniz, çevirileri hangi dilde görmek istediğiniz ve güncel CEFR seviyeniz (A1–C2) — profilinizin bir parçası olarak hesabınızda saklanır.`,
          `Çalışma sürekliliğiniz. Çalışmanızı sürdürmenize yardımcı olmak için hesabınızda son 12 haftada hangi günlerde kaç okuma tamamladığınızı (yalnızca tarih ve sayı; ne okuduğunuz değil), güncel ve en uzun serinizi, uygulamada geçirdiğiniz toplam süreyi ve son etkinliğinizin zamanını saklarız. Bunları yalnızca size kendi istatistiklerinizi göstermek, serinizi cihazlar arasında ve yeniden yüklemelerde doğru tutmak ve geri döndüğünüzde geri yüklemek için kullanırız. Reklam ya da profilleme için asla kullanılmaz ve hiçbir zaman paylaşılmaz.`,
          `Abonelik durumu: satın almalar tamamen Apple tarafından App Store üzerinden yürütülür; aktif bir aboneliğiniz olup olmadığını kontrol etmek için RevenueCat kullanırız. Bu tamamen anonim şekilde yapılır — satın alma geçmişinizi hiçbir zaman Apple ID'nize, e-postanıza ya da hesabınıza bağlamayız. RevenueCat kart bilgilerinizi asla görmez; ödemeyi doğrudan Apple yönetir.`,
          `Uygulamada nelerin bulunduğuna göz atmak için oturum açmanızı ya da abone olmanızı istemeyiz — bir hesap ve abonelik yalnızca bir haberin, kitap bölümünün ya da video metninin tam içeriğini açıp okumak için gereklidir.`,
        ],
      },
      {
        heading: `Neyi toplamıyoruz`,
        body: [
          `Üçüncü taraf analiz, reklam ya da çökme raporlama SDK'ları kullanmıyoruz ve sizi başka uygulamalar ya da web siteleri arasında takip etmiyoruz; uygulama, Apple'ın izleme izni istemini hiçbir zaman göstermez. Yukarıda anlatılan okuma istatistikleri kendi hesabınızda durur ve reklam için değil, sizin yararınız için vardır.`,
        ],
      },
      {
        heading: `Yalnızca cihazınızda kalanlar`,
        body: [
          `Kaydettiğiniz kelimeler, tam olarak hangi metinleri okuduğunuzun listesi, favori listeniz, okuma boyutu ve tema tercihleriniz ile kelime tekrarı geçmişiniz iPhone'unuzda kalır. Hesabınızda yalnızca okuma tercihleriniz, gün düzeyindeki okuma etkinliğiniz, uygulamada geçirdiğiniz süre ve favorilediğiniz her öğe için bir oy saklanır; hepsi yukarıda anlatıldığı gibi.`,
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
          `Bir öğeyi favorilediğinizde uygulama hesabınıza o öğe için bir oy kaydeder ve öğenin herkese açık sayacını bir artırır; favoriyi kaldırdığınızda oy silinir ve sayaç bir azalır. Sayaçlar isim içermeyen, herkese açık toplamlardır; oy kayıtlarını yalnızca siz görebilirsiniz ve verilerinizle birlikte silinirler.`,
        ],
      },
      {
        heading: `Birlikte çalıştığımız üçüncü taraflar`,
        body: [
          `Google Firebase (Authentication, Cloud Firestore veritabanı, Cloud Functions, push için Cloud Messaging, Cloud Storage ve isteklerin gerçek uygulamadan geldiğini Apple'ın App Attest hizmetiyle doğrulayan App Check) oturum açma, veritabanı ve içerik teslimimizi bir AB veri bölgesinde barındırır.`,
          `Apple; Apple ile Oturum Aç, App Store faturalandırması ve push bildirim teslimini sağlar. Google ise Apple'a alternatif olarak kendi oturum açma seçeneğini sunar. RevenueCat, yukarıda açıklandığı gibi anonim olarak kullanılan abonelik/yetki yönetimini üstlenir.`,
          `Uygulamadaki video içerikleri, bir videoyla gerçekten etkileşime geçene kadar takip çerezi koymayan YouTube'un gizlilik odaklı modu (youtube-nocookie.com) ile gömülür.`,
          `Verilerinizi kimseye satmıyoruz ve reklamverenlerle paylaşmıyoruz.`,
        ],
      },
      {
        heading: `Veri saklama ve silme`,
        body: [
          `Verilerinizi istediğiniz zaman Ayarlar → Hesap bölümünden silebilirsiniz: hiç oturum açmadıysanız "Verilerimi sil", oturum açtıysanız "Hesabı sil". Bu işlem profilinizi, istatistiklerinizi ve oylarınızı veritabanımızdan kalıcı olarak siler, Apple ile Oturum Aç yetkilendirmenizi (varsa) iptal eder, kimlik doğrulama kaydınızı siler ve cihazınızda yerel olarak tutulan tüm verileri temizler. Bu işlem geri alınamaz.`,
          `Uygulamayı kaldırmak yerel verileri siler; hesap verileri ise yalnızca yukarıdaki silme seçeneğiyle (ya da bize yazarak) silinir.`,
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
          `Votre compte. La première fois que vous terminez la configuration, l'application crée pour vous un compte anonyme — un identifiant aléatoire, sans nom ni adresse e-mail. Vos préférences, vos votes de favoris, votre série de lecture et le temps que vous passez dans l'application y sont enregistrés, afin que votre série et votre temps puissent être restaurés si vous réinstallez l'application. Si vous vous connectez ensuite avec Apple ou Google, ce même compte est associé à votre identité Apple ou Google — rien n'est dupliqué — et vous retrouvez votre série et votre temps en vous connectant sur un autre téléphone.`,
          `Si vous vous connectez (facultatif — avec Apple ou Google ; il n'existe pas de système de compte/mot de passe séparé), nous recevons l'adresse e-mail, le nom affiché et un identifiant de compte unique que nous transmet Apple ou Google. Nous les conservons pour vous reconnaître à votre retour et pour garder votre abonnement et vos préférences liés à votre compte.`,
          `Vos préférences de lecture — votre langue de lecture, la langue dans laquelle vous souhaitez voir les traductions, et votre niveau CEFR actuel (A1–C2) — sont enregistrées sur votre compte, dans votre profil.`,
          `La continuité de votre apprentissage. Pour vous aider à poursuivre votre apprentissage, nous enregistrons sur votre compte les jours des 12 dernières semaines où vous avez terminé des lectures, et combien (uniquement la date et le nombre, pas ce que vous avez lu), votre série actuelle et votre plus longue série, le temps total passé dans l'application et l'heure de votre dernière activité. Nous les utilisons uniquement pour vous montrer vos propres statistiques, pour que votre série reste exacte d'un appareil à l'autre et après une réinstallation, et pour les restaurer si vous revenez. Elles ne sont jamais utilisées à des fins publicitaires ou de profilage et ne sont jamais partagées.`,
          `Statut de l'abonnement : les achats sont gérés entièrement par Apple via l'App Store, et nous utilisons RevenueCat pour vérifier si vous avez un abonnement actif. Cela se fait de manière anonyme — nous ne relions jamais votre historique d'achat à votre identifiant Apple, votre e-mail ou votre compte. RevenueCat ne voit jamais vos coordonnées bancaires ; le paiement est géré directement par Apple.`,
          `Nous ne vous demandons pas de vous connecter ou de vous abonner pour parcourir ce que propose l'application — un compte et un abonnement ne sont nécessaires que pour ouvrir et lire le texte complet d'un article, d'un chapitre de livre ou d'une transcription vidéo.`,
        ],
      },
      {
        heading: `Ce que nous ne collectons pas`,
        body: [
          `Nous n'utilisons aucun SDK tiers d'analyse, de publicité ou de rapport de plantage, et nous ne vous suivons pas d'une application ou d'un site à l'autre ; l'application n'affiche jamais la demande d'autorisation de suivi d'Apple. Les statistiques de lecture décrites ci-dessus se trouvent dans votre propre compte et existent pour vous, pas pour la publicité.`,
        ],
      },
      {
        heading: `Ce qui reste uniquement sur votre appareil`,
        body: [
          `Vos mots enregistrés, la liste exacte des textes que vous avez lus, votre liste de favoris, vos préférences de taille de texte et de thème, ainsi que votre historique de révision des cartes mémoire restent sur votre iPhone. Votre compte ne contient que vos préférences de lecture, votre activité de lecture jour par jour, le temps passé dans l'application et un vote par élément mis en favori, comme décrit ci-dessus.`,
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
          `Lorsque vous mettez un élément en favori, l'application enregistre un vote pour cet élément sur votre compte et augmente son compteur public d'une unité ; si vous retirez le favori, le vote est supprimé et le compteur diminue. Les compteurs sont des totaux publics, sans aucun nom associé ; les votes ne sont visibles que par vous et sont supprimés en même temps que vos données.`,
        ],
      },
      {
        heading: `Les tiers avec lesquels nous travaillons`,
        body: [
          `Google Firebase (Authentication, base de données Cloud Firestore, Cloud Functions, Cloud Messaging pour les notifications, Cloud Storage, et App Check, qui utilise App Attest d'Apple pour vérifier que les requêtes proviennent bien de l'application authentique) héberge notre connexion, notre base de données et la diffusion de nos contenus, dans une région de données située dans l'UE.`,
          `Apple fournit la connexion avec Apple, la facturation via l'App Store et la distribution des notifications push. Google fournit la connexion avec Google, comme alternative à Apple. RevenueCat gère les abonnements et les droits d'accès, utilisé de manière anonyme comme décrit ci-dessus.`,
          `Le contenu vidéo de l'application est intégré via le mode renforcé de confidentialité de YouTube (youtube-nocookie.com), qui évite de déposer des cookies de suivi tant que vous n'interagissez pas réellement avec une vidéo.`,
          `Nous ne vendons vos données à personne, et nous ne les partageons pas avec des annonceurs.`,
        ],
      },
      {
        heading: `Conservation et suppression des données`,
        body: [
          `Vous pouvez supprimer vos données à tout moment depuis Réglages → Compte : « Supprimer mes données » si vous ne vous êtes jamais connecté, « Supprimer le compte » si vous l'avez fait. Cela supprime définitivement votre profil, vos statistiques et vos votes de notre base de données, révoque votre autorisation de connexion avec Apple (le cas échéant), supprime votre enregistrement d'authentification et efface de votre appareil toutes les données stockées localement. Cette action est irréversible.`,
          `Désinstaller l'application supprime les données locales ; les données du compte ne sont supprimées que par l'option de suppression ci-dessus (ou en nous écrivant).`,
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
          `Il tuo account. La prima volta che completi la configurazione, l'app crea per te un account anonimo — un ID casuale, senza nome né email. Lì vengono salvati le tue preferenze, i voti dei tuoi preferiti, la tua serie di lettura e il tempo che passi nell'app, così la tua serie e il tuo tempo possono essere ripristinati se reinstalli l'app. Se in seguito accedi con Apple o Google, quello stesso account viene collegato alla tua identità Apple o Google — non viene duplicato nulla — e accedendo su un altro telefono ritrovi lì la tua serie e il tuo tempo.`,
          `Se accedi (facoltativo — con Apple o Google; non esiste un sistema separato di account/password), riceviamo l'indirizzo email, il nome visualizzato e un ID account univoco che ci forniscono Apple o Google. Li conserviamo per riconoscerti quando torni e per mantenere il tuo abbonamento e le tue preferenze collegati al tuo account.`,
          `Le tue preferenze di lettura — la lingua di lettura, la lingua in cui vuoi vedere le traduzioni e il tuo livello CEFR attuale (A1–C2) — vengono salvate nel tuo account, come parte del tuo profilo.`,
          `La continuità del tuo studio. Per aiutarti a non interrompere lo studio, salviamo nel tuo account i giorni delle ultime 12 settimane in cui hai completato delle letture e quante (solo la data e il numero, non cosa hai letto), la tua serie attuale e quella più lunga, il tempo totale trascorso nell'app e l'ora della tua ultima attività. Li usiamo solo per mostrarti le tue statistiche, per mantenere corretta la tua serie tra dispositivi diversi e dopo una reinstallazione, e per ripristinarli se torni. Non vengono mai usati per pubblicità o profilazione e non vengono mai condivisi.`,
          `Stato dell'abbonamento: gli acquisti sono gestiti interamente da Apple tramite l'App Store, e usiamo RevenueCat per verificare se hai un abbonamento attivo. Questo avviene in modo anonimo — non colleghiamo mai la cronologia dei tuoi acquisti al tuo Apple ID, alla tua email o al tuo account. RevenueCat non vede mai i dati della tua carta; il pagamento è gestito direttamente da Apple.`,
          `Non ti chiediamo di accedere o abbonarti per sfogliare i contenuti disponibili nell'app — un account e un abbonamento servono solo per aprire e leggere per intero un articolo, un capitolo di libro o la trascrizione di un video.`,
        ],
      },
      {
        heading: `Cosa non raccogliamo`,
        body: [
          `Non usiamo SDK di terze parti per analisi, pubblicità o segnalazione di arresti anomali, e non ti tracciamo tra app o siti web; l'app non mostra mai la richiesta di autorizzazione al tracciamento di Apple. Le statistiche di lettura descritte sopra si trovano nel tuo account ed esistono a tuo vantaggio, non per la pubblicità.`,
        ],
      },
      {
        heading: `Cosa resta solo sul tuo dispositivo`,
        body: [
          `Le parole salvate, l'elenco esatto dei testi che hai letto, la tua lista dei preferiti, le preferenze di dimensione del testo e tema, e la cronologia delle ripetizioni con le flashcard restano sul tuo iPhone. Nel tuo account vengono salvati solo le tue preferenze di lettura, l'attività di lettura giorno per giorno, il tempo trascorso nell'app e un voto per ogni elemento preferito, come descritto sopra.`,
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
          `Quando aggiungi un elemento ai preferiti, l'app registra un voto per quell'elemento nel tuo account e aumenta di uno il suo contatore pubblico; se lo togli dai preferiti, il voto viene eliminato e il contatore diminuisce. I contatori sono totali pubblici, senza nomi associati; i voti sono visibili solo a te e vengono eliminati insieme ai tuoi dati.`,
        ],
      },
      {
        heading: `Terze parti con cui collaboriamo`,
        body: [
          `Google Firebase (Authentication, database Cloud Firestore, Cloud Functions, Cloud Messaging per le notifiche push, Cloud Storage e App Check, che usa App Attest di Apple per verificare che le richieste provengano dall'app autentica) ospita il nostro accesso, il nostro database e la distribuzione dei contenuti, in una regione dati dell'UE.`,
          `Apple fornisce l'accesso con Apple, la fatturazione tramite App Store e la consegna delle notifiche push. Google fornisce l'accesso con Google, come alternativa ad Apple. RevenueCat gestisce abbonamenti e diritti d'uso, utilizzato in modo anonimo come descritto sopra.`,
          `I contenuti video nell'app vengono incorporati usando la modalità di YouTube potenziata per la privacy (youtube-nocookie.com), che evita di impostare cookie di tracciamento finché non interagisci realmente con un video.`,
          `Non vendiamo i tuoi dati a nessuno, e non li condividiamo con inserzionisti pubblicitari.`,
        ],
      },
      {
        heading: `Conservazione ed eliminazione dei dati`,
        body: [
          `Puoi eliminare i tuoi dati in qualsiasi momento da Impostazioni → Account: "Elimina i miei dati" se non hai mai effettuato l'accesso, "Elimina account" se l'hai fatto. Questo elimina definitivamente il tuo profilo, le tue statistiche e i tuoi voti dal nostro database, revoca la tua autorizzazione di accesso con Apple (se applicabile), elimina il tuo record di autenticazione e cancella dal tuo dispositivo tutti i dati salvati localmente. Questa operazione non può essere annullata.`,
          `Disinstallare l'app rimuove i dati locali; i dati dell'account vengono eliminati solo tramite l'opzione di eliminazione descritta sopra (o scrivendoci).`,
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
          `Tu cuenta. La primera vez que completas la configuración, la app crea una cuenta anónima para ti — un ID aleatorio, sin nombre ni correo electrónico. En ella se guardan tus preferencias, los votos de tus favoritos, tu racha de lectura y el tiempo que pasas en la app, para que tu racha y tu tiempo puedan restaurarse si reinstalas la app. Si más adelante inicias sesión con Apple o Google, esa misma cuenta se vincula a tu identidad de Apple o Google — no se duplica nada — y al iniciar sesión en otro teléfono recuperas allí tu racha y tu tiempo.`,
          `Si inicias sesión (opcional — con Apple o Google; no existe un sistema independiente de cuenta/contraseña), recibimos el correo electrónico, el nombre visible y un ID de cuenta único que nos proporciona Apple o Google. Los guardamos para reconocerte cuando vuelvas y para mantener tu suscripción y tus preferencias vinculadas a tu cuenta.`,
          `Tus preferencias de lectura — tu idioma de lectura, el idioma en el que quieres ver las traducciones, y tu nivel CEFR actual (A1–C2) — se guardan en tu cuenta, como parte de tu perfil.`,
          `La continuidad de tu estudio. Para ayudarte a mantener tu estudio, guardamos en tu cuenta los días de las últimas 12 semanas en los que completaste lecturas y cuántas (solo la fecha y el número, no lo que leíste), tu racha actual y tu racha más larga, el tiempo total que has pasado en la app y la hora de tu última actividad. Solo los usamos para mostrarte tus propias estadísticas, para mantener tu racha correcta entre dispositivos y tras reinstalar la app, y para restaurarlos si vuelves. Nunca se usan para publicidad ni para elaborar perfiles, y nunca se comparten.`,
          `Estado de la suscripción: las compras las gestiona Apple por completo a través de la App Store, y usamos RevenueCat para comprobar si tienes una suscripción activa. Esto se hace de forma anónima — nunca vinculamos tu historial de compras con tu Apple ID, tu correo electrónico o tu cuenta. RevenueCat nunca ve los datos de tu tarjeta; el pago lo gestiona Apple directamente.`,
          `No es necesario iniciar sesión ni suscribirte para explorar lo que ofrece la app — una cuenta y una suscripción solo son necesarias para abrir y leer el texto completo de un artículo, un capítulo de libro o la transcripción de un vídeo.`,
        ],
      },
      {
        heading: `Qué no recopilamos`,
        body: [
          `No usamos SDK de terceros de analítica, publicidad o informes de fallos, y no te seguimos entre aplicaciones ni sitios web; la app nunca muestra el aviso de permiso de seguimiento de Apple. Las estadísticas de lectura descritas arriba están en tu propia cuenta y existen para tu beneficio, no para la publicidad.`,
        ],
      },
      {
        heading: `Qué permanece solo en tu dispositivo`,
        body: [
          `Tus palabras guardadas, la lista exacta de los textos que has leído, tu lista de favoritos, tus preferencias de tamaño de texto y tema, y tu historial de repaso de tarjetas permanecen en tu iPhone. En tu cuenta solo se guardan tus preferencias de lectura, tu actividad de lectura por días, el tiempo que pasas en la app y un voto por cada elemento favorito, como se describe arriba.`,
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
          `Cuando marcas un elemento como favorito, la app registra un voto por él en tu cuenta y aumenta en uno su contador público; si quitas el favorito, el voto se elimina y el contador baja. Los contadores son totales públicos sin nombres asociados; los registros de voto solo son visibles para ti y se eliminan junto con tus datos.`,
        ],
      },
      {
        heading: `Terceros con los que trabajamos`,
        body: [
          `Google Firebase (Authentication, base de datos Cloud Firestore, Cloud Functions, Cloud Messaging para notificaciones push, Cloud Storage y App Check, que usa App Attest de Apple para comprobar que las solicitudes proceden de la app auténtica) aloja nuestro inicio de sesión, nuestra base de datos y la entrega de contenido, en una región de datos de la UE.`,
          `Apple proporciona el inicio de sesión con Apple, la facturación de la App Store y la entrega de notificaciones push. Google proporciona el inicio de sesión con Google, como alternativa a Apple. RevenueCat gestiona las suscripciones y los derechos de acceso, utilizado de forma anónima como se describe arriba.`,
          `El contenido en vídeo de la app se incorpora usando el modo de privacidad reforzada de YouTube (youtube-nocookie.com), que evita colocar cookies de seguimiento hasta que realmente interactúas con un vídeo.`,
          `No vendemos tus datos a nadie, y no los compartimos con anunciantes.`,
        ],
      },
      {
        heading: `Conservación y eliminación de datos`,
        body: [
          `Puedes eliminar tus datos en cualquier momento desde Ajustes → Cuenta: "Eliminar mis datos" si nunca has iniciado sesión, "Eliminar cuenta" si lo has hecho. Esto elimina permanentemente tu perfil, tus estadísticas y tus votos de nuestra base de datos, revoca tu autorización de inicio de sesión con Apple (si corresponde), elimina tu registro de autenticación y borra de tu dispositivo todos los datos guardados localmente. Esto no se puede deshacer.`,
          `Desinstalar la app elimina los datos locales; los datos de la cuenta solo se eliminan con la opción de borrado descrita arriba (o escribiéndonos).`,
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
          `Ihr Konto. Wenn Sie die Einrichtung zum ersten Mal abschließen, legt die App ein anonymes Konto für Sie an — eine zufällige ID ohne Namen oder E-Mail-Adresse. Darin werden Ihre Einstellungen, Ihre Favoriten-Stimmen, Ihre Lese-Serie und die Zeit, die Sie in der App verbringen, gespeichert, damit Ihre Serie und Ihre Zeit wiederhergestellt werden können, wenn Sie die App neu installieren. Wenn Sie sich später mit Apple oder Google anmelden, wird genau dieses Konto mit Ihrer Apple- oder Google-Identität verknüpft — es wird nichts doppelt angelegt — und wenn Sie sich auf einem anderen Telefon anmelden, sind Ihre Serie und Ihre Zeit auch dort wieder da.`,
          `Wenn Sie sich anmelden (optional — mit Apple oder Google; es gibt kein separates Konto-/Passwort-System), erhalten wir die E-Mail-Adresse, den Anzeigenamen und eine eindeutige Konto-ID, die uns Apple oder Google mitteilen. Wir speichern diese, um Sie bei Ihrer Rückkehr wiederzuerkennen und Ihr Abonnement sowie Ihre Einstellungen an Ihr Konto zu binden.`,
          `Ihre Leseeinstellungen — Ihre Lesesprache, die Sprache, in der Sie Übersetzungen sehen möchten, und Ihr aktuelles CEFR-Niveau (A1–C2) — werden als Teil Ihres Profils in Ihrem Konto gespeichert.`,
          `Ihre Lernkontinuität. Damit Sie beim Lernen dranbleiben können, speichern wir in Ihrem Konto, an welchen Tagen der letzten 12 Wochen Sie Texte zu Ende gelesen haben und wie viele (nur das Datum und die Anzahl, nicht, was Sie gelesen haben), Ihre aktuelle und Ihre längste Serie, die Gesamtzeit, die Sie in der App verbracht haben, und den Zeitpunkt Ihrer letzten Aktivität. Wir nutzen diese Angaben nur, um Ihnen Ihre eigenen Statistiken zu zeigen, Ihre Serie über Geräte und Neuinstallationen hinweg korrekt zu halten und sie wiederherzustellen, wenn Sie zurückkommen. Sie werden nie für Werbung oder Profilbildung verwendet und nie weitergegeben.`,
          `Abonnementstatus: Käufe werden vollständig von Apple über den App Store abgewickelt, und wir nutzen RevenueCat, um zu prüfen, ob Sie ein aktives Abonnement haben. Das geschieht anonym — wir verknüpfen Ihren Kaufverlauf niemals mit Ihrer Apple-ID, E-Mail-Adresse oder Ihrem Konto. RevenueCat sieht Ihre Zahlungsdaten nie; die Zahlung wird direkt von Apple abgewickelt.`,
          `Wir verlangen weder eine Anmeldung noch ein Abonnement, um zu sehen, was die App bietet — ein Konto und ein Abonnement werden erst benötigt, um den vollständigen Text eines Artikels, Buchkapitels oder Videotranskripts tatsächlich zu öffnen und zu lesen.`,
        ],
      },
      {
        heading: `Was wir nicht sammeln`,
        body: [
          `Wir verwenden keine Analyse-, Werbe- oder Absturzbericht-SDKs von Drittanbietern und verfolgen Sie nicht über andere Apps oder Websites hinweg; die App zeigt niemals Apples Abfrage zur Tracking-Erlaubnis. Die oben beschriebenen Lesestatistiken liegen in Ihrem eigenen Konto und dienen Ihnen, nicht der Werbung.`,
        ],
      },
      {
        heading: `Was ausschließlich auf Ihrem Gerät bleibt`,
        body: [
          `Ihre gespeicherten Wörter, die genaue Liste der Texte, die Sie gelesen haben, Ihre Favoritenliste, Ihre Einstellungen für Textgröße und Design sowie Ihr Karteikarten-Wiederholungsverlauf bleiben auf Ihrem iPhone. In Ihrem Konto werden nur Ihre Leseeinstellungen, Ihre tageweise Leseaktivität, die in der App verbrachte Zeit und eine Stimme pro favorisiertem Element gespeichert, wie oben beschrieben.`,
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
          `Wenn Sie ein Element favorisieren, speichert die App dafür eine Stimme in Ihrem Konto und erhöht den öffentlichen Zähler des Elements um eins; entfernen Sie den Favoriten, wird die Stimme gelöscht und der Zähler sinkt. Die Zähler sind öffentliche Summen ohne Namen; die Stimmen sind nur für Sie sichtbar und werden zusammen mit Ihren Daten gelöscht.`,
        ],
      },
      {
        heading: `Drittanbieter, mit denen wir arbeiten`,
        body: [
          `Google Firebase (Authentication, Cloud-Firestore-Datenbank, Cloud Functions, Cloud Messaging für Push, Cloud Storage und App Check, das mithilfe von Apples App Attest prüft, ob Anfragen von der echten App stammen) hostet unsere Anmeldung, Datenbank und Inhaltsauslieferung in einer EU-Datenregion.`,
          `Apple stellt die Funktion „Mit Apple anmelden", die Abrechnung über den App Store und die Zustellung von Push-Benachrichtigungen bereit. Google stellt als Alternative zu Apple die Google-Anmeldung bereit. RevenueCat übernimmt die Verwaltung von Abonnements und Berechtigungen, wie oben beschrieben anonym genutzt.`,
          `Videoinhalte in der App werden über YouTubes datenschutzfreundlichen Modus (youtube-nocookie.com) eingebettet, der das Setzen von Tracking-Cookies vermeidet, bis Sie tatsächlich mit einem Video interagieren.`,
          `Wir verkaufen Ihre Daten an niemanden, und wir geben sie nicht an Werbetreibende weiter.`,
        ],
      },
      {
        heading: `Datenspeicherung und -löschung`,
        body: [
          `Sie können Ihre Daten jederzeit unter Einstellungen → Konto löschen: „Meine Daten löschen", wenn Sie sich nie angemeldet haben, „Konto löschen", wenn Sie sich angemeldet haben. Dadurch werden Ihr Profil, Ihre Statistiken und Ihre Stimmen dauerhaft aus unserer Datenbank gelöscht, Ihre „Mit Apple anmelden"-Berechtigung widerrufen (falls zutreffend), Ihr Authentifizierungseintrag gelöscht und alle lokal gespeicherten Daten von Ihrem Gerät entfernt. Das kann nicht rückgängig gemacht werden.`,
          `Beim Deinstallieren der App werden die lokalen Daten entfernt; die Kontodaten werden nur über die oben genannte Löschfunktion (oder auf schriftliche Anfrage an uns) gelöscht.`,
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
          `Je account. Zodra je de app voor het eerst hebt ingesteld, maakt de app een anoniem account voor je aan — een willekeurige ID zonder naam of e-mailadres. Daarin worden je voorkeuren, de stemmen van je favorieten, je leesreeks en de tijd die je in de app doorbrengt bewaard, zodat je reeks en je tijd hersteld kunnen worden als je de app opnieuw installeert. Als je later inlogt met Apple of Google, wordt datzelfde account gekoppeld aan je Apple- of Google-identiteit — er wordt niets dubbel aangemaakt — en als je op een andere telefoon inlogt, heb je je reeks en je tijd daar ook weer.`,
          `Als je inlogt (optioneel — met Apple of Google; er is geen apart account-/wachtwoordsysteem), ontvangen we het e-mailadres, de weergavenaam en een uniek account-ID dat Apple of Google ons geven. We bewaren deze om je te herkennen wanneer je terugkomt, en om je abonnement en voorkeuren aan je account te koppelen.`,
          `Je leesvoorkeuren — je leestaal, de taal waarin je vertalingen wilt zien, en je huidige CEFR-niveau (A1–C2) — worden als onderdeel van je profiel in je account opgeslagen.`,
          `De continuïteit van je studie. Om je te helpen bij je studie te blijven, bewaren we in je account op welke dagen van de afgelopen 12 weken je teksten hebt uitgelezen en hoeveel (alleen de datum en het aantal, niet wat je hebt gelezen), je huidige en je langste reeks, de totale tijd die je in de app hebt doorgebracht en het tijdstip van je laatste activiteit. We gebruiken deze gegevens alleen om je je eigen statistieken te tonen, om je reeks op al je apparaten en na een herinstallatie correct te houden, en om ze te herstellen als je terugkomt. Ze worden nooit gebruikt voor advertenties of profilering en nooit gedeeld.`,
          `Abonnementsstatus: aankopen worden volledig door Apple afgehandeld via de App Store, en we gebruiken RevenueCat om te controleren of je een actief abonnement hebt. Dit gebeurt anoniem — we koppelen je aankoopgeschiedenis nooit aan je Apple ID, e-mailadres of account. RevenueCat ziet je kaartgegevens nooit; de betaling wordt rechtstreeks door Apple afgehandeld.`,
          `Je hoeft niet in te loggen of te abonneren om te bekijken wat er in de app beschikbaar is — een account en een abonnement zijn alleen nodig om de volledige tekst van een artikel, boekhoofdstuk of videotranscript daadwerkelijk te openen en te lezen.`,
        ],
      },
      {
        heading: `Wat we niet verzamelen`,
        body: [
          `We gebruiken geen analyse-, advertentie- of crashrapportage-SDK's van derden en we volgen je niet tussen apps of websites; de app toont nooit Apples toestemmingsvraag voor tracking. De hierboven beschreven leesstatistieken staan in je eigen account en zijn er voor jou, niet voor advertenties.`,
        ],
      },
      {
        heading: `Wat alleen op je apparaat blijft`,
        body: [
          `Je opgeslagen woorden, de exacte lijst van teksten die je hebt gelezen, je favorietenlijst, je voorkeuren voor leesgrootte en thema, en je flashcard-herhalingsgeschiedenis blijven op je iPhone. In je account worden alleen je leesvoorkeuren, je leesactiviteit per dag, de tijd die je in de app doorbrengt en één stem per favoriet item opgeslagen, zoals hierboven beschreven.`,
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
          `Wanneer je een item als favoriet markeert, legt de app daarvoor één stem vast in je account en verhoogt de openbare teller van dat item met één; haal je de favoriet weg, dan wordt de stem verwijderd en gaat de teller omlaag. Tellers zijn openbare totalen zonder namen; de stemmen zijn alleen voor jou zichtbaar en worden samen met je gegevens verwijderd.`,
        ],
      },
      {
        heading: `Derde partijen waarmee we samenwerken`,
        body: [
          `Google Firebase (Authentication, Cloud Firestore-database, Cloud Functions, Cloud Messaging voor pushmeldingen, Cloud Storage en App Check, dat met Apples App Attest controleert of verzoeken van de echte app komen) host onze login, database en contentlevering, in een EU-dataregio.`,
          `Apple levert Inloggen met Apple, App Store-facturering en de bezorging van pushmeldingen. Google levert Inloggen met Google, als alternatief voor Apple. RevenueCat verzorgt het beheer van abonnementen en rechten, hierboven beschreven anoniem gebruikt.`,
          `Video-inhoud in de app wordt ingesloten met behulp van YouTube's privacyvriendelijke modus (youtube-nocookie.com), die voorkomt dat er trackingcookies worden geplaatst totdat je daadwerkelijk met een video interacteert.`,
          `We verkopen je gegevens aan niemand, en we delen ze niet met adverteerders.`,
        ],
      },
      {
        heading: `Bewaren en verwijderen van gegevens`,
        body: [
          `Je kunt je gegevens op elk moment verwijderen via Instellingen → Account: "Mijn gegevens wissen" als je nooit hebt ingelogd, "Account verwijderen" als je dat wel hebt gedaan. Dit verwijdert je profiel, je statistieken en je stemmen permanent uit onze database, trekt je Inloggen met Apple-autorisatie in (indien van toepassing), verwijdert je authenticatiegegevens en wist alle lokaal opgeslagen data van je apparaat. Dit kan niet ongedaan worden gemaakt.`,
          `Als je de app verwijdert, verdwijnen de lokale gegevens; de accountgegevens worden alleen verwijderd via de verwijderoptie hierboven (of als je ons schrijft).`,
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
