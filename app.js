const MIN = 1;
const MAX = 30;
const MAX_TENTATIVAS = 5;


const campo = document.getElementById("palpite");
const btnChutar = document.getElementById("btn-chutar");
const btnReiniciar = document.getElementById("btn-reiniciar");
const mensagem = document.getElementById("mensagem");
const barra = document.getElementById("barra");
const elTentativas = document.getElementById("tentativas");
const elRestantes = document.getElementById("restantes");
const historico = document.getElementById("historico");
const card = document.querySelector(".game");

let secreto, tentativas, acabou;

function sortear() {
  return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
}

function mostrar(texto, classe) {
  mensagem.textContent = texto;
  mensagem.className = "message " + (classe || "");
}

function atualizarPainel() {
  const restantes = MAX_TENTATIVAS - tentativas;
  elTentativas.textContent = tentativas;
  elRestantes.textContent = restantes;
  barra.style.width = (restantes / MAX_TENTATIVAS) * 100 + "%";
}

function tremer() {
  card.classList.remove("shake");
  void card.offsetWidth; // reinicia a animação
  card.classList.add("shake");
}

function terminar() {
  acabou = true;
  campo.disabled = true;
  btnChutar.disabled = true;
}

function novoJogo() {
  // Sorteia um novo número, garantindo que seja diferente do anterior
  let novo;
  do {
    novo = sortear();
  } while (novo === secreto);
  secreto = novo;
  console.log("🔎 Número secreto (consulta):", secreto);
  tentativas = 0;
  acabou = false;
  historico.innerHTML = "";
  campo.disabled = false;
  btnChutar.disabled = false;
  campo.value = "";
  campo.focus();
  mostrar("Faça seu primeiro palpite!");
  atualizarPainel();
}

function chutar() {
  if (acabou) return;

  const valor = Number(campo.value);
  if (!campo.value || !Number.isInteger(valor) || valor < MIN || valor > MAX) {
    mostrar(`Digite um número inteiro entre ${MIN} e ${MAX}.`, "lose");
    tremer();
    return;
  }

  tentativas++;
  const chip = document.createElement("li");
  chip.textContent = valor;
  historico.appendChild(chip);

  if (valor === secreto) {
    mostrar(`🎉 Acertou! O número era ${secreto}, em ${tentativas} tentativa(s).`, "win");
    terminar();
  } else if (tentativas >= MAX_TENTATIVAS) {
    mostrar(`😢 Fim de jogo! O número era ${secreto}.`, "lose");
    terminar();
    tremer();
  } else if (valor > secreto) {
    mostrar("Muito alto! Tente um número menor. ⬇️", "high");
    tremer();
  } else {
    mostrar("Muito baixo! Tente um número maior. ⬆️", "low");
    tremer();
  }

  atualizarPainel();
  campo.value = "";

  // Aviso quando o palpite errado está a até 5 unidades do número secreto
  if (!acabou && Math.abs(valor - secreto) <= PROXIMIDADE) {
    // setTimeout deixa a tela atualizar antes de o alert bloquear a página
    setTimeout(() => {
      alert("🔥 Está quente! Você está bem perto: o número secreto está a até 5 unidades do seu palpite.");
      campo.focus();
    }, 50);
  } else if (!acabou) {
    campo.focus();
  }
}

btnChutar.addEventListener("click", chutar);
btnReiniciar.addEventListener("click", novoJogo);
campo.addEventListener("keydown", (e) => {
  if (e.key === "Enter") chutar();
});

novoJogo();