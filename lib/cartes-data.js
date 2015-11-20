Cartes = [
  {
  	carteId: "L1",
    intitule : {fr:"Lanceur léger #1", en:"Lightweight launcher #1"},
    description : {fr:"Cette fusée, type Pegasus, lance des charges légères (maximum 400Kg, uniquement en orbite basse) depuis un avion. Elle est assez fiable (85%).", en:"This rocket , like Pegasus launches light loads (max 400Kg , only in low orbit) from an airplane . It is quite reliable (85%)"},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:["O3","O4","O5","O6"] 
    },
    tags: ["lanceur"], 
    valEur : 15000000,
    valNrg : 0,
    valPds : 400,
    valVol : 0,
    ValSci : 0,
    fiabilite: 0.85,
    active : true,
    cubesat: false 
  },
  {
    carteId: "L2",
    intitule : {fr:"Lanceur léger #2", en:"Lightweight launcher #2"},
    description : {fr:"Cette fusée, type Shavit, lance des charges très légères (maximum 200Kg, uniquement en orbite basse). Elle est peu fiable (60%).", en:"This rocket , like Shavit launches very light loads (max 200Kg , only in low orbit). It is unreliable (60%)"},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:["O3","O4","O5","O6"] 
    },
    tags: ["lanceur"], 
    valEur : 10000000,
    valNrg : 0,
    valPds : 200,
    valVol : 0,
    ValSci : 0,
    fiabilite: 0.60,
    active : true,
    cubesat: false 
  },
  {
    carteId: "L3",
    intitule : {fr:"Lanceur moyen #1", en:"Medium launcher #1"},
    description : {fr:"Cette fusée, type Soyouz-Freyat, lance des charges moyennes (5t en orbite basse, 3t en orbite haute, 1.6t sur une trajectoire interplanétaire.). Elle est assez fiable (80%).", en:"This rocket , Soyuz- kind Freyat launches medium loads (5t in low orbit , 3t in high orbit, 1.6t on an interplanetary trajectory. ) . It is quite reliable (80%)"},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["lanceur"], 
    valEur : 45000000,
    valNrg : 0,
    valPds : [{condition: "{$or:[{'deck.cartes.carteId': 'O1'},{'deck.cartes.carteId': 'O2'}]}", valeur: 5000}, {condition: "{$or:[{'deck.cartes.carteId': 'O3'},{'deck.cartes.carteId': 'O4'}]}", valeur: 3000}, {condition: "{$or:[{'deck.cartes.carteId': 'O5'},{'deck.cartes.carteId': 'O6'}]}", valeur: 1600}],
    valVol : 0,
    ValSci : 0,
    fiabilite: 0.60,
    active : true,
    cubesat: false 
  },
  {
    carteId: "L4",
    intitule : {fr:"Lanceur moyen #2", en:"Medium launcher #2"},
    description : {fr:"Cette fusée, type GSLV, lance des charges moyennes (5t en orbite basse, 2.5t en orbite haute, 1t sur une trajectoire interplanétaire.). Elle est très peu fiable (40%).", en:"This rocket , like GSLV launches medium loads (5t in low orbit , 2.5t in high orbit, 1t on an interplanetary trajectory. ) . It is very unreliable (40%)"},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["lanceur"], 
    valEur : 30000000,
    valNrg : 0,
    valPds : [{condition: "{$or:[{'deck.cartes.carteId': 'O1'},{'deck.cartes.carteId': 'O2'}]}", valeur: 5000}, {condition: "{$or:[{'deck.cartes.carteId': 'O3'},{'deck.cartes.carteId': 'O4'}]}", valeur: 2500}, {condition: "{$or:[{'deck.cartes.carteId': 'O5'},{'deck.cartes.carteId': 'O6'}]}", valeur: 1000}],
    valVol : 0,
    ValSci : 0,
    fiabilite: 0.40,
    active : true,
    cubesat: false 
  },
  {
    carteId: "L5",
    intitule : {fr:"Lanceur lourd", en:"Heavy launcher"},
    description : {fr:"Cette fusée, type Arianne V, est capable de lancer des charges très lourdes (grosses missions avec beaucoup d\'instruments scientifiques) : au maximum 20t en orbite basse, 10t en orbite haute et 4t sur une trajectoire interplanétaire. Sa fiabilité est excellente (90%).", en:"This rocket , like Arianne V is capable of launching heavy loads (large missions with a lot\'s scientific instruments ) : maximum 20t in low orbit , 10t high-orbit and 4t on an interplanetary trajectory. Its reliability is excellent (90%)"},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["lanceur"], 
    valEur : 150000000,
    valNrg : 0,
    valPds : [{condition: "{$or:[{'deck.cartes.carteId': 'O1'},{'deck.cartes.carteId': 'O2'}]}", valeur: 20000}, {condition: "{$or:[{'deck.cartes.carteId': 'O3'},{'deck.cartes.carteId': 'O4'}]}", valeur: 10000}, {condition: "{$or:[{'deck.cartes.carteId': 'O5'},{'deck.cartes.carteId': 'O6'}]}", valeur: 4000}],
    valVol : 0,
    ValSci : 0,
    fiabilite: 0.40,
    active : true,
    cubesat: false 
  },
  {
    carteId: "O1",
    intitule : {fr:"Orbite basse équatoriale", en:"Equatorial Low Earth Orbit"},
    description : {fr:"Le satellite tourne autour de la planète dans le plan de son équateur, ce qui ne permet que des observations courtes.", en:"The satellite orbits the planet in the plane of its equator , which only allows short observations."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["orbite"], 
    valEur : 0,
    valNrg : 0,
    valPds : 0,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "O2",
    intitule : {fr:"Orbite basse polaire", en:"Polar low Earth orbit"},
    description : {fr:"Après quelques manoeuvres, le satellite tourne autour de la planète dans un plan incliné par rapport à l'équateur, ce qui permet de la cartographier complètement aisément.", en:"After a few maneuvers, the satellite orbits the planet in a plane inclined to the equator , allowing the mapping completely easily."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["orbite"], 
    valEur : 5000000,
    valNrg : 0,
    valPds : 0,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "O3",
    intitule : {fr:"Orbite moyenne ou haute", en:"Medium or high orbit"},
    description : {fr:"Après quelques manoeuvres, le satellite s'installe sur une orbite plus distante de la planète, ce qui permet des observations du ciel plus longues ou une étude planètaire plus globale.", en:"After a few maneuvers , the satellite settles on a more distant orbit of the planet , allowing longer sky observations or a broader planetary study."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["orbite"], 
    valEur : 10000000,
    valNrg : 0,
    valPds : 0,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "O4",
    intitule : {fr:"Orbite lagrangienne", en:"Lagrangian orbit"},
    description : {fr:"Après quelques manoeuvres, le satellite s'installe en un point de Lagrange, ce qui lui permet d'observer le Soleil en continu ou d'observer le ciel dans de meilleurs conditions.", en:"After several operations , the satellite is moved to a Lagrange point , which allows him to observe the sun continuously or observing the sky in better conditions."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["orbite"], 
    valEur : 20000000,
    valNrg : 0,
    valPds : 0,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "O5",
    intitule : {fr:"Transfert d'Hohmann", en:"Hohmann transfer"},
    description : {fr:"Cette orbite permet de passer facilement d'une planète à l'autre. Obligatoire si mission interplanétaire, ne peut être utilisée seule.", en:"This orbit allows to easily switch from one planet to another . Required if interplanetary mission may not be used alone."},
    tip: {fr:"", en:""},
    regles: {
        necessite:["{$or:[{'deck.cartes.carteId': 'O1'},{'deck.cartes.carteId': 'O2'},{'deck.cartes.carteId': 'O3'}]}"],
        incompatible:[] 
    },
    tags: ["orbite"], 
    valEur : 0,
    valNrg : 0,
    valPds : 0,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "O6",
    intitule : {fr:"Fronde gravitationnelle", en:"Gravitational slingshot"},
    description : {fr:"Pour rejoindre Mercure ou les planètes géantes, cette manoeuvre permet d'économiser du carburant en gagnant de la vitesse via un frôlement de planète.", en:"To join Mercury or the giant planets , this operation saves fuel by gaining speed through a world of touch."},
    tip: {fr:"", en:""},
    regles: {
        necessite:["{$or:[{'deck.cartes.carteId': 'O1'},{'deck.cartes.carteId': 'O2'},{'deck.cartes.carteId': 'O3'}]}"],
        incompatible:[] 
    },
    tags: ["orbite"], 
    valEur : 0,
    valNrg : 0,
    valPds : 0,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "S1",
    intitule : {fr:"Segment sol simple", en:"Segment single ground"},
    description : {fr:"Version basique du segment sol qui ne permet que des fonctionnalités simples.", en:"Basic operation of the ground segment which allows only simple features."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["segmentSol"], 
    valEur : 5000000,
    valNrg : 0,
    valPds : 0,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "S2",
    intitule : {fr:"Segment sol observatoire", en:"Segment ground observatory"},
    description : {fr:"Outre les fonctions de base, ce segment sol collecte les projets scientifiques et planifie les observations visant précisément une zone du ciel ou une région de la planète.", en:"Besides the basic functions, ground segment collects scientific projects and plans aimed specifically a zone observations of the sky or region of the planet."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["segmentSol"], 
    valEur : 10000000,
    valNrg : 0,
    valPds : 0,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "S3",
    intitule : {fr:"Segment sol atterisseur", en:"Segment ground lander"},
    description : {fr:"Outre les fonctions avancées, ce segment sol gère les délicates phases d'atterrissage et de travail au sol.", en:"In addition to the advanced functions, it manages the ground segment delicate floor landing and work phases."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["segmentSol"], 
    valEur : 35000000,
    valNrg : 0,
    valPds : 0,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "Z1",
    intitule : {fr:"Petite structure", en:"Small strucutre"},
    description : {fr:"Structure pour missions ne dépassant pas 500kg.", en:"Structure for assignments not exceeding 500kg."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["structure"], 
    valEur : 10000000,
    valNrg : 10,
    valPds : 20,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "Z2",
    intitule : {fr:"Structure moyenne", en:"Medium strucutre"},
    description : {fr:"Structure pour missions ne dépassant pas 2t.", en:"Structure for assignments not exceeding 2t."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["structure"], 
    valEur : 15000000,
    valNrg : 10,
    valPds : 100,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "Z3",
    intitule : {fr:"Grande structure", en:"Big strucutre"},
    description : {fr:"Structure plus robuste pour missions de plus de 2t.", en:"More robust structure for assignments of more than 2t."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["structure"], 
    valEur : 40000000,
    valNrg : 10,
    valPds : 300,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "Z4",
    intitule : {fr:"Module de croisière", en:"Cruise module"},
    description : {fr:"Accompagnant un atterrisseur seul (sans orbiteur associé), il leur permet d'effectuer le trajet interplanétaire.", en:"Accompanying one lander (without associated orbiter ), it allows them to perform the interplanetary journey."},
    tip: {fr:"Nécessaire si atterrisseur et aucune autre structure choisie", en:"Required if landing gear and no other structure chosen"},
    regles: {
        necessite:[],
        incompatible:[{"deck.cartes.tags":"instrument"}] 
    },
    tags: ["structure"], 
    valEur : 10000000,
    valNrg : 10,
    valPds : 20,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "T1",
    intitule : {fr:"Contrôle thermique passif", en:"Passive thermal control"},
    description : {fr:"Le contrôle thermique passif, obligatoire, repose sur la simple isolation (couvertures, radiateurs, parasols). La température du vaisseau reste dans les marges acceptables pour un coût modique.", en:"The passive thermal control , mandatory, based on the basic insulation (blankets , heaters , parasols ) . The vessel temperature remains within acceptable margins for a small fee."},
    tip: {fr:"Obligatoire", en:"Mandatory"},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["thermique"], 
    valEur : 5000000,
    valNrg : 0,
    valPds : 10,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "T2",
    intitule : {fr:"Contrôle thermique actif", en:"Active thermal control"},
    description : {fr:"Le contrôle thermique actif utilise des résistances chauffantes ou des systèmes refroidisseurs. La température du vaisseau est parfaitement stabilisée.", en:"The active thermal control uses heaters or coolers systems. The vessel is fully temperature stabilized."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["thermique"], 
    valEur : 15000000,
    valNrg : 40,
    valPds : 25,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "T3",
    intitule : {fr:"Refroidisseur pour IR", en:"Cooler IR"},
    description : {fr:"Les téléscopes observant dans l'IR lointain doivent être refroidis à des températures proches du zéro absolu, ce qui se fait avec de l'hélium liquide.", en:"Telescopes observing in the far IR must be cooled to temperatures close to absolute zero, which is done with liquid helium."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["thermique"], 
    valEur : 40000000,
    valNrg : 150,
    valPds : 70,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "C1",
    intitule : {fr:"Antenne à haut gain", en:"High-gain antenna"},
    description : {fr:"Elle envoie beaucoup de données en peu de temps et peut être en outre server pour des expériences scientifiques. Elle est par contre plus chère et nécessite d'être pointée vers la Terre.", en:"It sends a lot of data in a short time and may be further server for scientific experiments . It is against more expensive and needs to be pointed towards the Earth."},
    tip: {fr:"Une antenne est obligatoire", en:"An antenna is required"},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["communications, antenne"], 
    valEur : 3000000,
    valNrg : 30,
    valPds : 15,
    valVol : 0,
    ValSci : 1,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "C2",
    intitule : {fr:"Antenne à bas gain", en:"Low-gain antenna"},
    description : {fr:"Elle envoie peu d'information par seconde mais n'a pas besoin d'être dirigée vers la Terre. Elle peut servir de réserve en cas de problème.", en:"It sends bit of information per second , but does not need to be directed towards the Earth. It can serve as a reserve in case of problems."},
    tip: {fr:"Une antenne est obligatoire", en:"An antenna is required"},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["communications, antenne"], 
    valEur : 1000000,
    valNrg : 10,
    valPds : 1,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "C3",
    intitule : {fr:"Gestion des communications", en:"Communications Management"},
    description : {fr:"Quelques systèmes additionnels (principalement électroniques) sont nécessaires pour gérer au mieux les communications. Ils s'occupent également de l'encodage des données.", en:"Some additional systems (mainly electronic ) are needed to better manage communications. They are also involved in data encoding."},
    tip: {fr:"Obligatoire", en:"Mandatory"},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["communications, gestionCommunications"], 
    valEur : 5000000,
    valNrg : 10,
    valPds : 5,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "M1",
    intitule : {fr:"Mémoire standard", en:"Standard Memory"},
    description : {fr:"Stocke 50Gb de données collectées jusqu'à ce qu'elles puissent être envoyées.", en:"Stores 50Gb of data collected until they can be sent."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["commandes","memoire"], 
    valEur : 300000,
    valNrg : 3,
    valPds : 1,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "M2",
    intitule : {fr:"Mémoire moyenne", en:"Medium Memory"},
    description : {fr:"Stocke 200Gb de données collectées jusqu'à ce qu'elles puissent être envoyées.", en:"Stores 200Gb of data collected until they can be sent."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["commandes","memoire"], 
    valEur : 500000,
    valNrg : 4,
    valPds : 2,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "M3",
    intitule : {fr:"Grosse Mémoire", en:"Big Memory"},
    description : {fr:"Stocke 2Tb de données, en deux systèmes séparés, ce qui permet de conserver une certaine mémoire s'il y a un problème électronique.", en:"Stores 2Tb data in two separate systems , which allows to retain a certain memory if there is an electronic failure"},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["commandes","memoire"], 
    valEur : 1000000,
    valNrg : 7,
    valPds : 3,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "M4",
    intitule : {fr:"Calculateur de bord simple", en:"Single board computer"},
    description : {fr:"Calculateur minimal, sans redondance.", en:"Minimum computer without redundancy"},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["commandes","calculateur"], 
    valEur : 8000000,
    valNrg : 25,
    valPds : 4,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "M5",
    intitule : {fr:"Calculateur de bord standard", en:"Standard board computer"},
    description : {fr:"Calculateur qui effectue les opérations standards et possède des systèmes de réserve, activés en cas de problème, permettant d'éviter la perte de la mission.", en:"Calculator that performs standard operations and has reserve systems , activated in case of trouble , avoiding the loss of the mission."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["commandes","calculateur"], 
    valEur : 10000000,
    valNrg : 30,
    valPds : 5,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "M6",
    intitule : {fr:"Calculateur de bord avancé", en:"Advanced board computer"},
    description : {fr:"En plus des opérations standrads et des réserves, il peut prendre des décisions simples sans devoir communiquer avec la Terre.", en:"In addition standrads operations and reserves , it can make simple decisions without having to communicate with Earth."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["commandes","calculateur"], 
    valEur : 20000000,
    valNrg : 50,
    valPds : 6,
    valVol : 0,
    ValSci : 1,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "E1",
    intitule : {fr:"Panneau solaire de faible puissance", en:"Low power solar panel"},
    description : {fr:"Ils fournissent 150W quand ils sont éclairés non loin de la Terre, 300W près de Vénus, 1kW près de Mercure.", en:"They provide 150W when illuminated near the Earth, Venus nearly 300W , 1kW near Mercure."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[{"deck.cartes.tags":"energieBatterie"}],
        incompatible:[] 
    },
    tags: ["energie"], 
    valEur : 2000000,
    valNrg :  [{condition: "{'planete.distance': 0}", valeur: 150}, {condition: "{'planete.distance': 1}", valeur: 300}, {condition: "{$gte:{'planete.distance': 2}}", valeur: 1000}],
    valPds : 10,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "E2",
    intitule : {fr:"Panneau solaire de moyenne puissance", en:"Medium power solar panel"},
    description : {fr:"Ils fournissent 600W quand ils sont éclairés non loin de la Terre et 300W près de Mars.", en:"They provide 600W when illuminated near the Earth, Mars nearly 300W."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[{"deck.cartes.tags":"energieBatterie"}],
        incompatible:[] 
    },
    tags: ["energie"], 
    valEur : 6000000,
    valNrg :  [{condition: "{'planete.distance': 0}", valeur: 600}, {condition: "{'planete.distance': 1}", valeur: 300}],
    valPds : 30,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "E3",
    intitule : {fr:"Panneau solaire de grande puissance", en:"High power solar panel"},
    description : {fr:"Ils fournissent 1kW quand ils sont éclairés non loin de la Terre et 500W près de Mars et, après traitement spécial, 100W près de Jupiter.", en:"They provide 1kW when illuminated near the Earth and 500W near Mars and after special treatment, 100W near Jupiter."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[{"deck.cartes.tags":"energieBatterie"}],
        incompatible:[] 
    },
    tags: ["energie"], 
    valEur : 10000000,
    valNrg :  [{condition: "{'planete.distance': 0}", valeur: 1000}, {condition: "{'planete.distance': 1}", valeur: 500}, {condition: "{'planete.distance': 2}", valeur: 100}],
    valPds : 50,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "E4",
    intitule : {fr:"Générateur thermoélectrique", en:"Thermoelectric generator"},
    description : {fr:"Le RTG fournit 150W quelles que soient les conditions et ce durant des années. Il est indispensable pour les missions au-delà de Jupiter.", en:"RTG provides 150W whatever the conditions and this for years. It is essential for missions beyond Jupiter."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["energie"], 
    valEur : 150000000,
    valNrg :  150,
    valPds : 50,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "E5",
    intitule : {fr:"Pile à combustible", en:"Fuel cell"},
    description : {fr:"La pile fournit 1kW quelles que soient les conditions, mais seulement durant quelques mois. Elle a été utilisée lors de nombreuses missions de la navette américaine.", en:"The battery provides what 1kW all conditions , but only for a few months . It has been used in numerous missions of the Space Shuttle."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["energie"], 
    valEur : 10000000,
    valNrg :  1000,
    valPds : 20,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "E6",
    intitule : {fr:"Batterie", en:"Battery"},
    description : {fr:"La batterie stocke l'énergie fournie par ailleurs, pour la restituer en cas d'obscurité (pour les panneaux solaires) et/ou en cas de pic d'utilisation (pour les RTG).", en:"The battery stores the energy supplied also to restore it in case of darkness ( for solar panels ) and / or in case of peak usage (for RTG )."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["energie","energieBatterie"], 
    valEur : 1000000,
    valNrg :  5,
    valPds : 40,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "E7",
    intitule : {fr:"Gestion de l'énergie", en:"Energy management"},
    description : {fr:"Ces systèmes électroniques indispensables contrôlent la fourniture d'énergie électronique au vaisseau.", en:"These indispensable electronic systems control the supply of electronic energy to the ship."},
    tip: {fr:"Obligatoire", en:"Mandatory"},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["energie","energieGestion"], 
    valEur : 5000000,
    valNrg :  10,
    valPds : 10,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "A1",
    intitule : {fr:"Senseurs solaires", en:"Sun sensors"},
    description : {fr:"Pour la stabilisation 3 axes, les senseurs solaires estiment approximativement l'attitude du vaisseau en utilisant la direction du Soleil.", en:"Stabilization 3-axis solar sensors say about the attitude of the ship using the direction of the sun."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[{"deck.cartes.carteId":"S2"}],
        incompatible:[] 
    },
    tags: ["attitude","attitudeCapteur"], 
    valEur : 1000000,
    valNrg :  2,
    valPds : 1,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "A2",
    intitule : {fr:"Suiveurs solaires", en:"Solar trackers"},
    description : {fr:"Pour la stabilisation 3 axes, ce système mesure précisément l'attitude du vaisseau en utilisant la position d'étoiles brillantes.", en:"Stabilization 3-axis , the system accurately measures the attitude of the vessel using the bright stars position."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[{"deck.cartes.carteId":"S2"}],
        incompatible:[] 
    },
    tags: ["attitude","attitudeCapteur"], 
    valEur : 5000000,
    valNrg :  10,
    valPds : 5,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "A3",
    intitule : {fr:"Centrale inertielle", en:"Inertial Central"},
    description : {fr:"Pour la stabilisation 3 axes, la centralle inertielle mesure précisément l'attitude du vaiseau grâce à une référence interne stable. Cette référence dérive avec le temps, mais cela peut être calibré.", en:"Stabilization 3-axis inertial measurement centralle precisely the attitude of vaiseau through stable internal reference. This reference drift with time, but this can be calibrated."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[{"deck.cartes.carteId":"S2"}],
        incompatible:[] 
    },
    tags: ["attitude","attitudeCapteur"], 
    valEur : 7000000,
    valNrg :  10,
    valPds : 7,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "A4",
    intitule : {fr:"Petites roues à réaction", en:"Small reaction wheels"},
    description : {fr:"Les petites roues à réaction permettent une stabilisation 3 axes des structures légères et un pointage précis vers n'importe quelle direction si l'attitude est mesurée par ailleurs.", en:"Small reaction wheels allow a 3-axis stabilization lightweight structures and a precise pointing to any direction if the attitude is measured elsewhere."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[{"deck.cartes.carteId":"S2"},{"deck.cartes.tags":"attitudeCapteur"},{$or:[{"deck.cartes.carteId":"Z1"},{"deck.cartes.carteId":"Z4"}]}],
        incompatible:[{$or:[{"deck.cartes.carteId":"Z2"},{"deck.cartes.carteId":"Z3"}]}] 
    },
    tags: ["attitude","attitudeRoues"], 
    valEur : 2000000,
    valNrg :  10,
    valPds : 5,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "A5",
    intitule : {fr:"Grosses roues à réaction", en:"Big reaction wheels"},
    description : {fr:"Les grosses roues à réaction permettent une stabilisation 3 axes des structures moyennes ou lourdes, et un pointage précis vers n'importe quelle direction si l'attitude est mesurée par ailleurs.", en:"Large reaction wheels allow a 3-axis stabilization means or heavy structures , and a precise pointing to any direction if the attitude is measured elsewhere."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[{"deck.cartes.carteId":"S2"},{"deck.cartes.tags":"attitudeCapteur"},{$or:[{"deck.cartes.carteId":"Z2"},{"deck.cartes.carteId":"Z3"}]}],
        incompatible:[{$or:[{"deck.cartes.carteId":"Z1"},{"deck.cartes.carteId":"Z4"}]}] 
    },
    tags: ["attitude","attitudeRoues"], 
    valEur : 5000000,
    valNrg :  40,
    valPds : 30,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  }
];