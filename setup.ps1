# RideHub Setup and Run Script for Windows PowerShell

Write-Host "🚗 RideHub - Vehicle Rental Platform Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command {
    param($Command)
    try {
        if (Get-Command $Command -ErrorAction Stop) {
            return $true
        }
    }
    catch {
        return $false
    }
}

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

if (-not (Test-Command "node")) {
    Write-Host "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "mongo")) {
    Write-Host "⚠️  MongoDB CLI not found. Make sure MongoDB is running." -ForegroundColor Yellow
} else {
    Write-Host "✅ MongoDB CLI found" -ForegroundColor Green
}

Write-Host "✅ Node.js is installed: $(node --version)" -ForegroundColor Green
Write-Host ""

# Setup Backend
Write-Host "📦 Setting up Backend..." -ForegroundColor Cyan
Set-Location -Path "backend"

if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file from example..." -ForegroundColor Yellow
    Copy-Item ".env.example" -Destination ".env"
    Write-Host "✅ .env file created. Please update with your configuration." -ForegroundColor Green
}

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Backend dependencies already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "Would you like to seed the database with sample data? (Y/N)" -ForegroundColor Yellow
$seedResponse = Read-Host

if ($seedResponse -eq "Y" -or $seedResponse -eq "y") {
    Write-Host "Seeding database..." -ForegroundColor Yellow
    npm run seed
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database seeded successfully" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Seeding failed. Make sure MongoDB is running." -ForegroundColor Yellow
    }
}

Set-Location -Path ".."

# Setup Frontend
Write-Host ""
Write-Host "📦 Setting up Frontend..." -ForegroundColor Cyan
Set-Location -Path "frontend"

if (-not (Test-Path ".env")) {
    Write-Host "Creating frontend .env file..." -ForegroundColor Yellow
    "REACT_APP_API_URL=http://localhost:5000/api" | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ Frontend .env file created" -ForegroundColor Green
}

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Frontend dependencies already installed" -ForegroundColor Green
}

Set-Location -Path ".."

# Display success message
Write-Host ""
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host "1. Backend:  cd backend  ; npm run dev" -ForegroundColor White
Write-Host "2. Frontend: cd frontend ; npm start" -ForegroundColor White
Write-Host ""
Write-Host "Or run both in separate terminals" -ForegroundColor Yellow
Write-Host ""
Write-Host "Demo Login Credentials:" -ForegroundColor Cyan
Write-Host "Customer:    john@customer.com / customer123" -ForegroundColor White
Write-Host "Shop Owner:  rajesh@shop.com / shop123" -ForegroundColor White
Write-Host ""
Write-Host "Backend will run on:  http://localhost:5000" -ForegroundColor Yellow
Write-Host "Frontend will run on: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
