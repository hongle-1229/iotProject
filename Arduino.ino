#include <DHT.h>
#include <Wire.h>
#include <BH1750.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

#define DHTPIN D4
#define DHTTYPE DHT11
#define LED D5
#define FAN D6
#define LAMP D7
#define WARNING_LED D8

const char *ssid = "PTIT_WIFI";
const char *password = "";
const char *mqtt_broker = "10.21.36.33";
const char *sensor_topic = "sensor/topic";
const char *device_topic = "device/topic";
const char *device_warning = "device/warning";
const int mqtt_port = 8888;
const char* mqtt_user = "HongLe";
const char* mqtt_password = "hongle1229";

// Ngưỡng cảnh báo
float TEMP_THRESHOLD = 38.0;
float HUMIDITY_THRESHOLD = 80.0;
float LIGHT_THRESHOLD = 100.0;

bool shouldBlink = false;
bool warningLedState = false;
unsigned long lastBlink = 0;
const unsigned long BLINK_INTERVAL = 500; // 0.5s nhấp nháy

unsigned long lastSensorSend = 0;
const unsigned long SENSOR_INTERVAL = 2000; // 2s gửi dữ liệu cảm biến

WiFiClient espClient;
PubSubClient client(espClient);
DHT dht(DHTPIN, DHTTYPE);
BH1750 lightMeter;

void callback(char *topic, byte *payload, unsigned int length) {
    Serial.print("Message arrived in topic: ");
    Serial.println(topic);

    String message = "";
    for (int i = 0; i < length; i++) {
        message += (char)payload[i];
    }

    Serial.print("Message: ");
    Serial.println(message);

    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, message);

    if (error) {
        Serial.print("Lỗi parse JSON: ");
        Serial.println(error.f_str());
        return;
    }

    // Điều khiển thiết bị theo dữ liệu nhận được
    digitalWrite(LED, doc["1"].as<int>());
    digitalWrite(FAN, doc["2"].as<int>());
    digitalWrite(LAMP, doc["3"].as<int>());

    Serial.println(" - - - - - - - - - - - -");
}

void setup() {
    Serial.begin(115200);

    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print("Disconect to wifi");
        Serial.print(".");
    }
    Serial.println("\nWiFi connected!");

    client.setServer(mqtt_broker, mqtt_port);
    client.setCallback(callback);

    while (!client.connected()) {
        String client_id = "esp8266-client-" + String(WiFi.macAddress());
        Serial.printf("Connecting to MQTT as %s\n", client_id.c_str());

        if (client.connect(client_id.c_str(), mqtt_user, mqtt_password)) {
            Serial.println("Connected to MQTT broker!");
        } else {
            Serial.print("MQTT connection failed: ");
            Serial.println(client.state());
            delay(2000);
        }
    }

    pinMode(LED, OUTPUT); digitalWrite(LED, 0);
    pinMode(FAN, OUTPUT); digitalWrite(FAN, LOW);
    pinMode(LAMP, OUTPUT); digitalWrite(LAMP, LOW);
    pinMode(WARNING_LED, OUTPUT); digitalWrite(WARNING_LED, LOW);

    client.subscribe(device_topic);

    dht.begin();
    Wire.begin(D2, D1);

    if (lightMeter.begin()) {
        Serial.println("BH1750 initialized!");
    } else {
        Serial.println("Failed to initialize BH1750!");
    }
}

void loop() {
    client.loop();
    unsigned long now = millis();

    // Đọc cảm biến mỗi 2s để gửi dữ liệu
    static float temp = 0, hum = 0, lux = 0;
    if (now - lastSensorSend > SENSOR_INTERVAL) {
        temp = dht.readTemperature();
        hum = dht.readHumidity();
        lux = lightMeter.readLightLevel();

        if (!isnan(temp) && !isnan(hum) && !isnan(lux)) {
            String payload = "{\"temperature\": " + String(temp) + ", \"humidity\": " + String(hum) + ", \"light\": " + String(lux) + "}";
            client.publish(sensor_topic, payload.c_str());
            Serial.println("Sent sensor data: " + payload);
        } else {
            Serial.println("Lỗi đọc cảm biến!");
        }
        lastSensorSend = now;
    }

    // Cập nhật shouldBlink ở mỗi vòng lặp, không chỉ mỗi 2s
    if (!isnan(temp) && !isnan(hum) && !isnan(lux)) {
        shouldBlink = (temp > TEMP_THRESHOLD) || (hum > HUMIDITY_THRESHOLD) || (lux > LIGHT_THRESHOLD);
    } else {
        shouldBlink = false;
    }

    // Nhấp nháy warning và publish trạng thái warning mỗi 0.5s
    if (shouldBlink) {
        if (now - lastBlink > BLINK_INTERVAL) {
            warningLedState = !warningLedState;
            digitalWrite(WARNING_LED, warningLedState ? HIGH : LOW);
            lastBlink = now;

            
            StaticJsonDocument<100> doc;
            doc["warning"] = warningLedState ? "on" : "off";
            char payload[50];
            serializeJson(doc, payload);
            client.publish(device_warning, payload);
        }
    } else {
        digitalWrite(WARNING_LED, LOW);
        if (warningLedState) {
            warningLedState = false;
            
            StaticJsonDocument<100> doc;
            doc["warning"] = "off";
            char payload[50];
            serializeJson(doc, payload);
            client.publish(device_warning, payload);
        }
    }
}
