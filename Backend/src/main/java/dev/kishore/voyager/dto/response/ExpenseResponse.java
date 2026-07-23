package dev.kishore.voyager.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class ExpenseResponse {

    private Long id;

    private String category;

    private BigDecimal amount;

    private String currency;

    private LocalDate expenseDate;

    private String note;
}