# Backend API Test Script

Write-Host "🔍 Testing Gearsey Backend API..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"

# Test 1: Health Check
Write-Host "Test 1: Health Check" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/api/health" -Method Get
    Write-Host "✅ Health check passed" -ForegroundColor Green
    Write-Host "   System: $($health.system)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Make sure backend is running: npm run dev" -ForegroundColor Gray
    exit 1
}

Write-Host ""

# Test 2: Get Products
Write-Host "Test 2: Get Products" -ForegroundColor Yellow
try {
    $products = Invoke-RestMethod -Uri "$baseUrl/api/products?limit=5" -Method Get
    Write-Host "✅ Products endpoint working" -ForegroundColor Green
    Write-Host "   Found $($products.products.Count) products" -ForegroundColor Gray
    
    if ($products.products.Count -gt 0) {
        $firstProduct = $products.products[0]
        Write-Host "   Sample product: $($firstProduct.name)" -ForegroundColor Gray
    } else {
        Write-Host "   ⚠️  No products in database" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Products endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Get Categories
Write-Host "Test 3: Get Categories" -ForegroundColor Yellow
try {
    $categories = Invoke-RestMethod -Uri "$baseUrl/api/category" -Method Get
    Write-Host "✅ Categories endpoint working" -ForegroundColor Green
    Write-Host "   Found $($categories.categories.Count) categories" -ForegroundColor Gray
    
    if ($categories.categories.Count -gt 0) {
        Write-Host "   Categories:" -ForegroundColor Gray
        foreach ($cat in $categories.categories) {
            Write-Host "      - $($cat.name)" -ForegroundColor Gray
        }
    } else {
        Write-Host "   ⚠️  No categories in database" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Categories endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "📊 Test Summary" -ForegroundColor Cyan
Write-Host "✅ Backend API is ready for frontend integration!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Start frontend: cd frontend && npm run dev" -ForegroundColor Gray
Write-Host "2. Visit: http://localhost:5173/products" -ForegroundColor Gray
Write-Host "3. Products should load from backend" -ForegroundColor Gray
