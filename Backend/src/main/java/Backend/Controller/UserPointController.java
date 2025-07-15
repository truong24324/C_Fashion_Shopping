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

    // API để thêm điểm cho người dùng
    // @PostMapping("/add")
    // public ApiResponse<?> addPoints(@RequestBody UserPointRequest request,
    //         @AuthenticationPrincipal UserDetails userDetails) {
    //     String email = userDetails.getUsername();
    //     Account account = accountRepository.findByEmail(email)
    //             .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));
    //     Long accountId = account.getAccountId();
    //     if (accountId == null) {
    //         return new ApiResponse<>(false, "Không tìm thấy tài khoản với email:", email);
    //     }
    //     request.setAccountId(accountId.intValue());
    //     if (request.getPoints() == null || request.getPoints() <= 0) {
    //         return new ApiResponse<>(false, "Số điểm phải lớn hơn 0", request.getPoints());
    //     }
    //     return userPointService.addPoints(request);
    // }

    @PostMapping("/checkin")
    public ApiResponse<?> claimDailyCheckin(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));
        return userPointService.claimDailyCheckin(account.getAccountId());
    }

    @GetMapping("/streak")
    public ApiResponse<?> getStreak(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));
        Long accountId = account.getAccountId();
        if (accountId == null) {
            return new ApiResponse<>(false, "Không tìm thấy tài khoản với email:", email);
        }

        // Gọi service để tính streak
        return userPointService.getStreak(accountId);
    }

    // API để trừ điểm khi người dùng đổi quà
    @PostMapping("/redeem")
    public ApiResponse<?> redeemPoints(@RequestBody UserPointRequest request) {
        return userPointService.redeemPoints(request);
    }

    // API để lấy lịch sử điểm của người dùng
    @GetMapping("/history/me")
    public ApiResponse<?> getHistory(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));
        Long accountId = account.getAccountId();
        if (accountId == null) {
            return new ApiResponse<>(false, "Không tìm thấy tài khoản với email:", email);
        }

        return userPointService.getPointHistory(accountId);
    }

    // API để lấy điểm hiện tại của người dùng
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
