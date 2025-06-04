package vn.fs.dto;

import lombok.Data;

import java.util.List;

@Data
public class PromotionRequest {
    private String email;
    private List<Long> promotionCodeIds;

}
