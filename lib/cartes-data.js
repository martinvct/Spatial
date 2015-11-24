CartesTXT = [
  {
  	carteId: "L1",
    intitule : {fr:"Lanceur léger #1", en:"Lightweight launcher #1"},
    description : {fr:"Cette fusée, type Pegasus, lance des charges légères (maximum 400Kg, uniquement en orbite basse) depuis un avion. Elle est assez fiable (85%).", en:"This rocket , like Pegasus launches light loads (max 400Kg , only in low orbit) from an airplane . It is quite reliable (85%)"},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:["{'deck.cartes.carteId': 'O3'}","{'deck.cartes.carteId': 'O4'}","{'deck.cartes.carteId': 'O5'}","{'deck.cartes.carteId': 'O6'}"] 
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
        incompatible:["{'deck.cartes.carteId': 'O3'}","{'deck.cartes.carteId': 'O4'}","{'deck.cartes.carteId': 'O5'}","{'deck.cartes.carteId': 'O6'}"] 
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
        incompatible:["{'deck.cartes.tags':'instrument'}"] 
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
    tags: ["communications", "antenne"], 
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
    tags: ["communications", "antenne"], 
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
    tags: ["communications", "gestionCommunications"], 
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
        necessite:["{'deck.cartes.tags':'energieBatterie'}"],
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
        necessite:["{'deck.cartes.tags':'energieBatterie'}"],
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
        necessite:["{'deck.cartes.tags':'energieBatterie'}"],
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
        necessite:["{'deck.cartes.carteId':'S2'}"],
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
        necessite:["{'deck.cartes.carteId':'S2'}"],
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
        necessite:["{'deck.cartes.carteId':'S2'}"],
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
        necessite:["{'deck.cartes.carteId':'P1'}","{'deck.cartes.carteId':'S2'}","{'deck.cartes.tags':'attitudeCapteur'}","{$or:[{'deck.cartes.carteId':'Z1'},{'deck.cartes.carteId':'Z4'}]}"],
        incompatible:["{$or:[{'deck.cartes.carteId':'Z2'},{'deck.cartes.carteId':'Z3'}]}"] 
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
        necessite:["{'deck.cartes.carteId':'P1'}","{'deck.cartes.carteId':'S2'}","{'deck.cartes.tags':'attitudeCapteur'}","{$or:[{'deck.cartes.carteId':'Z2'},{'deck.cartes.carteId':'Z3'}]}"],
        incompatible:["{$or:[{'deck.cartes.carteId':'Z1'},{'deck.cartes.carteId':'Z4'}]}"] 
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
  },
  {
    carteId: "A6",
    intitule : {fr:"Stabilisation par rotation", en:"Stabilization rotation"},
    description : {fr:"Le vaisseau est stabilisé dans un axe par sa propre rotation, ce qui facilite les scans du ciel et du sol planétaire, ainsi que les mesures environnementales (champ magnétique, particules). On ne peut par contre pointer où l'on veut, donc c'est inutilisable pour les observations d'une zone précise du ciel ou du sol.", en:"The vessel is stabilized in an axis by its own rotation , which facilitates the scans of the sky and of global soil and environmental measures ( magnetic field, particles). One can against by pointing where you want , so it's unusable for observations of a specific area of ​​the sky or ground."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:["{$or:[{'deck.cartes.carteId':'I3'},{'deck.cartes.carteId':'I5'},{'deck.cartes.carteId':'I7'},{'deck.cartes.carteId':'I8'},{'deck.cartes.carteId':'I12'},{'deck.cartes.carteId':'I16'}]}"] 
    },
    tags: ["attitude"], 
    valEur : 100000,
    valNrg :  0,
    valPds : 1,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "A7",
    intitule : {fr:"Gestion de l'attitude", en:"Management attitude"},
    description : {fr:"Ces systèmes électroniques sont indispensables pour gérer l'attitude du vaisseau et corriger l'orbite si nécessaire.", en:"These electronic systems are essential to handle the attitude of the spacecraft 's orbit and correct if necessary."},
    tip: {fr:"Obligatoire", en:"Mandatory"},
    regles: {
        necessite:[],
        incompatible:["{$or:[{'deck.cartes.carteId':'I3'},{'deck.cartes.carteId':'I5'},{'deck.cartes.carteId':'I7'},{'deck.cartes.carteId':'I8'},{'deck.cartes.carteId':'I12'},{'deck.cartes.carteId':'I16'}]}"] 
    },
    tags: ["attitude"], 
    valEur : 5000000,
    valNrg :  5,
    valPds : 5,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "P1",
    intitule : {fr:"Moteurs d'appoint", en:"Extra motors"},
    description : {fr:"Ces mini-fusées permettent de rester sur l'orbite choisie, d'ajuster finement les manoeuvres de poitage en cas de stabilisation 3 axes, et de retrouver la Terre en cas de problème. Ils fonctionnent à l'hydrazine.", en:"These mini- rockets used to stay on the orbit chosen , finely adjust poitage maneuvers in case of 3-axis stabilization , and find Earth in case of problems . They operate hydrazine."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["propulsion"], 
    valEur : 5000000,
    valNrg :  0,
    valPds : 100,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "P2",
    intitule : {fr:"Propulsion biergol Vénus/Mars", en:"Bipropellant Engine Venus/March"},
    description : {fr:"Par une poussée forte mais courte, cette propulsion met le vaisseau sur une trajectoire d'Hohmann vers Vénus ou Mars. Elle comprend moteurs et réservoirs pour deux ergols, et assure en outre les petites manoeuvres (pointage).", en:"By a strong but short spurt, this propulsion puts the ship on a trajectory to Venus or Mars Hohmann . It includes engines and propellant tanks for two , and further ensures small maneuvers ( score ) ."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["propulsion", "propulsionInterplanetaire"], 
    valEur : 30000000,
    valNrg :  5,
    valPds : 400,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "P3",
    intitule : {fr:"Propulsion biergol autres objets", en:"Propulsion bipropellant other items"},
    description : {fr:"Par une poussée forte mais courte, cette propulsion met le vaisseau sur une trajectoire interplanétaire vers Mercure, les astéroïdes ou les planètes géantes. Elle comprend moteurs et réservoirs pour deux ergols, et assure en outre les petites manoeuvres (pointage).", en:"By a strong but short spurt, this propulsion puts the ship on interplanetary trajectory to Mercury , asteroids or giant planets . It includes engines and propellant tanks for two , and further ensures small maneuvers ( score ) ."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["propulsion", "propulsionInterplanetaire"], 
    valEur : [{condition: "{'deck.cartes': {$exists: true}}", valeur: 70000000}, {condition: "{'deck.cartes.carteId': 'O6'}", valeur: 35000000}],
    valNrg :  5,
    valPds : 850,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "P4",
    intitule : {fr:"Propulsion électrique", en:"Electric propulsion"},
    description : {fr:"Cette propulsion met le vaiseau sur une trajectoire interplanétaire. Elle utilise un moteur électrique, qui fournit une poussée faible mais continue. Le temps pour rejoindre la cible est long.", en:"This puts the propulsion vaiseau on an interplanetary trajectory. It uses an electric motor , which provides a low thrust but continues . The time to reach the target is long."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["propulsion", "propulsionInterplanetaire"], 
    valEur : 50000000,
    valNrg :  500,
    valPds : 150,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "I1",
    intitule : {fr:"Petit télescope", en:"Small telescope"},
    description : {fr:"Permet de construire un observatoire spatial simple, par ex. pour des scans du ciel ou de la cartographie basse résolution.", en:"Lets build a simple space observatory , eg . for scans of the sky or the low-resolution mapping."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["instrument", "instrumentTelescope"], 
    valEur : 75000000,
    valNrg :  10,
    valPds : 500,
    valVol : 0,
    ValSci : 1,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "I2",
    intitule : {fr:"Télescope moyen", en:"Medium telescope"},
    description : {fr:"Permet de construire un observatoire spatial standard.", en:"Lets build a standard space observatory."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["instrument", "instrumentTelescope"], 
    valEur : 150000000,
    valNrg :  10,
    valPds : 750,
    valVol : 0,
    ValSci : 2,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "I3",
    intitule : {fr:"Gros télescope", en:"Big telescope"},
    description : {fr:"Permet de construire un observatoire spatial de pointe, tls Hubble ou herschel, fournissant des données en haute résolution. Son attitude doit être parfaitement contrôlée.", en:"Allows building advanced space observatory , Hubble and Herschel tls , providing high resolution data. His attitude must be perfectly controlled."},
    tip: {fr:"", en:""},
    regles: {
        necessite:["{'deck.cartes.carteId':'A4'}","{'deck.cartes.carteId':'A5'}"],
        incompatible:[] 
    },
    tags: ["instrument", "instrumentTelescope"], 
    valEur : 200000000,
    valNrg :  10,
    valPds : 1000,
    valVol : 0,
    ValSci : 4,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "I4",
    intitule : {fr:"Détecteur visible", en:"Visible detector"},
    description : {fr:"Disposé à la sortie d'un télescope, il permet de faire des images du ciel dans le domaine de la lumière visible. Il est utilisé pour des scans ou avec un pointage précis.", en:"Disposed at the outlet of a telescope , it allows to make images of the sky in the range of visible light . It is used for scans or with a specific score."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["instrument", "instrumentScan"], 
    valEur : 3000000,
    valNrg :  5,
    valPds : 7,
    valVol : 0,
    ValSci : 1,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "I5",
    intitule : {fr:"Spectromètre visible", en:"Visible spectrometer"},
    description : {fr:"Disposé à la sortie d'un télescope, il permet de faire d'évaluer de nombreuses propriétés des astres observés (composition, vitesse, ...) mais il nécessite un pointage précis.", en:"Disposed at the outlet of a telescope , it allows to evaluate many properties observed stars (composition, speed , ...) but it requires a precise pointing."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["instrument", "instrumentScan"], 
    valEur : 10000000,
    valNrg :  20,
    valPds : 50,
    valVol : 0,
    ValSci : 2,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "I6",
    intitule : {fr:"Détecteur IR", en:"IR Detector"},
    description : {fr:"Disposé à la sortie d'un télescope, il produit des cartes de température ou des cartes associées à la signature de certaines molécules, mais il doit être refroidi. il est utilisé pour des scans ou avec un pointage précis.", en:"Disposed at the outlet of a telescope , it produces temperature card or cards associated with the signing of certain molecules , but it must be cooled . it is used for scans or with a specific score."},
    tip: {fr:"", en:""},
    regles: {
        necessite:["{'deck.cartes.carteId':'T3'}"],
        incompatible:[] 
    },
    tags: ["instrument", "instrumentScan"], 
    valEur : 5000000,
    valNrg :  20,
    valPds : 10,
    valVol : 0,
    ValSci : 1,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "I7",
    intitule : {fr:"Spectro IR", en:"IR Spectrometer"},
    description : {fr:"Disposé à la sortie d'un télescope, il permet d'étudier en détails la composition moléculaire des objets observés mais il nécessite un pointage précis et un refroidissement supplémentaire.", en:"Located at the outlet of a telescope he used to study in detail the molecular composition of the objects observed but it requires precise aiming and additional cooling."},
    tip: {fr:"", en:""},
    regles: {
        necessite:["{'deck.cartes.carteId':'T3'}"],
        incompatible:[] 
    },
    tags: ["instrument", "instrumentScan"], 
    valEur : 10000000,
    valNrg :  30,
    valPds : 20,
    valVol : 0,
    ValSci : 2,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "I8",
    intitule : {fr:"Spectro-imageur IR", en:"IR Spectral imager"},
    description : {fr:"Disposé à la sortie d'un télescope, il permet d'étudier en détails la composition atomique de toute une zone du ciel mais il nécessite un pointage précis.", en:"Located at the outlet of a telescope he used to study in detail the atomic composition of a whole area of ​​the sky but it requires precise pointing."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["instrument", "instrumentScan"], 
    valEur : 30000000,
    valNrg :  25,
    valPds : 30,
    valVol : 0,
    ValSci : 2,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "I9",
    intitule : {fr:"Polariseur visible", en:"Visible polarizer"},
    description : {fr:"Disposé à la sortie d'un télescope et devant un détecteur ou un spectromètre visible, il permet d'étudier la polarisation de la lumière, liée par ex. à la présence de champ magnétique dans les astres.", en:"Disposed at the outlet of a telescope and a front sensor or a visible spectrometer , it allows to study the polarization of light , due eg . in the presence of magnetic field in the stars."},
    tip: {fr:"", en:""},
    regles: {
        necessite:["{$or:[{'deck.cartes.carteId':'I4'},{'deck.cartes.carteId':'I5'}]}"],
        incompatible:[] 
    },
    tags: ["instrument", "instrumentScan"], 
    valEur : 30000000,
    valNrg :  40,
    valPds : 20,
    valVol : 0,
    ValSci : 2,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "I10",
    intitule : {fr:"Imageur planétaire basse résolution", en:"Planet Imager low resolution"},
    description : {fr:"Il fournit des images peu détaillées, mais d'une zone très étendue. Il est utilisé en vol (pour des scans ou avec un pointage précis) ou après atterrissage (seul ou en complément du microscope).", en:"It provides low-detail images, but a very large area. It is used in flight (for scans or with a precise pointing ) or after landing ( alone or with the microscope )."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["instrument", "instrumentPlanete"], 
    valEur : 3000000,
    valNrg :  5,
    valPds : 7,
    valVol : 0,
    ValSci : [{condition: "{'objectif': {$exists: true}}", valeur: 0}, {condition: "{'objectif': 'planete'}", valeur: 1}],
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "I11",
    intitule : {fr:"Imageur planétaire moyenne résolution", en:"Planet Imager medium resolution"},
    description : {fr:"Il fournit des images détaillées d'une zone de taille moyenne. Il est utilisé en vol (pour des scans ou avec un pointage précis) ou après atterrissage.", en:"It provides detailed images of a medium sized area. It is used in flight (for scans or with a precise pointing ) or after landing."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["instrument", "instrumentPlanete"], 
    valEur : 7000000,
    valNrg :  10,
    valPds : 15,
    valVol : 0,
    ValSci : [{condition: "{'objectif': {$exists: true}}", valeur: 0}, {condition: "{'objectif': 'planete'}", valeur: 2}],
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "I12",
    intitule : {fr:"Imageur planétaire haute résolution", en:"Planet Imager high resolution"},
    description : {fr:"Il fournit des images très détaillées, mais d'une zone très taille. Un contrôle précis de l'attitude est nécessaire.", en:"It provides very detailed images, but in a very waist area. Precise control of attitude is necessary."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["instrument", "instrumentPlanete"], 
    valEur : 10000000,
    valNrg :  20,
    valPds : 20,
    valVol : 0,
    ValSci : [{condition: "{'objectif': {$exists: true}}", valeur: 0}, {condition: "{'objectif': 'planete'}", valeur: 3}],
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "I13",
    intitule : {fr:"Imageur planétaire IR", en:"IR Planet Imager"},
    description : {fr:"Il produit des cartes de température ou des cartes associées à la signature de certaines molécules. Il est utilisé en vol (pour des scans ou avec un pointage précis) ou après atterrissage.", en:"It produces temperature maps or maps associated with the signing of certain molecules . It is used in flight (for scans or with a precise pointing ) or after landing."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["instrument", "instrumentPlanete"], 
    valEur : 5000000,
    valNrg :  20,
    valPds : 10,
    valVol : 0,
    ValSci : [{condition: "{'objectif': {$exists: true}}", valeur: 0}, {condition: "{'objectif': 'planete'}", valeur: 1}],
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "I14",
    intitule : {fr:"Spectro planétaire haute énergie", en:"Spectro planetary high energy"},
    description : {fr:"Ce spectromètre permet de caractériser la surface planétaire (ou lunaire) en y détectant la signature de certains atomes (ex. H, partie de l'eau, Fe, K,...). Il est utilisé pour des scans ou avec un pointage précis.", en:"This spectrometer used to characterize the planetary surface ( or lunar ) y detecting the signature of certain atoms (eg . H, part of the water , Fe, K , ...). It is used for scans or with a specific score."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["instrument", "instrumentPlanete"], 
    valEur : 50000000,
    valNrg :  30,
    valPds : 50,
    valVol : 0,
    ValSci : [{condition: "{'objectif': {$exists: true}}", valeur: 0}, {condition: "{'objectif': 'planete'}", valeur: 1}],
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "I15",
    intitule : {fr:"Altimètre radar", en:"Radar altimeter"},
    description : {fr:"Il caractérise la surface planétaire (ou lunaire) en mesurant l'altitude du sol dans de grandes zones. La technique radar permet aussi de sonder sous la surface. Il est utilisé pour des scans ou avec un pointage précis.", en:"It characterizes the planetary surface ( or lunar ) measuring the altitude of the ground in large areas . The technique also allows radar probe beneath the surface. It is used for scans or with a specific score."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["instrument", "instrumentPlanete"], 
    valEur : 25000000,
    valNrg :  30,
    valPds : 7,
    valVol : 0,
    ValSci : [{condition: "{'objectif': {$exists: true}}", valeur: 0}, {condition: "{'objectif': 'planete'}", valeur: 1}],
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "I16",
    intitule : {fr:"Altimètre laser", en:"Laser altimeter"},
    description : {fr:"Il mesure très précisément l'altitude de petites zones du sol planétaire ou lunaire mais il doit être utilisé avec un pointage précis.", en:"It precisely measures the altitude of small areas of the planetary or lunar soil but must be used with a specific score."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["instrument", "instrumentPlanete"], 
    valEur : 10000000,
    valNrg :  15,
    valPds : 6,
    valVol : 0,
    ValSci : [{condition: "{'objectif': {$exists: true}}", valeur: 0}, {condition: "{'objectif': 'planete'}", valeur: 2}],
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "I17",
    intitule : {fr:"Détecteur de particules", en:"Particle detector"},
    description : {fr:"Ce capteur mesure la vitesse, la composition et la densité des particules et des poussières environnant le vaisseau, tant en vol (de préférence pour les vaisseaux stabilisés par rotation) qu'après atterrissage.", en:"This sensor measures the speed , the composition and density of the particles and dust surrounding the vessel , both in the air (preferably for vessels spin stabilized ) after landing."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["instrument", "instrumentPlanete"], 
    valEur : 10000000,
    valNrg :  10,
    valPds : 10,
    valVol : 0,
    ValSci : [{condition: "{'objectif': {$exists: true}}", valeur: 0}, {condition: "{'objectif': 'planete'}", valeur: 1}, {condition: "{'objectif': 'planete'},{'deck.cartes.carteId: 'A6'}", valeur: 2}],
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "I18",
    intitule : {fr:"Analyseur de plasma", en:"Plasma Analyser"},
    description : {fr:"Ce capteur mesure la vitesse, la composition et la densité du plasma environnant le vaisseau (vent solaire, magnétosphère planétaire). Il fonctionne mieux pour les vaisseaux stabilisés par rotation.", en:"This sensor measures the speed , composition and density of the plasma surrounding the vessel ( solar wind , planetary magnetosphere ) . It works best for vessels stabilized by rotation."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["instrument", "instrumentPlanete"], 
    valEur : 10000000,
    valNrg :  10,
    valPds : 10,
    valVol : 0,
    ValSci : [{condition: "{'objectif': {$exists: true}}", valeur: 0}, {condition: "{'objectif': 'planete'}", valeur: 1}, {condition: "{'objectif': 'planete'},{'deck.cartes.carteId: 'A6'}", valeur: 2}],
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "I19",
    intitule : {fr:"Magnétomètre", en:"Magnetometer"},
    description : {fr:"Ce capteur mesure le champ magnétique (inter)planétaire. Il fonctionne mieux pour les vaisseaux stabilisés par rotation.", en:"This sensor measures the magnetic field (inter) worldwide . It works best for vessels stabilized by rotation."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["instrument", "instrumentPlanete"], 
    valEur : 3000000,
    valNrg :  2,
    valPds : 3,
    valVol : 0,
    ValSci : [{condition: "{'objectif': {$exists: true}}", valeur: 0}, {condition: "{'objectif': 'planete'}", valeur: 1}, {condition: "{'objectif': 'planete'},{'deck.cartes.carteId: 'A6'}", valeur: 2}],
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "J1",
    intitule : {fr:"Plateforme atterrisseur", en:"Lander platform"},
    description : {fr:"Les instruments des atterrisseurs sont disposés sur une plateforme, qui peut être fixe ou mobile.", en:"The instruments of the undercarriages are arranged on a platform , which may be fixed or mobile."},
    tip: {fr:"", en:""},
    regles: {
        necessite:["{'deck.cartes.carteId':'S3'}","{$or:[{'deck.cartes.carteId':'J4'},{'deck.cartes.carteId':'J5'}]}"],
        incompatible:[] 
    },
    tags: ["atterrisseur"], 
    valEur : 35000000,
    valNrg : 10,
    valPds : 100,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "J2",
    intitule : {fr:"Bouclier thermique", en:"Heat shield"},
    description : {fr:"Le bouclier thermique protège les atterrisseurs lors de leur traversée de l'atmosphère.", en:"The heat shield protects the undercarriages during their passage through the atmosphere."},
    tip: {fr:"", en:""},
    regles: {
        necessite:["{'deck.cartes.carteId':'J1'}"],
        incompatible:[] 
    },
    tags: ["atterrisseur"], 
    valEur : 50000000,
    valNrg : 0,
    valPds : 200,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "J3",
    intitule : {fr:"Parachute", en:"Parachute"},
    description : {fr:"Le parachute permet de ralentir l'atterrisseur. Il ne fonctionne que pour les lunes et planètes possèdant une atmosphère.", en:"The parachute slows the lander . It only works for the moons and planets with an atmosphere."},
    tip: {fr:"", en:""},
    regles: {
        necessite:["{'deck.cartes.carteId':'J1'}"],
        incompatible:[] 
    },
    tags: ["atterrisseur"], 
    valEur : 10000000,
    valNrg : 0,
    valPds : 10,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "J4",
    intitule : {fr:"Airbags", en:"Airbags"},
    description : {fr:"Ce système ralentit les vaisseaux pas trop lourds pour un atterrissage dans une zone choisie. Il protège le vaisseau en cas de terrain caillouteux.", en:"This system slows down too heavy vessels for landing in a selected area . It protects the ship in case of stony ground."},
    tip: {fr:"", en:""},
    regles: {
        necessite:["{'deck.cartes.carteId':'J1'}"],
        incompatible:[] 
    },
    tags: ["atterrisseur"], 
    valEur : 40000000,
    valNrg : 0,
    valPds : 75,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "J5",
    intitule : {fr:"Rétrofusées", en:"Retro rockets"},
    description : {fr:"Ce système ralentit tous les vaisseaux pour un atterrissage contrôlé en un lieu précis. Le site d'atterrissage doit cependant être assez lisse.", en:"This system slows down all the vessels for a controlled landing in a specific place . The landing site should however be fairly smooth."},
    tip: {fr:"", en:""},
    regles: {
        necessite:["{'deck.cartes.carteId':'J1'}"],
        incompatible:[] 
    },
    tags: ["atterrisseur"], 
    valEur : 50000000,
    valNrg : 0,
    valPds : 100,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "J6",
    intitule : {fr:"Roues", en:"Wheels"},
    description : {fr:"Les roues permettent de déplacer le vaisseau à la surface solide d'une lune ou planète. Elles travaillent en terrain rocailleux.", en:"The wheels can move the ship to the solid surface of a moon or planet. They work in rocky terrain."},
    tip: {fr:"", en:""},
    regles: {
        necessite:["{'deck.cartes.carteId':'J1'}"],
        incompatible:[] 
    },
    tags: ["atterrisseur"], 
    valEur : 50000000,
    valNrg : 50,
    valPds : 30,
    valVol : 0,
    ValSci : 1,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "J7",
    intitule : {fr:"Chenilles", en:"Tracks"},
    description : {fr:"Les chenilles permettent de déplacer le vaisseau à la surface solide d'une lune ou planète. Comparées aux roues, leurs manoeuvres sont moins précises et il leur est plus difficile de grimper sur un obstacle.", en:"The caterpillars can move the ship to the solid surface of a moon or planet. Compared to the wheels, their operations are less accurate and they find it more difficult to climb an obstacle."},
    tip: {fr:"", en:""},
    regles: {
        necessite:["{'deck.cartes.carteId':'J1'}"],
        incompatible:[] 
    },
    tags: ["atterrisseur"], 
    valEur : 50000000,
    valNrg : 40,
    valPds : 50,
    valVol : 0,
    ValSci : 1,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "J8",
    intitule : {fr:"Bras mécanique et pelle de collecte", en:"Mechanical arm and shovel collection"},
    description : {fr:"Le bras et la pelle permetent de récolter des échantillons d'air ou de sol autour de l'atterrisseur.", en:"Arm and shovel permetent to collect air samples or soil around the undercarriage."},
    tip: {fr:"", en:""},
    regles: {
        necessite:["{'deck.cartes.carteId':'J1'}"],
        incompatible:[] 
    },
    tags: ["atterrisseur"], 
    valEur : 20000000,
    valNrg : 30,
    valPds : 20,
    valVol : 0,
    ValSci : 1,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "J9",
    intitule : {fr:"Foreuse", en:"Drill"},
    description : {fr:"La foreuse permet de forer le sol ou les roches exposées, de manière à collecter et analyser ensuite des couches plus profondes.", en:"Drill allows to drill soil or rocks exposed , so as to collect and then analyze the deeper layers."},
    tip: {fr:"", en:""},
    regles: {
        necessite:["{'deck.cartes.carteId':'J1'}"],
        incompatible:[] 
    },
    tags: ["atterrisseur"], 
    valEur : 20000000,
    valNrg : 50,
    valPds : 5,
    valVol : 0,
    ValSci : 1,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "J10",
    intitule : {fr:"Senseur thermique", en:"Thermal sensor"},
    description : {fr:"Ce capteur permet de relever la température et l'ensoleillement quand on se trouve à la surface d'une lune ou planète.", en:"Ce capteur permet de relever la température et l'ensoleillement quand on se trouve à la surface d'une lune ou planète."},
    tip: {fr:"", en:""},
    regles: {
        necessite:["{'deck.cartes.carteId':'J1'}"],
        incompatible:[] 
    },
    tags: ["atterrisseur"], 
    valEur : 1000000,
    valNrg : 1,
    valPds : 1,
    valVol : 0,
    ValSci : 1,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "J11",
    intitule : {fr:"Capteur atmosphérique", en:"Atmospheric sensor"},
    description : {fr:"Ce capteur mesure la pression atmosphérique, la vitesse des vents et la composition de l'atmosphère. Il ne fonctionne que pour les lunes et les planètes possédant une atmosphère.", en:"This sensor measures the atmospheric pressure , wind speed and atmospheric composition . It only works for the moons and planets with an atmosphere."},
    tip: {fr:"", en:""},
    regles: {
        necessite:["{'deck.cartes.carteId':'J2'}","{'deck.cartes.carteId':'J3'}","{'planete.atmosphere': true}"],
        incompatible:[] 
    },
    tags: ["atterrisseur"], 
    valEur : 1000000,
    valNrg : 1,
    valPds : 1,
    valVol : 0,
    ValSci : 1,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "J12",
    intitule : {fr:"Microscope", en:"Microscope"},
    description : {fr:"Le microscope permet de compléter un imageur simple pour étudier en détails le sol ou des échantillons collectés.", en:"The microscope allows to complete a simple imaging to study in detail the ground or samples collected."},
    tip: {fr:"", en:""},
    regles: {
        necessite:["{'deck.cartes.carteId':'J1'}","{'deck.cartes.carteId':'I10'}"],
        incompatible:[] 
    },
    tags: ["atterrisseur"], 
    valEur : 1000000,
    valNrg : 1,
    valPds : 1,
    valVol : 0,
    ValSci : 1,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "J14",
    intitule : {fr:"Laboratoire biologique", en:"Biological laboratory"},
    description : {fr:"Ce laboratoire permet de chercher des signes de vie microbienne (passée ou présente) dans les échantillons collectés avec la pelle.", en:"This laboratory allows to look for signs of microbial life ( past or present) in the samples collected with the shovel."},
    tip: {fr:"", en:""},
    regles: {
        necessite:["{'deck.cartes.carteId':'J8'}"],
        incompatible:[] 
    },
    tags: ["atterrisseur"], 
    valEur : 50000000,
    valNrg : 50,
    valPds : 15,
    valVol : 0,
    ValSci : 4,
    fiabilite: 1,
    active : true,
    cubesat: false 
  },
  {
    carteId: "CL1",
    intitule : {fr:"Lancement 1U", en:"Launching 1U"},
    description : {fr:"Lancement d'une unité, comprend l'adaptateur permettant d'éjecter les CubeSats en orbite.", en:"Launch of a unit includes the adapter to eject the CubeSats in orbit."},
    tip: {fr:"", en:""},
    regles: {
        necessite:["{'deck.cartes.carteId': 'CZ1'},{'deck.cartes.carteId': 'CE2'}"],
        incompatible:[] 
    },
    tags: ["lanceur"], 
    valEur : 75000,
    valNrg : 0,
    valPds : 1300,
    valVol : 100,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: true 
  },
  {
    carteId: "CL2",
    intitule : {fr:"Lancement 3U", en:"Launching 3U"},
    description : {fr:"Lancement d'un bloc de trois unités, comprend l'adaptateur permettant d'éjecter les CubeSats en orbite.", en:"Launch of three units includes the adapter to eject the CubeSats in orbit."},
    tip: {fr:"", en:""},
    regles: {
        necessite:["{'deck.cartes.carteId': 'CZ2'},{'deck.cartes.carteId': 'CE3'}"],
        incompatible:[] 
    },
    tags: ["lanceur"], 
    valEur : 225000,
    valNrg : 0,
    valPds : 3900,
    valVol : 300,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: true 
  },
  {
    carteId: "CZ1",
    intitule : {fr:"Structure 1U", en:"Structure 1U"},
    description : {fr:"La structure, ou plateforme, est le squelette du vaisseau. Elle assure sa rigidité et contient tous les connecteurs où fixer les cartes-équipements.", en:"The structure or platform, the vessel is backbone. It provides rigidity and contains all the connectors that attach the card-equipment."},
    tip: {fr:"Cette structure doit être utilisée pour un projet 1U.", en:"This structure must be used for a 1U project."},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["structure"], 
    valEur : 2500,
    valNrg : 0,
    valPds : 200,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: true 
  },
  {
    carteId: "CZ2",
    intitule : {fr:"Structure 3U", en:"Structure 3U"},
    description : {fr:"La structure, ou plateforme, est le squelette du vaisseau. Elle assure sa rigidité et contient tous les connecteurs où fixer les cartes-équipements.", en:"The structure or platform, the vessel is backbone. It provides rigidity and contains all the connectors that attach the card-equipment."},
    tip: {fr:"Cette structure doit être utilisée pour un projet 1U.", en:"This structure must be used for a 3U project."},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["structure"], 
    valEur : 4000,
    valNrg : 0,
    valPds : 600,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: true 
  },
  {
    carteId: "CC1",
    intitule : {fr:"Système Télécom Simple", en:"Simple Telecom System"},
    description : {fr:"Ce système intégré permet de communiquer avec la Terre. Il contient le récepteur et l'émetteur. Il fonctionne avec des débits de 10kb/s (envoi) et 1kb/s (réception) aux fréquences VHF/UHF (~150MHz).", en:"This integrated system enables communication with Earth. It contains the receiver and the transmitter. It works with bit rates of 10kb / s (send) and 1 kb / s ( reception) VHF / UHF frequency (~ 150MHz )."},
    tip: {fr:"", en:""},
    regles: {
        necessite:["{'deck.cartes.carteId': 'CC3'}"],
        incompatible:[] 
    },
    tags: ["communications","communicationsTelecom"], 
    valEur : 7000,
    valNrg : 2,
    valPds : 85,
    valVol : 15,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: true 
  },
  {
    carteId: "CC2",
    intitule : {fr:"Système Télécom Rapide", en:"Rapid Telecom System"},
    description : {fr:"Ce système intégré permet d'envoyer rapidement (100kb/s) un volume important de données, grâce à l'utilisation d'une fréquence différente (bande S, ~2GHz). Il ne contient pas de récepteur, uniquement un émetteur.", en:"This integrated system allows to send quickly ( 100kb / s) a large volume of data through the use of a different frequency (S band, ~ 2GHz ) . It does not contain a receiver , only a transmitter."},
    tip: {fr:"", en:""},
    regles: {
        necessite:["{'deck.cartes.carteId': 'CC4'}"],
        incompatible:[] 
    },
    tags: ["communications","communicationsTelecom"], 
    valEur : 8500,
    valNrg : 3.5,
    valPds : 65,
    valVol : 25,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: true 
  },
  {
    carteId: "CC3",
    intitule : {fr:"Antenne #1", en:"Antenna #1"},
    description : {fr:"Cette antenne se place sur un côté du CubeSat et est déployée après le lancement.", en:"This antenna is located on one side of CubeSat and is deployed after launch."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["communications","antenne"], 
    valEur : 4000,
    valNrg : 0,
    valPds : 100,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: true 
  },
  {
    carteId: "CC4",
    intitule : {fr:"Antenne #2", en:"Antenna #2"},
    description : {fr:"Cette antenne se place sur un côté du CubeSat. Elle ne fonctionne que pour certaines fréquences (Bande S)", en:"This antenna is located on one side of CubeSat . It only works for certain frequencies ( Band S)."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["communications","antenne"], 
    valEur : 5000,
    valNrg : 0,
    valPds : 80,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: true 
  },
  {
    carteId: "CE1",
    intitule : {fr:"Gestion de l'énergie", en:"Energy management"},
    description : {fr:"Ce système électronique gère la fourniture d'énergie.", en:"This electronic system manages the energy supply."},
    tip: {fr:"Obligatoire", en:"Mandatory"},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["energie","energieGestion"], 
    valEur : 3000,
    valNrg : 0,
    valPds : 90,
    valVol : 15,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: true 
  },
  {
    carteId: "CE2",
    intitule : {fr:"Panneau solaire 1U", en:"Solar panel 1U"},
    description : {fr:"Les panneaux solaires se fixent sur 5 côtés des unités (la 6éme face étant utilisée pour l'antenne). Quand le CubeSat est éclairé, l'ensemble de ces panneaux fournit 3W.", en:"Solar panels are fixed on 5 sides of the units ( the 6th face being used for the antenna) . When the CubeSat is illuminated , the set of these panels provides 3W."},
    tip: {fr:"Obligatoire pour 1U", en:"Mandatory for 1U"},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["energie","energieGestion"], 
    valEur : 10000,
    valNrg : 3,
    valPds : 300,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: true 
  },
  {
    carteId: "CE3",
    intitule : {fr:"Panneau solaire 3U", en:"Solar panel 3U"},
    description : {fr:"Les panneaux solaires se fixent sur 4 long côtés du CubeSat. Quand le dernier est éclairé, l'ensemble de ces panneaux fournit 6W.", en:"Solar panels are fixed on four long sides of the CubeSat . When the latter is illuminated , the set of these panels provides 6W."},
    tip: {fr:"Obligatoire pour 3U", en:"Mandatory for 3U"},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["energie","energieGestion"], 
    valEur : 20000,
    valNrg : 6,
    valPds : 700,
    valVol : 0,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: true 
  },
  {
    carteId: "CE4",
    intitule : {fr:"Batterie", en:"Battery"},
    description : {fr:"Cette batterie 10W permet au CubeSat de fonctionner même s'il n'est pas éclairé. Ce système n'est pas obligatoire (on peut éteindre le satellite durant chaque éclipse) mais il est fortement recommandé.", en:"This 10W battery allows the CubeSat to operate even if it is not informed . This system is not compulsory (the satellite can be put out during each eclipse ) but is highly recommended."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["energie"], 
    valEur : 700,
    valNrg : 10,
    valPds : 100,
    valVol : 7,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: true 
  },
  {
    carteId: "CA1",
    intitule : {fr:"Détecteur de limbe terrestre", en:"Earth limb detector"},
    description : {fr:"Ce capteur estime approximativement (à 0.5° près) l'attitude du CubeSat en mesurant la direction du limbe terrestre.", en:"This sensor is estimated approximately (0.5 ° near ) CubeSat attitude by measuring the direction of the Earth's limb."},
    tip: {fr:"Au moins un système de mesure d'attitude est obligatoire.", en:"At least one attitude measurement system is required."},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["attitude","attitudeMesure"], 
    valEur : 10000,
    valNrg : 0.4,
    valPds : 100,
    valVol : 1,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: true 
  },
  {
    carteId: "CA2",
    intitule : {fr:"Senseur solaire", en:"Solar sensor"},
    description : {fr:"Le senseur solaire estime approximativement l'attitude du CubeSat en utilisant la direction du Soleil.", en:"The solar sensor feels about the attitude of the CubeSat using the direction of the sun."},
    tip: {fr:"Au moins un système de mesure d'attitude est obligatoire.", en:"At least one attitude measurement system is required."},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["attitude","attitudeMesure"], 
    valEur : 10000,
    valNrg : 0.2,
    valPds : 40,
    valVol : 2,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: true 
  },
  {
    carteId: "CA3",
    intitule : {fr:"Récepteur GPS", en:"GPS receiver"},
    description : {fr:"Ce capteur utilise la constellation GPS pour déterminer la position du CubeSat.", en:"This sensor uses the GPS constellation for determining the position of CubeSat."},
    tip: {fr:"Au moins un système de mesure d'attitude est obligatoire.", en:"At least one attitude measurement system is required."},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["attitude","attitudeMesure"], 
    valEur : 12000,
    valNrg : 1,
    valPds : 30,
    valVol : 1,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: true 
  },
  {
    carteId: "CA4",
    intitule : {fr:"µPropulsion", en:"Propulsion µ"},
    description : {fr:"Ces mini-fusées situées aux coins du CubeSat permettent une stabilisation 3 axes et un pointage précis vers n'importe quelle direction.", en:"These mini- rockets at the corners of the CubeSat enable 3-axis stabilization and precise pointing towards any direction."},
    tip: {fr:"", en:""},
    regles: {
        necessite:["{'deck.cartes.tags': 'attitudeMesure'}"],
        incompatible:[] 
    },
    tags: ["attitude","attitudeControle"], 
    valEur : 80000,
    valNrg : 2,
    valPds : 300,
    valVol : 20,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: true 
  },
  {
    carteId: "CA5",
    intitule : {fr:"Roues à réaction", en:"Reaction wheels"},
    description : {fr:"Les roues à réaction permettent une stabilisation 3 axes et un pointage vers n'importe quelle direction.", en:"The reaction wheels allow a 3-axis stabilization and pointing towards any direction."},
    tip: {fr:"", en:""},
    regles: {
        necessite:["{'deck.cartes.tags': 'attitudeMesure'}"],
        incompatible:[] 
    },
    tags: ["attitude","attitudeControle"], 
    valEur : 15000,
    valNrg : 3,
    valPds : 700,
    valVol : 70,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: true 
  },
  {
    carteId: "CM1",
    intitule : {fr:"µProcesseur", en:"µProcessor"},
    description : {fr:"Cerveau du vaisseau, il commande tous les sytèmes grâce aux ordres reçus de la Terre et il prépare l'envoi des données. Il travaille avec une mémoire vive de 4Mb et une vitesse maximale de 50MHz.", en:"Brain vessel, it controls all Shopsystems through orders received from Earth and is preparing to send data . He works with 4Mb of RAM and a maximum speed of 50MHz."},
    tip: {fr:"Obligatoire", en:"Mandatory"},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["commandes"], 
    valEur : 1500,
    valNrg : 0.3,
    valPds : 40,
    valVol : 7,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: true 
  },
  {
    carteId: "CM2",
    intitule : {fr:"Carte mémoire", en:"Memory Card"},
    description : {fr:"Le CubeSat ne pouvant communiquer continuellement avec la Terre, ce système stocke 2Gb de données collectées jusqu'à ce qu'elles puissent être envoyées.", en:"The CubeSat that can continuously communicate with Earth, this system stores 2Gb of data collected until they can be sent."},
    tip: {fr:"Obligatoire", en:"Mandatory"},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["commandes"], 
    valEur : 1500,
    valNrg : 0.1,
    valPds : 20,
    valVol : 5,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: true 
  },
  {
    carteId: "CI1",
    intitule : {fr:"Démonstration technologique", en:"Technology demonstration"},
    description : {fr:"Ce système permet de tester le comportement de nouvelles technologies spatiales (composants électroniques, propulsion, ...) en situation réelle.", en:"This system can test the behavior of new space technologies ( electronics , propulsion, ... ) in real situations."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["instrument"], 
    valEur : 5000,
    valNrg : 0.5,
    valPds : 100,
    valVol : 10,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: true 
  },
  {
    carteId: "CI2",
    intitule : {fr:"Essai biologique", en:"Biological test"},
    description : {fr:"Cette expérience permet d'étudier le comportemebnt de petits êtres vivants (microbes, algues) dans l'environnement spatial.", en:"This experiment allows us to study the comportemebnt small living things ( microbes, algae) in the space environment."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["instrument"], 
    valEur : 30000,
    valNrg : 0.8,
    valPds : 250,
    valVol : 40,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: true 
  },
  {
    carteId: "CI3",
    intitule : {fr:"Imageur", en:"imager"},
    description : {fr:"Cet imageur fournit des images de petite taille (3Mpx), donc peu détaillées, dans des filtres visibles (ou proches du visible), mais il observe une zone très étendue (9°, soit la taille d'un poing tenu à bout de bras).", en:"This imager provides small images ( 3mpx ), so little detail in the visible filters ( or close to the visible) , but observe a wide area (9 ° , the size of a fist held at arm's length )."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["instrument"], 
    valEur : 10000,
    valNrg : 0.6,
    valPds : 100,
    valVol : 40,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: true 
  },
  {
    carteId: "CI4",
    intitule : {fr:"Spectro IR", en:"Spectro IR"},
    description : {fr:"Ce spectromètre permet d'étudier la composition moléculaire des terrains observés. Il observe dans la gamme 1-1.7 µm avec une résolution faible (6nm).", en:"This spectrometer allows to study the molecular composition of the observed fields. He observes in the range 1-1.7 microns with a low resolution ( 6 nm )."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["instrument"], 
    valEur : 20000,
    valNrg : 1.4,
    valPds : 200,
    valVol : 40,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: true 
  },
  {
    carteId: "CI5",
    intitule : {fr:"Magnétomètre", en:"Magnetometer"},
    description : {fr:"Ce capteur mesure le champ magnétique terrestre dix fois par seconde au plus, avec une précision de 10nT (50000 fois plus faible que l'intensité du champ terrestre mesuré au sol).", en:"This sensor measures the earth's magnetic field ten times per second at most, with an accuracy of 10nT (50000 times lower than the intensity of the earth's field measured on the ground )."},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["instrument"], 
    valEur : 10000,
    valNrg : 0.4,
    valPds : 150,
    valVol : 10,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: true 
  },
  {
    carteId: "CI6",
    intitule : {fr:"Instrument original", en:"Original instrument"},
    description : {fr:"Imaginez votre propre expérience!", en:"Imagine your own experience !"},
    tip: {fr:"", en:""},
    regles: {
        necessite:[],
        incompatible:[] 
    },
    tags: ["instrument"], 
    valEur : 15000,
    valNrg : 1,
    valPds : 150,
    valVol : 30,
    ValSci : 0,
    fiabilite: 1,
    active : true,
    cubesat: true 
  }
];