package dev.kishore.voyager.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdateExpenseRequest {

    private String category;

    private BigDecimal amount;

    private String currency;

    private LocalDate expenseDate;

    private String note;
}