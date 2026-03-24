# Guide Utilisateur -  Plateforme IoT Chaumont-sur-Loire

<aside>
💡

**Ce guide vous accompagne pas à pas dans la prise en main de la plateforme de monitoring de l'aire de repos de Chaumont-sur-Loire.**

</aside>

---

## **Table des matières**

---

## **1. Présentation**

La plateforme IoT de Chaumont-sur-Loire est composée de **deux sites web** :

| **Site** | **Rôle** |
| --- | --- |
| **Page Découverte** | Site public permettant aux visiteurs de découvrir l'aire de repos via une carte interactive |
| **Tableau de bord** | Espace privé pour le personnel, affichant les données des capteurs en temps réel |

### **Quels capteurs sont suivis ?**

- **Sonde environnementale** - Température, hygrométrie, niveau d'eau
- **Détecteur d'occupation** - État des toilettes (occupé / libre)
- **Compteur de fréquentation** - Nombre d'entrées / sorties des visiteurs
- **Distributeur de savon** - Estimation du niveau de savon restant

## **2. Accéder à l'application**

Ouvrez votre navigateur web (Chrome, Firefox, Edge) et rendez-vous à l'adresse fournie par votre administrateur.

URL :
[https://iot-dashboard-lac.vercel.app/connexion](https://iot-dashboard-lac.vercel.app/connexion)

<aside>
💡

**Astuce** : Ajoutez la page à vos favoris pour y accéder rapidement.

</aside>

## **3. Se connecter**

![image.png](Guide%20Utilisateur%20-%20Plateforme%20IoT%20Chaumont-sur-Lo/image.png)

1. Cliquez sur **« Connexion »** ou rendez-vous sur `/connexion`
2. Saisissez votre **adresse e-mail** et votre **mot de passe**
3. Cliquez sur le bouton **« Connexion »**

Vous êtes redirigé vers le **Tableau de bord**.

> ⚠️ Si votre compte est désactivé, un message vous en informera. Contactez votre administrateur.
> 

### Identifants :

E-mail : [thomas.tran-van@departement41.fr](mailto:thomas.tran-van@departement41.fr)
Mot de passe : Admin123!

### **Mot de passe oublié**

1. Sur la page de connexion, cliquez sur **« Mot de passe oublié ? »**
2. Saisissez votre adresse e-mail
3. Suivez les instructions reçues par e-mail

## **4. Page Découverte (accueil public)**

![image.png](Guide%20Utilisateur%20-%20Plateforme%20IoT%20Chaumont-sur-Lo/image%201.png)

La page d'accueil affiche une **carte interactive panoramique** de l'aire de Chaumont-sur-Loire.

### **Comment l'utiliser**

1. **Explorez la carte** en faisant glisser l'image (sur mobile : glissez avec le doigt)
2. **Cliquez sur un point numéroté** (1 à 4) pour en savoir plus :
    - 🍇 **1. Déguster -** L'AOC Touraine Mesland et ses vignobles
    - 🌊 **2. Protéger** - La Loire, fleuve sauvage protégé
    - 🏛️ **3. Découvrir** - L'histoire du port de Chaumont
    - 🚴 **4. Explorer** - La Loire à Vélo
3. Chaque point ouvre une **fiche détaillée** avec description, activités et liens vers des sites partenaires
4. Cliquez sur le bouton **ℹ️** (en bas à droite) pour plus d'informations

## **5. Page Vitrine Chaumont**

![image.png](Guide%20Utilisateur%20-%20Plateforme%20IoT%20Chaumont-sur-Lo/image%202.png)

Accessible via `/chaumont`, cette page présente l'aire de repos avec :

- Une **section héro** avec une image panoramique
- Le **niveau d'eau de la Loire** affiché en temps réel
- Les **richesses du territoire** (vignobles, Loire, vélo)
- Les **coordonnées et liens utiles** en pied de page

## **6. Questionnaire de satisfaction**

![image.png](Guide%20Utilisateur%20-%20Plateforme%20IoT%20Chaumont-sur-Lo/image%203.png)

Accessible via `/satisfaction`, ce formulaire permet aux visiteurs de donner leur avis.

### **Remplir le questionnaire**

1. Évaluez 3 critères (de « Mauvais » à « Excellent ») :
    - Satisfaction de l'aire
    - Satisfaction de la sécurité
    - Satisfaction des services
2. Sélectionnez vos **sources de connaissance** (comment avez-vous connu l'aire ?)
3. Ajoutez une **remarque** si vous le souhaitez
4. Cliquez sur **« Envoyer »**

## **7. Tableau de bord**

![image.png](Guide%20Utilisateur%20-%20Plateforme%20IoT%20Chaumont-sur-Lo/image%204.png)

Le tableau de bord est l'écran principal après connexion. Il affiche un résumé complet de l'état de l'aire.

### **Ce que vous voyez**

| **Élément** | **Description** |
| --- | --- |
| **Bonjour, [Prénom]** | Message de bienvenue personnalisé |
| **Carte Météo** | Température actuelle et conditions météo à Chaumont-sur-Loire |
| **Fréquentation** | Nombre de visiteurs du jour |
| **Contenance savon** | Estimation du niveau de savon restant (en mL) |
| **Hauteur d'eau** | Niveau actuel de la Loire (en mètres) |
| **Questionnaires remplis** | Nombre de questionnaires cette semaine |
| **Remarques et suggestions** | Derniers commentaires des visiteurs |
| **Graphique niveau d'eau** | Évolution du niveau sur la journée |

## **8. Graphiques des capteurs**

![image.png](Guide%20Utilisateur%20-%20Plateforme%20IoT%20Chaumont-sur-Lo/image%205.png)

Depuis le menu latéral, accédez à **« Gestion de l'aire »** pour visualiser les données détaillées des capteurs.

### **Fonctionnalités**

- **Sélection de la période** : “Aujourd'hui, Mois, Année” via le menu déroulant en haut du graphique
- **Filtre par mois** : Sélectionnez un mois spécifique pour affiner la vue
- **Rafraîchir** : Cliquez sur le bouton de rechargement pour actualiser les données
- **Plusieurs types de courbes** : Température, hygrométrie, fréquentation, etc.

### **Lire un graphique**

- L'**axe horizontal** indique le temps (heures, jours, mois selon la période)
- L'**axe vertical** indique la valeur mesurée
- **Survolez** une courbe avec la souris pour voir la valeur exacte

## **9. Distributeurs de savon**

![image.png](Guide%20Utilisateur%20-%20Plateforme%20IoT%20Chaumont-sur-Lo/image%206.png)

Depuis le menu latéral, accédez à **« Savon »**.

Cette page permet de :

- Voir la **contenance estimée** de chaque distributeur de savon
- Identifier les distributeurs qui approchent du **seuil d'alerte** (à remplir bientôt)
- Consulter l'historique des **passages** utilisés pour le calcul

> 🧴 Le système estime automatiquement la consommation de savon en fonction du nombre de passages de visiteurs.
> 

## **10. Zone inondable**

![image.png](Guide%20Utilisateur%20-%20Plateforme%20IoT%20Chaumont-sur-Lo/image%207.png)

Depuis le menu latéral, accédez à **« Zone inondable »**.

Cette page affiche les données relatives au monitoring de la zone inondable, notamment les mesures de hauteur d'eau et les tendances.

## **11. Analyse de la satisfaction**

![image.png](Guide%20Utilisateur%20-%20Plateforme%20IoT%20Chaumont-sur-Lo/image%208.png)

Depuis le menu latéral, accédez à **« Analyse satisfaction »**.

Cette page propose des **graphiques** basés sur les réponses au questionnaire de satisfaction :

- **Répartition des évaluations** par critère (aire, sécurité, services)
- **Sources de connaissance** des visiteurs (d'où viennent-ils ?)
- **Liste des commentaires** et suggestions

### **Filtrer les résultats**

Utilisez les sélecteurs de période disponibles pour affiner les résultats (jour, semaine, mois, année).

## **12. Mon compte**

![image.png](Guide%20Utilisateur%20-%20Plateforme%20IoT%20Chaumont-sur-Lo/image%209.png)

Depuis le menu latéral, cliquez sur votre **avatar** ou sur **« Détails du compte »** pour accéder à votre profil.

Vous pouvez y consulter :

- Votre nom et prénom
- Votre adresse e-mail
- Votre rôle dans l'application

## **13. Gestion des utilisateurs (Admin)**

<aside>
⚠️

**Accessible uniquement aux administrateurs.**

</aside>

![image.png](Guide%20Utilisateur%20-%20Plateforme%20IoT%20Chaumont-sur-Lo/image%2010.png)

Depuis le menu latéral : **Admin → Liste des utilisateurs**.

### **Ajouter un utilisateur**

1. Cliquez sur le bouton **« Nouvel utilisateur »**
2. Remplissez le formulaire :
    - Prénom, Nom
    - Adresse e-mail
    - Mot de passe
    - Rôle
    - Cochez « Compte actif » si l'utilisateur doit être actif
3. Cliquez sur **« Créer »**

### **Modifier un utilisateur**

1. Cliquez sur l'icône **crayon** ✏️ à côté de l'utilisateur
2. Modifiez les champs souhaités
3. Cliquez sur **« Enregistrer »**

<aside>
💡

Laissez le champ « Mot de passe » vide pour ne pas le modifier.

</aside>

### **Supprimer un utilisateur**

1. Cliquez sur l'icône **corbeille** 🗑️ à côté de l'utilisateur
2. Confirmez la suppression dans la fenêtre de dialogue

<aside>
⚠️

Cette action est **irréversible**.

</aside>

### **Désactiver un utilisateur**

Modifiez l'utilisateur et **décochez** « Compte actif ». L'utilisateur ne pourra plus se connecter.

## **14. Gestion des permissions (Admin)**

<aside>
⚠️

**Accessible uniquement aux administrateurs.**

</aside>

![image.png](Guide%20Utilisateur%20-%20Plateforme%20IoT%20Chaumont-sur-Lo/image%2011.png)

Depuis le menu latéral : **Admin → Permissions**.

Cette page permet de configurer les droits d'accès pour chaque rôle :

- Quelles pages chaque rôle peut voir
- Quelles actions chaque rôle peut effectuer (créer, modifier, supprimer des utilisateurs, etc.)

## **15. Thème sombre / clair**

![image.png](Guide%20Utilisateur%20-%20Plateforme%20IoT%20Chaumont-sur-Lo/image%2012.png)

L'application propose deux thèmes visuels :

☀️ **Mode clair** - fond lumineux, idéal en journée

🌙 **Mode sombre** - fond sombre, confortable pour les yeux

Pour changer de thème, cliquez sur l'icône **soleil/lune** dans la barre latérale.

## **16. Se déconnecter**

![image.png](Guide%20Utilisateur%20-%20Plateforme%20IoT%20Chaumont-sur-Lo/image%2013.png)

Pour vous déconnecter :

1. Cliquez sur **« Mon compte > Déconnexion »** dans le menu latéral
2. Vous êtes redirigé vers la page de connexion

## **17. Problèmes fréquents**

| **Problème** | **Solution** |
| --- | --- |
| **Je ne peux pas me connecter** | Vérifiez votre e-mail et mot de passe. Si le problème persiste, utilisez « Mot de passe oublié » ou contactez votre administrateur. |
| **« Compte inactif »** | Votre compte a été désactivé par un administrateur. Contactez-le pour le réactiver. |
| **« Accès refusé »** | Vous n'avez pas les permissions nécessaires pour cette page. Contactez votre administrateur. |
| **Les données ne s'affichent pas** | Vérifiez votre connexion internet. Essayez de rafraîchir la page. Si le problème persiste, l'API backend est peut-être indisponible. |
| **Les graphiques sont vides** | Aucune donnée n'a été enregistrée pour la période sélectionnée. Essayez une autre période. |
| **Le thème ne change pas** | Rafraîchissez la page après avoir cliqué sur l'icône soleil/lune. |

<aside>
📩

**Support** : En cas de problème technique, contactez votre administrateur système.

</aside>