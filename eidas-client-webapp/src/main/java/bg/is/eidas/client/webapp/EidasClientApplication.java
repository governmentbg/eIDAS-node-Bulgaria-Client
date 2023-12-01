package bg.is.eidas.client.webapp;

import java.io.File;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.util.Assert;

@SpringBootApplication
@ComponentScan("bg.is.eidas.client")
public class EidasClientApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        Assert.notNull(System.getenv("SERVICE_PROVIDER_CONFIG_REPOSITORY"), "Required environment variable SERVICE_PROVIDER_CONFIG_REPOSITORY is not set");
        String propLocation = System.getenv("SERVICE_PROVIDER_CONFIG_REPOSITORY") + File.separator + "application.properties";
        return application.sources(EidasClientApplication.class).properties("spring.config.location=" + propLocation);
    }

    public static void main(String[] args) {
        SpringApplication.run(EidasClientApplication.class, args);
    }

}
