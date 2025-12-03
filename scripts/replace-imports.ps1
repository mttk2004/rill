# Script to replace React Router imports with Inertia imports
# This script will:
# 1. Replace Link from react-router-dom with Link from @inertiajs/react
# 2. Keep useNavigate, useParams, useLocation for now (will be handled manually per file)

$files = Get-ChildItem -Path "resources/js" -Include *.tsx,*.ts -Recurse -File

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content

    # Replace imports - be careful with the patterns
    # Pattern 1: import { Link } from 'react-router-dom';
    $content = $content -replace "import \{ Link \} from 'react-router-dom';", "import { Link } from '@inertiajs/react';"
    $content = $content -replace 'import \{ Link \} from "react-router-dom";', 'import { Link } from "@inertiajs/react";'

    # Pattern 2: import { Link, Something } from 'react-router-dom';
    # This is more complex, we'll handle it by keeping both imports for now
    if ($content -match "import \{[^}]*Link[^}]*\} from ['`"]react-router-dom['`"];") {
        # Check if there are other imports besides Link
        if ($content -match "import \{ *(Link *,.*|.*,? *Link) *\} from ['`"]react-router-dom['`"];") {
            # Multiple imports - add Inertia Link import and comment the react-router-dom line
            $content = $content -replace "(import \{[^}]*Link[^}]*\} from ['`"]react-router-dom['`"];)", "import { Link } from '@inertiajs/react';`n// TODO: Remove react-router-dom - `$1"
        }
    }

    # Only write if content changed
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated: $($file.FullName)" -ForegroundColor Green
    }
}

Write-Host "`nDone! Please review the changes and handle useNavigate, useParams, useLocation manually." -ForegroundColor Yellow
