using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Train
{
    public class trainTrip
    {
        public int id { get; set; }
        public string queryKey { get; set; }
        public string orderNo { get; set; }
        public string trainNo { get; set; }
        public string fromStation { get; set; }
        public string fromCity { get; set; }
        public string toStation { get; set; }
        public string toCity { get; set; }
        public string seatClass { get; set; }
        public string seatName { get; set; }
        public Double ticketPrice { get; set; }
        public int enable { get; set; }
        public DateTime tDate { get; set; }
        public string sTime { get; set; }
        public string tTime { get; set; }

    }
}
