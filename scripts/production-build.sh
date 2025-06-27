#!/bin/bash

echo "Building Las Tortilhas production site..."

# Clean and create directories
rm -rf dist
mkdir -p dist/public

# Copy all client files to production directory
cp -r client/* dist/public/

# Create a simple webpack-style bundle for production
cat > dist/public/bundle.js << 'EOF'
// Las Tortilhas Production Bundle
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './src/App.tsx';
import './src/index.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(React.createElement(App));
EOF

# Update index.html to use the bundle
sed -i 's|<script type="module" src="./src/main.tsx"></script>|<script type="module" src="./bundle.js"></script>|g' dist/public/index.html

# Create production main.tsx that imports everything properly
cat > dist/public/src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

echo "Production build completed successfully"