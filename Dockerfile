FROM openjdk:21
EXPOSE 8080
COPY backend/target/snap-receipts.jar /snap-receipts-app.jar
LABEL authors="wlsp"
ENTRYPOINT ["java","-jar","/snap-receipts-app.jar"]