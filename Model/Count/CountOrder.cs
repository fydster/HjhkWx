using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model
{
    public class CountOrder
    {
        public int id { get; set; }
        public int uId { get; set; }
        public int srcUid { get; set; }
        public string source { get; set; }
        public int orderType { get; set; }
        public DateTime addOn { get; set; }
        public string orderNo { get; set; }
        public int state { get; set; }
        public int ticketCount { get; set; }
        public Double price { get; set; }
        public string contact { get; set; }
        public string mobile { get; set; }
        public DateTime ticketOn { get; set; }
        public int isRefund { get; set; }
    }
}
