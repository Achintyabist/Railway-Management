package application.controller;

import Backend.Delete;
import application.Train;
import application.Platform;
import application.dto.TrainDTO;
import application.dto.PlatformDTO;
import application.dto.PlatformAllocationDTO;
import Backend.Models;
import Backend.Allocation;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/railway")
@Tag(name = "Railway Management", description = "APIs for managing trains and platform allocations")
public class RailwayController {

    @PostMapping("/platforms")
    @Operation(summary = "Add a new platform")
    public ResponseEntity<PlatformDTO> addPlatform(@RequestBody PlatformDTO platformDTO) {
        Platform platform = new Platform(platformDTO.getId(), platformDTO.getPlatformName());
        if (platformDTO.getNextFree() != null) {
            platform.setNextFree(platformDTO.getNextFree());
        }
        
        Allocation.addPlatform(platform);
        platformDTO.setNextFree(platform.getNextFree());

        System.out.println("[ADD PLATFORM] Added platform: ID=" + platform.getId() + ", Name=" + platform.getPlatformName());

        return ResponseEntity.ok(platformDTO);
    }

    @PostMapping("/trains")
    @Operation(summary = "Add a new train")
    public ResponseEntity<TrainDTO> addTrain(@RequestBody TrainDTO trainDTO) {
        Train train = new Train(
            trainDTO.getId(),
            trainDTO.getName(),
            trainDTO.getArrivalTime(),
            trainDTO.getDepartureTime(),
            trainDTO.getColor()
        );
        
        Allocation.allocate(train);

        trainDTO.setPlatformId(train.getPlatformId());

        System.out.println("[ADD TRAIN] Added train: ID=" + train.getId() + ", Name=" + train.getName() + 
                         ", Allocated Platform=" + train.getPlatformId());

        return ResponseEntity.ok(trainDTO);
    }

    @GetMapping("/trains")
    @Operation(summary = "Get all trains")
    public ResponseEntity<List<Train>> getAllTrains() {
        return ResponseEntity.ok(Models.waitingList);
    }

    @DeleteMapping("/trains/{trainId}")
    @Operation(summary = "Delete a train")
    public ResponseEntity<String> deleteTrain(@PathVariable int trainId) {
        Train trainToRemove = null;
        for(Train t: Models.waitingList){
            if(trainId==t.getId())
                trainToRemove=t;
        }

        Delete.deleteTrain(trainToRemove);

        System.out.println("[DELETE TRAIN] Deleted train ID=" + trainId);

        return ResponseEntity.ok("Train deleted successfully");
    }

    @PostMapping("/platforms/allocate")
    @Operation(summary = "Allocate a platform to a train")
    public ResponseEntity<PlatformAllocationDTO> allocatePlatform(@RequestParam int trainId) {
        Optional<Train> optionalTrain = Models.waitingList.stream()
            .filter(t -> t.getId() == trainId)
            .findFirst();

        if (optionalTrain.isEmpty()) {
            System.out.println("[ALLOCATE] Train ID=" + trainId + " not found for allocation.");
            return ResponseEntity.notFound().build();
        }

        Train train = optionalTrain.get();
        
        Allocation.allocate(train);
        
        if (train.getPlatformId() == 0) {
            System.out.println("[ALLOCATE] No available platform for Train ID=" + trainId);
            return ResponseEntity.badRequest().body(null);
        }

        Optional<Platform> allocatedPlatform = Models.platformList.stream()
            .filter(p -> p.getId() == train.getPlatformId())
            .findFirst();

        if (allocatedPlatform.isEmpty()) {
            System.out.println("[ALLOCATE] Platform allocation failed for Train ID=" + trainId);
            return ResponseEntity.internalServerError().build();
        }

        PlatformAllocationDTO allocation = new PlatformAllocationDTO();
        allocation.setPlatformId(train.getPlatformId());
        allocation.setOccupied(true);
        allocation.setNextFreeTime(allocatedPlatform.get().getNextFree());
        allocation.setCurrentTrainId(train.getId());

        System.out.println("[ALLOCATE] Allocated Platform ID=" + train.getPlatformId() +
                        " to Train ID=" + train.getId());

        return ResponseEntity.ok(allocation);
    }

    @PostMapping("/platforms/deallocate/{platformId}")
    @Operation(summary = "Deallocate a platform")
    public ResponseEntity<String> deallocatePlatform(@PathVariable int platformId) {
        Optional<Platform> optionalPlatform = Models.platformList.stream()
            .filter(p -> p.getId() == platformId)
            .findFirst();

        if (optionalPlatform.isEmpty()) {
            System.out.println("[DEALLOCATE] Platform ID=" + platformId + " not found.");
            return ResponseEntity.notFound().build();
        }

        Platform platform = optionalPlatform.get();
        platform.setNextFree(LocalTime.of(0, 0));

        Models.waitingList.stream()
            .filter(t -> t.getPlatformId() == platformId)
            .forEach(t -> t.setPlatformId(0));

        System.out.println("[DEALLOCATE] Deallocated Platform ID=" + platformId);

        return ResponseEntity.ok("Platform deallocated successfully");
    }

    @GetMapping("/platforms/allocations")
    @Operation(summary = "Get current platform allocations")
    public ResponseEntity<List<PlatformAllocationDTO>> getPlatformAllocations() {
        List<PlatformAllocationDTO> allocations = new ArrayList<>();
        
        for (Platform platform : Models.platformList) {
            PlatformAllocationDTO allocation = new PlatformAllocationDTO();
            allocation.setPlatformId(platform.getId());
            allocation.setNextFreeTime(platform.getNextFree());
            
            Train currentTrain = Models.waitingList.stream()
                .filter(t -> t.getPlatformId() == platform.getId())
                .findFirst()
                .orElse(null);
                
            allocation.setOccupied(currentTrain != null);
            if (currentTrain != null) {
                allocation.setCurrentTrainId(currentTrain.getId());
            }
            
            allocations.add(allocation);
        }

        System.out.println("[GET ALLOCATIONS] Retrieved " + allocations.size() + " platform allocations.");

        return ResponseEntity.ok(allocations);
    }

    @GetMapping("/trains/schedules")
    @Operation(summary = "View all train schedules")
    public ResponseEntity<List<TrainDTO>> getTrainSchedules() {
        List<TrainDTO> schedules = Models.waitingList.stream()
            .map(train -> {
                TrainDTO dto = new TrainDTO();
                dto.setId(train.getId());
                dto.setName(train.getName());
                dto.setArrivalTime(train.getArrivalTime().toString());
                dto.setDepartureTime(train.getDepartureTime().toString());
                dto.setPlatformId(train.getPlatformId());
                dto.setColor(train.getColor());
                return dto;
            })
            .collect(Collectors.toList());

        System.out.println("[GET SCHEDULES] Retrieved " + schedules.size() + " train schedules.");

        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/min-platforms")
    @Operation(summary = "Display Minimum Platform required")
    public ResponseEntity<Integer> getMinimumPlatformsRequired() {
        return ResponseEntity.ok(Models.MAX);
    }

    @GetMapping("/platforms")
    @Operation(summary = "Display Minimum Platform required")
    public ResponseEntity<Integer> getPlatforms() {
        return ResponseEntity.ok(Models.platformList.size());
    }

    @DeleteMapping("/platforms/{platformId}")
    @Operation(summary = "Delete a Platform")
    public ResponseEntity<String> deletePlatform(@PathVariable int platformId) {
        Platform platform=null;
        for(Platform p1 : Models.platformList){
            if(platformId==p1.getId())
                platform=p1;
        }
        Delete.deletePlatform(platform);

        System.out.println("[DELETE TRAIN] Deleted train ID=" + platformId);

        return ResponseEntity.ok("Platform deleted successfully");
    }
}
