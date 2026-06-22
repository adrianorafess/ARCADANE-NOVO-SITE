import { ServiceItem, TestimonialItem, PackageItem, BlogPost } from './types';

export const SERVICES: ServiceItem[] = [
  {
    id: 'corp',
    title: 'Viagem corporativa',
    description: 'Gestão completa de viagens de negócios com eficiência, conforto e organização para sua empresa.',
    iconName: 'Briefcase'
  },
  {
    id: 'car',
    title: 'Aluguel de carro',
    description: 'Mobilidade com segurança e praticidade, com as melhores tarifas e locadoras parceiras do mercado.',
    iconName: 'Car'
  },
  {
    id: 'hotel',
    title: 'Hotel',
    description: 'Hospedagens selecionadas a dedo com conforto, localização estratégica e experiências diferenciadas.',
    iconName: 'Hotel'
  },
  {
    id: 'insurance',
    title: 'Seguro viagem',
    description: 'Cobertura completa com assistência médica e suporte 24h para você viajar com total tranquilidade.',
    iconName: 'ShieldCheck'
  },
  {
    id: 'tickets',
    title: 'Ingresso & Show',
    description: 'Acesso facilitado aos melhores eventos teatrais, parques temáticos e experiências culturais no seu destino.',
    iconName: 'Ticket'
  },
  {
    id: 'incentive',
    title: 'Viagem de incentivo',
    description: 'Experiências exclusivas e roteiros corporativos desenhados para motivar equipes e valorizar resultados.',
    iconName: 'Sparkles'
  },
  {
    id: 'wedding',
    title: 'Casamento & lua de mel',
    description: 'Roteiros românticos especiais e organização de destination weddings para momentos únicos e inesquecíveis.',
    iconName: 'Heart'
  },
  {
    id: 'transfer',
    title: 'Transfer',
    description: 'Transporte privativo confortável, seguro e pontual diretamente do aeroporto ao seu hotel de destino.',
    iconName: 'Navigation'
  },
  {
    id: 'tours',
    title: 'Passeio',
    description: 'Atividades locais, tours panorâmicos e experiências culturais selecionadas para aproveitar o melhor de cada lugar.',
    iconName: 'Compass'
  },
  {
    id: 'flights',
    title: 'Passagem aérea',
    description: 'Emissão de passagens aéreas nacionais e internacionais com as melhores rotas, conexões e condições.',
    iconName: 'Plane'
  },
  {
    id: 'exchange',
    title: 'Intercâmbio',
    description: 'Programas de estudo de idiomas, trabalho e vivências internacionais com acompanhamento especializado.',
    iconName: 'Languages'
  },
  {
    id: 'custom',
    title: 'Viagem personalizada',
    description: 'Experiências exclusivas desenhadas sob medida de acordo com seus gostos, ritmo, interesses e orçamento.',
    iconName: 'Sliders'
  }
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    name: 'Cristiane Carlota',
    role: 'Influencer',
    rating: 5,
    text: 'Queria falar sobre o atendimento da Maria e do Mateus da Arcadane, o atendimento é excelente, eles dão respaldo sobre toda a viagem que você precisa, eles não pensam apenas na viagem que estão vendendo, pensam no depois, no que vão precisar depois, e isso em encantou muito no atendimento deles, e por isso queria deixar meu agradecimento por ter conhecido, e por todas as viagens que já fiz e por todos os momentos que estiveram prontos para me atender.',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
  },
  {
    name: 'Beatriz Borges',
    role: 'Empresária',
    rating: 5,
    text: 'Queria elogiar o atendimento, o cuidado e o carinho,que tiveram, eles criaram até um grupo para minhas amigas, para passar todas as informações, e terem o cuidado. E olha, vou te falar, a agência pode ter um nome, mas o funcionário, a recepção, o cuidado, a simpatia, faz toda a diferença, e a Maria faz toda a diferença na Arcadane.',
    imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=200'
  },
  {
    name: 'Bruna Sanguanini',
    role: 'Dentista',
    rating: 5,
    text: 'A Arcadane viagens é simplesmente a melhor agência do mundo! Eles são super acessíveis, e principalmente fazer de tudo para que o cliente tenha o que ele desejar em sua viagem ( até o cuzcuz do café da manhã) 😅 e também não deixam passar nenhum perrengue sozinha, sempre que precisei estavam disponíveis em qualquer horário! A agência é 5 estrelas.',
    imageUrl: 'https://images.unsplash.com/photo-1544717302-de29042820dd?auto=format&fit=crop&q=80&w=200'
  },
  {
    name: 'Julia Fazzio',
    role: 'Veterinaria',
    rating: 5,
    text: 'Oii, Maria! Tudo bem? Acabamos de chegar em casa e eu não podia deixar de te agradecer por todo o suporte que você e sua equipe deram do início ao fim da nossa viagem. Fez toda a diferença pra gente! Eu e o Diego nunca tínhamos viajado juntos, então ter fechado com vocês trouxe muita segurança e tranquilidade. Além de que vocês estavam sempre disponíveis, até pra dar diquinhas de passeios. De verdade, muito obrigada por todo o cuidado e atenção, fez nossa experiência ser ainda melhor do que imaginávamos! Já queremos muito e estamos animados pra programar a próxima viagem com vocês ❤️',
    imageUrl: 'https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&q=80&w=200'
  },
  {
    name: 'Victor Fellers',
    role: 'Bancário',
    rating: 5,
    text: 'Bom dia, Mateus! Acabei esquecendo ontem, mas queremos agradecer pela atenção e cuidado com nossa viagem. Foi tudo como esperávamos e mais uma experiência que ficará na nossa memória. Valeu demais! A próxima já estamos pensando em ir com a família de novo. Aí te chamo, hehe.',
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200'
  },
  {
    name: 'Gisiane Bohnenl',
    role: '',
    rating: 5,
    text: 'Muito obrigada pelas dicas de passeios, pelo atendimento e pela reserva. Buenos Aires é encantadora e passamos dias lindos lá. Graças a Deus, só agradecer. Obrigada e até breve.',
    imageUrl: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=200'
  }
];

export const PACKAGES: PackageItem[] = [
  {
    id: 'exotic-bali',
    title: 'Bali Espiritual & Praias Paradisíacas',
    category: 'exotico',
    description: 'Descubra a ilha dos deuses na Indonésia. Roteiro exclusivo mesclando templos sagrados em Ubud, as falésias de Uluwatu e a tranquilidade espiritual do sudeste asiático.',
    price: 'Sob Consulta',
    duration: '12 Dias / 10 Noites',
    imageWord: 'bali',
    highlights: ['Templos Sagrados de Ubud', 'Entardecer em Uluwatu', 'Hospedagem de Charme', 'Guia em Português/Espanhol']
  },
  {
    id: 'exotic-safari',
    title: 'Safári de Luxo no Serengeti & Maldivas',
    category: 'exotico',
    description: 'Uma combinação mágica entre a vida selvagem pura da Tanzânia e as águas azul-turquesa cristalinas e bangalôs sobre a água nas Maldivas.',
    price: 'Sob Consulta',
    duration: '15 Dias / 13 Noites',
    imageWord: 'safari',
    highlights: ['Safári Privativo 4x4', 'Avistamento dos Big Five', 'Bangalôs Sobre as Águas', 'Regime All-Inclusive nas Maldivas']
  },
  {
    id: 'nacional-gramado',
    title: 'Gramado & Canela Colonial de Luxo',
    category: 'nacional',
    description: 'Viva o charme europeu da Serra Gaúcha. Roteiro gastronômico exclusivo, passeios pelas vinícolas boutique do Vale dos Vinhedos e hospedagem de altíssimo padrão.',
    price: 'Sob Consulta',
    duration: '5 Dias / 4 Noites',
    imageWord: 'gramado',
    highlights: ['Tour Vale dos Vinhedos', 'Jantar de Fondue Exclusivo', 'Hospedagem Boutique', 'Assistência 24h Local']
  },
  {
    id: 'nacional-nordeste',
    title: 'Lençóis Maranhenses & Jericoacoara Premium',
    category: 'nacional',
    description: 'A rota das emoções definitiva. Lagoas de águas doces e cristalinas em meio a dunas gigantescas, finalizando com o pôr do sol inesquecível em Jeri.',
    price: 'Sob Consulta',
    duration: '8 Dias / 7 Noites',
    imageWord: 'nordeste',
    highlights: ['Circuito Lagoa Azul & Bonita', 'Transfer 4x4 Privativo', 'Pousadas de Charme', 'Passeio de Jangada no Rio Preguiças']
  },
  {
    id: 'nacional-beto',
    title: 'Beto Carrero World & Litoral Catarinense',
    category: 'nacional',
    description: 'Diversão e sofisticação no maior parque temático da América Latina em Penha, hospedando-se na vibrante Balneário Camboriú, cercado pelas praias mais elegantes.',
    price: 'Sob Consulta',
    duration: '4 Dias / 3 Noites',
    imageWord: 'parque',
    highlights: ['Ingresso Passe 2 Dias Beto Carrero', 'Hospedagem em Balneário Camboriú', 'Transfer Privativo', 'Tour Panorâmico na Roda Gigante FG Big Wheel']
  },
  {
    id: 'cruzeiro-msc',
    title: 'Cruzeiro Grand Voyage pela Costa Brasileira',
    category: 'cruzeiro',
    description: 'Navegue a bordo dos transatlânticos mais luxuosos da MSC ou Costa Cruzeiros. Gastronomia internacional, shows estilo Broadway e as praias mais bonitas do Brasil.',
    price: 'Sob Consulta',
    duration: '8 Dias / 7 Noites',
    imageWord: 'cruzeiro',
    highlights: ['Cabine com Varanda', 'Todas as Refeições Inclusas', 'Paradas em Ilhabela, Búzios e Salvador', 'Festas e Shows Noturnos']
  },
  {
    id: 'eua-orlando',
    title: 'Orlando Mágico: Parques Temáticos Premium',
    category: 'eua',
    description: 'Roteiro completo para a Disney e Universal Studios. Inclui assessoria exclusiva para compra de ingressos, agendamento de fura-filas (Genie+) e hospedagem impecável.',
    price: 'Sob Consulta',
    duration: '10 Dias / 8 Noites',
    imageWord: 'disney',
    highlights: ['Planejamento Dia a Dia de Parques', 'Ingressos Disney & Universal', 'Hospedagem em Resort Parceiro', 'Guia Brasileiro de Suporte']
  },
  {
    id: 'eua-ny',
    title: 'Nova York Clássica & Broadway',
    category: 'eua',
    description: 'Sinta a pulsação da maior metrópole do mundo. Roteiro abrangente unindo o Central Park, estátua da liberdade, mirantes modernos (Summit) e um espetáculo inesquecível na Broadway.',
    price: 'Sob Consulta',
    duration: '7 Dias / 5 Noites',
    imageWord: 'ny',
    highlights: ['Ingresso Summit One Vanderbilt', 'Ingresso Musical Broadway', 'Tour de Contrastes Privativo', 'Hospedagem Central em Manhattan']
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'quiz',
    title: 'Descubra seu estilo de viajante e seu destino ideal',
    excerpt: 'Responda algumas perguntas rápidas de curadoria e descubra em tempo real qual é a atmosfera ideal para sua próxima jornada exclusiva, além de receber sugestões sob medida para falar com nossos curadores de viagem.',
    category: 'Quiz Interativo',
    date: '16 de Junho, 2026',
    readTime: '2 min de teste',
    image: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=800',
    content: `### Você sabe qual é o seu verdadeiro estilo de viajante?

Algumas pessoas sonham com o recolhimento das montanhas frias acompanhadas de bons vinhos, enquanto outras se revigoram em praias paradisíacas particulares com águas cristalinas. Há quem se perca voluntariamente nos becos de história e arte de capitais culturais, e quem busque a pulsação intensa da aventura intocada e da vida selvagem.

Pensando nisso, nossa equipe de curadores desenvolveu um **sistema interativo exclusivo** para te ajudar a desvendar em menos de 2 minutos a atmosfera que mais sincroniza com seus desejos atuais.

### O que você vai descobrir com esta análise?
✔ O perfil completo do seu estilo de viagem dominante.
✔ Destinos recomendados em primeira mão, nacionais e internacionais, com grande suporte de nossa equipe.
✔ Um passaporte conceitual de estilo pronto para apresentar ao nosso consultor Mateus via WhatsApp a fim de desenhar o plano de voo perfeito.

Para acessar o teste interativo completo, basta clicar no banner de início e responder às perguntas com base em sua intuição.`
  },
  {
    id: '1',
    title: 'Por que comprar com uma agência de viagens? Entenda se realmente vale a pena',
    excerpt: 'Planejar uma viagem é sempre um momento especial, mas será que vale a pena contratar uma agência ou fazer tudo sozinho? Entenda o valor da segurança, do atendimento humano e do planejamento sem estresse.',
    category: 'Dicas de Viagem',
    date: '12 de Junho, 2026',
    readTime: '6 min de leitura',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800',
    content: `Planejar uma viagem é sempre um momento especial mas muitas pessoas chegam a uma fase da pesquisa em que surge a dúvida:
 “Será que vale a pena contratar uma agência de viagens ou é melhor fazer tudo sozinho?”

É normal pensar nisso. Hoje existem inúmeros sites, ofertas e promoções que parecem fáceis de resolver por conta própria. Ao mesmo tempo, há quem tenha receio de errar, medo de cair em pegadinhas online ou simplesmente queira a tranquilidade de ter alguém experiente ajudando em cada passo.

Este texto foi criado justamente para esclarecer essas dúvidas de forma leve, clara e transparente, para que você entenda o que realmente muda quando escolhe viajar com uma agência, especialmente se você valoriza segurança, atendimento humano e uma viagem bem planejada do começo ao fim.

### Vale a pena comprar com uma agência de viagens?
Na prática, sim e por motivos simples: você ganha segurança, proximidade, orientação profissional e economia de tempo, sem pagar mais por isso na maior parte das vezes.

Muita gente ainda imagina que agência significa “preço mais alto”, mas isso não é necessariamente verdade. As tarifas costumam ser competitivas, e o que você recebe em troca é algo que sites automáticos não entregam: cuidado real.

Para quem trabalha muito, tem rotina corrida (como professores e famílias), e busca praticidade sem abrir mão de fazer uma boa escolha, a agência elimina grande parte das incertezas que aparecem no caminho.

### Atendimento humano faz diferença na qualidade da viagem
Um dos principais motivos pelos quais tantas pessoas preferem agência é o atendimento humano.
 É saber que, quando você precisar:
- Ajustar datas
- Escolher o hotel ideal
- Decidir o melhor voo
- Resolver imprevistos
- Tirar dúvidas práticas
… você terá alguém experiente cuidando disso por você.

E essa é uma dúvida comum de quem está pesquisando:
 “Será que alguém realmente me ajuda se der problema?”
Sim. E, para muitas pessoas, esse apoio é o que transforma a viagem em algo realmente tranquilo, especialmente quando envolve crianças, idosos ou destinos mais complexos.

### Segurança para evitar erros e imprevistos
Muita gente acredita que comprar direto é sempre mais simples. Mas, com tanta informação circulando, também é comum ficar inseguro:
- Será que o site é confiável?
- Será que a reserva foi confirmada?
- E se o voo mudar?
- E se eu errar um detalhe sem querer?

Agências fazem a conferência humana de todos os detalhes importantes:
✔ Nomes e CPFs
✔ Datas e horários
✔ Documentos necessários
✔ Regras das tarifas
✔ Seguros de viagem corretos
✔ Exigências de entrada e vistos do destino

Isso evita prejuízos indesejados e dá aquela maravilhosa sensação de “estou fazendo tudo certo”, que é extremamente valiosa para quem deseja aproveitar bem a viagem.

### Economia de tempo (e de energia mental)
Viajar é maravilhoso… mas organizar tudo sozinho nem sempre é.
Pesquisar passagens, comparar hotéis, entender a geografia da região, ler dezenas de depoimentos na internet, montar de fato o roteiro, conferir documentos... isso leva dezenas de horas, às vezes semanas. Empresários, pais e profissionais com rotina cheia costumam sentir isso diretamente na pele.

A agência faz todo esse trabalho por você, de forma personalizada, respeitando seu estilo, seu orçamento e o que você deseja viver no destino.

Muita gente comenta:
 “Eu até consigo fazer tudo sozinho… mas simplesmente não quero.”
 E está totalmente tudo bem. É exatamente para isso que existe uma agência de confiança.

### Acesso a tarifas e condições especiais
Agências trabalham com operadoras, hotéis de excelência e companhias aéreas diariamente de forma integrada.
 Isso abre as portas para:
- Tarifas negociadas exclusivas
- Condições facilitadas de parcelamento
- Disponibilidade de reservas em datas muito requisitadas
- Upgrades de categorias de quartos e mimos
- Recomendações realmente seguras de passeios e estadias

Nada disso aparece para quem pesquisa sozinho em sites comuns ou plataformas de buscas puramente automáticas.

### Suporte antes, durante e após a viagem
Outra dúvida natural de quem está comparando opções é:
 “E se algo acontecer enquanto eu estiver viajando?”
Com uma agência, você nunca fica desamparado. Desde ajustes simples até situações mais complexas, existe alguém especializado cuidando pessoalmente do seu caso — não um robô, não um e-mail com resposta automática que demora dias.

Para quem gosta de viajar com segurança e total tranquilidade, isso se torna um dos maiores e mais valiosos diferenciais de todo o mercado.

### Afinal, quando realmente compensa contratar uma agência?
✔ Quando você quer evitar erros operacionais prejudiciais
✔ Quando busca segurança e proteção para você e sua família
✔ Quando simplesmente não tem tempo livre para pesquisar tudo
✔ Quando valoriza atendimento humano prestativo e de qualidade
✔ Quando prefere profissionais experientes conduzindo cada etapa da viagem
✔ Quando quer suporte irrestrito e imediato se algo sair do previsto
✔ Quando deseja uma experiência perfeitamente planejada, sem surpresas desagradáveis

Se você se identifica com pelo menos dois desses pontos, a agência já vale a pena e compensa muito.

### Viajar com agência é escolher tranquilidade
Viajar é uma das experiências mais especiais que podemos viver, e escolher contar com uma agência de viagens torna todo o processo mais leve, seguro e bem planejado. Quando você opta por esse acompanhamento de qualidade, não está apenas comprando um serviço: está investindo em tranquilidade absoluta, na certeza de que cada detalhe foi pensado e estruturado com cuidado e na segurança de ter alguém ao seu lado desde o primeiro planejamento até o retorno feliz para sua casa. É a diferença real entre viajar com dúvidas constantes e viajar com total confiança; entre tentar acertar tudo sozinho e ter orientação de fato personalizada; entre resolver problemas por conta própria e ter suporte VIP imediato quando precisar. Se o seu objetivo é aproveitar a viagem de verdade, sem preocupações e com a certeza de estar fazendo escolhas perfeitamente seguras, contratar uma agência de viagens é uma decisão inteligente e que transforma toda a sua experiência em algo infinitamente mais enriquecedor e especial.`
  },
  {
    id: '2',
    title: 'Como escolher a melhor agência de viagens para mim?',
    excerpt: 'Escolher a parceira certa para planejar suas férias envolve confiança, transparência e atendimento humano. Entenda os principais pilares de escolha.',
    category: 'Dicas de Viagem',
    date: '08 de Junho, 2026',
    readTime: '4 min de leitura',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    content: `Escolher a melhor agência de viagens para a sua jornada não precisa ser uma decisão complicada. Na verdade, é muito mais sobre sentir segurança real e transparência de atendimento do que sobre analisar pequenos detalhes puramente burocráticos.

Quando começamos a desenhar uma nova viagem, é extremamente comum surgir a típica dúvida: “como saber se essa agência de viagens é realmente confiável?” ou “qual delas vai entender perfeitamente o que eu preciso?” Essas perguntas aparecem porque viajar envolve expectativas altas, sonhos cultivados por meses e um investimento importante na nossa felicidade — por isso, ninguém quer cometer erros na hora de decidir.

A agência certa para você é aquela que, desde o primeiríssimo contato, conversa de forma totalmente personalizada com você como pessoa humana, não como um número ou um simples cifrão de faturamento. Que escuta ativamente, faz perguntas para desvendar seus gostos únicos, compreende a sua rotina diária e aquilo que você mais almeja viver no novo destino. Uma agência de qualidade e com alma não empurra opções prontas; ela orienta de verdade, propõe os devidos ajustes, explica com paciência tudo o que for necessário e mantém a comunicação cristalina. Quando percebemos essa transparência mútua e o nível de zelo, a confiança se constrói naturalmente.

Outro pilar essencial é a estrutura de suporte oferecida. Muitas pessoas que fazem pesquisas de pacotes na internet ficam apreensivas com o que poderá acontecer diante de alterações de voos, atrasos operacionais das companhias aéreas, ou intercorrências no check-in dos hotéis. O diferencial substancial de contar com uma boa agência de viagens reside precisamente aí: você não tem que se desgastar tentando resolver nada sozinho. Existe um especialista prestativo pronto para atuar em seu benefício, poupando-o de preocupações desagradáveis.

A bagagem prática aplicada ajuda a prevenir falhas que muitas vezes os viajantes comuns nem sequer suspeitavam que pudessem ocorrer, poupando tempo valioso e estresse. Além disso, as histórias e avaliações reais de clientes anteriores são sempre o melhor termômetro de prestação de serviços: busque agências que possuam depoimentos genuínos de satisfação e cuidado.

No fim das contas, decidir pela agência perfeita consiste em ter a deliciosa sensação de saber que há pessoas de verdade, dedicadas e com expertise do outro lado cuidando de cada detalhe com extremo entusiasmo e agilidade.

E é exatamente por preencher cada um desses requisitos que a Arcadane se destaca como a escolha ideal para quem quer viajar com alta tranquilidade, com as melhores tarifas e com a assessoria premium que você e sua família merecem. Aqui na Arcadane, nós entregamos paixão de planejar, curadoria refinada de experiências exclusivas e uma presença ativa que te acompanha do início ao fim do trajeto. Porque viajar com estilo e bem-estar é bom demais, e nós existimos para garantir que você somente se concentre no que mais importa: usufruir de cada belo instante.`
  },
  {
    id: '3',
    title: 'Destination Wedding: viver o amor em um cenário que conta a sua história',
    excerpt: 'Transforme o seu casamento e a sua lua de mel em uma experiência épica e inesquecível de viagem, integrando a recepção de convidados com todo o conforto de alta hotelaria.',
    category: 'Lua de Mel',
    date: '02 de Junho, 2026',
    readTime: '5 min de leitura',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    content: `Casar já é, por si só, um lindo e emocionante sonho planejado com todo o calor do coração. Mas alguns casais desejam algo além das cerimônias tradicionais de salões fechados de suas cidades de origem: eles anseiam por paisagens marcantes, uma brisa inesquecível e cenários que eternizem sua história de amor com total dramaticidade romântica. É a partir desse desejo de inovação e exclusividade que surge a fantástica tendência do Destination Wedding: a oportunidade perfeita de unificar viagem de luxo, celebração matrimonial e momentos de extrema alegria com as pessoas mais queridas de suas vidas em um ambiente paradisíaco.

Muitas noivas e noivos cresceram imaginando como seria esse dia extraordinário do casamento. Uns vislumbram o pôr do sol inesquecível sobre o mar beijando as falésias, outros querem o charme de vinícolas tradicionais aconchegantes na Europa ou no sul do Brasil, e outros almejam reunir seus familiares mais íntimos em um hotel de refinamento clássico ou na praia reservada. Seja qual for o conceito ou a preferência estética, um requisito se mantém unânime: toda a viagem e o evento devem fluir com leveza perfeita, maestria de agendamentos e ausência total de perrengues logísticos.

Contudo, ao optar por celebrar fora da cidade de origem, surgem indagações naturais que podem gerar insegurança no casal:
- Como organizar a emissão e a coordenação de passagens e transfers para dezenas ou centenas de convidados vindos de diferentes cidades e estados?
- Como assegurar que todos os hóspedes tenham acomodações de excelência garantidas combinadas às tarifas de grupo?
- E se algum convidado enfrentar cancelamentos inesperados de voos a poucas horas do evento?
- Como gerenciar as demandas específicas do buffet e decoração integrando tudo à agenda oficial da viagem?

É para responder a todas essas demandas vitais e resguardar os sentimentos dos casais que a nossa assessoria técnica de ponta atua.

Planejar um sofisticado Destination Wedding requer muito mais do que sugerir lugares bonitos na internet. Trata-se de coordenar as agendas individuais, organizar hospedagens na praia de maneira harmoniosa, providenciar seguros obrigatórios para a comitiva, conduzir as etapas burocráticas de transporte e se antecipar a qualquer oscilação de planos das operadoras de serviços locais. Essa entrega completa permite aos noivos desfrutarem única e exclusivamente das fases agradáveis e mágicas dos preparativos: o romance, a cumplicidade mútua, os brindes e a grande contagem regressiva para a data.

Na Arcadane Viagens, compreendemos profundamente a sacralidade desse momento. Atuamos em total sincronia com cerimonialistas de casamentos renomados, encarregando-nos de todo o respaldo técnico-operacional necessário para que nenhuma preocupação tire a paz dos protagonistas. Desde o desenho inicial dos roteiros de viagens até o pós-evento, oferecemos um fluxo descomplicado focado na perfeição do atendimento.

Indicamos e personalizamos pacotes e reservas nos locais que convergem perfeitamente com a identidade do casal: sejam praias magníficas nacionais, resorts de luxo no Caribe, hotéis boutique icônicos e vinhedos refinados no Brasil ou em rotas europeias exclusivas. Nada é padronizado, tudo é feito sob medida.

E enquanto vocês vivenciam o grande enlace no altar, nossos consultores lideram com prontidão a logística de bastidores em silêncio: monitorando transfers, acolhendo familiares, esclarecendo dúvidas sobre documentações e dando pronto atendimento personalizado a eventuais atrasos de voos, para que os convidados digam em uníssono que foi a viagem mais fascinante e bem cuidada que já participaram.

Ao escolher emoldurar o seu amor em um destino espetacular, a leveza é um privilégio obrigatório de direito dos noivos. E a equipe Arcadane está aqui justamente para conferir essa elegância técnica e tranquilidade, ajudando-os a transformar o seu grande sim no início de uma inesquecível e luxuosa saga de bem-estar. Afinal, as maiores celebrações do afeto merecem cuidados à altura.`
  }
];
