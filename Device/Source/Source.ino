#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <string.h>
#include <ESP8266WiFi.h>
#include <WiFiManager.h>
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <PubSubClient.h>
#include <string>
#include <Bounce2.h>

#define DHT_PIN D7
#define BUZZER_BTN_PIN D0
#define MIST_FAN_PIN D4
#define LIQUID_LEVEL_SENSOR_PIN D5
#define LEDS_BTN_PIN D1
#define PHOTORESISTOR_PIN A0
#define LED_PIN D8
#define MIST_BTN_PIN D6
#define BUZZER_PIN D10

const char* mqtt_server = "broker.mqtt-dashboard.com";
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

DHT dht(DHT_PIN, DHT11);

bool led = false;
bool liquid = false;
bool button_buzz = false;
bool fan_mist = false;
bool auto_led = true;
int led_value = 255;
bool fan = false;

const int numButtons = 3; // Số lượng nút
const int buttonPins[numButtons] = {D0, D1, D6}; // Chân kết nối nút

Bounce debouncers[numButtons];

void mqttCallback(char* topic, byte* payload, unsigned int length)
{

  payload[length] = '\0';
  if (strcmp(topic, "22127406/AUTO_LED") == 0)
  {
    auto_led = (strcmp((char*)payload, "1") == 0);
  }
  else if (strcmp(topic, "22127406/LED_VALUE") == 0)
  {
    led_value = std::stoi((char*)payload);
  }
  else if (strcmp(topic, "22127406/FAN") == 0)
  {
    fan_mist = !fan_mist;
    if (fan_mist)
    {
      sendDataToServer("22127142/ACTIVITY", "Misting fan on");
    }
    else
    {
      sendDataToServer("22127142/ACTIVITY", "Misting fan off");
    }
  }
}
void connectMqttServer()
{
  while (!client.connect("22127142"))
  {
    delay(5000);
  }
  client.subscribe("22127406/AUTO_LED");
  client.subscribe("22127406/LED_VALUE");
  client.subscribe("22127406/FAN");
}
void connectServer()
{
  if (!client.connected())
  {
    connectMqttServer();
  }
  client.loop();
}
void sendDataToServer(char* topic, char* msg)
{
  client.publish(topic, msg);
}
int readPhotoresistor() {
  return digitalRead(PHOTORESISTOR_PIN);
}

float readHumidity() {
  return dht.readHumidity();
}

float readTemperature() {
  return dht.readTemperature();
}

void buzzer() {
  for(int i = 0; i < 180; i++) {
    float sinVal = (sin(i * (3.1412 / 180)));
    int toneVal = 2000 + (int(sinVal * 1000));
    tone(BUZZER_PIN, toneVal);
    delay(2);
  }
}
void stop_buzzer()
{
  noTone(BUZZER_PIN);
}

void setup() {
  pinMode(BUZZER_BTN_PIN, INPUT);
  pinMode(MIST_FAN_PIN, OUTPUT);
  pinMode(LIQUID_LEVEL_SENSOR_PIN, INPUT);
  pinMode(LEDS_BTN_PIN, INPUT);
  pinMode(PHOTORESISTOR_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  pinMode(MIST_BTN_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  for (int i = 0; i < numButtons; i++) 
  {
    debouncers[i].attach(buttonPins[i]); // Kết nối từng chân với Bounce2
    debouncers[i].interval(50);          // Đặt thời gian debounce 50ms
  }

  dht.begin();

  WiFiManager wifiManager;
  wifiManager.autoConnect("My Access Point");

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(mqttCallback);
}

void loop() {
  for (int i = 0; i < numButtons; i++) 
    debouncers[i].update();
  connectServer();

  int p = analogRead(PHOTORESISTOR_PIN);
  std::string msg1 = std::to_string(p);
  sendDataToServer("22127142/PHOTO", (char*)msg1.c_str());
  if (auto_led)
  {
    if (p > 1020)
    {
      led = true;
    }
  }
  float h = readHumidity();
  std::string msg2 = std::to_string(h);
  float t = readTemperature();
  std::string msg3 = std::to_string(t);
  std::string msg = msg3 + ", " + msg2;
  sendDataToServer("22127142/DHT", (char*)msg.c_str());
  liquid = digitalRead(LIQUID_LEVEL_SENSOR_PIN);
  if (liquid == true)
  {
    if (button_buzz == false)
    {
      button_buzz = debouncers[0].rose();
    }
  }
  else
  {
    button_buzz = false;
  }
  if (liquid && !button_buzz)
  {
    buzzer();
  }
  else
  {
    stop_buzzer();
  }

  if (debouncers[2].rose())
  {
    fan_mist = !fan_mist;
    if (fan_mist)
    {
      sendDataToServer("22127142/ACTIVITY", "Misting fan on");
    }
    else
    {
      sendDataToServer("22127142/ACTIVITY", "Misting fan off");
    }
  }
  if (fan_mist)
  {
    digitalWrite(MIST_FAN_PIN, HIGH);
  } 
  else
  {
    digitalWrite(MIST_FAN_PIN, LOW);
  }
  if (debouncers[1].rose())
  {

    led = !led;
  }
  if (led)
  {
    analogWrite(LED_PIN, led_value);
  } 
  else
  {
    digitalWrite(LED_PIN, LOW);
  }
}
