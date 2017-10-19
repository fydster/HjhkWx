using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class wxPay
    {
        public int id { get; set; }
        public string orderNo { get; set; }
        public Double price { get; set; }
        public int state { get; set; }
        public string payServiceId { get; set; }
        public DateTime payOn { get; set; }
        public string returnMsg { get; set; }
        public int enable { get; set; }
        public string out_trade_no { get; set; }
        public string transaction_id { get; set; }
        public Double total_fee { get; set; }
        public string extNo { get; set; }
    }
}
