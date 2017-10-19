using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Travel.Order
{
    public class travelLog
    {
        public int id { get; set; }
        public string orderNo { get; set; }
        public int uId { get; set; }
        public string content { get; set; }
        public int lType { get; set; }
        public DateTime addOn { get; set; }
    }
}
