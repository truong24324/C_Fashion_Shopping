package Backend.Controller;

import Backend.Model.Account;
import Backend.Request.AccountRequest;
import Backend.Response.AccountResponse;
import Backend.Response.ApiResponse;
import Backend.Response.PaginationResponse;
import Backend.Service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    // ✅ Get all accounts (with pagination + sort)
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ROLE_Admin')")
    public ResponseEntity<PaginationResponse<AccountResponse>> getAllAccounts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "accountId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Pageable pageable = PageRequest.of(page, size,
                sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending());

        Page<AccountResponse> pageResult = accountService.getAllAccounts(pageable);

        PaginationResponse<AccountResponse> response = new PaginationResponse<>(
                pageResult.getContent(),
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages()
        );
        return ResponseEntity.ok(response);
    }

    // ✅ Get account by ID
    @GetMapping("/{accountId}")
    @PreAuthorize("hasAuthority('ROLE_Admin')")
    public ResponseEntity<ApiResponse<Account>> getAccountById(@PathVariable Integer accountId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thông tin tài khoản thành công", accountService.getById(accountId)));
    }

    // ✅ Create new account
    @PostMapping("/add")
    @PreAuthorize("hasAuthority('ROLE_Admin')")
    public ResponseEntity<ApiResponse<Account>> createAccount(@RequestBody @Valid AccountRequest request) {
        Account created = accountService.createAccount(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Tạo tài khoản thành công!", created));
    }

    // ✅ Update account
    @PutMapping("/{accountId}")
    @PreAuthorize("hasAuthority('ROLE_Admin')")
    public ResponseEntity<ApiResponse<Account>> updateAccount(@PathVariable Integer accountId, @RequestBody @Valid AccountRequest request) {
        Account updated = accountService.updateAccount(accountId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật tài khoản thành công!", updated));
    }

    // ✅ Delete account
    @DeleteMapping("/{accountId}")
    @PreAuthorize("hasAuthority('ROLE_Admin')")
    public ResponseEntity<ApiResponse<String>> deleteAccount(@PathVariable Integer accountId) {
        accountService.deleteAccount(accountId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Xoá tài khoản thành công!", null));
    }

    // ✅ Lock account
    @PutMapping("/{accountId}/lock")
    @PreAuthorize("hasAuthority('ROLE_Admin')")
    public ResponseEntity<ApiResponse<String>> lockAccount(@PathVariable Integer accountId) {
        accountService.lockAccount(accountId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Đã khoá tài khoản!", null));
    }

    // ✅ Unlock account
    @PutMapping("/{accountId}/unlock")
    @PreAuthorize("hasAuthority('ROLE_Admin')")
    public ResponseEntity<ApiResponse<String>> unlockAccount(@PathVariable Integer accountId) {
        accountService.unlockAccount(accountId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Đã mở khoá tài khoản!", null));
    }

    // ✅ Activate/deactivate
    @PutMapping("/{accountId}/active")
    @PreAuthorize("hasAuthority('ROLE_Admin')")
    public ResponseEntity<ApiResponse<String>> toggleActive(@PathVariable Integer accountId) {
        accountService.toggleActive(accountId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Đã đổi trạng thái hoạt động của tài khoản", null));
    }
}
