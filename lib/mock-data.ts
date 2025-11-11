import type { Playlist, Movie, Book } from "@/types/Recommendation"
import type { CareerTip } from "@/types/Tip"

export const mockPlaylists: Playlist[] = [
  {
    id: "1",
    title: "Foco Intenso",
    description: "Música instrumental para máxima concentração no trabalho",
    genre: "Instrumental",
    image: "/focus-music-abstract.jpg",
    url: "#",
  },
  {
    id: "2",
    title: "Produtividade Criativa",
    description: "Sons ambiente e lo-fi para estimular a criatividade",
    genre: "Lo-fi",
    image: "/lofi-creative-workspace.jpg",
    url: "#",
  },
  {
    id: "3",
    title: "Energia Matinal",
    description: "Comece o dia com motivação e energia positiva",
    genre: "Upbeat",
    image: "/morning-energy-sunrise.jpg",
    url: "#",
  },
  {
    id: "4",
    title: "Deep Work",
    description: "Batidas suaves para trabalho profundo e sem distrações",
    genre: "Ambient",
    image: "/deep-work-minimal.jpg",
    url: "#",
  },
  {
    id: "5",
    title: "Coding Vibes",
    description: "Eletrônica e synthwave para programadores",
    genre: "Electronic",
    image: "/coding-neon-tech.jpg",
    url: "#",
  },
  {
    id: "6",
    title: "Pausa Relaxante",
    description: "Música calma para intervalos e descanso mental",
    genre: "Chill",
    image: "/relaxing-nature-calm.jpg",
    url: "#",
  },
]

export const mockMovies: Movie[] = [
  {
    id: "1",
    title: "Em Busca da Felicidade",
    description: "História inspiradora sobre superação e determinação profissional",
    genre: "Drama/Biografia",
    image: "/pursuit-of-happyness-movie.jpg",
    year: 2006,
  },
  {
    id: "2",
    title: "O Jogo da Imitação",
    description: "A fascinante história de Alan Turing e a computação",
    genre: "Biografia/Drama",
    image: "/imitation-game-movie.jpg",
    year: 2014,
  },
  {
    id: "3",
    title: "O Lobo de Wall Street",
    description: "Lições sobre ambição, ética e o mundo corporativo",
    genre: "Drama/Biografia",
    image: "/wolf-wallstreet-movie.jpg",
    year: 2013,
  },
  {
    id: "4",
    title: "Steve Jobs",
    description: "A jornada do visionário que revolucionou a tecnologia",
    genre: "Biografia/Drama",
    image: "/steve-jobs-movie.jpg",
    year: 2015,
  },
  {
    id: "5",
    title: "Moneyball",
    description: "Inovação e pensamento estratégico no esporte e negócios",
    genre: "Drama/Esporte",
    image: "/moneyball-movie.jpg",
    year: 2011,
  },
  {
    id: "6",
    title: "Rede Social",
    description: "A criação do Facebook e o empreendedorismo digital",
    genre: "Drama/Biografia",
    image: "/social-network-movie.jpg",
    year: 2010,
  },
]

export const mockBooks: Book[] = [
  {
    id: "1",
    title: "Mindset: A Nova Psicologia do Sucesso",
    author: "Carol Dweck",
    description: "Como desenvolver a mentalidade de crescimento para alcançar seus objetivos",
    category: "Desenvolvimento Pessoal",
    image: "/mindset-book-cover.png",
  },
  {
    id: "2",
    title: "Trabalho Focado",
    author: "Cal Newport",
    description: "Estratégias para ter sucesso em um mundo de distrações",
    category: "Produtividade",
    image: "/deep-work-book.png",
  },
  {
    id: "3",
    title: "Inteligência Emocional",
    author: "Daniel Goleman",
    description: "Por que a IE pode ser mais importante que o QI",
    category: "Soft Skills",
    image: "/emotional-intelligence-book.jpg",
  },
  {
    id: "4",
    title: "Os 7 Hábitos das Pessoas Altamente Eficazes",
    author: "Stephen Covey",
    description: "Princípios fundamentais para transformar sua vida profissional",
    category: "Liderança",
    image: "/7-habits-book.jpg",
  },
  {
    id: "5",
    title: "Código Limpo",
    author: "Robert Martin",
    description: "Habilidades práticas do Agile Software",
    category: "Tecnologia",
    image: "/clean-code-book.jpg",
  },
  {
    id: "6",
    title: "A Startup Enxuta",
    author: "Eric Ries",
    description: "Como empresas inovadoras usam inovação contínua",
    category: "Empreendedorismo",
    image: "/lean-startup-book.jpg",
  },
  {
    id: "7",
    title: "Pense e Enriqueça",
    author: "Napoleon Hill",
    description: "O clássico sobre sucesso e prosperidade",
    category: "Finanças",
    image: "/think-grow-rich-book.jpg",
  },
  {
    id: "8",
    title: "Como Fazer Amigos e Influenciar Pessoas",
    author: "Dale Carnegie",
    description: "O guia definitivo para relacionamentos profissionais",
    category: "Comunicação",
    image: "/placeholder.svg?height=400&width=300",
  },
]

export const mockCareerTips: CareerTip[] = [
  {
    id: "1",
    title: "Prepare-se para Entrevistas com a Técnica STAR",
    content:
      "Use o método STAR (Situação, Tarefa, Ação, Resultado) para estruturar suas respostas. Prepare 5-7 histórias que demonstrem suas competências principais.",
    category: "interview",
    icon: "🎯",
  },
  {
    id: "2",
    title: "Construa seu Portfólio Profissional",
    content:
      "Mantenha um portfólio atualizado com seus melhores projetos. Documente o processo, desafios enfrentados e resultados alcançados.",
    category: "skills",
    icon: "💼",
  },
  {
    id: "3",
    title: "Networking Autêntico",
    content:
      "Construa relacionamentos genuínos. Participe de eventos, contribua com valor antes de pedir favores, e mantenha contato regular.",
    category: "networking",
    icon: "🤝",
  },
  {
    id: "4",
    title: "Aprenda a Aprender",
    content:
      "Desenvolva habilidades de aprendizado contínuo. Dedique 30 minutos diários para estudar algo novo relacionado à sua área.",
    category: "skills",
    icon: "📚",
  },
  {
    id: "5",
    title: "Seu Primeiro Emprego: Mostre Atitude",
    content:
      "Compense a falta de experiência com entusiasmo, vontade de aprender e proatividade. Demonstre que você é um investimento de longo prazo.",
    category: "first-job",
    icon: "🌟",
  },
  {
    id: "6",
    title: "Pesquise a Empresa Antes da Entrevista",
    content:
      "Investigue a cultura, produtos, desafios recentes e concorrentes. Prepare perguntas inteligentes que demonstrem seu interesse genuíno.",
    category: "interview",
    icon: "🔍",
  },
  {
    id: "7",
    title: "Transição de Carreira: Transfira Suas Habilidades",
    content:
      "Identifique habilidades transferíveis da sua carreira atual. Comunique como sua experiência diversa é uma vantagem única.",
    category: "career-change",
    icon: "🔄",
  },
  {
    id: "8",
    title: "Desenvolva sua Marca Pessoal no LinkedIn",
    content:
      "Publique conteúdo relevante regularmente. Comente em posts da sua área e engaje com sua rede de forma consistente.",
    category: "networking",
    icon: "💡",
  },
  {
    id: "9",
    title: "Soft Skills São Essenciais",
    content:
      "Comunicação, trabalho em equipe e resolução de problemas são tão importantes quanto habilidades técnicas. Pratique-as conscientemente.",
    category: "skills",
    icon: "🎭",
  },
  {
    id: "10",
    title: "Negocie seu Salário com Confiança",
    content:
      "Pesquise valores de mercado, conheça seu valor, e pratique sua argumentação. Nunca aceite a primeira oferta sem negociar.",
    category: "interview",
    icon: "💰",
  },
  {
    id: "11",
    title: "Estágio: Trate como um Emprego Real",
    content:
      "Chegue cedo, entregue além do esperado, peça feedback constantemente. Muitos estágios se transformam em efetivações.",
    category: "first-job",
    icon: "🚀",
  },
  {
    id: "12",
    title: "Mudança de Carreira: Comece Devagar",
    content:
      "Não precisa mudar tudo de uma vez. Faça projetos paralelos, cursos ou voluntariado na nova área enquanto mantém sua estabilidade.",
    category: "career-change",
    icon: "🌱",
  },
]

export function getRandomRecommendations<T>(items: T[], count: number): T[] {
  const shuffled = [...items].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
