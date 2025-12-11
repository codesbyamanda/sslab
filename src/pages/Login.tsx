import SaudeLogo from "@/components/SaudeLogo";
import LoginForm from "@/components/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen gradient-premium-bg flex flex-col items-center justify-center px-4">
      {/* Login Card */}
      <div className="card-premium w-full max-w-md p-8 md:p-10 animate-fade-in">
        {/* Logo */}
        <div className="mb-8">
          <SaudeLogo />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-cinza-profissional mb-2">
            Acesso ao Sistema
          </h1>
          <p className="text-muted-foreground text-sm">
            Entre com suas credenciais para continuar
          </p>
        </div>

        {/* Form */}
        <LoginForm />
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center animate-fade-in">
        <p className="text-sm text-muted-foreground">
          Saúde Systems © 2025 – Sistema de Saúde e Laboratório
        </p>
      </footer>
    </div>
  );
};

export default Login;
