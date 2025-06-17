package wlsp.tech.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

  @RequestMapping(value = {"/{path:^(?!api$|assets$|static$|.*\\..*).*}/**",})
  public String forwardToClientRouter(@PathVariable String path) {
    return "forward:/index.html";
  }
}
