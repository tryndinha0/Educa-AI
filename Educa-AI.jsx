import React, { useState, useEffect, createContext, useContext, useRef } from 'react';

// Dados de exemplo (simulando um banco de dados ou API)
const mockUsers = {
    'aluno@uerj.com': {
        id: 'user123',
        name: 'Aluno Teste',
        email: 'aluno@uerj.com',
        role: 'student',
        password: '123', // Senha de teste
        progress: {
            'python-intro': { lastAccessedModule: 'module-1', lastAccessedLesson: 'lesson-1-video', progressPercentage: 60 }
        },
        enrolledCourses: ['python-intro', 'marketing-digital'],
        notifications: [{id: 1, text: "Bem-vindo ao curso de Python!", read: false}, {id: 2, text: "Novo quiz disponível! Para o Módulo 1 de Python.", read: false}] ,
        bio: 'Estudante dedicado com interesse em programação e análise de dados.',
        ranking: '567º',
        accumulatedPoints: 1500,
        completedCoursesCount: 2,
        solvedExercises: 10,
        resolvedForumTopics: 5,
        forumPosts: 3,
        certificates: [{id: 'cert-1', title: 'Introdução à Programação Front-End', issuedDate: '01/01/2025'}, {id: 'cert-2', title: 'Python: Do Excel à Análise de Dados', issuedDate: '15/03/2025'}],
        profilePictureUrl: 'https://placehold.co/128x128/4F46E5/FFFFFF?text=AT' // Imagem de perfil padrão
    },
    'instrutor@uerj.com': { id: 'instrutor456', name: 'Instrutor Exemplo', email: 'instrutor@uerj.com', role: 'instructor', password: '123', coursesTaught: [], notifications: [{id: 3, text: "Novo aluno inscrito no curso de Python.", read: false}], bio: 'Instrutor apaixonado por tecnologia e ensino.', ranking: '-', accumulatedPoints: 0, completedCoursesCount: 0, solvedExercises: 0, resolvedForumTopics: 0, forumPosts: 0, certificates: [], profilePictureUrl: 'https://placehold.co/128x128/8B5CF6/FFFFFF?text=IE' },
    'admin@uerj.com': { id: 'admin789', name: 'Admin Geral', email: 'admin@uerj.com', role: 'admin', password: '123', notifications: [{id: 5, text: "Relatório diário de sistema disponível.", read: false}] , profilePictureUrl: 'https://placehold.co/128x128/EC4899/FFFFFF?text=AG'},
    // Adicionado usuário padrão para testes
    'teste@uerj.com': { id: 'testuser', name: 'Usuário Teste', email: 'teste@uerj.com', role: 'student', password: '123', progress: {}, enrolledCourses: [], notifications: [{id: 4, text: "Bem-vindo, usuário teste!", read: false}] , profilePictureUrl: 'https://placehold.co/128x128/3B82F6/FFFFFF?text=UT'},
};


const mockCourses = [
    {
        id: 'python-intro',
        title: 'Introdução à Programação Python',
        description: 'Aprenda os fundamentos da programação com Python, uma linguagem versátil e poderosa, ideal para iniciantes.',
        duration: '40 horas',
        level: 'Iniciante',
        category: 'tecnologia',
        instructor: 'Prof. Ana Silva',
        imageUrl: 'https://placehold.co/400x200/4F46E5/FFFFFF?text=Python',
        syllabus: [
            'Módulo 1: Primeiros Passos em Python',
            'Módulo 2: Estruturas de Dados e Controle',
            'Módulo 3: Funções e Módulos',
            'Módulo 4: Programação Orientada a Objetos (POO)',
            'Módulo 5: Manipulação de Arquivos e Exceções'
        ],
        modules: [ // Estrutura de módulos para a página de módulo
            {
                id: 'module-1',
                title: 'Módulo 1: Primeiros Passos em Python',
                progress: 75, // Simulado
                lessons: [
                    { id: 'lesson-1-video', title: 'Aula 1: Instalação e Ambiente (Vídeo)', type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
                    { id: 'lesson-1-text', title: 'Texto: Variáveis e Tipos de Dados', type: 'text', content: 'Nesta lição, você aprenderá sobre variáveis e os tipos de dados básicos em Python, como inteiros, floats e strings. Compreender a natureza dos dados é fundamental para qualquer tarefa de programação. Variáveis são como contentores de armazenamento de dados.' },
                    { id: 'lesson-1-quiz', title: 'Quiz 1: Fundamentos Básicos', type: 'quiz', quizId: 'py-quiz1' },
                ]
            },
            {
                id: 'module-2',
                title: 'Módulo 2: Estruturas de Dados e eControle',
                progress: 20,
                lessons: [
                    { id: 'lesson-2-video', title: 'Aula 2: Listas e Tuplas (Vídeo)', type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
                    { id: 'lesson-2-text', title: 'Texto: Condicionais e Loops', type: 'text', content: 'Explora estruturas de controle de fluxo como `if`, `elif`, `else` e `for`, `while` para criar programas dinâmicos.' },
                ]
            }
        ],
        quizzes: [ // Quizzes a nível de curso, podem ser referenciados pelos módulos
            {
                id: 'py-quiz1',
                title: 'Quiz: Fundamentos de Python',
                questions: [
                    { id: 1, text: 'Qual palavra-chave é usada para definir uma função em Python?', options: ['func', 'define', 'def', 'function'], answer: 'def' },
                    { id: 2, text: 'Qual é o tipo de dado para números inteiros em Python?', options: ['float', 'str', 'int', 'bool'], answer: 'int' },
                ]
            }
        ],
        media: [] // Mídia geral do curso, além da mídia por módulo
    },
    {
        id: 'marketing-digital',
        title: 'Marketing Digital Essencial',
        description: 'Domine as estratégias de marketing online para impulsionar sua carreira ou negócio, cobrindo SEO, mídias sociais e e-mail marketing.',
        duration: '30 horas',
        level: 'Intermediário',
        category: 'negocios',
        instructor: 'Esp. Carlos Santos',
        imageUrl: 'https://placehold.co/400x200/8B5CF6/FFFFFF?text=Marketing',
        syllabus: [
            'Módulo 1: Introdução ao Marketing Digital',
            'Módulo 2: SEO e Marketing de Conteúdo',
            'Módulo 3: Mídias Sociais e Publicidade Online',
            'Módulo 4: E-mail Marketing e Automação',
            'Módulo 5: Análise de Dados e Métricas'
        ],
        modules: [
            { id: 'mod-mkt-1', title: 'Módulo 1: Introdução ao Marketing', progress: 50, lessons: [] },
            { id: 'mod-mkt-2', title: 'Módulo 2: SEO e Conteúdo', progress: 10, lessons: [] },
        ],
        quizzes: [],
        media: []
    },
    {
        id: 'ux-ui-design',
        title: 'Fundamentos de Design UX/UI',
        description: 'Crie interfaces intuitivas e experiências de usuário incríveis com este curso abrangente, desde a pesquisa até o protótipo.',
        duration: '60 horas',
        level: 'Avançado',
        category: 'artes',
        instructor: 'Des. Maria Oliveira',
        imageUrl: 'https://placehold.co/400x200/EC4899/FFFFFF?text=UX/UI',
        syllabus: [
            'Módulo 1: Introdução ao UX/UI',
            'Módulo 2: Pesquisa de Usuário e Personas',
            'Módulo 3: Arquitetura da Informação e Wireframes',
            'Módulo 4: Design de Interface e Prototipagem',
            'Módulo 5: Testes de Usabilidade e Iteração'
        ],
        quizzes: [],
        media: []
    }
];

const mockNews = [
    { id: 'news-1', title: 'Novos Cursos de IA Disponíveis!', date: '01/06/2025', content: 'Explore nossa nova trilha de aprendizado em Inteligência Artificial, com cursos desde o básico ao avançado.' },
    { id: 'news-2', title: 'Manutenção Programada da Plataforma', date: '25/05/2025', content: 'A plataforma passará por uma breve manutenção no dia 10 de junho, das 2h às 4h da manhã. Agradecemos a compreensão.' },
    { id: 'news-3', title: 'Webinar Gratuito: O Futuro da Educação Online', date: '20/05/2025', content: 'Participe do nosso webinar exclusivo no dia 15 de junho e descubra as tendências da educação online.' },
];

// Contexto de Autenticação para gerenciar o estado do usuário
const AuthContext = createContext(null);

// Componente Provedor de Autenticação
const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simula a verificação de autenticação ao carregar a página
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Usa a senha definida no mockUsers
        if (mockUsers[email] && mockUsers[email].password === password) {
            const user = mockUsers[email];
            setCurrentUser(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
            return { success: true, user };
        } else {
            return { success: false, message: 'Email ou senha inválidos.' };
        }
    };

    const register = (name, email, password) => {
        // Simulação de registro
        if (mockUsers[email]) {
            return { success: false, message: 'Email já cadastrado.' };
        }
        if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
            return { success: false, message: 'A senha deve ter no mínimo 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais.' };
        }

        const newUser = { id: `user${Date.now()}`, name, email, role: 'student', progress: {}, enrolledCourses: [], notifications: [], bio: '', ranking: '-', accumulatedPoints: 0, completedCoursesCount: 0, solvedExercises: 0, resolvedForumTopics: 0, forumPosts: 0, certificates: [], profilePictureUrl: `https://placehold.co/128x128/CCCCCC/000000?text=${name.charAt(0).toUpperCase()}` };
        mockUsers[email] = newUser; // Adiciona ao mock de usuários
        setCurrentUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        return { success: true, user: newUser };
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    };

    const value = { currentUser, loading, login, register, logout };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Componente de Navegação
const Navbar = ({ navigate }) => {
    const { currentUser, logout } = useContext(AuthContext);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false); // Novo estado para o dropdown do perfil
    const notificationRef = useRef(null);
    const profileRef = useRef(null); // Ref para o container do perfil

    const getDashboardPath = (user) => {
        if (!user) return 'home';
        switch (user.role) {
            case 'admin': return 'admin-dashboard';
            case 'instructor': return 'instructor-dashboard';
            case 'student': return 'student-dashboard';
            default: return 'home';
        }
    };

    // Filtra as notificações para contar apenas as não lidas
    const unreadCount = currentUser ? currentUser.notifications.filter(n => !n.read).length : 0;

    const toggleNotifications = () => {
        setShowNotifications(prev => !prev);
        if (currentUser && unreadCount > 0) {
            const updatedNotifications = currentUser.notifications.map(n => ({...n, read: true}));
            mockUsers[currentUser.email].notifications = updatedNotifications;
            localStorage.setItem('currentUser', JSON.stringify({...currentUser, notifications: updatedNotifications}));
        }
        setShowProfileDropdown(false); // Fecha o dropdown do perfil se as notificações forem abertas
    };

    const toggleProfileDropdown = () => {
        setShowProfileDropdown(prev => !prev);
        setShowNotifications(false); // Fechar o dropdown de notificações se o perfil for aberto
    };


    // Fechar dropdowns ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg p-4 md:p-6">
            <nav className="container mx-auto flex justify-between items-center">
                {/* Nome da aplicação atualizado para "Educa AI" */}
                <button onClick={() => navigate(currentUser ? getDashboardPath(currentUser) : 'home')} className="text-white text-3xl font-bold rounded-lg p-2 hover:bg-white hover:text-blue-600 transition duration-300">Educa AI</button>
                <div className="hidden md:flex space-x-6 items-center">
                    <button onClick={() => navigate(currentUser ? getDashboardPath(currentUser) : 'home')} className="text-white text-lg font-medium hover:underline hover:text-gray-200 rounded-lg p-2 transition duration-300">Início</button>
                    <button onClick={() => navigate('courses')} className="text-white text-lg font-medium hover:underline hover:text-gray-200 rounded-lg p-2 transition duration-300">Cursos</button>
                    {/* Botão renomeado para "Claudos IA" */}
                    <button onClick={() => navigate('ai-chat')} className="text-white text-lg font-medium hover:underline hover:text-gray-200 rounded-lg p-2 transition duration-300">Claudos IA</button>
                    <button onClick={() => navigate('forum')} className="text-white text-lg font-medium hover:underline hover:text-gray-200 rounded-lg p-2 transition duration-300">Fórum</button>
                    {currentUser ? (
                        <>
                            {/* Ícone de mensagens */}
                            <button onClick={() => navigate('messages')} className="text-white relative p-2 rounded-full hover:bg-white hover:text-blue-600 transition duration-300">
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V8h12v3z"></path>
                                </svg>
                            </button>
                            {/* Ícone de sino para notificações */}
                            <div className="relative" ref={notificationRef}>
                                <button onClick={toggleNotifications} className="text-white relative p-2 rounded-full hover:bg-white hover:text-blue-600 transition duration-300">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 4.36 6 6.93 6 11v5l-2 2v1h16v-1l-2-2z"></path>
                                    </svg>
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{unreadCount}</span>
                                    )}
                                </button>
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl py-2 z-10">
                                        <h3 className="font-bold text-gray-800 px-4 py-2 border-b border-gray-200">Notificações</h3>
                                        {currentUser.notifications.length > 0 ? (
                                            currentUser.notifications.map(notification => (
                                                <div key={notification.id} className={`px-4 py-2 text-sm text-gray-700 ${!notification.read ? 'bg-blue-50 font-semibold' : ''} hover:bg-gray-100`}>
                                                    {notification.text}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-sm text-gray-500">Nenhuma notificação nova.</div>
                                        )}
                                        <button onClick={() => setShowNotifications(false)} className="w-full text-center text-blue-600 hover:underline py-2 text-sm">Fechar</button>
                                    </div>
                                )}
                            </div>
                            {/* Ícone de perfil (círculo) com dropdown */}
                            <div className="relative" ref={profileRef}>
                                <button onClick={toggleProfileDropdown} className="text-white relative p-2 rounded-full hover:bg-white hover:text-blue-600 transition duration-300">
                                    <img src={currentUser.profilePictureUrl || `https://placehold.co/128x128/4F46E5/FFFFFF?text=${currentUser.name.charAt(0).toUpperCase()}`} alt="Avatar do Utilizador" className="w-8 h-8 rounded-full object-cover"/>
                                </button>
                                {showProfileDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-10">
                                        <button onClick={() => { navigate('profile-settings'); setShowProfileDropdown(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Seu Perfil</button>
                                        <button onClick={() => { logout(); setShowProfileDropdown(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Sair</button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <button onClick={() => navigate('auth')} className="bg-white text-blue-600 font-bold py-2 px-5 rounded-full shadow-md hover:bg-blue-100 transition duration-300">Entrar / Registar</button>
                    )}
                </div>
                {/* Botão de menu hambúrguer para dispositivos móveis (funcionalidade JS não implementada neste exemplo) */}
                <button className="md:hidden text-white focus:outline-none" aria-label="Abrir Menu">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </nav>
        </header>
    );
};

// Componente de Rodapé
const Footer = ({ navigate }) => {
    return (
        <footer className="bg-gray-800 text-white p-6 text-center rounded-t-2xl shadow-inner mt-8">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <p>© 2025 Educa AI. Todos os direitos reservados.</p> {/* Nome atualizado aqui */}
                <div className="flex space-x-4 mt-4 md:mt-0">
                    <button onClick={() => navigate('about')} className="text-white text-lg font-medium hover:underline hover:text-gray-200 rounded-lg p-2 transition duration-300">Sobre</button>
                    <button onClick={() => navigate('contact')} className="text-white text-lg font-medium hover:underline hover:text-gray-200 rounded-lg p-2 transition duration-300">Contato</button>
                    <button onClick={() => navigate('donate')} className="text-white text-lg font-medium hover:underline hover:text-gray-200 rounded-lg p-2 transition duration-300">Doação</button>
                </div>
            </div>
        </footer>
    );
};

// Páginas
const HomePage = ({ navigate }) => {
    return (
        <div className="container mx-auto py-12 px-4 md:py-24">
            <section className="text-center bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200">
                <h1 className="text-4xl md:text-6xl font-extrabold text-blue-800 mb-6 leading-tight">
                    Transforme o Seu Futuro com a <span className="text-purple-700">Educação de Qualidade</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                    A sua plataforma de ensino online completa, oferecendo cursos interativos, aprendizagem personalizada com IA e um ambiente que impulsiona o seu sucesso académico.
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <button onClick={() => navigate('courses')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
                        Explorar Cursos
                    </button>
                    <button onClick={() => navigate('auth')} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
                        Registar Agora
                    </button>
                </div>
            </section>

            <section className="py-16 px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-10">Os Nossos Recursos Exclusivos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Cartões de Recurso */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center text-center">
                        <svg className="w-16 h-16 text-blue-500 mb-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Cursos Interativos e Multimédia</h3>
                        <p className="text-gray-600">Aceda a vídeos, textos com anotações e quizzes interativos para uma experiência de aprendizagem rica e flexível.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center text-center">
                        <svg className="w-16 h-16 text-purple-500 mb-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 21h.01M6 17h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Aprendizagem Personalizada com IA</h3>
                        <p className="text-gray-600">Receba planos de estudo, correção de questões e recomendações de cursos adaptadas ao seu perfil.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center text-center">
                        <svg className="w-16 h-16 text-green-500 mb-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Acompanhamento de Progresso Detalhado</h3>
                        <p className="text-gray-600">Monitorize automaticamente o seu desempenho, módulos concluídos e pontuações em quizzes.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center text-center">
                        <svg className="w-16 h-16 text-red-500 mb-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.007 12.007 0 002.944 12c0 2.87.675 5.602 1.93 8.016A11.955 11.955 0 0112 21.056c2.87 0 5.602-.675 8.016-1.93A11.955 11.955 0 0021.056 12c0-2.87-.675-5.602-1.93-8.016z"></path>
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Geração de Certificados Personalizados</h3>
                        <p className="text-gray-600">Comprove as suas novas habilidades com certificados de conclusão em formato PDF.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center text-center">
                        <svg className="w-16 h-16 text-yellow-500 mb-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.105A9.702 9.702 0 015 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Fóruns de Discussão e Colaboração</h3>
                        <p className="text-gray-600">Interaja com colegas e instrutores, tire dúvidas e promova um ambiente de colaboração.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center text-center">
                        <svg className="w-16 h-16 text-pink-500 mb-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Notificações e Suporte Eficiente</h3>
                        <p className="text-gray-600">Receba atualizações de progresso e tenha acesso a um chatbot para tirar as suas dúvidas.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

const CoursesPage = ({ navigate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [levelFilter, setLevelFilter] = useState('');

    const filteredCourses = mockCourses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === '' || course.category.toLowerCase() === categoryFilter.toLowerCase();
        const matchesLevel = levelFilter === '' || course.level.toLowerCase() === levelFilter.toLowerCase();
        return matchesSearch && matchesCategory && matchesLevel;
    });

    return (
        <div className="container mx-auto py-12 px-4 md:py-16">
            <section className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-200">
                <h1 className="text-3xl md:text-5xl font-extrabold text-blue-800 mb-8 text-center">Os Nossos Cursos</h1>
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0 md:space-x-4">
                    <input
                        type="text"
                        placeholder="Procurar cursos..."
                        className="p-3 border border-gray-300 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="p-3 border border-gray-300 rounded-lg w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">Todas as Categorias</option>
                        <option value="tecnologia">Tecnologia</option>
                        <option value="saude">Saúde</option>
                        <option value="artes">Artes</option>
                        <option value="negocios">Negócios</option>
                    </select>
                    <select
                        className="p-3 border border-gray-300 rounded-lg w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value)}
                    >
                        <option value="">Todos os Níveis</option>
                        <option value="iniciante">Iniciante</option>
                        <option value="intermediario">Intermediário</option>
                        <option value="avancado">Avançado</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map(course => (
                            <div key={course.id} className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200 flex flex-col justify-between">
                                <div>
                                    <img src={course.imageUrl} alt={`Image of ${course.title}`} className="rounded-lg mb-4 w-full h-40 object-cover"/>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h3>
                                    <p className="text-gray-700 mb-4">{course.description}</p>
                                    <div className="flex items-center text-gray-600 mb-2">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        <span>Duração: {course.duration}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 mb-4">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c1.333 0 2.667.5 3.5 1.5M12 16c-1.333 0-2.667-.5-3.5-1.5M12 21c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"></path></svg>
                                        <span>Nível: {course.level}</span>
                                    </div>
                                </div>
                                {/* O botão "Ver Detalhes" para TODOS os cursos agora leva para CourseDetailPage */}
                                <button onClick={() => navigate('course-detail', { courseId: course.id })} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md text-center transform hover:scale-105 transition duration-300 ease-in-out">Ver Detalhes</button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600 col-span-full">Nenhum curso encontrado com os critérios de procura.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

const CourseDetailPage = ({ navigate, courseId }) => {
    const { currentUser } = useContext(AuthContext);
    const course = mockCourses.find(c => c.id === courseId);
    const [currentTab, setCurrentTab] = useState('syllabus'); // 'syllabus', 'media', 'quiz', 'comments'

    if (!course) {
        return (
            <div className="container mx-auto py-12 px-4 md:py-16">
                <section className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200 text-center">
                    <h1 className="text-3xl font-extrabold text-red-600 mb-4">Curso Não Encontrado</h1>
                    <p className="text-lg text-gray-700 mb-6">O curso que está a procurar não foi encontrado. Por favor, verifique o URL ou volte à <button onClick={() => navigate('courses')} className="text-blue-600 hover:underline">página de cursos</button>.</p>
                </section>
            </div>
        );
    }

    const handleEnroll = () => {
        // Simulação de inscrição em curso
        if (!currentUser) {
            // Replaced alert with state-controlled message
            alert('Precisa de estar autenticado para se inscrever num curso.');
            navigate('auth');
            return;
        }
        // Added optional chaining for enrolledCourses
        if (currentUser.enrolledCourses?.includes(course.id)) {
            // Replaced alert with state-controlled message
            alert('Já está inscrito neste curso.');
            return;
        }
        currentUser.enrolledCourses.push(course.id);
        // Replaced alert with state-controlled message
        alert(`Inscreveu-se no curso "${course.title}" com sucesso!`);
        // Numa aplicação real, isto seria guardado no backend
    };

    return (
        <div className="container mx-auto py-12 px-4 md:py-16">
            <section className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-2/3">
                        <img src={course.imageUrl} alt={`Image of ${course.title}`} className="rounded-xl shadow-lg mb-6 w-full h-auto object-cover"/>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4">{course.title}</h1>
                        <p className="text-xl text-gray-700 mb-6">{course.description}</p>

                        <div className="flex border-b border-gray-200 mb-6">
                            <button
                                className={`px-4 py-2 font-semibold text-lg ${currentTab === 'syllabus' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setCurrentTab('syllabus')}
                            >
                                Ementa
                            </button>
                            <button
                                className={`ml-4 px-4 py-2 font-semibold text-lg ${currentTab === 'media' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setCurrentTab('media')}
                            >
                                Conteúdo Multimédia
                            </button>
                            {course.quizzes?.length > 0 && (
                                <button
                                    className={`ml-4 px-4 py-2 font-semibold text-lg ${currentTab === 'quiz' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => setCurrentTab('quiz')}
                                >
                                    Quizzes
                                </button>
                            )}
                            <button
                                className={`ml-4 px-4 py-2 font-semibold text-lg ${currentTab === 'comments' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setCurrentTab('comments')}
                            >
                                Comentários
                            </button>
                        </div>

                        {currentTab === 'syllabus' && (
                            <>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ementa do Curso</h2>
                                <ul className="list-disc list-inside text-lg text-gray-600 space-y-2 mb-6">
                                    {course.syllabus?.map((item, index) => (
                                        <li key={index}>
                                            {item}
                                            {/* Condição para o link do Módulo 1 de Python */}
                                            {course.id === 'python-intro' && item.includes('Módulo 1: Primeiros Passos em Python') && (
                                                <button
                                                    onClick={() => navigate('course-module', { courseId: course.id, moduleId: 'module-1' })}
                                                    className="ml-4 text-blue-600 hover:underline text-sm"
                                                >
                                                    Aceder Módulo
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Pré-requisitos</h2>
                                <p className="text-lg text-gray-600 mb-6">{course.prerequisites}</p>
                            </>
                        )}

                        {currentTab === 'media' && (
                            <div>
                                {course.media?.length > 0 ? (
                                    course.media.map((item, index) => (
                                        <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                                            {item.type === 'video' && (
                                                <div className="aspect-w-16 aspect-h-9">
                                                    <iframe
                                                        className="w-full h-96 rounded-lg"
                                                        src={item.url}
                                                        title={item.title}
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                            )}
                                            {item.type === 'text' && (
                                                <p className="text-gray-700">{item.content}</p>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-600">Nenhum conteúdo multimédia disponível para este curso.</p>
                                )}
                            </div>
                        )}

                        {currentTab === 'quiz' && course.quizzes?.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Quizzes do Curso</h2>
                                {course.quizzes.map(quiz => (
                                    <div key={quiz.id} className="mb-6 p-4 border rounded-lg bg-gray-50">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{quiz.title}</h3>
                                        {quiz.questions.map(q => (
                                            <div key={q.id} className="mb-4">
                                                <p className="font-medium text-gray-800 mb-2">{q.text}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {q.options.map(option => (
                                                        <button key={option} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition duration-200">
                                                            {option}
                                                        </button>
                                                    ))}
                                                </div>
                                                <p className="text-sm text-gray-500 mt-2">Resposta correta: {q.answer} (Simulação)</p>
                                            </div>
                                        ))}
                                        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full shadow-md mt-4">Fazer Quiz (Simulado)</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {currentTab === 'comments' && (
                            <div className="p-4 border rounded-lg bg-gray-50">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Comentários do Curso</h2>
                                <p className="text-gray-700 mb-4">Deixe o seu comentário sobre este módulo ou faça uma pergunta específica!</p>
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                                    rows="4"
                                    placeholder="Escreva o seu comentário aqui..."
                                ></textarea>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-md">Publicar Comentário (Simulado)</button>
                                <div className="mt-6 border-t border-gray-200 pt-4">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Comentários Recentes</h3>
                                    <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
                                        <p className="font-bold text-gray-900">Ótimo conteúdo!</p>
                                        <p className="text-gray-700 text-sm">"Adorei a explicação do Módulo 1, muito clara e objetiva." - Aluno Exemplo</p>
                                        <p className="text-gray-500 text-xs mt-1">5 de Junho, 2025</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                        <p className="font-bold text-gray-900">Dúvida sobre o exercício</p>
                                        <p className="text-700 text-sm">"Não consegui resolver o exercício 3 do Módulo 2. Alguma dica?" - Aluno Teste</p>
                                        <p className="text-gray-500 text-xs mt-1">5 de Junho, 2025</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <button onClick={handleEnroll} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out mt-8">
                            {currentUser?.enrolledCourses?.includes(course.id) ? 'Já Inscrito' : 'Inscrever-se Agora'}
                        </button>
                    </div>
                    <div className="md:w-1/3 bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Detalhes Rápidos</h2>
                        <p className="text-lg text-gray-700 mb-3"><strong className="text-blue-700">Instrutor:</strong> {course.instructor}</p>
                        <p className="text-lg text-gray-700 mb-3"><strong className="text-blue-700">Duração:</strong> {course.duration}</p>
                        <p className="text-lg text-gray-700 mb-3"><strong className="text-blue-700">Nível:</strong> {course.level}</p>
                        <p className="text-lg text-gray-700 mb-3"><strong className="text-blue-700">Categoria:</strong> {course.category}</p>
                        {/* Simulação de um mini-perfil do instrutor */}
                        <div className="mt-6 pt-4 border-t border-gray-300">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Sobre o Instrutor</h3>
                            <div className="flex items-center mb-4">
                                <img src="https://placehold.co/60x60/d1d5db/4b5563?text=Prof" alt="Foto do Instrutor" className="rounded-full mr-4"/>
                                <div>
                                    <p className="font-semibold text-gray-900">{course.instructor}</p>
                                    <p className="text-sm text-gray-600">Especialista em {course.category}</p>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm">
                                {course.instructor} é um profissional com vasta experiência na área de {course.category}, dedicado a compartilhar o seu conhecimento e paixão com os alunos.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const AboutPage = () => {
    return (
        <div className="container mx-auto py-12 px-4 md:py-16">
            <section className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200 text-center">
                <h1 className="text-3xl md:text-5xl font-extrabold text-blue-800 mb-6">Sobre a Educa AI</h1> {/* Nome atualizado aqui */}
                <p className="text-lg md:text-xl text-gray-700 mb-6 max-w-4xl mx-auto">
                    A Educa AI é uma plataforma de ensino online abrangente, dedicada a oferecer cursos interativos e personalizados. O nosso objetivo é transformar o futuro dos nossos alunos, promovendo uma educação de qualidade e acessível.
                </p>
                <p className="text-md md:text-lg text-gray-600 mb-6 max-w-4xl mx-auto">
                    Com a integração de inteligência artificial, procuramos otimizar a experiência de aprendizagem, oferecendo planos de estudo adaptados, correção inteligente de questões e recomendações de cursos personalizadas. Acreditamos que a tecnologia, aliada a um conteúdo didático bem estruturado, pode fazer a diferença na jornada educacional de cada indivíduo.
                </p>
                <p className="text-md md:text-lg text-gray-600 max-w-4xl mx-auto">
                    A nossa equipa é composta por profissionais apaixonados por educação e tecnologia, comprometidos em construir um ambiente de aprendizagem seguro, escalável e inovador. Junte-se a nós e descubra um novo mundo de possibilidades!
                </p>
            </section>
        </div>
    );
};

const ContactPage = () => {
    const [statusMessage, setStatusMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatusMessage('A sua mensagem foi enviada com sucesso! Em breve entraremos em contacto.');
        // Numa aplicação real, aqui haveria uma chamada de API para enviar o formulário.
        setTimeout(() => setStatusMessage(''), 5000); // Limpa a mensagem após 5 segundos
    };

    return (
        <div className="container mx-auto py-12 px-4 md:py-16">
            <section className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200 text-center">
                <h1 className="text-3xl md:text-5xl font-extrabold text-blue-800 mb-8 text-center">Contacte-nos</h1>
                <div className="max-w-xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">Nome Completo</label>
                            <input type="text" id="name" name="name" className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="O seu nome completo" required/>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">Email</label>
                            <input type="email" id="email" name="email" className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="o_seu_email@exemplo.com" required/>
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-lg font-medium text-gray-700 mb-2">Assunto</label>
                            <input type="text" id="subject" name="subject" className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Assunto da mensagem" required/>
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-lg font-medium text-gray-700 mb-2">Mensagem</label>
                            <textarea id="message" name="message" rows="6" className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="A sua mensagem..." required></textarea>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
                            Enviar Mensagem
                        </button>
                        {statusMessage && (
                            <p className="text-center text-green-600 mt-4">{statusMessage}</p>
                        )}
                    </form>
                </div>
            </section>
        </div>
    );
};

const AuthPage = ({ navigate }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [message, setMessage] = useState('');
    const { login, register } = useContext(AuthContext);

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (isLogin) {
            const result = await login(email, password);
            if (result.success) {
                setMessage('Autenticação realizada com sucesso!');
                // Redireciona para o dashboard correto baseado na função do usuário
                navigate(result.user.role === 'admin' ? 'admin-dashboard' : result.user.role === 'instructor' ? 'instructor-dashboard' : 'student-dashboard');
            } else {
                setMessage(result.message);
            }
        } else {
            if (password.length < 3) { // Apenas uma validação simples para a demo
                setMessage('A senha deve ter no mínimo 3 caracteres para demo.');
                return;
            }
            if (password !== confirmPassword) {
                setMessage('As palavras-passe não coincidem.');
                return;
            }
            if (!termsAccepted) {
                setMessage('Deve aceitar os Termos de Uso e Política de Privacidade.');
                return;
            }

            const result = await register(name, email, password);
            if (result.success) {
                setMessage('Registo realizado com sucesso! Pode agora aceder à sua conta.');
                navigate('student-dashboard'); // Redireciona para o painel do aluno após o registo
            } else {
                setMessage(result.message);
            }
        }
    };

    return (
        <div className="container mx-auto py-12 px-4 md:py-16">
            <section className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200 text-center">
                <h1 className="text-3xl md:text-5xl font-extrabold text-blue-800 mb-8 text-center">Login</h1> {/* Alterado de "Aceder à Sua Conta" para "Login" */}
                <div className="max-w-md mx-auto">
                    {/* Exemplo de credenciais padrão */}
                    <div className="mb-4 p-3 bg-blue-100 border border-blue-200 rounded-lg text-sm text-blue-800 text-center">
                        Para testar, use: Email: `aluno@uerj.com`, Palavra-passe: `123`
                        <br/>
                        Para instrutor: Email: `instrutor@uerj.com`, Palavra-passe: `123`
                        <br/>
                        Para admin: Email: `admin@uerj.com`, Palavra-passe: `123`
                    </div>
                    <div className="flex justify-center mb-6">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`px-6 py-3 font-semibold text-lg border-b-2 ${isLogin ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-500'} rounded-t-lg focus:outline-none`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`px-6 py-3 font-semibold text-lg border-b-2 ${!isLogin ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-500'} rounded-t-lg focus:outline-none ml-4`}
                        >
                            Registar
                        </button>
                    </div>

                    <form onSubmit={handleAuthSubmit} className="space-y-6">
                        {!isLogin && (
                            <div>
                                <label htmlFor="registerName" className="block text-lg font-medium text-gray-700 mb-2">Nome Completo</label>
                                <input type="text" id="registerName" className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="O seu nome completo" value={name} onChange={(e) => setName(e.target.value)} required={!isLogin}/>
                            </div>
                        )}
                        <div>
                            <label htmlFor="authEmail" className="block text-lg font-medium text-gray-700 mb-2">Email</label>
                            <input type="email" id="authEmail" className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="o_seu_email@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        </div>
                        <div>
                            <label htmlFor="authPassword" className="block text-lg font-medium text-gray-700 mb-2">Palavra-passe</label>
                            <input type="password" id="authPassword" className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={isLogin ? "********" : "Crie uma palavra-passe forte (mín. 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 caractere especial)"} value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        </div>
                        {!isLogin && (
                            <>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700 mb-2">Confirmar Palavra-passe</label>
                                    <input type="password" id="confirmPassword" className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Confirme a sua palavra-passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required={!isLogin}/>
                                </div>
                                <div className="flex items-center">
                                    <input type="checkbox" id="terms" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} required={!isLogin}/>
                                    <label htmlFor="terms" className="ml-2 block text-md text-gray-900">
                                        Eu concordo com os <a href="#" className="text-blue-600 hover:underline">Termos de Uso</a> e <a href="#" className="text-blue-600 hover:underline">Política de Privacidade</a>.
                                    </label>
                                </div>
                            </>
                        )}
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
                            {isLogin ? 'Entrar' : 'Registar'}
                        </button>
                        {isLogin && (
                            <p className="text-center text-gray-600 mt-4">
                                <button onClick={() => alert('Recuperação de palavra-passe simulada. Uma ligação seria enviada para o seu email.')} className="text-blue-600 hover:underline">Esqueceu a sua palavra-passe?</button>
                            </p>
                        )}
                        {message && (
                            <p className="text-center mt-4 text-sm font-semibold" style={{ color: message.includes('sucesso') ? 'green' : 'red' }}>{message}</p>
                        )}
                    </form>
                </div>
            </section>
        </div>
    );
};

// Página de Configurações de Perfil (Visualização dos dados)
const ProfileSettingsPage = ({ navigate }) => {
    const { currentUser } = useContext(AuthContext);

    // Dados do usuário para as estatísticas
    const nameDisplay = currentUser?.name || '';
    const bioDisplay = currentUser?.bio || '';
    const profilePictureUrlDisplay = currentUser?.profilePictureUrl || '';
    const ranking = currentUser?.ranking || '-';
    const accumulatedPoints = currentUser?.accumulatedPoints || 0;
    const completedCoursesCount = currentUser?.completedCoursesCount || 0;
    const solvedExercises = currentUser?.solvedExercises || 0;
    const resolvedForumTopics = currentUser?.resolvedForumTopics || 0;
    const forumPosts = currentUser?.forumPosts || 0;
    const certificates = currentUser?.certificates || [];

    if (!currentUser) {
        return <div className="container mx-auto py-12 px-4 text-center text-red-500">Acesso negado. Por favor, autentique-se para ver o seu perfil.</div>;
    }

    return (
        <div className="container mx-auto py-12 px-4 md:py-16">
            <section className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200">
                <h1 className="text-3xl md:text-5xl font-extrabold text-blue-800 mb-8 text-center">Seu Perfil</h1>

                <div className="flex flex-col md:flex-row items-start md:space-x-8">
                    {/* Seção de Informações Principais do Perfil (Coluna Esquerda) */}
                    <div className="w-full md:w-1/3 flex flex-col items-center p-6 bg-gray-100 rounded-xl shadow-md border border-gray-200 mb-8 md:mb-0">
                        <div className="relative w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-white text-5xl font-bold mb-4 overflow-hidden">
                            {profilePictureUrlDisplay ? (
                                <img src={profilePictureUrlDisplay} alt="Foto de Perfil" className="w-full h-full object-cover" />
                            ) : (
                                nameDisplay ? nameDisplay.charAt(0).toUpperCase() : '?'
                            )}
                        </div>
                        <div className="flex items-center space-x-2 mb-2"> {/* Container para nome e engrenagem */}
                            <h2 className="text-3xl font-bold text-gray-900">{nameDisplay}</h2>
                            {/* Ícone de engrenagem para editar perfil */}
                            <button onClick={() => navigate('edit-profile')} className="p-2 rounded-full text-gray-700 hover:bg-gray-800 transition duration-300">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                            </button>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">{currentUser.email}</h3>

                        <div className="text-center text-gray-700 mb-4">
                            <h4 className="font-semibold mb-2">Biografia</h4>
                            <p className="text-sm italic mb-2">{bioDisplay || 'Seu perfil está um pouco vazio.'}</p>
                        </div>
                    </div>

                    {/* Seção de Estatísticas e Certificados (Coluna Direita) */}
                    <div className="w-full md:w-2/3 p-6 bg-gray-100 rounded-xl shadow-md border border-gray-200">
                        {/* Estatísticas de Progresso/Gamificação */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-center mb-8">
                            <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                                <p className="text-2xl font-bold text-blue-700">{ranking}</p>
                                <p className="text-sm text-gray-600">No ranking (últimos 30 dias)</p>
                            </div>
                            <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                                <p className="text-2xl font-bold text-blue-700">{accumulatedPoints}</p>
                                <p className="text-sm text-gray-600">Pontos Acumulados</p>
                            </div>
                            <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                                <p className="text-2xl font-bold text-blue-700">{completedCoursesCount}</p>
                                <p className="text-sm text-gray-600">Cursos Concluídos</p>
                            </div>
                            <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                                <p className="text-2xl font-bold text-blue-700">{solvedExercises}</p>
                                <p className="text-sm text-gray-600">Exercícios Resolvidos</p>
                            </div>
                            <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                                <p className="text-2xl font-bold text-blue-700">{resolvedForumTopics}</p>
                                <p className="text-sm text-gray-600">Tópicos Resolvidos no Fórum</p>
                            </div>
                            <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                                <p className="text-2xl font-bold text-blue-700">{forumPosts}</p>
                                <p className="text-sm text-gray-600">Publicações no Fórum</p>
                            </div>
                        </div>

                        {/* Certificados Concluídos */}
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Certificados Concluídos</h3>
                        {certificates.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {certificates.map(cert => (
                                    <div key={cert.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-3">
                                        <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.007 12.007 0 002.944 12c0 2.87.675 5.602 1.93 8.016A11.955 11.955 0 0112 21.056c2.87 0 5.602-.675 8.016-1.93A11.955 11.955 0 0021.056 12c0-2.87-.675-5.602-1.93-8.016z"></path>
                                        </svg>
                                        <div>
                                            <p className="font-semibold text-gray-900">{cert.title}</p>
                                            <p className="text-sm text-gray-600">Emitido: {cert.issuedDate}</p>
                                            <div className="flex space-x-2 mt-1">
                                                <button onClick={() => alert(`Certificado de "${cert.title}" visualizado.`)} className="text-blue-600 hover:underline text-xs">Ver Certificado</button>
                                                <button onClick={() => alert(`Certificado de "${cert.title}" adicionado ao LinkedIn.`)} className="text-blue-600 hover:underline text-xs">Adicionar ao LinkedIn</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-center">Nenhum certificado concluído ainda. Comece um curso hoje!</p>
                        )}
                        <p className="text-sm text-gray-600 mt-6 text-center">
                            Pode encontrar um certificado completo <button onClick={() => alert('Link para todos os certificados (simulado)')} className="text-blue-600 hover:underline">aqui</button>.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

// Nova Página para Edição de Perfil
const EditProfilePage = ({ navigate }) => {
    const { currentUser, login } = useContext(AuthContext); // Importar login para reautenticar se necessário
    const [name, setName] = useState(currentUser?.name || '');
    const [bio, setBio] = useState(currentUser?.bio || '');
    const [profilePictureUrl, setProfilePictureUrl] = useState(currentUser?.profilePictureUrl || '');
    const [statusMessage, setStatusMessage] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const handleSaveProfile = (e) => {
        e.preventDefault();
        if (currentUser) {
            currentUser.name = name;
            currentUser.bio = bio;
            currentUser.profilePictureUrl = profilePictureUrl; // Atualiza a URL da imagem no objeto currentUser
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            setStatusMessage('Perfil atualizado com sucesso!');
        } else {
            setStatusMessage('Erro: Nenhum utilizador autenticado.');
        }
        setTimeout(() => setStatusMessage(''), 3000);
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        // A senha de teste é '123'
        if (currentPassword === currentUser?.password && newPassword === confirmNewPassword && newPassword.length >= 3) { // Apenas uma validação simples para a demo
            // Em uma aplicação real, aqui haveria hash de senha e interação com o backend
            currentUser.password = newPassword; // Atualiza a senha no mock
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            setStatusMessage('Palavra-passe alterada com sucesso!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } else {
            setStatusMessage('Erro: Verifique a palavra-passe atual e a nova palavra-passe (mín. 3 caracteres para demo).');
        }
        setTimeout(() => setStatusMessage(''), 3000);
    };

    const handleUpdateProfilePicture = (e) => {
        e.preventDefault();
        if (currentUser && profilePictureUrl.startsWith('http')) { // Simples validação de URL
            currentUser.profilePictureUrl = profilePictureUrl;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            setStatusMessage('Foto de perfil atualizada com sucesso!');
        } else {
            setStatusMessage('Por favor, insira uma URL de imagem válida.');
        }
        setTimeout(() => setStatusMessage(''), 3000);
    };

    if (!currentUser) {
        return <div className="container mx-auto py-12 px-4 text-center text-red-500">Acesso negado. Por favor, autentique-se para editar o perfil.</div>;
    }

    return (
        <div className="container mx-auto py-12 px-4 md:py-16">
            <section className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200">
                <h1 className="text-3xl md:text-5xl font-extrabold text-blue-800 mb-8 text-center">Editar Seu Perfil</h1>
                <div className="max-w-2xl mx-auto space-y-8">
                    {/* Seção de Informações Básicas */}
                    <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações Básicas</h2>
                        <form onSubmit={handleSaveProfile} className="space-y-4">
                            <div>
                                <label htmlFor="editName" className="block text-lg font-medium text-gray-700 mb-2">Nome Completo</label>
                                <input type="text" id="editName" className="w-full p-3 border rounded-lg" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="editEmail" className="block text-lg font-medium text-gray-700 mb-2">Email</label>
                                <input type="email" id="editEmail" className="w-full p-3 border rounded-lg bg-gray-200" value={currentUser.email} disabled />
                                <p className="text-sm text-gray-500 mt-1">O email não pode ser alterado diretamente aqui.</p>
                            </div>
                            <div>
                                <label htmlFor="editBio" className="block text-lg font-medium text-gray-700 mb-2">Biografia</label>
                                <textarea id="editBio" className="w-full p-3 border rounded-lg" rows="4" value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
                            </div>
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg">Guardar Informações</button>
                        </form>
                    </div>

                    {/* Seção de Alterar Foto de Perfil */}
                    <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Alterar Foto de Perfil</h2>
                        <form onSubmit={handleUpdateProfilePicture} className="space-y-4">
                            <div className="flex flex-col items-center">
                                <img src={profilePictureUrl || `https://placehold.co/128x128/CCCCCC/000000?text=${currentUser.name.charAt(0).toUpperCase()}`} alt="Pré-visualização do Perfil" className="w-24 h-24 rounded-full object-cover mb-4"/>
                                <label htmlFor="profilePictureUrlInput" className="block text-lg font-medium text-gray-700 mb-2">URL da Nova Imagem</label>
                                <input type="text" id="profilePictureUrlInput" className="w-full p-3 border rounded-lg" placeholder="https://exemplo.com/sua_foto.jpg" value={profilePictureUrl} onChange={(e) => setProfilePictureUrl(e.target.value)} />
                            </div>
                            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full shadow-lg">Atualizar Foto</button>
                        </form>
                    </div>

                    {/* Seção de Alterar Palavra-passe */}
                    <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Alterar Palavra-passe</h2>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label htmlFor="currentPassword" className="block text-lg font-medium text-gray-700 mb-2">Palavra-passe Atual</label>
                                <input type="password" id="currentPassword" className="w-full p-3 border rounded-lg" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="newPassword" className="block text-lg font-medium text-gray-700 mb-2">Nova Palavra-passe</label>
                                <input type="password" id="newPassword" className="w-full p-2 border rounded-lg" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nova Palavra-passe:</label>
                                <input type="password" id="confirmNewPassword" className="w-full p-2 border rounded-lg" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                            </div>
                            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg">Alterar Palavra-passe</button>
                        </form>
                    </div>

                    {statusMessage && (
                        <p className="text-center mt-4 text-sm font-semibold" style={{ color: statusMessage.includes('sucesso') ? 'green' : 'red' }}>{statusMessage}</p>
                    )}
                </div>
            </section>
        </div>
    );
};


// Páginas de Dashboard - Simplificadas e Simuladas
const StudentDashboard = ({ navigate }) => {
    const { currentUser } = useContext(AuthContext);

    if (!currentUser || currentUser.role !== 'student') {
        return <div className="container mx-auto py-12 px-4 text-center text-red-500">Acesso negado. Por favor, autentique-se como aluno.</div>;
    }

    // Simulação de dados do aluno
    const completedCourses = currentUser.enrolledCourses.filter(course => mockCourses.find(c => c.id === course)).slice(0, 2); // Apenas alguns para demonstrar
    const pendingActivities = [
        { course: 'Introdução ao Python', activity: 'Quiz do Módulo 2' },
        { course: 'Marketing Digital Essencial', activity: 'Completar Aula 5' }
    ];
    // Notificações e Gamificação removidas desta seção, agora geridas em outros locais
    const recommendations = [
        { id: 'data-science-intro', title: 'Introdução à Ciência de Dados' },
        { id: 'web-dev-fullstack', title: 'Desenvolvimento Web Fullstack' }
    ];


    return (
        <div className="container mx-auto py-12 px-4 md:py-16">
            <section className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200">
                {/* Título "Painel do Aluno" removido */}
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Bem-vindo, {currentUser.name}!</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Notícias e Anúncios da Plataforma - em primeiro lugar */}
                    <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200 col-span-full">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Notícias e Anúncios da Plataforma</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            {mockNews.length > 0 ? (
                                mockNews.map(newsItem => (
                                    <li key={newsItem.id}>
                                        <p className="font-semibold text-gray-800">{newsItem.title} <span className="text-sm text-gray-500">- {newsItem.date}</span></p>
                                        <p className="text-sm text-gray-700">{newsItem.content}</p>
                                    </li>
                                ))
                            ) : (
                                <li>Nenhuma notícia ou anúncio disponível de momento.</li>
                            )}
                        </ul>
                    </div>

                    {/* O Meu Progresso */}
                    <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">O Meu Progresso</h3>
                        <p className="text-gray-700 mb-2">Cursos Concluídos: {completedCourses.length}</p>
                        <ul className="list-disc list-inside text-gray-600 mb-4">
                            {completedCourses.map(courseId => (
                                <li key={courseId}>{mockCourses.find(c => c.id === courseId)?.title}</li>
                            ))}
                        </ul>
                        <p className="text-gray-700 mb-2">Atividades Pendentes:</p>
                        <ul className="list-disc list-inside text-gray-600">
                            {pendingActivities.map((activity, index) => (
                                <li key={index}>{activity.activity} em {activity.course}</li>
                            ))}
                        </ul>
                        {/* Botão de certificado removido, agora há um botão para a última aula */}
                        <button onClick={() => alert('A redirecionar para a última aula/módulo/curso (simulado).')} className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full shadow-md">Voltar de onde parou</button>
                    </div>

                    {/* Recomendações Personalizadas */}
                    <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Recomendações para Si</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            {recommendations.map(rec => (
                                <li key={rec.id}><button onClick={() => navigate('course-detail', { courseId: rec.id })} className="text-blue-600 hover:underline">{rec.title}</button></li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
};

const InstructorDashboard = ({ navigate }) => {
    const { currentUser } = useContext(AuthContext);

    if (!currentUser || currentUser.role !== 'instructor') {
        return <div className="container mx-auto py-12 px-4 text-center text-red-500">Acesso negado. Por favor, autentique-se como instrutor.</div>;
    }

    const coursesTaught = mockCourses.filter(c => c.instructor === currentUser.name);
    const studentsEnrolled = 150; // Simulado
    const pendingQuestions = 5; // Simulado

    return (
        <div className="container mx-auto py-12 px-4 md:py-16">
            <section className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200">
                <h1 className="text-3xl md:text-5xl font-extrabold text-blue-800 mb-8 text-center">Painel do Instrutor</h1>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Bem-vindo, {currentUser.name}!</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Gestão de Cursos */}
                    <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Os Meus Cursos</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                            {coursesTaught.map(course => (
                                <li key={course.id}>
                                    <button onClick={() => navigate('course-detail', { courseId: course.id })} className="text-blue-600 hover:underline">{course.title}</button>
                                    <span className="ml-2 text-sm text-gray-500">(Alunos: {Math.floor(Math.random() * 50) + 10})</span> {/* Alunos aleatórios para demonstração */}
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => navigate('courses')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md">Gerir Cursos</button>
                    </div>

                    {/* Acompanhamento de Alunos */}
                    <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Acompanhamento de Alunos</h3>
                        <p className="text-gray-700 mb-2">Total de Alunos: <span className="font-bold">{studentsEnrolled}</span></p>
                        <p className="text-gray-700 mb-2">Dúvidas Pendentes no Fórum: <span className="font-bold text-red-600">{pendingQuestions}</span></p>
                        <button onClick={() => navigate('student-progress')} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full shadow-md mr-2">Ver Progresso</button>
                        <button onClick={() => navigate('qa-management')} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full shadow-md">Responder Dúvidas</button>
                    </div>

                    {/* Aulas ao Vivo e Perguntas e Respostas */}
                    <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200 col-span-full">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Aulas ao Vivo e Perguntas e Respostas</h3>
                        <p className="text-gray-700 mb-4">Agende e conduza as suas aulas ao vivo, sessões de perguntas e respostas e interações com os alunos.</p>
                        <button onClick={() => navigate('live-session-scheduling')} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full shadow-md mr-2">Agendar Aula ao Vivo</button>
                        <button onClick={() => navigate('qa-management')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full shadow-md">Gerir Perguntas e Respostas</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

const AdminDashboard = ({ navigate }) => {
    const { currentUser } = useContext(AuthContext);

    if (!currentUser || currentUser.role !== 'admin') {
        return <div className="container mx-auto py-12 px-4 text-center text-red-500">Acesso negado. Por favor, autentique-se como administrador.</div>;
    }

    // Simulação de dados do administrador
    const totalUsers = Object.keys(mockUsers).length;
    const totalCourses = mockCourses.length;
    const activeUsersToday = 50; // Simulado
    const systemLogs = [
        'INFO [2025-06-10 14:30]: Novo utilizador registado: aluno@uerj.com (ID: user123)',
        'AVISO [2025-06-10 14:35]: Tentativa de autenticação falhada para instrutor@uerj.com (IP: 192.168.1.10)',
        'DEBUG [2025-06-10 14:40]: Curso python-intro acedido por Aluno Teste.',
        'INFO [2025-06-10 14:45]: Notificação enviada para Aluno Teste: "Novo quiz disponível!".',
        'ERRO [2025-06-10 14:50]: Falha no processamento de pagamento. Código: 5002 (Utilizador: teste@uerj.com).',
        'INFO [2025-06-10 15:00]: Backup da base de dados concluído com sucesso.'
    ];

    return (
        <div className="container mx-auto py-12 px-4 md:py-16">
            <section className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200">
                <h1 className="text-3xl md:text-5xl font-extrabold text-blue-800 mb-8 text-center">Painel do Administrador</h1>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestão do Sistema</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Gestão de Cursos */}
                    <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Gestão de Cursos</h3>
                        <p className="text-gray-700 mb-2">Total de Cursos: <span className="font-bold">{totalCourses}</span></p>
                        <button onClick={() => navigate('courses')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md">Gerir Cursos</button>
                    </div>

                    {/* Gestão de Utilizadores */}
                    <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Gestão de Utilizadores</h3>
                        <p className="text-gray-700 mb-2">Total de Utilizadores: <span className="font-bold">{totalUsers}</span></p>
                        <button onClick={() => navigate('user-management')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md">Gerir Utilizadores</button>
                    </div>

                    {/* Monitorização de Desempenho */}
                    <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200 col-span-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Monitorização de Desempenho</h3>
                        <p className="text-gray-700 mb-2">Utilizadores Ativos Hoje: <span className="font-bold">{activeUsersToday}</span></p>
                        <button onClick={() => navigate('reports')} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full shadow-md">Ver Relatórios</button>
                    </div>

                    {/* Gestão de Ferramentas de IA */}
                    <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200 col-span-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Gerir Ferramentas de IA</h3>
                        <p className="text-gray-700 mb-4">Ajuste e otimize as ferramentas de IA para aprendizagem personalizada.</p>
                        <button onClick={() => navigate('ai-learning')} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full shadow-md">Configurar IA</button>
                    </div>

                    {/* Registos e Alertas */}
                    <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200 col-span-full">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Registos e Alertas</h3>
                        <div className="bg-white p-4 rounded-lg h-40 overflow-y-auto text-sm text-gray-700 font-mono">
                            {systemLogs.map((log, index) => <p key={index}>{log}</p>)}
                        </div>
                        <button onClick={() => navigate('system-logs')} className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full shadow-md">Ver Detalhes dos Registos</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

const AIAssistedLearningPage = () => {
    const [essayText, setEssayText] = useState('');
    const [correctionFeedback, setCorrectionFeedback] = useState('');
    const [questionPrompt, setQuestionPrompt] = useState('');
    const [generatedQuestions, setGeneratedQuestions] = useState([]);
    const [studyObjectives, setStudyObjectives] = useState('');
    const [availableTime, setAvailableTime] = useState('');
    const [studyPlan, setStudyPlan] = useState('');

    const [isCorrecting, setIsCorrecting] = useState(false);
    const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);


    const handleEssayCorrection = async () => {
        if (essayText.length < 50) {
            setCorrectionFeedback('Por favor, digite um texto mais longo para uma correção significativa.');
            return;
        }

        setIsCorrecting(true);
        setCorrectionFeedback('A IA está a gerar o feedback... (Isto pode demorar um pouco)');

        try {
            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: `Corrija e forneça feedback detalhado para a seguinte redação. Indique pontos fortes e áreas de melhoria, e uma pontuação de 1 a 100: ${essayText}` }] });
            const payload = { contents: chatHistory };
            const apiKey = ""; // Deixe como está, a Canvas irá fornecer a chave em tempo de execução
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setCorrectionFeedback(`Feedback da IA:\n${text}`);
            } else {
                setCorrectionFeedback('Erro ao obter feedback da IA. Tente novamente.');
            }
        } catch (error) {
            console.error("Erro ao chamar a API Gemini para correção de ensaio:", error);
            setCorrectionFeedback('Erro na conexão com a IA. Por favor, tente novamente mais tarde.');
        } finally {
            setIsCorrecting(false);
        }
    };

    const handleQuestionGeneration = async () => {
        if (questionPrompt.length < 20) {
            setGeneratedQuestions(['Por favor, forneça um tópico mais detalhado.']);
            return;
        }

        setIsGeneratingQuestions(true);
        setGeneratedQuestions(['A IA está a gerar as questões...']);

        try {
            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: `Gere 3 questões de múltipla escolha e 1 discursiva sobre o seguinte tópico: ${questionPrompt}` }] });
            const payload = { contents: chatHistory };
            const apiKey = ""; // Deixe como está, a Canvas irá fornecer a chave em tempo de execução
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setGeneratedQuestions(text.split('\n').filter(line => line.trim() !== '')); // Divide por linhas para simular questões separadas
            } else {
                setGeneratedQuestions(['Erro ao gerar questões da IA. Tente novamente.']);
            }
        } catch (error) {
            console.error("Erro ao chamar a API Gemini para geração de questões:", error);
            setGeneratedQuestions(['Erro na conexão com a IA. Por favor, tente novamente mais tarde.']);
        } finally {
            setIsGeneratingQuestions(false);
        }
    };

    const handleGenerateStudyPlan = async () => {
        if (studyObjectives.trim() === '' || availableTime.trim() === '') {
            setStudyPlan('Por favor, preencha os seus objetivos e o tempo disponível para gerar um plano.');
            return;
        }

        setIsGeneratingPlan(true);
        setStudyPlan('A IA está a criar o seu plano de estudo... (Isto pode demorar um pouco)');

        try {
            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: `Crie um plano de estudo personalizado. Os meus objetivos são: "${studyObjectives}". O tempo disponível que tenho é: "${availableTime}".` }] });
            const payload = { contents: chatHistory };
            const apiKey = ""; // Deixe como está, a Canvas irá fornecer a chave em tempo de execução
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setStudyPlan(`Plano de Estudo Gerado:\n${text}`);
            } else {
                setStudyPlan('Erro ao gerar o plano de estudo da IA. Tente novamente.');
            }
        } catch (error) {
            console.error("Erro ao chamar a API Gemini para gerar plano de estudo:", error);
            setStudyPlan('Erro na conexão com a IA. Por favor, tente novamente mais tarde.');
        } finally {
            setIsGeneratingPlan(false);
        }
    };

    return (
        <div className="container mx-auto py-12 px-4 md:py-16">
            <section className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200">
                <h1 className="text-3xl md:text-5xl font-extrabold text-blue-800 mb-8 text-center">Aprendizagem Assistida por IA ✨</h1>
                <p className="text-lg md:text-xl text-gray-700 mb-10 text-center max-w-3xl mx-auto">
                    Aqui você pode configurar e utilizar as ferramentas de inteligência artificial para otimizar a experiência de aprendizagem dos alunos.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Correção de Questões (IA) */}
                    <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Correção de Questões Discursivas ✨</h3>
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                            rows="6"
                            placeholder="Cole o seu texto ou dissertação aqui para correção da IA (limite de 2000 caracteres)."
                            value={essayText}
                            onChange={(e) => setEssayText(e.target.value)}
                            maxLength="2000"
                            disabled={isCorrecting}
                        ></textarea>
                        <button onClick={handleEssayCorrection} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-md" disabled={isCorrecting}>
                            {isCorrecting ? 'A Corrigir...' : 'Obter Correção'}
                        </button>
                        {correctionFeedback && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-blue-800 border border-blue-200">
                                <p className="font-semibold">Feedback da IA:</p>
                                <p className="whitespace-pre-wrap">{correctionFeedback}</p>
                                <p className="text-sm text-gray-600 mt-2">Pode avaliar a qualidade da correção: <span className="text-yellow-500">★ ★ ★ ★ ☆</span></p>
                            </div>
                        )}
                    </div>

                    {/* Geração de Questões (IA) */}
                    <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Geração de Questões ✨</h3>
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                            rows="4"
                            placeholder="Descreva um tópico ou cole um trecho de conteúdo para a IA gerar questões."
                            value={questionPrompt}
                            onChange={(e) => setQuestionPrompt(e.target.value)}
                            disabled={isGeneratingQuestions}
                        ></textarea>
                        <p className="text-sm text-gray-600 mb-2">Parâmetros:</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <select className="p-2 border rounded-lg" disabled={isGeneratingQuestions}>
                                <option>Tipo: Múltipla Escolha</option>
                                <option>Tipo: Discursiva</option>
                                <option>Tipo: V/F</option>
                            </select>
                            <select className="p-2 border rounded-lg" disabled={isGeneratingQuestions}>
                                <option>Dificuldade: Fácil</option>
                                <option>Dificuldade: Médio</option>
                                <option>Dificuldade: Difícil</option>
                            </select>
                            <input type="number" placeholder="Nº de Questões" className="p-2 border rounded-lg w-32" disabled={isGeneratingQuestions}/>
                        </div>
                        <button onClick={handleQuestionGeneration} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-md" disabled={isGeneratingQuestions}>
                            {isGeneratingQuestions ? 'A Gerar...' : 'Gerar Questões'}
                        </button>
                        {generatedQuestions.length > 0 && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-blue-800 border border-blue-200">
                                <p className="font-semibold mb-2">Questões Geradas:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    {generatedQuestions.map((q, index) => <li key={index}>{q}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Plano de Estudo (IA) */}
                <div className="mt-8 bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Plano de Estudo Personalizado com IA ✨</h3>
                    <p className="text-gray-700 mb-4">Deixe a IA criar um plano de estudo otimizado para si, com base nos seus objetivos e desempenho.</p>
                    <div className="space-y-4 mb-4">
                        <div>
                            <label htmlFor="studyObjectives" className="block text-lg font-medium text-gray-700 mb-2">Os seus objetivos de aprendizagem (Ex: Aprender Python para análise de dados)</label>
                            <textarea
                                id="studyObjectives"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                rows="3"
                                value={studyObjectives}
                                onChange={(e) => setStudyObjectives(e.target.value)}
                                disabled={isGeneratingPlan}
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="availableTime" className="block text-lg font-medium text-gray-700 mb-2">Tempo disponível para estudar (Ex: 2 horas por dia, 10 horas por semana)</label>
                            <input
                                type="text"
                                id="availableTime"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={availableTime}
                                onChange={(e) => setAvailableTime(e.target.value)}
                                disabled={isGeneratingPlan}
                            />
                        </div>
                    </div>
                    <button onClick={handleGenerateStudyPlan} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full shadow-md" disabled={isGeneratingPlan}>
                        {isGeneratingPlan ? 'A Gerar...' : 'Gerar Plano de Estudo'}
                    </button>
                    {studyPlan && (
                        <div className="mt-4 p-3 bg-purple-50 rounded-lg text-purple-800 border border-purple-200">
                            <p className="font-semibold">Plano de Estudo:</p>
                            <p className="whitespace-pre-wrap">{studyPlan}</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

const ForumPage = () => {
    const [posts, setPosts] = useState([
        { id: 'post-1', author: 'Aluno Teste', title: 'Dúvidas sobre o projeto final', content: 'Gostaria de discutir os requisitos do projeto final de Engenharia de Software I.', date: '01/06/2025', replies: [] },
        { id: 'post-2', author: 'Prof. Ana Silva', title: 'Novas tendências em Python', content: 'Vamos discutir as últimas novidades e tendências na linguagem Python!', date: '28/05/2025', replies: [] },
    ]);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [authorFilter, setAuthorFilter] = useState('');
    const [sortBy, setSortBy] = useState('dateDesc'); // 'dateDesc', 'dateAsc', 'authorAsc'
    const [message, setMessage] = useState(''); // Estado para exibir mensagens

    const handleNewPost = () => {
        if (newPostTitle.trim() === '' || newPostContent.trim() === '') {
            setMessage('Por favor, preencha o título e o conteúdo da publicação.');
            return;
        }
        const newPost = {
            id: `post-${Date.now()}`,
            author: 'Utilizador Autenticado (Simulado)', // Num aplicativo real, seria o currentUser.name
            title: newPostTitle,
            content: newPostContent,
            date: new Date().toLocaleDateString('pt-BR'),
            replies: []
        };
        setPosts(prevPosts => [newPost, ...prevPosts]);
        setNewPostTitle('');
        setNewPostContent('');
        setMessage('Publicação criada com sucesso!');
        setTimeout(() => setMessage(''), 3000); // Limpa a mensagem após 3 segundos
    };

    const handleReplyToPost = (postId) => {
        setMessage(`Funcionalidade de responder à publicação ${postId} (simulada).`);
        // Aqui você adicionaria a lógica para adicionar uma resposta a um post específico
        setTimeout(() => setMessage(''), 3000); // Limpa a mensagem após 3 segundos
    };


    const filteredAndSortedPosts = [...posts].filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              post.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAuthor = authorFilter === '' || post.author.toLowerCase().includes(authorFilter.toLowerCase());
        return matchesSearch && matchesAuthor;
    }).sort((a, b) => {
        if (sortBy === 'dateDesc') {
            return new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-'));
        } else if (sortBy === 'dateAsc') {
            return new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-'));
        } else if (sortBy === 'authorAsc') {
            return a.author.localeCompare(b.author);
        }
        return 0;
    });

    const uniqueAuthors = [...new Set(posts.map(post => post.author))];


    return (
        <div className="container mx-auto py-12 px-4 md:py-16">
            <section className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200">
                <h1 className="text-3xl md:text-5xl font-extrabold text-blue-800 mb-8 text-center">Fórum de Discussões Gerais</h1>

                {/* Área para Nova Publicação */}
                <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Criar Nova Publicação</h2>
                    <input
                        type="text"
                        placeholder="Título da Publicação"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                    />
                    <textarea
                        placeholder="Conteúdo da Publicação..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        rows="4"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                    ></textarea>
                    <button onClick={handleNewPost} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-md">
                        Publicar Publicação
                    </button>
                    {message && <p className="text-center mt-4 text-sm font-semibold text-green-600">{message}</p>}
                </div>

                {/* Filtros e Ordenação */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0 md:space-x-4">
                    <input
                        type="text"
                        placeholder="Procurar por título ou conteúdo..."
                        className="p-3 border border-gray-300 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="p-3 border border-gray-300 rounded-lg w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={authorFilter}
                        onChange={(e) => setAuthorFilter(e.target.value)}
                    >
                        <option value="">Todos os Autores</option>
                        {uniqueAuthors.map(author => (
                            <option key={author} value={author}>{author}</option>
                        ))}
                    </select>
                    <select
                        className="p-3 border border-gray-300 rounded-lg w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="dateDesc">Mais Recentes</option>
                        <option value="dateAsc">Mais Antigos</option>
                        <option value="authorAsc">Autor (A-Z)</option>
                    </select>
                </div>

                {/* Lista de Publicações */}
                <div className="space-y-6">
                    {filteredAndSortedPosts.length > 0 ? (
                        filteredAndSortedPosts.map(post => (
                            <div key={post.id} className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h3>
                                <p className="text-gray-700 mb-3">{post.content}</p>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>Por: <span className="font-semibold">{post.author}</span></span>
                                    <span>Em: {post.date}</span>
                                </div>
                                {/* Simulação de Comentários em Publicações */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Respostas ({post.replies.length})</h4>
                                    {post.replies.length === 0 && <p className="text-gray-600 text-sm">Nenhuma resposta ainda. Seja o primeiro a responder!</p>}
                                    <textarea
                                        placeholder="Adicionar uma resposta..."
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                                        rows="2"
                                    ></textarea>
                                    <button onClick={() => handleReplyToPost(post.id)} className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-1 px-3 rounded-full shadow-sm mt-2">
                                        Responder
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600 col-span-full">Nenhuma publicação encontrada com os critérios de procura.</p>
                    )}
                </div>
            </section>
        </div>
    );
};


const AIChatPage = () => {
    const [chatHistory, setChatHistory] = useState([
        { id: 'chat-1', title: 'Dúvidas sobre Python', messages: [{ sender: 'ai', text: 'Olá! Como posso ajudar você com Python hoje?' }] },
        { id: 'chat-2', title: 'Ajuda com Redação', messages: [{ sender: 'ai', text: 'Estou aqui para ajudar com sua redação! O que precisa?' }] },
    ]);
    const [currentChatId, setCurrentChatId] = useState(chatHistory[0]?.id || null);
    const [messages, setMessages] = useState([]); // Mensagens para o chat atual
    const [input, setInput] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileIndexingMessage, setFileIndexingMessage] = useState('');
    const [isSending, setIsSending] = useState(false); // Novo estado para controlar o envio

    const messagesEndRef = useRef(null); // Ref para rolar para o final do chat

    useEffect(() => {
        // Carrega as mensagens para o chat atual
        const currentChat = chatHistory.find(chat => chat.id === currentChatId);
        setMessages(currentChat ? currentChat.messages : []);
    }, [currentChatId, chatHistory]);

    useEffect(() => {
        // Rola para a última mensagem
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if ((input.trim() === '' && !selectedFile) || isSending) return;

        setIsSending(true); // Desativa o botão de envio
        const userMessage = { sender: 'user', text: input, file: selectedFile ? selectedFile.name : null };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages); // Atualiza as mensagens locais imediatamente
        updateChatHistory(currentChatId, newMessages); // Atualiza o estado do histórico de chat

        setInput('');
        setSelectedFile(null); // Limpa o arquivo selecionado após enviar
        setFileIndexingMessage('');

        // Adiciona uma mensagem de "digitando..." ou similar da IA
        const typingMessage = { sender: 'ai', text: 'A IA está a pensar... ✨', isTyping: true };
        setMessages(prevMessages => [...prevMessages, typingMessage]);
        updateChatHistory(currentChatId, [...newMessages, typingMessage]);


        try {
            // Se for a primeira mensagem em um novo chat (ou o título não foi gerado), gera um título
            let currentChatObj = chatHistory.find(chat => chat.id === currentChatId);
            if (!currentChatObj || !currentChatObj.isTitleGenerated) {
                const promptForTitle = `Crie um título conciso (máximo 5 palavras) para a seguinte conversa. O primeiro input do usuário é: "${input}".`;
                const titlePayload = { contents: [{ role: "user", parts: [{ text: promptForTitle }] }] };
                const titleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${""}`; // Use a chave da API

                const titleResponse = await fetch(titleApiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(titlePayload)
                });
                const titleResult = await titleResponse.json();
                let newTitle = "Novo Chat";
                if (titleResult.candidates && titleResult.candidates.length > 0 &&
                    titleResult.candidates[0].content && titleResult.candidates[0].content.parts &&
                    titleResult.candidates[0].content.parts.length > 0) {
                    newTitle = titleResult.candidates[0].content.parts[0].text.trim();
                    newTitle = newTitle.split(' ').slice(0, 5).join(' '); // Trunca para 5 palavras
                }
                
                // Atualiza o histórico de chats com o novo título
                setChatHistory(prevHistory => {
                    return prevHistory.map(chat =>
                        chat.id === currentChatId ? { ...chat, title: newTitle, isTitleGenerated: true } : chat
                    );
                });
            }


            // Prepara o histórico da conversa para a API Gemini
            let chatHistoryForApi = newMessages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));

            // Adiciona o prompt mais recente e o arquivo (se houver) ao final do histórico para a requisição
            let parts = [{ text: input }];
            if (selectedFile) {
                // Simula a leitura de um arquivo e conversão para base64.
                // Em um ambiente real, você leria o arquivo de verdade e o codificaria em base64.
                // Aqui, é apenas um placeholder para demonstrar a intenção de anexar dados binários.
                const base64ImageData = btoa("Conteúdo simulado do arquivo " + selectedFile.name);
                parts.push({
                    inlineData: {
                        mimeType: selectedFile.type || "application/octet-stream",
                        data: base64ImageData
                    }
                });
            }

            // O payload da API Gemini requer 'contents' como um array de 'parts'
            // O último 'contents' deve ser a entrada do usuário
            const payload = {
                contents: chatHistoryForApi.concat([{
                    role: "user",
                    parts: parts
                }])
            };


            const apiKey = ""; // DEVE SER PREENCHIDA PELA CANVAS EM TEMPO DE EXECUÇÃO
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            let aiResponseText = 'Desculpe, não consegui gerar uma resposta. Tente novamente.';

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                aiResponseText = result.candidates[0].content.parts[0].text;
            }

            // Remove a mensagem de "digitando..." e adiciona a resposta real
            setMessages(prevMessages => prevMessages.filter(msg => !msg.isTyping).concat({ sender: 'ai', text: aiResponseText }));
            updateChatHistory(currentChatId, newMessages.concat({ sender: 'ai', text: aiResponseText }));

        } catch (error) {
            console.error("Erro ao chamar a API Gemini para o chat:", error);
            // Remove a mensagem de "digitando..." e adiciona uma mensagem de erro
            setMessages(prevMessages => prevMessages.filter(msg => !msg.isTyping).concat({ sender: 'ai', text: 'Erro na conexão com a IA. Por favor, tente novamente mais tarde.' }));
            updateChatHistory(currentChatId, newMessages.concat({ sender: 'ai', text: 'Erro na conexão com a IA. Por favor, tente novamente mais tarde.' }));
        } finally {
            setIsSending(false); // Reativa o botão de envio
        }
    };


    const updateChatHistory = (chatId, newMessages) => {
        setChatHistory(prevHistory => {
            const updatedHistory = prevHistory.map(chat =>
                chat.id === chatId ? { ...chat, messages: newMessages } : chat
            );
            return updatedHistory;
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileIndexingMessage(`Ficheiro "${file.name}" selecionado para indexação. Será enviado com a próxima mensagem.`);
        } else {
            setSelectedFile(null);
            setFileIndexingMessage('');
        }
    };

    const startNewChat = () => {
        const newChatId = `chat-${Date.now()}`;
        const newChatTitle = `Novo Chat ${chatHistory.length + 1}`;
        setChatHistory(prevHistory => [...prevHistory, { id: newChatId, title: newChatTitle, messages: [], isTitleGenerated: false }]); // Adiciona isTitleGenerated
        setCurrentChatId(newChatId);
        setMessages([]);
        setInput('');
        setSelectedFile(null);
        setFileIndexingMessage('');
    };

    return (
        <div className="container mx-auto py-12 px-4 md:py-16 h-[80vh] flex">
            {/* Sidebar de Histórico de Conversas */}
            <div className="hidden md:flex flex-col w-1/4 bg-gray-100 p-6 rounded-l-2xl shadow-inner border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Histórico de Conversas</h2>
                <button
                    onClick={startNewChat}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md mb-4 flex items-center justify-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4v16m8-8H4"></path>
                    </svg>
                    <span>Novo Chat</span>
                </button>
                <ul className="flex-grow overflow-y-auto space-y-2">
                    {chatHistory.map(chat => (
                        <li key={chat.id}>
                            <button
                                onClick={() => setCurrentChatId(chat.id)}
                                className={`w-full text-left p-3 rounded-lg hover:bg-blue-100 transition duration-200 ${currentChatId === chat.id ? 'bg-blue-200 text-blue-800 font-semibold' : 'bg-white text-gray-700'}`}
                            >
                                {chat.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Área Principal do Chat */}
            <section className="flex-grow bg-white p-8 md:p-12 rounded-r-2xl md:rounded-2xl shadow-xl border border-gray-200 flex flex-col">
                <h1 className="text-3xl md:text-5xl font-extrabold text-blue-800 mb-6 text-center">Claudos IA: {chatHistory.find(chat => chat.id === currentChatId)?.title}</h1>
                <div className="flex-grow overflow-y-auto p-4 border border-gray-300 rounded-lg mb-6 bg-gray-50 flex flex-col space-y-3">
                    {messages.length === 0 && (
                        <p className="text-center text-gray-500">Comece a conversar com a nossa IA ou selecione um chat anterior!</p>
                    )}
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`inline-block p-3 rounded-xl max-w-[70%] ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                {msg.text}
                                {msg.file && (
                                    <p className="text-xs mt-1 opacity-80 italic">Anexado: {msg.file}</p>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} /> {/* Elemento para rolar para o final */}
                </div>
                {fileIndexingMessage && (
                    <p className="text-sm text-gray-600 mb-2">{fileIndexingMessage}</p>
                )}
                <div className="flex items-center space-x-2">
                    <label htmlFor="file-upload" className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        Anexar Ficheiro
                    </label>
                    <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />

                    <input
                        type="text"
                        className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Escreva a sua mensagem..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                        disabled={isSending}
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md"
                        disabled={isSending}
                    >
                        {isSending ? 'A Enviar...' : 'Enviar'}
                    </button>
                </div>
            </section>
        </div>
    );
};


// Página de Doação
const DonatePage = () => {
    const [donationAmount, setDonationAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('pix'); // Default to PIX
    const [cardNumber, setCardNumber] = useState('');
    const [cardholderName, setCardholderName] = useState('');
    const [expiryMonth, setExpiryMonth] = useState('');
    const [expiryYear, setExpiryYear] = useState('');
    const [cvv, setCvv] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    const handleDonation = (e) => {
        e.preventDefault();
        if (donationAmount <= 0) {
            setStatusMessage('Por favor, insira um valor válido para a doação.');
            return;
        }

        let message = `Obrigado pela sua doação de €${donationAmount}! A sua contribuição é muito valiosa para nós.`;

        if (paymentMethod === 'pix') {
            message += ' Instruções para PIX: Utilize a chave XXX.XXX.XXX-XX ou o QR Code a seguir.';
        } else if (paymentMethod === 'boleto') {
            message += ' Um boleto foi gerado e enviado para o seu email.';
        } else if (paymentMethod === 'card') {
            if (!cardNumber || !cardholderName || !expiryMonth || !expiryYear || !cvv) {
                setStatusMessage('Por favor, preencha todos os dados do cartão.');
                return;
            }
            message += ' Pagamento com cartão processado com sucesso.';
        }
        
        setStatusMessage(message);
        setDonationAmount('');
        setCardNumber('');
        setCardholderName('');
        setExpiryMonth('');
        setExpiryYear('');
        setCvv('');
        
        setTimeout(() => setStatusMessage(''), 8000);
    };

    return (
        <div className="container mx-auto py-12 px-4 md:py-16">
            <section className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200 text-center">
                <h1 className="text-3xl md:text-5xl font-extrabold text-blue-800 mb-6">Apoie a Nossa Missão</h1>
                <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
                    A sua doação ajuda-nos a continuar a oferecer educação de qualidade e a desenvolver recursos inovadores para todos os nossos alunos.
                </p>
                <form onSubmit={handleDonation} className="max-w-md mx-auto space-y-6">
                    <div>
                        <label htmlFor="donationAmount" className="block text-lg font-medium text-gray-700 mb-2">Valor da Doação (€)</label>
                        <input
                            type="number"
                            id="donationAmount"
                            className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                            placeholder="Ex: 20"
                            min="1"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(e.target.value)}
                            required
                        />
                    </div>

                    {/* Seleção do Método de Pagamento */}
                    <div className="text-left">
                        <label className="block text-lg font-medium text-gray-700 mb-3">Método de Pagamento:</label>
                        <div className="flex flex-col space-y-2">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio text-blue-600"
                                    name="paymentMethod"
                                    value="pix"
                                    checked={paymentMethod === 'pix'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span className="ml-2 text-gray-700">PIX</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio text-blue-600"
                                    name="paymentMethod"
                                    value="boleto"
                                    checked={paymentMethod === 'boleto'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span className="ml-2 text-gray-700">Boleto Bancário</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio text-blue-600"
                                    name="paymentMethod"
                                    value="card"
                                    checked={paymentMethod === 'card'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span className="ml-2 text-gray-700">Cartão de Crédito/Débito</span>
                            </label>
                        </div>
                    </div>

                    {/* Campos de Cartão de Crédito/Débito (condicional) */}
                    {paymentMethod === 'card' && (
                        <div className="space-y-4 text-left p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div>
                                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Número do Cartão</label>
                                <input
                                    type="text"
                                    id="cardNumber"
                                    className="block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="XXXX XXXX XXXX XXXX"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim())} // Formata o número
                                    maxLength="19"
                                    required={paymentMethod === 'card'}
                                />
                            </div>
                            <div>
                                <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">Nome no Cartão</label>
                                <input
                                    type="text"
                                    id="cardholderName"
                                    className="block w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nome Completo"
                                    value={cardholderName}
                                    onChange={(e) => setCardholderName(e.target.value)}
                                    required={paymentMethod === 'card'}
                                />
                            </div>
                            <div className="flex space-x-4">
                                <div className="w-1/2">
                                    <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700 mb-1">Mês de Validade</label>
                                    <input
                                        type="text"
                                        id="expiryMonth"
                                        className="block w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="MM"
                                        value={expiryMonth}
                                        onChange={(e) => setExpiryMonth(e.target.value.replace(/\D/g, '').substring(0, 2))}
                                        maxLength="2"
                                        required={paymentMethod === 'card'}
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-700 mb-1">Ano de Validade</label>
                                    <input
                                        type="text"
                                        id="expiryYear"
                                        className="block w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="AA"
                                        value={expiryYear}
                                        onChange={(e) => setExpiryYear(e.target.value.replace(/\D/g, '').substring(0, 2))}
                                        maxLength="2"
                                        required={paymentMethod === 'card'}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                <input
                                    type="text"
                                    id="cvv"
                                    className="block w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="XXX"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))} // Apenas números, máx 4 dígitos
                                    maxLength="4"
                                    required={paymentMethod === 'card'}
                                />
                            </div>
                        </div>
                    )}

                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
                        Doar Agora
                    </button>
                    {statusMessage && (
                        <p className="text-center mt-4 text-sm font-semibold" style={{ color: donationAmount > 0 || paymentMethod !== 'card' ? 'green' : 'red' }}>{statusMessage}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-6">
                        Agradecemos imensamente a sua generosidade. Cada contribuição faz a diferença!
                    </p>
                </form>
            </section>
        </div>
    );
};


// Componente principal da aplicação
const App = () => {
    const [currentPage, setCurrentPage] = useState('home');
    const [pageProps, setPageProps] = useState({});

    // Função para navegar entre as páginas
    const navigate = (page, props = {}) => {
        setCurrentPage(page);
        setPageProps(props);
        window.scrollTo(0, 0); // Rola para o topo ao mudar de página
    };

    // Renderiza a página correta com base no estado
    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage navigate={navigate} />;
            case 'courses':
                return <CoursesPage navigate={navigate} />;
            case 'course-detail': // Página de detalhes do curso (overview)
                return <CourseDetailPage navigate={navigate} courseId={pageProps.courseId} />;
            case 'course-module': // Página de detalhes de um módulo específico
                return <CourseModulePage navigate={navigate} courseId={pageProps.courseId} moduleId={pageProps.moduleId} />;
            case 'ai-chat': // Rota para o chat de IA
                return <AIChatPage navigate={navigate} />;
            case 'forum': // Rota para o Fórum Geral
                return <ForumPage navigate={navigate} />;
            case 'about':
                return <AboutPage navigate={navigate} />;
            case 'contact':
                return <ContactPage navigate={navigate} />;
            case 'auth':
                return <AuthPage navigate={navigate} />;
            case 'profile-settings': // Nova rota para as configurações de perfil
                return <ProfileSettingsPage navigate={navigate} />;
            case 'edit-profile': // Nova rota para a página de edição de perfil
                return <EditProfilePage navigate={navigate} />;
            case 'student-dashboard':
                return <StudentDashboard navigate={navigate} />;
            case 'instructor-dashboard':
                return <InstructorDashboard navigate={navigate} />;
            case 'admin-dashboard':
                return <AdminDashboard navigate={navigate} />;
            case 'ai-learning':
                return <AIAssistedLearningPage navigate={navigate} />;
            case 'donate': // Nova rota para a página de doação
                return <DonatePage navigate={navigate} />;
            case 'messages': // Nova rota para a página de mensagens
                return <MessagesPage navigate={navigate} />;
            // Novas páginas simuladas
            case 'student-progress':
                return <StudentProgressPage navigate={navigate} />;
            case 'live-session-scheduling':
                return <LiveSessionSchedulingPage navigate={navigate} />;
            case 'qa-management':
                return <QAManagementPage navigate={navigate} />;
            case 'user-management':
                return <UserManagementPage navigate={navigate} />;
            case 'reports':
                return <ReportsPage navigate={navigate} />;
            case 'system-logs':
                return <SystemLogsPage navigate={navigate} />;
            default:
                return <HomePage navigate={navigate} />;
        }
    };

    return (
        <AuthProvider>
            <ErrorBoundary> {/* Wrapped the App with ErrorBoundary */}
                <div className="min-h-screen flex flex-col">
                    <Navbar navigate={navigate} />
                    <main className="flex-grow">
                        {renderPage()}
                    </main>
                    <Footer navigate={navigate} />
                </div>
            </ErrorBoundary>
        </AuthProvider>
    );
};

// Componente ErrorBoundary
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Atualiza o estado para que a próxima renderização mostre a UI de fallback.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Você também pode registar o erro num serviço de relatório de erros
        console.error("Erro capturado por ErrorBoundary: ", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // Pode renderizar qualquer UI de fallback personalizada
            return (
                <div className="container mx-auto py-12 px-4 md:py-16 text-center text-red-600 bg-red-50 border border-red-200 rounded-lg p-8">
                    <h2 className="text-2xl font-bold mb-4">Ocorreu um erro.</h2>
                    <p className="mb-4">Algo deu errado. Por favor, tente novamente mais tarde.</p>
                    {this.state.error && (
                        <details className="text-left bg-red-100 p-4 rounded-md overflow-auto max-h-60">
                            <summary>Detalhes do Erro</summary>
                            <pre className="whitespace-pre-wrap break-words text-sm">{this.state.error.toString()}</pre>
                            <pre className="whitespace-pre-wrap break-words text-xs mt-2">{this.state.errorInfo?.componentStack}</pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}


// Nova Página para Detalhes do Módulo do Curso
const CourseModulePage = ({ navigate, courseId, moduleId }) => {
    const course = mockCourses.find(c => c.id === courseId);
    const module = course?.modules.find(m => m.id === moduleId);
    const [showAllModules, setShowAllModules] = useState(false); // Estado para controlar a exibição de todos os módulos
    const [currentLesson, setCurrentLesson] = useState(module?.lessons[0] || null); // Começa com a primeira lição
    const [message, setMessage] = useState(''); // Novo estado para mensagens simuladas

    if (!course || !module) {
        return (
            <div className="container mx-auto py-12 px-4 md:py-16 text-center text-red-500">
                Módulo ou Curso não encontrado.
                <button onClick={() => navigate('courses')} className="text-blue-600 hover:underline block mt-4">Voltar aos Cursos</button>
            </div>
        );
    }

    const handleQuizStart = () => {
        setMessage('Iniciando quiz... (Funcionalidade simulada)');
        setTimeout(() => setMessage(''), 3000); // Limpa a mensagem após 3 segundos
    };

    return (
        <div className="container mx-auto py-12 px-4 md:py-16">
            <section className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200 flex flex-col md:flex-row">
                {/* Painel Esquerdo: Navegação do Módulo/Curso */}
                <div className="w-full md:w-1/4 pr-8 border-r border-gray-200">
                    {/* Box do Módulo Atual */}
                    <div className="bg-blue-50 p-4 rounded-lg mb-4 cursor-pointer hover:bg-blue-100 transition duration-300" onClick={() => setShowAllModules(prev => !prev)}>
                        <h3 className="font-bold text-blue-800">{module.title}</h3>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${module.progress}%` }}></div>
                        </div>
                        <p className="text-sm text-blue-700 mt-1">Progresso: {module.progress}%</p>
                        <p className="text-xs text-blue-500 mt-2">
                            {showAllModules ? 'Esconder Módulos' : 'Ver Todos os Módulos'}
                        </p>
                    </div>

                    {/* Lista de Todos os Módulos (Condicional) */}
                    {showAllModules && (
                        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-2">Todos os Módulos de {course.title}</h4>
                            <ul className="space-y-1">
                                {course.modules.map(mod => (
                                    <li key={mod.id}>
                                        <button
                                            onClick={() => { navigate('course-module', { courseId: course.id, moduleId: mod.id }); setShowAllModules(false); }}
                                            className={`text-sm text-left w-full p-2 rounded-md ${mod.id === moduleId ? 'bg-blue-200 font-semibold text-blue-800' : 'hover:bg-gray-200 text-gray-700'}`}
                                        >
                                            {mod.title} ({mod.progress}%)
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Lista de Aulas do Módulo Atual */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Aulas do Módulo</h3>
                    <ul className="space-y-2">
                        {module.lessons.map(lesson => (
                            <li key={lesson.id}>
                                <button
                                    onClick={() => setCurrentLesson(lesson)} // Define a aula atual para exibir o conteúdo
                                    className="text-left w-full p-2 rounded-lg hover:bg-gray-200 transition duration-300 text-gray-700"
                                >
                                    {lesson.type === 'video' && (
                                        <svg className="inline-block w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
                                        </svg>
                                    )}
                                    {lesson.type === 'text' && (
                                        <svg className="inline-block w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"></path>
                                        </svg>
                                    )}
                                    {lesson.type === 'quiz' && (
                                        <svg className="inline-block w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-2 10H7v-2h10v2zm0-4H7V7h10v2z"></path>
                                        </svg>
                                    )}
                                    {lesson.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Conteúdo Principal do Módulo (Vídeo/Texto/Quiz) */}
                <div className="w-full md:w-3/4 pl-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">{currentLesson?.title || 'Selecione uma aula'}</h2>
                    {currentLesson && currentLesson.type === 'video' && (
                        <div className="aspect-w-16 aspect-h-9 mb-6">
                            <iframe
                                className="w-full h-96 rounded-lg shadow-lg"
                                src={currentLesson.url}
                                title={currentLesson.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}
                    {currentLesson && currentLesson.type === 'text' && (
                        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">{currentLesson.title}</h3>
                            <p className="text-gray-700">{currentLesson.content}</p>
                        </div>
                    )}
                     {currentLesson && currentLesson.type === 'quiz' && (
                        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">{mockCourses.find(c => c.id === courseId)?.quizzes.find(q => q.id === currentLesson.quizId)?.title}</h3>
                            <p className="text-gray-700">Faça o quiz para testar os seus conhecimentos!</p>
                            <button onClick={handleQuizStart} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full">Iniciar Quiz</button>
                        </div>
                    )}

                    {!currentLesson && (
                        <p className="text-gray-700 mt-4">Selecione uma aula no painel esquerdo para visualizar o seu conteúdo.</p>
                    )}
                    {message && <p className="text-center mt-4 text-sm font-semibold text-green-600">{message}</p>}
                </div>
            </section>
        </div>
    );
};

// Nova Página de Mensagens com layout de WhatsApp Web
const MessagesPage = () => {
    // Para simular, vamos ter alguns contatos e mensagens
    const [contacts, setContacts] = useState([
        { id: 'contact-prof-ana', name: 'Prof. Ana Silva', profilePicture: 'https://placehold.co/128x128/FFD180/000000?text=AS',
          messages: [
            { id: 1, sender: 'Prof. Ana Silva', text: 'Olá, Aluno! Não se esqueça da atividade de hoje.', time: '10:00 AM' },
            { id: 2, sender: 'Você', text: 'Ok, professor! Já anotei.', time: '10:02 AM' },
            { id: 3, sender: 'Prof. Ana Silva', text: 'Certo! Qualquer dúvida é só falar.', time: '10:05 AM' },
          ]},
        { id: 'contact-aluno-x', name: 'Aluno X', profilePicture: 'https://placehold.co/128x128/C5E1A5/000000?text=AX',
          messages: [
            { id: 1, sender: 'Aluno X', text: 'Olá, Aluno Teste! Poderia me ajudar com a questão 5 do quiz?', time: 'Ontem' },
            { id: 2, sender: 'Você', text: 'Claro! Qual é a sua dúvida específica?', time: 'Ontem' },
          ]},
        { id: 'contact-aluno-y', name: 'Aluno Y', profilePicture: 'https://placehold.co/128x128/AED581/000000?text=AY',
          messages: [
            { id: 1, sender: 'Aluno Y', text: 'Bom dia! Tudo bem com o curso?', time: '09:30 AM' },
            { id: 2, sender: 'Você', text: 'Tudo ótimo, obrigado!', time: '09:35 AM' },
          ]},
    ]);

    const [currentChatId, setCurrentChatId] = useState(contacts[0]?.id || null);
    const [newMessage, setNewMessage] = useState('');
    const [contactSearchTerm, setContactSearchTerm] = useState(''); // Novo estado para o termo de pesquisa de contatos
    const messagesEndRef = useRef(null);

    const currentChat = contacts.find(chat => chat.id === currentChatId);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [currentChatId, currentChat?.messages]); // Rola ao mudar de chat ou adicionar nova mensagem

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const updatedContacts = contacts.map(contact => {
                if (contact.id === currentChatId) {
                    const newMessages = [...contact.messages, { id: Date.now(), sender: 'Você', text: newMessage, time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }];
                    return { ...contact, messages: newMessages };
                }
                return contact;
            });
            setContacts(updatedContacts);
            setNewMessage('');
        }
    };

    const selectChat = (contactId) => {
        setCurrentChatId(contactId);
        // Marcar mensagens como lidas ao selecionar o chat
        const updatedContacts = contacts.map(contact => {
            if (contact.id === contactId) {
                return { ...contact, unread: 0 };
            }
            return contact;
        });
        setContacts(updatedContacts);
    };

    // Filtra os contatos com base no termo de pesquisa
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(contactSearchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto py-12 px-4 md:py-16 h-[80vh] flex">
            <section className="bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-grow overflow-hidden">
                {/* Chat List Sidebar (Contatos) */}
                <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
                    <div className="p-4 bg-gray-100 border-b border-gray-200">
                        {/* Campo de pesquisa de contatos */}
                        <div className="flex items-center space-x-2 mb-2">
                            <input
                                type="text"
                                placeholder="Pesquisar contatos..."
                                className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={contactSearchTerm}
                                onChange={(e) => setContactSearchTerm(e.target.value)}
                            />
                            {/* Botão de + (Visível e com ícone ajustado) */}
                            {/* Removido o '>' e adicionado uma classe para cor cinza clara */}
                            <button className="p-2 rounded-full text-gray-400 hover:bg-gray-200 transition duration-300">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-grow">
                        {filteredContacts.map(contact => (
                            <button
                                key={contact.id}
                                onClick={() => selectChat(contact.id)}
                                className={`w-full text-left p-4 flex items-center border-b border-gray-200 hover:bg-blue-50 transition duration-150 ${currentChatId === contact.id ? 'bg-blue-100' : ''}`}
                            >
                                <img src={contact.profilePicture} alt="Foto de Perfil do Contato" className="w-12 h-12 rounded-full object-cover mr-3"/>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-gray-900">{contact.name}</p>
                                        {/* Exibe a hora da última mensagem do chat */}
                                        <span className="text-xs text-gray-500">
                                            {contact.messages.length > 0 ? contact.messages[contact.messages.length - 1].time : ''}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        {/* Exibe o texto da última mensagem do chat */}
                                        <p className="text-sm text-gray-600 truncate">
                                            {contact.messages.length > 0 ? contact.messages[contact.messages.length - 1].text : 'Nenhuma mensagem'}
                                        </p>
                                        {contact.unread > 0 && (
                                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{contact.unread}</span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Conversation Area */}
                <div className="w-2/3 flex flex-col">
                    {currentChat ? (
                        <>
                            <div className="p-4 bg-gray-100 border-b border-gray-200 flex items-center">
                                <img src={currentChat.profilePicture} alt="Foto de Perfil do Contato" className="w-10 h-10 rounded-full object-cover mr-3"/>
                                <h2 className="text-xl font-bold text-gray-800">{currentChat.name}</h2>
                            </div>
                            <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
                                {currentChat.messages.map(msg => (
                                    <div key={msg.id} className={`flex mb-3 ${msg.sender === 'Você' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`inline-block p-3 rounded-xl max-w-[70%] ${msg.sender === 'Você' ? 'bg-green-200 text-gray-800 rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                            <p className="font-semibold text-sm mb-1">{msg.sender}</p>
                                            <p>{msg.text}</p>
                                            <p className="text-xs text-right mt-1 text-gray-500">{msg.time}</p>
                                        </div>
                                    </div>
                                ))}\
                                <div ref={messagesEndRef} />
                            </div>
                            <form onSubmit={handleSendMessage} className="p-4 bg-gray-100 border-t border-gray-200 flex space-x-2">
                                <input
                                    type="text"
                                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Escreva sua mensagem..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md">Enviar</button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-grow flex items-center justify-center text-gray-500">
                            Selecione um chat para começar a conversar.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};


// New placeholder pages for Instructor and Admin dashboards
const StudentProgressPage = ({ navigate }) => {
    // Simulated student progress data
    const studentsData = [
        { id: 1, name: 'Alice Silva', course: 'Introdução ao Python', progress: 75, quizzesCompleted: 3, lastActivity: 'Módulo 4' },
        { id: 2, name: 'Bruno Mendes', course: 'Marketing Digital Essencial', progress: 50, quizzesCompleted: 2, lastActivity: 'Módulo 3' },
        { id: 3, name: 'Carla Dias', course: 'Fundamentos de Design UX/UI', progress: 90, quizzesCompleted: 4, lastActivity: 'Projeto Final' },
        { id: 4, name: 'David Costa', course: 'Introdução à Programação Python', progress: 30, quizzesCompleted: 1, lastActivity: 'Módulo 1' },
    ];

    return (
        <div className="container mx-auto py-12 px-4 md:py-16 text-center">
            <section className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200">
                <h1 className="text-3xl md:text-5xl font-extrabold text-blue-800 mb-8">Progresso Detalhado dos Alunos</h1>
                <p className="text-lg text-gray-700 mb-6">Acompanhe o desempenho e as atividades dos seus alunos em tempo real.</p>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Aluno</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Curso</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Progresso</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Quizzes Concluídos</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Última Atividade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {studentsData.map(student => (
                                <tr key={student.id} className="hover:bg-gray-50 transition duration-150">
                                    <td className="py-4 px-6 whitespace-nowrap text-gray-800 font-medium">{student.name}</td>
                                    <td className="py-4 px-6 whitespace-nowrap text-gray-700">{student.course}</td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${student.progress}%` }}></div>
                                        </div>
                                        <span className="text-sm text-gray-600 ml-2">{student.progress}%</span>
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap text-gray-700">{student.quizzesCompleted}</td>
                                    <td className="py-4 px-6 whitespace-nowrap text-gray-700">{student.lastActivity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button onClick={() => navigate('instructor-dashboard')} className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md">Voltar ao Painel do Instrutor</button>
            </section>
        </div>
    );
};

const LiveSessionSchedulingPage = ({ navigate }) => {
    const [sessionTitle, setSessionTitle] = useState('');
    const [sessionDate, setSessionDate] = useState('');
    const [sessionTime, setSessionTime] = useState('');
    const [sessionCourse, setSessionCourse] = useState('');
    const [message, setMessage] = useState('');

    const [upcomingSessions, setUpcomingSessions] = useState([
        { id: 1, title: 'Revisão Python Avançado', date: '15/06/2025', time: '14:00', course: 'Introdução à Programação Python' },
        { id: 2, title: 'Q&A Marketing Digital', date: '20/06/2025', time: '10:00', course: 'Marketing Digital Essencial' },
    ]);

    const handleScheduleSession = (e) => {
        e.preventDefault();
        if (sessionTitle && sessionDate && sessionTime && sessionCourse) {
            const newSession = {
                id: Date.now(),
                title: sessionTitle,
                date: sessionDate,
                time: sessionTime,
                course: sessionCourse
            };
            setUpcomingSessions([...upcomingSessions, newSession]);
            setMessage('Aula ao vivo agendada com sucesso!');
            setSessionTitle('');
            setSessionDate('');
            setSessionTime('');
            setSessionCourse('');
        } else {
            setMessage('Por favor, preencha todos os campos para agendar a aula.');
        }
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="container mx-auto py-12 px-4 md:py-16 text-center">
            <section className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200">
                <h1 className="text-3xl md:text-5xl font-extrabold text-blue-800 mb-8">Agendamento de Aulas ao Vivo</h1>
                <p className="text-lg text-gray-700 mb-8">Agende e gerencie suas aulas ao vivo e sessões interativas com os alunos.</p>

                <div className="max-w-xl mx-auto bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200 mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Agendar Nova Sessão</h2>
                    <form onSubmit={handleScheduleSession} className="space-y-4">
                        <div>
                            <label htmlFor="sessionTitle" className="block text-left text-gray-700 text-sm font-medium mb-1">Título da Sessão</label>
                            <input type="text" id="sessionTitle" className="w-full p-2 border rounded-lg" value={sessionTitle} onChange={(e) => setSessionTitle(e.target.value)} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="sessionDate" className="block text-left text-gray-700 text-sm font-medium mb-1">Data</label>
                                <input type="date" id="sessionDate" className="w-full p-2 border rounded-lg" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} required />
                            </div>
                            <div>
                                <label htmlFor="sessionTime" className="block text-left text-gray-700 text-sm font-medium mb-1">Hora</label>
                                <input type="time" id="sessionTime" className="w-full p-2 border rounded-lg" value={sessionTime} onChange={(e) => setSessionTime(e.target.value)} required />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="sessionCourse" className="block text-left text-gray-700 text-sm font-medium mb-1">Curso Associado</label>
                            <select id="sessionCourse" className="w-full p-2 border rounded-lg" value={sessionCourse} onChange={(e) => setSessionCourse(e.target.value)} required>
                                <option value="">Selecione um Curso</option>
                                {mockCourses.map(course => (
                                    <option key={course.id} value={course.title}>{course.title}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full shadow-md">Agendar Sessão</button>
                    </form>
                    {message && <p className="text-center mt-4 text-sm font-semibold text-green-600">{message}</p>}
                </div>

                <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Próximas Aulas ao Vivo</h2>
                    {upcomingSessions.length > 0 ? (
                        <ul className="space-y-3 text-left">
                            {upcomingSessions.map(session => (
                                <li key={session.id} className="p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <p className="font-bold text-gray-900">{session.title}</p>
                                    <p className="text-sm text-gray-700">Curso: {session.course}</p>
                                    <p className="text-sm text-gray-600">Data: {session.date} às {session.time}</p>
                                    <button onClick={() => alert(`Iniciar sessão de "${session.title}" (simulado)`)} className="mt-2 text-blue-600 hover:underline text-sm">Iniciar Sessão</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">Nenhuma aula ao vivo agendada.</p>
                    )}
                </div>

                <button onClick={() => navigate('instructor-dashboard')} className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md">Voltar ao Painel do Instrutor</button>
            </section>
        </div>
    );
};

const QAManagementPage = ({ navigate }) => {
    const [questions, setQuestions] = useState([
        { id: 1, student: 'Aluno Teste', course: 'Introdução ao Python', module: 'Módulo 2', question: 'Qual a diferença entre lista e tupla?', status: 'Pendente', reply: '' },
        { id: 2, student: 'Aluno X', course: 'Marketing Digital Essencial', module: 'Módulo 1', question: 'Como funciona o algoritmo de SEO do Google?', status: 'Pendente', reply: '' },
        { id: 3, student: 'Aluno Y', course: 'Fundamentos de Design UX/UI', module: 'Módulo 3', question: 'Pode me dar um exemplo de wireframe de baixa fidelidade?', status: 'Respondida', reply: 'Um wireframe de baixa fidelidade é um esboço simples da interface, focado na estrutura e funcionalidade, sem detalhes visuais. Pode ser feito com lápis e papel.' },
    ]);

    const handleReplyChange = (id, value) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, reply: value } : q));
    };

    const handleSubmitReply = (id) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, status: 'Respondida' } : q));
        alert('Resposta enviada com sucesso!');
    };

    return (
        <div className="container mx-auto py-12 px-4 md:py-16 text-center">
            <section className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200">
                <h1 className="text-3xl md:text-5xl font-extrabold text-blue-800 mb-8">Gestão de Perguntas e Respostas</h1>
                <p className="text-lg text-gray-700 mb-8">Visualize e responda às perguntas dos seus alunos, diretamente da plataforma.</p>

                <div className="space-y-6">
                    {questions.length > 0 ? (
                        questions.map(q => (
                            <div key={q.id} className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200 text-left">
                                <p className="text-sm text-gray-500 mb-2">Aluno: <span className="font-semibold">{q.student}</span> | Curso: {q.course} | Módulo: {q.module}</p>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Pergunta: {q.question}</h3>
                                {q.status === 'Pendente' ? (
                                    <>
                                        <textarea
                                            placeholder="Escreva a sua resposta aqui..."
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                                            rows="4"
                                            value={q.reply}
                                            onChange={(e) => handleReplyChange(q.id, e.target.value)}
                                        ></textarea>
                                        <button onClick={() => handleSubmitReply(q.id)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full shadow-md">
                                            Enviar Resposta
                                        </button>
                                    </>
                                ) : (
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                        <p className="font-semibold text-blue-800 mb-2">Resposta:</p>
                                        <p className="text-gray-700">{q.reply}</p>
                                        <p className="text-sm text-gray-500 mt-2">Status: <span className="font-bold text-green-700">{q.status}</span></p>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">Nenhuma pergunta pendente no momento.</p>
                    )}
                </div>

                <button onClick={() => navigate('instructor-dashboard')} className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md">Voltar ao Painel do Instrutor</button>
            </section>
        </div>
    );
};

const UserManagementPage = ({ navigate }) => {
    const [users, setUsers] = useState([
        { id: 'user123', name: 'Aluno Teste', email: 'aluno@uerj.com', role: 'student', status: 'Ativo' },
        { id: 'instrutor456', name: 'Instrutor Exemplo', email: 'instrutor@uerj.com', role: 'instructor', status: 'Ativo' },
        { id: 'admin789', name: 'Admin Geral', email: 'admin@uerj.com', role: 'admin', status: 'Ativo' },
        { id: 'user-inactive', name: 'Usuário Inativo', email: 'inativo@uerj.com', role: 'student', status: 'Inativo' },
    ]);

    const handleToggleStatus = (id) => {
        setUsers(users.map(user =>
            user.id === id ? { ...user, status: user.status === 'Ativo' ? 'Inativo' : 'Ativo' } : user
        ));
    };

    const handleDeleteUser = (id) => {
        if (window.confirm('Tem certeza de que deseja excluir este usuário? (Simulado)')) {
            setUsers(users.filter(user => user.id !== id));
            alert('Utilizador excluído com sucesso! (Simulado)');
        }
    };

    return (
        <div className="container mx-auto py-12 px-4 md:py-16 text-center">
            <section className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200">
                <h1 className="text-3xl md:text-5xl font-extrabold text-blue-800 mb-8">Gestão de Utilizadores</h1>
                <p className="text-lg text-gray-700 mb-8">Visualize e gerencie todos os utilizadores da plataforma.</p>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Nome</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Função</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 transition duration-150">
                                    <td className="py-4 px-6 whitespace-nowrap text-gray-800 font-medium">{user.name}</td>
                                    <td className="py-4 px-6 whitespace-nowrap text-gray-700">{user.email}</td>
                                    <td className="py-4 px-6 whitespace-nowrap text-gray-700">{user.role}</td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap text-left text-sm font-medium">
                                        <button onClick={() => handleToggleStatus(user.id)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                            {user.status === 'Ativo' ? 'Desativar' : 'Ativar'}
                                        </button>
                                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900">
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button onClick={() => navigate('admin-dashboard')} className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md">Voltar ao Painel do Administrador</button>
            </section>
        </div>
    );
};

const ReportsPage = ({ navigate }) => {
    const reportsData = {
        userSignups: [
            { month: 'Jan', count: 120 }, { month: 'Fev', count: 150 }, { month: 'Mar', count: 130 },
            { month: 'Abr', count: 180 }, { month: 'Mai', count: 200 }, { month: 'Jun', count: 220 },
        ],
        courseEnrollments: [
            { course: 'Python Intro', enrollments: 850 },
            { course: 'Marketing Digital', enrollments: 620 },
            { course: 'UX/UI Design', enrollments: 410 },
        ],
        activeUsers: '75%',
        averageCompletionRate: '68%',
    };

    return (
        <div className="container mx-auto py-12 px-4 md:py-16 text-center">
            <section className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200">
                <h1 className="text-3xl md:text-5xl font-extrabold text-blue-800 mb-8">Relatórios e Análises</h1>
                <p className="text-lg text-gray-700 mb-8">Obtenha insights valiosos sobre o desempenho da plataforma e a atividade dos utilizadores.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Relatório de Registos de Utilizadores */}
                    <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Registos de Utilizadores (Últimos 6 meses)</h2>
                        <ul className="text-left space-y-2 text-gray-700">
                            {reportsData.userSignups.map((data, index) => (
                                <li key={index}>{data.month}: {data.count} novos registos</li>
                            ))}
                        </ul>
                    </div>

                    {/* Relatório de Inscrições em Cursos */}
                    <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Inscrições em Cursos Populares</h2>
                        <ul className="text-left space-y-2 text-gray-700">
                            {reportsData.courseEnrollments.map((data, index) => (
                                <li key={index}>{data.course}: {data.enrollments} inscrições</li>
                            ))}
                        </ul>
                    </div>

                    {/* Métricas Chave */}
                    <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200 col-span-full">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Métricas Chave</h2>
                        <div className="flex justify-around items-center">
                            <div>
                                <p className="text-4xl font-bold text-green-600">{reportsData.activeUsers}</p>
                                <p className="text-gray-700">Utilizadores Ativos</p>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-blue-600">{reportsData.averageCompletionRate}</p>
                                <p className="text-gray-700">Taxa Média de Conclusão de Curso</p>
                            </div>
                        </div>
                    </div>
                </div>

                <button onClick={() => navigate('admin-dashboard')} className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md">Voltar ao Painel do Administrador</button>
            </section>
        </div>
    );
};

const SystemLogsPage = ({ navigate }) => {
    const systemLogs = [
        'INFO [2025-06-10 14:30]: Novo utilizador registado: aluno@uerj.com (ID: user123)',
        'AVISO [2025-06-10 14:35]: Tentativa de autenticação falhada para instrutor@uerj.com (IP: 192.168.1.10). Credenciais inválidas.',
        'DEBUG [2025-06-10 14:40]: Curso "Introdução ao Python" acedido por Aluno Teste. Progresso atualizado para 60%.',
        'INFO [2025-06-10 14:45]: Notificação enviada para Aluno Teste: "Novo quiz disponível! Para o Módulo 1 de Python.". Status: Entregue.',
        'ERRO [2025-06-10 14:50]: Falha no processamento de pagamento. Código: 5002. Motivo: Cartão de crédito recusado (Utilizador: teste@uerj.com).',
        'INFO [2025-06-10 15:00]: Backup da base de dados concluído com sucesso. Último backup: 2025-06-09 23:00.',
        'AVISO [2025-06-10 15:15]: Utilização de CPU elevada (85%) no servidor de aplicação. Monitoramento contínuo.',
        'INFO [2025-06-10 15:30]: Novo tópico criado no fórum: "Dúvidas sobre o projeto final" por Aluno Teste.',
    ];

    return (
        <div className="container mx-auto py-12 px-4 md:py-16 text-center">
            <section className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200">
                <h1 className="text-3xl md:text-5xl font-extrabold text-blue-800 mb-8">Registos Detalhados do Sistema</h1>
                <p className="text-lg text-gray-700 mb-8">Visualize os registos de eventos do sistema para monitoramento e depuração.</p>

                <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Últimos Registos de Atividade</h2>
                    <div className="bg-white p-4 rounded-lg h-96 overflow-y-auto text-sm text-gray-700 font-mono text-left border border-gray-300">
                        {systemLogs.map((log, index) => (
                            <p key={index} className="mb-1">{log}</p>
                        ))}
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button onClick={() => alert('Download de logs (simulado)')} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full shadow-md mr-2">Descarregar Logs</button>
                        <button onClick={() => alert('Filtros de logs (simulado)')} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-full shadow-md">Aplicar Filtros</button>
                    </div>
                </div>

                <button onClick={() => navigate('admin-dashboard')} className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md">Voltar ao Painel do Administrador</button>
            </section>
        </div>
    );
};
export default App;
