package application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@SpringBootApplication
@OpenAPIDefinition(
    info = @Info(
        title = "Railway Platform Management System API",
        version = "1.0",
        description = "REST API for managing trains and platform allocations"
    )
)
public class RailwaySystemApplication {
    public static void main(String[] args) {
        SpringApplication.run(RailwaySystemApplication.class, args);
    }
} 