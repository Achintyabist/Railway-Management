package Backend;

import java.time.LocalTime;
import java.util.*;

import application.Platform;
import application.Train;

public class Models {
    public static int MIN;
    public static List<Train> waitingList;
    public static List<Train> processedList;
    public static List<Platform> platformList;
    public static int MAX;

    static {
        waitingList = new ArrayList<>();
        processedList = new ArrayList<>();
        platformList = new ArrayList<>();
    }
    public static void setMAX(int n)
    {
        MAX = n;
    }
    public static void enqueueTrain(Train train) {
        waitingList.add(train);
        waitingList.sort(
                Comparator.comparing(Train::getDepartureTime)
                        .thenComparing(Train::getArrivalTime)
        );
    }
    public static void reset(List<Train> head, List<Train> tail)
    {

        for(int i = 0; i<processedList.size();++i)
        {
            Train t = processedList.get(i);

            for(int j=0;j<platformList.size();j++){
                Platform p= platformList.get(j);
                if(p.getId()==t.getPlatformId())
                {
                    p.setNextFree(t.getDepartureTime());
                    p.setF(1);
                    break;
                }
            }
        }

        for(int i = 0;i<head.size();++i)
        {
            Train t = head.get(i);
            for(int j=0;j<platformList.size();j++){
                Platform p= platformList.get(j);
                if(p.getId()==t.getPlatformId())
                {
                    p.setNextFree(t.getDepartureTime());
                    p.setF(1);
                    break;
                }
            }
        }

        for(int i = 1;i<tail.size();++i)
        {
            Train t = tail.get(i);
            for(int j=0;j<platformList.size();j++)
            {
                Platform p = platformList.get(j);
                if(p.getId()==t.getPlatformId()&&p.getF()==0)
                {
                    p.setNextFree(LocalTime.of(0,0));
                    break;
                }
            }
            t.setPlatformId(0);
        }

        for(Platform p: platformList)
        {
            p.setF(0);
        }

        for(int i = 0;i<tail.size();++i)
        {
            Train train = tail.get(i);

            for(int j = 0; j <platformList.size(); j++){
                if(!platformList.get(j).getNextFree().isAfter(train.getArrivalTime())){
                    train.setPlatformId(platformList.get(j).getId());
                    platformList.get(j).setNextFree(train.getDepartureTime());
                    break;
                }
            }
        }
    }
        public static void delreset(List<Train> head, List<Train> tail, Platform plat)
        {
            for(int i = 0;i<waitingList.size();++i)
            {
                Train train = waitingList.get(i);
                if(train.getPlatformId()==plat.getId())
                {
                    train.setPlatformId(0);
                }
            }

            for(int i = 0; i<processedList.size();++i)
            {
                Train t = processedList.get(i);

                for(Platform p : platformList)
                {
                    if(p.getId()==t.getPlatformId()&&plat.getId()!=p.getId())
                    {
                        p.setNextFree(t.getDepartureTime());
                        p.setF(1);
                        break;
                    }
                }
            }

            for(int i = 0;i<head.size();++i)
            {
                Train t = head.get(i);

                for(Platform p : platformList)
                {
                    if(p.getId()==t.getPlatformId())
                    {
                        p.setNextFree(t.getDepartureTime());
                        p.setF(1);
                        break;
                    }
                }
            }

            for(int i = 1;i<tail.size();++i)
            {
                Train t = tail.get(i);

                for(Platform p : platformList)
                {
                    if(p.getId()==t.getPlatformId()&&p.getF()==0)
                    {
                        p.setNextFree(LocalTime.of(0,0));
                        t.setPlatformId(0);
                        break;
                    }
                }
            }

            for(Platform p: platformList)
            {
                p.setF(0);
            }

            for(int i = 0;i<tail.size();++i)
            {
                Train train = tail.get(i);

                for(int j = 0; j <platformList.size(); j++){
                    if(!platformList.get(j).getNextFree().isAfter(train.getArrivalTime())){
                        train.setPlatformId(platformList.get(j).getId());
                        platformList.get(j).setNextFree(train.getDepartureTime());
                        break;
                    }
                }

            }

        }
    public static void delresettrain(List<Train> head, List<Train> tail, int plat_id)
    {
        for(int i = 0; i<processedList.size();++i)
        {
            Train t = processedList.get(i);

            for(Platform p : platformList){

                if (p.getId() == t.getPlatformId()) {

                    p.setNextFree(t.getDepartureTime());
                    p.setF(1);

                    break;
                }
            }
        }
        for(int i = 0;i<head.size();++i)
        {
            Train t = head.get(i);

            for(Platform p : platformList)
            {
                if(p.getId()==t.getPlatformId())
                {
                    p.setNextFree(t.getDepartureTime());
                    p.setF(1);
                    break;
                }
            }
        }

        for (Platform p : platformList)
        {
            if(p.getId()==plat_id && p.getF()==0)
            {
                p.setNextFree(LocalTime.of(0,0));
                break;
            }
        }

        for(int i = 0;i<tail.size();++i)
        {
            Train t = tail.get(i);

            for (Platform p : platformList)
            {
                if(p.getId()==t.getPlatformId()&&p.getF()==0)
                {
                    p.setNextFree(LocalTime.of(0,0));
                    t.setPlatformId(0);
                    break;
                }
            }
        }
        for(Platform p: platformList)
        {
            p.setF(0);
        }
        for(int i = 0;i<tail.size();++i)
        {
            Train train = tail.get(i);

            for(int j = 0; j <platformList.size(); j++){
                if(!platformList.get(j).getNextFree().isAfter(train.getArrivalTime())){
                    train.setPlatformId(platformList.get(j).getId());
                    platformList.get(j).setNextFree(train.getDepartureTime());
                    break;
                }
            }
        }

    }
    public static int MinPlatform(LocalTime[] arr, LocalTime[] dep) {
            if (arr.length == 0 || dep.length == 0)
                return 0;
            Arrays.sort(arr, Comparator.naturalOrder());
            Arrays.sort(dep, Comparator.naturalOrder());
            int platforms = 1, result = 1, i = 1, j = 0;
            while (i < arr.length && j < dep.length) {
                if (arr[i].isBefore(dep[j])) {
                    platforms++;
                    i++;
                } else {
                    platforms--;
                    j++;
                }
                result = Math.max(result, platforms);
            }
            return result;
        }
    }


