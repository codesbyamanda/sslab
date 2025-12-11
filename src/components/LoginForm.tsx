import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular login - redirecionar para seleção de serviços
    navigate("/services");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      {/* Email Input */}
      <div className="space-y-2">
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-cinza-profissional"
        >
          Login
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="input-premium pl-12"
            required
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <label 
          htmlFor="password" 
          className="block text-sm font-medium text-cinza-profissional"
        >
          Senha
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input-premium pl-12 pr-12"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button type="submit" className="btn-primary-premium w-full mt-6">
        Acessar
      </button>

      {/* Forgot Password Link */}
      <div className="text-center pt-2">
        <a href="#" className="link-premium text-sm">
          Esqueci minha senha
        </a>
      </div>
    </form>
  );
};

export default LoginForm;
