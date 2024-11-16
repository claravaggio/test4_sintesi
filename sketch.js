let counter = 0; // Contatore che funge da tachimetro
let speedIncrease = 0.5; // Velocità di aumento del contatore
let decreaseFactor = 0.1; // Fattore di riduzione del contatore
let simulationStarted = false; // Controlla se la simulazione è iniziata

// Variabili per le auto
let auto1X = 10;
let auto2X = 200;
let auto2Speed = 1.5; // Velocità della seconda auto

let gameOver = false;
let imageVisible = false; // Controlla se l'immagine è visibile
let imageSwitchTime = 2000; // Tempo in millisecondi per cambiare immagine
let imageTimer = 0; // Timer per la pressione della spacebar
let releaseTimer = 0; // Timer per il rilascio della spacebar
let currentImage; // Immagine attualmente mostrata
let showImage = false; // Stato dell'immagine mostrata

function preload() {
  img1 = loadImage("assets/car1.png");
  img2 = loadImage("assets/car2.png");
  brake1 = loadImage("assets/verde.svg");
  brake2 = loadImage("assets/rosso.svg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  if (gameOver) {
    // Schermata di Game Over
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    textSize(100);
    text("GAME OVER", width / 2, height / 2 - 100);
    return;
  }

  background(0);

  fill(255, 255, 255);
  rect(0, 0, windowWidth, 80);

  fill(255);
  textSize(50);
  textAlign(LEFT);
  text("4", 20, height - 30);

  image(img1, auto1X, 10, img1.width / 8, img1.height / 8);
  image(img2, auto2X, 10, img2.width / 8, img2.height / 8);

  // Inizia il movimento di auto2 solo quando simulationStarted è true
  if (simulationStarted) {
    auto2X += auto2Speed;
    if (auto2X > width - img2.width / 8) {
      auto2X = width - img2.width / 8;
      auto2Speed = 0;
    }
  }

  // Aumenta il contatore quando tieni premuto invio
  if (keyIsDown(ENTER)) {
    if (!simulationStarted) {
      simulationStarted = true; // Inizia la simulazione con la prima pressione di ENTER
    }

    counter += speedIncrease;
    counter = constrain(counter, 0, 100);
    auto1X += map(counter, 0, 100, 0, 5);

    // Nasconde tutte le immagini quando si accelera
    imageVisible = false;
    showImage = false;
  } else {
    // Riduci il contatore quando non tieni premuto invio
    counter -= decreaseFactor;
    counter = max(counter, 0);
    auto1X += map(counter, 0, 100, 0, 3);
  }

  // Gestione del tasto spacebar per far comparire un'immagine
  if (keyIsDown(32)) {
    // spacebar premuto
    if (!simulationStarted) {
      return; // Se la simulazione non è iniziata, non mostrare l'immagine
    }
    if (!imageVisible) {
      // Inizia il timer quando si preme spacebar
      imageTimer = millis();
      imageVisible = true;
      currentImage = brake1; // Mostra la prima immagine inizialmente
    }
    // Se la spacebar è tenuta premuta più di 1 secondo, cambia immagine
    if (millis() - imageTimer > 1000) {
      currentImage = brake2; // Cambia immagine dopo 1 secondo
    }
    showImage = true;
    releaseTimer = 0; // Resetta il timer per il rilascio
  } else {
    // spacebar rilasciata
    if (releaseTimer === 0) {
      releaseTimer = millis(); // Inizia il timer di rilascio
    }
    // Dopo 1 secondo dal rilascio, reimposta l'immagine a brake1
    else if (millis() - releaseTimer > 1000) {
      currentImage = brake1;
      showImage = true;
    }
    imageVisible = false;
  }

  // Quando si preme ENTER, l'immagine sparisce
  if (keyIsDown(ENTER)) {
    imageVisible = false;
    showImage = false;
  }

  // Disegna l'immagine se è visibile
  if (showImage && currentImage && simulationStarted) {
    image(
      currentImage,
      width - 500,
      height / 2 - 100,
      currentImage.width,
      currentImage.height
    );
  }

  // Verifica collisione tra auto1 e auto2
  if (auto1X + img1.width / 8 > auto2X) {
    gameOver = true;
  }

  // Visualizza il contatore al centro dello schermo
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(200);
  textFont("aktiv-grotesk");
  textStyle(BOLD);
  text(int(counter), width / 2, height / 2);
}
