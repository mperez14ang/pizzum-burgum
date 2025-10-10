package uy.um.edu.pizzumburgum;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(
        exclude = {org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class}
)
public class PizzUmBurgUmApplication {

	public static void main(String[] args) {
		SpringApplication.run(PizzUmBurgUmApplication.class, args);
	}

}
