using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model.Basic
{
    public class Remind
    {
        public int id { get; set; }
        public int uid { get; set; }
        public string sCode { get; set; }
        public string tCode { get; set; }
        public string sCity { get; set; }
        public string tCity { get; set; }
        public DateTime sDate { get; set; }
        public DateTime eDate { get; set; }
        public int lPrice { get; set; }
        public int discount { get; set; }
        public DateTime addOn { get; set; }
        public int enable { get; set; }
        public int sNum { get; set; }
        public int days { get; set; }
        public DateTime lastOn { get; set; }
    }
}
