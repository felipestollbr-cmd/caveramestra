import { useState, useEffect } from 'react';
import { PlayCircle, Users, MessageSquare, Crown, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// --- Tipos ---
interface Course {
  id: string;
  title: string;
  description: string;
  lessons_count: number;
  featured: boolean;
  is_free: boolean;
  cover_image: string;
}

// --- Mock Data ---
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Jornada do Caverna Mestra',
    description: 'O curso definitivo para você dominar sua vida e se tornar um verdadeiro líder.',
    lessons_count: 50,
    featured: true,
    is_free: false,
    cover_image: '/images/jornada-caverna-mestra.jpg',
  },
  {
    id: '2',
    title: 'Protocolo Ordem no Caos',
    description: 'Aprenda a organizar sua rotina, finanças e relacionamentos.',
    lessons_count: 25,
    featured: true,
    is_free: true,
    cover_image: '/images/protocolo-ordem-no-caos.jpg',
  },
  {
    id: '3',
    title: 'Forja do Templo',
    description: 'Transforme seu corpo e mente com treinos e desafios de alta intensidade.',
    lessons_count: 30,
    featured: false,
    is_free: false,
    cover_image: '/images/forja-do-templo.jpg',
  },
];

const fetchCoursesAndProgress = async (userId: string | undefined) => {
  console.log(`Buscando cursos para o usuário ${userId}`);
  const enrollments = new Map<string, number>();
  enrollments.set('1', 60);
  enrollments.set('2', 100);
  return new Promise<{ courses: Course[], enrollments: Map<string, number> }>(resolve => 
    setTimeout(() => resolve({ courses: mockCourses, enrollments }), 500)
  );
};
// --- Fim Mock Data ---

const Cursos = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (!user) return;
      const { courses: fetchedCourses, enrollments: fetchedEnrollments } = await fetchCoursesAndProgress(user.id);
      setCourses(fetchedCourses);
      setEnrollments(fetchedEnrollments);
      setLoading(false);
    };

    loadData();
  }, [user]);

  const getProgress = (courseId: string) => enrollments.get(courseId) || 0;

  const featuredCourse = courses.find(c => c.featured);
  const otherCourses = courses.filter(c => !c.featured);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-caverna-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-caverna-accent"></div>
      </div>
    );
  }

  return (
    <div className="bg-caverna-bg text-caverna-text p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Cabeçalho */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-bold text-white">Cursos</h1>
          <p className="text-caverna-muted mt-3 max-w-xl">Aprimore suas habilidades e fortaleça sua mente com nossos treinamentos exclusivos.</p>
        </div>
      </div>

      {/* Curso em Destaque */}
      {featuredCourse && (
        <div className="bg-caverna-card rounded-3xl overflow-hidden border border-caverna-border shadow-2xl flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <img src={featuredCourse.cover_image} alt={featuredCourse.title} className="w-full h-full object-cover object-center" />
          </div>
          <div className="md:w-1/2 p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="text-caverna-accent" size={20} />
                <h3 className="font-bold text-caverna-accent uppercase tracking-widest text-sm">Curso em Destaque</h3>
              </div>
              <h2 className="text-3xl font-bold mb-3 text-white">{featuredCourse.title}</h2>
              <p className="text-caverna-muted mb-6 text-base leading-relaxed">{featuredCourse.description}</p>
              
              <div className="flex items-center gap-6 text-sm text-zinc-300 mb-6">
                  <div className="flex items-center gap-2"><PlayCircle size={18} /> {featuredCourse.lessons_count} Aulas</div>
                  <div className="flex items-center gap-2"><Users size={18} /> +3.000 Alunos</div>
                  <div className="flex items-center gap-2"><MessageSquare size={18} /> Comunidade</div>
              </div>
            </div>

            <div>
                <div className="w-full bg-caverna-border rounded-full h-2.5 mb-2">
                    <div className="bg-caverna-accent h-2.5 rounded-full" style={{ width: `${getProgress(featuredCourse.id)}%` }}></div>
                </div>
                <div className="text-right text-xs font-semibold text-caverna-muted mb-4">{getProgress(featuredCourse.id)}% COMPLETO</div>

                <button className="w-full bg-caverna-accent hover:bg-amber-400 text-zinc-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(232,142,10,0.2)] hover:shadow-[0_0_30px_rgba(232,142,10,0.4)]">
                    <PlayCircle size={20} />
                    <span>Continuar Jornada</span>
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Outros Cursos */}
      <h2 className="text-2xl font-bold mb-6 pt-4 border-t border-caverna-border">Outros Cursos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {otherCourses.map(course => {
          const progress = getProgress(course.id);
          const isCompleted = progress === 100;
          const isLocked = !course.is_free && progress === 0;

          return (
            <div key={course.id} className="bg-caverna-card rounded-2xl overflow-hidden border border-caverna-border shadow-lg flex flex-col justify-between transition-transform hover:scale-105 hover:shadow-caverna-accent/10">
              <div>
                  <img src={course.cover_image} alt={course.title} className="w-full h-40 object-cover" />
                  <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 text-white">{course.title}</h3>
                      <p className="text-caverna-muted text-xs mb-4">{course.lessons_count} aulas</p>
                  </div>
              </div>
              <div className="p-5 pt-0">
                  {isLocked ? (
                     <div className="flex items-center justify-center w-full bg-caverna-border text-caverna-muted font-bold py-3 rounded-lg gap-2">
                        <Lock size={16} />
                        <span>Exclusivo para Membros</span>
                     </div>
                  ) : (
                    <>
                      <div className="w-full bg-caverna-border rounded-full h-1.5 mb-1.5">
                          <div className={`h-1.5 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-caverna-accent'}`} style={{ width: `${progress}%` }}></div>
                      </div>
                      <div className="text-right text-[10px] font-semibold text-caverna-muted mb-3">{progress}%</div>
                      <button className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-3 rounded-lg transition-colors">
                        {isCompleted ? 'Revisar Curso' : 'Acessar Aulas'}
                      </button>
                    </>
                  )}
              </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cursos;
