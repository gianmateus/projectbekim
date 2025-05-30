$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtYmFqcmtiajAwMDB0MzY3eXBsNnJ4aWMiLCJlbWFpbCI6ImFkbWluQHJlc3RhdXJhbnQubG9jYWwiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDg1OTY2MzIsImV4cCI6MTc0OTIwMTQzMn0.Di-GCAEv_-LbWW1Qh2zETJ1hrWhytFvpC0jocrr8_AI"
$restaurantId = "cmbal4ccv0005vrk2zfhdlapj"  # ID do restaurante "sadad"

Write-Host "Testing delete restaurant endpoint..."
Write-Host "Restaurant ID: $restaurantId"

try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/restaurants/$restaurantId" -Method DELETE -Headers $headers
    Write-Host "Delete restaurant successful!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Delete restaurant failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody"
    }
} 