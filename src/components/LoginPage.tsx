import React, { useState, useEffect } from 'react';
import { Role } from '../types/induction';
import { SenaLogo } from './SenaLogo';
import { User, Lock, ChevronRight, BookOpen, GraduationCap, Users, UserPlus, Play } from 'lucide-react';
import { INITIAL_USERS } from '../data/users';
import { VideoTutorialModal } from './VideoTutorialModal';

interface LoginPageProps {
  onLogin: (role: Role, documentNumber?: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [documento, setDocumento] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState(INITIAL_USERS);
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Registration fields
  const [regDocumento, setRegDocumento] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<Role>('learner');

  useEffect(() => {
    const savedUsers = localStorage.getItem('sena_users');
    if (savedUsers) {
      try {
        const parsed = JSON.parse(savedUsers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setUsers(parsed);
        }
      } catch {}
    }
  }, []);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setErrorMessage('');
    setDocumento('');
    setPassword('');
  };

  const handleLogin = () => {
    if (!selectedRole) return;
    setErrorMessage('');

    // If user enters any document/password, check against list
    const foundUser = users.find(u => u.id === documento && u.password === password);
    
    if (!foundUser) {
      // Allow seamless first-time entry or custom document for learner/instructor
      if (documento.trim() && password.trim()) {
        const newUser = { id: documento.trim(), role: selectedRole, password: password.trim() };
        const updated = [...users, newUser];
        setUsers(updated);
        try {
          localStorage.setItem('sena_users', JSON.stringify(updated));
        } catch {}
        onLogin(selectedRole, documento.trim());
        return;
      }
      setErrorMessage('Credenciales incorrectas. Ingresa con el usuario de prueba o regístrate.');
      return;
    }

    // Role restrictions
    const canAccess = foundUser.role === 'instructor' || foundUser.role === selectedRole;
    if (!canAccess) {
      setErrorMessage(`El usuario '${documento}' tiene rol de ${foundUser.role}, no de ${selectedRole}.`);
      return;
    }

    onLogin(selectedRole, documento);
  };

  const handleQuickLogin = (role: Role, doc: string = '1020485921') => {
    onLogin(role, doc);
  };

  const handleRegister = () => {
    if (!regDocumento || !regPassword) {
      alert('Por favor completa todos los campos');
      return;
    }
    if (users.find(u => u.id === regDocumento)) {
      alert('El usuario ya existe');
      return;
    }
    const newUser = { id: regDocumento, role: regRole, password: regPassword };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('sena_users', JSON.stringify(updatedUsers));
    alert('Registro exitoso. Ahora puedes iniciar sesión.');
    setIsRegistering(false);
    setSelectedRole(regRole);
    setDocumento(regDocumento);
    setPassword(regPassword);
  };

  const getGreeting = () => {
    if (isRegistering) return 'Registro de Usuario';
    switch (selectedRole) {
      case 'learner': return '¡Bienvenido al Rol de Aprendiz!';
      case 'instructor': return '¡Bienvenido al Rol de Instructor!';
      case 'bienestar': return '¡Bienvenido a Bienestar al Aprendiz!';
      default: return 'Portal de Inducción SENA';
    }
  };

  const roleModules = [
    {
      id: 'learner',
      label: 'Rol de Aprendiz',
      icon: BookOpen,
      badge: 'Ficha de Caracterización al Ingreso',
      description: 'Diligencia tu ficha inicial, explora módulos, firma el pacto y obtén tu certificación.'
    },
    {
      id: 'instructor',
      label: 'Rol de Instructor',
      icon: GraduationCap,
      badge: 'Gestión Ficha 2873190',
      description: 'Sincronización con Google Drive, exportación a Excel y seguimiento de aprendices.'
    },
    {
      id: 'bienestar',
      label: 'Rol de Bienestar',
      icon: Users,
      badge: 'Acompañamiento Integral',
      description: 'Consulta de fichas de caracterización, demografía y compromisos institucionales.'
    },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b12] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
            <SenaLogo className="w-full h-full" variant="color" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-center">
            {getGreeting()}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm text-center max-w-lg">
            {!selectedRole && !isRegistering
              ? 'Selecciona tu rol para acceder. Al ingresar como Aprendiz se abrirá de inmediato tu Ficha de Caracterización inicial.'
              : selectedRole === 'learner'
              ? 'Ingresa tus credenciales o accede directamente para diligenciar tu Ficha de Caracterización.'
              : 'Ingresa tus credenciales institucionales para gestionar tu ficha y aprendices.'}
          </p>

          {/* Botón Video Tutorial en Landing Page */}
          <div className="mt-5 flex items-center justify-center">
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="px-5 py-2.5 bg-emerald-50 dark:bg-emerald-950/70 hover:bg-[#39A900] text-emerald-900 dark:text-emerald-200 hover:text-white dark:hover:text-white border-2 border-emerald-400/80 dark:border-emerald-700 font-bold text-xs sm:text-sm rounded-2xl shadow-sm hover:shadow-md hover:shadow-[#39A900]/25 transition-all flex items-center gap-2.5 group cursor-pointer"
              title="Ver Video Tutorial del Boot Camp de Inducción"
            >
              <div className="w-7 h-7 rounded-xl bg-[#39A900] text-white flex items-center justify-center group-hover:bg-white group-hover:text-[#39A900] transition-colors shrink-0 shadow-xs">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
              <span className="font-extrabold tracking-wide">Video Tutorial</span>
              <span className="text-[10px] font-semibold bg-emerald-200/80 dark:bg-emerald-800/80 px-2 py-0.5 rounded-full text-emerald-950 dark:text-emerald-100 group-hover:bg-white/20 group-hover:text-white">
                Guía en Video
              </span>
            </button>
          </div>
        </div>

        {isRegistering ? (
          <div className="max-w-sm mx-auto space-y-6">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Número de Documento"
                value={regDocumento}
                onChange={(e) => setRegDocumento(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
              />
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value as Role)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
              >
                <option value="learner">Aprendiz</option>
                <option value="instructor">Instructor</option>
                <option value="bienestar">Bienestar</option>
              </select>
            </div>
            <button
              onClick={handleRegister}
              className="w-full py-3 bg-[#39A900] hover:bg-[#2d7a04] text-white font-bold rounded-xl shadow-md transition-colors"
            >
              Registrarse
            </button>
            <button
              onClick={() => setIsRegistering(false)}
              className="w-full py-2 text-slate-500 hover:text-slate-900 dark:hover:text-white text-sm"
            >
              Volver al inicio
            </button>
          </div>
        ) : !selectedRole ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {roleModules.map((role) => (
                <div
                  key={role.id}
                  className="flex flex-col justify-between p-6 bg-slate-50 dark:bg-slate-800/80 hover:bg-[#39A900]/5 rounded-2xl transition-all border border-slate-200 dark:border-slate-700 hover:border-[#39A900] shadow-xs group"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#39A900] mb-3 group-hover:scale-105 transition-transform">
                      <role.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 mb-2">
                      {role.badge}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">{role.label}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">{role.description}</p>
                  </div>

                  <div className="space-y-2 mt-auto">
                    <button
                      onClick={() => handleRoleSelect(role.id as Role)}
                      className="w-full py-2.5 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-[#39A900] dark:hover:border-[#39A900] text-slate-800 dark:text-slate-100 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Iniciar Sesión</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setIsRegistering(true)}
                className="text-xs text-[#39A900] dark:text-[#4cd900] font-bold hover:underline inline-flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>¿No tienes cuenta de usuario? Regístrate aquí</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-sm mx-auto space-y-5">
            {errorMessage && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-200 text-xs">
                {errorMessage}
              </div>
            )}

            {selectedRole === 'learner' && (
              <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-3 rounded-xl text-xs text-emerald-900 dark:text-emerald-200">
                <span className="font-bold block mb-1">📋 Ficha de Caracterización de Ingreso</span>
                Al acceder al rol de aprendiz se abrirá automáticamente el formulario para verificar y diligenciar tu ficha institucional.
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Documento de Identidad
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Documento de identidad"
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={handleLogin}
                className="w-full py-3 bg-[#39A900] hover:bg-[#2d7a04] text-white font-bold rounded-xl transition-colors shadow-lg shadow-[#39A900]/20 text-sm flex items-center justify-center gap-2"
              >
                <span>Acceder al Módulo de {selectedRole === 'learner' ? 'Aprendiz' : selectedRole === 'instructor' ? 'Instructor' : 'Bienestar'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSelectedRole(null)}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                ← Volver a la selección de roles
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Ventana Flotante del Video Tutorial */}
      <VideoTutorialModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </div>
  );
};
