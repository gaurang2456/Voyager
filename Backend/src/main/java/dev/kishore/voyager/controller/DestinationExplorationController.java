package dev.kishore.voyager.controller;

import dev.kishore.voyager.dto.response.DestinationDetailDto;
import dev.kishore.voyager.dto.response.DestinationSearchResultDto;
import dev.kishore.voyager.service.DestinationExplorationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/explore")
@RequiredArgsConstructor
public class DestinationExplorationController {

    private final DestinationExplorationService destinationExplorationService;

    @GetMapping("/search")
    public ResponseEntity<DestinationSearchResultDto> searchDestinations(
            @RequestParam(required = false, defaultValue = "") String query
    ) {
        return ResponseEntity.ok(destinationExplorationService.searchDestinations(query));
    }

    @GetMapping("/destinations/{name}")
    public ResponseEntity<DestinationDetailDto> getDestinationExploration(
            @PathVariable String name
    ) {
        return ResponseEntity.ok(destinationExplorationService.getDestinationExploration(name));
    }
}

