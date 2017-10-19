using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class wxPayRefund
    {
        public int id { get; set; }
        public string appid { get; set; }
        public string mch_id { get; set; }
        public string nonce_str { get; set; }
        public string sign { get; set; }
        public string transaction_id { get; set; }
        public string out_trade_no { get; set; }
        public string out_refund_no { get; set; }
        public int total_fee { get; set; }
        public int refund_fee { get; set; }
        public int enable { get; set; }
        public string errMsg { get; set; }
        public DateTime addOn { get; set; }
        public string orderNo { get; set; }
        public DateTime refundOn { get; set; }
    }
}
