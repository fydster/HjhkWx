using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Travel.Order
{
    public class travelOrder
    {
        public int id { get; set; }
        public string orderNo { get; set; }
        public int orderId { get; set; }
        public int uId { get; set; }
        public string contact { get; set; }
        public string mobile { get; set; }
        public DateTime addOn { get; set; }
        public int state { get; set; }
        public int fareNum { get; set; }
        public string scenicId { get; set; }
        public int productId { get; set; }
        public Double ticketPrice { get; set; }
        public Double totalPrice { get; set; }
        public Double refundPrice { get; set; }
        public int isPay { get; set; }
        public DateTime payOn { get; set; }
        public DateTime ticketOn { get; set; }
        public DateTime refundOn { get; set; }
        
    }
}
