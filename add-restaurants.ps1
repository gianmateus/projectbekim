$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtYmFqcmtiajAwMDB0MzY3eXBsNnJ4aWMiLCJlbWFpbCI6ImFkbWluQHJlc3RhdXJhbnQubG9jYWwiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDg1OTYwMDMsImV4cCI6MTc0OTIwMDgwM30.tKuKjkjuatrx2MdBKAeDl_0seSDwfS2q7UqNcDryYJ0"

$restaurants = @(
    @{
        name = "Zur Goldenen Gans"
        description = "Traditionelle deutsche Küche und gemütliche Atmosphäre"
        address = "Friedrichstraße 456, 10117 Berlin"
        phone = "+49 30 87654321"
        email = "kontakt@goldenengans.de"
        color = "#d96d62"
    },
    @{
        name = "Sakura Sushi"
        description = "Frisches Sushi und japanische Spezialitäten"
        address = "Unter den Linden 789, 10117 Berlin"
        phone = "+49 30 11223344"
        email = "info@sakurasushi.de"
        color = "#6c798b"
    }
)

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

foreach ($restaurant in $restaurants) {
    Write-Host "Creating restaurant: $($restaurant.name)"
    
    try {
        $json = $restaurant | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "http://localhost:3001/api/restaurants" -Method POST -Headers $headers -Body $json
        Write-Host "✅ Restaurant created successfully!" -ForegroundColor Green
        Write-Host "Response: $($response.message)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to create restaurant: $($restaurant.name)" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)"
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response Body: $responseBody"
        }
    }
    
    Write-Host "---"
} 