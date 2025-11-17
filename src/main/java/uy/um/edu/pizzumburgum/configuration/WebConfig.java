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
            registry.addResourceHandler("/**")
                    .addResourceLocations("file:frontend/src/")
                    .setCachePeriod(0); // Sin cache en desarrollo
        } else {
            // Produccion → cache para todos los recursos estaticos
            registry.addResourceHandler("/**")
                    .addResourceLocations("classpath:/static/")
                    .setCachePeriod(31536000) // 1 año en segundos
                    .resourceChain(true);

            registry.addResourceHandler("/assets/**")
                    .addResourceLocations("classpath:/static/assets/")
                    .setCachePeriod(31536000)
                    .resourceChain(true);
        }
    }
}