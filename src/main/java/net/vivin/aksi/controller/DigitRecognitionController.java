package net.vivin.aksi.controller;

import net.vivin.neural.NeuralNetwork;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;
import java.io.IOException;
import java.io.ObjectInputStream;

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

        try {
            ObjectInputStream in = new ObjectInputStream(new ClassPathResource("DigitRecognizingNeuralNetwork-1321880921458.net").getInputStream());
            NeuralNetwork neuralNetwork = (NeuralNetwork) in.readObject();

            double[] inputs = new double[imageData.length()];
            for(int i = 0; i < imageData.length(); i++) {
                inputs[i] = Double.parseDouble(String.valueOf(imageData.charAt(i)));
            }

            neuralNetwork.setInputs(inputs);

            double[] output = neuralNetwork.getOutput();
            double max = output[0];
            double recognizedDigit = 0;
            for(int j = 0; j < output.length; j++) {
                if(output[j] > max) {
                    max = output[j];
                    recognizedDigit = j;
                }
            }

            model.addAttribute("digit", recognizedDigit);
            model.addAttribute("confidence", max);
        }

        catch(IOException e) {
            model.addAttribute("error", true);
            model.addAttribute("message", "Unable to load trained network!");
        }

        catch(ClassNotFoundException e) {
            model.addAttribute("error", true);
            model.addAttribute("message", "Unable to load trained network!");
        }
    }
}
