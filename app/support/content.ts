import type { LegalLang, LegalPageCopy } from "@/lib/legal";

/**
 * Support-page copy, one entry per legal language. English is the
 * authoritative source; the other six are careful human-quality
 * translations. Section 2's body embeds a `{{link:/privacy/|label}}` marker
 * that SupportView renders as a real internal link — see the parser there.
 */
export const SUPPORT_CONTENT: Record<LegalLang, LegalPageCopy> = {
  en: {
    title: `Support`,
    intro: `Have a question, found a bug, or want to suggest something? Email mstfgul00@gmail.com — it goes straight to the person who builds the app.`,
    sections: [
      {
        heading: `How do I manage or cancel my subscription?`,
        body: [
          `Subscriptions are billed and managed entirely by Apple. On your iPhone: Settings → [your name] → Subscriptions → Any Text. You can also get there from inside the app: Settings → Subscription → "Manage Subscription".`,
        ],
      },
      {
        heading: `How do I delete my account and data?`,
        body: [
          `In the app: Settings → Account → Delete Account. This removes your account and profile permanently, and clears everything saved on your device — words, progress, favorites. See our {{link:/privacy/|Privacy Policy}} for details.`,
        ],
      },
      {
        heading: `I found a bug, or a translation looks wrong.`,
        body: [
          `Email us with what you saw and, if you can, which screen, level, and language it happened on — that's usually enough to track it down.`,
        ],
      },
      {
        heading: `Can I suggest a new feature, or a book or video to add?`,
        body: [
          `Yes — email us. Any Text is a small, actively developed app, and reader suggestions genuinely shape what gets built next.`,
        ],
      },
    ],
  },
  tr: {
    title: `Destek`,
    intro: `Bir sorunuz mu var, bir hata mı buldunuz, yoksa bir öneriniz mi var? mstfgul00@gmail.com adresine yazın — doğrudan uygulamayı geliştiren kişiye ulaşır.`,
    sections: [
      {
        heading: `Aboneliğimi nasıl yönetir ya da iptal ederim?`,
        body: [
          `Abonelikler tamamen Apple tarafından faturalandırılır ve yönetilir. iPhone'unuzda: Ayarlar → [adınız] → Abonelikler → Any Text. Uygulama içinden de ulaşabilirsiniz: Ayarlar → Abonelik → "Aboneliği yönet".`,
        ],
      },
      {
        heading: `Hesabımı ve verilerimi nasıl silerim?`,
        body: [
          `Uygulama içinde: Ayarlar → Hesap → Hesabı sil. Bu işlem hesabınızı ve profilinizi kalıcı olarak kaldırır, cihazınızda kayıtlı olan her şeyi — kelimeler, ilerleme, favoriler — temizler. Ayrıntılar için {{link:/privacy/|Gizlilik Politikamıza}} bakın.`,
        ],
      },
      {
        heading: `Bir hata buldum ya da bir çeviri yanlış görünüyor.`,
        body: [
          `Ne gördüğünüzü ve mümkünse hangi ekranda, hangi seviyede ve hangi dilde olduğunu bize e-posta ile bildirin — genellikle sorunu bulmak için bu yeterli olur.`,
        ],
      },
      {
        heading: `Yeni bir özellik ya da eklenecek bir kitap veya video önerebilir miyim?`,
        body: [
          `Evet — bize e-posta gönderin. Any Text küçük ve aktif olarak geliştirilen bir uygulama; okuyucu önerileri bundan sonra neyin yapılacağını gerçekten şekillendiriyor.`,
        ],
      },
    ],
  },
  fr: {
    title: `Assistance`,
    intro: `Une question, un bug trouvé, ou une suggestion ? Écrivez à mstfgul00@gmail.com — le message arrive directement à la personne qui développe l'application.`,
    sections: [
      {
        heading: `Comment gérer ou résilier mon abonnement ?`,
        body: [
          `Les abonnements sont entièrement facturés et gérés par Apple. Sur votre iPhone : Réglages → [votre nom] → Abonnements → Any Text. Vous pouvez aussi y accéder depuis l'application : Réglages → Abonnement → « Gérer l'abonnement ».`,
        ],
      },
      {
        heading: `Comment supprimer mon compte et mes données ?`,
        body: [
          `Dans l'application : Réglages → Compte → Supprimer le compte. Cela supprime définitivement votre compte et votre profil, et efface tout ce qui est enregistré sur votre appareil — mots, progression, favoris. Consultez notre {{link:/privacy/|politique de confidentialité}} pour plus de détails.`,
        ],
      },
      {
        heading: `J'ai trouvé un bug, ou une traduction me semble incorrecte.`,
        body: [
          `Écrivez-nous en décrivant ce que vous avez constaté et, si possible, sur quel écran, à quel niveau et dans quelle langue cela s'est produit — c'est généralement suffisant pour identifier le problème.`,
        ],
      },
      {
        heading: `Puis-je suggérer une nouvelle fonctionnalité, ou un livre ou une vidéo à ajouter ?`,
        body: [
          `Oui — écrivez-nous. Any Text est une petite application activement développée, et les suggestions des lecteurs influencent réellement ce qui est construit ensuite.`,
        ],
      },
    ],
  },
  it: {
    title: `Assistenza`,
    intro: `Hai una domanda, hai trovato un bug, o vuoi suggerire qualcosa? Scrivi a mstfgul00@gmail.com — arriva direttamente alla persona che sviluppa l'app.`,
    sections: [
      {
        heading: `Come gestisco o annullo il mio abbonamento?`,
        body: [
          `Gli abbonamenti sono fatturati e gestiti interamente da Apple. Sul tuo iPhone: Impostazioni → [il tuo nome] → Abbonamenti → Any Text. Puoi arrivarci anche dall'interno dell'app: Impostazioni → Abbonamento → "Gestisci abbonamento".`,
        ],
      },
      {
        heading: `Come elimino il mio account e i miei dati?`,
        body: [
          `Nell'app: Impostazioni → Account → Elimina account. Questo rimuove definitivamente il tuo account e il tuo profilo, e cancella tutto ciò che è salvato sul tuo dispositivo — parole, progressi, preferiti. Consulta la nostra {{link:/privacy/|informativa sulla privacy}} per i dettagli.`,
        ],
      },
      {
        heading: `Ho trovato un bug, o una traduzione sembra sbagliata.`,
        body: [
          `Scrivici cosa hai visto e, se puoi, in quale schermata, livello e lingua è successo — di solito basta per rintracciarlo.`,
        ],
      },
      {
        heading: `Posso suggerire una nuova funzione, o un libro o video da aggiungere?`,
        body: [
          `Sì — scrivici. Any Text è un'app piccola e in sviluppo attivo, e i suggerimenti dei lettori influenzano davvero cosa viene realizzato in seguito.`,
        ],
      },
    ],
  },
  es: {
    title: `Soporte`,
    intro: `¿Tienes una pregunta, encontraste un error, o quieres sugerir algo? Escribe a mstfgul00@gmail.com — llega directamente a la persona que desarrolla la app.`,
    sections: [
      {
        heading: `¿Cómo gestiono o cancelo mi suscripción?`,
        body: [
          `Las suscripciones las factura y gestiona Apple por completo. En tu iPhone: Ajustes → [tu nombre] → Suscripciones → Any Text. También puedes llegar desde dentro de la app: Ajustes → Suscripción → "Gestionar suscripción".`,
        ],
      },
      {
        heading: `¿Cómo elimino mi cuenta y mis datos?`,
        body: [
          `En la app: Ajustes → Cuenta → Eliminar cuenta. Esto elimina tu cuenta y tu perfil de forma permanente, y borra todo lo guardado en tu dispositivo — palabras, progreso, favoritos. Consulta nuestra {{link:/privacy/|Política de privacidad}} para más detalles.`,
        ],
      },
      {
        heading: `Encontré un error, o una traducción parece incorrecta.`,
        body: [
          `Escríbenos contándonos qué viste y, si puedes, en qué pantalla, nivel e idioma ocurrió — normalmente es suficiente para localizarlo.`,
        ],
      },
      {
        heading: `¿Puedo sugerir una nueva función, o un libro o vídeo para añadir?`,
        body: [
          `Sí — escríbenos. Any Text es una app pequeña y en desarrollo activo, y las sugerencias de los lectores realmente influyen en lo que se construye a continuación.`,
        ],
      },
    ],
  },
  de: {
    title: `Support`,
    intro: `Haben Sie eine Frage, einen Fehler gefunden oder einen Vorschlag? Schreiben Sie an mstfgul00@gmail.com — die E-Mail geht direkt an die Person, die die App entwickelt.`,
    sections: [
      {
        heading: `Wie verwalte oder kündige ich mein Abonnement?`,
        body: [
          `Abonnements werden vollständig von Apple abgerechnet und verwaltet. Auf Ihrem iPhone: Einstellungen → [Ihr Name] → Abonnements → Any Text. Sie erreichen es auch aus der App heraus: Einstellungen → Abonnement → „Abonnement verwalten".`,
        ],
      },
      {
        heading: `Wie lösche ich mein Konto und meine Daten?`,
        body: [
          `In der App: Einstellungen → Konto → Konto löschen. Dadurch werden Ihr Konto und Ihr Profil dauerhaft entfernt, und alles, was auf Ihrem Gerät gespeichert ist — Wörter, Fortschritt, Favoriten — wird gelöscht. Details finden Sie in unserer {{link:/privacy/|Datenschutzerklärung}}.`,
        ],
      },
      {
        heading: `Ich habe einen Fehler gefunden, oder eine Übersetzung wirkt falsch.`,
        body: [
          `Schreiben Sie uns, was Sie gesehen haben, und wenn möglich, auf welchem Bildschirm, bei welchem Niveau und in welcher Sprache es aufgetreten ist — das reicht meist, um es aufzuspüren.`,
        ],
      },
      {
        heading: `Kann ich eine neue Funktion oder ein Buch bzw. Video zum Hinzufügen vorschlagen?`,
        body: [
          `Ja — schreiben Sie uns. Any Text ist eine kleine, aktiv weiterentwickelte App, und die Vorschläge unserer Leserschaft prägen wirklich, was als Nächstes entsteht.`,
        ],
      },
    ],
  },
  nl: {
    title: `Ondersteuning`,
    intro: `Heb je een vraag, een bug gevonden, of wil je iets voorstellen? Mail naar mstfgul00@gmail.com — dat komt rechtstreeks bij de persoon die de app bouwt.`,
    sections: [
      {
        heading: `Hoe beheer of annuleer ik mijn abonnement?`,
        body: [
          `Abonnementen worden volledig door Apple gefactureerd en beheerd. Op je iPhone: Instellingen → [je naam] → Abonnementen → Any Text. Je kunt er ook vanuit de app komen: Instellingen → Abonnement → "Abonnement beheren".`,
        ],
      },
      {
        heading: `Hoe verwijder ik mijn account en gegevens?`,
        body: [
          `In de app: Instellingen → Account → Account verwijderen. Dit verwijdert je account en profiel permanent, en wist alles wat op je apparaat is opgeslagen — woorden, voortgang, favorieten. Zie ons {{link:/privacy/|privacybeleid}} voor details.`,
        ],
      },
      {
        heading: `Ik heb een bug gevonden, of een vertaling klopt niet.`,
        body: [
          `Mail ons wat je zag en, indien mogelijk, op welk scherm, niveau en in welke taal het gebeurde — meestal is dat genoeg om het op te sporen.`,
        ],
      },
      {
        heading: `Kan ik een nieuwe functie voorstellen, of een boek of video om toe te voegen?`,
        body: [
          `Ja — mail ons. Any Text is een kleine, actief ontwikkelde app, en suggesties van lezers bepalen echt mede wat er hierna gebouwd wordt.`,
        ],
      },
    ],
  },
};
