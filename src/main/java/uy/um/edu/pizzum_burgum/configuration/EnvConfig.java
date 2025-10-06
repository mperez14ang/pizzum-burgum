package uy.um.edu.pizzum_burgum.configuration;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class EnvConfig {
    @Bean
    public Dotenv getDotenv() {
        return Dotenv.load();
    }

    /** Hay que crear un .env en el root de la carpeta para que funcione correctamente **/
    @Bean
    @Primary
    public DataSource dataSource(Dotenv dotenv) {
        return DataSourceBuilder.create()
                .url("jdbc:postgresql://"+ dotenv.get("DB_URL") + "/" + dotenv.get("DB_NAME"))
                .username(dotenv.get("DB_ADMIN_USERNAME"))
                .password(dotenv.get("DB_ADMIN_PASSWORD"))
                .build();
    }
}
