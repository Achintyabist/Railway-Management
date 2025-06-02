package application.dto;

import java.time.LocalTime;

public class PlatformDTO {
    private int id;
    private String platformName;
    private LocalTime nextFree;

    // Getters
    public int getId() {
        return id;
    }

    public String getPlatformName() {
        return platformName;
    }

    public LocalTime getNextFree() {
        return nextFree;
    }

    // Setters
    public void setId(int id) {
        this.id = id;
    }

    public void setPlatformName(String platformName) {
        this.platformName = platformName;
    }

    public void setNextFree(LocalTime nextFree) {
        this.nextFree = nextFree;
    }
} 