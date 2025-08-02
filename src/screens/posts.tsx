export default [
  // NEWS (with video)
  {
    id: "1",
    category: "news",
    user: { name: "@StSiege", profileImage: require("../../assets/images/celeLogo.png") },
    images: [require("../../assets/images/posts/post.png")],
    video: require("../../assets/videos/demo.mp4"), // sample video
    text: "Quand la vie vous donne des citrons, ne faites pas de la limonade. Faites un gâteau au citron - cela vous rendra plus heureux.",
    isLongText: false,
    likes: 120,
    comments: 15,
    shares: 8,
  },
  {
    id: "2",
    category: "news",
    user: { name: "voyage.avec.mike", profileImage: require("../../assets/images/celeLogo.png") },
    images: [
      require("../../assets/images/posts/post.png"),
      require("../../assets/images/posts/post.png"),
    ],
    text: "Incroyable voyage à la montagne avec des amis ! Ambiance nature toute la journée 🌲🏔️",
    isLongText: false,
    likes: 250,
    comments: 42,
    shares: 19,
  },

  // ANNOUNCEMENTS (with audio)
  {
    id: "11",
    category: "announcements",
    title: "Programme de l'Anniversaire de l'Église publié",
    date: "2025-08-10",
    content:
      "Rejoignez-nous pour les célébrations du 50ème anniversaire de l'Église à partir du 15 août. Événements spéciaux, prières et repas communautaires sont prévus.",
    image: require("../../assets/images/posts/post.png"),
    audio: require("../../assets/audio/demo.mp3"), // sample audio
  },
  {
    id: "12",
    category: "announcements",
    title: "Nomination du nouveau responsable de la jeunesse",
    date: "2025-07-25",
    content:
      "Nous accueillons chaleureusement le frère Jean Dupont en tant que nouveau responsable du ministère de la jeunesse. Nous prions pour sa sagesse et son succès.",
    image: require("../../assets/images/posts/post.png"),
  },

  // REFORMS (no media change)
  {
    id: "21",
    category: "reforms",
    title: "Nouvelle politique d'inscription aux offices",
    summary:
      "La participation aux offices nécessite désormais une inscription préalable via l'application de l'Église, en raison des limites de capacité.",
    fullText:
      "En réponse au nombre croissant de fidèles, l'Église a mis en place une nouvelle politique d'inscription pour garantir la sécurité et l'ordre pendant les offices.",
    updatedBy: "Admin",
    updatedOn: "2025-07-20",
  },

  // DECISIONS
  {
    id: "31",
    category: "decisions",
    decisionTitle: "Approbation du fonds pour la construction de l'Église",
    decisionDate: "2025-07-01",
    decisionSummary:
      "La congrégation a approuvé la création d'un fonds destiné à la construction de nouvelles installations.",
    decisionDetails:
      "Suite à l'assemblée du 30 juin, le fonds a été approuvé à l'unanimité avec un objectif de collecte de 500 000$ sur deux ans.",
  },

  // EVENTS
  {
    id: "41",
    category: "events",
    eventName: "Programme de solidarité communautaire",
    eventDate: "2025-08-20",
    eventLocation: "Salle principale de l'Église",
    description:
      "Participez à une journée de solidarité : collecte alimentaire, consultations médicales gratuites et animations familiales.",
    bannerImage: require("../../assets/images/posts/post.png"),
  },
];
