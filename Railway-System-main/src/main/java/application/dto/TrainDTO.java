package application.dto;

import java.time.LocalTime;

public class TrainDTO {
    private int id;
    private String name;
    private String arrivalTime;
    private String departureTime;
    private int platformId;
    private String color;

    // Getters
    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getArrivalTime() {
        return arrivalTime;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public int getPlatformId() {
        return platformId;
    }

    public String getColor() {
        return color;
    }

    // Setters
    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setArrivalTime(String arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public void setPlatformId(int platformId) {
        this.platformId = platformId;
    }

    public void setColor(String color) {
        this.color = color;
    }
} 