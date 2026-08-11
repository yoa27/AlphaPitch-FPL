import { Language } from '../types';

export interface Translations {
  appName: string;
  appSubtitle: string;
  liveApiStatus: string;
  offlineStatus: string;
  tab1: string;
  tab2: string;
  tab3: string;
  tabWatchlist: string;
  searchPlaceholder: string;
  syncButton: string;
  loginButton: string;
  logoutButton: string;
  verifiedBadge: string;
  
  // Table filters & headers
  filterAll: string;
  filterPlayerPlaceholder: string;
  filterFavorites: string;
  filterAllVerdicts: string;
  filterAllClubs: string;
  playersCount: string;
  colStar: string;
  colPlayer: string;
  colPosition: string;
  colPrice: string;
  colXP: string;
  colVerdict: string;
  colForm: string;
  colAnalysis: string;
  btnChart: string;
  noPlayersFound: string;
  
  // Verdicts
  verdictBuy: string;
  verdictSell: string;
  verdictWatch: string;
  algoVerdictLabel: string;
  arbitrageScoreLabel: string;
  
  // Chart view
  selectPlayerPrompt: string;
  selectPlayerSubtitle: string;
  currentPrice: string;
  expectedPoints: string;
  fplForm: string;
  btnAddToWatchlist: string;
  btnInWatchlist: string;
  chartModePriceXP: string;
  chartModePriceXG: string;
  spectrumOversold: string;
  spectrumOverbought: string;
  spectrumTitle: string;
  surgeDetected: string;
  pointsLabel: string;
  priceLabel: string;
  
  // Budget builder
  builderTitle: string;
  builderSubtitle: string;
  budgetLabel: string;
  budgetMin: string;
  budgetMax: string;
  budgetSelection: string;
  totalCostEstimated: string;
  remainingCash: string;
  expectedPoints3GWs: string;
  avgArbitrageScore: string;
  tabTopGems: string;
  tabBestXI: string;
  squad11Title: string;
  squad11Subtitle: string;
  squad11Badge: string;
  gkpLine: string;
  defLine: string;
  midLine: string;
  fwdLine: string;
  marketPrice: string;
  seeChart: string;
  
  // Watchlist page
  watchlistTitle: string;
  watchlistSubtitle: string;
  
  // Auth modal
  authModalTitleLogin: string;
  authModalTitleSignup: string;
  authModalSubtitle: string;
  authModalGatekeeperMessage: string;
  emailLabel: string;
  emailPlaceholder: string;
  btnContinue: string;
  btnVerify: string;
  otpStepTitle: string;
  otpStepSubtitle: string;
  otpCodeLabel: string;
  otpPlaceholder: string;
  resendOtp: string;
  invalidEmailError: string;
  disposableEmailError: string;
  invalidOtpError: string;
  otpNotificationTitle: string;
  otpNotificationBody: string;
  alreadyHaveAccount: string;
  needAccount: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  FR: {
    appName: "AlphaPitch FPL",
    appSubtitle: "Arbitrage & Décision FPL",
    liveApiStatus: "API FPL LIVE",
    offlineStatus: "MODE LOCAL",
    tab1: "1. Choix du Joueur",
    tab2: "2. Graphique & Verdict",
    tab3: "3. Pépites & Budget",
    tabWatchlist: "Favoris",
    searchPlaceholder: "Rechercher parmi 570+ joueurs...",
    syncButton: "Sync FPL",
    loginButton: "Connexion",
    logoutButton: "Déconnexion",
    verifiedBadge: "Vérifié",
    
    filterAll: "Tous",
    filterPlayerPlaceholder: "Filtrer joueur...",
    filterFavorites: "Favoris",
    filterAllVerdicts: "Tous",
    filterAllClubs: "Tous Clubs",
    playersCount: "joueurs",
    colStar: "⭐",
    colPlayer: "Joueur",
    colPosition: "Poste",
    colPrice: "Prix",
    colXP: "xP (3GWs)",
    colVerdict: "Conseil / Verdict",
    colForm: "Forme",
    colAnalysis: "Analyse",
    btnChart: "Graphique",
    noPlayersFound: "Aucun joueur ne correspond aux filtres.",
    
    verdictBuy: "ACHETER",
    verdictSell: "VENDRE",
    verdictWatch: "À SURVEILLER",
    algoVerdictLabel: "Conseil Algorithmique :",
    arbitrageScoreLabel: "Score Arbitrage :",
    
    selectPlayerPrompt: "Sélectionnez un joueur pour analyser sa forme",
    selectPlayerSubtitle: "Visualisez le conseil de l'algorithme (Acheter, Vendre ou À Surveiller) et sa courbe de forme historique.",
    currentPrice: "Prix :",
    expectedPoints: "Points attendus :",
    fplForm: "Forme FPL :",
    btnAddToWatchlist: "Mettre en Favori",
    btnInWatchlist: "En Surveillance",
    chartModePriceXP: "Prix vs xP",
    chartModePriceXG: "Prix vs xG/xA",
    spectrumOversold: "Vente (Surévalué)",
    spectrumOverbought: "Achat (Sous-évalué)",
    spectrumTitle: "Positionnement Marché",
    surgeDetected: "FORTE FORME : Rendement xP supérieur au prix",
    pointsLabel: "Points Attendus (xP)",
    priceLabel: "Prix Marché (£m)",
    
    builderTitle: "Générateur de Pépites & Squad Builder",
    builderSubtitle: "Entre ton budget total pour trouver les meilleures pépites et composer l'équipe optimale.",
    budgetLabel: "Budget :",
    budgetMin: "Budget minimum : £40m",
    budgetMax: "Budget maximum : £150m",
    budgetSelection: "Sélection :",
    totalCostEstimated: "Coût Total Estimé",
    remainingCash: "Cash Restant",
    expectedPoints3GWs: "Points Attendus (xP)",
    avgArbitrageScore: "Arbitrage Moyen",
    tabTopGems: "Top Pépites Recommandées",
    tabBestXI: "Équipe Optimale Best XI (11 Joueurs)",
    squad11Title: "Composition 11 Titulaire Optimale",
    squad11Subtitle: "Sélection optimisée sous votre budget de",
    squad11Badge: "11 Joueurs",
    gkpLine: "Gardien (GKP)",
    defLine: "Ligne Défensive (DEF)",
    midLine: "Milieu de Terrain (MID)",
    fwdLine: "Attaque (FWD)",
    marketPrice: "Prix Marché",
    seeChart: "Voir Graphique",
    
    watchlistTitle: "Mes Joueurs sous Surveillance",
    watchlistSubtitle: "Suivez la forme et les signaux de vos joueurs favoris.",
    
    authModalTitleLogin: "Connexion sécurisée",
    authModalTitleSignup: "Créer un compte",
    authModalSubtitle: "Accédez à vos listes de surveillance personnalisées",
    authModalGatekeeperMessage: "Veuillez vous connecter avec votre adresse email vérifiée pour ajouter des joueurs à vos favoris.",
    emailLabel: "Adresse Email",
    emailPlaceholder: "nom@exemple.com",
    btnContinue: "Recevoir le Code de Vérification",
    btnVerify: "Valider & Se Connecter",
    otpStepTitle: "Vérification de sécurité",
    otpStepSubtitle: "Entrez le code de sécurité à 6 chiffres envoyé à",
    otpCodeLabel: "Code de Vérification (OTP)",
    otpPlaceholder: "123456",
    resendOtp: "Renvoyer un nouveau code",
    invalidEmailError: "Veuillez entrer une adresse email valide.",
    disposableEmailError: "Les adresses emails temporaires/jetables ne sont pas autorisées pour des raisons de sécurité.",
    invalidOtpError: "Code de vérification incorrect ou expiré. Veuillez réessayer.",
    otpNotificationTitle: "Code de Sécurité AlphaPitch",
    otpNotificationBody: "Votre code de vérification est :",
    alreadyHaveAccount: "Déjà un compte ? Se connecter",
    needAccount: "Pas encore de compte ? S'inscrire"
  },
  EN: {
    appName: "AlphaPitch FPL",
    appSubtitle: "FPL Arbitrage & Decision Terminal",
    liveApiStatus: "LIVE FPL API",
    offlineStatus: "LOCAL MODE",
    tab1: "1. Player Selection",
    tab2: "2. Chart & Verdict",
    tab3: "3. Gems & Budget",
    tabWatchlist: "Watchlist",
    searchPlaceholder: "Search across 570+ players...",
    syncButton: "Sync FPL",
    loginButton: "Log In",
    logoutButton: "Log Out",
    verifiedBadge: "Verified",
    
    filterAll: "All",
    filterPlayerPlaceholder: "Filter player...",
    filterFavorites: "Watchlist",
    filterAllVerdicts: "All",
    filterAllClubs: "All Clubs",
    playersCount: "players",
    colStar: "⭐",
    colPlayer: "Player",
    colPosition: "Pos",
    colPrice: "Price",
    colXP: "xP (3GWs)",
    colVerdict: "Advice / Verdict",
    colForm: "Form",
    colAnalysis: "Deep Dive",
    btnChart: "Chart",
    noPlayersFound: "No players match the current filters.",
    
    verdictBuy: "BUY",
    verdictSell: "SELL",
    verdictWatch: "WATCHLIST",
    algoVerdictLabel: "Algorithmic Advice:",
    arbitrageScoreLabel: "Arbitrage Index:",
    
    selectPlayerPrompt: "Select a player to analyze form & valuation",
    selectPlayerSubtitle: "View algorithm recommendation (Buy, Sell or Watch) and historical price vs xP divergence.",
    currentPrice: "Price:",
    expectedPoints: "Expected points:",
    fplForm: "FPL Form:",
    btnAddToWatchlist: "Add to Watchlist",
    btnInWatchlist: "Watching",
    chartModePriceXP: "Price vs xP",
    chartModePriceXG: "Price vs xG/xA",
    spectrumOversold: "Sell (Overvalued)",
    spectrumOverbought: "Buy (Undervalued)",
    spectrumTitle: "Market Valuation Spectrum",
    surgeDetected: "HIGH FORM: Expected points exceed market cost",
    pointsLabel: "Expected Points (xP)",
    priceLabel: "Market Price (£m)",
    
    builderTitle: "Gems Generator & Squad Builder",
    builderSubtitle: "Enter your target budget to extract the highest ROI gems and build your optimal lineup.",
    budgetLabel: "Budget:",
    budgetMin: "Min Budget: £40m",
    budgetMax: "Max Budget: £150m",
    budgetSelection: "Target:",
    totalCostEstimated: "Estimated Total Cost",
    remainingCash: "Remaining Cash",
    expectedPoints3GWs: "Expected Points (xP)",
    avgArbitrageScore: "Avg Arbitrage Score",
    tabTopGems: "Top Recommended Gems",
    tabBestXI: "Optimal Best XI Squad (11 Players)",
    squad11Title: "Optimal Starting XI Lineup",
    squad11Subtitle: "Mathematically optimized lineup under",
    squad11Badge: "11 Players",
    gkpLine: "Goalkeeper (GKP)",
    defLine: "Defensive Line (DEF)",
    midLine: "Midfielders (MID)",
    fwdLine: "Forwards (FWD)",
    marketPrice: "Market Price",
    seeChart: "View Chart",
    
    watchlistTitle: "My Watchlist Players",
    watchlistSubtitle: "Monitor live form and signals for your bookmarked assets.",
    
    authModalTitleLogin: "Secure Email Login",
    authModalTitleSignup: "Create an Account",
    authModalSubtitle: "Access your personalized player watchlist",
    authModalGatekeeperMessage: "Please log in with your verified email to save players to your watchlist.",
    emailLabel: "Email Address",
    emailPlaceholder: "name@example.com",
    btnContinue: "Send Verification Code",
    btnVerify: "Verify & Log In",
    otpStepTitle: "Security Verification",
    otpStepSubtitle: "Enter the 6-digit security code sent to",
    otpCodeLabel: "Verification Code (OTP)",
    otpPlaceholder: "123456",
    resendOtp: "Resend new code",
    invalidEmailError: "Please enter a valid email address.",
    disposableEmailError: "Temporary or disposable email domains are blocked for security reasons.",
    invalidOtpError: "Invalid or expired verification code. Please try again.",
    otpNotificationTitle: "AlphaPitch Security Code",
    otpNotificationBody: "Your verification code is:",
    alreadyHaveAccount: "Already have an account? Log In",
    needAccount: "Don't have an account? Sign Up"
  }
};
