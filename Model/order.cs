using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class order
    {
        public int id { get; set; }
        public string orderNo { get; set; }
        public int payType { get; set; }
        public string workNo { get; set; }
        public int userId { get; set; }
        public string contact { get; set; }
        public string tel { get; set; }
        public DateTime addOn { get; set; }
        public DateTime sureOn { get; set; }
        public Double price { get; set; }
        public Double subPrice { get; set; }
        public Double allPrice { get; set; }
        public DateTime payOn { get; set; }
        public int isPay { get; set; }
        public int state { get; set; }
        public string memo { get; set; }
        public int isCall { get; set; }
        public string CallInfo { get; set; }
        public int sourceId { get; set; }
        public int serviceId { get; set; }
        public int oType { get; set; }
        public int isFinance { get; set; }
        public DateTime financeOn { get; set; }
        public int isEvaluate { get; set; }
        public DateTime getDate { get; set; }
        public int bid { get; set; }
        public int beauid { get; set; }
        public int aid { get; set; }
    }
}
