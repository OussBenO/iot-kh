#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <DHT.h>

#define DHTPIN D2  // GPIO2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Wi-Fi credentials
const char* ssid = "Lalaloli";
const char* password = "lalaloli";
const char* serverUrl = "http://192.168.87.104:8000/api/update-sensor-data/";



void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connexion au Wi-Fi...");
  }
  Serial.println("Connecté au Wi-Fi !");
  dht.begin();
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();

    if (isnan(temperature) || isnan(humidity)) {
      Serial.println("Erreur de lecture du capteur !");
      delay(5000);
      return;
    }

    String jsonData = "{\"temperature\":" + String(temperature) + ",\"humidity\":" + String(humidity) + "}";
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.POST(jsonData);
    if (httpResponseCode > 0) {
        Serial.print("Code de reponse : ");
        Serial.println(httpResponseCode);
        String response = http.getString();
        Serial.println("Reponse du serveur : ");
        Serial.println(response);
    } else {
        Serial.print("Erreur lors de l'envoi : ");
        Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("Wi-Fi déconnecté !");
  }

  delay(900);  // Envoi des données toutes les 5 secondes
}
