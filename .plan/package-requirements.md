# Package Requirements - Rill

## Frontend Dependencies

### Core Framework & Build Tools
```json
{
  "dependencies": {
    "@inertiajs/react": "^2.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.3.0"
  }
}
```

### UI & Styling
```json
{
  "dependencies": {
    "tailwindcss": "^3.4.0",
    "@tailwindcss/forms": "^0.5.7",
    "@tailwindcss/typography": "^0.5.10",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-toast": "^1.1.5",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0"
  }
}
```

### State Management & Forms
```json
{
  "dependencies": {
    "react-hook-form": "^7.48.2",
    "@hookform/resolvers": "^3.3.2",
    "zod": "^3.22.4"
  }
}
```

### Utilities & Icons
```json
{
  "dependencies": {
    "lucide-react": "^0.302.0",
    "date-fns": "^3.0.6"
  }
}
```

### Development Tools
```json
{
  "devDependencies": {
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^3.1.1",
    "prettier-plugin-tailwindcss": "^0.5.9"
  }
}
```

## Backend Dependencies

### Core Laravel Packages
```json
{
  "require": {
    "laravel/framework": "^12.0",
    "laravel/sanctum": "^4.0",
    "inertiajs/inertia-laravel": "^2.1"
  }
}
```

### Database & Storage
```json
{
  "require": {
    "doctrine/dbal": "^4.0"
  }
}
```

### Development & Testing
```json
{
  "require-dev": {
    "pestphp/pest": "^3.0",
    "pestphp/pest-plugin-laravel": "^3.0",
    "laravel/pint": "^1.13",
    "nunomaduro/collision": "^8.0",
    "spatie/laravel-ignition": "^2.4"
  }
}
```

### Optional Enhancement Packages
```json
{
  "require": {
    "spatie/laravel-backup": "^8.8",
    "spatie/laravel-translatable": "^6.5",
    "league/flysystem-aws-s3-v3": "^3.0"
  }
}
```

## Tailwind Config

### plugins và extensions
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './resources/js/**/*.{js,ts,jsx,tsx}',
    './resources/views/**/*.blade.php',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

## Development Setup Commands

### Initial Setup
```bash
# Laravel setup
composer install
npm install

# Database setup
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed

# Frontend build
npm run dev
```

### Development Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"resources/js/**/*.{ts,tsx}\"",
    "type-check": "tsc --noEmit"
  }
}
```

### Code Quality Tools

#### ESLint Config (eslint.config.js)
```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': 'error',
    'prefer-const': 'error',
  },
}
```

#### Prettier Config (.prettierrc)
```json
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

## VS Code Extensions Recommendations

### Required Extensions
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "bmewburn.vscode-intelephense-client",
    "ms-vscode.vscode-json"
  ]
}
```

### Optional But Helpful
```json
{
  "recommendations": [
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-todo-highlight",
    "usernamehw.errorlens"
  ]
}
```

## Simple Role System Alternative

### Database Schema Change
```sql
-- Thay vì bảng roles + model_has_roles phức tạp
-- Chỉ cần 1 cột enum trong users table:

ALTER TABLE users ADD COLUMN role ENUM('admin', 'customer') DEFAULT 'customer';
-- Không cần bảng roles và model_has_roles nữa
```

### Laravel Implementation
```php
// User Model
class User extends Authenticatable
{
    protected $fillable = ['email', 'password', 'role', /* other fields */];

    protected $casts = [
        'role' => 'string',
    ];

    // Simple role checks
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }
}

// Middleware
class EnsureUserIsAdmin
{
    public function handle($request, Closure $next)
    {
        if (!auth()->user()?->isAdmin()) {
            abort(403);
        }
        return $next($request);
    }
}

// Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::resource('products', ProductController::class);
    Route::resource('orders', OrderController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);
});
```

### Benefits of Simple Approach
1. **Performance**: Không cần join tables
2. **Simplicity**: Dễ hiểu, dễ maintain
3. **Laravel Native**: Sử dụng enum và middleware có sẵn
4. **No Dependencies**: Giảm complexity
5. **Sufficient**: Đủ cho requirements của Rill

---
