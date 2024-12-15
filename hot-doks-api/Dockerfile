# Use a lightweight Java 21 runtime image as the base
FROM eclipse-temurin:21-jre-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the Spring Boot JAR file into the container
COPY target/hot-doks-api-0.0.1-SNAPSHOT.jar app.jar

# Expose the port your application uses
EXPOSE 8080

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]