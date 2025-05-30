$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtYmFqcmtiajAwMDB0MzY3eXBsNnJ4aWMiLCJlbWFpbCI6ImFkbWluQHJlc3RhdXJhbnQubG9jYWwiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDg1OTYwMDMsImV4cCI6MTc0OTIwMDgwM30.tKuKjkjuatrx2MdBKAeDl_0seSDwfS2q7UqNcDryYJ0"

Write-Host "Testing restaurants endpoint..."

try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/restaurants" -Method GET -Headers $headers
    Write-Host "Restaurants endpoint successful!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Restaurants endpoint failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody"
    }
} 