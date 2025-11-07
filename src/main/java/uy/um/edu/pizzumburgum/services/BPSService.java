package uy.um.edu.pizzumburgum.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uy.um.edu.pizzumburgum.dto.response.BPSUserStatisticsResponse;
import uy.um.edu.pizzumburgum.repository.AdminRepository;
import uy.um.edu.pizzumburgum.repository.ClientRepository;
import uy.um.edu.pizzumburgum.repository.UserRepository;
import uy.um.edu.pizzumburgum.services.interfaces.BPSServiceInt;

@Service
@RequiredArgsConstructor
public class BPSService implements BPSServiceInt {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final AdminRepository adminRepository;

    @Override
    public BPSUserStatisticsResponse getUserStatistics() {
        long totalUsers = userRepository.count();
        long clientUsers = clientRepository.count();
        long adminUsers = adminRepository.count();

        return BPSUserStatisticsResponse.builder()
                .totalUsers(totalUsers)
                .clientUsers(clientUsers)
                .adminUsers(adminUsers)
                .build();
    }
}