var arrayImages = [
    {
        hotel_id: "1",
        image: ["1.jpg","2.jpg","3.jpg"],
        price: "21334 d",
        address: "the so 1",
        phone:"123123123"
    },
    {
        hotel_id: "2",
        image: ["2.jpg"],
        price: "21334 d",
        address: "the so 2",
        phone:"123123123"
    },
    {
        hotel_id: "3",
        image: ["3.jpg"],
        price: "21334 d",
        address: "the so 3",
        phone:"123123123"
    },
    {
        hotel_id: "4",
        image: ["4.jpg"],
        price: "21334 d",
        address: "the so 4",
        phone:"123123123"
    },
    {
        hotel_id: "5",
        image: ["5.jpg"],
        price: "21334 d",
        address: "the so 5",
        phone:"123123123"
    },
    {
        hotel_id: "6",
        image: ["6.jpg"],
        price: "21334 d",
        address: "the so 6",
        phone:"123123123"
    }
]

module.exports = {
    getHotel: function (id) {
        for (i = 0; i < arrayImages.length; i++) {
            if (arrayImages[i].hotel_id == id) {
                return arrayImages[i];
                
            }
        }
        return -1;
        
        
    }
}