package Backend.Service;

import Backend.Model.*;
import Backend.Repository.*;
import Backend.Request.UserPointRequest;
import Backend.Response.ApiResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class UserPointService {

    private final UserPointsRepository userPointsRepository;
    private final UserPointTransactionRepository userPointTransactionRepository;
    private final AccountRepository accountRepository;

    public ApiResponse<?> claimDailyCheckin(Long accountId, UserPointRequest request) {
        Account account = accountRepository.findByAccountId(accountId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        if (hasClaimedToday(account)) {
            return new ApiResponse<>(false, "Bạn đã nhận xu hôm nay rồi!", null);
        }

        int points = request.getPoints() != null ? request.getPoints() : 100; // Mặc định là 10 điểm nếu không có trong request
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

    public ApiResponse<?> getFullPointInfo(Long accountId) {
        Account account = accountRepository.findByAccountId(accountId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        // Điểm hiện tại
        UserPoints userPoints = userPointsRepository.findByAccount(account)
                .orElse(new UserPoints());
        int currentPoints = userPoints.getCurrentPoints();

        // Lịch sử giao dịch
        List<UserPointTransaction> history = userPointTransactionRepository
                .findByAccountOrderByCreatedAtDesc(account);

        // Chuỗi streak
        int streak = calculateStreak(account);

        // Gộp dữ liệu
        Map<String, Object> result = new HashMap<>();
        result.put("currentPoints", currentPoints);
        result.put("history", history);
        result.put("streak", streak);

        return new ApiResponse<>(true, "Lấy thông tin điểm thành công", result);
    }

    public ApiResponse<?> getCurrentPoints(Long accountId) {
        Account account = accountRepository.findByAccountId(accountId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        UserPoints userPoints = userPointsRepository.findByAccount(account)
                .orElse(new UserPoints());

        return new ApiResponse<>(true, "", userPoints.getCurrentPoints());
    }

    private int calculateStreak(Account account) {
        List<UserPointTransaction> transactions = userPointTransactionRepository
                .findByAccountAndActionTypeOrderByCreatedAtDesc(account, PointActionType.DAILY_CHECKIN);

        if (transactions.isEmpty()) {
            return 0;
        }

        LocalDate lastClaimedDate = transactions.get(0).getCreatedAt().toLocalDate();
        int streak = 1;

        for (int i = 1; i < transactions.size(); i++) {
            LocalDate transactionDate = transactions.get(i).getCreatedAt().toLocalDate();
            if (transactionDate.isEqual(lastClaimedDate.minusDays(streak))) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }
}
