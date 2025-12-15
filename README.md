# 🎯 Nullos Kill

**Nullos Kill** est une application web interactive de suivi de scores et de calcul de dettes en temps réel, spécialement conçue pour animer les sessions de jeu en stream.

Le concept est simple et impitoyable : on suit les performances des joueurs (Kills, Revives) en direct. À la fin de la partie, le joueur avec le score le plus bas (le "Nullos") est désigné perdant et doit payer une dette aux vainqueurs, calculée automatiquement selon un multiplicateur configurable.

## ✨ Fonctionnalités Principales

### 🎮 Panneau d'Administration (`/admin`)
Une interface complète pour le maître du jeu :
- **Gestion des Joueurs** : Ajout, modification et suppression de joueurs à la volée.
- **Live Scoring** : Mise à jour instantanée des Kills et Revives.
- **Paramètres de Jeu** : 
  - Ajustement du multiplicateur monétaire (ex: 0.10€ par point).
  - Contrôle de la visibilité des éléments sur le stream (Cacher/Afficher les scores, le multiplicateur, etc.).
- **Système de Dettes** : Calcul automatique des sommes dues en fin de partie avec gestion des égalités.
- **Analytique** : Graphiques détaillés de l'historique des parties et de l'évolution des dettes financières.

### 📺 Overlay de Stream (`/stream`)
Une vue optimisée pour l'intégration dans OBS/Streamlabs :
- **Mise à jour Temps Réel** : Les scores changent instantanément grâce aux WebSockets.
- **Design Réactif** : Cartes de joueurs animées avec indicateurs visuels.
- **Mode "Focus Loser"** : Option pour isoler et mettre en avant le joueur actuellement en danger.
- **Animation de Fin de Partie** : Un écran "Game Over" spectaculaire (style roue de la fortune) qui annonce le perdant et le montant de la dette avec une typographie personnalisée ("Sugar Bread").

## 🛠️ Stack Technique

Ce projet est construit avec une architecture moderne et robuste :

- **Frontend** : [Next.js](https://nextjs.org/) (React), Tailwind CSS pour le styling, Framer Motion/CSS animations.
- **Backend** : [NestJS](https://nestjs.com/) pour l'API et la logique métier.
- **Base de Données** : PostgreSQL (via TypeORM).
- **Temps Réel** : Socket.io pour la communication bidirectionnelle instantanée.
- **Déploiement** : Entièrement conteneurisé avec Docker et Docker Compose.

## 🚀 Installation et Démarrage

### Prérequis
- Docker et Docker Compose installés sur votre machine.

### Lancement Rapide

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/alex-lmn/Nullos-Kill.git
   cd Nullos-Kill
   ```

2. Lancez les conteneurs (Frontend, Backend, Base de données) :
   ```bash
   docker-compose up --build
   ```

3. Accédez à l'application :
   - **Interface Admin** : [http://localhost:3000/admin](http://localhost:3000/admin)
   - **Overlay Stream** : [http://localhost:3000/stream](http://localhost:3000/stream)
   - **API Backend** : [http://localhost:3001](http://localhost:3001)

## 🎨 Personnalisation

- **Polices** : Le projet utilise la police "Sugar Bread" pour l'overlay de fin de partie (à placer dans `frontend/public/fonts/`).
- **Thème** : Couleurs principales basées sur une palette Vert/Marron/Rouge configurable via Tailwind.

---
*Développé pour rendre les défaites plus coûteuses.*
