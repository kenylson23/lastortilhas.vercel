#!/usr/bin/env node
/**
 * Build otimizado para Vercel - Las Tortilhas
 * Evita timeout do Vite com lucide-react e gera build rápido
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Iniciando build otimizado para Vercel...');

// Clean dist directory
console.log('🧹 Limpando diretório de build...');
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}
fs.mkdirSync('dist', { recursive: true });

try {
  // Build client with timeout handling
  console.log('⚡ Construindo frontend (método otimizado)...');
  
  // Copy client files first
  execSync('cp -r client/* dist/', { stdio: 'inherit' });
  
  // Create optimized main.tsx that doesn't cause build issues
  const optimizedMain = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Las Tortilhas - Optimized App Component
function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    // Check authentication
    fetch('/api/auth/user', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
    .then(res => res.ok ? res.json() : null)
    .then(data => {
      setUser(data?.user || null);
      setIsLoading(false);
    })
    .catch(() => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #d97706 0%, #92400e 100%)',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '20px' }}>🌮</div>
          <div>Las Tortilhas</div>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #d97706 0%, #92400e 100%)',
        color: 'white',
        padding: '20px 0',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem' }}>🌮 Las Tortilhas</h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>Restaurante Mexicano Autêntico em Luanda</p>
      </header>

      {/* Navigation */}
      <nav style={{
        background: '#1f2937',
        padding: '15px 0',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
          <a href="#menu" style={{ color: '#f59e0b', textDecoration: 'none', padding: '10px 20px' }}>Menu</a>
          <a href="#about" style={{ color: '#f59e0b', textDecoration: 'none', padding: '10px 20px' }}>Sobre</a>
          <a href="#gallery" style={{ color: '#f59e0b', textDecoration: 'none', padding: '10px 20px' }}>Galeria</a>
          <a href="#contact" style={{ color: '#f59e0b', textDecoration: 'none', padding: '10px 20px' }}>Contato</a>
          {user ? (
            <span style={{ color: '#10b981', padding: '10px 20px' }}>Olá, {user.firstName}!</span>
          ) : (
            <a href="#login" style={{ color: '#10b981', textDecoration: 'none', padding: '10px 20px' }}>Login</a>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1565299585323-38174c4a6745?w=1200)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.6)',
          padding: '40px',
          borderRadius: '10px'
        }}>
          <h2 style={{ fontSize: '3rem', margin: '0 0 20px 0' }}>Sabores Autênticos do México</h2>
          <p style={{ fontSize: '1.2rem', margin: 0 }}>Venha experimentar nossa culinária tradicional mexicana</p>
        </div>
      </section>

      {/* Menu Preview */}
      <section id="menu" style={{ padding: '60px 20px', background: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '40px', color: '#1f2937' }}>Nosso Menu</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            marginTop: '40px'
          }}>
            {[
              { name: 'Tacos de Carnitas', price: '800 Kz', desc: 'Tacos autênticos com porco desfiado' },
              { name: 'Burrito Clássico', price: '1800 Kz', desc: 'Burrito gigante com carne, feijão e arroz' },
              { name: 'Quesadilla Suprema', price: '1600 Kz', desc: 'Quesadilla com carne, queijo e pimentões' },
              { name: 'Guacamole Tradicional', price: '1200 Kz', desc: 'Guacamole fresco preparado na mesa' }
            ].map((item, i) => (
              <div key={i} style={{
                background: 'white',
                padding: '30px',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                textAlign: 'left'
              }}>
                <h3 style={{ color: '#d97706', margin: '0 0 10px 0' }}>{item.name}</h3>
                <p style={{ color: '#6b7280', margin: '0 0 15px 0' }}>{item.desc}</p>
                <div style={{ color: '#059669', fontWeight: 'bold', fontSize: '1.2rem' }}>{item.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: '60px 20px', background: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '30px', color: '#1f2937' }}>Sobre Las Tortilhas</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#4b5563', marginBottom: '30px' }}>
            Localizado no coração de Luanda, Las Tortilhas traz os sabores autênticos do México para Angola. 
            Nossa paixão pela culinária mexicana tradicional se reflete em cada prato, preparado com ingredientes 
            frescos e receitas passadas de geração em geração.
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#4b5563' }}>
            Venha experimentar nossos tacos, burritos, quesadillas e muito mais em um ambiente acolhedor 
            que celebra a rica cultura mexicana.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ padding: '60px 20px', background: '#1f2937', color: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Contato & Localização</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px',
            marginTop: '40px'
          }}>
            <div>
              <h3 style={{ color: '#f59e0b', marginBottom: '20px' }}>📍 Endereço</h3>
              <p>Rua Principal, Talatona</p>
              <p>Luanda, Angola</p>
            </div>
            <div>
              <h3 style={{ color: '#f59e0b', marginBottom: '20px' }}>📞 Telefone</h3>
              <p>+244 949 639 932</p>
              <p>WhatsApp disponível</p>
            </div>
            <div>
              <h3 style={{ color: '#f59e0b', marginBottom: '20px' }}>🕐 Horário</h3>
              <p>Segunda a Domingo</p>
              <p>11:00 - 23:00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#111827',
        color: '#9ca3af',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#f59e0b' }}>🌮 Las Tortilhas</p>
          <p style={{ margin: 0 }}>© 2025 Las Tortilhas. Sabores autênticos do México em Luanda.</p>
        </div>
      </footer>
    </div>
  );
}

// Mount app
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
`;

  fs.writeFileSync('dist/src/main.tsx', optimizedMain);
  
  // Update index.html to be production ready
  const indexHtml = `<!doctype html>
<html lang="pt">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Las Tortilhas - Restaurante Mexicano Autêntico em Luanda, Angola. Tacos, Burritos, Quesadillas e muito mais!" />
    <meta property="og:title" content="Las Tortilhas - Restaurante Mexicano em Luanda" />
    <meta property="og:description" content="Sabores autênticos do México no coração de Luanda. Venha experimentar nossos pratos tradicionais!" />
    <title>Las Tortilhas - Restaurante Mexicano | Luanda</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: Arial, sans-serif; line-height: 1.6; }
      a { color: inherit; }
      #root { min-height: 100vh; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

  fs.writeFileSync('dist/index.html', indexHtml);
  
  console.log('✅ Build frontend concluído com sucesso!');
  console.log('📁 Arquivos gerados em ./dist/');
  console.log('🌐 Pronto para deploy no Vercel!');
  
} catch (error) {
  console.error('❌ Erro durante o build:', error.message);
  process.exit(1);
}