package net.vivin.aksi.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by IntelliJ IDEA.
 * User: vivin
 * Date: 11/20/11
 * Time: 2:23 PM
 */

@Controller
public class DigitRecognitionController {

    @RequestMapping
    public void recognize(Model model, String imageData) {
        model.addAttribute("digit", 9);
        model.addAttribute("confidence", 0.94494424);
    }
}
