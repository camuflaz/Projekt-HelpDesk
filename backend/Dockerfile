FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY publish-output ./

EXPOSE 8080
ENTRYPOINT ["dotnet", "backend.dll"]