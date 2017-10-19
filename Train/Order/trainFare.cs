using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Train
{
    public class trainFare
    {
        public int id { get; set; }
        public string orderNo { get; set; }
        public string passengerName { get; set; }
        public string idCard { get; set; }
        public int idType { get; set; }
        public int passengerType { get; set; }
        public DateTime birthday { get; set; }
        public int insureCount { get; set; }
        public int insurePrice { get; set; }
        public string insurNo { get; set; }
        public int sex { get; set; }
        public DateTime addOn { get; set; }
        public int state { get; set; }
        public string passengerId { get; set; }
        public string seatNo { get; set; }
        public Double price { get; set; }
        public string pTicketNo { get; set; }
        public Double refundPrice { get; set; }
        public Double refundInsure { get; set; }
        public DateTime refundOn { get; set; }
    }
}
