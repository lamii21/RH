package com.RH.PFA.config;

import com.RH.PFA.entity.Department;
import com.RH.PFA.entity.Role;
import com.RH.PFA.entity.User;
import com.RH.PFA.repository.DepartmentRepository;
import com.RH.PFA.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (departmentRepository.count() == 0) {
            seedDepartments();
        }
        if (userRepository.count() == 0) {
            seedAdmin();
        }
    }

    private void seedDepartments() {
        List<String> departments = List.of(
            "Direction Générale",
            "Administration & RH",
            "Comptabilité & Finance",
            "Bureau Technique",
            "Chantier & Travaux",
            "Commercial & Ventes",
            "Gardiennage & Sécurité",
            "Juridique & Notariat"
        );
        
        departments.forEach(name -> {
            departmentRepository.save(Department.builder().name(name).build());
        });
    }

    private void seedAdmin() {
        User admin = User.builder()
            .email("admin@annassim2rh.ma")
            .password(passwordEncoder.encode("Admin2024!"))
            .role(Role.ADMIN)
            .build();
        userRepository.save(admin);
    }
}
