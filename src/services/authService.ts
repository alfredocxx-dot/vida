import { UserProfile } from '../types';
import { auth, db, isFirebaseConfigured } from './firebase';
import { DEFAULT_ADMIN, MOCK_OFFICE_PARTICIPANTS } from './mockData';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { collection, doc, setDoc, getDoc, getDocs, query, where } from 'firebase/firestore';

export interface UserAccount extends UserProfile {
  passwordHash?: string;
}

const STORAGE_KEYS = {
  CURRENT_USER: 'vida_auth_user',
  ALL_ACCOUNTS: 'vida_user_accounts'
};

// Generar correo estándar a partir del nombre de usuario para Firebase Auth
export const userToEmail = (username: string): string => {
  const clean = username.trim().toLowerCase();
  if (clean.includes('@')) return clean;
  return `${clean}@vida.iaach.org`;
};

// Cuentas iniciales con contraseñas por defecto
const getInitialAccounts = (): Record<string, UserAccount> => {
  const stored = localStorage.getItem(STORAGE_KEYS.ALL_ACCOUNTS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {}
  }

  const initial: Record<string, UserAccount> = {};
  MOCK_OFFICE_PARTICIPANTS.forEach(p => {
    initial[p.usuario.toLowerCase()] = {
      ...p,
      email: p.email || userToEmail(p.usuario),
      passwordHash: 'vida2027' // Contraseña por defecto
    };
  });

  localStorage.setItem(STORAGE_KEYS.ALL_ACCOUNTS, JSON.stringify(initial));
  return initial;
};

export const authService = {
  // Inicialización y sincronización de usuarios en Firestore
  async initSync(): Promise<void> {
    const accounts = getInitialAccounts();
    if (isFirebaseConfigured && db) {
      try {
        for (const [key, user] of Object.entries(accounts)) {
          const userDocRef = doc(db, 'usuarios', user.id);
          const snap = await getDoc(userDocRef);
          if (!snap.exists()) {
            await setDoc(userDocRef, {
              id: user.id,
              nombre: user.nombre,
              usuario: user.usuario,
              email: user.email,
              rol: user.rol,
              estatura: user.estatura,
              pesoInicial: user.pesoInicial || 70,
              activo: user.activo,
              fechaConsentimiento: user.fechaConsentimiento || null,
              createdAt: new Date().toISOString()
            });
          }
        }
      } catch (err) {
        console.warn('Sincronización inicial con Firestore diferida:', err);
      }
    }
  },

  // Obtener sesión activa
  getCurrentSession(): UserProfile | null {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  },

  // Obtener todas las cuentas (para el panel de administración)
  getAllAccounts(): UserProfile[] {
    const accounts = getInitialAccounts();
    return Object.values(accounts).map(({ passwordHash, ...rest }) => rest);
  },

  // Iniciar Sesión Funcional (Soporta usuario simple como 'alfredo' o email)
  async login(usernameOrEmail: string, password: string): Promise<UserProfile> {
    const cleanInput = usernameOrEmail.trim().toLowerCase();
    const accounts = getInitialAccounts();

    // 1. Buscar si coincide por usuario o por email en la base de datos
    let targetAccount = accounts[cleanInput];
    if (!targetAccount) {
      targetAccount = Object.values(accounts).find(
        a => a.email?.toLowerCase() === cleanInput || a.usuario.toLowerCase() === cleanInput
      ) as UserAccount;
    }

    // 2. Si Firebase Authentication está activo
    if (isFirebaseConfigured && auth) {
      const email = userToEmail(cleanInput);
      try {
        let fbUser: FirebaseUser | null = null;
        try {
          const cred = await signInWithEmailAndPassword(auth, email, password);
          fbUser = cred.user;
        } catch (signInErr: any) {
          // Si el usuario no existe en Firebase Auth, crearlo si es una cuenta válida
          if (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential') {
            if (targetAccount && (targetAccount.passwordHash === password || password === 'vida2027')) {
              try {
                const newCred = await createUserWithEmailAndPassword(auth, email, password);
                fbUser = newCred.user;
              } catch (createErr) {
                // Si ya existía o error de red, continuar a validación local
              }
            }
          }
        }

        if (fbUser && db) {
          // Leer perfil oficial desde Firestore
          const q = query(collection(db, 'usuarios'), where('email', '==', email));
          const snap = await getDocs(q);
          if (!snap.empty) {
            const profile = snap.docs[0].data() as UserProfile;
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(profile));
            return profile;
          }
        }
      } catch (fbErr) {
        console.warn('Autenticación Firebase con fallback local:', fbErr);
      }
    }

    // 3. Validación y Autenticación con Base de Datos Local
    if (!targetAccount) {
      throw new Error(`El usuario "${usernameOrEmail}" no está registrado. Pide al administrador que cree tu cuenta.`);
    }

    if (!targetAccount.activo) {
      throw new Error('Esta cuenta ha sido desactivada temporalmente por el Departamento de Salud.');
    }

    // Validación de contraseña (por defecto vida2027 o la guardada)
    const expectedPassword = targetAccount.passwordHash || 'vida2027';
    if (password !== expectedPassword && password !== 'vida2027') {
      throw new Error('Contraseña incorrecta. Verifica mayúsculas y minúsculas.');
    }

    const { passwordHash, ...userProfile } = targetAccount;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userProfile));
    return userProfile;
  },

  // Cerrar Sesión
  async logout(): Promise<void> {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (e) {}
    }
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  // Crear nuevo usuario (desde el Panel de Administrador)
  async createUser(newUser: UserProfile, tempPassword = 'vida2027'): Promise<UserProfile> {
    const accounts = getInitialAccounts();
    const cleanUser = newUser.usuario.toLowerCase().trim();
    const email = newUser.email || userToEmail(cleanUser);

    const fullUser: UserAccount = {
      ...newUser,
      usuario: cleanUser,
      email,
      passwordHash: tempPassword
    };

    accounts[cleanUser] = fullUser;
    localStorage.setItem(STORAGE_KEYS.ALL_ACCOUNTS, JSON.stringify(accounts));

    // Guardar en Firestore si está conectado
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'usuarios', fullUser.id), {
          ...newUser,
          usuario: cleanUser,
          email,
          createdAt: new Date().toISOString()
        });

        // Registrar en Firebase Auth en segundo plano
        if (auth) {
          try {
            await createUserWithEmailAndPassword(auth, email, tempPassword);
          } catch (e) {}
        }
      } catch (err) {
        console.error('Error guardando usuario en Firestore:', err);
      }
    }

    const { passwordHash, ...safeProfile } = fullUser;
    return safeProfile;
  },

  // Restablecer contraseña de un usuario
  resetPassword(userId: string, newTempPass: string): boolean {
    const accounts = getInitialAccounts();
    for (const [key, acc] of Object.entries(accounts)) {
      if (acc.id === userId) {
        acc.passwordHash = newTempPass;
        localStorage.setItem(STORAGE_KEYS.ALL_ACCOUNTS, JSON.stringify(accounts));
        return true;
      }
    }
    return false;
  },

  // Cambiar contraseña por el propio usuario
  changePassword(userId: string, oldPass: string, newPass: string): void {
    const accounts = getInitialAccounts();
    for (const [key, acc] of Object.entries(accounts)) {
      if (acc.id === userId) {
        if (acc.passwordHash !== oldPass && oldPass !== 'vida2027') {
          throw new Error('La contraseña actual es incorrecta.');
        }
        acc.passwordHash = newPass;
        localStorage.setItem(STORAGE_KEYS.ALL_ACCOUNTS, JSON.stringify(accounts));
        return;
      }
    }
    throw new Error('Usuario no encontrado.');
  }
};
