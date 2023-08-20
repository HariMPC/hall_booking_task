const express = require("express");
const dotenv = require("dotenv");
 
const app = express();

app.use(express.json());

dotenv.config();

const rooms =[
    {
        id: 0,
        roomNo: "1",
        noOfHeadPerRoom: "50",
        pricePerHr: 1050,
        bookingStatus: false,
        customerDetails: {
          name: "",
          date: "",
          startTime: "",
          endTime: ""},
    },
    {
        id: 1,
        roomNo: "2",
        noOfHeadPerRoom: "150",
        pricePerHr: 2000,
        bookedStatus: true,
        customerDetails: {
          name: "Hari Sudhan",
          date: "25/03/2023",
          startTime: "1000",
          endTime: "1800"},
    },
    {
        id: 2,
        roomNo: "3",
        noOfHeadPerRoom: "500",
        pricePerHr: 2500,
        bookedStatus: false,
        customerDetails: {
          name: "",
          date: "",
          startTime: "",
          endTime: ""},
    }
]

app.get("/", (req, res) => {
    res.send("Rooms to Book ");
  });
// CREATING NEW ROOM 
app.post("/room/create",(req,res) =>{
    const newroom = req.body;
    rooms.push(newroom);
    res.send(newroom);
});

// BOOKING A ROOM 
app.post("/rooms", (req, res) => {
    const booking = req.body;
  
    const roomToUpdate = rooms.find(room => room.roomID === booking.roomID);
  
    if (!roomToUpdate) {
      res.status(404).send("Room not found");
      return;
    }
  
    const bookingDate = new Date(booking.date);
    const isRoomAlreadyBooked = rooms.some(room => {
      if (
        room.bookedStatus &&
        room.customerDetails.date === bookingDate.Date&&
        room.customerDetails.startTime <= booking.endTime &&
        room.customerDetails.endTime >= booking.startTime
      ) {
        return true;
      }
      return false;
    });
  
    if (isRoomAlreadyBooked) {
      res.send("Room already booked for that date and time");
      return;
    }
  
    roomToUpdate.customerDetails.customerName = booking.customerName;
    roomToUpdate.customerDetails.date = bookingDate.date;
    roomToUpdate.customerDetails.startTime = booking.startTime;
    roomToUpdate.customerDetails.endTime = booking.endTime;
    roomToUpdate.bookedStatus = true;
  
    res.send("Room booked successfully");
  });
  

app.get("/rooms",(req,res)=>{
    res.send(
        rooms.map(room=>({
            "Room No" : room.roomNo,
            "Booked Status" : room.bookedStatus ? "booked" : "vacant",
            "Customer name" : room.customerDetails.name,
            "Date" : room.customerDetails.date,
            "Starting Time" : room.customerDetails.startTime,
            "Vacating Time" : room.customerDetails.endTime
        }))
    );
});

// BOOKED ROOM CUSTOMER DETAILS
app.get("/customers",(req,res)=>{
    res.send(
        rooms.filter(room =>room.bookedStatus)
        .map(room=>({
            "Room No" : room.roomNo,
            "Customer name" : room.customerDetails.name,
            "Date" : room.customerDetails.date,
            "Starting Time" : room.customerDetails.startTime,
            "Vacating Time" : room.customerDetails.endTime
        }))
    );
});

app.listen(3000, () => console.log("Server is Runing"));