using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Train
{
    public class trainOrderinfo
    {
        public int id { get; set; }
        public string orderNo { get; set; }
        public string outOrderNo { get; set; }
        public int uId { get; set; }
        public string contact { get; set; }
        public string mobile { get; set; }
        public string accountNo { get; set; }
        public string accountPwd { get; set; }
        public int ticketModel { get; set; }
        public DateTime addOn { get; set; }
        public int state { get; set; }
        public int fareNum { get; set; }
        public Double ticketPrice { get; set; }
        public Double insurePrice { get; set; }
        public Double totalPrice { get; set; }
        public int payType { get; set; }
        public int isPay { get; set; }
        public DateTime payOn { get; set; }
        public DateTime ticketOn { get; set; }
        public DateTime refundOn { get; set; }
        public int isRefund { get; set; }

        public List<trainTrip> trip { get; set; }
        public List<trainFare> fare { get; set; }
        public List<trainLog> log { get; set; }
    }
}
