# 1. Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY server/*.csproj ./server/
RUN dotnet restore ./server/server.csproj

# Copy all source files
COPY . .
WORKDIR /src/server
RUN dotnet publish -c Release -o /app/publish

# 2. Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Copy published output from build stage
COPY --from=build /app/publish .

# Configure the app to listen on Render's default port
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

# Pass database connection string via environment variable (set in Render dashboard)
# You don't need to define it here, Render will inject it automatically
ENV DOTNET_RUNNING_IN_CONTAINER=true

ENTRYPOINT ["dotnet", "server.dll"]
