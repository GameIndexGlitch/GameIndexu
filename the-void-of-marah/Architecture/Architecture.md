# Arquitetura do jogo

the-void-of-marah/
├── index.html               # O único arquivo HTML. É ele que você abre no navegador.
├── style.css                # Apenas para zerar margens e centralizar o Canvas de 1600x900.
│
├── lib/
│   └── kaboom.js            # O arquivo da biblioteca baixado (ou pode usar via link/CDN no HTML).
│
├── assets/                  # Todas as imagens e sons (separados por estilo de arte)
│   ├── bg/
│   │   └── the_end.png      # O ambiente de fundo inteiro desenhado 1 vez.
│   │
│   ├── pixel_art/
│   │   ├── ui/              # Coração de vida, Escudo, etc.
│   │   ├── cards/           # Cards de ataques.
│   │   ├── dice/            # Faces do dado de 6 lados.
│   │   ├── gacha/           # Itens bons e ruins da casa gacha.
│   │   └── vfx/             # Efeitos de espadinha quadrada para ataques.
│   │
│   ├── drawings/
│   │   ├── chars/           # Anão de machado, Menina de cabelo longo, Menino.
│   │   ├── bosses/          # Os 2 chefes de cada fase + Boss Final.
│   │   ├── keys/            # Chave para desbloquear a próxima fase.
│   │   └── cutscenes/       # Cenas desenhadas para a transição de fases.
│   │   └── SelectScreenUI/  # Tela de seleção de personagem com a Maya e o Zeck.
│   │   └── TitleScreenUI/   # Tela inicial com start e volume.
│   │
│   └── sounds/              # (Opcional, mas recomendado) Músicas e efeitos sonoros.
│
└── js/                      # Toda a lógica do jogo (O território do seu namorado)
│
├── main.js              # Inicializa o Kaboom (1600x900), carrega os assets e inicia o jogo.
├── globals.js           # Salva dados globais (ex: fase atual, status acumulado, chaves).
│
├── scenes/              # As diferentes telas do jogo
│   ├── menu.js          # Tela inicial (Volume, Iniciar, Seleção de 2 personagens, História).
│   ├── board.js         # Lógica do Tabuleiro (casas normais, gacha, checkpoint).
│   ├── combat.js        # A tela de RPG de turno com as cartas e distorção de imagem.
│   └── cutscene.js      # Gerencia a exibição das artes de história ao passar de cena.
│
├── entities/            # Os "atores" do jogo
│   ├── player.js        # Lida com a Vida, Defesa, Ataque, animação de vibrar e ficar vermelho.
│   └── enemies.js       # Gera os atributos randômicos dos Minions e define os status fixos dos Bosses.
│
└── mechanics/           # Sistemas independentes
├── gachaSystem.js   # Calcula se a casa caiu em par (coisa boa) ou ímpar (coisa ruim).
├── roulette.js      # A lógica da geração de tabuleiro.
└── turnManager.js   # Controla de quem é a vez no combate e o uso das cartas.
