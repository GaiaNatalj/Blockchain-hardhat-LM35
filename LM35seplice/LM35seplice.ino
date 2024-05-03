#define PIN_LM35 A0

void setup() {
  Serial.begin(9600);
}

void loop() {
  int valore = analogRead(PIN_LM35);
  float temperatura = valore / 2.046;

  Serial.print("Temp.: ");
  Serial.print(temperatura);
  Serial.println("°C");

  delay(500);
}


