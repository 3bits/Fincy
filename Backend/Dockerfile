# Stage 1: Build the JAR
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run the JAR
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/finance-tracker-backend-1.0.0.jar app.jar
ENV PORT=8081
EXPOSE ${PORT}
ENTRYPOINT ["java", "-jar", "app.jar"]
