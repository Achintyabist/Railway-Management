package Backend;
import application.*;
import java.time.LocalTime;
import static Backend.Models.*;
import java.util.*;
public class Allocation {
    public static void allocate(Train train) {
        waitingList.add(train);
        waitingList.sort(
                Comparator.comparing(Train::getDepartureTime)
                        .thenComparing(Train::getArrivalTime)
        );
        if (waitingList.get(waitingList.size() - 1).getId() == train.getId()) {
            for(int i=0;i<platformList.size();i++){
                if(!platformList.get(i).getNextFree().isAfter(train.getArrivalTime())){
                    train.setPlatformId(platformList.get(i).getId());
                    platformList.get(i).setNextFree(train.getDepartureTime());
                    break;
                }
            }
        }
        else {
            int idx = Models.waitingList.indexOf(train);
            List<Train> head = new ArrayList<>(Models.waitingList.subList(0, idx));
            List<Train> tail = new ArrayList<>(Models.waitingList.subList(idx, Models.waitingList.size()));
            reset(head,tail);
            waitingList.clear();
            waitingList.addAll(head);
            waitingList.addAll(tail);
        }

        int n = waitingList.size();
        LocalTime[] arr = new LocalTime[n];
        LocalTime[] dep = new LocalTime[n];
        for (int i = 0; i < n; ++i) {
            Train t = waitingList.get(i);
            arr[i] = t.getArrivalTime();
            dep[i] = t.getDepartureTime();
        }
        MAX = MinPlatform(arr, dep);
    }
    public static void addPlatform(Platform platform){
        for(int i = 0;i<waitingList.size();++i)
        {
            Train train = waitingList.get(i);
            if(!platform.getNextFree().isAfter(train.getArrivalTime())&&train.getPlatformId()==0)
            {
                platform.setNextFree(train.getDepartureTime());
                train.setPlatformId(platform.getId());
            }
        }
        platformList.add(platform);
    }
}
