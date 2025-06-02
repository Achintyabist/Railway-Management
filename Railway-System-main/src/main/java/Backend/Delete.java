package Backend;
import application.*;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import static Backend.Models.*;
public class Delete {
    public static Platform deletePlatform(Platform plat){
        int f = 0;
        if(platformList.size()==0)
        {
            System.out.println("No platform available");
            return null;
        }
        for(int i = 0;i<processedList.size();++i)
        {
            Train t = processedList.get(i);
            if(t.getPlatformId()==plat.getId())
            {
                platformList.remove(plat);
                plat.setNextFree(t.getDepartureTime());
                f++;
                break;
            }
        }
        if(f==0)
        {
            platformList.remove(plat);
            plat.setNextFree(LocalTime.of(0,0));
        }
        for(int i = 0;i<waitingList.size();++i) {
            Train t = waitingList.get(i);
            if (t.getPlatformId() == plat.getId()) {
                int idx = Models.waitingList.indexOf(t);
                List<Train> head = new ArrayList<>(Models.waitingList.subList(0, idx));
                List<Train> tail = new ArrayList<>(Models.waitingList.subList(idx, Models.waitingList.size()));
                delreset(head,tail,plat);
                waitingList.clear();
                waitingList.addAll(head);
                waitingList.addAll(tail);
                break;
            }
        }
        return plat;
    }
    public static Train deleteTrain(Train train) {
        int f = 0;
        int idx = -1;
        for(int i= 0;i<processedList.size();++i)
        {
            if(processedList.get(i).getId()==train.getId())
            {
                System.out.println("Cannot delete Train");
                return null;
            }
        }
        for (int i = 0;i<waitingList.size();++i)
        {
            Train t = waitingList.get(i);
            if(t.getId()==train.getId())
            {
                idx = i;
                f++;
                waitingList.remove(train);
                break;
            }
        }
        if(f==0)
        {
            System.out.println("No such train is there");
            return null;
        }
        int plat_id = train.getPlatformId();
        if(train.getPlatformId()!=0)
        {
            waitingList.sort(
                    Comparator.comparing(Train::getDepartureTime)
                            .thenComparing(Train::getArrivalTime)
            );
            List<Train> head = new ArrayList<>(Models.waitingList.subList(0, idx));
            List<Train> tail = new ArrayList<>(Models.waitingList.subList(idx, Models.waitingList.size()));
            delresettrain(head,tail,plat_id);
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
        return train;
    }
}
