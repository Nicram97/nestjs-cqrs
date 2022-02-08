<h1>Introduction to NestJs + CQRS + Kafka.</h1>
<h2>Description</h2>
<p>This project utilize NestJs CQRS and Kafka modules, using message and event based patterns. No Authentication needed, just plain API</p>
<p>Application is divided into two apps this one "nestjs-cqrs" and second "nestjs-cqrs-kafka" https://github.com/Nicram97/nestjs-cqrs-kafka-consumer</p>

<h2>HOW TO</h2>
<h3>Install</h3>
<p>run "npm install"</p>
<h3>Start kafka + zookeeper + kafka UI</h3>
<p>run "docker-compose up"</p>
<h3>Run the app</h3>
<p>run "npm run start" or "nest start" or use launch.json if You work on vs-code.</p>
<h3>Check KafkaUI</h3>
<p>When docker-compose is running in default state
go to: "http://localhost:8080/ui"</p>


<h3>Run hello world CQRS</h3>
<p>Send http request GET to "http://localhost:3001/hello-world/Test" it will run simple CQRS command with helloWorld example</p>

<h3>Test message pattern communication with kafka</h3>
<p>Send GET request to "http://localhost:3001/kafka-message" this request should send message to two different topics and get response from them and return them in array</p>


<h3>Test event-based pattern communication with kafka</h3>
<p>Send GET request to "http://localhost:3001/kafka-event" this request should emit event to kafka, which should be consumed by consumer app and then consumer should reply to .response event and then main app would consume it and process.</p>

<h3>Perform CQRS + Kafka request</h3>
<p>Send POST request to "http://localhost:3001/${NAME}" this request should begin full procedure to launch multiple events and commands using CQRS then one of the events is send to Kafka, which will be caught by consumer service which will also response  to Kafka with event, then producer will catch response event and proceed further with CQRS, sagas etc.</p>
