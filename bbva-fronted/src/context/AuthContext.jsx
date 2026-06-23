import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({});

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("bbva_user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const signIn = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        return {
          data: null,
          error: {
            message: result.detail || result.message || "Credenciales incorrectas",
          },
        };
      }

      const localUser = {
        id: result.user.id,
        pkusuario: result.user.pkusuario,
        email: result.user.email,
        user_metadata: {
          nombres: result.user.nombres,
          dni: result.user.dni,
          rol: result.user.rol,
        },
      };

      localStorage.setItem("bbva_user", JSON.stringify(localUser));
      setUser(localUser);

      return {
        data: {
          user: localUser,
        },
        error: null,
      };
    } catch (err) {
      return {
        data: null,
        error: {
          message: "No se pudo conectar con el servidor.",
        },
      };
    }
  };

const signUp = async (_email, password, metadata) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombres: metadata.nombres,
        apellidos: metadata.apellidos,
        dni: metadata.dni,
        correo: metadata.email_real,
        password: password,
        tipo_cuenta: metadata.tipo_cuenta,
        moneda: metadata.moneda,
      }),
    });

    const result = await response.json();

    if (!response.ok || result.success === false) {
      return {
        data: null,
        error: {
          message: result.detail || result.message || "No se pudo registrar.",
        },
      };
    }

    const localUser = {
      id: result.user.id,
      pkusuario: result.user.pkusuario,
      email: result.user.email,
      user_metadata: {
        nombres: result.user.nombres,
        dni: result.user.dni,
        rol: "cliente",
      },
    };

    localStorage.setItem("bbva_user", JSON.stringify(localUser));
    setUser(localUser);

    return {
      data: {
        user: localUser,
        cuenta: result.cuenta,
      },
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: {
        message: "No se pudo conectar con el servidor para registrar.",
      },
    };
  }
};

  const signOut = async () => {
    localStorage.removeItem("bbva_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);