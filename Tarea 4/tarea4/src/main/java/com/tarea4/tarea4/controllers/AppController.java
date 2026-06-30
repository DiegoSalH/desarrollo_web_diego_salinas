package com.tarea4.tarea4.controllers;

import org.springframework.web.bind.annotation.GetMapping;

public class AppController {
    @GetMapping("/")
    public String IndexRoute() {
        return "index";
    }
}
