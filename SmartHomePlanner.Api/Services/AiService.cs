using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using SmartHomePlanner.Api.DTOS;
using SmartHomePlanner.Api.Services.Interfaces;

public class GeminiService : IAiService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private const string API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    public GeminiService(IConfiguration config)
    {
        // Using the direct API key as requested
        _apiKey = "AIzaSyBAwnm2s9KrlpvV-eqN-GXuhStpL1Kl1i8";
        _httpClient = new HttpClient();
    }

    public async Task<string> GenerateAllocationExplanationAsync(string input)
    {
        try
        {
            // System prompt with instructions for room allocation in Arabic
            var systemPrompt = $$"""
                أنت مساعد متخصص في تصميم المنازل أيضا  يجب الآخذ بالحسبان الممنطةق الجغرافية مثال لو كان المنطقة جدة ف هناك نوع من الخشب  لغرفة الضيوف او غرفة النوم من الممكن ان يتعفن الخشب  سوف تقدمها ضمن الأسباب  إسم الغرفة سيكون مثل غرفة نوم خشب زان  وفي التفسير لان خشب الزان قوي ..إلخ ويتحمل الرطوبة ولا يتعفن   هذا الشي بالنسبة لكل الغرفة  اي بالإسم  ذكر نوع الغرفة بالزبط  مثل غرفة ضيوف من المجالس الحريرية ايضا خذ بالحسبان المبلغ الكلي أيضا  خذ بالحسبان الارتفاع الوعرض الخاص بكل غرفة بالتفاصيل سيكون هناك مثل  شرح مفصل مثال كنبة-3 أشخاص متصلة مع كنبتين  لشخص واحد  ومن هذا القبيل  او طقم من المجالس-النوع   1 لثلاثة أشخاص 2 لشخص وواحدة لشخصين  أيضا رجاء لا تنسى تخصيص الأسماء مثال  استخدام خزائن تتكون من الخشب الإسترالي لأنه مقاوم للحرارة او مقاوم للبرودة او العفونة  حسب المنطقة المرسلة ضمن البيانات  لذلك رجاء ا بأس بالتفصيل او دخول ابلتفاصيل  للأنوع  . قم بتحليل المدخلات وإرجاع JSON يحتوي على النسب المئوية للغرف.
                يجب أن يكون التنسيق بالشكل التالي :
                [
                    {"roomName": "اسم الغرفة", "percentage": 20, "reason": "شرح السبب" , "budget": "المبلغ المخصص للغرفة حسب النسبة مثل 1000" }
                ]
                 أيضا الإجابة بالعربية رجاء فقط أسماء json  ستكون باللغة الإنجليزية  علما انه يجب اخذ بالحسبان 
                     وسوف اقم بعمل سيرلايزيشن لإجابتكapi  أيضا رجاء   تأكد من إرسال الجيسون فقط وليس نص لأنني استخدم  
                     رجاء إنتبه وأرسل فقط الجيسون لكي لا يحصل أكسبشن في ملفاتي ابدا وأخسر زبائني 
                المدخلات: {{input}}
                """;

            // Create request body for Gemini
            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = systemPrompt }
                        }
                    }
                }
            };

            // Convert to JSON
            var content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json");

            // Make the request to Gemini API
            var response = await _httpClient.PostAsync(
                $"{API_URL}?key={_apiKey}",
                content);

            // Check for success
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new HttpRequestException($"Gemini API request failed: {response.StatusCode} - {errorContent}");
            }

            // Parse the response
            var responseJson = await response.Content.ReadAsStringAsync();
            using JsonDocument document = JsonDocument.Parse(responseJson);

            // Extract the generated content from Gemini's response structure
            var generatedContent = document.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            // Clean the response by removing markdown code block formatting
            if (generatedContent.StartsWith("```json") || generatedContent.StartsWith("```"))
            {
                generatedContent = generatedContent
                    .Replace("```json", "")
                    .Replace("```", "")
                    .Trim();
            }

            return generatedContent;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in Gemini service: {ex.Message}");
            throw new Exception("Failed to generate allocation explanation", ex);
        }
    }
    public async Task<string> GenerateHomeSetupRecommendationsAsync(string input)
    {
        try
        {
            // Comprehensive prompt combining all four instructions
            var systemPrompt = $$"""
            # First Step: Analysis
            Analyze the following user inputs to understand their home setup needs and preferences. Perform a comprehensive internal analysis, focusing on understanding the implications of each input on the overall home setup. Do not generate any output (text or JSON). Store the analysis results internally for use in subsequent prompts.

            User Inputs:
            {{input}}

            Analysis Requirements:
            1. Budget Distribution: Internally analyze and distribute the budget across different rooms based on the user's needs and preferences.
            2. Home Area and Recommendations: Internally analyze how the home area influences the recommendations for all aspects of the home setup, ensuring everything the home needs is considered.
            3. Room Layout and Functionality: Internally analyze how the number of rooms and layout affect the functionality of the house.
            4. Occupant Needs: Internally analyze how the occupants' lifestyle and needs will impact the design and selection of items for each room.
            5. Location and Climate Considerations: Internally analyze how the location and climate will influence the choice of materials, insulation, and other environmental factors.
            6. Store Recommendations: Internally identify and analyze the factors that will be used to select nearby stores where the user can purchase the recommended items.

            # Second Step: Budget Distribution
            Based on your analysis, provide the budget distribution across all rooms (Living Rooms, Kitchen, Bedrooms, Bathrooms, Other Rooms) in JSON format. Specify the percentage of the total budget allocated to each room.

            # Third Step: Room Recommendations
            Based on your analysis and budget distribution, generate detailed recommendations for each room (Living Rooms, Bedrooms, Kitchen, Bathrooms, Other Rooms).

            # Fourth Step: Store and Product Data
            Based on your analysis and recommendations, create a JSON representation of product data suitable for displaying in a table and on a map with location markers.

            # IMPORTANT: Output Format Instructions
            Return ONLY a single valid JSON object with the following structure. No other text, explanations, or markdown formatting. The response must be a single JSON object that can be directly deserialized:

            # for the recomndations make recomnations as much as they fit the budget itself
            {
              "budgetDistribution": [
                { "name": "Living Room", "value": 30 },
                { "name": "Kitchen", "value": 25 },
                { "name": "Bedrooms", "value": 20 },
                { "name": "Bathrooms", "value": 15 },
                { "name": "Other Rooms", "value": 10 }
              ],
              "recommendations": {
                "Living Rooms": [
                  {
                    "id": 1,
                    "title": "Modern Sofa",
                    "category": "Living Room",
                    "price": 1200,
                    "rating": 4.5,
                    "description": "Comfortable modern sofa with durable fabric",
                    "link": "https://example.com/sofa",
                    "image": "https://example.com/sofa.jpg"(HERE Send a generated image by you that fit descritiopn of sent thnigs better to be pollinations.),
                  },
                  {
                    "id": 2,
                    "title": "Smart Tv",
                    "category": "Living Room",
                    "price": 1200,
                    "rating": 4.5,
                    "description": "Comfortable modern sofa with durable fabric",
                    "link": "https://example.com/sofa",
                    "image": "https://example.com/sofa.jpg"(HERE Send a generated image by you that fit descritiopn of sent thnigs better to be pollinations.),
                   }
                ],
                "Bedrooms": [],
                "Kitchen": [],
                "Bathrooms": [],
                "Other Rooms": []
              },
              "products": [
                {
                  "id": "p1",
                  "title": "Modern Sofa",
                  "category": "Living Room",
                  "image": {
                    "url": "https://example.com/sofa.jpg"(HERE Send a generated image by you that fit descritiopn of sent thnigs  better to be pollinations.),
                    "alt": "Modern Sofa",
                    "thumbnailUrl": "https://example.com/sofa-thumb.jpg (HERE Send a generated image by you that fit descritiopn of sent thnigs  better to be pollinations.),
                  },
                  "price": 1200,
                  "store": {
                    "id": "s1",
                    "name": "Furniture Store",
                    "location": {
                      "address": "123 Main St",
                      "city": "New York",
                      "country": "USA"
                    },
                    "contact": {
                      "phone": "+1234567890",
                      "email": "store@example.com"
                    },
                    "operatingHours": {
                      "days": "Mon-Sat",
                      "hours": "9:00-18:00"
                    }
                  },
                  "rating": 4.5,
                  "location": "Downtown",
                  "coordinates": [
                    40.7128, ( here real data of stores in  used city)
                    -74.0060 ( here real data of stores in  used city)
                  ]
                }
              ]
            }

            Remember to ensure your response is ONLY the valid JSON without any additional text, explanations, or markdown code blocks.
            so here for the thumbnailUrl  and image can u generate an image and then put its url isnide of it the generated image will be like the descriton for each room ?
            for recomantionss of rooms put all recomandtions u have for each  room please  they can have multiple reocmandation u decide on the budget thing but at least give me 3  for each type
            """;

            // Create request body for Gemini
            var requestBody = new
            {
                contents = new[]
                {
                new
                {
                    parts = new[]
                    {
                        new { text = systemPrompt }
                    }
                }
            },
                // Setting higher temperature for more creative recommendations
                generationConfig = new
                {
                    temperature = 0.7,
                    topP = 0.8,
                    topK = 40,
                    maxOutputTokens = 8192,
                }
            };

            // Convert to JSON
            var content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json");

            // Make the request to Gemini API
            var response = await _httpClient.PostAsync(
                $"{API_URL}?key={_apiKey}",
                content);

            // Check for success
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new HttpRequestException($"Gemini API request failed: {response.StatusCode} - {errorContent}");
            }

            // Parse the response
            var responseJson = await response.Content.ReadAsStringAsync();
            using JsonDocument document = JsonDocument.Parse(responseJson);

            // Extract the generated content from Gemini's response structure
            var generatedContent = document.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            // Clean the response by removing markdown code block formatting
            if (generatedContent.StartsWith("```json") || generatedContent.StartsWith("```"))
            {
                generatedContent = generatedContent
                    .Replace("```json", "")
                    .Replace("```", "")
                    .Trim();
            }

            return generatedContent;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in Gemini service: {ex.Message}");
            throw new Exception("Failed to generate home setup recommendations", ex);
        }
    }

    public async Task<string> GenerateRoomImageAsync(string prompt)
    {
        try
        {
            // Create request body for Gemini
            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                },
                generationConfig = new
                {
                    temperature = 0.8,  // Slightly higher temperature for more creative descriptions
                    maxOutputTokens = 4096,  // Increased token limit for detailed descriptions
                }
            };

            // Convert to JSON
            var content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json");

            // Make the request to Gemini API
            var response = await _httpClient.PostAsync(
                $"{API_URL}?key={_apiKey}",
                content);

            // Check for success
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new HttpRequestException($"Gemini API request failed: {response.StatusCode} - {errorContent}");
            }

            // Parse the response
            var responseJson = await response.Content.ReadAsStringAsync();
            using JsonDocument document = JsonDocument.Parse(responseJson);

            // Extract the generated content from Gemini's response structure
            var generatedContent = document.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            // Clean the response by removing markdown code block formatting
            if (generatedContent.StartsWith("```json") || generatedContent.StartsWith("```"))
            {
                generatedContent = generatedContent
                    .Replace("```json", "")
                    .Replace("```", "")
                    .Trim();
            }

            return generatedContent;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error generating room image: {ex.Message}");
            throw new Exception("Failed to generate room image", ex);
        }
    }

    public async Task<string> GenerateStabilityImage(string prompt)
    {
        try
        {
            // Stability API details
            string apiKey = "sk-z6TiUuT86PevY5NcXAgLQXaxQhuMrj1QFHj0LYF3l700dew6";
            string apiUrl = "https://api.stability.ai/v2beta/stable-image/generate/sd3";

            // Create a new HttpClient
            using var client = new HttpClient();

            // Add authorization header
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
            client.DefaultRequestHeaders.Accept.ParseAdd("image/*");

            // Create form data with helper method to properly quote the name
            using var formData = new MultipartFormDataContent {
            StringFormField("prompt", prompt),
            StringFormField("output_format", "jpeg")
        };

            // Make the API request
            var response = await client.PostAsync(apiUrl, formData);

            // Check for success
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new HttpRequestException($"Stability API request failed: {response.StatusCode} - {errorContent}");
            }

            // Get the image bytes
            var imageBytes = await response.Content.ReadAsByteArrayAsync();

            // Generate a unique filename
            string fileName = $"stability_image_{Guid.NewGuid()}.jpeg";
            string directory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");

            // Ensure directory exists
            Directory.CreateDirectory(directory);

            // Save the image
            string filePath = Path.Combine(directory, fileName);
            await File.WriteAllBytesAsync(filePath, imageBytes);

            // Return the relative path to the image
            return $"wwwroot/images/{fileName}";
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error generating Stability image: {ex.Message}");

            // Fallback to Unsplash if Stability fails
            throw new Exception("Failed to generate Stability image", ex);
        }
    }

    // Helper method for creating properly formatted string form fields
    private static StringContent StringFormField(string name, string value)
    {
        var formField = new StringContent(value);
        formField.Headers.ContentDisposition = new ContentDispositionHeaderValue("form-data")
        {
            Name = $"\"{name}\""  // Note the quotes around the name
        };
        return formField;
    }

    // Helper method for creating properly formatted image form fields
    private static async Task<ByteArrayContent> ImageFormField(string name, string imagePath, string mimeType)
    {
        var filename = Path.GetFileName(imagePath);
        var imageBytes = await File.ReadAllBytesAsync(imagePath);
        var formField = new ByteArrayContent(imageBytes);
        formField.Headers.ContentType = new MediaTypeHeaderValue(mimeType);
        formField.Headers.ContentDisposition = new ContentDispositionHeaderValue("form-data")
        {
            Name = $"\"{name}\"",
            FileName = $"\"{filename}\""
        };
        return formField;
    }
}
