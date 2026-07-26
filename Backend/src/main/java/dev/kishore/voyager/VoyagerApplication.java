package dev.kishore.voyager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;
import java.nio.file.Files;
import java.util.List;

@SpringBootApplication
public class VoyagerApplication {

	public static void main(String[] args) {
		loadDotEnv();
		SpringApplication.run(VoyagerApplication.class, args);
	}

	private static void loadDotEnv() {
		try {
			File envFile = new File(".env");
			if (!envFile.exists()) {
				envFile = new File("Backend/.env");
			}
			if (envFile.exists()) {
				List<String> lines = Files.readAllLines(envFile.toPath());
				for (String line : lines) {
					line = line.trim();
					if (line.isEmpty() || line.startsWith("#") || !line.contains("=")) {
						continue;
					}
					int eqIdx = line.indexOf('=');
					String key = line.substring(0, eqIdx).trim();
					String value = line.substring(eqIdx + 1).trim();

					if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
						value = value.substring(1, value.length() - 1);
					}

					if (System.getProperty(key) == null && System.getenv(key) == null) {
						System.setProperty(key, value);
					}
				}
			}
		} catch (Exception e) {
			// Dotenv load fallback
		}
	}
}
