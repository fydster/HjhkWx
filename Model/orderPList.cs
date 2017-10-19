using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class orderPList
    {
        public int id { get; set; }
        public string orderNo { get; set; }
        public int pid { get; set; }
        public int pnum { get; set; }
        public string pName { get; set; }
        public Double price { get; set; }
        public DateTime addOn { get; set; }
        public int enable { get; set; }
    }
}
