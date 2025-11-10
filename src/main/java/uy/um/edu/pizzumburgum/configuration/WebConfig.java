package uy.um.edu.pizzumburgum.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${spring.profiles.active:prod}")
    private String activeProfile;
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        if (activeProfile.equals("dev")) {
            // Desarrollo → usa archivos locales de React
            registry.addResourceHandler("/assets/**")
                    .addResourceLocations("file:frontend/src/assets/");
        } else {
            // Producción → usa los que vienen dentro del JAR
            registry.addResourceHandler("/assets/**")
                    .addResourceLocations("classpath:/static/assets/");
        }
    }
}
