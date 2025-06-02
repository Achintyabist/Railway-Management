package Backend;
import javax.swing.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.time.LocalTime;
import application.*;

public class TextFields implements ActionListener{

    JFrame frame = new JFrame();
    JButton platButton=new JButton("Add plat");
    JButton printButton=new JButton("Print");
    JButton deleteTrain=new JButton("Delete train");
    JButton deletePlat=new JButton("Delete Plat");
    JButton button = new JButton("Add");
    JTextField t1 = new JTextField("Id");
    JTextField t2 = new JTextField("name");
    JTextField t3 = new JTextField("arrival");
    JTextField t4 = new JTextField("departure");
    static LocalTime simulatedTime = LocalTime.of(6, 0);

    TextFields(){
        button.setBounds(17,250,100,25);
        platButton.setBounds(17,275,100,25);
        printButton.setBounds(17,300,100,25);
        deleteTrain.setBounds(17,325,100,25);
        deletePlat.setBounds(17,350,100,25);
        button.addActionListener(this);
        printButton.addActionListener(this);
        platButton.addActionListener(this);
        deletePlat.addActionListener(this);
        deleteTrain.addActionListener(this);
        t1.setBounds(20,20,100,30);
        t2.setBounds(20,70,100,30);
        t3.setBounds(20,120,100,30);
        t4.setBounds(20,170,100,30);
        frame.setLayout(null);
        frame.setSize(500,500);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.add(button);
        frame.add(platButton);
        frame.add(printButton);
        frame.add(deletePlat);
        frame.add(deleteTrain);
        frame.setVisible(true);
        frame.add(t1);
        frame.add(t2);
        frame.add(t3);
        frame.add(t4);
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if(e.getSource()==button){
            String id=t1.getText();

            String name=t2.getText();

            String arrival=t3.getText();

            String depart=t4.getText();
            Allocation.allocate(new Train(Integer.parseInt(id),name,arrival,depart,"black"));
        }
        if(e.getSource()==platButton){
            int id=Integer.parseInt(t1.getText());

            String name =t2.getText();
            Allocation.addPlatform(new Platform(id,name));
        }
        if(e.getSource()==printButton){
            for (Train train : Models.waitingList) {
//                if(simulatedTime.equals(train.getArrivalTime()))
//                    System.out.println(train.getName() + " arrived"+" Platform:" + train.getPlatformId());
//                if(simulatedTime.equals(train.getDepartureTime()))
//                    System.out.println(train.getName() + " departed");
                System.out.println("Name: "+ train.getName());
                System.out.println("pid: "+ train.getPlatformId());
                System.out.println("Arrival: "+ train.getArrivalTime());
                System.out.println("deaprt: "+ train.getDepartureTime());
                System.out.println("Min platforms"+ Models.MAX);
                System.out.println();
            }

            for (Platform platform : Models.platformList) {
//                if(simulatedTime.equals(train.getArrivalTime()))
//                    System.out.println(train.getName() + " arrived"+" Platform:" + train.getPlatformId());
//                if(simulatedTime.equals(train.getDepartureTime()))
//                    System.out.println(train.getName() + " departed");
                System.out.println("Name: "+ platform.getPlatformName());
                System.out.println("nf: "+ platform.getNextFree());
                System.out.println();
            }
        }

        if(e.getSource()==deleteTrain){
            int id=Integer.parseInt(t1.getText());
            Train train = null;
            for(Train trains : Models.waitingList){
                if(id==trains.getId())
                    train=trains;
            }
            Delete.deleteTrain(train);
        }
        if(e.getSource()==deletePlat){
            int id=Integer.parseInt(t1.getText());
            Platform platform=null;
            for(Platform p1 : Models.platformList){
                if(id==p1.getId())
                    platform=p1;
            }
            if(!(platform==null))
                Delete.deletePlatform(platform);
            else
                System.out.println("Platform not present");
        }
    }


    public static void main(String[] args) throws InterruptedException {
        new TextFields();
         // Start at 05:00
        int SIMULATION_SPEED_MS = 1000;

        System.out.println("Starting Railway Time Simulation...\n");

        while (simulatedTime.isBefore(LocalTime.of(12, 30))) { // Simulate till 7:00 AM
            System.out.println("Current Time: " + simulatedTime);
            for (int i=0;i<Models.waitingList.size();i++) {
                Train train =Models.waitingList.get(i);
                if(simulatedTime.equals(train.getArrivalTime())){
                    if(train.getPlatformId()==0)
                    {
                        System.out.println("No platform has been allocared removing it ");
                        System.out.println();
                        Models.waitingList.remove(train);
                        continue;
                    }
                    System.out.println(train.getName() + " arrived"+" Platform:" + train.getPlatformId());
                    Models.processedList.add(train);
                    Models.waitingList.remove(train);
                    i--;
                }
            }
            for(int i=0;i<Models.processedList.size();i++){
                Train train =Models.processedList.get(i);
                if(simulatedTime.equals(train.getDepartureTime())){
                    System.out.println(train.getName() + " Departed"+" Platform:" + train.getPlatformId());
                    Models.processedList.remove(train);
                    i--;
                }
            }


            Thread.sleep(SIMULATION_SPEED_MS);
            simulatedTime = simulatedTime.plusMinutes(1);
        }

        System.out.println("\nSimulation complete.");
    }
}