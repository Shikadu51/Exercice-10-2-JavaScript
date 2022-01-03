(function () {
    "use strict";
  
    var code = [], // Séquence de couleurs que le joueur doit deviner
      guess = [], // Color sequence of player's guesses
      options = document.getElementsByClassName("option"),
      inputRows = document.getElementsByClassName("guess"),
      hintContainer = document.getElementsByClassName("hint"),
      secretSockets = document.getElementsByClassName("secret socket"),
      modalOverlay = document.getElementById("modalOverlay"),
      modalMessage = document.getElementById("modalMessage"),
      rowIncrement = 1,
      hintIncrement = 1,
      pegs = {
        1: "vert",
        2: "violet",
        3: "rouge",
        4: "jaune",
        5: "bleu",
        6: "marron",
      };
  
    function gameSetup() {
      generateSecretCode(1, 7);
  
      // Ajouter un écouteur d'événements à chaque bouton 
      for (var i = 0; i < options.length; i++)
        options[i].addEventListener("click", insertGuess, false);
  
      document.getElementById("newGame").onclick = newGame;
      document.getElementById("delete").onclick = deleteLast;
    }
  
    function insertGuess() {
      var self = this;
      var slots =
        inputRows[inputRows.length - rowIncrement].getElementsByClassName(
          "socket"
        );
  
      slots[guess.length].className =
        slots[guess.length].className + " peg " + self.id; // Insérer le rond dans la page
  
      guess.push(+self.value);
  
      if (guess.length === 4) {
        if (compare()) gameState("won");
        else rowIncrement += 1;
      }
  
      if (rowIncrement === inputRows.length + 1 && !compare()) gameState("lost");
    }
  
    function compare() {
      var isMatch = true;
      var codeCopy = code.slice(0);
  
      // Vérifiez d'abord s'il y a des chevilles de la bonne couleur à la bonne place.
      for (var i = 0; i < code.length; i++) {
        if (guess[i] === code[i]) {
          insertPeg("hit");
          codeCopy[i] = 0;
          guess[i] = -1;
        } else isMatch = false;
      }
  
      // Vérifiez ensuite s'il y a des chevilles qui sont de la bonne couleur mais PAS au bon endroit.
      for (var j = 0; j < code.length; j++) {
        if (codeCopy.indexOf(guess[j]) !== -1) {
          insertPeg("almost");
          codeCopy[codeCopy.indexOf(guess[j])] = 0;
        }
      }
  
      hintIncrement += 1; // Définir la rangée suivante d'indices comme disponible
      guess = []; // Réinitialisation de la séquence de devinette
  
      return isMatch;
    }
  
    function insertPeg(type) {
      var sockets =
        hintContainer[
          hintContainer.length - hintIncrement
        ].getElementsByClassName("js-hint-socket");
      sockets[0].className = "socket " + type;
    }
  
    function deleteLast() {
      if (guess.length !== 0) {
        var slots =
          inputRows[inputRows.length - rowIncrement].getElementsByClassName(
            "socket"
          );
        slots[guess.length - 1].className = "socket"; // Insérer un nœud dans une page
        guess.pop();
      }
    }
  
    function newGame() {
      guess = []; // Remise à zéro du tableau des suppositions
      clearBoard();
      // Définissez la première rangée de cases comme étant disponible pour les suppositions.
      rowIncrement = 1; 
      // Définir la première rangée de cases comme disponible pour les hints.
      hintIncrement = 1; 
      hideModal();
      gameSetup(); // Préparer le jeu
    }
  
    function hideModal() {
      modalOverlay.className = "";
    }
  
    function clearBoard() {
      // Effacer le jeu
      for (var i = 0; i < inputRows.length; i++) {
        inputRows[i].innerHTML = "";
        for (var j = 0; j < 4; j++) {
          var socket = document.createElement("div");
          socket.className = "socket";
          inputRows[i].appendChild(socket);
        }
      }
  
      // Effacer les cases hint
      for (var i = 0; i < hintContainer.length; i++) {
        var socketCollection = hintContainer[i].getElementsByClassName("socket");
        for (var j = 0; j < 4; j++) {
          socketCollection[j].className = "js-hint-socket socket";
        }
      }
  
      // Réinitialisation des cases de code secret
      for (var i = 0; i < secretSockets.length; i++) {
        secretSockets[i].className = "secret socket";
        secretSockets[i].innerHTML = "?";
      }
  
      document.getElementsByTagName("body")[0].className = ""; // Reinit Background
    }
  
    // Création une séquence de couleurs que le joueur doit deviner.
    function generateSecretCode(min, max) {
      for (var i = 0; i < 4; i++)
        code[i] = Math.floor(Math.random() * (max - min)) + min;
    }
  
    // Une fois que le joueur n'a plus de réponses ou qu'il a déchiffré le code, la séquence est révélée.
    function revealCode() {
      for (var i = 0; i < secretSockets.length; i++) {
        secretSockets[i].className += " " + pegs[code[i]];
        secretSockets[i].innerHTML = ""; // Retirer le " ?" de la case
      }
    }
  
    function gameOver() {
      // Disable color options
      for (var i = 0; i < options.length; i++)
        options[i].removeEventListener("click", insertGuess, false);
  
      revealCode();
    }
  
    function gameState(state) {
      gameOver();
      document.getElementsByTagName("body")[0].className = state;
      modalOverlay.className = state;
  
      if (state === "won") {
        modalMessage.innerHTML =
          '<h2>Vous avez trouvé le code!</h2> <p>Félicitations! </p> <button class="large" id="hideModal">OK</button> <button id="restartGame" class="large primary">Redémarrer</button>';
        document.getElementById("restartGame").onclick = newGame;
        document.getElementById("hideModal").onclick = hideModal;
      } else
        modalMessage.innerHTML =
          '<h2>Vous avez échoué..</h2> <p>Quel dommage !...  Regarde le bon côté des choses, tu n\'étais même pas proche.</p> <button class="large" id="hideModal">OK</button> <button id="restartGame" class="large primary">Redémarrer</button>';
      document.getElementById("restartGame").onclick = newGame;
      document.getElementById("hideModal").onclick = hideModal;
    }
  
    gameSetup(); // Démarre le jeu
  })();