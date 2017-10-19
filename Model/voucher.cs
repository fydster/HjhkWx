using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model
{
    public class voucher
    {
        public int id { get; set; }
        public int uid { get; set; }
        public string voucherNo { get; set; }
        public int voucherFee { get; set; }
        public DateTime addOn { get; set; }
        public DateTime endOn { get; set; }
        public int enable { get; set; }
        public DateTime useOn { get; set; }
        public Double useFee { get; set; }
        public string orderNo { get; set; }
        public int srcUid { get; set; }
        public string voucherTitle { get; set; }
        public int voucherType { get; set; }
        public string cardId { get; set; }
        public int pId { get; set; }
    }
}
