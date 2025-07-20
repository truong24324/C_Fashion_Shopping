package Backend.Controller;

import Backend.Model.Account;
import Backend.Repository.AccountRepository;
import Backend.Request.UserPointRequest;
import Backend.Response.ApiResponse;
import Backend.Service.UserPointService;
import org.springframework.web.bind.annotation.*;
import lombok.*;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@AllArgsConstructor
@RequestMapping("/api/points")
@PreAuthorize("hasAnyAuthority('ROLE_Customer')")
public class UserPointController {

    private final UserPointService userPointService;
    private final AccountRepository accountRepository;

    @PostMapping("/checkin")
    public ApiResponse<?> claimDailyCheckin(@AuthenticationPrincipal UserDetails userDetails,
    UserPointRequest request) {
        String email = userDetails.getUsername();
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));
        return userPointService.claimDailyCheckin(account.getAccountId(), request);
    }

    @GetMapping("/me")
    public ApiResponse<?> getMyPointInfo(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));
        Long accountId = account.getAccountId();

        return userPointService.getFullPointInfo(accountId);
    }

    @GetMapping("/current/me")
    public ApiResponse<?> getCurrentPoints(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));
        Long accountId = account.getAccountId();
        if (accountId == null) {
            return new ApiResponse<>(false, "Không tìm thấy tài khoản với email:", email);
        }
        return userPointService.getCurrentPoints(accountId);
    }
}
