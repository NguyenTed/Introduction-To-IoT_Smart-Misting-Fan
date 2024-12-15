#include "DHT.h"
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include<string.h>

#define LED_PIN A0
#define PHOTORESISTOR_PIN D0
#define LEDS_BTN_PIN D3
#define BUZZER_BTN_PIN D4
#define MIST_BTN_PIN D5
#define BUZZER_PIN D7
#define DHT_PIN D6
#define LIQUID_LEVEL_SENSOR_PIN D7
#define FAN_PIN D9
#define MIST_PIN D10

LiquidCrystal_I2C lcd(0x3F,20,4);
DHT dht(DHT_PIN, DHT11);

int readPhotoresistor() {
  return digitalRead(PHOTORESISTOR_PIN);
}

float readHumidity() {
  return dht.readHumidity();
}

float readTemperature() {
  return dht.readTemperature();
}

void LCD_write(const String& str, int row, int col)
{
  lcd.setCursor(0, 0);
}

void buzzer()
{
  for(int i = 0; i < 180; i++)
  {
    float sinVal = (sin(i * (3.1412 / 180)));
    int toneVal = 2000 + (int(sinVal * 1000));
    tone(BUZZ_PIN, toneVal);
    delay(2);
  }
}

void setup() {
  Serial.begin();
  Serial.println("Setting up");
  Serial.end();

  pinMode(LED_PIN, OUTPUT);
  pinMode(PHOTORESISTOR_PIN, INPUT);
  pinMode(LEDS_BTN_PIN, INPUT);
  pinMode(BUZZER_BTN_PIN, INPUT);
  pinMode(MIST_BTN_PIN, INPUT);
  pinMode(BUZZ_PIN, OUTPUT);
  pinMode(DHT_PIN, INPUT);
  pinMode(LIQUID_LEVEL_PIN, INPUT);
  pinMode(FAN_PIN, OUTPUT);
  pinMode(MIST_PIN, OUTPUT);

  lcd.init();
  lcd.backlight();
  dht.begin();
}

void loop() {
  
}