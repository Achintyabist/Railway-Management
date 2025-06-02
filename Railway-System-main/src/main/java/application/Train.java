package application;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
public class Train {
    private int id;
    private String name;
    private LocalTime arrivalTime;
    private LocalTime departureTime;
    private int platformId;
    private String color;
    DateTimeFormatter formatter= DateTimeFormatter.ofPattern("HH:mm");
    public Train(int id, String name, String arrivalTime, String departureTime,
                 String color) {
        this.id = id;
        this.name = name;
        this.arrivalTime = LocalTime.parse(arrivalTime,formatter);
        this.departureTime = LocalTime.parse(departureTime,formatter);
        this.platformId = 0;
        this.color = color;
    }

    // Getters
    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public LocalTime getArrivalTime() {
        return arrivalTime;
    }

    public LocalTime getDepartureTime() {
        return departureTime;
    }

    public int getPlatformId() {
        return platformId;
    }

    public String getColor() {
        return color;
    }
    // Setters
    public void setPlatformId(int platformId) {
        this.platformId = platformId;
    }

    public void setColor(String color) {
        this.color = color;
    }


}
