package application.dto;

import java.time.LocalTime;

public class PlatformAllocationDTO {
    private int platformId;
    private boolean isOccupied;
    private LocalTime nextFreeTime;
    private Integer currentTrainId;

    // Getters
    public int getPlatformId() {
        return platformId;
    }

    public boolean isOccupied() {
        return isOccupied;
    }

    public LocalTime getNextFreeTime() {
        return nextFreeTime;
    }

    public Integer getCurrentTrainId() {
        return currentTrainId;
    }

    // Setters
    public void setPlatformId(int platformId) {
        this.platformId = platformId;
    }

    public void setOccupied(boolean occupied) {
        isOccupied = occupied;
    }

    public void setNextFreeTime(LocalTime nextFreeTime) {
        this.nextFreeTime = nextFreeTime;
    }

    public void setCurrentTrainId(Integer currentTrainId) {
        this.currentTrainId = currentTrainId;
    }
} 