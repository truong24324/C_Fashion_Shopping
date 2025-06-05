package Backend.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import Backend.Model.Account;
import Backend.Request.AccountRequest;
import Backend.Response.AccountResponse;
import Backend.Response.ApiResponse;
import Backend.Service.AccountService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PatchMapping("/{accountId}/promote")
    @PreAuthorize("hasAuthority('ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<String>> promoteAccountRole(@PathVariable Integer accountId) {
        String message = accountService.promoteAccountRole(accountId);
        return ResponseEntity.ok(new ApiResponse<>(true, message, null));
    }

    @GetMapping("/by-role")
    @PreAuthorize("hasAuthority('ROLE_Admin') or hasAuthority('ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getAccountsByRole(@RequestParam String role) {
        List<AccountResponse> accounts = accountService.getAccountsByRole(role);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách tài khoản theo quyền thành công", accounts));
    }

    // ✅ Get account by ID
    // @GetMapping("/{accountId}")
    // @PreAuthorize("hasAuthority('ROLE_Admin')")
    // public ResponseEntity<ApiResponse<Account>> getAccountById(@PathVariable Integer accountId) {
    //     return ResponseEntity
    //             .ok(new ApiResponse<>(true, "Lấy thông tin tài khoản thành công", accountService.getById(accountId)));
    // }

    // ✅ Delete account
    @DeleteMapping("/{accountId}")
    @PreAuthorize("hasAuthority('ROLE_Admin') or hasAuthority('ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<String>> deleteAccount(
            @PathVariable Integer accountId,
            @AuthenticationPrincipal Account requester) {

        accountService.deleteAccount(accountId, requester);
        return ResponseEntity.ok(new ApiResponse<>(true, "Xoá tài khoản thành công!", null));
    }

    @PatchMapping("/{accountId}/lock")
    @PreAuthorize("hasAuthority('ROLE_Admin') or hasAuthority('ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<String>> toggleLock(
            @PathVariable Integer accountId,
            @AuthenticationPrincipal Account requester) {

        accountService.toggleLock(accountId, requester);
        return ResponseEntity.ok(new ApiResponse<>(true, "Đã đổi trạng thái khóa của tài khoản", null));
    }

    @PatchMapping("/{accountId}/active")
    @PreAuthorize("hasAuthority('ROLE_Admin') or hasAuthority('ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<String>> toggleActive(
            @PathVariable Integer accountId,
            @AuthenticationPrincipal Account requester) {

        accountService.toggleActive(accountId, requester);
        return ResponseEntity.ok(new ApiResponse<>(true, "Đã đổi trạng thái hoạt động của tài khoản", null));
    }

    @PostMapping("/bulk-create")
    @PreAuthorize("hasAuthority('ROLE_Super_Admin')")
    public ResponseEntity<ApiResponse<Integer>> createBulkAccounts(@RequestBody List<AccountRequest> accountRequests) {
        try {
            List<Account> createdAccounts = accountService.createBulkAccounts(accountRequests);
            return ResponseEntity.ok(
                new ApiResponse<>(true, "Tạo tài khoản hàng loạt thành công!", createdAccounts.size())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

}
