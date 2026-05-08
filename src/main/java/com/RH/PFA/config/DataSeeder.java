package com.RH.PFA.config;

import com.RH.PFA.entity.*;
import com.RH.PFA.repository.DepartmentRepository;
import com.RH.PFA.repository.EmployeeRepository;
import com.RH.PFA.repository.JobPostingRepository;
import com.RH.PFA.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final JobPostingRepository jobPostingRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (departmentRepository.count() == 0) {
            seedDepartments();
        }
        if (userRepository.count() == 0) {
            seedAdmin();
        }
        if (employeeRepository.count() == 0) {
            seedPublicEmployees();
        }
        if (jobPostingRepository.count() == 0) {
            seedJobPostings();
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

    private void seedPublicEmployees() {
        Department direction = departmentRepository.findAll().stream()
                .filter(d -> d.getName().contains("Direction")).findFirst().orElse(null);
        Department rh = departmentRepository.findAll().stream()
                .filter(d -> d.getName().contains("RH")).findFirst().orElse(null);
        Department tech = departmentRepository.findAll().stream()
                .filter(d -> d.getName().contains("Technique")).findFirst().orElse(null);
        Department commercial = departmentRepository.findAll().stream()
                .filter(d -> d.getName().contains("Commercial")).findFirst().orElse(null);
        Department finance = departmentRepository.findAll().stream()
                .filter(d -> d.getName().contains("Comptabilité")).findFirst().orElse(null);
        Department chantier = departmentRepository.findAll().stream()
                .filter(d -> d.getName().contains("Chantier")).findFirst().orElse(null);

        createPublicEmployee("Eljabri", "Azouz", "Directeur Général", direction,
                "Plus de 20 ans d'expérience dans le secteur immobilier marocain.");
        createPublicEmployee("Benali", "Fatima", "Responsable RH", rh,
                "Spécialiste en gestion des talents et développement organisationnel.");
        createPublicEmployee("Tazi", "Youssef", "Ingénieur Topographe", tech,
                "Expert en cartographie et études techniques de lotissements.");
        createPublicEmployee("Amrani", "Salma", "Responsable Commerciale", commercial,
                "Passionnée par la relation client et la négociation immobilière.");
        createPublicEmployee("Idrissi", "Karim", "Comptable Senior", finance,
                "Certifié en normes comptables marocaines et internationales.");
        createPublicEmployee("Moulay", "Hassan", "Chef de Chantier", chantier,
                "Supervise les travaux de viabilisation avec rigueur et expertise.");
    }

    private void createPublicEmployee(String lastName, String firstName, String jobTitle,
                                       Department department, String bio) {
        User user = User.builder()
                .email(firstName.toLowerCase() + "." + lastName.toLowerCase() + "@annassim2.ma")
                .password(passwordEncoder.encode("Employee2024!"))
                .role(Role.EMPLOYEE)
                .build();
        userRepository.save(user);

        Employee employee = Employee.builder()
                .user(user)
                .firstName(firstName)
                .lastName(lastName)
                .jobTitle(jobTitle)
                .department(department)
                .phone("06 00 00 00 00")
                .leaveBalance(30)
                .isPublicProfile(true)
                .bio(bio)
                .build();
        employeeRepository.save(employee);
    }

    private void seedJobPostings() {
        Department tech = departmentRepository.findAll().stream()
                .filter(d -> d.getName().contains("Technique")).findFirst().orElse(null);
        Department commercial = departmentRepository.findAll().stream()
                .filter(d -> d.getName().contains("Commercial")).findFirst().orElse(null);

        jobPostingRepository.save(JobPosting.builder()
                .title("Ingénieur de Suivi de Chantier")
                .titleAr("مهندس متابعة الأوراش")
                .description("Nous recherchons un ingénieur motivé pour superviser nos travaux de viabilisation.")
                .descriptionAr("نبحث عن مهندس متحمس للإشراف على أعمال التهيئة لدينا.")
                .department(tech)
                .type("CDI")
                .location("Jorf El Melha")
                .requirements("Bac+5 en Génie Civil, 3 ans d'expérience.")
                .status("OPEN")
                .deadline(LocalDateTime.now().plusDays(30))
                .build());

        jobPostingRepository.save(JobPosting.builder()
                .title("Agent Commercial Immobilier")
                .titleAr("وكيل تجاري عقاري")
                .description("Rejoignez notre équipe de vente pour commercialiser nos lots résidentiels.")
                .descriptionAr("انضم إلى فريق المبيعات لدينا لتسويق بقعنا الأرضية السكنية.")
                .department(commercial)
                .type("CDI")
                .location("Rabat / Jorf El Melha")
                .requirements("Excellente communication, expérience en vente immobilière souhaitée.")
                .status("OPEN")
                .deadline(LocalDateTime.now().plusDays(15))
                .build());
    }
}

