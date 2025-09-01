# 📊 YNAB TUI

Un client **TUI (Terminal User Interface)** en Node.js/TypeScript pour interagir avec l’API [YNAB](https://api.youneedabudget.com/).  
L’objectif initial est de **lister et gérer les transactions non "cleared"** directement depuis le terminal.

---

## 🚀 Fonctionnalités (MVP)

-  Lister les transactions "uncleared" d’un budget YNAB.  
-  Affichage sous forme de tableau avec Ink (React dans le terminal).  
-  Navigation au clavier (flèches, sélection, validation).  
-  Marquer une transaction comme "cleared".  
-  Filtrer par catégorie, date, ou montant.  

---

## 🛠️ Stack technique

- **Langage** : TypeScript / Node.js  
- **API** : YNAB REST API  
- **TUI** : [Ink](https://github.com/vadimdemedes/ink)  
- **HTTP client** : Axios  
- **Tests** :
  - [Vitest](https://vitest.dev/)  
  - [Ink Testing Library](https://github.com/vadimdemedes/ink-testing-library)  

---

## 📂 Architecture

```

src/
api/
ynab.ts           # Wrapper pour l’API YNAB
components/
TransactionList.tsx # Composant Ink pour afficher les transactions
cli.ts              # Point d’entrée CLI
tests/
api.test.ts         # Tests du wrapper API
components.test.tsx # Tests du composant TUI

````

---

## 🔧 Installation

1. Cloner le dépôt :
   ```bash
   git clone git@github.com:ton-compte/ynab-tui.git
   cd ynab-tui
```

2. Installer les dépendances :

   ```bash
   npm install
   ```

3. Configurer les variables d’environnement :
   Créer un fichier `.env` avec :

   ```env
   YNAB_TOKEN=ton_token_ynab
   YNAB_BUDGET_ID=ton_budget_id
   ```

---

## ▶️ Utilisation

Lancer le CLI :

```bash
npx ts-node src/cli.ts
```

Exemple de sortie :

```
2025-08-20 | Coffee Shop | -4.50 | uncleared
2025-08-19 | Supermarket | -32.10 | uncleared
```

---

## 🧪 Tests (TDD)

Le projet suit une démarche **Test-Driven Development (TDD)** :

1. Écrire un test rouge (qui échoue).
2. Implémenter la fonctionnalité minimale (vert).
3. Refactoriser le code et les tests (propreté).

Lancer les tests :

```bash
npm test
```

---

## 🔮 Roadmap

* [ ] Afficher la liste des transactions
* [ ] Navigation avec les flèches dans la liste.
* [ ] Action : `Clear` une transaction sélectionnée.
* [ ] Filtres (catégories, dates, montants).
* [ ] Vue résumée par catégorie.
* [ ] Distribution via `npm install -g`.

---

## 📜 Licence

MIT
