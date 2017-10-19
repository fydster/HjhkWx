using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class Finance
    {
        public int id { get; set; }
        public string orderNo { get; set; }
        public int payType { get; set; }
        public int userId { get; set; }
        public DateTime addOn { get; set; }
        public Double price { get; set; }
        public Double subPrice { get; set; }
        public Double allPrice { get; set; }
        public Double balance { get; set; }
        public Double wxCardFee { get; set; }
        public DateTime payOn { get; set; }
        public int state { get; set; }
        public Double cbPrice { get; set; }
        public int isPay { get; set; }
        public string userName { get; set; }
    }
}
