package uy.um.edu.pizzumburgum.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController {
    /** Devuelve index.html para cualquier ruta que no sea API ni archivo, permitiendo recargar la pagina sin romperla **/
    @RequestMapping(value = {
            "/",
            "/{path:[^.]*}",
            "/{path:[^.]*}/**"
    })
    public String redirect() {
        return "forward:/index.html";
    }
}

