package Backend.Response;

import Backend.Model.Wishlist;
import lombok.Data;

@Data
public class WishlistResponse {
    private Integer id;
    private Long accountId;
    private Integer productId;
    private boolean isDeleted;

    public WishlistResponse(Integer id, Long accountId, Integer productId, Boolean isDeleted) {
        this.id = id;
        this.accountId = accountId;
        this.productId = productId;
        this.isDeleted = isDeleted;
    }

    public WishlistResponse(Wishlist wishlist) {
        this.id = wishlist.getId();
        this.accountId = wishlist.getAccount().getAccountId();
        this.productId = wishlist.getProduct().getProductId();
    }

}
