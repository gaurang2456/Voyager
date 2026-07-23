package dev.kishore.voyager.mapper;

import dev.kishore.voyager.dto.request.CreateExpenseRequest;
import dev.kishore.voyager.dto.request.UpdateExpenseRequest;
import dev.kishore.voyager.dto.response.ExpenseResponse;
import dev.kishore.voyager.entity.Expense;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ExpenseMapper {

    Expense toEntity(CreateExpenseRequest request);

    ExpenseResponse toResponse(Expense expense);

    List<ExpenseResponse> toResponseList(List<Expense> expenses);

    void updateFromRequest(UpdateExpenseRequest request,
                           @MappingTarget Expense expense);
}
