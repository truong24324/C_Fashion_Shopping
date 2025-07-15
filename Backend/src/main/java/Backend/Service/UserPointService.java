package Backend.Service;

import Backend.Model.*;
import Backend.Repository.*;
import Backend.Request.UserPointRequest;
import Backend.Response.ApiResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class UserPointService {

    private final UserPointsRepository userPointsRepository;
    private final UserPointTransactionRepository userPointTransactionRepository;
    private final AccountRepository accountRepository;

    public ApiResponse<?> addPoints(UserPointRequest request) {
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        UserPoints userPoints = userPointsRepository.findByAccount(account)
                .orElse(new UserPoints());
        userPoints.setAccount(account);
        userPoints.setCurrentPoints(userPoints.getCurrentPoints() + request.getPoints());
        userPoints.setUpdateAt(LocalDateTime.now());
        userPointsRepository.save(userPoints);

        UserPointTransaction transaction = new UserPointTransaction();
        transaction.setAccount(account);
        transaction.setPointsChanged(request.getPoints());
        transaction.setActionType(request.getActionType());
        transaction.setDescription(request.getDescription());
        transaction.setCreatedAt(LocalDateTime.now());
        userPointTransactionRepository.save(transaction);

        return new ApiResponse<>(true, "Đã thêm xu thành công", userPoints.getCurrentPoints());
    }

    public ApiResponse<?> redeemPoints(UserPointRequest request) {
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        UserPoints userPoints = userPointsRepository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin điểm của tài khoản"));

        if (userPoints.getCurrentPoints() < request.getPoints()) {
            return new ApiResponse<>(false, "Không đủ xu bạn chỉ còn " + userPoints.getCurrentPoints(), null);
        }

        userPoints.setCurrentPoints(userPoints.getCurrentPoints() - request.getPoints());
        userPoints.setUpdateAt(LocalDateTime.now());
        userPointsRepository.save(userPoints);

        UserPointTransaction transaction = new UserPointTransaction();
        transaction.setAccount(account);
        transaction.setPointsChanged(-request.getPoints());
        transaction.setActionType(request.getActionType());
        transaction.setDescription(request.getDescription());
        transaction.setCreatedAt(LocalDateTime.now());
        userPointTransactionRepository.save(transaction);

        return new ApiResponse<>(true, "Đã sử dụng " + request.getPoints() + " thành công", userPoints.getCurrentPoints());
    }

    public ApiResponse<?> getPointHistory(Long accountId) {
        Account account = accountRepository.findByAccountId(accountId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        List<UserPointTransaction> history = userPointTransactionRepository
                .findByAccountOrderByCreatedAtDesc(account);

        return new ApiResponse<>(true, "Lấy lịch sử xu thành công", history);
    }

    public ApiResponse<?> getCurrentPoints(Long accountId) {
        Account account = accountRepository.findByAccountId(accountId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        UserPoints userPoints = userPointsRepository.findByAccount(account)
                .orElse(new UserPoints());

        return new ApiResponse<>(true, "", userPoints.getCurrentPoints());
    }

    public ApiResponse<?> getStreak(Long accountId) {
        Account account = accountRepository.findByAccountId(accountId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        int streak = calculateStreak(account);

        return new ApiResponse<>(true, "Lấy chuỗi điểm danh ngày thành công", streak);
    }

    public ApiResponse<?> claimDailyCheckin(Long accountId) {
        Account account = accountRepository.findByAccountId(accountId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        if (hasClaimedToday(account)) {
            return new ApiResponse<>(false, "Bạn đã nhận xu hôm nay rồi!", null);
        }

        int points = 100;

        UserPoints userPoints = userPointsRepository.findByAccount(account).orElse(new UserPoints());
        userPoints.setAccount(account);
        userPoints.setCurrentPoints(userPoints.getCurrentPoints() + points);
        userPoints.setUpdateAt(LocalDateTime.now());
        userPointsRepository.save(userPoints);

        UserPointTransaction transaction = new UserPointTransaction();
        transaction.setAccount(account);
        transaction.setPointsChanged(points);
        transaction.setActionType(PointActionType.DAILY_CHECKIN);
        transaction.setDescription("Nhận xu điểm danh hàng ngày");
        transaction.setCreatedAt(LocalDateTime.now());
        userPointTransactionRepository.save(transaction);

        return new ApiResponse<>(true, "Điểm danh thành công", userPoints.getCurrentPoints());
    }

    private boolean hasClaimedToday(Account account) {
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        return userPointTransactionRepository.findByAccountAndActionTypeOrderByCreatedAtDesc(
                account, PointActionType.DAILY_CHECKIN)
                .stream()
                .anyMatch(tx -> tx.getCreatedAt().isAfter(startOfToday));
    }

    private int calculateStreak(Account account) {
        List<UserPointTransaction> transactions = userPointTransactionRepository
                .findByAccountAndActionTypeOrderByCreatedAtDesc(
                        account, PointActionType.DAILY_CHECKIN);

        int streak = 0;
        LocalDate today = LocalDate.now();

        for (UserPointTransaction t : transactions) {
            LocalDate txDate = t.getCreatedAt().toLocalDate();
            if (txDate.equals(today.minusDays(streak))) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }
}
